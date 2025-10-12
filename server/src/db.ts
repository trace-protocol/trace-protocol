// server/src/db.ts
import type { FastifyBaseLogger } from "fastify";

export interface ActionRecord {
  id: string;
  type: string;
  actor: Record<string, any>;
  target?: string;
  params?: Record<string, any>;
  timestamp: string;
  status?: string;
}

export interface EvidenceRecord {
  actionId: string;
  checks: { name: string; pass: boolean; approver?: string; note?: string }[];
  timestamp: string;
}

export function makeDB(log: FastifyBaseLogger) {
  const actions = new Map<string, ActionRecord>();
  const evidence = new Map<string, EvidenceRecord[]>();

  return {
    insertAction(action: ActionRecord) {
      actions.set(action.id, action);
      log.info({ action }, "Action inserted");
    },

    getAction(id: string) {
      return actions.get(id);
    },

    insertEvidence(ev: EvidenceRecord) {
      const list = evidence.get(ev.actionId) ?? [];
      list.push(ev);
      evidence.set(ev.actionId, list);
      log.info({ ev }, "Evidence added");
    },

    getEvidence(actionId: string) {
      return evidence.get(actionId) ?? [];
    }
  };
}
