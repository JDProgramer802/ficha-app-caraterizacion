import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";

type UnidadServicio = {
  regional: string;
  centro_zonal: string;
  nit_entidad: string;
  codigo_cuentame_uds: string;
  nombre_agente_educativo: string;
};

type Ficha = {
  id: string;
  estado: "borrador" | "enviado";
  currentStep: number;
  modulo0_identificacion: { fecha_diligenciamiento: string };
  modulo1_unidad_servicio: UnidadServicio;
};

export default function AdminFicha() {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const [ficha, setFicha] = useState<Ficha | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    if (!id) return;
    fetch(`/api/fichas/${id}`)
      .then((r) => r.json())
      .then((data) => {
        const fecha = data?.modulo0_identificacion?.fecha_diligenciamiento;
        if (!fecha) {
          data.modulo0_identificacion = { fecha_diligenciamiento: toDDMMYYYY(todayIso()) };
        }
        setFicha(data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function guardar() {
    if (!ficha) return;
    setSaving(true);
    await fetch(`/api/fichas/${ficha.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(ficha) });
    setSaving(false);
  }

  async function eliminar() {
    if (!ficha) return;
    const ok = typeof window !== "undefined" ? window.confirm("¿Eliminar ficha?") : true;
    if (!ok) return;
    await fetch(`/api/fichas/${ficha.id}`, { method: "DELETE" });
    router.push("/admin");
  }

  if (loading || !ficha) {
    return (
      <div className="container">
        <div className="card">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Ficha de caracterizacion</h1>
        <div className="actions">
          <button onClick={() => router.push("/admin")}>Volver</button>
          <a href={`/api/fichas/${ficha.id}/export/pdf`} className="primary" style={{ marginLeft: "auto" }}>
            Exportar PDF
          </a>
          <a href={`/api/fichas/${ficha.id}/export/excel`}>Exportar Excel</a>
        </div>
        <h2>Módulo 0 — Identificación</h2>
        <label>Fecha de diligenciamiento</label>
        <input
          type="date"
          value={toIso(ficha.modulo0_identificacion?.fecha_diligenciamiento) || todayIso()}
          onChange={(e) =>
            setFicha({
              ...ficha,
              modulo0_identificacion: { fecha_diligenciamiento: toDDMMYYYY(e.target.value) } as any
            })
          }
        />
        <h2 style={{ marginTop: 12 }}>Módulo I — Información Unidad de Servicio</h2>
        <div>
          <label>Regional</label>
          <input
            value={ficha.modulo1_unidad_servicio.regional}
            onChange={(e) => setFicha({ ...ficha, modulo1_unidad_servicio: { ...ficha.modulo1_unidad_servicio, regional: e.target.value } })}
          />
        </div>
        <div className="row">
          <div>
            <label>Centro Zonal</label>
            <input
              value={ficha.modulo1_unidad_servicio.centro_zonal}
              onChange={(e) =>
                setFicha({ ...ficha, modulo1_unidad_servicio: { ...ficha.modulo1_unidad_servicio, centro_zonal: e.target.value } })
              }
            />
          </div>
          <div>
            <label>NIT Entidad</label>
            <input
              value={ficha.modulo1_unidad_servicio.nit_entidad}
              onChange={(e) =>
                setFicha({ ...ficha, modulo1_unidad_servicio: { ...ficha.modulo1_unidad_servicio, nit_entidad: e.target.value } })
              }
            />
          </div>
        </div>
        <div className="row">
          <div>
            <label>Código CUÉNTAME UDS</label>
            <input
              value={ficha.modulo1_unidad_servicio.codigo_cuentame_uds}
              onChange={(e) =>
                setFicha({
                  ...ficha,
                  modulo1_unidad_servicio: { ...ficha.modulo1_unidad_servicio, codigo_cuentame_uds: e.target.value }
                })
              }
            />
          </div>
          <div>
            <label>Nombre del Agente Educativo</label>
            <input
              value={ficha.modulo1_unidad_servicio.nombre_agente_educativo}
              onChange={(e) =>
                setFicha({
                  ...ficha,
                  modulo1_unidad_servicio: { ...ficha.modulo1_unidad_servicio, nombre_agente_educativo: e.target.value }
                })
              }
            />
          </div>
        </div>
        <div className="actions" style={{ marginTop: 12 }}>
          <button onClick={guardar} disabled={saving}>
            Guardar cambios
          </button>
          <button onClick={eliminar}>Eliminar ficha</button>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: {} };
};
