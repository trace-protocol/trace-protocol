// server/src/policy.ts
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

export type Rule = {
  id?: string;
  when: {
    actionType?: string;
    actorKind?: "human" | "agent" | "system";
    actorName?: string;
    provider?: string;
  };
  mode: "observe" | "enforce";
  require?: string[];
  note?: string;
};

export type CompiledPolicy = {
  rules: Rule[];
};

function readYaml(filePath: string): CompiledPolicy | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = YAML.parse(raw) as CompiledPolicy | null;
    if (!parsed || !Array.isArray(parsed.rules)) return { rules: [] };
    return parsed;
  } catch {
    // On parse error, return empty policy (fail-open for v0.1 local dev)
    return { rules: [] };
  }
}

/**
 * Look for a local policy in typical dev locations:
 *  - <cwd>/.trace/policy.yaml                  (e.g., server/.trace when running from server/)
 *  - <cwd>/../.trace/policy.yaml               (repo root .trace when server is the CWD)
 */
export function loadPolicy(cwd = process.cwd()): CompiledPolicy {
  const candidates = [
    path.join(cwd, ".trace", "policy.yaml"),
    path.join(cwd, "..", ".trace", "policy.yaml"),
  ];
  for (const p of candidates) {
    const got = readYaml(p);
    if (got) return got;
  }
  return { rules: [] };
}

function matches(rule: Rule, action: any): boolean {
  const w = rule.when || {};
  if (w.actionType && w.actionType !== action.type) return false;
  if (w.actorKind && w.actorKind !== action.actor?.kind) return false;
  if (w.actorName && w.actorName !== action.actor?.name) return false;
  if (w.provider && w.provider !== action.actor?.provider) return false;
  return true;
}

/**
 * Basic decision engine (v0.1):
 *  - no matching rule        → recorded
 *  - mode: observe           → allowed (with checks listed if any)
 *  - mode: enforce           → requires_approval (checks listed; human or automated handled later)
 */
export function decide(policy: CompiledPolicy, action: any) {
  const rule = policy.rules.find((r) => matches(r, action));
  if (!rule) return { status: "recorded" as const, checks: [] as string[] };

  const checks = rule.require ?? [];
  if (rule.mode === "observe") {
    return { status: "allowed" as const, checks };
  }
  // enforce → caller may gather evidence or trigger approval flow
  return { status: "requires_approval" as const, checks };
}
