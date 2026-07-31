import { SessionState, TurnResult } from "@lit-pi/what-if-contracts";

export type StoredSession = {
  id: string;
  state: SessionState;
  turns: TurnResult[];
  processedClientTurnIds: Record<string, TurnResult>;
};

export class InMemorySessionRepository {
  private sessions = new Map<string, StoredSession>();

  async saveSession(state: SessionState): Promise<StoredSession> {
    let stored = this.sessions.get(state.sessionId);
    if (!stored) {
      stored = {
        id: state.sessionId,
        state,
        turns: [],
        processedClientTurnIds: {},
      };
      this.sessions.set(state.sessionId, stored);
    } else {
      stored.state = state;
    }
    return stored;
  }

  async getSession(sessionId: string): Promise<StoredSession | null> {
    return this.sessions.get(sessionId) || null;
  }

  async recordTurn(
    sessionId: string,
    clientTurnId: string,
    turnResult: TurnResult,
    nextState: SessionState
  ): Promise<StoredSession> {
    const stored = this.sessions.get(sessionId);
    if (!stored) {
      throw new Error(`Session '${sessionId}' not found in repository.`);
    }
    stored.state = nextState;
    stored.turns.push(turnResult);
    stored.processedClientTurnIds[clientTurnId] = turnResult;
    return stored;
  }

  async clear(): Promise<void> {
    this.sessions.clear();
  }
}
