import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Copy, Trash2, ArrowDown, Check, CornerDownLeft } from 'lucide-react';

export type LogLevel = 'info' | 'warn' | 'error' | 'success' | 'cmd' | 'debug';

export interface LogLine {
  id: string;
  timestamp?: string;
  level?: LogLevel;
  content: string;
}

/* --- TERMINAL ROOT --- */
export interface TerminalProps {
  children: React.ReactNode;
  height?: number | string;
  maxHeight?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export const Terminal: React.FC<TerminalProps> = ({
  children,
  height = '440px',
  maxHeight,
  className = '',
  style,
}) => {
  return (
    <div
      className={`field-terminal ${className}`}
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* --- TERMINAL HEADER --- */
export interface TerminalHeaderProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  showControls?: boolean;
  onClear?: () => void;
  onCopyAll?: () => void;
  onScrollToBottom?: () => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  title = 'cluster-ops@edge-01: ~',
  subtitle,
  icon,
  showControls = true,
  onClear,
  onCopyAll,
  onScrollToBottom,
  children,
  className = '',
  style,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopyAll?.();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={`field-terminal-header ${className}`} style={style}>
      {/* Left: Window Dots + Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        {showControls && (
          <div className="field-terminal-dots">
            <span className="dot dot-close" />
            <span className="dot dot-minimize" />
            <span className="dot dot-maximize" />
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          {icon || <TerminalIcon size={14} className="field-terminal-icon" />}
          <span className="field-terminal-title">{title}</span>
          {subtitle && <span className="field-terminal-subtitle">{subtitle}</span>}
        </div>
      </div>

      {/* Right: Actions / Custom Children */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {children}
        {onScrollToBottom && (
          <button
            type="button"
            className="field-terminal-btn"
            onClick={onScrollToBottom}
            title="Scroll to bottom"
            aria-label="Scroll to bottom"
          >
            <ArrowDown size={13} />
          </button>
        )}
        {onCopyAll && (
          <button
            type="button"
            className="field-terminal-btn"
            onClick={handleCopy}
            title="Copy logs to clipboard"
            aria-label="Copy logs"
          >
            {copied ? <Check size={13} style={{ color: 'var(--field-status-success-base)' }} /> : <Copy size={13} />}
          </button>
        )}
        {onClear && (
          <button
            type="button"
            className="field-terminal-btn"
            onClick={onClear}
            title="Clear terminal screen"
            aria-label="Clear screen"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </div>
  );
};

/* --- TERMINAL BODY --- */
export interface TerminalBodyProps {
  children: React.ReactNode;
  autoScroll?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const TerminalBody = React.forwardRef<HTMLDivElement, TerminalBodyProps>(
  ({ children, autoScroll = true, className = '', style }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const bodyRef = (ref || internalRef) as React.MutableRefObject<HTMLDivElement | null>;

    useEffect(() => {
      if (autoScroll && bodyRef.current) {
        bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
      }
    }, [children, autoScroll, bodyRef]);

    return (
      <div ref={bodyRef} className={`field-terminal-body ${className}`} style={style}>
        {children}
      </div>
    );
  }
);

TerminalBody.displayName = 'TerminalBody';

/* --- TERMINAL LINE --- */
export interface TerminalLineProps {
  timestamp?: string;
  level?: LogLevel;
  prefix?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TerminalLine: React.FC<TerminalLineProps> = ({
  timestamp,
  level = 'info',
  prefix,
  children,
  className = '',
  style,
}) => {
  const levelClass = level ? `level-${level}` : '';
  return (
    <div className={`field-terminal-line ${levelClass} ${className}`.trim()} style={style}>
      {timestamp && <span className="field-terminal-time">{timestamp}</span>}
      {level && level !== 'cmd' && (
        <span className={`field-terminal-badge badge-${level}`}>
          {level.toUpperCase()}
        </span>
      )}
      {prefix && <span className="field-terminal-prefix">{prefix}</span>}
      <span className="field-terminal-text">{children}</span>
    </div>
  );
};

/* --- TERMINAL PROMPT (INTERACTIVE CLI) --- */
export interface TerminalPromptProps {
  user?: string;
  path?: string;
  value?: string;
  onChange?: (val: string) => void;
  onSubmit?: (cmd: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const TerminalPrompt: React.FC<TerminalPromptProps> = ({
  user = 'root',
  path = '~',
  value: controlledValue,
  onChange,
  onSubmit,
  placeholder = 'Type a command (e.g. help, nodes, status)...',
  disabled = false,
  className = '',
  style,
}) => {
  const [internalValue, setInternalValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const value = controlledValue ?? internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (controlledValue === undefined) setInternalValue(e.target.value);
    onChange?.(e.target.value);
  };

  const updateValue = (val: string) => {
    if (controlledValue === undefined) setInternalValue(val);
    onChange?.(val);
  };

  const handleEnter = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setHistory(prev => [...prev, trimmed]);
    setHistoryIdx(-1);
    onSubmit?.(trimmed);
    if (controlledValue === undefined) setInternalValue('');
  };

  const handleArrowUp = () => {
    if (history.length === 0) return;
    const nextIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
    setHistoryIdx(nextIdx);
    updateValue(history[nextIdx] || '');
  };

  const handleArrowDown = () => {
    if (historyIdx === -1) return;
    const nextIdx = historyIdx + 1;
    if (nextIdx >= history.length) {
      setHistoryIdx(-1);
      updateValue('');
    } else {
      setHistoryIdx(nextIdx);
      updateValue(history[nextIdx] || '');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleEnter();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleArrowUp();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleArrowDown();
    }
  };

  return (
    <label
      className={`field-terminal-prompt ${disabled ? 'disabled' : ''} ${className}`}
      style={style}
    >
      <div className="field-terminal-prompt-label">
        <span className="user">{user}</span>
        <span className="sep">:</span>
        <span className="path">{path}</span>
        <span className="symbol">$</span>
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="field-terminal-prompt-input"
        spellCheck={false}
        autoComplete="off"
        autoCapitalize="off"
      />
      <button
        type="button"
        className="field-terminal-prompt-enter"
        onClick={() => {
          if (value.trim()) {
            setHistory(prev => [...prev, value.trim()]);
            onSubmit?.(value.trim());
            if (controlledValue === undefined) setInternalValue('');
          }
        }}
        title="Execute command (Enter)"
      >
        <CornerDownLeft size={12} />
      </button>
    </label>
  );
};
