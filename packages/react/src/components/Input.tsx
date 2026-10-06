'use client';

import React, { forwardRef, useId } from 'react';
import { mergeClassNames } from '../utils/polymorphic.js';

/* --- Shared form field chrome (label, helper and error text) --- */

export interface FieldMessageProps {
  id: string;
  error?: React.ReactNode;
  helperText?: React.ReactNode;
}

/** Id of the helper/error element to reference from `aria-describedby`. */
export function getFieldDescriptionId(id: string, error?: React.ReactNode, helperText?: React.ReactNode) {
  if (error) return `${id}-error`;
  if (helperText) return `${id}-helper`;
  return undefined;
}

/** Renders the error message (preferred) or helper text below a form control. */
export const FieldMessage: React.FC<FieldMessageProps> = ({ id, error, helperText }) => {
  if (error) {
    return (
      <span id={`${id}-error`} className="field-error-text" role="alert">
        {error}
      </span>
    );
  }
  if (helperText) {
    return (
      <span id={`${id}-helper`} className="field-helper-text">
        {helperText}
      </span>
    );
  }
  return null;
};

export interface FieldLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

/** Form label with an optional required marker. */
export const FieldLabel: React.FC<FieldLabelProps> = ({ required, className, children, ...props }) => (
  <label className={mergeClassNames('field-label', className)} {...props}>
    {children}
    {required && (
      <span className="field-label-required" aria-hidden="true">
        *
      </span>
    )}
  </label>
);

/* --- TextInput --- */

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Visible label, associated with the input automatically. */
  label?: React.ReactNode;
  /** Hint shown under the input (hidden while `error` is set). */
  helperText?: React.ReactNode;
  /** Error message; also marks the input `aria-invalid`. */
  error?: React.ReactNode;
  /** Content inside the field before the text, e.g. a search icon. */
  leftAdornment?: React.ReactNode;
  /** Content inside the field after the text, e.g. a unit or a clear button. */
  rightAdornment?: React.ReactNode;
  /** Stretch to the container width. Default `true`. */
  isFullWidth?: boolean;
  /** Class applied to the bordered input wrapper (`className` styles the same element). */
  wrapperClassName?: string;
}

/**
 * Single-line text field with label, helper text, error state and adornments.
 * `ref`, `value`, `onChange` and every native `<input>` prop are forwarded, so
 * it works with React Hook Form, Formik, etc.
 *
 * @example
 * <TextInput label="Email" type="email" required helperText="We'll never share it." />
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      helperText,
      error,
      leftAdornment,
      rightAdornment,
      isFullWidth = true,
      className = '',
      wrapperClassName,
      id: customId,
      disabled,
      required,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = customId || generatedId;
    const describedBy = mergeClassNames(getFieldDescriptionId(id, error, helperText), ariaDescribedBy) || undefined;

    return (
      <div className={mergeClassNames('field-form-item', isFullWidth && 'field-form-item-full')}>
        {label && (
          <FieldLabel htmlFor={id} required={required}>
            {label}
          </FieldLabel>
        )}
        <div
          className={mergeClassNames(
            'field-input-wrapper',
            error && 'error',
            disabled && 'disabled',
            wrapperClassName,
            className
          )}
        >
          {leftAdornment && (
            <span className="field-input-adornment field-input-adornment-left">{leftAdornment}</span>
          )}
          <input
            ref={ref}
            id={id}
            className={mergeClassNames(
              'field-input',
              Boolean(leftAdornment) && 'has-left-adornment',
              Boolean(rightAdornment) && 'has-right-adornment'
            )}
            disabled={disabled}
            required={required}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            {...props}
          />
          {rightAdornment && (
            <span className="field-input-adornment field-input-adornment-right">{rightAdornment}</span>
          )}
        </div>
        <FieldMessage id={id} error={error} helperText={helperText} />
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';

/* --- TextArea --- */

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  error?: React.ReactNode;
  /** Stretch to the container width. Default `true`. */
  isFullWidth?: boolean;
}

/**
 * Multi-line text field. Shares label/helper/error behaviour with `TextInput`.
 *
 * @example
 * <TextArea label="Description" rows={4} maxLength={500} />
 */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      helperText,
      error,
      isFullWidth = true,
      className = '',
      id: customId,
      disabled,
      required,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = customId || generatedId;
    const describedBy = mergeClassNames(getFieldDescriptionId(id, error, helperText), ariaDescribedBy) || undefined;

    return (
      <div className={mergeClassNames('field-form-item', isFullWidth && 'field-form-item-full')}>
        {label && (
          <FieldLabel htmlFor={id} required={required}>
            {label}
          </FieldLabel>
        )}
        <textarea
          ref={ref}
          id={id}
          className={mergeClassNames('field-textarea', error && 'error', className)}
          disabled={disabled}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...props}
        />
        <FieldMessage id={id} error={error} helperText={helperText} />
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
