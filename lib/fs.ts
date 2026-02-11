import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

export const DATA_DIR = path.join(process.cwd(), "data", "fichas");
export const INDEX_PATH = path.join(DATA_DIR, "index.json");

export async function ensureDataDirs() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(INDEX_PATH);
  } catch {
    await safeWriteJson(INDEX_PATH, []);
  }
}

export async function safeWriteJson(filePath: string, data: unknown) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  const tmp = `${filePath}.tmp-${randomUUID()}`;
  const payload = JSON.stringify(data, null, 2);
  await fs.writeFile(tmp, payload, "utf8");
  await fs.rename(tmp, filePath);
}

export async function readJson<T>(filePath: string): Promise<T> {
  const buf = await fs.readFile(filePath, "utf8");
  return JSON.parse(buf) as T;
}

export async function removeFile(filePath: string) {
  try {
    await fs.unlink(filePath);
  } catch {}
}
