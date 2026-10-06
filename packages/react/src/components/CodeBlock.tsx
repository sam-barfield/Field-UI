'use client';

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { mergeClassNames } from '../utils/polymorphic.js';

/** Copy text to the clipboard, falling back to `execCommand` on insecure origins (e.g. http://192.168…). */
async function copyText(value: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    /* fall through to the legacy path */
  }
  if (typeof document === 'undefined') return false;
  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  document.body.removeChild(textarea);
  return ok;
}

/* --- CopyButton --- */
export interface CopyButtonProps {
  /** Text written to the clipboard. */
  value: string;
  label?: string;
  /** Label shown briefly after copying. */
  copiedLabel?: string;
  /** Hide the text label and show only the icon. */
  iconOnly?: boolean;
  /** Called after the value was copied. */
  onCopy?: (value: string) => void;
  className?: string;
}

/**
 * Copies `value` to the clipboard and briefly shows a confirmation.
 *
 * @example
 * <CopyButton value={apiKey} />
 */
export const CopyButton: React.FC<CopyButtonProps> = ({
  value,
  label = 'Copy',
  copiedLabel = 'Copied!',
  iconOnly = false,
  onCopy,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (await copyText(value)) {
      setCopied(true);
      onCopy?.(value);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      className={mergeClassNames('field-copy-btn', copied && 'copied', className)}
      onClick={handleCopy}
      aria-label={iconOnly ? (copied ? copiedLabel : label) : undefined}
    >
      {copied ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
      {!iconOnly && <span aria-live="polite">{copied ? copiedLabel : label}</span>}
    </button>
  );
};

/* --- Syntax highlighting --- */

/** A run of text with its token types, e.g. `{ content: 'const', types: ['keyword'] }`. */
export interface CodeToken {
  content: string;
  types: string[];
}

/**
 * Splits code into lines of tokens. Field ships no grammars so the library
 * stays small - plug in Prism, Shiki, highlight.js or your own tokenizer.
 * Token types become `field-token-<type>` classes coloured by theme tokens.
 */
export type CodeHighlighter = (code: string, language?: string) => CodeToken[][];

const CodeHighlighterContext = createContext<CodeHighlighter | undefined>(undefined);

export interface CodeHighlighterProviderProps {
  /** Highlighter used by every `CodeBlock` below this provider. */
  highlighter: CodeHighlighter;
  children: React.ReactNode;
}

/**
 * Sets the syntax highlighter for every `CodeBlock` below it.
 *
 * @example
 * import { Prism, normalizeTokens } from 'prism-react-renderer';
 *
 * const prismHighlighter: CodeHighlighter = (code, language = 'tsx') => {
 *   const grammar = Prism.languages[language];
 *   return grammar
 *     ? normalizeTokens(Prism.tokenize(code, grammar))
 *     : code.split('\n').map(line => [{ content: line, types: ['plain'] }]);
 * };
 *
 * <CodeHighlighterProvider highlighter={prismHighlighter}>…</CodeHighlighterProvider>
 */
export const CodeHighlighterProvider: React.FC<CodeHighlighterProviderProps> = ({ highlighter, children }) => (
  <CodeHighlighterContext.Provider value={highlighter}>{children}</CodeHighlighterContext.Provider>
);

/**
 * Tokenizers report nested types from outermost to innermost (e.g.
 * `tag > script > keyword` inside a JSX attribute). Colour by the innermost
 * meaningful type so nested code isn't painted with its container's colour.
 */
const tokenClassName = (types: string[]) => {
  const type = [...types].reverse().find(t => t !== 'plain' && t !== 'script' && !t.startsWith('language-'));
  return type ? `field-token-${type.replace(/[^a-zA-Z0-9-]/g, '-')}` : undefined;
};

/* --- CodeBlock --- */
export interface CodeBlockProps {
  /** The source text to display. */
  code: string;
  /** Shown in the header, e.g. `tsx` or `bash`. */
  language?: string;
  /** Show a line-number gutter. */
  showLineNumbers?: boolean;
  /** 1-based line numbers to highlight. */
  highlightLines?: number[];
  title?: string;
  /** Show a copy-to-clipboard button in the header. */
  copyable?: boolean;
  /** Scroll vertically beyond this height (any CSS length). */
  maxHeight?: string;
  /** Wrap long lines instead of scrolling horizontally. */
  wrap?: boolean;
  /**
   * Syntax highlighter for this block. Overrides the one from
   * `CodeHighlighterProvider`; pass `null` for plain text.
   */
  highlighter?: CodeHighlighter | null;
  className?: string;
}

/**
 * A read-only code snippet with line numbers, highlighted lines and a copy
 * button. For syntax colouring pass a `highlighter`, or set one for the whole
 * app with `CodeHighlighterProvider`.
 *
 * @example
 * <CodeBlock language="bash" code="npm install @sam.barfield/field-react" showLineNumbers={false} />
 */
export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  showLineNumbers = true,
  highlightLines = [],
  title,
  copyable = true,
  maxHeight,
  wrap = false,
  highlighter: highlighterProp,
  className = '',
}) => {
  const contextHighlighter = useContext(CodeHighlighterContext);
  const highlighter = highlighterProp === undefined ? contextHighlighter : highlighterProp ?? undefined;
  const source = code.replace(/\n$/, '');
  const lines = source.split('\n');
  const tokenLines = useMemo(() => {
    if (!highlighter) return null;
    try {
      const result = highlighter(source, language);
      return result.length === lines.length ? result : null;
    } catch {
      return null; // a grammar error should never break rendering
    }
  }, [highlighter, source, language, lines.length]);

  return (
    <div className={mergeClassNames('field-code-block-container', wrap && 'wrap', className)}>
      {(title || copyable || language) && (
        <div className="field-code-block-header">
          <div className="field-code-block-meta">
            {title && <span>{title}</span>}
            {language && <span className="field-code-block-language">{language}</span>}
          </div>
          {copyable && <CopyButton value={code} />}
        </div>
      )}
      <pre className="field-code-block-pre" style={{ maxHeight }} tabIndex={0}>
        <code>
          {lines.map((line, idx) => {
            const lineNum = idx + 1;
            const isHighlighted = highlightLines.includes(lineNum);
            return (
              <div key={lineNum} className={mergeClassNames('field-code-line', isHighlighted && 'highlight')}>
                {showLineNumbers && (
                  <span className="field-code-line-number" aria-hidden="true">
                    {lineNum}
                  </span>
                )}
                <span className="field-code-line-content">
                  {tokenLines && line
                    ? tokenLines[idx].map((token, i) => (
                        <span key={i} className={tokenClassName(token.types)}>
                          {token.content}
                        </span>
                      ))
                    : line || ' '}
                </span>
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
};

/* --- DiffViewer --- */
export interface DiffLine {
  type: 'added' | 'removed' | 'normal';
  content: string;
  oldLineNumber?: number;
  newLineNumber?: number;
}

export interface DiffViewerProps {
  /** Diff lines in display order. */
  lines: DiffLine[];
  title?: string;
  className?: string;
}

const DIFF_MARKERS: Record<DiffLine['type'], string> = {
  added: '+',
  removed: '-',
  normal: ' ',
};

/**
 * A unified diff view with old/new line numbers.
 *
 * @example
 * <DiffViewer title="config.yaml" lines={[{ type: 'removed', content: 'replicas: 2', oldLineNumber: 4 },
 *   { type: 'added', content: 'replicas: 3', newLineNumber: 4 }]} />
 */
export const DiffViewer: React.FC<DiffViewerProps> = ({ lines, title, className = '' }) => {
  return (
    <div className={mergeClassNames('field-diff-viewer', className)}>
      {title && (
        <div className="field-code-block-header">
          <span>{title}</span>
        </div>
      )}
      <div className="field-diff-body" tabIndex={0}>
        {lines.map((line, idx) => {
          const lineKey = `diff-${line.type}-${line.oldLineNumber ?? ''}-${line.newLineNumber ?? ''}-${idx}`;
          return (
            <div key={lineKey} className={`field-diff-line ${line.type}`}>
              <span className="field-diff-line-number" aria-hidden="true">{line.oldLineNumber || ' '}</span>
              <span className="field-diff-line-number" aria-hidden="true">{line.newLineNumber || ' '}</span>
              <span className="field-diff-marker">
                {line.type === 'normal' ? ' ' : <span className="field-sr-only">{line.type === 'added' ? 'Added: ' : 'Removed: '}</span>}
                <span aria-hidden="true">{DIFF_MARKERS[line.type]}</span>
              </span>
              <span className="field-diff-content">{line.content}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
