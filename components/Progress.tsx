import React from "react";

type Props = { current: number; total: number };

export default function Progress({ current, total }: Props) {
  const pct = Math.round(((current + 1) / total) * 100);
  return (
    <div className="progress" aria-label="Progreso">
      <div className="progress-inner" style={{ width: `${pct}%` }} />
    </div>
  );
}
