
# traceprotocol

[![PyPI version](https://img.shields.io/pypi/v/traceprotocol.svg)](https://pypi.org/project/traceprotocol/)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)

**Python SDK for TRACE Protocol**

Open, vendor-neutral SDK for the TRACE Protocol's **Action → Policy → Evidence** loop.

- 📦 **Package**: `traceprotocol`
- 🔌 **Protocol**: HTTP/JSON (`/actions`, `/evidence`, `/policy`)
- 🧪 **Simple & testable**: requests-based, no heavy dependencies
- 🧱 **License**: Apache-2.0

---

## Install

```bash
pip install traceprotocol
```

> **Reference server** (for local development):
>
> ```bash
> cd server
> npm i && npm run dev    # → http://localhost:8787
> ```

---

## Quickstart

```python
from trace_client import TraceClient, Actor

trace = TraceClient(endpoint="http://localhost:8787")

decision = trace.propose(
    type="send_email",
    actor=Actor(kind="agent", name="mail-bot", provider="openai"),
    target="mailto:sarah@acme.com",
    params={"subject": "Pricing", "body": "Hi!"}
)

print("status:", decision["status"])

# Dev-only: simulate approval on the reference server
if decision["status"] == "requires_approval":
    import requests
    requests.post(f"http://localhost:8787/approve/{decision['actionId']}")
    print("approved:", decision["actionId"])

# Perform the side effect (send email, open PR, etc.) then attach evidence
trace.evidence(decision["actionId"], [
    {"name": "email_sent", "pass": True, "note": "msgId=123"}
])
```

---

## High-level helper (`with_action`)

A convenience wrapper that handles propose → (optional approval) → run → evidence.

```python
import asyncio
from trace_client import TraceClient, Actor, with_action

trace = TraceClient(endpoint="http://localhost:8787")

async def send_email():
    # simulate sending, return metadata used in evidence
    return {"id": "msg_123"}

async def on_approval(info):
    # dev shortcut: simulate human approval on the reference server
    import requests
    requests.post(f"http://localhost:8787/approve/{info['actionId']}")
    print("approved:", info["actionId"])

async def main():
    await with_action(
        trace=trace,
        type="send_email",
        actor=Actor(kind="agent", name="mail-bot"),
        target="mailto:sarah@acme.com",
        params={"subject": "Pricing", "body": "Hi!"},
        on_approval=on_approval,
        run=send_email,
        evidence_on_success=lambda res: [{"name": "email_sent", "pass": True, "note": f"id={res['id']}"}],
        evidence_on_error=lambda err: [{"name": "email_failed", "pass": False, "note": str(err)}],
    )

asyncio.run(main())
```

---

## API

### `TraceClient(endpoint: str | None = None)`

* `endpoint` defaults to `http://localhost:8787` if omitted.

### `propose(*, type, actor, target=None, params=None, id=None, timestamp=None) -> Decision`

Registers an **Action** and returns a **Decision**:

```python
{
  "actionId": "a_123",
  "status": "approved" | "rejected" | "requires_approval" | "observed",
  "checks": ["reviewer_approval"]   # present when gating
}
```

### `evidence(action_id, checks) -> {"verified": True}`

Attach **Evidence** checks to an action:

```python
trace.evidence("a_123", [
  {"name": "reviewer_approval", "pass": True, "approver": "@admin"}
])
```

> Python reserves the keyword `pass`. If you use our `Check` helper (`pass_`), the client will map it to the wire key `pass` automatically.

### `policy(action_type: str | None = None) -> dict`

Fetch compiled policy, optionally filtered by `actionType`:

```python
trace.policy("send_email")  # -> { "rules": [...] }
```

### `with_action(...) -> Any`

Orchestrates the full loop:

* `on_approval(info)` — optional async hook for human/API approval
* `run()` — async function that performs the side effect
* `evidence_on_success(result)` / `evidence_on_error(err)` — map to checks

---

## Examples

Working examples are available in the main repository:

- `examples/python/send_email.py` - Low-level API usage
- `examples/python/send_email_with_action.py` - High-level `with_action` helper

**Run the examples:**

```bash
# Install the package
pip install traceprotocol

# Start the reference server
cd server && npm install && npm run dev

# Run examples (from repository root)
python examples/python/send_email.py
python examples/python/send_email_with_action.py
```

---

## Testing

```bash
python3 -m pip install -r sdk/python/trace_client/requirements-dev.txt
pytest sdk/python/trace_client/tests -q
```

Tests are fully mocked via `responses` (no network).
We cover: propose/evidence happy path, policy fetch/filter, approval flows, error evidence, and API error handling.

---

## Versioning

* **v0.1**: observer mode + optional human-in-the-loop; TS & Python SDK parity
* Roadmap: Checkers API (programmatic checks), signatures & hash-chain evidence

---

## License

Apache-2.0 © TRACE Labs — Stewards of the TRACE Protocol