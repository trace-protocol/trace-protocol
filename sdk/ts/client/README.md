# @trace-protocol/client

[![npm version](https://img.shields.io/npm/v/@trace-protocol/client.svg)](https://www.npmjs.com/package/@trace-protocol/client)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)

**TypeScript SDK for TRACE Protocol**

Open, vendor-neutral SDK for the TRACE Protocol's **Action → Policy → Evidence** loop.

- 📦 **Package**: `@trace-protocol/client`
- 🔌 **Protocol**: HTTP/JSON (`/actions`, `/evidence`, `/policy`)
- 🧪 **Minimal & testable**: ESM-first, no heavy dependencies
- 🧱 **License**: Apache-2.0

---

## Install

```bash
npm i @trace-protocol/client
# or
pnpm add @trace-protocol/client
# or
yarn add @trace-protocol/client
```

> **Reference server** (for local development):
>
> ```bash
> cd server
> npm i && npm run dev    # → http://localhost:8787
> ```

---

## Quickstart

```ts
import { TraceClient } from "@trace-protocol/client";

const trace = new TraceClient({ endpoint: "http://localhost:8787" });

const decision = await trace.propose({
  type: "send_email",
  actor: { kind: "agent", name: "mail-bot", provider: "openai" },
  target: "mailto:sarah@acme.com",
  params: { subject: "Pricing", body: "Hi!" },
});

if (decision.status === "requires_approval") {
  // dev shortcut: simulate approval on the reference server
  await fetch(`http://localhost:8787/approve/${decision.actionId}`, { method: "POST" });
}

await trace.evidence(decision.actionId, [
  { name: "email_sent", pass: true, note: "msgId=123" },
]);
```

---

## High-level helper (`withAction`)

A convenience wrapper that does: **propose → (optional approval) → run → evidence**.

```ts
import { TraceClient, withAction } from "@trace-protocol/client";

const trace = new TraceClient({ endpoint: "http://localhost:8787" });

await withAction({
  trace,
  type: "send_email",
  actor: { kind: "agent", name: "mail-bot" },
  target: "mailto:sarah@acme.com",
  params: { subject: "Pricing", body: "Hi!" },

  onApproval: async ({ actionId }) => {
    // dev shortcut — in prod: Slack, ticketing, etc.
    await fetch(`http://localhost:8787/approve/${actionId}`, { method: "POST" });
  },

  run: async () => {
    // perform the side effect (send email, open PR, etc.)
    return { id: "msg_123" };
  },

  evidence: {
    onSuccess: (res) => [{ name: "email_sent", pass: true, note: `id=${res.id}` }],
    onError:  (err) => [{ name: "email_failed", pass: false, note: String(err) }],
  },
});
```

---

## API

### `new TraceClient(opts?: { endpoint?: string })`

* `endpoint` defaults to `http://localhost:8787`.

### `propose(input) → Promise<Decision & { actionId: string }>`

Registers an **Action** and returns a **Decision**.

```ts
await trace.propose({
  type: "open_pr",
  actor: { kind: "agent", name: "repo-bot" },
  target: "github://org/repo#branch",
  params: { title: "feat: add X" },
});
```

**Decision**

```ts
type Decision = {
  actionId: string;
  status: "approved" | "rejected" | "requires_approval" | "observed";
  checks?: string[]; // names required before approval
}
```

### `evidence(actionId, checks) → Promise<{ verified: boolean }>`

Attach **Evidence** checks to an action.

```ts
await trace.evidence("a_123", [
  { name: "reviewer_approval", pass: true, approver: "@admin" }
]);
```

### `policy(actionType?: string) → Promise<Policy>`

Fetch compiled policy (server may filter by `actionType`).

---

## Types

```ts
export interface Actor {
  kind: "agent" | "human" | "system";
  name: string;
  provider?: string;
}

export interface Action {
  id: string;
  type: string;
  actor: Actor;
  target?: string;
  params?: Record<string, unknown>;
  timestamp: string;
}

export interface Check {
  name: string;
  pass: boolean;
  approver?: string;
  note?: string;
}

export interface Evidence {
  actionId: string;
  checks: Check[];
  timestamp?: string;
}

export interface Decision {
  actionId: string;
  status: "approved" | "rejected" | "requires_approval" | "observed";
  checks?: string[];
}

export interface PolicyRule {
  when?: { actionType?: string };
  require?: string[];
  mode?: "enforce" | "observe";
}

export interface Policy {
  rules: PolicyRule[];
}
```

---

## Examples

Working examples are available in the main repository:

- `examples/sendEmail.mjs` - Low-level API usage
- `examples/sendEmail-withAction.mjs` - High-level `withAction` helper
- `examples/lib/mailer.mjs` - Shared utilities

**Run the examples:**

```bash
# Build the SDK (if using local development)
cd sdk/ts/client && npm install && npm run build

# Start the reference server
cd ../../server && npm install && npm run dev

# Run examples (from repository root)
node examples/sendEmail.mjs
node examples/sendEmail-withAction.mjs
```

---

## Testing

This package uses **Vitest**.

```bash
npm -C sdk/ts/client i
npm -C sdk/ts/client run test
```

> We keep TS build config separate from test config to avoid rootDir warnings.
> If your editor shows stale type errors, **restart TS server**.

---

## Build & Publish

```bash
# build
npm -C sdk/ts/client run build

# preview tarball
npm -C sdk/ts/client pack --dry-run

# publish
npm -C sdk/ts/client publish --access public
```

---

## Versioning

* **v0.1**: observer mode + optional human-in-the-loop; Python parity
* Roadmap: Checkers API (programmatic checks), signatures & hash-chain evidence

---

## License

Apache-2.0 © TRACE Protocol — Stewards of the TRACE Protocol
