import { describe, expect, it } from "vitest";
import { TurnRequestSchema, CreateSessionRequestSchema } from "../src/index.js";

describe("Contracts Schema Validation", () => {
  it("validates CreateSessionRequest default value", () => {
    const parsed = CreateSessionRequestSchema.parse({});
    expect(parsed.scenarioId).toBe("undercover-demon-king");
  });

  it("validates preset TurnRequest correctly", () => {
    const valid = TurnRequestSchema.parse({
      clientTurnId: "turn-1",
      actionType: "preset",
      presetActionId: "gate_deceive",
    });
    expect(valid.presetActionId).toBe("gate_deceive");

    expect(() =>
      TurnRequestSchema.parse({
        clientTurnId: "turn-1",
        actionType: "preset",
      })
    ).toThrow();
  });

  it("validates free_text TurnRequest correctly", () => {
    const valid = TurnRequestSchema.parse({
      clientTurnId: "turn-2",
      actionType: "free_text",
      freeText: "我向莱昂解释这是光圣教反噬",
    });
    expect(valid.freeText).toContain("光圣教");

    expect(() =>
      TurnRequestSchema.parse({
        clientTurnId: "turn-2",
        actionType: "free_text",
        freeText: "",
      })
    ).toThrow();
  });
});
