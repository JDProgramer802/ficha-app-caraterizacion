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
};

export default function Admin() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [q, setQ] = useState({ estado: "", fecha: "", regional: "", centro_zonal: "", nombre: "", documento: "" });

  useEffect(() => {
    fetch("/api/fichas")
      .then((r) => r.json())
      .then(setItems);
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
    <div className="container">
      <div className="card">
        <h1>Admin de fichas</h1>
        <div className="filters">
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
        </div>
        <div className="actions">
          <button onClick={() => router.push("/")}>Volver</button>
          <a href="/api/fichas/export/excel" style={{ marginLeft: "auto" }}>
            Exportar todas a Excel
          </a>
        </div>
        <table className="table" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Regional</th>
              <th>Centro Zonal</th>
              <th>Actualizada</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((i) => (
              <tr key={i.id}>
                <td>{i.id}</td>
                <td>{i.estado}</td>
                <td>{i.fecha}</td>
                <td>{i.regional}</td>
                <td>{i.centro_zonal}</td>
                <td>{new Date(i.updatedAt).toLocaleString()}</td>
                <td>
                  <button onClick={() => router.push(`/admin/ficha/${i.id}`)}>Ver</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
