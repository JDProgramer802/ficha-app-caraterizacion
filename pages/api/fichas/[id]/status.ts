import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "../../../../lib/db";
import { Ficha, EstadoFicha } from "../../../../lib/schema";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await getDb();
  const fichas = db.collection<Ficha>("fichas");
  const { id } = req.query as { id: string };

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).end();
    return;
  }

  const { estado } = req.body as { estado: EstadoFicha };
  if (estado !== "borrador" && estado !== "enviado") {
    res.status(400).json({ error: "Estado inválido" });
    return;
  }

  const now = new Date().toISOString();

  const result = await fichas.updateOne({ id } as any, { $set: { estado, updatedAt: now } });

  if (result.matchedCount === 0) {
    res.status(404).json({ error: "No encontrada" });
    return;
  }

  res.status(200).json({ ok: true });
}
