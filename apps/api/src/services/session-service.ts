import {
  CreateSessionRequest,
  SessionSnapshot,
  SessionState,
  TurnRequest,
  TurnResult,
} from "@lit-pi/what-if-contracts";
import { getScenarioConfig } from "@lit-pi/what-if-scenarios";
import { applyTurn, createInitialSessionState } from "@lit-pi/what-if-runtime";
import { LLMAdjudicationProvider, NullLLMProvider } from "@lit-pi/what-if-llm";
import {
  InMemorySessionRepository,
  StoredSession,
} from "../repositories/in-memory-session-repository.js";

export class SessionService {
  constructor(
    private repository: InMemorySessionRepository,
    private llmProvider: LLMAdjudicationProvider = new NullLLMProvider()
  ) {}

  async createSession(req: CreateSessionRequest): Promise<SessionState> {
    const scenario = getScenarioConfig(req.scenarioId);
    const initialState = createInitialSessionState(scenario);
    await this.repository.saveSession(initialState);
    return initialState;
  }

  async getSession(sessionId: string): Promise<StoredSession | null> {
    return this.repository.getSession(sessionId);
  }

  async getSessionSnapshot(
    sessionId: string
  ): Promise<SessionSnapshot | null> {
    const stored = await this.repository.getSession(sessionId);
    if (!stored) return null;
    return {
      sessionId: stored.state.sessionId,
      scenarioId: stored.state.scenarioId,
      scenarioVersion: stored.state.scenarioVersion,
      currentSceneId: stored.state.currentSceneId,
      stats: stored.state.stats,
      flags: stored.state.flags,
      status: stored.state.status,
      turnCount: stored.turns.length,
      endingKey: stored.state.endingKey,
    };
  }

  async getSessionDetails(
    sessionId: string
  ): Promise<{ sessionSnapshot: SessionSnapshot; turns: TurnResult[] } | null> {
    const stored = await this.repository.getSession(sessionId);
    if (!stored) return null;
    const sessionSnapshot: SessionSnapshot = {
      sessionId: stored.state.sessionId,
      scenarioId: stored.state.scenarioId,
      scenarioVersion: stored.state.scenarioVersion,
      currentSceneId: stored.state.currentSceneId,
      stats: stored.state.stats,
      flags: stored.state.flags,
      status: stored.state.status,
      turnCount: stored.turns.length,
      endingKey: stored.state.endingKey,
    };
    return { sessionSnapshot, turns: stored.turns };
  }

  async executeTurn(
    sessionId: string,
    request: TurnRequest
  ): Promise<{ turnResult: TurnResult; sessionState: SessionState }> {
    const stored = await this.repository.getSession(sessionId);
    if (!stored) {
      const err = new Error(`Session '${sessionId}' not found.`);
      (err as any).statusCode = 404;
      (err as any).code = "SESSION_NOT_FOUND";
      throw err;
    }

    if (stored.state.status === "ended") {
      const err = new Error("当前会话已经结束。");
      (err as any).statusCode = 409;
      (err as any).code = "SESSION_ENDED";
      throw err;
    }

    // Idempotency check on clientTurnId
    const cachedTurn = stored.processedClientTurnIds[request.clientTurnId];
    if (cachedTurn) {
      return {
        turnResult: cachedTurn,
        sessionState: stored.state,
      };
    }

    const scenario = getScenarioConfig(stored.state.scenarioId);

    // Only request LLM candidate for free_text actions
    let llmCandidate = null;
    if (request.actionType === "free_text") {
      llmCandidate = await this.llmProvider.requestCandidate({
        scenarioId: scenario.id,
        sceneId: stored.state.currentSceneId,
        sceneTitle: scenario.scenes[stored.state.currentSceneId]?.title || "",
        mishapDescription:
          scenario.scenes[stored.state.currentSceneId]?.mishap || "",
        focusCharacters:
          scenario.scenes[stored.state.currentSceneId]?.focusCharacters || [],
        playerActionText: request.freeText || "",
        stats: stored.state.stats,
        flags: stored.state.flags,
      });
    }

    const { nextSessionState, turnResult } = applyTurn(
      scenario,
      stored.state,
      request,
      llmCandidate
    );

    // Update turnCount on turnResult for tracking
    turnResult.turnIndex = stored.turns.length + 1;

    await this.repository.recordTurn(
      sessionId,
      request.clientTurnId,
      turnResult,
      nextSessionState
    );

    return { turnResult, sessionState: nextSessionState };
  }
}
