import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import FancySelect from "../../components/FancySelect";
import ActionMenu from "../../components/ActionMenu";

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
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

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
      setPage(0);
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
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = useMemo(() => {
    const start = page * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

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
            if (typeof document !== "undefined") {
              document.cookie = `adminFichaId=${data.id}; path=/; max-age=3600`;
            }
            router.push(`/admin/ficha`);
          }}>Crear nueva</button>
          <a href="/api/fichas/export/excel">Exportar Excel</a>
        </div>
      </div>
      <div className="admin-main">
        <div className="filters-grid">
          <FancySelect
            value={q.estado}
            onChange={(v) => setQ({ ...q, estado: v })}
            options={[
              { value: "", label: "Estado" },
              { value: "borrador", label: "Borrador" },
              { value: "enviado", label: "Enviado" }
            ]}
            placeholder="Estado"
          />
          <input placeholder="Fecha (DD/MM/AAAA)" value={q.fecha} onChange={(e) => setQ({ ...q, fecha: e.target.value })} />
          <input placeholder="Regional" value={q.regional} onChange={(e) => setQ({ ...q, regional: e.target.value })} />
          <input placeholder="Centro Zonal" value={q.centro_zonal} onChange={(e) => setQ({ ...q, centro_zonal: e.target.value })} />
          <input placeholder="Nombre niña/niño" value={q.nombre} onChange={(e) => setQ({ ...q, nombre: e.target.value })} />
          <input placeholder="Documento" value={q.documento} onChange={(e) => setQ({ ...q, documento: e.target.value })} />
          <button onClick={load}>Aplicar filtros</button>
          <FancySelect
            compact
            value={String(pageSize)}
            onChange={(v) => {
              const n = Number(v || 10);
              setPageSize(n);
              setPage(0);
            }}
            options={[
              { value: "10", label: "10 / página" },
              { value: "20", label: "20 / página" },
              { value: "50", label: "50 / página" }
            ]}
          />
        </div>
        <div className="admin-table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Ficha</th>
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
            {pageItems.map((i) => (
              <tr key={i.id}>
                <td>
                  <button
                    className="link"
                    onClick={() => {
                      if (typeof document !== "undefined") {
                        document.cookie = `adminFichaId=${i.id}; path=/; max-age=3600`;
                      }
                      router.push(`/admin/ficha`);
                    }}
                    title={i.id}
                  >
                    Ficha de caracterización
                  </button>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className={`chip ${i.estado === "enviado" ? "success" : "gray"}`}>
                      <span className="dot" />
                      {i.estado}
                    </span>
                    <FancySelect
                      compact
                      value={i.estado}
                      onChange={async (v) => {
                        await fetch(`/api/fichas/${i.id}/status`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ estado: v })
                        });
                        await load();
                      }}
                      options={[
                        { value: "borrador", label: "borrador" },
                        { value: "enviado", label: "enviado" }
                      ]}
                    />
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
                  <ActionMenu
                    label="Acciones"
                    items={[
                      {
                        label: "Ver",
                        onClick: () => {
                          if (typeof document !== "undefined") {
                            document.cookie = `adminFichaId=${i.id}; path=/; max-age=3600`;
                          }
                          router.push(`/admin/ficha`);
                        }
                      },
                      {
                        label: "Ver pública",
                        onClick: () => {
                          if (typeof document !== "undefined") {
                            document.cookie = `fichaId=${i.id}; path=/; max-age=3600`;
                          }
                          router.push(`/ficha`);
                        }
                      },
                      {
                        label: "Copiar enlace",
                        onClick: () => {
                          const url = `${location.origin}/ficha`;
                          navigator.clipboard?.writeText(url);
                        }
                      },
                      {
                        label: "Exportar PDF",
                        onClick: () => {
                          window.open(`/api/fichas/${i.id}/export/pdf`, "_blank");
                        }
                      },
                      {
                        label: "Exportar Excel",
                        onClick: () => {
                          window.open(`/api/fichas/${i.id}/export/excel`, "_blank");
                        }
                      },
                      {
                        label: "Duplicar",
                        onClick: async () => {
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
                            if (typeof document !== "undefined") {
                              document.cookie = `adminFichaId=${data.id}; path=/; max-age=3600`;
                            }
                            router.push(`/admin/ficha`);
                          } catch {}
                        }
                      },
                      {
                        label: "Eliminar",
                        danger: true,
                        onClick: async () => {
                          const ok = typeof window !== "undefined" ? window.confirm("¿Eliminar ficha?") : true;
                          if (!ok) return;
                          await fetch(`/api/fichas/${i.id}`, { method: "DELETE" });
                          await load();
                        }
                      }
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <div className="actions" style={{ marginTop: 12, justifyContent: "space-between", display: "flex" }}>
          <div className="muted">Mostrando {pageItems.length} de {filtered.length}</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>Anterior</button>
            <span>Página {page + 1} de {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>Siguiente</button>
          </div>
        </div>
        {loading && <div style={{ marginTop: 8 }} className="muted">Cargando...</div>}
      </div>
    </div>
  );
}
