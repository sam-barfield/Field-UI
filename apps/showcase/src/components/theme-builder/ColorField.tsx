import { useEffect, useId, useState } from 'react';
import { IconButton, Tooltip } from '@sam.barfield/field-react';
import { X } from 'lucide-react';
import { alphaOf, isColor, toHex, withAlpha } from './color';

interface ColorFieldProps {
  label: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  /** Shown when the value is empty (optional tokens such as accent.text). */
  placeholder?: string;
  /** Extra info after the label, e.g. a contrast ratio. */
  meta?: React.ReactNode;
  optional?: boolean;
  /** Extra control after the inputs, e.g. a "generate from this" button. */
  action?: React.ReactNode;
}

/**
 * A colour swatch (native picker) plus a text field that accepts any CSS colour the contrast
 * checker understands. The picker keeps the current alpha; the text field commits on blur / Enter.
 */
export function ColorField({ label, value, onChange, placeholder, meta, optional, action }: ColorFieldProps) {
  const id = useId();
  const [text, setText] = useState(value ?? '');
  useEffect(() => setText(value ?? ''), [value]);

  const valid = text === '' ? !!optional : isColor(text);
  const commit = () => {
    if (text === (value ?? '')) return;
    if (text === '' && optional) onChange(undefined);
    else if (isColor(text)) onChange(text.trim());
  };
  const shown = value ?? placeholder;

  return (
    <div className="tb-color-field">
      <label htmlFor={`${id}-text`} className="tb-color-label">
        <span>{label}</span>
        {meta}
      </label>
      <div className="tb-color-inputs">
        <span className="tb-swatch" style={{ background: shown && isColor(shown) ? shown : 'transparent' }}>
          <input
            type="color"
            aria-label={`${label} colour picker`}
            value={shown && isColor(shown) ? toHex(shown) : '#000000'}
            onChange={e => onChange(withAlpha(e.target.value, value ? alphaOf(value) : 1))}
          />
        </span>
        <input
          id={`${id}-text`}
          aria-label={label}
          className={`tb-color-text${valid ? '' : ' invalid'}`}
          value={text}
          placeholder={placeholder}
          spellCheck={false}
          aria-invalid={valid ? undefined : true}
          onChange={e => setText(e.target.value)}
          onBlur={commit}
          onKeyDown={e => {
            if (e.key === 'Enter') commit();
            if (e.key === 'Escape') setText(value ?? '');
          }}
        />
        {optional && value !== undefined && (
          <Tooltip content="Clear (use the default)">
            <IconButton variant="ghost" size="sm" icon={<X size={14} />} aria-label={`Clear ${label}`} onClick={() => onChange(undefined)} />
          </Tooltip>
        )}
        {action}
      </div>
    </div>
  );
}
