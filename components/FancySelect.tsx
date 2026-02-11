import React, { useEffect, useMemo, useRef, useState } from "react";

type Option = { label: string; value: string };

export default function FancySelect({
  value,
  onChange,
  options,
  placeholder,
  compact
}: {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(-1);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const selected = useMemo(() => options.find((o) => o.value === value), [options, value]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (!el) return;
    const idx = Math.max(
      0,
      options.findIndex((o) => o.value === value)
    );
    setHover(idx);
    const child = el.querySelectorAll(".fs-option")[idx] as HTMLElement | undefined;
    if (child) child.scrollIntoView({ block: "nearest" });
  }, [open]);

  function onKey(e: React.KeyboardEvent) {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ")) {
      setOpen(true);
      e.preventDefault();
      return;
    }
    if (!open) return;
    if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      setHover((h) => Math.min(options.length - 1, h + 1));
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setHover((h) => Math.max(0, h - 1));
      e.preventDefault();
    } else if (e.key === "Enter") {
      const opt = options[Math.max(0, hover)];
      if (opt) onChange(opt.value);
      setOpen(false);
      e.preventDefault();
    }
  }

  return (
    <div ref={rootRef} className={`fancy-select ${compact ? "compact" : ""}`}>
      <button
        ref={btnRef}
        type="button"
        className={`fs-button ${open ? "open" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKey}
      >
        <span className={`fs-value ${!selected ? "placeholder" : ""}`}>
          {selected ? selected.label : placeholder || "Seleccione"}
        </span>
        <span className="fs-arrow" />
      </button>
      {open && (
        <div ref={listRef} className="fs-list" role="listbox" tabIndex={-1}>
          {options.map((opt, idx) => (
            <div
              key={opt.value + idx}
              className={`fs-option ${opt.value === value ? "selected" : ""} ${idx === hover ? "hover" : ""}`}
              role="option"
              aria-selected={opt.value === value}
              onMouseEnter={() => setHover(idx)}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              <span className="dot" />
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
