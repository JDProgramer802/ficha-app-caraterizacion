import { Ficha } from "./schema";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import * as XLSX from "xlsx";

export async function buildFichaPdf(ficha: Ficha): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595.28, 841.89]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const { width } = page.getSize();

  let y = 800;
  page.drawRectangle({ x: 40, y: y - 24, width: width - 80, height: 28, color: rgb(0.30, 0.41, 1), opacity: 0.12 });
  page.drawText("Ficha de caracterizacion", { x: 48, y, size: 18, font: fontBold, color: rgb(0.15, 0.22, 0.45) });
  y -= 30;
  const estadoColor = ficha.estado === "enviado" ? rgb(0.18, 0.80, 0.44) : rgb(0.39, 0.46, 0.58);
  page.drawText(`ID: ${ficha.id}`, { x: 48, y, size: 12, font });
  page.drawText("•", { x: 180, y, size: 12, font, color: estadoColor });
  page.drawText(`Estado: ${ficha.estado}`, { x: 192, y, size: 12, font, color: estadoColor });
  y -= 20;

  y = drawSection(pdfDoc, () => (page = pdfDoc.addPage([595.28, 841.89])), page, font, fontBold, width, y, "Módulo 0 — Identificación", [
    ["Fecha de diligenciamiento", ficha.modulo0_identificacion.fecha_diligenciamiento]
  ]);

  y = drawSection(pdfDoc, () => (page = pdfDoc.addPage([595.28, 841.89])), page, font, fontBold, width, y, "Módulo I — Información Unidad de Servicio", [
    ["Regional", ficha.modulo1_unidad_servicio.regional],
    ["Centro Zonal", ficha.modulo1_unidad_servicio.centro_zonal],
    ["NIT Entidad", ficha.modulo1_unidad_servicio.nit_entidad],
    ["Código CUÉNTAME UDS", ficha.modulo1_unidad_servicio.codigo_cuentame_uds],
    ["Nombre del Agente Educativo", ficha.modulo1_unidad_servicio.nombre_agente_educativo]
  ]);

  y = drawSection(pdfDoc, () => (page = pdfDoc.addPage([595.28, 841.89])), page, font, fontBold, width, y, "Módulo II — Niña y Niño", [
    ["Nombres", ficha.modulo2_nina_nino.nombres],
    ["Apellidos", ficha.modulo2_nina_nino.apellidos],
    ["Tipo documento", ficha.modulo2_nina_nino.tipo_documento],
    ["Número documento", ficha.modulo2_nina_nino.numero_documento],
    ["Fecha nacimiento", ficha.modulo2_nina_nino.fecha_nacimiento],
    ["Sexo", ficha.modulo2_nina_nino.sexo],
    ["País nacimiento", ficha.modulo2_nina_nino.pais_nacimiento],
    ["Nacionalidad principal", ficha.modulo2_nina_nino.nacionalidad_principal],
    ["Lactancia <6m", ficha.modulo2_nina_nino.lactancia_materna_menor6m || ""],
    ["Motivo no lactancia <6m", ficha.modulo2_nina_nino.motivo_no_lactancia_menor6m || ""],
    ["Exclusiva <6m", ficha.modulo2_nina_nino.exclusiva_leche_materna_menor6m || ""],
    ["Edad introducción <6m", ficha.modulo2_nina_nino.edad_introduccion_alimentos_menor6m || ""],
    ["Primer alimento <6m", ficha.modulo2_nina_nino.primer_alimento_menor6m || ""],
    ["Exclusiva 7–24m", ficha.modulo2_nina_nino.recibio_leche_materna_exclusiva_7a24m || ""],
    ["Motivo no exclusiva 7–24m", ficha.modulo2_nina_nino.motivo_no_exclusiva_7a24m || ""],
    ["Edad introducción 7–24m", ficha.modulo2_nina_nino.edad_introduccion_alimentos_7a24m || ""],
    ["Primer alimento 7–24m", ficha.modulo2_nina_nino.primer_alimento_7a24m || ""]
  ]);

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

function drawSection(pdfDoc: PDFDocument, addPage: () => void, page: any, font: any, fontBold: any, width: number, y: number, title: string, rows: [string, string][]) {
  y -= 10;
  page.drawRectangle({ x: 40, y: y - 18, width: width - 80, height: 22, color: rgb(0.30, 0.41, 1), opacity: 0.08 });
  page.drawText(title, { x: 48, y, size: 14, font: fontBold, color: rgb(0.15, 0.22, 0.45) });
  y -= 20;
  rows.forEach(([label, value]) => {
    if (y < 100) {
      addPage();
      const { height } = page.getSize();
      y = height - 80;
    }
    const text = `${label}: ${value || ""}`;
    page.drawText(text, { x: 50, y, size: 12, font });
    y -= 16;
  });
  y -= 10;
  return y;
}

export function buildFichaExcel(ficha: Ficha): XLSX.WorkBook {
  const wb = XLSX.utils.book_new();
  // Identificación
  const wsIdent = XLSX.utils.json_to_sheet([
    {
      ficha_id: ficha.id,
      estado: ficha.estado,
      fecha_diligenciamiento: ficha.modulo0_identificacion.fecha_diligenciamiento,
      createdAt: ficha.createdAt,
      updatedAt: ficha.updatedAt
    }
  ]);
  XLSX.utils.book_append_sheet(wb, wsIdent, "Identificación");
  wsIdent["!autofilter"] = { ref: "A1:F1" };
  wsIdent["!cols"] = [{ wch: 12 }, { wch: 10 }, { wch: 18 }, { wch: 22 }, { wch: 22 }, { wch: 22 }];
  // Unidad de Servicio
  const wsUDS = XLSX.utils.json_to_sheet([
    {
      ficha_id: ficha.id,
      regional: ficha.modulo1_unidad_servicio.regional,
      centro_zonal: ficha.modulo1_unidad_servicio.centro_zonal,
      nit_entidad: ficha.modulo1_unidad_servicio.nit_entidad,
      codigo_cuentame_uds: ficha.modulo1_unidad_servicio.codigo_cuentame_uds,
      nombre_agente_educativo: ficha.modulo1_unidad_servicio.nombre_agente_educativo
    }
  ]);
  XLSX.utils.book_append_sheet(wb, wsUDS, "Unidad de Servicio");
  wsUDS["!autofilter"] = { ref: "A1:G1" };
  wsUDS["!cols"] = [{ wch: 12 }, { wch: 14 }, { wch: 16 }, { wch: 16 }, { wch: 20 }, { wch: 24 }, { wch: 26 }];
  // Niña y Niño
  const wsNN = XLSX.utils.json_to_sheet([
    {
      ficha_id: ficha.id,
      nombres: ficha.modulo2_nina_nino.nombres,
      apellidos: ficha.modulo2_nina_nino.apellidos,
      tipo_documento: ficha.modulo2_nina_nino.tipo_documento,
      numero_documento: ficha.modulo2_nina_nino.numero_documento,
      fecha_nacimiento: ficha.modulo2_nina_nino.fecha_nacimiento,
      sexo: ficha.modulo2_nina_nino.sexo,
      pais_nacimiento: ficha.modulo2_nina_nino.pais_nacimiento,
      nacionalidad_principal: ficha.modulo2_nina_nino.nacionalidad_principal,
      lactancia_menor6m: ficha.modulo2_nina_nino.lactancia_materna_menor6m || "",
      motivo_no_lactancia_menor6m: ficha.modulo2_nina_nino.motivo_no_lactancia_menor6m || "",
      exclusiva_menor6m: ficha.modulo2_nina_nino.exclusiva_leche_materna_menor6m || "",
      edad_introduccion_menor6m: ficha.modulo2_nina_nino.edad_introduccion_alimentos_menor6m || "",
      primer_alimento_menor6m: ficha.modulo2_nina_nino.primer_alimento_menor6m || "",
      exclusiva_7a24m: ficha.modulo2_nina_nino.recibio_leche_materna_exclusiva_7a24m || "",
      motivo_no_exclusiva_7a24m: ficha.modulo2_nina_nino.motivo_no_exclusiva_7a24m || "",
      edad_introduccion_7a24m: ficha.modulo2_nina_nino.edad_introduccion_alimentos_7a24m || "",
      primer_alimento_7a24m: ficha.modulo2_nina_nino.primer_alimento_7a24m || ""
    }
  ]);
  XLSX.utils.book_append_sheet(wb, wsNN, "Niña y Niño");
  wsNN["!autofilter"] = { ref: "A1:Q1" };
  wsNN["!cols"] = [
    { wch: 12 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 14 }, { wch: 16 }, { wch: 18 },
    { wch: 20 }, { wch: 24 }, { wch: 18 }, { wch: 18 }, { wch: 20 }, { wch: 22 }, { wch: 20 }, { wch: 20 }, { wch: 22 }
  ];
  // Familia (variables del módulo)
  const fam = ficha.modulo3_familia || ({} as any);
  const wsFam = XLSX.utils.json_to_sheet([
    {
      ficha_id: ficha.id,
      tipo_documento_usuario: fam.tipo_documento_usuario,
      numero_documento_usuario: fam.numero_documento_usuario,
      numero_personas_hogar: fam.numero_personas_hogar,
      clase_ubicacion: fam.clase_ubicacion || "",
      territorio_etnico: fam.territorio_etnico || "",
      territorio_tipo: fam.territorio_tipo || "",
      nombre_comunidad: fam.nombre_comunidad || "",
      tipo_vivienda: fam.tipo_vivienda || "",
      tipo_vivienda_otra: fam.tipo_vivienda_otra || "",
      tipo_tenencia: fam.tipo_tenencia || "",
      tipo_tenencia_otra: fam.tipo_tenencia_otra || ""
    }
  ]);
  XLSX.utils.book_append_sheet(wb, wsFam, "Familia");
  wsFam["!autofilter"] = { ref: "A1:L1" };
  wsFam["!cols"] = [{ wch: 12 }, { wch: 24 }, { wch: 18 }, { wch: 12 }, { wch: 18 }, { wch: 18 }, { wch: 24 }, { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 20 }];
  // Integrantes
  const miembros = (fam.integrantes || []).map((m: any, idx: number) => ({
    ficha_id: ficha.id,
    orden: idx + 1,
    parentesco: m.parentesco,
    parentesco_otro: m.parentesco_otro || "",
    nombres_apellidos: m.nombres_apellidos,
    tipo_documento: m.tipo_documento,
    numero_documento: m.numero_documento,
    fecha_nacimiento: m.fecha_nacimiento || "",
    edad: m.edad ?? "",
    pais_nacimiento: m.pais_nacimiento || "",
    sexo: m.sexo || "",
    genero: m.genero || "",
    orientacion_sexual: m.orientacion_sexual || "",
    grupo_etnico: m.grupo_etnico || "",
    sabe_leer_escribir: m.sabe_leer_escribir || "",
    actualmente_estudia: m.actualmente_estudia || "",
    nivel_educativo_mas_alto: m.nivel_educativo_mas_alto || "",
    actividad_principal_actual: m.actividad_principal_actual || "",
    tipo_vinculacion_laboral: m.tipo_vinculacion_laboral || "",
    ingreso_mensual_promedio: m.ingreso_mensual_promedio || "",
    observaciones: m.observaciones || ""
  }));
  const wsInt = XLSX.utils.json_to_sheet(miembros.length ? miembros : [{ ficha_id: ficha.id }]);
  XLSX.utils.book_append_sheet(wb, wsInt, "Integrantes");
  wsInt["!autofilter"] = { ref: "A1:R1" };
  wsInt["!cols"] = [
    { wch: 12 }, { wch: 8 }, { wch: 18 }, { wch: 18 }, { wch: 24 }, { wch: 18 }, { wch: 18 }, { wch: 14 },
    { wch: 10 }, { wch: 18 }, { wch: 18 }, { wch: 20 }, { wch: 22 }, { wch: 20 }, { wch: 20 }, { wch: 22 }, { wch: 18 }, { wch: 22 }
  ];
  return wb;
}

export function buildExcelTodas(fichas: Ficha[]): XLSX.WorkBook {
  const wb = XLSX.utils.book_new();
  // Identificación
  const identRows = fichas.map((f) => ({
    ficha_id: f.id,
    estado: f.estado,
    fecha_diligenciamiento: f.modulo0_identificacion.fecha_diligenciamiento,
    createdAt: f.createdAt,
    updatedAt: f.updatedAt
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(identRows), "Identificación");
  const wsIdent = wb.Sheets["Identificación"];
  wsIdent["!autofilter"] = { ref: "A1:E1" };
  wsIdent["!cols"] = [{ wch: 12 }, { wch: 10 }, { wch: 18 }, { wch: 22 }, { wch: 22 }];
  // Unidad de Servicio
  const udsRows = fichas.map((f) => ({
    ficha_id: f.id,
    regional: f.modulo1_unidad_servicio.regional,
    centro_zonal: f.modulo1_unidad_servicio.centro_zonal,
    nit_entidad: f.modulo1_unidad_servicio.nit_entidad,
    codigo_cuentame_uds: f.modulo1_unidad_servicio.codigo_cuentame_uds,
    nombre_agente_educativo: f.modulo1_unidad_servicio.nombre_agente_educativo
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(udsRows), "Unidad de Servicio");
  const wsUDS = wb.Sheets["Unidad de Servicio"];
  wsUDS["!autofilter"] = { ref: "A1:F1" };
  wsUDS["!cols"] = [{ wch: 12 }, { wch: 14 }, { wch: 16 }, { wch: 16 }, { wch: 20 }, { wch: 24 }];
  // Niña y Niño
  const nnRows = fichas.map((f) => ({
    ficha_id: f.id,
    nombres: f.modulo2_nina_nino.nombres,
    apellidos: f.modulo2_nina_nino.apellidos,
    tipo_documento: f.modulo2_nina_nino.tipo_documento,
    numero_documento: f.modulo2_nina_nino.numero_documento,
    fecha_nacimiento: f.modulo2_nina_nino.fecha_nacimiento,
    sexo: f.modulo2_nina_nino.sexo,
    pais_nacimiento: f.modulo2_nina_nino.pais_nacimiento,
    nacionalidad_principal: f.modulo2_nina_nino.nacionalidad_principal,
    lactancia_menor6m: f.modulo2_nina_nino.lactancia_materna_menor6m || "",
    motivo_no_lactancia_menor6m: f.modulo2_nina_nino.motivo_no_lactancia_menor6m || "",
    exclusiva_menor6m: f.modulo2_nina_nino.exclusiva_leche_materna_menor6m || "",
    edad_introduccion_menor6m: f.modulo2_nina_nino.edad_introduccion_alimentos_menor6m || "",
    primer_alimento_menor6m: f.modulo2_nina_nino.primer_alimento_menor6m || "",
    exclusiva_7a24m: f.modulo2_nina_nino.recibio_leche_materna_exclusiva_7a24m || "",
    motivo_no_exclusiva_7a24m: f.modulo2_nina_nino.motivo_no_exclusiva_7a24m || "",
    edad_introduccion_7a24m: f.modulo2_nina_nino.edad_introduccion_alimentos_7a24m || "",
    primer_alimento_7a24m: f.modulo2_nina_nino.primer_alimento_7a24m || ""
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(nnRows), "Niña y Niño");
  const wsNN = wb.Sheets["Niña y Niño"];
  wsNN["!autofilter"] = { ref: "A1:Q1" };
  wsNN["!cols"] = [
    { wch: 12 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 14 }, { wch: 16 }, { wch: 18 },
    { wch: 20 }, { wch: 24 }, { wch: 18 }, { wch: 18 }, { wch: 20 }, { wch: 22 }, { wch: 20 }, { wch: 20 }, { wch: 22 }
  ];
  // Familia (variables del módulo)
  const famRows = fichas.map((f) => {
    const fam = f.modulo3_familia || ({} as any);
    return {
      ficha_id: f.id,
      tipo_documento_usuario: fam.tipo_documento_usuario,
      numero_documento_usuario: fam.numero_documento_usuario,
      numero_personas_hogar: fam.numero_personas_hogar,
      clase_ubicacion: fam.clase_ubicacion || "",
      territorio_etnico: fam.territorio_etnico || "",
      territorio_tipo: fam.territorio_tipo || "",
      nombre_comunidad: fam.nombre_comunidad || "",
      tipo_vivienda: fam.tipo_vivienda || "",
      tipo_vivienda_otra: fam.tipo_vivienda_otra || "",
      tipo_tenencia: fam.tipo_tenencia || "",
      tipo_tenencia_otra: fam.tipo_tenencia_otra || ""
    };
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(famRows), "Familia");
  const wsFam = wb.Sheets["Familia"];
  wsFam["!autofilter"] = { ref: "A1:L1" };
  wsFam["!cols"] = [{ wch: 12 }, { wch: 24 }, { wch: 18 }, { wch: 12 }, { wch: 18 }, { wch: 18 }, { wch: 24 }, { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 20 }];
  const miembros = fichas.flatMap((f) =>
    (f.modulo3_familia?.integrantes || []).map((m, idx) => ({
      ficha_id: f.id,
      orden: idx + 1,
      parentesco: m.parentesco,
      parentesco_otro: m.parentesco_otro || "",
      nombres_apellidos: m.nombres_apellidos,
      tipo_documento: m.tipo_documento,
      numero_documento: m.numero_documento,
      fecha_nacimiento: m.fecha_nacimiento || "",
      edad: m.edad ?? "",
      pais_nacimiento: m.pais_nacimiento || "",
      sexo: m.sexo || "",
      genero: m.genero || "",
      orientacion_sexual: m.orientacion_sexual || "",
      grupo_etnico: m.grupo_etnico || "",
      sabe_leer_escribir: m.sabe_leer_escribir || "",
      actualmente_estudia: m.actualmente_estudia || "",
      nivel_educativo_mas_alto: m.nivel_educativo_mas_alto || "",
      actividad_principal_actual: m.actividad_principal_actual || "",
      tipo_vinculacion_laboral: m.tipo_vinculacion_laboral || "",
      ingreso_mensual_promedio: m.ingreso_mensual_promedio || "",
      observaciones: m.observaciones || ""
    }))
  );
  if (miembros.length > 0) {
    const ws2 = XLSX.utils.json_to_sheet(miembros);
    XLSX.utils.book_append_sheet(wb, ws2, "Integrantes");
    ws2["!autofilter"] = { ref: "A1:R1" };
    ws2["!cols"] = [
      { wch: 12 }, { wch: 8 }, { wch: 18 }, { wch: 18 }, { wch: 24 }, { wch: 18 }, { wch: 18 }, { wch: 14 },
      { wch: 10 }, { wch: 18 }, { wch: 18 }, { wch: 20 }, { wch: 22 }, { wch: 20 }, { wch: 20 }, { wch: 22 }, { wch: 18 }, { wch: 22 }
    ];
  }
  return wb;
}
