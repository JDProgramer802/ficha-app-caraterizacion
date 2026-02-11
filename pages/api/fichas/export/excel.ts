import type { NextApiRequest, NextApiResponse } from "next";
import * as XLSX from "xlsx";
import { getDb } from "../../../../lib/db";
import { Ficha } from "../../../../lib/schema";
import { buildExcelTodas } from "../../../../lib/export";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).end();
    return;
  }

  try {
    const db = await getDb();
    const fichas = await db.collection<Ficha>("fichas").find({}).toArray();

    const wb = buildExcelTodas(fichas);
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="fichas.xlsx"`);
    res.status(200).send(buf);
  } catch {
    res.status(500).json({ error: "Error exportando" });
  }
}
