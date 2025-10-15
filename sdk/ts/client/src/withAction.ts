import type { Actor, TraceLike } from "./types.js";

type Check =
  | { name: string; pass: true; note?: string; approver?: string }
  | { name: string; pass: false; note?: string };

export async function withAction<T>(opts: {
  trace: TraceLike;
  type: string;
  actor: Actor;
  target?: string;
  params?: Record<string, unknown>;
  onApproval?: (decision: { actionId: string; checks?: string[] }) => Promise<void> | void;
  evidence?: {
    onSuccess?: (result: T) => Check[];
    onError?: (err: unknown) => Check[];
  };
  run: () => Promise<T>;
}): Promise<T> {
  const { trace, type, actor, target, params, onApproval, evidence, run } = opts;
  const decision = await trace.propose({ type, actor, target, params });

  if (decision.status === "requires_approval" && onApproval) {
    await onApproval({ actionId: decision.actionId, checks: decision.checks });
  }

  try {
    const result = await run();
    const checks = evidence?.onSuccess
      ? evidence.onSuccess(result)
      : [{ name: "action_executed", pass: true as const }];
    await trace.evidence(decision.actionId, checks);
    return result;
  } catch (err) {
    const checks = evidence?.onError
      ? evidence.onError(err)
      : [{ name: "action_failed", pass: false as const, note: String((err as Error)?.message ?? err) }];
    await trace.evidence(decision.actionId, checks);
    throw err;
  }
}
