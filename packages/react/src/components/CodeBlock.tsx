import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

/* --- CopyButton --- */
export interface CopyButtonProps {
  value: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  value,
  label = 'Copy',
  copiedLabel = 'Copied!',
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <button
      type="button"
      className={`field-copy-btn ${className}`}
      onClick={handleCopy}
      aria-label={copied ? copiedLabel : label}
    >
      {copied ? <Check size={12} color="var(--field-status-success-base)" /> : <Copy size={12} />}
      <span>{copied ? copiedLabel : label}</span>
    </button>
  );
};

/* --- CodeBlock --- */
export interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  title?: string;
  copyable?: boolean;
  maxHeight?: string;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  showLineNumbers = true,
  highlightLines = [],
  title,
  copyable = true,
  maxHeight,
  className = '',
}) => {
  const lines = code.split('\n');

  return (
    <div className={`field-code-block-container ${className}`}>
      {(title || copyable || language) && (
        <div className="field-code-block-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {title && <span>{title}</span>}
            {language && (
              <span style={{ textTransform: 'uppercase', fontSize: '0.6875rem', opacity: 0.7 }}>
                {language}
              </span>
            )}
          </div>
          {copyable && <CopyButton value={code} />}
        </div>
      )}
      <pre className="field-code-block-pre" style={{ maxHeight }}>
        <code>
          {lines.map((line, idx) => {
            const lineNum = idx + 1;
            const isHighlighted = highlightLines.includes(lineNum);
            return (
              <div
                key={lineNum}
                className={`field-code-line ${isHighlighted ? 'highlight' : ''}`}
              >
                {showLineNumbers && (
                  <span className="field-code-line-number">{lineNum}</span>
                )}
                <span style={{ flex: 1, whiteSpace: 'pre' }}>{line || ' '}</span>
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
  lines: DiffLine[];
  title?: string;
  className?: string;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ lines, title, className = '' }) => {
  return (
    <div className={`field-diff-viewer ${className}`}>
      {title && (
        <div className="field-code-block-header">
          <span>{title}</span>
        </div>
      )}
      <div style={{ padding: '8px 0', backgroundColor: 'var(--field-surface-sunken)' }}>
        {lines.map((line, idx) => (
          <div key={idx} className={`field-diff-line ${line.type}`}>
            <span style={{ width: '40px', color: 'var(--field-text-disabled)', userSelect: 'none' }}>
              {line.oldLineNumber || ' '}
            </span>
            <span style={{ width: '40px', color: 'var(--field-text-disabled)', userSelect: 'none' }}>
              {line.newLineNumber || ' '}
            </span>
            <span style={{ width: '20px', userSelect: 'none', fontWeight: 600 }}>
              {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
            </span>
            <span style={{ flex: 1, whiteSpace: 'pre' }}>{line.content}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
