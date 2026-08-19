import Fastify from "fastify";
import cors from "@fastify/cors";
import { HttpLLMProvider, NullLLMProvider } from "@lit-pi/what-if-llm";
import { InMemorySessionRepository } from "./repositories/in-memory-session-repository.js";
import { SessionService } from "./services/session-service.js";
import { registerSessionRoutes } from "./routes/sessions.js";

export function buildServer() {
  const fastify = Fastify({ logger: false });
  fastify.register(cors, { origin: true });

  const repository = new InMemorySessionRepository();

  const apiKey = process.env.LLM_API_KEY;
  const llmProvider = apiKey
    ? new HttpLLMProvider({
        apiKey,
        baseUrl: process.env.LLM_BASE_URL,
        model: process.env.LLM_MODEL,
        timeoutMs: Number(process.env.LLM_TIMEOUT_MS || 4000),
      })
    : new NullLLMProvider();

  const sessionService = new SessionService(repository, llmProvider);

  registerSessionRoutes(fastify, sessionService);

  return { fastify, repository, sessionService };
}
