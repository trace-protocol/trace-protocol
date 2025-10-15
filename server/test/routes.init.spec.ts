import { describe, it, expect, beforeAll, afterAll } from "vitest";
import Fastify from "fastify";
import routes from "../src/routes.js";
import fs from "node:fs";
import path from "node:path";

const LOG = path.join(process.cwd(), ".trace/logs/actions.jsonl");

describe("routes", () => {
  const app = Fastify();
  beforeAll(async () => {
    (app as any).storage = {                       // stub file storage
      appendAction: async (r: any) => {
        fs.mkdirSync(path.dirname(LOG), { recursive: true });
        fs.appendFileSync(LOG, JSON.stringify(r) + "\n");
      },
      appendEvidence: async (_: any) => {}
    };
    await app.register(routes as any, {});
    await app.listen({ port: 0 });
  });
  afterAll(async () => { await app.close(); });

  it("POST /actions returns decision and writes log line", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/actions",
      payload: { id: "a_test", type: "send_email", actor: { kind: "agent", name: "bot" }, timestamp: new Date().toISOString() }
    });
    expect(res.statusCode).toBe(200);
    const { actionId, status } = res.json();
    expect(actionId).toBe("a_test");
    expect(["recorded","allowed","requires_approval"]).toContain(status);
    const lines = fs.readFileSync(LOG, "utf8").trim().split("\n");
    expect(lines[lines.length-1]).toContain('"id":"a_test"');
  });
});
