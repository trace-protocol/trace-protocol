import { describe, it, createExpect } from "vitest";

const expect = createExpect() as unknown as <T>(actual: T, message?: string) => any;
import { TraceLike, Actor } from "../src/types";
import { withAction } from "../src/withAction";

const fakeTrace = (status: "approved" | "requires_approval"): TraceLike => ({
  async propose() {
    return { actionId: "a_1", status };
  },
  async evidence() {
    return { verified: true };
  },
  async policy() { return { rules: [] }; }
});

const actor: Actor = { kind: "agent", name: "bot" };

describe("withAction", () => {
  it("runs and sends success evidence", async () => {
    const res = await withAction({
      trace: fakeTrace("approved"),
      type: "send_email",
      actor,
      run: async () => ({ id: "ok" }),
      evidence: {
        onSuccess: (r) => [{ name: "email_sent", pass: true, note: `id=${(r as any).id}` }],
        onError: () => [{ name: "email_failed", pass: false }]
      }
    });
    expect((res as any).id).toBe("ok");
  });

  it("waits for approval when required", async () => {
    let waited = false;
    await withAction({
      trace: fakeTrace("requires_approval"),
      type: "send_email",
      actor,
      onApproval: async () => { waited = true; },
      run: async () => ({}),
      evidence: {
        onSuccess: () => [{ name: "email_sent", pass: true }],
        onError: () => [{ name: "email_failed", pass: false }]
      }
    });
    expect(waited).toBe(true);
  });
});
