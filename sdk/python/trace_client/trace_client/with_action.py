from __future__ import annotations
from typing import Any, Callable, Awaitable, Dict, List, Optional
import asyncio


async def with_action(
    *,
    trace,
    type: str,
    actor: Dict[str, Any],
    target: Optional[str] = None,
    params: Optional[Dict[str, Any]] = None,
    on_approval: Optional[Callable[[Dict[str, Any]], Awaitable[None]]] = None,
    run: Callable[[], Awaitable[Any]],
    evidence_on_success: Callable[[Any], List[Dict[str, Any]]],
    evidence_on_error: Callable[[Exception], List[Dict[str, Any]]],
) -> Any:
    decision = trace.propose(type=type, actor=actor, target=target, params=params)

    if decision.get("status") == "rejected":
        raise RuntimeError(f"TRACE decision rejected for {decision.get('actionId')}")

    if decision.get("status") == "requires_approval" and on_approval:
        await on_approval({"actionId": decision["actionId"]})

    try:
        result = await run()
        checks = evidence_on_success(result)
        if not checks:
            raise RuntimeError("evidence_on_success must return at least one check")
        trace.evidence(decision["actionId"], checks)
        return result
    except Exception as err:  # noqa: BLE001
        checks = evidence_on_error(err) if evidence_on_error else []
        if checks:
            try:
                trace.evidence(decision["actionId"], checks)
            except Exception:
                pass
        raise
