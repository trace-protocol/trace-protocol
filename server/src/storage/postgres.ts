import pg from "pg";
import crypto from "node:crypto";
import type { Storage } from "./index.js";
const sha256 = (s: string) => crypto.createHash("sha256").update(s).digest("hex");

export class PostgresStorage implements Storage {
  private pool: pg.Pool;
  private actionQ: Promise<string> = Promise.resolve("");
  private evidenceQ: Promise<string> = Promise.resolve("");

  constructor(url: string) {
    this.pool = new pg.Pool({ connectionString: url });
  }

  async appendAction(a: any) {
    this.actionQ = this.actionQ.then(async (prev) => {
      const line = JSON.stringify({ kind: "action", ...a });
      const hash = sha256(line + prev);
      await this.pool.query(
        `insert into actions (id,type,actor,target,params,timestamp,received_at,hash,prev_hash)
         values ($1,$2,$3,$4,$5,$6,now(),$7,$8)
         on conflict (id) do nothing`,
        [a.id, a.type, a.actor, a.target ?? null, a.params ?? {}, a.timestamp, hash, prev]
      );
      return hash;
    });
    await this.actionQ;
  }

  async appendEvidence(e: any) {
    this.evidenceQ = this.evidenceQ.then(async (prev) => {
      const ts = e.timestamp ?? new Date().toISOString();
      const line = JSON.stringify({ kind: "evidence", ...e, timestamp: ts });
      const hash = sha256(line + prev);
      await this.pool.query(
        `insert into evidence (action_id,checks,timestamp,received_at,hash,prev_hash)
         values ($1,$2,$3,now(),$4,$5)`,
        [e.actionId, e.checks, ts, hash, prev]
      );
      return hash;
    });
    await this.evidenceQ;
  }
}
