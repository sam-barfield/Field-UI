import React, { useState } from 'react';
import { Copy, Check, Code as CodeIcon, ChevronDown, ChevronUp, Smartphone, Tablet } from 'lucide-react';

interface ComponentPreviewCardProps {
  children: React.ReactNode;
  code: string;
  defaultExpanded?: boolean;
  align?: 'center' | 'start' | 'stretch';
  minHeight?: string;
  viewport?: 'desktop' | 'tablet' | 'mobile';
  onViewportChange?: (vp: 'desktop' | 'tablet' | 'mobile') => void;
}

export const ComponentPreviewCard: React.FC<ComponentPreviewCardProps> = ({
  children,
  code,
  defaultExpanded = false,
  align = 'center',
  minHeight = '240px',
  viewport = 'desktop',
  onViewportChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy code', err);
    }
  };

  const lines = code.trim().split('\n');
  const previewLines = lines.slice(0, 3);
  const displayedLines = isExpanded ? lines : previewLines;

  const isDeviceFrame = viewport !== 'desktop';
  const targetFrameWidth = viewport === 'mobile' ? '390px' : viewport === 'tablet' ? '768px' : '100%';

  return (
    <div
      style={{
        border: '1px solid var(--field-border-default)',
        borderRadius: '12px',
        backgroundColor: 'var(--field-surface-sunken)',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
        margin: '16px 0 32px 0',
      }}
    >
      {/* Visual Component Render Stage */}
      <div
        style={{
          minHeight,
          padding: isDeviceFrame ? '44px 16px 36px 16px' : '36px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: align === 'start' ? 'flex-start' : 'center',
          backgroundColor: 'var(--field-surface-base)',
          backgroundImage:
            'radial-gradient(circle at 1px 1px, var(--field-border-subtle) 1px, transparent 0)',
          backgroundSize: '24px 24px',
          position: 'relative',
          transition: 'padding 0.2s ease',
        }}
      >
        {/* Device Viewport Indicator Pill */}
        {isDeviceFrame && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 10px',
              borderRadius: '999px',
              backgroundColor: 'var(--field-surface-raised)',
              border: '1px solid var(--field-border-strong)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              fontSize: '0.72rem',
              fontWeight: 600,
              color: 'var(--field-accent-primary)',
              letterSpacing: '0.02em',
              zIndex: 10,
            }}
          >
            {viewport === 'mobile' ? <Smartphone size={12} /> : <Tablet size={12} />}
            <span>{viewport === 'mobile' ? 'Mobile Viewport (390px)' : 'Tablet Viewport (768px)'}</span>
            {onViewportChange && (
              <button
                type="button"
                onClick={() => onViewportChange('desktop')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--field-text-tertiary)',
                  cursor: 'pointer',
                  marginLeft: '4px',
                  padding: '0 2px',
                  fontSize: '0.7rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
                title="Reset to full width desktop"
              >
                &times;
              </button>
            )}
          </div>
        )}

        {/* Dynamic Width Canvas */}
        <div
          style={{
            width: isDeviceFrame ? targetFrameWidth : align === 'stretch' ? '100%' : 'auto',
            maxWidth: '100%',
            transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            border: isDeviceFrame ? '1px solid var(--field-border-strong)' : 'none',
            borderRadius: isDeviceFrame ? '16px' : '0',
            boxShadow: isDeviceFrame ? '0 12px 36px rgba(0, 0, 0, 0.55)' : 'none',
            overflow: 'hidden',
            backgroundColor: 'var(--field-surface-base)',
            position: 'relative',
          }}
        >
          {children}
        </div>
      </div>

      {/* Code Viewer Bar */}
      <div
        style={{
          borderTop: '1px solid var(--field-border-subtle)',
          backgroundColor: '#0a0b0e',
          position: 'relative',
        }}
      >
        {/* Top bar inside code block */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '8px 16px',
            borderBottom: isExpanded ? '1px solid rgba(255, 255, 255, 0.06)' : 'none',
          }}
        >
          <button
            type="button"
            onClick={handleCopy}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              color: copied ? 'var(--field-status-success-base)' : 'var(--field-text-secondary)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              fontFamily: 'var(--field-font-sans)',
              transition: 'all 0.15s ease',
            }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Code Content */}
        <div
          style={{
            position: 'relative',
            maxHeight: isExpanded ? '600px' : '96px',
            overflow: isExpanded ? 'auto' : 'hidden',
            transition: 'max-height 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            padding: '0 16px 16px 16px',
          }}
        >
          <pre
            style={{
              margin: 0,
              fontFamily: 'var(--field-font-mono, monospace)',
              fontSize: '0.8125rem',
              lineHeight: '1.65',
              color: '#d4d4d8',
            }}
          >
            <code>
              {displayedLines.map((line, idx) => (
                <div key={idx} style={{ display: 'flex' }}>
                  <span
                    style={{
                      width: '32px',
                      color: 'rgba(255, 255, 255, 0.25)',
                      userSelect: 'none',
                      textAlign: 'right',
                      marginRight: '16px',
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </span>
                  <span style={{ whiteSpace: 'pre', overflowX: 'auto' }}>
                    {line || ' '}
                  </span>
                </div>
              ))}
            </code>
          </pre>

          {/* Bottom Gradient Fade when collapsed */}
          {!isExpanded && (
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '70px',
                background: 'linear-gradient(to bottom, rgba(10, 11, 14, 0) 0%, #0a0b0e 100%)',
                pointerEvents: 'none',
              }}
            />
          )}
        </div>

        {/* Floating Centered "View Code" Pill Button */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: isExpanded ? '8px 0 14px 0' : '0 0 14px 0',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              backgroundColor: isExpanded ? 'rgba(255, 255, 255, 0.08)' : '#18181b',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '9999px',
              color: '#f4f4f5',
              fontSize: '0.75rem',
              fontWeight: 500,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
              transition: 'all 0.15s ease',
            }}
          >
            <CodeIcon size={13} />
            <span>{isExpanded ? 'Collapse Code' : 'View Code'}</span>
            {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>
    </div>
  );
};
