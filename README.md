
````md
# TRACE Protocol (v0.1)

**TRACE — Trusted Record of Autonomous Computational Events**

An open standard that brings **auditability and governance** to autonomous systems through a unified **Action → Policy → Evidence** model.

- **Schemas:** JSON Schema + OpenAPI
- **Reference server:** `trace-local` (observer by default; optional human approval)
- **SDKs:** TypeScript (alpha) · Python (alpha)

---

## Why TRACE
As agents start to *act* (send emails, open PRs, publish docs), teams need a shared way to **record intent**, **apply policy**, and **prove outcomes**. TRACE standardizes that loop so any agent can operate under verifiable guardrails.

---

## Core Concepts

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
````

**Policy** — rules that must hold (observe or enforce).

```yaml
rules:
  - when: { actionType: "send_email" }
    require: ["reviewer_approval"]
    mode: enforce   # or: observe
```

**Evidence** — proof that checks passed (human or automated).

```json
{
  "actionId": "a_xxx",
  "checks": [{ "name": "reviewer_approval", "pass": true, "approver": "@fernando" }],
  "timestamp": "2025-10-10T12:40:00Z"
}
```

---

## Quickstart (local dev)

### 1) Run the reference server

```bash
cd server
npm i && npm run dev  # http://localhost:8787
```

### 2a) Call the API (curl)

```bash
# propose action
curl -s http://localhost:8787/actions -H "content-type: application/json" -d '{
  "id":"a_demo","type":"send_email",
  "actor":{"kind":"agent","name":"mail-bot","provider":"openai"},
  "target":"mailto:client@acme.com","params":{"subject":"Hi"},
  "timestamp":"2025-10-10T12:34:56Z"
}'

# (optional) simulate human approval
curl -X POST http://localhost:8787/approve/a_demo

# submit evidence
curl -s http://localhost:8787/evidence -H "content-type: application/json" -d '{
  "actionId":"a_demo",
  "checks":[{"name":"reviewer_approval","pass":true,"approver":"@admin"}]
}'
```

### 2b) TypeScript SDK (alpha)

```bash
cd sdk/packages/client
npm i && npm run build
# see examples/sendEmail.ts for a runnable demo
```

### 2c) Python SDK (alpha)

```bash
cd sdk/python/trace_client
pip install -e .
# see examples/send_email.py for a runnable demo
```

> To enforce human-in-the-loop, create `.trace/policy.yaml` in repo root (see Policy example).

---

## API Endpoints (v0.1)

* `POST /actions` — register an Action; returns a Decision
* `POST /evidence` — attach Evidence to an Action
* `GET  /policy` — fetch compiled Policy (optionally by `actionType`)
* `GET  /health` — ping

See `openapi.yaml` for the full spec.

---

## Roadmap

* **v0.1** — Observer mode + Human approval (HiTL)
* **v0.2** — Checkers API (`tests_pass`, `size<=N`, `tone_check`)
* **v0.3** — Signatures & hash-chain evidence ledger

---

## License

Apache-2.0 (see `LICENSE`)

---

## Community

Discussions · RFCs · Integrations — links coming with the public launch.

```
