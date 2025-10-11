export type Actor =
  | { kind: "human"; name: string; provider?: string }
  | { kind: "agent"; name: string; provider?: string }
  | { kind: "system"; name: string; provider?: string };

export type Action = {
  id: string;
  type: string;
  actor: Actor;
  target?: string;
  params?: Record<string, unknown>;
  timestamp: string; // ISO-8601
};

export type DecisionStatus = "allowed" | "requires_approval" | "recorded";

export type Decision = {
  actionId: string;
  status: DecisionStatus;
  checks?: string[];
};

export type Evidence = {
  actionId: string;
  checks: { name: string; pass: boolean; approver?: string; note?: string }[];
};
