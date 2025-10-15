from __future__ import annotations
from datetime import datetime, timezone
from typing import Any, Dict, Optional
import uuid

from .api import TraceAPI
from .utils import to_jsonable, normalize_checks
from .types import Actor

class TraceClient:
    def __init__(self, endpoint: Optional[str] = None):
        self.api = TraceAPI(endpoint)

    def _now_iso(self) -> str:
        return datetime.now(tz=timezone.utc).isoformat().replace("+00:00", "Z")

    def propose(
        self,
        *,
        type: str,
        actor: Actor | Dict[str, Any],
        target: Optional[str] = None,
        params: Optional[Dict[str, Any]] = None,
        id: Optional[str] = None,
        timestamp: Optional[str] = None,
    ) -> Dict[str, Any]:
        action: Dict[str, Any] = {
            "id": id or str(uuid.uuid4()),
            "timestamp": timestamp or self._now_iso(),
            "type": type,
            "actor": to_jsonable(actor),      # <<< convert dataclass → dict
        }
        if target:
            action["target"] = target
        if params:
            action["params"] = to_jsonable(params)

        return self.api.create_action(action)  # -> { actionId, status, checks? }

    def evidence(self, action_id: str, checks: Any) -> Dict[str, Any]:
        payload = {
            "actionId": action_id,
            "checks": normalize_checks(list(checks)),  # <<< pass_ → pass
        }
        return self.api.submit_evidence(payload)

    def policy(self, action_type: Optional[str] = None) -> Dict[str, Any]:
        # now delegate the filter to the server (keeps client + tests aligned)
        return self.api.get_policy(action_type)
