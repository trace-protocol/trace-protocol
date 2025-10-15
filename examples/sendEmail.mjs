import { TraceClient } from "../sdk/packages/client/dist/index.js";
import { sendEmail } from "./lib/mailer.mjs";

const trace = new TraceClient({ endpoint: "http://localhost:8787" });

const decision = await trace.propose({
  type: "send_email",
  actor: { kind: "agent", name: "mail-bot", provider: "openai" },
  target: "mailto:sarah@acme.com",
  params: { subject: "Pricing", body: "Hi!" }
});

console.log("Decision:", decision);

if (decision.status === "requires_approval") {
  await fetch(`http://localhost:8787/approve/${decision.actionId}`, { method: "POST" });
  console.log("Approved:", decision.actionId);
}

try {
  const result = await sendEmail({
    to: "sarah@acme.com",
    subject: "Pricing",
    body: "Hi!"
  });

  await trace.evidence(decision.actionId, [
    { name: "email_sent", pass: true, note: `msgId=${result.id}` }
  ]);
  console.log("Evidence submitted (success).");
} catch (err) {
  await trace.evidence(decision.actionId, [
    { name: "email_failed", pass: false, note: String(err?.message ?? err) }
  ]);
  console.log("Evidence submitted (failure).");
}
