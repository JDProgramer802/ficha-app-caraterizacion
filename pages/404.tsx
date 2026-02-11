import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ActionMenu from "../components/ActionMenu";

export default function NotFound() {
  const router = useRouter();
  const [hasFicha, setHasFicha] = useState(false);
  const [hasAdminFicha, setHasAdminFicha] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const cookies = document.cookie || "";
    setHasFicha(cookies.includes("fichaId="));
    setHasAdminFicha(cookies.includes("adminFichaId="));
  }, []);

  return (
    <div className="container">
      <div className="card" style={{ textAlign: "center", paddingTop: 32, paddingBottom: 32 }}>
        <div className="chip gray" style={{ margin: "0 auto 8px", width: "fit-content" }}>
          <span className="dot" />
          404
        </div>
        <h1 style={{ margin: 0 }}>Página no encontrada</h1>
        <p className="muted" style={{ marginTop: 8 }}>
          No pudimos encontrar el contenido que buscas. Revisa el enlace o vuelve al inicio.
        </p>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
          <ActionMenu
            label="Opciones"
            items={[
              { label: "Ir al inicio", onClick: () => router.push("/") },
              { label: "Ir al panel Admin", onClick: () => router.push("/admin") },
              ...(hasFicha ? [{ label: "Volver a la ficha", onClick: () => router.push("/ficha") }] : []),
              ...(hasAdminFicha ? [{ label: "Volver a ficha (Admin)", onClick: () => router.push("/admin/ficha") }] : []),
            ]}
          />
        </div>
      </div>
    </div>
  );
}
