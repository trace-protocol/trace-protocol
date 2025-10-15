import type { Action, Evidence, Decision, Policy } from "./types.js";

export class TraceAPI {
  private endpoint: string;

  constructor(endpoint?: string) {
    this.endpoint = (endpoint ?? "http://localhost:8787").replace(/\/$/, "");
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const url = `${this.endpoint}${path}`;
    const res = await fetch(url, {
      headers: { "content-type": "application/json" },
      ...options,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`TRACE API error ${res.status}: ${text}`);
    }
    return (await res.json()) as T;
  }

  async createAction(action: Action): Promise<Decision & { actionId: string }> {
    return this.request("/actions", {
      method: "POST",
      body: JSON.stringify(action),
    });
  }

  async submitEvidence(ev: Evidence): Promise<{ verified: boolean }> {
    return this.request("/evidence", {
      method: "POST",
      body: JSON.stringify(ev),
    });
  }

  async getPolicy(actionType?: string): Promise<Policy> {
    const path = actionType
      ? `/policy?actionType=${encodeURIComponent(actionType)}`
      : "/policy";
    return this.request<Policy>(path);
  }
}
