import type { NextApiRequest, NextApiResponse } from "next";
import { randomUUID } from "crypto";
import { getDb } from "../../../lib/db";
import { Ficha, FichaIndexItem, emptyFicha } from "../../../lib/schema";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await getDb();
  const fichas = db.collection<Ficha>("fichas");

  if (req.method === "GET") {
    const { estado, regional, centro_zonal, nombre, documento, fecha } = req.query;

    const filter: any = {};
    if (estado) filter.estado = estado;
    if (fecha) filter["modulo0_identificacion.fecha_diligenciamiento"] = fecha;
    if (regional) filter["modulo1_unidad_servicio.regional"] = { $regex: String(regional), $options: "i" };
    if (centro_zonal) filter["modulo1_unidad_servicio.centro_zonal"] = { $regex: String(centro_zonal), $options: "i" };
    if (nombre) filter["modulo2_nina_nino.nombres"] = { $regex: String(nombre), $options: "i" };
    if (documento) filter["modulo2_nina_nino.numero_documento"] = { $regex: String(documento), $options: "i" };

    const docs = await fichas
      .find(filter)
      .sort({ updatedAt: -1 })
      .toArray();

    const items: FichaIndexItem[] = docs.map((f) => ({
      id: f.id,
      estado: f.estado,
      fecha: f.modulo0_identificacion?.fecha_diligenciamiento || "",
      regional: f.modulo1_unidad_servicio?.regional || "",
      centro_zonal: f.modulo1_unidad_servicio?.centro_zonal || "",
      nombre_nina_nino:
        f.modulo2_nina_nino && f.modulo2_nina_nino.nombres
          ? `${f.modulo2_nina_nino.nombres} ${f.modulo2_nina_nino.apellidos || ""}`.trim()
          : "",
      documento: f.modulo2_nina_nino?.numero_documento || "",
      currentStep: f.currentStep || 0,
      updatedAt: f.updatedAt
    }));

    res.status(200).json(items);
    return;
  }

  if (req.method === "POST") {
    const id = randomUUID();
    const now = new Date().toISOString();
    const base = emptyFicha(id);
    const payload: Ficha = { ...base, ...(req.body || {}), id, updatedAt: now };

    await fichas.insertOne(payload as any);

    res.status(201).json({ id });
    return;
  }

  res.setHeader("Allow", "GET, POST");
  res.status(405).end();
}
