import {
  CreateSessionRequest,
  SessionState,
  SessionSnapshot,
  TurnRequest,
  TurnResult,
} from "@lit-pi/what-if-contracts";

export type SessionDetailsResponse = {
  sessionSnapshot: SessionSnapshot;
  turns: TurnResult[];
};

export type CreateSessionResponse = {
  sessionState: SessionState;
};

export type ExecuteTurnResponse = {
  turnResult: TurnResult;
  sessionState: SessionState;
};

export async function createSession(
  scenarioId = "undercover-demon-king"
): Promise<CreateSessionResponse> {
  const res = await fetch("/api/v1/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenarioId } satisfies CreateSessionRequest),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.error?.message || `创建会话失败 (HTTP ${res.status})`
    );
  }

  return res.json();
}

export async function getSession(
  sessionId: string
): Promise<SessionDetailsResponse> {
  const res = await fetch(`/api/v1/sessions/${sessionId}`, {
    method: "GET",
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.error?.message || `读取会话失败 (HTTP ${res.status})`
    );
  }

  return res.json();
}

export async function submitTurn(
  sessionId: string,
  request: TurnRequest
): Promise<ExecuteTurnResponse> {
  const res = await fetch(`/api/v1/sessions/${sessionId}/turns`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.error?.message || `提交行动失败 (HTTP ${res.status})`
    );
  }

  return res.json();
}
