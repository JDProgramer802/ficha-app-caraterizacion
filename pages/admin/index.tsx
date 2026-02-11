import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

type Item = {
  id: string;
  estado: "borrador" | "enviado";
  fecha: string;
  regional?: string;
  centro_zonal?: string;
  nombre_nina_nino?: string;
  documento?: string;
  updatedAt: string;
  currentStep?: number;
};

export default function Admin() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [q, setQ] = useState({ estado: "", fecha: "", regional: "", centro_zonal: "", nombre: "", documento: "" });
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q.estado) params.set("estado", q.estado);
      if (q.fecha) params.set("fecha", q.fecha);
      if (q.regional) params.set("regional", q.regional);
      if (q.centro_zonal) params.set("centro_zonal", q.centro_zonal);
      if (q.nombre) params.set("nombre", q.nombre);
      if (q.documento) params.set("documento", q.documento);
      const url = params.toString() ? `/api/fichas?${params.toString()}` : "/api/fichas";
      const r = await fetch(url);
      const data = await r.json();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (q.estado && i.estado !== q.estado) return false;
      if (q.fecha && i.fecha !== q.fecha) return false;
      if (q.regional && !(i.regional || "").toLowerCase().includes(q.regional.toLowerCase())) return false;
      if (q.centro_zonal && !(i.centro_zonal || "").toLowerCase().includes(q.centro_zonal.toLowerCase())) return false;
      if (q.nombre && !(i.nombre_nina_nino || "").toLowerCase().includes(q.nombre.toLowerCase())) return false;
      if (q.documento && !(i.documento || "").toLowerCase().includes(q.documento.toLowerCase())) return false;
      return true;
    });
  }, [items, q]);

  return (
    <div className="admin-shell">
      <div className="admin-header">
        <h1>Admin de fichas</h1>
        <div className="header-actions">
          <button onClick={() => router.push("/")}>Inicio</button>
          <button className="primary" onClick={async () => {
            const r = await fetch("/api/fichas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
            if (!r.ok) return;
            const data = await r.json();
            router.push(`/admin/ficha/${data.id}`);
          }}>Crear nueva</button>
          <a href="/api/fichas/export/excel">Exportar Excel</a>
        </div>
      </div>
      <div className="admin-main">
        <div className="filters-grid">
          <select value={q.estado} onChange={(e) => setQ({ ...q, estado: e.target.value })}>
            <option value="">Estado</option>
            <option value="borrador">Borrador</option>
            <option value="enviado">Enviado</option>
          </select>
          <input placeholder="Fecha (DD/MM/AAAA)" value={q.fecha} onChange={(e) => setQ({ ...q, fecha: e.target.value })} />
          <input placeholder="Regional" value={q.regional} onChange={(e) => setQ({ ...q, regional: e.target.value })} />
          <input placeholder="Centro Zonal" value={q.centro_zonal} onChange={(e) => setQ({ ...q, centro_zonal: e.target.value })} />
          <input placeholder="Nombre niña/niño" value={q.nombre} onChange={(e) => setQ({ ...q, nombre: e.target.value })} />
          <input placeholder="Documento" value={q.documento} onChange={(e) => setQ({ ...q, documento: e.target.value })} />
          <button onClick={load}>Aplicar filtros</button>
        </div>
        <div className="admin-table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Regional</th>
              <th>Centro Zonal</th>
              <th>Nombre</th>
              <th>Documento</th>
              <th>Progreso</th>
              <th>Actualizada</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((i) => (
              <tr key={i.id}>
                <td>{i.id}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className={`chip ${i.estado === "enviado" ? "success" : "gray"}`}>
                      <span className="dot" />
                      {i.estado}
                    </span>
                    <select
                      value={i.estado}
                      onChange={async (e) => {
                        await fetch(`/api/fichas/${i.id}/status`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ estado: e.target.value })
                        });
                        await load();
                      }}
                    >
                      <option value="borrador">borrador</option>
                      <option value="enviado">enviado</option>
                    </select>
                  </div>
                </td>
                <td>{i.fecha}</td>
                <td>{i.regional}</td>
                <td>{i.centro_zonal}</td>
                <td>{i.nombre_nina_nino || "-"}</td>
                <td>{i.documento || "-"}</td>
                <td>
                  <div className="mini-progress">
                    <span style={{ width: `${Math.round((((i.currentStep ?? 0) + 1) / 5) * 100)}%` }} />
                  </div>
                </td>
                <td>{new Date(i.updatedAt).toLocaleString()}</td>
                <td>
                  <div className="admin-actions">
                    <button onClick={() => router.push(`/admin/ficha/${i.id}`)}>Ver</button>
                    <a href={`/api/fichas/${i.id}/export/pdf`}>PDF</a>
                    <a href={`/api/fichas/${i.id}/export/excel`}>Excel</a>
                    <button
                      onClick={() => {
                        const url = `${location.origin}/ficha/${i.id}`;
                        navigator.clipboard?.writeText(url);
                      }}
                    >
                      Copiar enlace
                    </button>
                    <button onClick={() => router.push(`/ficha/${i.id}`)}>Ver pública</button>
                    <button
                      onClick={async () => {
                        const ok = typeof window !== "undefined" ? window.confirm("¿Eliminar ficha?") : true;
                        if (!ok) return;
                        await fetch(`/api/fichas/${i.id}`, { method: "DELETE" });
                        await load();
                      }}
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          const r = await fetch(`/api/fichas/${i.id}`);
                          const ficha = await r.json();
                          const nuevo = { ...ficha, id: undefined, estado: "borrador" as const };
                          const create = await fetch("/api/fichas", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(nuevo)
                          });
                          if (!create.ok) return;
                          const data = await create.json();
                          router.push(`/admin/ficha/${data.id}`);
                        } catch {}
                      }}
                    >
                      Duplicar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {loading && <div style={{ marginTop: 8 }} className="muted">Cargando...</div>}
      </div>
    </div>
  );
}
