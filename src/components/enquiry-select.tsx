"use client";

import { useId, useRef, useState } from "react";

type Option = { value: string; label: string };

/** Styled disclosure with standard radio keyboard navigation and form validation. */
export function EnquirySelect({ name, label, placeholder, options, required = false, value: controlledValue, defaultValue = "", onValueChange }: {
  name: string; label: string; placeholder: string; options: Option[]; required?: boolean; value?: string; defaultValue?: string; onValueChange?: (value: string) => void;
}) {
  const id = useId();
  const disclosure = useRef<HTMLDetailsElement>(null);
  const summary = useRef<HTMLElement>(null);
  const [localValue, setValue] = useState(defaultValue);
  const value = controlledValue ?? localValue;
  const selected = options.find(option => option.value === value);

  return <fieldset className="enquiry-select">
    <legend id={id}>{label}</legend>
    <details ref={disclosure} onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) event.currentTarget.open = false;
    }} onKeyDown={event => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (disclosure.current) disclosure.current.open = false;
        summary.current?.focus();
      }
    }}>
      <summary ref={summary} aria-labelledby={id + " " + id + "-value"}>
        <span id={id + "-value"} className={selected ? "" : "enquiry-select-placeholder"}>{selected?.label || placeholder}</span>
        <span className="enquiry-select-chevron" aria-hidden="true" />
      </summary>
      <div className="enquiry-select-options">
        {options.map(option => <label key={option.value} className={value === option.value ? "is-selected" : ""}
          // Keep focus on the summary until the label activates its radio.
          // Otherwise a pointer press on the label can blur and close details
          // before the browser dispatches the option's click/change events.
          onPointerDown={event => event.preventDefault()}>
          <input type="radio" name={name} value={option.value} required={required} checked={value === option.value}
            onInvalid={() => { if (disclosure.current) disclosure.current.open = true; }}
            onChange={() => {
              setValue(option.value);
              onValueChange?.(option.value);
              if (disclosure.current) disclosure.current.open = false;
              summary.current?.focus();
            }}
            onClick={() => {
              if (value === option.value) {
                if (disclosure.current) disclosure.current.open = false;
                summary.current?.focus();
              }
            }} />
          <span>{option.label}</span>
          <span className="enquiry-select-check" aria-hidden="true">{value === option.value ? "✓" : ""}</span>
        </label>)}
      </div>
    </details>
  </fieldset>;
}
