import { FastifyInstance } from "fastify";
import { DB, type Action, type Evidence } from "./db.js";
import { loadPolicy, decide } from "./policy.js";

export default async function routes(app: FastifyInstance) {
  app.get("/health", async () => ({ ok: true }));

  app.get("/policy", async () => {
    const policy = loadPolicy();
    return policy;
  });

  app.post<{ Body: Action }>("/actions", async (req) => {
    const action = req.body;
    DB.actions.set(action.id, action);
    const policy = loadPolicy();
    const decision = decide(policy, action.type);
    return { actionId: action.id, ...decision };
  });

  app.post<{ Body: Evidence }>("/evidence", async (req) => {
    const ev = req.body;
    const list = DB.evidence.get(ev.actionId) ?? [];
    list.push({ ...ev, timestamp: new Date().toISOString() });
    DB.evidence.set(ev.actionId, list);
    return { verified: true };
  });

  // Dev-only helper: simulate human approval for an action
  app.post("/approve/:actionId", async (req, reply) => {
    const { actionId } = req.params as { actionId: string };
    const exists = DB.actions.get(actionId);
    if (!exists) return reply.code(404).send({ error: "not_found" });

    const list = DB.evidence.get(actionId) ?? [];
    list.push({
      actionId,
      checks: [{ name: "reviewer_approval", pass: true, approver: "@admin" }],
      timestamp: new Date().toISOString(),
    });
    DB.evidence.set(actionId, list);

    return { ok: true };
  });
}
