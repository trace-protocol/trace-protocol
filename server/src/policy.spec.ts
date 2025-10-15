import { describe, it, expect } from "vitest";
import { decide, type CompiledPolicy } from "./policy.js";

const policy: CompiledPolicy = {
  rules: [
    { when: { actionType: "send_email" }, mode: "enforce", require: ["reviewer_approval"] },
    { when: { actionType: "create_pr" }, mode: "observe" }
  ]
};

const action = { id: "a1", type: "send_email", actor: { kind: "agent", name: "bot" }, timestamp: new Date().toISOString() };

describe("policy decide()", () => {
  it("requires approval for send_email", () => {
    const decision = decide(policy as any, action);
    expect(decision.status).toBe("requires_approval");
    expect(decision.checks).toEqual(["reviewer_approval"]);
  });

  it("observes create_pr", () => {
    const decision = decide(policy as any, { ...action, type: "create_pr" });
    expect(decision.status).toBe("allowed");
  });

  it("records unmatched actions", () => {
    const decision = decide(policy as any, { ...action, type: "delete_db" });
    expect(decision.status).toBe("recorded");
  });
});
