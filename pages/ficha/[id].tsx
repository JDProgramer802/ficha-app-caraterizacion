import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Progress from "../../components/Progress";
import BridgeSelect from "../../components/BridgeSelect";

type UnidadServicio = {
  regional: string;
  centro_zonal: string;
  nit_entidad: string;
  codigo_cuentame_uds: string;
  nombre_agente_educativo: string;
};

type NinaNino = {
  fecha_nacimiento: string;
  edad: number | null;
  pais_nacimiento: string;
  nacionalidad_principal: string;
  nacionalidad_secundaria?: string;
  departamento_residencia: string;
  municipio_residencia: string;
  celular_acudiente: string;
  tipo_documento:
  | "Registro Civil"
  | "Cédula de ciudadanía"
  | "Tarjeta de identidad"
  | "Pasaporte"
  | "Permiso especial de permanencia (PEP)"
  | "No tiene";
  numero_documento: string;
  nombres: string;
  apellidos: string;
  sexo: "Mujer" | "Hombre" | "Intersexual";
  discapacidad: "SI" | "NO";
  categoria_discapacidad:
  | "Física"
  | "Intelectual"
  | "Psicosocial"
  | "Auditiva"
  | "Visual"
  | "Sordo ceguera"
  | "Múltiple"
  | "Sensorial (gusto, olfato, tacto)"
  | "Sistémica"
  | "Voz y habla"
  | "Piel, pelo y uñas"
  | "Ninguna";
  grupo_etnico:
  | "Población indígena"
  | "Población Negra"
  | "Población Afrocolombiana"
  | "Población Raizal descendiente del Archipiélago de San Andrés, Providencia y Santa Catalina"
  | "Población Gitana o Rrom"
  | "Población Palenquera"
  | "Ninguno";
  lenguas_principal: string;
  lenguas_secundaria?: string;
  lenguas_terciaria?: string;
  lenguas_otra?: string;
  dormir_en: "Hamaca" | "Cama" | "Colchoneta" | "Estera" | "Cuna" | "Plancha" | "Otro";
  dormir_otro?: string;
  duerme_con_adultos_habitacion: "SI" | "NO";
  duerme_con_adultos_cama: "SI" | "NO";
  afiliacion_salud: "Afiliado" | "No afiliado";
  razon_no_afiliado?:
  | "En trámite"
  | "Falta de dinero"
  | "No sabe que debe afiliarse"
  | "No le interesa"
  | "No hay entidad cercana"
  | "Otra";
  razon_no_afiliado_otra?: string;
  esquema_vacunacion: "Esquema Completo" | "Esquema incompleto";
  razon_vacunacion_incompleta?:
  | "Falta de dinero"
  | "No sabe que debe vacunarse"
  | "No le interesa"
  | "Pertenece a movimiento anti vacunas"
  | "No hay entidad cercana"
  | "Motivos religiosos"
  | "Otra";
  razon_vacunacion_otra?: string;
  atencion_bucal_mayor6m?: "Con atención salud bucal" | "Sin atención salud bucal";
  motivo_no_bucal?:
  | "Falta de dinero"
  | "No sabe la utilidad de esta valoración"
  | "No le interesa"
  | "No hay entidad cercana"
  | "Motivos religiosos"
  | "Otro";
  motivo_no_bucal_otro?: string;
  valoracion_auditiva_mayor6m?: "Con valoración auditiva" | "Sin valoración auditiva";
  motivo_no_auditiva?:
  | "Falta de dinero"
  | "No sabe la utilidad de esta valoración"
  | "No le interesa"
  | "No hay entidad cercana"
  | "Motivos religiosos"
  | "Otro";
  motivo_no_auditiva_otro?: string;
  valoracion_visual_mayor3a?: "SI" | "NO";
  motivo_no_visual?:
  | "Falta de dinero"
  | "No sabe la utilidad de esta valoración"
  | "No le interesa"
  | "No hay entidad cercana"
  | "Motivos religiosos"
  | "Otro";
  motivo_no_visual_otro?: string;
  alergico_medicamento_alimento: "Si" | "No" | "No sabe";
  alergico_detalle?: string;
  valoracion_integral: "SI" | "NO";
  fecha_ultima_cita?: string;
  razon_no_valoracion_integral?:
  | "Falta de dinero"
  | "No sabe que debe recibir esta atención"
  | "No le interesa"
  | "No hay entidad cercana"
  | "Otro";
  razon_no_valoracion_integral_otra?: string;
  lactancia_materna_menor6m?: "SI" | "NO";
  motivo_no_lactancia_menor6m?:
  | "Empleo"
  | "Ausencia de la madre"
  | "Dificultades en el amamantamiento"
  | "Falta de motivación"
  | "No sabe como hacerlo"
  | "Tratamiento médico"
  | "Presión familiar"
  | "Otro";
  motivo_no_lactancia_menor6m_otro?: string;
  exclusiva_leche_materna_menor6m?: "Si, exclusivamente leche materna" | "No, recibe otros alimentos";
  edad_introduccion_alimentos_menor6m?:
  | "(0 meses)"
  | "(1 mes)"
  | "(2 meses)"
  | "(3 meses)"
  | "(4 meses)"
  | "(5 meses)";
  primer_alimento_menor6m?: string;
  recibio_leche_materna_exclusiva_7a24m?: "Si recibió leche materna exclusiva" | "No recibió leche materna exclusiva";
  motivo_no_exclusiva_7a24m?:
  | "Empleo"
  | "Ausencia de la madre"
  | "Dificultades en el amamantamiento"
  | "Falta de motivación"
  | "No sabía como hacerlo"
  | "Tratamiento médico"
  | "Presión familiar"
  | "Otro";
  motivo_no_exclusiva_7a24m_otro?: string;
  edad_introduccion_alimentos_7a24m?:
  | "(0 meses)"
  | "(1 mes)"
  | "(2 meses)"
  | "(3 meses)"
  | "(4 meses)"
  | "(5 meses)"
  | "(6 meses)"
  | "(7 meses)"
  | "(8 meses)"
  | "(9 meses)"
  | "(10 meses)"
  | "(11 meses)"
  | "(12 meses)";
  primer_alimento_7a24m?: string;
};

type Ficha = {
  id: string;
  estado: "borrador" | "enviado";
  currentStep: number;
  modulo0_identificacion: { fecha_diligenciamiento: string };
  modulo1_unidad_servicio: UnidadServicio;
  modulo2_nina_nino: NinaNino;
  modulo3_familia: ModuloFamilia;
};
 
const STEPS = 5;
const PAISES = ["Colombia", "Venezuela"];
const DEPARTAMENTOS = [
  "Amazonas","Antioquia","Arauca","Atlántico","Bolívar","Boyacá","Caldas","Caquetá","Casanare","Cauca","Cesar","Chocó",
  "Córdoba","Cundinamarca","Bogotá, D.C.","Guainía","Guaviare","Huila","La Guajira","Magdalena","Meta","Nariño","Norte de Santander",
  "Putumayo","Quindío","Risaralda","San Andrés y Providencia","Santander","Sucre","Tolima","Valle del Cauca","Vaupés","Vichada"
];
const MUNICIPIOS_MAP: Record<string, string[]> = {
  "Atlántico": [
    "Barranquilla","Soledad","Malambo","Puerto Colombia","Galapa","Sabanalarga","Santo Tomás","Palmar de Varela","Baranoa",
    "Ponedera","Candelaria","Manatí","Luruaco","Repelón","Juan de Acosta","Tubará","Sabanagrande","Polonuevo","Campo de la Cruz",
    "Santa Lucía","Usiacurí"
  ]
};
type IntegranteHogar = {
  parentesco:
  | "Padre"
  | "Madre"
  | "Hijo-a"
  | "Hermana-o"
  | "Prima-o"
  | "Sobrina-o"
  | "Nieta-o"
  | "Cónyuge"
  | "Padrastro"
  | "Madrastra"
  | "Hijastra-o"
  | "Abuela-o"
  | "Tía-o"
  | "Suegra-o"
  | "Nuera"
  | "Yerno"
  | "Cuñada-o"
  | "Padrino"
  | "Madrina"
  | "Familia sustituta / institución de protección"
  | "Otro";
  parentesco_otro?: string;
  nombres_apellidos: string;
  tipo_documento:
  | "Registro Civil"
  | "Cédula de ciudadanía"
  | "Tarjeta de identidad"
  | "Pasaporte"
  | "Permiso especial de permanencia (PEP)"
  | "No tiene";
  numero_documento: string;
  fecha_nacimiento?: string;
  edad?: number | null;
  pais_nacimiento?: string;
  sexo?: "Mujer" | "Hombre" | "Intersexual";
  genero?: string;
  orientacion_sexual?: string;
  grupo_etnico?:
  | "Población indígena"
  | "Población Negra"
  | "Población Afrocolombiana"
  | "Población Raizal descendiente del Archipiélago de San Andrés, Providencia y Santa Catalina"
  | "Población Gitana o Rrom"
  | "Población Palenquera"
  | "Ninguno";
  sabe_leer_escribir?: "Sí" | "No";
  actualmente_estudia?: "Sí" | "No";
  nivel_educativo_mas_alto?: string;
  actividad_principal_actual?: string;
  tipo_vinculacion_laboral?: string;
  ingreso_mensual_promedio?: string;
  observaciones?: string;
};

type ModuloFamilia = {
  tipo_documento_usuario:
  | "Registro Civil"
  | "Cédula de ciudadanía"
  | "Tarjeta de identidad"
  | "Pasaporte"
  | "Permiso especial de permanencia (PEP)"
  | "No tiene";
  numero_documento_usuario: string;
  numero_personas_hogar: number | null;
  integrantes: IntegranteHogar[];
  clase_ubicacion?: "Cabecera municipal" | "Centro poblado" | "Rural disperso";
  territorio_etnico?: "SI" | "NO";
  territorio_tipo?: "Resguardo indígena" | "Territorio colectivo comunidad negra" | "No aplica";
  nombre_comunidad?: string;
  tipo_vivienda?:
  | "Casa"
  | "Cambuche"
  | "Apartamento"
  | "Vivienda tradicional indígena"
  | "Rancho"
  | "Finca"
  | "Casa lote"
  | "Establecimiento de reclusión"
  | "Otra";
  tipo_vivienda_otra?: string;
  tipo_tenencia?: "Propia" | "Familiar" | "En arriendo" | "Ocupador de hecho" | "En concesión" | "Otra";
  tipo_tenencia_otra?: string;
};

const totalSteps = 5;

export default function FichaWizard() {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ficha, setFicha] = useState<Ficha | null>(null);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState("");

  function todayIso() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  function toIso(ddmmyyyy?: string) {
    if (!ddmmyyyy) return "";
    const [dd, mm, yyyy] = ddmmyyyy.split("/");
    if (!dd || !mm || !yyyy) return "";
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }
  function toDDMMYYYY(iso?: string) {
    if (!iso) return "";
    const [yyyy, mm, dd] = iso.split("-");
    if (!yyyy || !mm || !dd) return "";
    return `${dd.padStart(2, "0")}/${mm.padStart(2, "0")}/${yyyy}`;
  }
  function monthsFrom(iso?: string) {
    if (!iso) return 0;
    const d = new Date(iso);
    const now = new Date();
    let months = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
    if (now.getDate() < d.getDate()) months -= 1;
    return Math.max(0, months);
  }
  function yearsFrom(iso?: string) {
    return Math.floor(monthsFrom(iso) / 12);
  }

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/fichas/${id}`)
      .then(async (r) => {
        if (!r.ok) throw new Error("notfound");
        const data = await r.json();
        const fecha = data?.modulo0_identificacion?.fecha_diligenciamiento;
        if (!fecha) {
          data.modulo0_identificacion = { fecha_diligenciamiento: toDDMMYYYY(todayIso()) };
        }
        if (!data.modulo1_unidad_servicio) {
          data.modulo1_unidad_servicio = {
            regional: "Atlántico",
            centro_zonal: "sur occidente",
            nit_entidad: "es8002329137",
            codigo_cuentame_uds: "0800100119364",
            nombre_agente_educativo: "Nelsy serrano"
          };
        } else {
          data.modulo1_unidad_servicio.regional = data.modulo1_unidad_servicio.regional || "Atlántico";
          data.modulo1_unidad_servicio.centro_zonal = data.modulo1_unidad_servicio.centro_zonal || "sur occidente";
          data.modulo1_unidad_servicio.nit_entidad = data.modulo1_unidad_servicio.nit_entidad || "es8002329137";
          data.modulo1_unidad_servicio.codigo_cuentame_uds = data.modulo1_unidad_servicio.codigo_cuentame_uds || "0800100119364";
          data.modulo1_unidad_servicio.nombre_agente_educativo =
            data.modulo1_unidad_servicio.nombre_agente_educativo || "Nelsy serrano";
        }
        if (!data.modulo2_nina_nino) {
          data.modulo2_nina_nino = {} as any;
        }
        setFicha(data);
        setStep((data && (data.currentStep ?? 0)) || 0);
      })
      .catch(() => {
        setFicha(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const canNext = useMemo(() => {
    if (!ficha) return false;
    if (step === 0) {
      return Boolean(ficha?.modulo0_identificacion?.fecha_diligenciamiento);
    }
    if (step === 1) {
      const m = ficha?.modulo1_unidad_servicio || ({} as UnidadServicio);
      return Boolean(m.regional && m.centro_zonal && m.nit_entidad && m.codigo_cuentame_uds && m.nombre_agente_educativo);
    }
    if (step === 2) {
      const n = ficha.modulo2_nina_nino || ({} as NinaNino);
      return Boolean(
        n.nombres &&
        n.apellidos &&
        n.tipo_documento &&
        (n.numero_documento || n.tipo_documento === "No tiene") &&
        n.sexo &&
        n.fecha_nacimiento
      );
    }
    if (step === 3) {
      const n = ficha.modulo2_nina_nino || ({} as NinaNino);
      if (!n.afiliacion_salud) return false;
      if (n.afiliacion_salud === "No afiliado" && !n.razon_no_afiliado) return false;
      if (!n.esquema_vacunacion) return false;
      if (n.esquema_vacunacion === "Esquema incompleto" && !n.razon_vacunacion_incompleta) return false;
      if (n.atencion_bucal_mayor6m === "Sin atención salud bucal" && !n.motivo_no_bucal) return false;
      if (n.valoracion_auditiva_mayor6m === "Sin valoración auditiva" && !n.motivo_no_auditiva) return false;
      if (n.valoracion_visual_mayor3a === "NO" && !n.motivo_no_visual) return false;
      return true;
    }
    if (step === 4) {
      const f = ficha.modulo3_familia || ({} as ModuloFamilia);
      if (!f.tipo_documento_usuario) return false;
      if (f.tipo_documento_usuario !== "No tiene" && !f.numero_documento_usuario) return false;
      if (f.numero_personas_hogar == null || f.numero_personas_hogar < 0) return false;
      return true;
    }
    return true;
  }, [ficha, step]);

  function updateFicha(partial: Partial<Ficha>) {
    if (!ficha) return;
    setFicha({ ...ficha, ...partial });
  }

  async function guardar(estado?: "borrador" | "enviado") {
    if (!ficha) return;
    setSaving(true);
    const payload = { ...ficha, currentStep: step, estado: estado || ficha.estado };
    await fetch(`/api/fichas/${ficha.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setSaving(false);
    if (estado === "enviado") {
      setSubmitted(true);
      setFicha({ ...payload });
    } else {
      setToast("Cambios guardados");
      setTimeout(() => setToast(""), 2000);
    }
  }

  async function crearNuevaFicha() {
    const r = await fetch("/api/fichas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
    if (!r.ok) return;
    const data = await r.json();
    router.push(`/ficha/${data.id}`);
  }

  if (loading) {
    return (
      <div className="container">
        <div className="card">Cargando...</div>
      </div>
    );
  }
  if (!ficha) {
    return (
      <div className="container">
        <div className="card">
          <h1>Ficha no encontrada</h1>
          <div className="actions">
            <button onClick={() => router.push("/")}>Volver al inicio</button>
          </div>
        </div>
      </div>
    );
  }

  if (submitted || ficha.estado === "enviado") {
    return (
      <div className="container">
        <div className="card">
          <h1>Gracias por llenar el formulario</h1>
          <div className="actions">
            <button className="primary" onClick={crearNuevaFicha}>Llenar otro formulario</button>
            <button onClick={() => router.push("/")}>Ir al inicio</button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="container">
      {submitted && (
        <div className="app-header">
          <h1>Ficha de caracterizacion</h1>
        </div>
      )}
      <div className="card">
        <h1>Ficha de caracterizacion</h1>
        <Progress current={step} total={STEPS} />
        {step === 0 && (
          <div className="fade-in">
            <h2 className="section-title">Identificación del formulario</h2>
            <label>Fecha de diligenciamiento (DD/MM/AAAA) <span className="required">*</span></label>
            <input
              type="date"
              value={toIso(ficha.modulo0_identificacion?.fecha_diligenciamiento) || todayIso()}
              onChange={(e) =>
                updateFicha({
                  modulo0_identificacion: { fecha_diligenciamiento: toDDMMYYYY(e.target.value) } as any
                })
              }
            />
            {!ficha.modulo0_identificacion?.fecha_diligenciamiento && (
              <div className="error-text">Este campo es obligatorio</div>
            )}
          </div>
        )}
        {step === 2 && (
          <div className="fade-in">
            <h2 className="section-title">Información de la niña y el niño</h2>
            <div className="row">
              <div>
                <label>Nombres <span className="required">*</span></label>
                <input
                  value={ficha.modulo2_nina_nino?.nombres || ""}
                  onChange={(e) =>
                    updateFicha({
                      modulo2_nina_nino: { ...ficha.modulo2_nina_nino, nombres: e.target.value } as any
                    })
                  }
                />
                {!ficha.modulo2_nina_nino?.nombres && <div className="error-text">Campo obligatorio</div>}
              </div>
              <div>
                <label>Apellidos <span className="required">*</span></label>
                <input
                  value={ficha.modulo2_nina_nino?.apellidos || ""}
                  onChange={(e) =>
                    updateFicha({
                      modulo2_nina_nino: { ...ficha.modulo2_nina_nino, apellidos: e.target.value } as any
                    })
                  }
                />
                {!ficha.modulo2_nina_nino?.apellidos && <div className="error-text">Campo obligatorio</div>}
              </div>
            </div>
            <div className="row">
              <div>
                <label>Tipo documento <span className="required">*</span></label>
                <BridgeSelect
                  value={ficha.modulo2_nina_nino?.tipo_documento || "Registro Civil"}
                  onChange={(v) =>
                    updateFicha({
                      modulo2_nina_nino: { ...ficha.modulo2_nina_nino, tipo_documento: v as any } as any
                    })
                  }
                >
                  <option>Registro Civil</option>
                  <option>Cédula de ciudadanía</option>
                  <option>Tarjeta de identidad</option>
                  <option>Pasaporte</option>
                  <option>Permiso especial de permanencia (PEP)</option>
                  <option>No tiene</option>
                </BridgeSelect>
                {!ficha.modulo2_nina_nino?.tipo_documento && <div className="error-text">Campo obligatorio</div>}
              </div>
              <div>
                <label>
                  Número de documento{" "}
                  {ficha.modulo2_nina_nino?.tipo_documento !== "No tiene" && <span className="required">*</span>}
                </label>
                <input
                  value={ficha.modulo2_nina_nino?.numero_documento || ""}
                  onChange={(e) =>
                    updateFicha({
                      modulo2_nina_nino: { ...ficha.modulo2_nina_nino, numero_documento: e.target.value } as any
                    })
                  }
                />
                {ficha.modulo2_nina_nino?.tipo_documento !== "No tiene" &&
                  !ficha.modulo2_nina_nino?.numero_documento && <div className="error-text">Campo obligatorio</div>}
              </div>
            </div>
            <div className="row">
              <div>
                <label>Sexo <span className="required">*</span></label>
                <BridgeSelect
                  value={ficha.modulo2_nina_nino?.sexo || "Mujer"}
                  onChange={(v) =>
                    updateFicha({
                      modulo2_nina_nino: { ...ficha.modulo2_nina_nino, sexo: v as any } as any
                    })
                  }
                >
                  <option>Mujer</option>
                  <option>Hombre</option>
                  <option>Intersexual</option>
                </BridgeSelect>
                {!ficha.modulo2_nina_nino?.sexo && <div className="error-text">Campo obligatorio</div>}
              </div>
              <div>
                <label>Fecha de nacimiento <span className="required">*</span></label>
                <input
                  type="date"
                  value={
                    toIso(ficha.modulo2_nina_nino?.fecha_nacimiento) || ""
                  }
                  onChange={(e) => {
                    const ddmm = toDDMMYYYY(e.target.value);
                    const years = yearsFrom(e.target.value);
                    updateFicha({
                      modulo2_nina_nino: {
                        ...ficha.modulo2_nina_nino,
                        fecha_nacimiento: ddmm,
                        edad: years
                      } as any
                    });
                  }}
                />
                {!ficha.modulo2_nina_nino?.fecha_nacimiento && <div className="error-text">Campo obligatorio</div>}
              </div>
            </div>
            <div className="row">
              <div>
                <label>Edad</label>
                <input
                  value={String(ficha.modulo2_nina_nino?.edad ?? "")}
                  onChange={(e) =>
                    updateFicha({
                      modulo2_nina_nino: { ...ficha.modulo2_nina_nino, edad: Number(e.target.value || 0) } as any
                    })
                  }
                />
              </div>
              <div>
                <label>País de nacimiento</label>
                <BridgeSelect
                  value={ficha.modulo2_nina_nino?.pais_nacimiento || "Colombia"}
                  onChange={(v) =>
                    updateFicha({
                      modulo2_nina_nino: { ...ficha.modulo2_nina_nino, pais_nacimiento: v } as any
                    })
                  }
                >
                  {PAISES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </BridgeSelect>
              </div>
            </div>
            <div className="row">
              <div>
                <label>Nacionalidad principal</label>
                <BridgeSelect
                  value={ficha.modulo2_nina_nino?.nacionalidad_principal || "Colombia"}
                  onChange={(v) =>
                    updateFicha({
                      modulo2_nina_nino: { ...ficha.modulo2_nina_nino, nacionalidad_principal: v } as any
                    })
                  }
                >
                  {PAISES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </BridgeSelect>
              </div>
              <div>
                <label>Segunda nacionalidad</label>
                <input
                  value={ficha.modulo2_nina_nino?.nacionalidad_secundaria || ""}
                  onChange={(e) =>
                    updateFicha({
                      modulo2_nina_nino: { ...ficha.modulo2_nina_nino, nacionalidad_secundaria: e.target.value } as any
                    })
                  }
                />
              </div>
            </div>
            <div className="row">
              <div>
                <label>Departamento de residencia</label>
                <BridgeSelect
                  value={ficha.modulo2_nina_nino?.departamento_residencia || "Atlántico"}
                  onChange={(v) =>
                    updateFicha({
                      modulo2_nina_nino: {
                        ...ficha.modulo2_nina_nino,
                        departamento_residencia: v,
                        municipio_residencia: MUNICIPIOS_MAP[v]
                          ? (MUNICIPIOS_MAP[v][0] || "")
                          : (ficha.modulo2_nina_nino?.municipio_residencia || "")
                      } as any
                    })
                  }
                >
                  {DEPARTAMENTOS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </BridgeSelect>
              </div>
              <div>
                <label>Municipio de residencia</label>
                {MUNICIPIOS_MAP[ficha.modulo2_nina_nino?.departamento_residencia || ""] ? (
                  <BridgeSelect
                    value={ficha.modulo2_nina_nino?.municipio_residencia || ""}
                    onChange={(v) =>
                      updateFicha({
                        modulo2_nina_nino: { ...ficha.modulo2_nina_nino, municipio_residencia: v } as any
                      })
                    }
                  >
                    {MUNICIPIOS_MAP[ficha.modulo2_nina_nino?.departamento_residencia || ""].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </BridgeSelect>
                ) : (
                  <input
                    value={ficha.modulo2_nina_nino?.municipio_residencia || ""}
                    onChange={(e) =>
                      updateFicha({
                        modulo2_nina_nino: { ...ficha.modulo2_nina_nino, municipio_residencia: e.target.value } as any
                      })
                    }
                  />
                )}
              </div>
            </div>
            <div className="row">
              <div>
                <label>Número celular acudiente</label>
                <input
                  value={ficha.modulo2_nina_nino?.celular_acudiente || ""}
                  onChange={(e) =>
                    updateFicha({
                      modulo2_nina_nino: { ...ficha.modulo2_nina_nino, celular_acudiente: e.target.value } as any
                    })
                  }
                />
              </div>
              <div>
                <label>Discapacidad</label>
                <BridgeSelect
                  value={ficha.modulo2_nina_nino?.discapacidad || "NO"}
                  onChange={(v) =>
                    updateFicha({
                      modulo2_nina_nino: { ...ficha.modulo2_nina_nino, discapacidad: v as any } as any
                    })
                  }
                >
                  <option>SI</option>
                  <option>NO</option>
                </BridgeSelect>
              </div>
            </div>
            <div className="row">
              <div>
                <label>Categoría de discapacidad</label>
                <BridgeSelect
                  value={ficha.modulo2_nina_nino?.categoria_discapacidad || "Ninguna"}
                  onChange={(v) =>
                    updateFicha({
                      modulo2_nina_nino: { ...ficha.modulo2_nina_nino, categoria_discapacidad: v as any } as any
                    })
                  }
                >
                  <option>Física</option>
                  <option>Intelectual</option>
                  <option>Psicosocial</option>
                  <option>Auditiva</option>
                  <option>Visual</option>
                  <option>Sordo ceguera</option>
                  <option>Múltiple</option>
                  <option>Sensorial (gusto, olfato, tacto)</option>
                  <option>Sistémica</option>
                  <option>Voz y habla</option>
                  <option>Piel, pelo y uñas</option>
                  <option>Ninguna</option>
                </BridgeSelect>
              </div>
              <div>
                <label>Grupo étnico</label>
                <BridgeSelect
                  value={ficha.modulo2_nina_nino?.grupo_etnico || "Ninguno"}
                  onChange={(v) =>
                    updateFicha({
                      modulo2_nina_nino: { ...ficha.modulo2_nina_nino, grupo_etnico: v as any } as any
                    })
                  }
                >
                  <option>Población indígena</option>
                  <option>Población Negra</option>
                  <option>Población Afrocolombiana</option>
                  <option>Población Raizal descendiente del Archipiélago de San Andrés, Providencia y Santa Catalina</option>
                  <option>Población Gitana o Rrom</option>
                  <option>Población Palenquera</option>
                  <option>Ninguno</option>
                </BridgeSelect>
              </div>
            </div>
            <h3 style={{ marginTop: 12 }}>Condiciones habitacionales</h3>
            <div className="row">
              <div>
                <label>¿La niña o el niño duerme en?</label>
                <BridgeSelect
                  value={ficha.modulo2_nina_nino?.dormir_en || "Cama"}
                  onChange={(v) =>
                    updateFicha({
                      modulo2_nina_nino: { ...ficha.modulo2_nina_nino, dormir_en: v as any } as any
                    })
                  }
                >
                  <option>Hamaca</option>
                  <option>Cama</option>
                  <option>Colchoneta</option>
                  <option>Estera</option>
                  <option>Cuna</option>
                  <option>Plancha</option>
                  <option>Otro</option>
                </BridgeSelect>
              </div>
              <div>
                <label>Si respondió “Otro”, indique cuál</label>
                <input
                  value={ficha.modulo2_nina_nino?.dormir_otro || ""}
                  onChange={(e) =>
                    updateFicha({
                      modulo2_nina_nino: { ...ficha.modulo2_nina_nino, dormir_otro: e.target.value } as any
                    })
                  }
                />
              </div>
            </div>
            <div className="row">
              <div>
                <label>¿Duerme con adultos en la misma habitación?</label>
                <BridgeSelect
                  value={ficha.modulo2_nina_nino?.duerme_con_adultos_habitacion || "NO"}
                  onChange={(v) =>
                    updateFicha({
                      modulo2_nina_nino: {
                        ...ficha.modulo2_nina_nino,
                        duerme_con_adultos_habitacion: v as any
                      } as any
                    })
                  }
                >
                  <option>SI</option>
                  <option>NO</option>
                </BridgeSelect>
              </div>
              <div>
                <label>¿Duerme con adultos en la misma cama?</label>
                <BridgeSelect
                  value={ficha.modulo2_nina_nino?.duerme_con_adultos_cama || "NO"}
                  onChange={(v) =>
                    updateFicha({
                      modulo2_nina_nino: {
                        ...ficha.modulo2_nina_nino,
                        duerme_con_adultos_cama: v as any
                      } as any
                    })
                  }
                >
                  <option>SI</option>
                  <option>NO</option>
                </BridgeSelect>
              </div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="fade-in">
            <h2 className="section-title">Salud y atenciones</h2>
            <div className="month-banner">
              <div>
                <div className="month-count">
                  {monthsFrom(toIso(ficha.modulo2_nina_nino?.fecha_nacimiento))} meses
                </div>
                <div className="month-sub">
                  {yearsFrom(toIso(ficha.modulo2_nina_nino?.fecha_nacimiento))} años
                </div>
              </div>
              <div className="chip">Secciones aparecen según edad</div>
            </div>
            <h3>Validación servicios de salud</h3>
            <div className="row">
              <div>
                <label>Afiliación al SGSSS</label>
                <BridgeSelect
                  value={ficha.modulo2_nina_nino?.afiliacion_salud || "Afiliado"}
                  onChange={(v) =>
                    updateFicha({
                      modulo2_nina_nino: { ...ficha.modulo2_nina_nino, afiliacion_salud: v as any } as any
                    })
                  }
                >
                  <option>Afiliado</option>
                  <option>No afiliado</option>
                </BridgeSelect>
              </div>
              {ficha.modulo2_nina_nino?.afiliacion_salud === "No afiliado" && (
                <div>
                  <label>Razón de no afiliación</label>
                  <BridgeSelect
                    value={ficha.modulo2_nina_nino?.razon_no_afiliado || ""}
                    onChange={(v) =>
                      updateFicha({
                        modulo2_nina_nino: { ...ficha.modulo2_nina_nino, razon_no_afiliado: v as any } as any
                      })
                    }
                  >
                    <option value="">Seleccione</option>
                    <option>En trámite</option>
                    <option>Falta de dinero</option>
                    <option>No sabe que debe afiliarse</option>
                    <option>No le interesa</option>
                    <option>No hay entidad cercana</option>
                    <option>Otra</option>
                  </BridgeSelect>
                </div>
              )}
            </div>
            {ficha.modulo2_nina_nino?.razon_no_afiliado === "Otra" && (
              <div>
                <label>Especifique otra razón</label>
                <input
                  value={ficha.modulo2_nina_nino?.razon_no_afiliado_otra || ""}
                  onChange={(e) =>
                    updateFicha({
                      modulo2_nina_nino: { ...ficha.modulo2_nina_nino, razon_no_afiliado_otra: e.target.value } as any
                    })
                  }
                />
              </div>
            )}
            <div className="row" style={{ marginTop: 12 }}>
              <div>
                <label>Esquema de vacunación</label>
                <BridgeSelect
                  value={ficha.modulo2_nina_nino?.esquema_vacunacion || "Esquema Completo"}
                  onChange={(v) =>
                    updateFicha({
                      modulo2_nina_nino: { ...ficha.modulo2_nina_nino, esquema_vacunacion: v as any } as any
                    })
                  }
                >
                  <option>Esquema Completo</option>
                  <option>Esquema incompleto</option>
                </BridgeSelect>
              </div>
              {ficha.modulo2_nina_nino?.esquema_vacunacion === "Esquema incompleto" && (
                <div>
                  <label>Razón de esquema incompleto</label>
                  <BridgeSelect
                    value={ficha.modulo2_nina_nino?.razon_vacunacion_incompleta || ""}
                    onChange={(v) =>
                      updateFicha({
                        modulo2_nina_nino: { ...ficha.modulo2_nina_nino, razon_vacunacion_incompleta: v as any } as any
                      })
                    }
                  >
                    <option value="">Seleccione</option>
                    <option>Falta de dinero</option>
                    <option>No sabe que debe vacunarse</option>
                    <option>No le interesa</option>
                    <option>Pertenece a movimiento anti vacunas</option>
                    <option>No hay entidad cercana</option>
                    <option>Motivos religiosos</option>
                    <option>Otra</option>
                  </BridgeSelect>
                </div>
              )}
            </div>
            {ficha.modulo2_nina_nino?.razon_vacunacion_incompleta === "Otra" && (
              <div>
                <label>Especifique otra razón de vacunación</label>
                <input
                  value={ficha.modulo2_nina_nino?.razon_vacunacion_otra || ""}
                  onChange={(e) =>
                    updateFicha({
                      modulo2_nina_nino: { ...ficha.modulo2_nina_nino, razon_vacunacion_otra: e.target.value } as any
                    })
                  }
                />
              </div>
            )}
            {monthsFrom(toIso(ficha.modulo2_nina_nino?.fecha_nacimiento)) >= 6 && (
              <>
                <div className="row" style={{ marginTop: 12 }}>
                  <div>
                    <label>Atención en salud bucal</label>
                    <BridgeSelect
                      value={ficha.modulo2_nina_nino?.atencion_bucal_mayor6m || ""}
                      onChange={(v) =>
                        updateFicha({
                          modulo2_nina_nino: { ...ficha.modulo2_nina_nino, atencion_bucal_mayor6m: v as any } as any
                        })
                      }
                    >
                      <option value="">Seleccione</option>
                      <option>Con atención salud bucal</option>
                      <option>Sin atención salud bucal</option>
                    </BridgeSelect>
                  </div>
                  {ficha.modulo2_nina_nino?.atencion_bucal_mayor6m === "Sin atención salud bucal" && (
                    <div>
                      <label>Motivo</label>
                      <BridgeSelect
                        value={ficha.modulo2_nina_nino?.motivo_no_bucal || ""}
                        onChange={(v) =>
                          updateFicha({
                            modulo2_nina_nino: { ...ficha.modulo2_nina_nino, motivo_no_bucal: v as any } as any
                          })
                        }
                      >
                        <option value="">Seleccione</option>
                        <option>Falta de dinero</option>
                        <option>No sabe la utilidad de esta valoración</option>
                        <option>No le interesa</option>
                        <option>No hay entidad cercana</option>
                        <option>Motivos religiosos</option>
                        <option>Otro</option>
                      </BridgeSelect>
                    </div>
                  )}
                </div>
                {ficha.modulo2_nina_nino?.motivo_no_bucal === "Otro" && (
                  <div>
                    <label>Especifique otro motivo bucal</label>
                    <input
                      value={ficha.modulo2_nina_nino?.motivo_no_bucal_otro || ""}
                      onChange={(e) =>
                        updateFicha({
                          modulo2_nina_nino: { ...ficha.modulo2_nina_nino, motivo_no_bucal_otro: e.target.value } as any
                        })
                      }
                    />
                  </div>
                )}
                <div className="row" style={{ marginTop: 12 }}>
                  <div>
                    <label>Valoración auditiva y comunicativa</label>
                    <BridgeSelect
                      value={ficha.modulo2_nina_nino?.valoracion_auditiva_mayor6m || ""}
                      onChange={(v) =>
                        updateFicha({
                          modulo2_nina_nino: { ...ficha.modulo2_nina_nino, valoracion_auditiva_mayor6m: v as any } as any
                        })
                      }
                    >
                      <option value="">Seleccione</option>
                      <option>Con valoración auditiva</option>
                      <option>Sin valoración auditiva</option>
                    </BridgeSelect>
                  </div>
                  {ficha.modulo2_nina_nino?.valoracion_auditiva_mayor6m === "Sin valoración auditiva" && (
                    <div>
                      <label>Motivo</label>
                      <BridgeSelect
                        value={ficha.modulo2_nina_nino?.motivo_no_auditiva || ""}
                        onChange={(v) =>
                          updateFicha({
                            modulo2_nina_nino: { ...ficha.modulo2_nina_nino, motivo_no_auditiva: v as any } as any
                          })
                        }
                      >
                        <option value="">Seleccione</option>
                        <option>Falta de dinero</option>
                        <option>No sabe la utilidad de esta valoración</option>
                        <option>No le interesa</option>
                        <option>No hay entidad cercana</option>
                        <option>Motivos religiosos</option>
                        <option>Otro</option>
                      </BridgeSelect>
                    </div>
                  )}
                </div>
                {ficha.modulo2_nina_nino?.motivo_no_auditiva === "Otro" && (
                  <div>
                    <label>Especifique otro motivo auditivo</label>
                    <input
                      value={ficha.modulo2_nina_nino?.motivo_no_auditiva_otro || ""}
                      onChange={(e) =>
                        updateFicha({
                          modulo2_nina_nino: { ...ficha.modulo2_nina_nino, motivo_no_auditiva_otro: e.target.value } as any
                        })
                      }
                    />
                  </div>
                )}
              </>
            )}
            {yearsFrom(toIso(ficha.modulo2_nina_nino?.fecha_nacimiento)) >= 3 && (
              <div style={{ marginTop: 12 }}>
                <label>Valoración de salud visual</label>
                <BridgeSelect
                  value={ficha.modulo2_nina_nino?.valoracion_visual_mayor3a || ""}
                  onChange={(v) =>
                    updateFicha({
                      modulo2_nina_nino: { ...ficha.modulo2_nina_nino, valoracion_visual_mayor3a: v as any } as any
                    })
                  }
                >
                  <option value="">Seleccione</option>
                  <option>SI</option>
                  <option>NO</option>
                </BridgeSelect>
                {ficha.modulo2_nina_nino?.valoracion_visual_mayor3a === "NO" && (
                  <div style={{ marginTop: 8 }}>
                    <label>Motivo</label>
                    <BridgeSelect
                      value={ficha.modulo2_nina_nino?.motivo_no_visual || ""}
                      onChange={(v) =>
                        updateFicha({
                          modulo2_nina_nino: { ...ficha.modulo2_nina_nino, motivo_no_visual: v as any } as any
                        })
                      }
                    >
                      <option value="">Seleccione</option>
                      <option>Falta de dinero</option>
                      <option>No sabe la utilidad de esta valoración</option>
                      <option>No le interesa</option>
                      <option>No hay entidad cercana</option>
                      <option>Motivos religiosos</option>
                      <option>Otro</option>
                    </BridgeSelect>
                    {!ficha.modulo2_nina_nino?.motivo_no_visual && <div className="error-text">Campo obligatorio</div>}
                  </div>
                )}
                {ficha.modulo2_nina_nino?.motivo_no_visual === "Otro" && (
                  <div style={{ marginTop: 8 }}>
                    <label>Especifique otro motivo visual</label>
                    <input
                      value={ficha.modulo2_nina_nino?.motivo_no_visual_otro || ""}
                      onChange={(e) =>
                        updateFicha({
                          modulo2_nina_nino: { ...ficha.modulo2_nina_nino, motivo_no_visual_otro: e.target.value } as any
                        })
                      }
                    />
                  </div>
                )}
              </div>
            )}
            <div className="row" style={{ marginTop: 12 }}>
              <div>
                <label>¿Es alérgico a medicamento o alimento?</label>
                <BridgeSelect
                  value={ficha.modulo2_nina_nino?.alergico_medicamento_alimento || "No"}
                  onChange={(v) =>
                    updateFicha({
                      modulo2_nina_nino: {
                        ...ficha.modulo2_nina_nino,
                        alergico_medicamento_alimento: v as any
                      } as any
                    })
                  }
                >
                  <option>Si</option>
                  <option>No</option>
                  <option>No sabe</option>
                </BridgeSelect>
              </div>
              {ficha.modulo2_nina_nino?.alergico_medicamento_alimento === "Si" && (
                <div>
                  <label>Detalle alergia</label>
                  <input
                    value={ficha.modulo2_nina_nino?.alergico_detalle || ""}
                    onChange={(e) =>
                      updateFicha({
                        modulo2_nina_nino: { ...ficha.modulo2_nina_nino, alergico_detalle: e.target.value } as any
                      })
                    }
                  />
                </div>
              )}
            </div>
            <h3 style={{ marginTop: 12 }}>Valoración integral en salud</h3>
            <div className="row">
              <div>
                <label>Cuenta con valoración integral</label>
                <BridgeSelect
                  value={ficha.modulo2_nina_nino?.valoracion_integral || "SI"}
                  onChange={(v) =>
                    updateFicha({
                      modulo2_nina_nino: { ...ficha.modulo2_nina_nino, valoracion_integral: v as any } as any
                    })
                  }
                >
                  <option>SI</option>
                  <option>NO</option>
                </BridgeSelect>
              </div>
              {ficha.modulo2_nina_nino?.valoracion_integral === "SI" && (
                <div>
                  <label>Fecha de última cita</label>
                  <input
                    type="date"
                    value={toIso(ficha.modulo2_nina_nino?.fecha_ultima_cita) || ""}
                    onChange={(e) =>
                      updateFicha({
                        modulo2_nina_nino: {
                          ...ficha.modulo2_nina_nino,
                          fecha_ultima_cita: toDDMMYYYY(e.target.value)
                        } as any
                      })
                    }
                  />
                </div>
              )}
            </div>
            {ficha.modulo2_nina_nino?.valoracion_integral === "NO" && (
              <div>
                <label>Razón de no contar con valoración integral</label>
                <BridgeSelect
                  value={ficha.modulo2_nina_nino?.razon_no_valoracion_integral || ""}
                  onChange={(v) =>
                    updateFicha({
                      modulo2_nina_nino: {
                        ...ficha.modulo2_nina_nino,
                        razon_no_valoracion_integral: v as any
                      } as any
                    })
                  }
                >
                  <option value="">Seleccione</option>
                  <option>Falta de dinero</option>
                  <option>No sabe que debe recibir esta atención</option>
                  <option>No le interesa</option>
                  <option>No hay entidad cercana</option>
                  <option>Otro</option>
                </BridgeSelect>
              </div>
            )}
            {ficha.modulo2_nina_nino?.razon_no_valoracion_integral === "Otro" && (
              <div>
                <label>Especifique otra razón</label>
                <input
                  value={ficha.modulo2_nina_nino?.razon_no_valoracion_integral_otra || ""}
                  onChange={(e) =>
                    updateFicha({
                      modulo2_nina_nino: {
                        ...ficha.modulo2_nina_nino,
                        razon_no_valoracion_integral_otra: e.target.value
                      } as any
                    })
                  }
                />
              </div>
            )}
            {monthsFrom(toIso(ficha.modulo2_nina_nino?.fecha_nacimiento)) < 6 && (
              <div style={{ marginTop: 12 }}>
                <h3>Lactancia Materna y Alimentación Complementaria — menor de 6 meses</h3>
                <div className="row">
                  <div>
                    <label>¿Recibe leche materna?</label>
                    <BridgeSelect
                      value={ficha.modulo2_nina_nino?.lactancia_materna_menor6m || ""}
                      onChange={(v) =>
                        updateFicha({
                          modulo2_nina_nino: {
                            ...ficha.modulo2_nina_nino,
                            lactancia_materna_menor6m: v as any
                          } as any
                        })
                      }
                    >
                      <option value="">Seleccione</option>
                      <option>SI</option>
                      <option>NO</option>
                    </BridgeSelect>
                  </div>
                  {ficha.modulo2_nina_nino?.lactancia_materna_menor6m === "NO" && (
                    <div>
                      <label>Motivo</label>
                      <BridgeSelect
                        value={ficha.modulo2_nina_nino?.motivo_no_lactancia_menor6m || ""}
                        onChange={(v) =>
                          updateFicha({
                            modulo2_nina_nino: {
                              ...ficha.modulo2_nina_nino,
                              motivo_no_lactancia_menor6m: v as any
                            } as any
                          })
                        }
                      >
                        <option value="">Seleccione</option>
                        <option>Empleo</option>
                        <option>Ausencia de la madre</option>
                        <option>Dificultades en el amamantamiento</option>
                        <option>Falta de motivación</option>
                        <option>No sabe como hacerlo</option>
                        <option>Tratamiento médico</option>
                        <option>Presión familiar</option>
                        <option>Otro</option>
                      </BridgeSelect>
                    </div>
                  )}
                </div>
                {ficha.modulo2_nina_nino?.motivo_no_lactancia_menor6m === "Otro" && (
                  <div>
                    <label>Describa otro motivo</label>
                    <input
                      value={ficha.modulo2_nina_nino?.motivo_no_lactancia_menor6m_otro || ""}
                      onChange={(e) =>
                        updateFicha({
                          modulo2_nina_nino: {
                            ...ficha.modulo2_nina_nino,
                            motivo_no_lactancia_menor6m_otro: e.target.value
                          } as any
                        })
                      }
                    />
                  </div>
                )}
                <div className="row" style={{ marginTop: 12 }}>
                  <div>
                    <label>¿Exclusivamente leche materna?</label>
                    <BridgeSelect
                      value={ficha.modulo2_nina_nino?.exclusiva_leche_materna_menor6m || ""}
                      onChange={(v) =>
                        updateFicha({
                          modulo2_nina_nino: {
                            ...ficha.modulo2_nina_nino,
                            exclusiva_leche_materna_menor6m: v as any
                          } as any
                        })
                      }
                    >
                      <option value="">Seleccione</option>
                      <option>Si, exclusivamente leche materna</option>
                      <option>No, recibe otros alimentos</option>
                    </BridgeSelect>
                  </div>
                  {ficha.modulo2_nina_nino?.exclusiva_leche_materna_menor6m === "No, recibe otros alimentos" && (
                    <div>
                      <label>Edad cuando ofreció otros alimentos</label>
                      <BridgeSelect
                        value={ficha.modulo2_nina_nino?.edad_introduccion_alimentos_menor6m || ""}
                        onChange={(v) =>
                          updateFicha({
                            modulo2_nina_nino: {
                              ...ficha.modulo2_nina_nino,
                              edad_introduccion_alimentos_menor6m: v as any
                            } as any
                          })
                        }
                      >
                        <option value="">Seleccione</option>
                        <option>(0 meses)</option>
                        <option>(1 mes)</option>
                        <option>(2 meses)</option>
                        <option>(3 meses)</option>
                        <option>(4 meses)</option>
                        <option>(5 meses)</option>
                      </BridgeSelect>
                    </div>
                  )}
                </div>
                <div style={{ marginTop: 12 }}>
                  <label>Primer alimento diferente a leche materna o fórmula</label>
                  <input
                    value={ficha.modulo2_nina_nino?.primer_alimento_menor6m || ""}
                    onChange={(e) =>
                      updateFicha({
                        modulo2_nina_nino: {
                          ...ficha.modulo2_nina_nino,
                          primer_alimento_menor6m: e.target.value
                        } as any
                      })
                    }
                  />
                </div>
              </div>
            )}
            {monthsFrom(toIso(ficha.modulo2_nina_nino?.fecha_nacimiento)) >= 7 &&
              monthsFrom(toIso(ficha.modulo2_nina_nino?.fecha_nacimiento)) <= 24 && (
                <div style={{ marginTop: 12 }}>
                  <h3>Lactancia Materna y Alimentación Complementaria — 7 a 24 meses</h3>
                  <div className="row">
                    <div>
                      <label>¿Recibió leche materna exclusiva?</label>
                      <BridgeSelect
                        value={ficha.modulo2_nina_nino?.recibio_leche_materna_exclusiva_7a24m || ""}
                        onChange={(v) =>
                          updateFicha({
                            modulo2_nina_nino: {
                              ...ficha.modulo2_nina_nino,
                              recibio_leche_materna_exclusiva_7a24m: v as any
                            } as any
                          })
                        }
                      >
                        <option value="">Seleccione</option>
                        <option>Si recibió leche materna exclusiva</option>
                        <option>No recibió leche materna exclusiva</option>
                      </BridgeSelect>
                    </div>
                    {ficha.modulo2_nina_nino?.recibio_leche_materna_exclusiva_7a24m ===
                      "No recibió leche materna exclusiva" && (
                        <div>
                          <label>Motivo</label>
                          <BridgeSelect
                            value={ficha.modulo2_nina_nino?.motivo_no_exclusiva_7a24m || ""}
                            onChange={(v) =>
                              updateFicha({
                                modulo2_nina_nino: {
                                  ...ficha.modulo2_nina_nino,
                                  motivo_no_exclusiva_7a24m: v as any
                                } as any
                              })
                            }
                          >
                            <option value="">Seleccione</option>
                            <option>Empleo</option>
                            <option>Ausencia de la madre</option>
                            <option>Dificultades en el amamantamiento</option>
                            <option>Falta de motivación</option>
                            <option>No sabía como hacerlo</option>
                            <option>Tratamiento médico</option>
                            <option>Presión familiar</option>
                            <option>Otro</option>
                          </BridgeSelect>
                        </div>
                      )}
                  </div>
                  {ficha.modulo2_nina_nino?.motivo_no_exclusiva_7a24m === "Otro" && (
                    <div>
                      <label>Describa otro motivo</label>
                      <input
                        value={ficha.modulo2_nina_nino?.motivo_no_exclusiva_7a24m_otro || ""}
                        onChange={(e) =>
                          updateFicha({
                            modulo2_nina_nino: {
                              ...ficha.modulo2_nina_nino,
                              motivo_no_exclusiva_7a24m_otro: e.target.value
                            } as any
                          })
                        }
                      />
                    </div>
                  )}
                  <div className="row" style={{ marginTop: 12 }}>
                    <div>
                      <label>Edad cuando ofreció otros alimentos</label>
                      <BridgeSelect
                        value={ficha.modulo2_nina_nino?.edad_introduccion_alimentos_7a24m || ""}
                        onChange={(v) =>
                          updateFicha({
                            modulo2_nina_nino: {
                              ...ficha.modulo2_nina_nino,
                              edad_introduccion_alimentos_7a24m: v as any
                            } as any
                          })
                        }
                      >
                        <option value="">Seleccione</option>
                        <option>(0 meses)</option>
                        <option>(1 mes)</option>
                        <option>(2 meses)</option>
                        <option>(3 meses)</option>
                        <option>(4 meses)</option>
                        <option>(5 meses)</option>
                        <option>(6 meses)</option>
                        <option>(7 meses)</option>
                        <option>(8 meses)</option>
                        <option>(9 meses)</option>
                        <option>(10 meses)</option>
                        <option>(11 meses)</option>
                        <option>(12 meses)</option>
                      </BridgeSelect>
                    </div>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <label>Primer alimento diferente a leche materna</label>
                    <input
                      value={ficha.modulo2_nina_nino?.primer_alimento_7a24m || ""}
                      onChange={(e) =>
                        updateFicha({
                          modulo2_nina_nino: {
                            ...ficha.modulo2_nina_nino,
                            primer_alimento_7a24m: e.target.value
                          } as any
                        })
                      }
                    />
                  </div>
                </div>
              )}
          </div>
        )}
        {step === 1 && (
          <div className="fade-in">
            <h2 className="section-title">Unidad de servicio</h2>
            <div className="row">
              <div>
                <label>Regional <span className="required">*</span></label>
                <input
                  value={ficha.modulo1_unidad_servicio?.regional || ""}
                  onChange={(e) =>
                    updateFicha({ modulo1_unidad_servicio: { ...ficha.modulo1_unidad_servicio, regional: e.target.value } as any })
                  }
                />
                {!ficha.modulo1_unidad_servicio?.regional && <div className="error-text">Campo obligatorio</div>}
              </div>
              <div>
                <label>Centro Zonal <span className="required">*</span></label>
                <input
                  value={ficha.modulo1_unidad_servicio?.centro_zonal || ""}
                  onChange={(e) =>
                    updateFicha({ modulo1_unidad_servicio: { ...ficha.modulo1_unidad_servicio, centro_zonal: e.target.value } as any })
                  }
                />
                {!ficha.modulo1_unidad_servicio?.centro_zonal && <div className="error-text">Campo obligatorio</div>}
              </div>
            </div>
            <div className="row">
              <div>
                <label>NIT Entidad <span className="required">*</span></label>
                <input
                  value={ficha.modulo1_unidad_servicio?.nit_entidad || ""}
                  onChange={(e) =>
                    updateFicha({ modulo1_unidad_servicio: { ...ficha.modulo1_unidad_servicio, nit_entidad: e.target.value } as any })
                  }
                />
                {!ficha.modulo1_unidad_servicio?.nit_entidad && <div className="error-text">Campo obligatorio</div>}
              </div>
              <div>
                <label>Código CUÉNTAME UDS <span className="required">*</span></label>
                <input
                  value={ficha.modulo1_unidad_servicio?.codigo_cuentame_uds || ""}
                  onChange={(e) =>
                    updateFicha({
                      modulo1_unidad_servicio: { ...ficha.modulo1_unidad_servicio, codigo_cuentame_uds: e.target.value } as any
                    })
                  }
                />
                {!ficha.modulo1_unidad_servicio?.codigo_cuentame_uds && <div className="error-text">Campo obligatorio</div>}
              </div>
            </div>
            <div>
              <label>Nombre del Agente Educativo <span className="required">*</span></label>
              <input
                value={ficha.modulo1_unidad_servicio?.nombre_agente_educativo || ""}
                onChange={(e) =>
                  updateFicha({
                    modulo1_unidad_servicio: { ...ficha.modulo1_unidad_servicio, nombre_agente_educativo: e.target.value } as any
                  })
                }
              />
              {!ficha.modulo1_unidad_servicio?.nombre_agente_educativo && <div className="error-text">Campo obligatorio</div>}
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="fade-in">
            <h2 className="section-title">Familia y composición del hogar</h2>
            <h3>O. Variables básicas</h3>
            <div className="row">
              <div>
                <label>Tipo documento del usuario(a) <span className="required">*</span></label>
                <BridgeSelect
                  value={ficha.modulo3_familia?.tipo_documento_usuario || "Registro Civil"}
                  onChange={(v) =>
                    updateFicha({
                      modulo3_familia: {
                        ...ficha.modulo3_familia,
                        tipo_documento_usuario: v as any
                      } as any
                    })
                  }
                >
                  <option>Registro Civil</option>
                  <option>Cédula de ciudadanía</option>
                  <option>Tarjeta de identidad</option>
                  <option>Pasaporte</option>
                  <option>Permiso especial de permanencia (PEP)</option>
                  <option>No tiene</option>
                </BridgeSelect>
                {!ficha.modulo3_familia?.tipo_documento_usuario && <div className="error-text">Campo obligatorio</div>}
              </div>
              <div>
                <label>
                  Número de documento{" "}
                  {ficha.modulo3_familia?.tipo_documento_usuario !== "No tiene" && <span className="required">*</span>}
                </label>
                <input
                  value={ficha.modulo3_familia?.numero_documento_usuario || ""}
                  onChange={(e) =>
                    updateFicha({
                      modulo3_familia: {
                        ...ficha.modulo3_familia,
                        numero_documento_usuario: e.target.value
                      } as any
                    })
                  }
                />
                {ficha.modulo3_familia?.tipo_documento_usuario !== "No tiene" &&
                  !ficha.modulo3_familia?.numero_documento_usuario && <div className="error-text">Campo obligatorio</div>}
              </div>
              <div>
                <label>Número de personas del hogar <span className="required">*</span></label>
                <input
                  type="number"
                  value={String(ficha.modulo3_familia?.numero_personas_hogar ?? 0)}
                  onChange={(e) => {
                    const num = Number(e.target.value || 0);
                    const current = ficha.modulo3_familia?.integrantes || [];
                    let lista = [...current];
                    if (num > lista.length) {
                      for (let i = lista.length; i < num; i++) {
                        lista.push({
                          parentesco: "Padre",
                          nombres_apellidos: "",
                          tipo_documento: "Registro Civil",
                          numero_documento: ""
                        } as IntegranteHogar);
                      }
                    } else if (num < lista.length) {
                      lista = lista.slice(0, Math.max(0, num));
                    }
                    updateFicha({
                      modulo3_familia: {
                        ...ficha.modulo3_familia,
                        numero_personas_hogar: num,
                        integrantes: lista
                      } as any
                    });
                  }}
                />
                {(ficha.modulo3_familia?.numero_personas_hogar == null ||
                  (ficha.modulo3_familia?.numero_personas_hogar as any) === "") && <div className="error-text">Campo obligatorio</div>}
              </div>
            </div>
            <h3>P. Composición del hogar</h3>
            <div className="actions" style={{ marginBottom: 8 }}>
              <button
                onClick={() => {
                  const lista = [...(ficha.modulo3_familia?.integrantes || [])];
                  lista.push({
                    parentesco: "Padre",
                    nombres_apellidos: "",
                    tipo_documento: "Registro Civil",
                    numero_documento: ""
                  } as IntegranteHogar);
                  updateFicha({
                    modulo3_familia: {
                      ...ficha.modulo3_familia,
                      integrantes: lista,
                      numero_personas_hogar: lista.length
                    } as any
                  });
                }}
              >
                Agregar integrante
              </button>
            </div>
            {(ficha.modulo3_familia?.integrantes || []).map((m, idx) => (
              <div key={idx} className="card pop-in" style={{ marginBottom: 12 }}>
                <div className="row">
                  <div>
                    <label>Parentesco</label>
                    <BridgeSelect
                      value={m.parentesco}
                      onChange={(v) => {
                        const lista = [...(ficha.modulo3_familia?.integrantes || [])];
                        lista[idx] = { ...m, parentesco: v as any };
                        updateFicha({ modulo3_familia: { ...ficha.modulo3_familia, integrantes: lista } as any });
                      }}
                    >
                      <option>Padre</option>
                      <option>Madre</option>
                      <option>Hijo-a</option>
                      <option>Hermana-o</option>
                      <option>Prima-o</option>
                      <option>Sobrina-o</option>
                      <option>Nieta-o</option>
                      <option>Cónyuge</option>
                      <option>Padrastro</option>
                      <option>Madrastra</option>
                      <option>Hijastra-o</option>
                      <option>Abuela-o</option>
                      <option>Tía-o</option>
                      <option>Suegra-o</option>
                      <option>Nuera</option>
                      <option>Yerno</option>
                      <option>Cuñada-o</option>
                      <option>Padrino</option>
                      <option>Madrina</option>
                      <option>Familia sustituta / institución de protección</option>
                      <option>Otro</option>
                    </BridgeSelect>
                  </div>
                  {m.parentesco === "Otro" && (
                    <div>
                      <label>Indique parentesco</label>
                      <input
                        value={m.parentesco_otro || ""}
                        onChange={(e) => {
                          const lista = [...(ficha.modulo3_familia?.integrantes || [])];
                          lista[idx] = { ...m, parentesco_otro: e.target.value };
                          updateFicha({ modulo3_familia: { ...ficha.modulo3_familia, integrantes: lista } as any });
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="row">
                  <div>
                    <label>Nombres y apellidos</label>
                    <input
                      value={m.nombres_apellidos || ""}
                      onChange={(e) => {
                        const lista = [...(ficha.modulo3_familia?.integrantes || [])];
                        lista[idx] = { ...m, nombres_apellidos: e.target.value };
                        updateFicha({ modulo3_familia: { ...ficha.modulo3_familia, integrantes: lista } as any });
                      }}
                    />
                  </div>
                  <div>
                    <label>Tipo de documento</label>
                    <BridgeSelect
                      value={m.tipo_documento}
                      onChange={(v) => {
                        const lista = [...(ficha.modulo3_familia?.integrantes || [])];
                        lista[idx] = { ...m, tipo_documento: v as any };
                        updateFicha({ modulo3_familia: { ...ficha.modulo3_familia, integrantes: lista } as any });
                      }}
                    >
                      <option>Registro Civil</option>
                      <option>Cédula de ciudadanía</option>
                      <option>Tarjeta de identidad</option>
                      <option>Pasaporte</option>
                      <option>Permiso especial de permanencia (PEP)</option>
                      <option>No tiene</option>
                    </BridgeSelect>
                  </div>
                  <div>
                    <label>Número de documento</label>
                    <input
                      value={m.numero_documento || ""}
                      onChange={(e) => {
                        const lista = [...(ficha.modulo3_familia?.integrantes || [])];
                        lista[idx] = { ...m, numero_documento: e.target.value };
                        updateFicha({ modulo3_familia: { ...ficha.modulo3_familia, integrantes: lista } as any });
                      }}
                    />
                  </div>
                </div>
                <div className="row">
                  <div>
                    <label>Fecha de nacimiento</label>
                    <input
                      type="date"
                      value={toIso(m.fecha_nacimiento) || ""}
                      onChange={(e) => {
                        const ddmm = toDDMMYYYY(e.target.value);
                        const years = yearsFrom(e.target.value);
                        const lista = [...(ficha.modulo3_familia?.integrantes || [])];
                        lista[idx] = { ...m, fecha_nacimiento: ddmm, edad: years };
                        updateFicha({ modulo3_familia: { ...ficha.modulo3_familia, integrantes: lista } as any });
                      }}
                    />
                  </div>
                  <div>
                    <label>Edad</label>
                    <input
                      value={String(m.edad ?? "")}
                      onChange={(e) => {
                        const lista = [...(ficha.modulo3_familia?.integrantes || [])];
                        lista[idx] = { ...m, edad: Number(e.target.value || 0) };
                        updateFicha({ modulo3_familia: { ...ficha.modulo3_familia, integrantes: lista } as any });
                      }}
                    />
                  </div>
                  <div>
                    <label>País de nacimiento</label>
                    <input
                      value={m.pais_nacimiento || ""}
                      onChange={(e) => {
                        const lista = [...(ficha.modulo3_familia?.integrantes || [])];
                        lista[idx] = { ...m, pais_nacimiento: e.target.value };
                        updateFicha({ modulo3_familia: { ...ficha.modulo3_familia, integrantes: lista } as any });
                      }}
                    />
                  </div>
                </div>
                <div className="row">
                  <div>
                    <label>Sexo</label>
                    <BridgeSelect
                      value={m.sexo || "Mujer"}
                      onChange={(v) => {
                        const lista = [...(ficha.modulo3_familia?.integrantes || [])];
                        lista[idx] = { ...m, sexo: v as any };
                        updateFicha({ modulo3_familia: { ...ficha.modulo3_familia, integrantes: lista } as any });
                      }}
                    >
                      <option>Mujer</option>
                      <option>Hombre</option>
                      <option>Intersexual</option>
                    </BridgeSelect>
                  </div>
                  <div>
                    <label>Género</label>
                    <input
                      value={m.genero || ""}
                      onChange={(e) => {
                        const lista = [...(ficha.modulo3_familia?.integrantes || [])];
                        lista[idx] = { ...m, genero: e.target.value };
                        updateFicha({ modulo3_familia: { ...ficha.modulo3_familia, integrantes: lista } as any });
                      }}
                    />
                  </div>
                  <div>
                    <label>Orientación sexual</label>
                    <input
                      value={m.orientacion_sexual || ""}
                      onChange={(e) => {
                        const lista = [...(ficha.modulo3_familia?.integrantes || [])];
                        lista[idx] = { ...m, orientacion_sexual: e.target.value };
                        updateFicha({ modulo3_familia: { ...ficha.modulo3_familia, integrantes: lista } as any });
                      }}
                    />
                  </div>
                </div>
                <div className="row">
                  <div>
                    <label>Grupo étnico</label>
                    <BridgeSelect
                      value={m.grupo_etnico || "Ninguno"}
                      onChange={(v) => {
                        const lista = [...(ficha.modulo3_familia?.integrantes || [])];
                        lista[idx] = { ...m, grupo_etnico: v as any };
                        updateFicha({ modulo3_familia: { ...ficha.modulo3_familia, integrantes: lista } as any });
                      }}
                    >
                      <option>Población indígena</option>
                      <option>Población Negra</option>
                      <option>Población Afrocolombiana</option>
                      <option>Población Raizal descendiente del Archipiélago de San Andrés, Providencia y Santa Catalina</option>
                      <option>Población Gitana o Rrom</option>
                      <option>Población Palenquera</option>
                      <option>Ninguno</option>
                    </BridgeSelect>
                  </div>
                  <div>
                    <label>¿Sabe leer y escribir?</label>
                    <BridgeSelect
                      value={m.sabe_leer_escribir || "No"}
                      onChange={(v) => {
                        const lista = [...(ficha.modulo3_familia?.integrantes || [])];
                        lista[idx] = { ...m, sabe_leer_escribir: v as any };
                        updateFicha({ modulo3_familia: { ...ficha.modulo3_familia, integrantes: lista } as any });
                      }}
                    >
                      <option>Sí</option>
                      <option>No</option>
                    </BridgeSelect>
                  </div>
                  <div>
                    <label>¿Actualmente estudia?</label>
                    <BridgeSelect
                      value={m.actualmente_estudia || "No"}
                      onChange={(v) => {
                        const lista = [...(ficha.modulo3_familia?.integrantes || [])];
                        lista[idx] = { ...m, actualmente_estudia: v as any };
                        updateFicha({ modulo3_familia: { ...ficha.modulo3_familia, integrantes: lista } as any });
                      }}
                    >
                      <option>Sí</option>
                      <option>No</option>
                    </BridgeSelect>
                  </div>
                </div>
                <div className="row">
                  <div>
                    <label>Nivel educativo más alto</label>
                    <input
                      value={m.nivel_educativo_mas_alto || ""}
                      onChange={(e) => {
                        const lista = [...(ficha.modulo3_familia?.integrantes || [])];
                        lista[idx] = { ...m, nivel_educativo_mas_alto: e.target.value };
                        updateFicha({ modulo3_familia: { ...ficha.modulo3_familia, integrantes: lista } as any });
                      }}
                    />
                  </div>
                  <div>
                    <label>Actividad principal actual</label>
                    <input
                      value={m.actividad_principal_actual || ""}
                      onChange={(e) => {
                        const lista = [...(ficha.modulo3_familia?.integrantes || [])];
                        lista[idx] = { ...m, actividad_principal_actual: e.target.value };
                        updateFicha({ modulo3_familia: { ...ficha.modulo3_familia, integrantes: lista } as any });
                      }}
                    />
                  </div>
                  <div>
                    <label>Tipo de vinculación laboral</label>
                    <input
                      value={m.tipo_vinculacion_laboral || ""}
                      onChange={(e) => {
                        const lista = [...(ficha.modulo3_familia?.integrantes || [])];
                        lista[idx] = { ...m, tipo_vinculacion_laboral: e.target.value };
                        updateFicha({ modulo3_familia: { ...ficha.modulo3_familia, integrantes: lista } as any });
                      }}
                    />
                  </div>
                </div>
                <div className="row">
                  <div>
                    <label>Ingreso mensual promedio</label>
                    <input
                      value={m.ingreso_mensual_promedio || ""}
                      onChange={(e) => {
                        const lista = [...(ficha.modulo3_familia?.integrantes || [])];
                        lista[idx] = { ...m, ingreso_mensual_promedio: e.target.value };
                        updateFicha({ modulo3_familia: { ...ficha.modulo3_familia, integrantes: lista } as any });
                      }}
                    />
                  </div>
                  <div>
                    <label>Observaciones</label>
                    <input
                      value={m.observaciones || ""}
                      onChange={(e) => {
                        const lista = [...(ficha.modulo3_familia?.integrantes || [])];
                        lista[idx] = { ...m, observaciones: e.target.value };
                        updateFicha({ modulo3_familia: { ...ficha.modulo3_familia, integrantes: lista } as any });
                      }}
                    />
                  </div>
                </div>
                <div className="actions" style={{ marginTop: 8 }}>
                  <button
                    onClick={() => {
                      const lista = [...(ficha.modulo3_familia?.integrantes || [])];
                      lista.splice(idx, 1);
                      updateFicha({
                        modulo3_familia: {
                          ...ficha.modulo3_familia,
                          integrantes: lista,
                          numero_personas_hogar: lista.length
                        } as any
                      });
                    }}
                  >
                    Quitar integrante
                  </button>
                </div>
              </div>
            ))}

            <h3>Q. Características de la vivienda</h3>
            <div className="row">
              <div>
                <label>Clase de ubicación</label>
                <BridgeSelect
                  value={ficha.modulo3_familia?.clase_ubicacion || ""}
                  onChange={(v) =>
                    updateFicha({
                      modulo3_familia: { ...ficha.modulo3_familia, clase_ubicacion: v as any } as any
                    })
                  }
                >
                  <option value="">Seleccione</option>
                  <option>Cabecera municipal</option>
                  <option>Centro poblado</option>
                  <option>Rural disperso</option>
                </BridgeSelect>
              </div>
              <div>
                <label>Territorio étnico</label>
                <BridgeSelect
                  value={ficha.modulo3_familia?.territorio_etnico || ""}
                  onChange={(v) =>
                    updateFicha({
                      modulo3_familia: { ...ficha.modulo3_familia, territorio_etnico: v as any } as any
                    })
                  }
                >
                  <option value="">Seleccione</option>
                  <option>SI</option>
                  <option>NO</option>
                </BridgeSelect>
              </div>
            </div>
            {ficha.modulo3_familia?.territorio_etnico === "SI" && (
              <div className="row">
                <div>
                  <label>Tipo de territorio</label>
                  <BridgeSelect
                    value={ficha.modulo3_familia?.territorio_tipo || ""}
                    onChange={(v) =>
                      updateFicha({
                        modulo3_familia: { ...ficha.modulo3_familia, territorio_tipo: v as any } as any
                      })
                    }
                  >
                    <option value="">Seleccione</option>
                    <option>Resguardo indígena</option>
                    <option>Territorio colectivo comunidad negra</option>
                    <option>No aplica</option>
                  </BridgeSelect>
                </div>
                <div>
                  <label>Nombre de la comunidad</label>
                  <input
                    value={ficha.modulo3_familia?.nombre_comunidad || ""}
                    onChange={(e) =>
                      updateFicha({
                        modulo3_familia: { ...ficha.modulo3_familia, nombre_comunidad: e.target.value } as any
                      })
                    }
                  />
                </div>
              </div>
            )}
            <div className="row">
              <div>
                <label>Tipo de vivienda</label>
                <BridgeSelect
                  value={ficha.modulo3_familia?.tipo_vivienda || ""}
                  onChange={(v) =>
                    updateFicha({
                      modulo3_familia: { ...ficha.modulo3_familia, tipo_vivienda: v as any } as any
                    })
                  }
                >
                  <option value="">Seleccione</option>
                  <option>Casa</option>
                  <option>Cambuche</option>
                  <option>Apartamento</option>
                  <option>Vivienda tradicional indígena</option>
                  <option>Rancho</option>
                  <option>Finca</option>
                  <option>Casa lote</option>
                  <option>Establecimiento de reclusión</option>
                  <option>Otra</option>
                </BridgeSelect>
              </div>
              {ficha.modulo3_familia?.tipo_vivienda === "Otra" && (
                <div>
                  <label>Otra vivienda</label>
                  <input
                    value={ficha.modulo3_familia?.tipo_vivienda_otra || ""}
                    onChange={(e) =>
                      updateFicha({
                        modulo3_familia: { ...ficha.modulo3_familia, tipo_vivienda_otra: e.target.value } as any
                      })
                    }
                  />
                </div>
              )}
            </div>
            <div className="row">
              <div>
                <label>Tipo de tenencia</label>
                <BridgeSelect
                  value={ficha.modulo3_familia?.tipo_tenencia || ""}
                  onChange={(v) =>
                    updateFicha({
                      modulo3_familia: { ...ficha.modulo3_familia, tipo_tenencia: v as any } as any
                    })
                  }
                >
                  <option value="">Seleccione</option>
                  <option>Propia</option>
                  <option>Familiar</option>
                  <option>En arriendo</option>
                  <option>Ocupador de hecho</option>
                  <option>En concesión</option>
                  <option>Otra</option>
                </BridgeSelect>
              </div>
              {ficha.modulo3_familia?.tipo_tenencia === "Otra" && (
                <div>
                  <label>Otra tenencia</label>
                  <input
                    value={ficha.modulo3_familia?.tipo_tenencia_otra || ""}
                    onChange={(e) =>
                      updateFicha({
                        modulo3_familia: { ...ficha.modulo3_familia, tipo_tenencia_otra: e.target.value } as any
                      })
                    }
                  />
                </div>
              )}
            </div>
          </div>
        )}
        <div className="actions">
          <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            Anterior
          </button>
          <button onClick={() => setStep((s) => Math.min(STEPS - 1, s + 1))} disabled={!canNext || step === STEPS - 1}>
            Siguiente
          </button>
          <button onClick={() => guardar("borrador")} disabled={saving}>
            {saving ? "Guardando..." : "Guardar borrador"}
          </button>
          <button className="primary" onClick={() => guardar("enviado")} disabled={!canNext || saving}>
            Enviar
          </button>
        </div>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
