// server/src/index.ts
import Fastify from "fastify";
import routes from "./routes.js";
import { makeStorage } from "./storage/index.js";

const app = Fastify({ logger: true });

(async () => {
  // attach storage driver (file | postgres | s3)
  (app as any).storage = makeStorage(app);

  // register all routes
  await app.register(routes as any, {});

  const port = Number(process.env.PORT ?? 8787);
  const host = process.env.HOST ?? "0.0.0.0";

  await app.listen({ port, host });
  app.log.info(`TRACE local server running on http://${host}:${port}`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
