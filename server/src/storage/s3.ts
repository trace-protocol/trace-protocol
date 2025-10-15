import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "node:crypto";
import type { Storage } from "./index.js";
const sha256 = (s: string) => crypto.createHash("sha256").update(s).digest("hex");

type Cfg = {
  bucket: string;
  region: string;
  endpoint?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  prefix?: string;
};

export class S3Storage implements Storage {
  private s3: S3Client;
  private bucket: string;
  private prefix: string;
  private actionPrev = "";
  private evidencePrev = "";

  constructor(cfg: Cfg) {
    this.bucket = cfg.bucket;
    this.prefix = cfg.prefix || "trace/";
    this.s3 = new S3Client({
      region: cfg.region,
      endpoint: cfg.endpoint,
      forcePathStyle: !!cfg.endpoint, // for MinIO
      credentials: cfg.accessKeyId && cfg.secretAccessKey ? {
        accessKeyId: cfg.accessKeyId,
        secretAccessKey: cfg.secretAccessKey
      } : undefined
    });
  }

  private async put(key: string, body: string) {
    await this.s3.send(new PutObjectCommand({ Bucket: this.bucket, Key: key, Body: body }));
  }

  async appendAction(a: any) {
    const payload = { kind: "action", ...a };
    const line = JSON.stringify(payload);
    const hash = sha256(line + this.actionPrev);
    const rec = JSON.stringify({ ...payload, hash, prev_hash: this.actionPrev }) + "\n";
    const key = `${this.prefix}actions/${new Date().toISOString().slice(0,10)}.jsonl`;
    await this.put(key, rec);
    this.actionPrev = hash;
  }

  async appendEvidence(e: any) {
    const ts = e.timestamp ?? new Date().toISOString();
    const payload = { kind: "evidence", ...e, timestamp: ts };
    const line = JSON.stringify(payload);
    const hash = sha256(line + this.evidencePrev);
    const rec = JSON.stringify({ ...payload, hash, prev_hash: this.evidencePrev }) + "\n";
    const key = `${this.prefix}evidence/${new Date().toISOString().slice(0,10)}.jsonl`;
    await this.put(key, rec);
    this.evidencePrev = hash;
  }
}
