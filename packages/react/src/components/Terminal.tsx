'use client';

import React, { useState, useRef, useEffect, useContext } from 'react';
import { Terminal as TerminalIcon, Copy, Trash2, ArrowDown, Check, CornerDownLeft } from 'lucide-react';

export type LogLevel = 'info' | 'warn' | 'error' | 'success' | 'cmd' | 'debug';

export interface LogLine {
  id: string;
  timestamp?: string;
  level?: LogLevel;
  content: string;
}

export type TerminalVariant = 'window' | 'minimal';

const TerminalContext = React.createContext<{ variant: TerminalVariant }>({ variant: 'window' });

/* --- TERMINAL ROOT --- */
export interface TerminalProps {
  children: React.ReactNode;
  /**
   * `window` (default): raised window chrome with dots, icon, level badges and a submit button.
   * `minimal`: flat panel for embedding in consoles and dashboards; the sub-components default
   * to no dots, no icon, no level badges and no submit button (each can be opted back in).
   */
  variant?: TerminalVariant;
  /** Window height (number = px). */
  height?: number | string;
  /** Maximum height (number = px). */
  maxHeight?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * A terminal / log viewer window. Compose with `TerminalHeader`, `TerminalBody`
 * (containing `TerminalLine`s) and an optional interactive `TerminalPrompt`.
 *
 * @example
 * <Terminal height={320}>
 *   <TerminalHeader title="deploy.log" onClear={clear} />
 *   <TerminalBody>
 *     {logs.map(l => <TerminalLine key={l.id} level={l.level} timestamp={l.ts}>{l.text}</TerminalLine>)}
 *   </TerminalBody>
 *   <TerminalPrompt onSubmit={run} />
 * </Terminal>
 *
 * Header, body and prompt are all optional, so a bare `<Terminal variant="minimal"><TerminalBody>…`
 * is a plain embedded log.
 */
export const Terminal: React.FC<TerminalProps> = ({
  children,
  variant = 'window',
  height = '440px',
  maxHeight,
  className = '',
  style,
}) => {
  return (
    <TerminalContext.Provider value={{ variant }}>
      <div
        className={`field-terminal field-terminal-${variant} ${className}`}
        style={{
          height: typeof height === 'number' ? `${height}px` : height,
          maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
          ...style,
        }}
      >
        {children}
      </div>
    </TerminalContext.Provider>
  );
};

/* --- TERMINAL HEADER --- */
export interface TerminalHeaderProps {
  /** Window title. */
  title?: string;
  /** Secondary text next to the title. */
  subtitle?: string;
  /** Icon before the title. Defaults to a terminal glyph in the `window` variant; pass `null` to hide it. */
  icon?: React.ReactNode;
  /** Show macOS-style window dots. Default `true` for `window`, `false` for `minimal`. */
  showControls?: boolean;
  /** Shows a clear button when provided. */
  onClear?: () => void;
  /** Shows a copy button when provided. */
  onCopyAll?: () => void;
  /** Shows a scroll-to-bottom button when provided. */
  onScrollToBottom?: () => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Window chrome with title and optional scroll-to-bottom, copy and clear actions.
 */
export const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  title = 'cluster-ops@edge-01: ~',
  subtitle,
  icon,
  showControls,
  onClear,
  onCopyAll,
  onScrollToBottom,
  children,
  className = '',
  style,
}) => {
  const { variant } = useContext(TerminalContext);
  const [copied, setCopied] = useState(false);
  const showDots = showControls ?? variant === 'window';
  const resolvedIcon =
    icon !== undefined ? icon : variant === 'window' ? <TerminalIcon size={14} className="field-terminal-icon" /> : null;

  const handleCopy = () => {
    onCopyAll?.();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={`field-terminal-header ${className}`} style={style}>
      {/* Left: Window Dots + Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        {showDots && (
          <div className="field-terminal-dots">
            <span className="dot dot-close" />
            <span className="dot dot-minimize" />
            <span className="dot dot-maximize" />
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          {resolvedIcon}
          {title && <span className="field-terminal-title">{title}</span>}
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
  /** Scroll to the newest line when children change. */
  autoScroll?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Scrollable output area. Auto-scrolls to the newest line while `autoScroll` is on.
 */
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
  /** Time shown before the line. */
  timestamp?: string;
  /** Log level; sets the badge and text colour. */
  level?: LogLevel;
  /** Text shown before the content, e.g. a service name. */
  prefix?: string;
  /** Show the level badge. Default `true` for `window`, `false` for `minimal` (the text colour still reflects the level). */
  showBadge?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * One log line with optional timestamp, level badge (`info`, `warn`, `error`, `success`, `debug`, `cmd`) and prefix.
 */
export const TerminalLine: React.FC<TerminalLineProps> = ({
  timestamp,
  level = 'info',
  prefix,
  showBadge,
  children,
  className = '',
  style,
}) => {
  const { variant } = useContext(TerminalContext);
  const badge = showBadge ?? variant === 'window';
  const levelClass = level ? `level-${level}` : '';
  return (
    <div className={`field-terminal-line ${levelClass} ${className}`.trim()} style={style}>
      {timestamp && <span className="field-terminal-time">{timestamp}</span>}
      {badge && level && level !== 'cmd' && (
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
  /** User shown in the prompt. */
  user?: string;
  /** Working directory shown in the prompt. */
  path?: string;
  /** Replaces the `user:path$` label entirely, e.g. `">"` or `"$"`. */
  prompt?: React.ReactNode;
  /** Show the submit button. Default `true` for `window`, `false` for `minimal`. */
  showSubmitButton?: boolean;
  value?: string;
  onChange?: (val: string) => void;
  /** Called with the trimmed command on Enter. */
  onSubmit?: (cmd: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Interactive command input with ↑/↓ history. `onSubmit` receives the trimmed command.
 */
export const TerminalPrompt: React.FC<TerminalPromptProps> = ({
  user = 'root',
  path = '~',
  prompt,
  showSubmitButton,
  value: controlledValue,
  onChange,
  onSubmit,
  placeholder = 'Type a command (e.g. help, nodes, status)...',
  disabled = false,
  className = '',
  style,
}) => {
  const { variant } = useContext(TerminalContext);
  const showSubmit = showSubmitButton ?? variant === 'window';
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
        {prompt !== undefined ? (
          <span className="symbol">{prompt}</span>
        ) : (
          <>
            <span className="user">{user}</span>
            <span className="sep">:</span>
            <span className="path">{path}</span>
            <span className="symbol">$</span>
          </>
        )}
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
      {showSubmit && (
        <button
          type="button"
          className="field-terminal-prompt-enter"
          onClick={handleEnter}
          disabled={disabled}
          title="Execute command (Enter)"
          aria-label="Execute command"
        >
          <CornerDownLeft size={12} />
        </button>
      )}
    </label>
  );
};
