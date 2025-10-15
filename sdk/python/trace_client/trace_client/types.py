from __future__ import annotations
from dataclasses import dataclass
from typing import Any, Dict, List, Literal, Optional, TypedDict


@dataclass
class Actor:
    kind: Literal["agent", "human", "system"]
    name: str
    provider: Optional[str] = None


class Action(TypedDict, total=False):
    id: str
    type: str
    actor: Actor
    target: Optional[str]
    params: Optional[Dict[str, Any]]
    timestamp: str


class Check(TypedDict, total=False):
    name: str
    pass_: bool  # internal name to avoid Python reserved word
    approver: Optional[str]
    note: Optional[str]

    # mapping helpers
    @staticmethod
    def from_public(name: str, passed: bool, approver: Optional[str] = None, note: Optional[str] = None) -> "Check":
        return {"name": name, "pass_": passed, "approver": approver, "note": note}


# public wire format uses "pass" — encode/decode handled in client
class Evidence(TypedDict, total=False):
    actionId: str
    checks: List[Dict[str, Any]]  # pass mapped to "pass"
    timestamp: Optional[str]


class Decision(TypedDict, total=False):
    actionId: str
    status: Literal["approved", "rejected", "requires_approval", "observed"]
    checks: Optional[List[str]]


class PolicyRuleWhen(TypedDict, total=False):
    actionType: Optional[str]


class PolicyRule(TypedDict, total=False):
    when: Optional[PolicyRuleWhen]
    require: Optional[List[str]]
    mode: Optional[Literal["enforce", "observe"]]


class Policy(TypedDict, total=False):
    rules: List[PolicyRule]
