from typing import Any, Dict, Optional
import requests
from urllib.parse import urlencode

class TraceAPI:
    def __init__(self, endpoint: Optional[str] = None):
        self._endpoint = (endpoint or "http://localhost:8787").rstrip("/")
        self._session = requests.Session()
        self._headers = {"Content-Type": "application/json"}

    def _url(self, path: str) -> str:
        return f"{self._endpoint}{path}"

    def _request(self, method: str, path: str, json: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        res = self._session.request(method, self._url(path), json=json, headers=self._headers, timeout=30)
        res.raise_for_status()
        return res.json()

    def create_action(self, action: Dict[str, Any]) -> Dict[str, Any]:
        return self._request("POST", "/actions", json=action)

    def submit_evidence(self, ev: Dict[str, Any]) -> Dict[str, Any]:
        return self._request("POST", "/evidence", json=ev)

    def get_policy(self, action_type: Optional[str] = None) -> Dict[str, Any]:
        path = "/policy"
        if action_type:
            qs = urlencode({"actionType": action_type})
            path = f"{path}?{qs}"
        return self._request("GET", path)
