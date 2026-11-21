"use client";

import { useId } from "react";

type Option = { value: string; label: string };

/** Native selection keeps mouse, touch, keyboard and form validation in sync. */
export function EnquirySelect({ name, label, placeholder, options, required = false, value, defaultValue = "", onValueChange }: {
  name: string; label: string; placeholder: string; options: Option[]; required?: boolean; value?: string; defaultValue?: string; onValueChange?: (value: string) => void;
}) {
  const id = useId();
  const emptyLabel = options.find(option => option.value === "")?.label || placeholder;

  return <fieldset className="enquiry-select">
    <legend id={id}>{label}</legend>
    <select name={name} aria-labelledby={id} required={required}
      {...(value === undefined ? { defaultValue } : { value })}
      onChange={event => onValueChange?.(event.currentTarget.value)}>
      <option value="" disabled={required}>{emptyLabel}</option>
      {options.filter(option => option.value !== "").map(option =>
        <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
  </fieldset>;
}
