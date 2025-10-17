# TRACE Protocol

[![Build Status](https://img.shields.io/github/actions/workflow/status/trace-labs/trace-protocol/ci.yml?branch=main)](https://github.com/trace-labs/trace-protocol/actions)
[![npm version](https://img.shields.io/npm/v/@trace-labs/client.svg)](https://www.npmjs.com/package/@trace-labs/client)
[![PyPI version](https://img.shields.io/pypi/v/trace-client.svg)](https://pypi.org/project/trace-client/)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)

**Open standard for trusted records of autonomous computation events**

> A verifiable framework for recording, auditing, and governing autonomous computation.

TRACE Protocol defines a unified model — **Action → Policy → Evidence** — for recording, auditing, and governing autonomous computation. It enables organizations to adopt AI agents without losing traceability, safety, or accountability.

---

## 🎯 What is TRACE Protocol?

TRACE lets you:

- **Propose Actions** — define autonomous intents that require oversight  
- **Enforce Policies** — require approvals, validations, or constraints  
- **Collect Evidence** — log verifiable results and artifacts  
- **Audit Everything** — build a complete accountability trail

---

## 📁 Repository Structure

```
trace-protocol/
├── schema/                      # JSON Schemas for validation
├── server/                      # Reference server implementation (TypeScript)
├── sdk/
│   ├── packages/client/         # TypeScript/JavaScript SDK
│   └── python/trace_client/    # Python SDK
├── examples/                    # Working examples and demos
├── website/                     # Static documentation website
├── openapi.yaml                 # OpenAPI specification
├── vercel.json                  # Deployment config
└── scripts/                     # Build and test scripts
```

---

## 🚀 Quick Start

### 1️⃣ Run the reference server
```bash
cd server
npm install
npm run dev
# → http://localhost:8787
```

### 2️⃣ Try the SDK examples

**TypeScript**
```bash
cd sdk/ts/client
npm install && npm run build
cd ../../..
node examples/sendEmail.mjs
```

**Python**
```bash
pip install -e ./sdk/python
python examples/python/send_email.py
```

**Expected output:**
```
Decision: requires_approval ['reviewer_approval']
Approved: <action-id>
Evidence submitted (success).
Done.
```

---

## 🧩 Core Components

### 📋 Schemas
Define structure for Action, Policy, and Evidence.

### 🖥️ Server
Reference backend implementing REST endpoints and storage backends (File, Postgres, S3).

### 📦 SDKs
- **TypeScript SDK**: `@trace-labs/client`
- **Python SDK**: `trace-client`

Both expose high-level helpers for proposing actions, enforcing policies, and emitting evidence.

### 🧪 Examples
Runnable examples covering the full Action → Policy → Evidence lifecycle.

---

## 📖 Documentation

| Resource | Description |
|----------|-------------|
| [Main site](https://traceprotocol.org/) | Overview and rationale |
| [Manifesto](https://traceprotocol.org/manifesto) | Principles and philosophy |
| [Technical Spec](https://traceprotocol.org/spec.html) | Human-readable specification |
| [OpenAPI](openapi.yaml) | Machine-readable API definition |

---

## 🛠️ Development

### Requirements
- Node.js ≥ 18
- Python ≥ 3.9
- npm / pip

### Tests
```bash
# JS SDK
cd sdk/packages/client && npm test

# Python SDK
cd sdk/python && pytest
```

### Build
```bash
npm -C sdk/packages/client run build
pip install -e ./sdk/python
```

---

## ⚖️ License

- **Code & SDKs**: Apache 2.0
- **Specification**: CC BY 4.0

---

## 🤝 Contributing

Contributions welcome!  
See [CONTRIBUTING.md](CONTRIBUTING.md) for RFC guidelines, bug reporting, and feature proposals.

---

**Build agents that are not only capable — but accountable.**