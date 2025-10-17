# 🚀 TRACE Protocol v0.1.0 Release Announcement

## **Introducing TRACE Protocol: Open Standard for Accountable AI**

We're excited to announce the first public release of **TRACE Protocol** - an open standard for trusted records of autonomous computation events.

### **What is TRACE Protocol?**

TRACE Protocol defines a unified model — **Action → Policy → Evidence** — for recording, auditing, and governing autonomous computation. It enables organizations to adopt AI agents without losing traceability, safety, or accountability.

### **🎯 Key Features**

- **Propose Actions** — Define autonomous intents that require oversight
- **Enforce Policies** — Require approvals, validations, or constraints  
- **Collect Evidence** — Log verifiable results and artifacts
- **Audit Everything** — Build a complete accountability trail

### **📦 Available SDKs**

- **Python SDK**: `pip install traceprotocol` ([PyPI](https://pypi.org/project/traceprotocol/))
- **TypeScript SDK**: `npm install @trace-labs/client` ([npm](https://www.npmjs.com/package/@trace-labs/client))

### **🚀 Quick Start**

```bash
# Install Python SDK
pip install traceprotocol

# Start reference server
cd server && npm install && npm run dev
```

```python
from trace_client import TraceClient, Actor

trace = TraceClient(endpoint="http://localhost:8787")

# Propose an action
decision = trace.propose(
    type="send_email",
    actor=Actor(kind="agent", name="mail-bot"),
    target="mailto:user@example.com",
    params={"subject": "Hello", "body": "World!"}
)

# Submit evidence
trace.evidence(decision["actionId"], [
    {"name": "email_sent", "pass": True, "note": "msgId=123"}
])
```

### **🔗 Resources**

- **Website**: https://traceprotocol.org
- **Repository**: https://github.com/trace-protocol/trace-protocol
- **Documentation**: https://traceprotocol.org/spec.html
- **Examples**: https://github.com/trace-protocol/trace-protocol/tree/main/examples

### **🤝 Contributing**

We welcome contributions! See our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### **📄 License**

- **Code & SDKs**: Apache 2.0
- **Specification**: CC BY 4.0

---

**Build agents that are not only capable — but accountable.** 🌟

#TRACEProtocol #AIGovernance #OpenSource #AccountableAI
