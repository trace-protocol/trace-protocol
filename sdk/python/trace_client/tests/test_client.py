import responses
from trace_client import TraceClient, Actor


@responses.activate
def test_propose_and_evidence_success():
    # mock /actions
    responses.add(
        responses.POST,
        "http://localhost:8787/actions",
        json={"actionId": "a_1", "status": "approved"},
        status=200,
        content_type="application/json",
    )
    # mock /evidence
    responses.add(
        responses.POST,
        "http://localhost:8787/evidence",
        json={"verified": True},
        status=200,
        content_type="application/json",
    )

    tc = TraceClient()
    decision = tc.propose(
        type="send_email",
        actor=Actor(kind="agent", name="bot"),
        target="mailto:user@example.com",
        params={"subject": "Hi"},
    )
    assert decision["status"] == "approved"
    res = tc.evidence(decision["actionId"], [{"name": "email_sent", "pass": True}])
    assert res["verified"] is True


@responses.activate
def test_policy_filter():
    responses.add(
        responses.GET,
        "http://localhost:8787/policy?actionType=send_email",
        json={"rules": [{"when": {"actionType": "send_email"}, "require": ["reviewer_approval"], "mode": "enforce"}]},
        status=200,
        content_type="application/json",
    )
    tc = TraceClient()
    pol = tc.policy("send_email")
    assert isinstance(pol, dict)
    assert len(pol.get("rules", [])) == 1
