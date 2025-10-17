import asyncio
from trace_client import TraceClient, Actor, with_action
import requests

trace = TraceClient(endpoint="http://localhost:8787")

def send_email(to: str, subject: str, body: str):
    # simulate a send and return metadata
    return {"id": "msg_demo_123", "to": to, "subject": subject}

async def on_approval(action_data):
    # Dev helper route; in prod you'd wait for Slack, etc.
    requests.post(f"http://localhost:8787/approve/{action_data['actionId']}")
    print("Approved:", action_data['actionId'])

async def run_email():
    return send_email("sarah@acme.com", "Pricing", "Hi!")

def evidence_on_success(result):
    return [{"name": "email_sent", "pass": True, "note": f"msgId={result['id']}"}]

def evidence_on_error(err):
    return [{"name": "email_failed", "pass": False, "note": str(err)}]

async def main():
    # Use the with_action helper for a concise one-liner flow
    await with_action(
        trace=trace,
        type="send_email",
        actor=Actor(kind="agent", name="mail-bot", provider="openai"),
        target="mailto:sarah@acme.com",
        params={"subject": "Pricing", "body": "Hi!"},
        on_approval=on_approval,
        run=run_email,
        evidence_on_success=evidence_on_success,
        evidence_on_error=evidence_on_error
    )
    print("Done.")

if __name__ == "__main__":
    asyncio.run(main())
