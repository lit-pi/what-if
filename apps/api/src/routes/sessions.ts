import { FastifyInstance } from "fastify";
import {
  CreateSessionRequestSchema,
  TurnRequestSchema,
} from "@lit-pi/what-if-contracts";
import { SessionService } from "../services/session-service.js";

export function registerSessionRoutes(
  fastify: FastifyInstance,
  sessionService: SessionService
) {
  // GET /health
  fastify.get("/health", async () => {
    return { status: "ok", timestamp: Date.now() };
  });

  // POST /api/v1/sessions
  fastify.post("/api/v1/sessions", async (request, reply) => {
    const parseResult = CreateSessionRequestSchema.safeParse(request.body ?? {});
    if (!parseResult.success) {
      reply.status(400);
      return {
        error: {
          code: "INVALID_REQUEST",
          message: parseResult.error.message,
        },
      };
    }
    try {
      const sessionState = await sessionService.createSession(parseResult.data);
      reply.status(201);
      return { sessionState };
    } catch (err: any) {
      reply.status(400);
      return {
        error: {
          code: "CREATE_SESSION_FAILED",
          message: err.message,
        },
      };
    }
  });

  // GET /api/v1/sessions/:sessionId
  fastify.get<{ Params: { sessionId: string } }>(
    "/api/v1/sessions/:sessionId",
    async (request, reply) => {
      const { sessionId } = request.params;
      const details = await sessionService.getSessionDetails(sessionId);
      if (!details) {
        reply.status(404);
        return {
          error: {
            code: "SESSION_NOT_FOUND",
            message: `会话 '${sessionId}' 不存在。`,
          },
        };
      }
      return details;
    }
  );

  // POST /api/v1/sessions/:sessionId/turns
  fastify.post<{ Params: { sessionId: string } }>(
    "/api/v1/sessions/:sessionId/turns",
    async (request, reply) => {
      const { sessionId } = request.params;
      const parseResult = TurnRequestSchema.safeParse(request.body);
      if (!parseResult.success) {
        reply.status(400);
        return {
          error: {
            code: "INVALID_TURN_REQUEST",
            message: parseResult.error.issues.map((i) => i.message).join("; "),
          },
        };
      }

      try {
        const result = await sessionService.executeTurn(
          sessionId,
          parseResult.data
        );
        return result;
      } catch (err: any) {
        const status = err.statusCode || 500;
        const code = err.code || "INTERNAL_ERROR";
        reply.status(status);
        return {
          error: {
            code,
            message: err.message,
          },
        };
      }
    }
  );
}
