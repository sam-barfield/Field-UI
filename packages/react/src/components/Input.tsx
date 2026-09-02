import React, { forwardRef, useId } from 'react';

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
  isFullWidth?: boolean;
}

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
      id: customId,
      disabled,
      style,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = customId || generatedId;

    return (
      <div className={`field-form-item ${isFullWidth ? 'w-full' : ''}`}>
        {label && (
          <label htmlFor={id} className="field-label">
            {label}
          </label>
        )}
        <div className={`field-input-wrapper ${error ? 'error' : ''} ${className}`}>
          {leftAdornment && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingLeft: '12px',
                paddingRight: '2px',
                color: 'var(--field-text-secondary)',
                flexShrink: 0,
                pointerEvents: 'none',
              }}
            >
              {leftAdornment}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            className="field-input"
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
            style={{
              flex: 1,
              minWidth: 0,
              paddingLeft: leftAdornment ? '8px' : '12px',
              paddingRight: rightAdornment ? '8px' : '12px',
              ...style,
            }}
            {...props}
          />
          {rightAdornment && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingRight: '12px',
                paddingLeft: '2px',
                color: 'var(--field-text-secondary)',
                flexShrink: 0,
              }}
            >
              {rightAdornment}
            </span>
          )}
        </div>
        {error ? (
          <span id={`${id}-error`} className="field-error-text" role="alert">
            {error}
          </span>
        ) : helperText ? (
          <span id={`${id}-helper`} className="field-helper-text">
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  isFullWidth?: boolean;
}

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
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = customId || generatedId;

    return (
      <div className={`field-form-item ${isFullWidth ? 'w-full' : ''}`}>
        {label && (
          <label htmlFor={id} className="field-label">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={`field-textarea ${className}`}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          {...props}
        />
        {error ? (
          <span id={`${id}-error`} className="field-error-text" role="alert">
            {error}
          </span>
        ) : helperText ? (
          <span id={`${id}-helper`} className="field-helper-text">
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
