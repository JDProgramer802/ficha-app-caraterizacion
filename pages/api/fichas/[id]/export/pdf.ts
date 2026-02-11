import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "../../../../../lib/db";
import { Ficha } from "../../../../../lib/schema";
import { buildFichaPdf } from "../../../../../lib/export";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).end();
    return;
  }
  try {
    const db = await getDb();
    const ficha = await db.collection<Ficha>("fichas").findOne({ id } as any);
    if (!ficha) {
      res.status(404).json({ error: "No encontrada" });
      return;
    }
    const pdfBytes = await buildFichaPdf(ficha);
    res.setHeader("Content-Type", "application/pdf");
    const nombreRaw = `${ficha.modulo2_nina_nino?.nombres || ""} ${ficha.modulo2_nina_nino?.apellidos || ""}`.trim();
    const base = nombreRaw || `ficha_${id}`;
    const safe = base
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9-_ ]/g, "")
      .trim()
      .replace(/\s+/g, "_");
    res.setHeader("Content-Disposition", `attachment; filename="${safe}.pdf"`);
    res.status(200).send(Buffer.from(pdfBytes));
  } catch {
    res.status(500).json({ error: "Error exportando" });
  }
}
