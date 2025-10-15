// server/src/routes.ts
import type { FastifyInstance } from "fastify";
import { makeDB, type ActionRecord, type EvidenceRecord } from "./db.js";
import { loadPolicy, decide } from "./policy.js";
import { appendAction, appendEvidence } from "./store.js";

export default async function routes(app: FastifyInstance) {
  const db = makeDB(app.log);

  app.get("/health", async () => ({ ok: true }));

  app.get("/policy", async (req, reply) => {
    const policy = loadPolicy();
    return reply.send(policy);
  });

  app.post<{ Body: ActionRecord }>("/actions", async (req, reply) => {
    const action = req.body;

    // Persist (memory + append-only file)
    db.insertAction(action);
    appendAction({ ...action, receivedAt: new Date().toISOString() });

    // Decide based on current policy
    const decision = decide(loadPolicy(), action);

    return reply.send({ actionId: action.id, ...decision });
  });

  app.post<{ Body: EvidenceRecord }>("/evidence", async (req, reply) => {
    const ev = req.body;

    db.insertEvidence({
      ...ev,
      timestamp: ev.timestamp ?? new Date().toISOString(),
    });
    appendEvidence({ ...ev, receivedAt: new Date().toISOString() });

    return reply.send({ verified: true });
  });

  // Dev-only helper: simulate human approval for an action
  app.post("/approve/:actionId", async (req, reply) => {
    const { actionId } = req.params as { actionId: string };
    const action = db.getAction(actionId);
    if (!action) {
      return reply.code(404).send({ error: "not_found", actionId });
    }

    const ev: EvidenceRecord = {
      actionId,
      checks: [{ name: "reviewer_approval", pass: true, approver: "@admin" }],
      timestamp: new Date().toISOString(),
    };

    db.insertEvidence(ev);
    appendEvidence({ ...ev, receivedAt: new Date().toISOString() });

    return reply.send({ ok: true });
  });
}
