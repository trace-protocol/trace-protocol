export type Action = {
  id: string;
  type: string;
  actor: { kind: string; name: string; provider?: string };
  target?: string;
  params?: Record<string, unknown>;
  timestamp: string;
};

export type Evidence = {
  actionId: string;
  checks: { name: string; pass: boolean; approver?: string; note?: string }[];
  timestamp?: string;
};

export const DB = {
  actions: new Map<string, Action>(),
  evidence: new Map<string, Evidence[]>(),
};
