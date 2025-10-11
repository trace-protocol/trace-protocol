// server/src/index.ts
import Fastify from "fastify";
import routes from "./routes.js";

const app = Fastify({ logger: true });

(async () => {
  await app.register(routes);

  const port = Number(process.env.PORT ?? 8787);
  const host = process.env.HOST ?? "0.0.0.0";

  await app.listen({ port, host });
  console.log(`TRACE local server running on http://${host}:${port}`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
