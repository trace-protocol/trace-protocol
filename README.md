# TRACE Protocol (v0.1)

**TRACE — Trusted Record of Autonomous Computational Events**

A minimal, open protocol to standardize how autonomous systems **propose actions**, how organizations **declare policy**, and how agents/humans **submit evidence**.

Core primitives: **Action → Policy → Evidence**

- **Protocol:** OpenAPI + JSON Schemas  
- **Reference server:** `trace-local` (logging-only by default; optional human approval)  
- **Official SDK:** `@trace/client` (TypeScript)

---

## Why TRACE?
As AI agents begin to *act* (send emails, open PRs, publish docs), organizations need a shared standard to **observe**, **govern**, and **prove** what happened.  
TRACE is to autonomous actions what **Git** is to code history and **HTTP** is to web requests.

---

## Concepts (short)

**Action** — what an agent attempted to do.
```json
{
  "id": "a_xxx",
  "type": "send_email",
  "actor": { "kind": "agent", "provider": "openai", "name": "mail-bot" },
  "target": "mailto:client@acme.com",
  "params": { "subject": "Proposal" },
  "timestamp": "2025-10-10T12:34:56Z"
}
