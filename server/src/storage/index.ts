import type { FastifyInstance } from "fastify";
import { FileStorage } from "./file.js";
import { PostgresStorage } from "./postgres.js";
import { S3Storage } from "./s3.js";

export interface Storage {
  appendAction(record: any): Promise<void>;
  appendEvidence(record: any): Promise<void>;
}

export function makeStorage(app: FastifyInstance): Storage {
  const kind = (process.env.TRACE_STORAGE || "file").toLowerCase();
  app.log.info({ kind }, "TRACE storage driver");
  if (kind === "postgres") return new PostgresStorage(process.env.DATABASE_URL!);
  if (kind === "s3") {
    return new S3Storage({
      bucket: process.env.S3_BUCKET!,
      region: process.env.S3_REGION || "us-east-1",
      endpoint: process.env.S3_ENDPOINT, // allow MinIO
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      prefix: process.env.S3_PREFIX || "trace/",
    });
  }
  return new FileStorage(); // default
}
