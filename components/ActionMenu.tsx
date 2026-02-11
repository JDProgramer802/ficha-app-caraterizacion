import React, { useEffect, useRef, useState } from "react";

export type MenuItem = {
  label: string;
  onClick: () => void;
  danger?: boolean;
};

export default function ActionMenu({
  label = "Opciones",
  items,
  align = "right",
}: {
  label?: string;
  items: MenuItem[];
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function onKey(e: React.KeyboardEvent) {
    if (e.key === "Escape") setOpen(false);
    if ((e.key === "Enter" || e.key === " ") && !open) {
      setOpen(true);
      e.preventDefault();
    }
  }

  return (
    <div ref={rootRef} className="action-menu">
      <button
        type="button"
        className="menu-trigger"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKey}
      >
        {label}
        <span className="trigger-caret" />
      </button>
      {open && (
        <div className={`menu ${align}`}>
          {items.map((it, idx) => (
            <button
              key={idx}
              className={`menu-item ${it.danger ? "danger" : ""}`}
              onClick={() => {
                setOpen(false);
                it.onClick();
              }}
            >
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
