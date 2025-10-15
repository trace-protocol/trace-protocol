import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import type { Storage } from "./index.js";

const ROOT = path.join(process.cwd(), ".trace", "logs");
const ACTIONS = path.join(ROOT, "actions.jsonl");
const EVIDENCE = path.join(ROOT, "evidence.jsonl");
const sha256 = (s: string) => crypto.createHash("sha256").update(s).digest("hex");

export class FileStorage implements Storage {
  private actionQ: Promise<string> = Promise.resolve("");
  private evidenceQ: Promise<string> = Promise.resolve("");

  private async ensure() { await fs.mkdir(ROOT, { recursive: true }); }

  async appendAction(record: any) {
    this.actionQ = this.actionQ.then(async (prev) => {
      await this.ensure();
      const payload = { kind: "action", ...record };
      const line = JSON.stringify(payload);
      const hash = sha256(line + prev);
      await fs.appendFile(ACTIONS, JSON.stringify({ ...payload, hash, prev_hash: prev }) + "\n", "utf8");
      return hash;
    });
    await this.actionQ;
  }

  async appendEvidence(record: any) {
    this.evidenceQ = this.evidenceQ.then(async (prev) => {
      await this.ensure();
      const payload = { kind: "evidence", ...record };
      const line = JSON.stringify(payload);
      const hash = sha256(line + prev);
      await fs.appendFile(EVIDENCE, JSON.stringify({ ...payload, hash, prev_hash: prev }) + "\n", "utf8");
      return hash;
    });
    await this.evidenceQ;
  }
}
