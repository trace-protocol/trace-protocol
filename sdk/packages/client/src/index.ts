import { TraceAPI } from "./api.js";
import type { Actor, Action, Evidence } from "./types.js";
import { uid, nowIso } from "./utils.js";

export class TraceClient {
  private api: TraceAPI;
  constructor(cfg?: { endpoint?: string }) {
    this.api = new TraceAPI(cfg?.endpoint);
  }
  async propose(input: { type: string; actor: Actor; target?: string; params?: Record<string, unknown> }) {
    const action: Action = { id: uid(), timestamp: nowIso(), ...input };
    return this.api.createAction(action);
  }
  async evidence(actionId: string, checks: Evidence["checks"]) {
    return this.api.submitEvidence({ actionId, checks });
  }
  async policy(actionType?: string) {
    return this.api.getPolicy(actionType);
  }
}
export type { Actor } from "./types.js";
