import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

export type CompiledPolicy = {
  rules: { when: Record<string, unknown>; require: string[]; mode: "observe" | "enforce" }[];
};

export function loadPolicy(cwd = process.cwd()): CompiledPolicy {
  const p = path.join(cwd, ".trace", "policy.yaml");
  if (fs.existsSync(p)) {
    const raw = fs.readFileSync(p, "utf8");
    return YAML.parse(raw) as CompiledPolicy;
  }
  // default: observe-only
  return { rules: [] };
}

export function decide(policy: CompiledPolicy, actionType: string) {
  const rule = policy.rules.find((r) => (r.when as any)?.actionType === actionType);
  if (!rule) return { status: "recorded", checks: [] } as const;
  if (rule.mode === "observe") return { status: "allowed", checks: rule.require } as const;
  return { status: "requires_approval", checks: rule.require } as const;
}
