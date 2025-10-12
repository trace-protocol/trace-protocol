import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = path.join(process.cwd(), ".trace", "logs");
const ACTIONS = path.join(ROOT, "actions.jsonl");
const EVIDENCE = path.join(ROOT, "evidence.jsonl");

function ensureDir() {
  fs.mkdirSync(ROOT, { recursive: true });
}

function sha256(s: string) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

let lastActionHash = "";
let lastEvidenceHash = "";

export function appendAction(record: any) {
  ensureDir();
  const payload = { kind: "action", ...record };
  const line = JSON.stringify(payload);
  const hash = sha256(line + lastActionHash);
  fs.appendFileSync(
    ACTIONS,
    JSON.stringify({ ...payload, hash, prev_hash: lastActionHash }) + "\n"
  );
  lastActionHash = hash;
}

export function appendEvidence(record: any) {
  ensureDir();
  const payload = { kind: "evidence", ...record };
  const line = JSON.stringify(payload);
  const hash = sha256(line + lastEvidenceHash);
  fs.appendFileSync(
    EVIDENCE,
    JSON.stringify({ ...payload, hash, prev_hash: lastEvidenceHash }) + "\n"
  );
  lastEvidenceHash = hash;
}
