import Fastify from "fastify";
import cors from "@fastify/cors";
import { InMemorySessionRepository } from "./repositories/in-memory-session-repository.js";
import { SessionService } from "./services/session-service.js";
import { registerSessionRoutes } from "./routes/sessions.js";

export function buildServer() {
  const fastify = Fastify({ logger: false });
  fastify.register(cors, { origin: true });

  const repository = new InMemorySessionRepository();
  const sessionService = new SessionService(repository);

  registerSessionRoutes(fastify, sessionService);

  return { fastify, repository, sessionService };
}
