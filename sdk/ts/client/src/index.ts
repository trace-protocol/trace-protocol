import { TraceAPI } from "./api.js";
import type { Actor, Action, Evidence, Decision, TraceLike, Policy } from "./types.js";
import { nowIso, uid } from "./utils.js";

/** Minimal TRACE client */
export class TraceClient implements TraceLike {
  private api: TraceAPI;

  constructor(cfg?: { endpoint?: string }) {
    this.api = new TraceAPI(cfg?.endpoint);
  }

  async propose(input: {
    type: string;
    actor: Actor;
    target?: string;
    params?: Record<string, unknown>;
    id?: string;
    timestamp?: string;
  }): Promise<Decision & { actionId: string }> {
    const action: Action = {
      id: input.id ?? uid(),
      timestamp: input.timestamp ?? nowIso(),
      type: input.type,
      actor: input.actor,
      target: input.target,
      params: input.params,
    };
    return this.api.createAction(action);
  }

  async evidence(
    actionId: string,
    checks: Evidence["checks"]
  ): Promise<{ verified: boolean }> {
    const e: Evidence = { actionId, checks };
    return this.api.submitEvidence(e);
  }

  async policy(actionType?: string): Promise<Policy> {
    const p = await this.api.getPolicy(actionType);
    if (actionType && Array.isArray(p?.rules)) {
      const filtered = p.rules.filter(r => r?.when?.actionType === actionType);
      // if server didn’t filter, ensure we return only the target rules
      return { rules: filtered.length ? filtered : p.rules };
    }
    return p;
  }
}

// Re-exports
export type {
  Actor,
  Action,
  Evidence,
  Decision,
  TraceLike,
  Check,
} from "./types.js";
export { withAction } from "./withAction.js";
