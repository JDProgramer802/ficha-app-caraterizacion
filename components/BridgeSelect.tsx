import React, { ReactElement } from "react";
import FancySelect from "./FancySelect";

type OptionDef = { label: string; value: string };

export default function BridgeSelect({
  value,
  onChange,
  children,
  placeholder,
  compact
}: {
  value: string;
  onChange: (v: string) => void;
  children: ReactElement[] | ReactElement;
  placeholder?: string;
  compact?: boolean;
}) {
  const arr = Array.isArray(children) ? children : [children];
  const options: OptionDef[] = arr
    .filter(Boolean)
    .map((el: any) => {
      const val = el?.props?.value ?? (typeof el?.props?.children === "string" ? el.props.children : "");
      const label = typeof el?.props?.children === "string" ? el.props.children : String(el?.props?.value ?? "");
      return { value: String(val ?? ""), label: label || String(val ?? "") };
    });

  return (
    <FancySelect
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      compact={compact}
    />
  );
}
