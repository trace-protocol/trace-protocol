
# TRACE Protocol (v0.1)

**TRACE — Trusted Record of Autonomous Computational Events**

An open standard that brings **auditability and governance** to autonomous systems through a unified **Action → Policy → Evidence** model.

- **Schemas:** JSON Schema + OpenAPI  
- **Reference server:** `trace-local` (observer by default; optional human approval)  
- **SDKs:** TypeScript (alpha) · Python (alpha)

---

## 💡 Why TRACE

As agents start to *act* (send emails, open PRs, publish docs), teams need a shared way to **record intent**, **apply policy**, and **prove outcomes**.  
TRACE standardizes that loop so any agent can operate under verifiable guardrails.

---

## 🔧 Core Concepts

### **Action** — what an agent attempted to do
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

### **Policy** — rules that must hold (observe or enforce)

```yaml
rules:
  - when: { actionType: "send_email" }
    require: ["reviewer_approval"]
    mode: enforce   # or: observe
```

### **Evidence** — proof that checks passed (human or automated)

```json
{
  "actionId": "a_xxx",
  "checks": [
    { "name": "reviewer_approval", "pass": true, "approver": "@fernando" }
  ],
  "timestamp": "2025-10-10T12:40:00Z"
}
```

---

## ⚙️ Quickstart (Local Dev)

### 1️⃣ Run the reference server

```bash
cd server
npm i && npm run dev
# → http://localhost:8787
```

---

### 2️⃣ Call the API directly (curl)

```bash
# propose an action
curl -s http://localhost:8787/actions \
  -H "content-type: application/json" \
  -d '{
    "id": "a_demo",
    "type": "send_email",
    "actor": { "kind": "agent", "name": "mail-bot", "provider": "openai" },
    "target": "mailto:client@acme.com",
    "params": { "subject": "Hi" },
    "timestamp": "2025-10-10T12:34:56Z"
  }'

# (optional) simulate human approval
curl -X POST http://localhost:8787/approve/a_demo

# attach evidence
curl -s http://localhost:8787/evidence \
  -H "content-type: application/json" \
  -d '{
    "actionId": "a_demo",
    "checks": [{ "name": "reviewer_approval", "pass": true, "approver": "@admin" }]
  }'
```

---

### 3️⃣ Use an SDK

#### 🟦 TypeScript

```bash
cd sdk/packages/client
npm i && npm run build
# see examples/sendEmail.mjs for a runnable demo
```

#### 🐍 Python

```bash
cd sdk/python
pip install -e .
# see README.md for Quickstart + with_action helper
```

> 💡 To enforce human-in-the-loop, create `.trace/policy.yaml` in the repo root (see Policy example above).

---

## 🧭 API Endpoints (v0.1)

| Method | Path        | Description                                               |
| ------ | ----------- | --------------------------------------------------------- |
| `POST` | `/actions`  | Register an Action; returns a Decision                    |
| `POST` | `/evidence` | Attach Evidence to an Action                              |
| `GET`  | `/policy`   | Fetch compiled Policy (optionally filter by `actionType`) |
| `GET`  | `/health`   | Server ping                                               |

See [`openapi.yaml`](./openapi.yaml) for the full spec.

---

## 🗺️ Roadmap

| Version   | Focus     | Key Additions                                                 |
| --------- | --------- | ------------------------------------------------------------- |
| **v0.1**  | Core loop | Observer mode + Human approval (HiTL)                         |
| **v0.2**  | Checkers  | Built-in policy tests (`tests_pass`, `size<=N`, `tone_check`) |
| **v0.3**  | Ledger    | Signatures & hash-chain evidence ledger                       |
| **v0.4+** | Ecosystem | Governance, registry, dashboards, hosted TRACE Cloud          |

---

## 📜 License

Apache-2.0 — see [LICENSE](./LICENSE)

---

## 🌍 Community

Discussions · RFCs · Integrations — opening soon with public launch.

---

### SDKs

* **TypeScript**: [`sdk/packages/client`](./sdk/packages/client) — build with `npm -C sdk/packages/client run build`
* **Python**: [`sdk/python`](./sdk/python) — includes Quickstart and the high-level `with_action` helper