import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type MenuItem = {
  label: string;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
};

export default function ActionMenu({
  label = "Opciones",
  items,
  align = "right",
  ariaLabel = "Menú de acciones",
}: {
  label?: string;
  items: MenuItem[];
  align?: "left" | "right";
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [rect, setRect] = useState<{ left: number; right: number; top: number; bottom: number } | null>(null);

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

  useEffect(() => {
    if (open) {
      setActiveIndex(0);
      const el = itemRefs.current[0];
      el?.focus();
      const r = triggerRef.current?.getBoundingClientRect();
      if (r) setRect({ left: r.left, right: r.right, top: r.top, bottom: r.bottom });
    }
  }, [open]);

  useEffect(() => {
    function onWin() {
      if (!open) return;
      const r = triggerRef.current?.getBoundingClientRect();
      if (r) setRect({ left: r.left, right: r.right, top: r.top, bottom: r.bottom });
    }
    window.addEventListener("scroll", onWin, true);
    window.addEventListener("resize", onWin);
    return () => {
      window.removeEventListener("scroll", onWin, true);
      window.removeEventListener("resize", onWin);
    };
  }, [open]);

  function onMenuKey(e: React.KeyboardEvent<HTMLDivElement>) {
    const max = items.length - 1;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.min(activeIndex + 1, max);
      setActiveIndex(next);
      itemRefs.current[next]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = Math.max(activeIndex - 1, 0);
      setActiveIndex(prev);
      itemRefs.current[prev]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
      itemRefs.current[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(max);
      itemRefs.current[max]?.focus();
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="action-menu">
      <button
        type="button"
        className={`menu-trigger ${open ? "open" : ""}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKey}
        ref={triggerRef}
      >
        <span className="trigger-icon" />
        {label}
        <span className="trigger-caret" />
      </button>
      {open && rect && typeof document !== "undefined" &&
        createPortal(
          <div
            className={`menu ${align}`}
            role="menu"
            aria-orientation="vertical"
            onKeyDown={onMenuKey}
            style={{
              position: "fixed",
              top: Math.round(rect.bottom + 6),
              left: align === "left" ? Math.round(rect.left) : Math.max(Math.round(rect.right - 200), 8)
            }}
          >
            {items.map((it, idx) => (
              <button
                key={idx}
                ref={(el) => (itemRefs.current[idx] = el)}
                className={`menu-item ${it.danger ? "danger" : ""} ${activeIndex === idx ? "active" : ""} ${it.disabled ? "disabled" : ""}`}
                role="menuitem"
                tabIndex={-1}
                aria-disabled={it.disabled ? "true" : "false"}
                onClick={() => {
                  if (it.disabled) return;
                  setOpen(false);
                  it.onClick();
                }}
              >
                {it.label}
              </button>
            ))}
          </div>,
          document.body
        )
      }
    </div>
  );
}
