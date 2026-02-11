import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { promises as fs } from "fs";
import { getDb } from "../../../lib/db";
import { Ficha } from "../../../lib/schema";
import { DATA_DIR } from "../../../lib/fs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const db = await getDb();
      const totalMongo = await db.collection<Ficha>("fichas").countDocuments();
      let totalArchivos = 0;
      try {
        const nombres = await fs.readdir(DATA_DIR);
        totalArchivos = nombres.filter((n) => n.endsWith(".json") && n !== "index.json").length;
      } catch {
        totalArchivos = 0;
      }
      res.status(200).json({ totalMongo, totalArchivos });
      return;
    } catch {
      res.status(500).json({ error: "Error consultando" });
      return;
    }
  }
  if (req.method === "POST") {
    try {
      const db = await getDb();
      await db.collection<Ficha>("fichas").createIndex({ id: 1 }, { unique: true });
      try {
        await db.collection<Ficha>("fichas").createIndex({ estado: 1 });
      } catch {}
      try {
        await db.collection<Ficha>("fichas").createIndex({ "modulo0_identificacion.fecha_diligenciamiento": 1 });
      } catch {}
      try {
        await db.collection<Ficha>("fichas").createIndex({ "modulo2_nina_nino.numero_documento": 1 });
      } catch {}
      let migrated = 0;
      let skipped = 0;
      let errors = 0;
      const dir = DATA_DIR;
      try {
        const nombres = await fs.readdir(dir);
        for (const nombre of nombres) {
          if (!nombre.endsWith(".json") || nombre === "index.json") continue;
          try {
            const buf = await fs.readFile(path.join(dir, nombre), "utf8");
            const ficha = JSON.parse(buf) as Ficha;
            const now = new Date().toISOString();
            const payload = { ...ficha, updatedAt: ficha.updatedAt || now };
            const result = await db
              .collection<Ficha>("fichas")
              .updateOne({ id: payload.id } as any, { $set: payload } as any, { upsert: true } as any);
            if ((result.upsertedCount || 0) > 0) migrated++;
            else skipped++;
          } catch {
            errors++;
          }
        }
      } catch {
        res.status(200).json({ migrated: 0, skipped: 0, errors: 0, note: "No hay archivos locales" });
        return;
      }
      res.status(200).json({ migrated, skipped, errors });
      return;
    } catch {
      res.status(500).json({ error: "Error migrando" });
      return;
    }
  }
  res.setHeader("Allow", "GET, POST");
  res.status(405).end();
}
