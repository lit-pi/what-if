import { describe, expect, it, beforeEach, vi } from "vitest";
import { buildServer } from "../src/server.js";
import { LLMAdjudicationProvider } from "@lit-pi/what-if-llm";

describe("Fastify API Server Endpoints", () => {
  let app: ReturnType<typeof buildServer>["fastify"];
  let sessionService: ReturnType<typeof buildServer>["sessionService"];

  beforeEach(() => {
    const serverObj = buildServer();
    app = serverObj.fastify;
    sessionService = serverObj.sessionService;
  });

  it("GET /health returns 200 OK", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/health",
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.status).toBe("ok");
  });

  it("POST /api/v1/sessions creates a new session", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/sessions",
      payload: { scenarioId: "undercover-demon-king" },
    });
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.payload);
    expect(body.sessionState.sessionId).toBeDefined();
    expect(body.sessionState.scenarioId).toBe("undercover-demon-king");
    expect(body.sessionState.scenarioVersion).toBe("1.0.0");
    expect(body.sessionState.currentSceneId).toBe("gate");
  });

  it("GET /api/v1/sessions/:sessionId fetches session details as { sessionSnapshot, turns }, hides processedClientTurnIds", async () => {
    const createRes = await app.inject({
      method: "POST",
      url: "/api/v1/sessions",
      payload: {},
    });
    const { sessionState } = JSON.parse(createRes.payload);

    const getRes = await app.inject({
      method: "GET",
      url: `/api/v1/sessions/${sessionState.sessionId}`,
    });
    expect(getRes.statusCode).toBe(200);
    const body = JSON.parse(getRes.payload);
    expect(body.sessionSnapshot).toBeDefined();
    expect(body.sessionSnapshot.sessionId).toBe(sessionState.sessionId);
    expect(body.sessionSnapshot.scenarioVersion).toBe("1.0.0");
    expect(body.turns).toBeDefined();
    expect(Array.isArray(body.turns)).toBe(true);
    expect(body.processedClientTurnIds).toBeUndefined(); // Does NOT expose repository internal

    const missingRes = await app.inject({
      method: "GET",
      url: "/api/v1/sessions/non_existent_id",
    });
    expect(missingRes.statusCode).toBe(404);
    expect(JSON.parse(missingRes.payload).error.code).toBe("SESSION_NOT_FOUND");
  });

  it("POST /api/v1/sessions/:sessionId/turns executes preset turn and supports idempotency", async () => {
    const createRes = await app.inject({
      method: "POST",
      url: "/api/v1/sessions",
      payload: {},
    });
    const { sessionState } = JSON.parse(createRes.payload);
    const sessionId = sessionState.sessionId;

    const turn1Res = await app.inject({
      method: "POST",
      url: `/api/v1/sessions/${sessionId}/turns`,
      payload: {
        clientTurnId: "client-turn-100",
        actionType: "preset",
        presetActionId: "gate_deceive",
      },
    });
    expect(turn1Res.statusCode).toBe(200);
    const body1 = JSON.parse(turn1Res.payload);
    expect(body1.turnResult.nextSceneId).toBe("act2_ruins");
    expect(body1.sessionState.currentSceneId).toBe("act2_ruins");

    // Repeat turn with same clientTurnId
    const turn1RepeatRes = await app.inject({
      method: "POST",
      url: `/api/v1/sessions/${sessionId}/turns`,
      payload: {
        clientTurnId: "client-turn-100",
        actionType: "preset",
        presetActionId: "gate_deceive",
      },
    });
    expect(turn1RepeatRes.statusCode).toBe(200);
    const body1Repeat = JSON.parse(turn1RepeatRes.payload);
    expect(body1Repeat.turnResult.turnId).toBe(body1.turnResult.turnId);
    expect(body1Repeat.sessionState.currentSceneId).toBe("act2_ruins");
  });

  it("only invokes LLM provider for free_text actions and skips provider for preset actions", async () => {
    const mockProvider: LLMAdjudicationProvider = {
      requestCandidate: vi.fn().mockResolvedValue(null),
    };
    (sessionService as any).llmProvider = mockProvider;

    const createRes = await app.inject({
      method: "POST",
      url: "/api/v1/sessions",
      payload: {},
    });
    const { sessionState } = JSON.parse(createRes.payload);

    // 1. Preset action
    await app.inject({
      method: "POST",
      url: `/api/v1/sessions/${sessionState.sessionId}/turns`,
      payload: {
        clientTurnId: "ct-preset",
        actionType: "preset",
        presetActionId: "gate_deceive",
      },
    });
    expect(mockProvider.requestCandidate).not.toHaveBeenCalled();

    // 2. Free text action
    await app.inject({
      method: "POST",
      url: `/api/v1/sessions/${sessionState.sessionId}/turns`,
      payload: {
        clientTurnId: "ct-freetext",
        actionType: "free_text",
        freeText: "自由尝试狡辩",
      },
    });
    expect(mockProvider.requestCandidate).toHaveBeenCalledTimes(1);
  });

  it("returns 409 when submitting turn to an ended session", async () => {
    const createRes = await app.inject({
      method: "POST",
      url: "/api/v1/sessions",
      payload: {},
    });
    const { sessionState } = JSON.parse(createRes.payload);
    const sessionId = sessionState.sessionId;

    // Trigger instant exposure ending
    const turnRes = await app.inject({
      method: "POST",
      url: `/api/v1/sessions/${sessionId}/turns`,
      payload: {
        clientTurnId: "ct-confess",
        actionType: "preset",
        presetActionId: "gate_confess",
      },
    });
    expect(turnRes.statusCode).toBe(200);
    const body = JSON.parse(turnRes.payload);
    expect(body.sessionState.status).toBe("ended");

    // Try posting another turn
    const extraRes = await app.inject({
      method: "POST",
      url: `/api/v1/sessions/${sessionId}/turns`,
      payload: {
        clientTurnId: "ct-extra",
        actionType: "free_text",
        freeText: "Wait let me re-explain!",
      },
    });
    expect(extraRes.statusCode).toBe(409);
    expect(JSON.parse(extraRes.payload).error.code).toBe("SESSION_ENDED");
  });
});
