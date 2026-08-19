import dotenv from "dotenv";
import path from "path";
import { buildServer } from "./server.js";

// Load .env from root or current directory
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const PORT = parseInt(process.env.PORT || "3000", 10);
const HOST = process.env.HOST || "0.0.0.0";

const { fastify } = buildServer();

async function main() {
  try {
    await fastify.listen({ port: PORT, host: HOST });
    console.log(`[what-if-api] Server running on http://${HOST}:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main();
