from __future__ import annotations
from typing import Any, Dict, List
from dataclasses import is_dataclass, asdict
import time
import uuid

def now_iso() -> str:
    # ISO 8601 with 'Z'
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

def uid() -> str:
    return "a_" + uuid.uuid4().hex[:8]

def to_jsonable(obj: Any) -> Any:
    """Convert dataclasses and nested structures to JSON-serializable types."""
    if is_dataclass(obj):
        return asdict(obj)
    if isinstance(obj, dict):
        return {k: to_jsonable(v) for k, v in obj.items()}
    if isinstance(obj, (list, tuple)):
        return [to_jsonable(v) for v in obj]
    return obj

def normalize_checks(checks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Map pass_ -> pass and JSONify each check."""
    out: List[Dict[str, Any]] = []
    for c in checks:
        c = to_jsonable(c)
        if "pass_" in c and "pass" not in c:
            c["pass"] = c.pop("pass_")
        out.append(c)
    return out
