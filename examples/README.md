# TRACE Protocol — Examples

This folder contains runnable demos for both **JavaScript** (TypeScript SDK) and **Python** SDKs.  
Each example walks through the full TRACE lifecycle: **Action → Policy → Evidence**.

---

## 🧩 Prerequisites

Run the reference server locally:

```bash
cd server
npm i && npm run dev
# → http://localhost:8787
````

---

## 📘 JavaScript / TypeScript SDK

Location: [`examples/*.mjs`](../examples)

### 1️⃣ `sendEmail.mjs`

A minimal example that:

* proposes an action (`send_email`)
* simulates approval if required
* submits evidence after execution

```bash
npm -C sdk/packages/client i && npm -C sdk/packages/client run build
node examples/sendEmail.mjs
```

### 2️⃣ `sendEmail-withAction.mjs`

Same flow using the higher-level `withAction` helper.

```bash
node examples/sendEmail-withAction.mjs
```

#### Shared helper

Both scripts import a fake mailer from [`lib/mailer.mjs`](./lib/mailer.mjs):

```js
export async function sendEmail({ to, subject, body }) {
  await new Promise(r => setTimeout(r, 200));
  return { id: "msg_" + Math.random().toString(36).slice(2, 8), to, subject };
}
```

---

## 🐍 Python SDK

Location: [`examples/python`](./python)

### 1️⃣ `send_email.py`

Low-level control:

```bash
pip install -e ./sdk/python
python examples/python/send_email.py
```

### 2️⃣ `send_email_with_action.py`

Uses the `with_action` helper for a concise one-liner flow:

```bash
python examples/python/send_email_with_action.py
```

---

## ⚙️ Optional: Local Policy

To enforce human-in-the-loop behavior, create a `.trace/policy.yaml` in your repo root:

```yaml
rules:
  - when: { actionType: "send_email" }
    require: ["reviewer_approval"]
    mode: enforce
```

Then rerun any example — it will require approval via:

```bash
curl -X POST http://localhost:8787/approve/<actionId>
```

---

## ✅ Expected output

All examples should log a complete loop:

```
Decision: requires_approval ['reviewer_approval']
Approved: a_demo
Evidence submitted (success).
Done.
```

---

## 🧠 Tips

* Works on Node ≥ 18 and Python ≥ 3.9
* To test failure paths, uncomment the `raise` or `throw` lines in the fake mailer.
* Logs are persisted under `.trace/logs/*.jsonl`.

---

**TRACE Protocol — Trusted Record of Autonomous Computational Events**