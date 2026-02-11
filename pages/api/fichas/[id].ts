import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "../../../lib/db";
import { Ficha } from "../../../lib/schema";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await getDb();
  const fichas = db.collection<Ficha>("fichas");
  const { id } = req.query as { id: string };

  if (req.method === "GET") {
    const ficha = await fichas.findOne({ id } as any);
    if (!ficha) {
      res.status(404).json({ error: "No encontrada" });
      return;
    }
    res.status(200).json(ficha);
    return;
  }

  if (req.method === "PUT") {
    const existing = await fichas.findOne({ id } as any);
    if (!existing) {
      res.status(404).json({ error: "No encontrada" });
      return;
    }
    const now = new Date().toISOString();
    const updated: Ficha = { ...existing, ...(req.body || {}), id, updatedAt: now };
    await fichas.replaceOne({ id } as any, updated as any);
    res.status(200).json({ ok: true });
    return;
  }

  if (req.method === "DELETE") {
    await fichas.deleteOne({ id } as any);
    res.status(200).json({ ok: true });
    return;
  }

  res.setHeader("Allow", "GET, PUT, DELETE");
  res.status(405).end();
}
