import type { Action, Decision, Evidence } from "./types.js";

class Http {
  constructor(private base = "http://localhost:8787") {}
  async post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(this.base + path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${await res.text()}`);
    return res.json() as Promise<T>;
  }
  async get<T>(path: string): Promise<T> {
    const res = await fetch(this.base + path);
    if (!res.ok) throw new Error(`HTTP ${res.status} ${await res.text()}`);
    return res.json() as Promise<T>;
  }
}

export class TraceAPI {
  private http: Http;
  constructor(endpoint?: string) {
    this.http = new Http(endpoint ?? "http://localhost:8787");
  }
  createAction(a: Action) { return this.http.post<Decision>("/actions", a); }
  submitEvidence(e: Evidence) { return this.http.post<{ verified: boolean }>("/evidence", e); }
  getPolicy(actionType?: string) {
    const q = actionType ? `?actionType=${encodeURIComponent(actionType)}` : "";
    return this.http.get(`/policy${q}`);
  }
}
