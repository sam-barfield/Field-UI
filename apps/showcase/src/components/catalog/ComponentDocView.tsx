import React, { useState } from 'react';
import {
  Heading,
  Text,
  Badge,
  useToast,
} from '@sam.barfield/field-react';
import {
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Keyboard,
  FileCode,
  Info,
} from 'lucide-react';
import { ComponentDoc } from './types';
import { ComponentPreviewCard } from './ComponentPreviewCard';

interface ComponentDocViewProps {
  doc: ComponentDoc;
  allComponents: ComponentDoc[];
  onSelectComponent: (id: string) => void;
  viewport?: 'desktop' | 'tablet' | 'mobile';
  onViewportChange?: (vp: 'desktop' | 'tablet' | 'mobile') => void;
}

export const ComponentDocView: React.FC<ComponentDocViewProps> = ({
  doc,
  allComponents,
  onSelectComponent,
  viewport = 'desktop',
  onViewportChange,
}) => {
  const { showToast } = useToast();
  const [copiedUsage, setCopiedUsage] = useState(false);
  const [copiedComposition, setCopiedComposition] = useState(false);
  const [copiedPage, setCopiedPage] = useState(false);

  // Compute prev and next component
  const currentIndex = allComponents.findIndex((c) => c.id === doc.id);
  const prevComponent = currentIndex > 0 ? allComponents[currentIndex - 1] : null;
  const nextComponent =
    currentIndex < allComponents.length - 1 ? allComponents[currentIndex + 1] : null;

  const handleCopyPage = async () => {
    try {
      const pageSummary = `# ${doc.name}
${doc.description}

## Usage
\`\`\`tsx
${doc.importCode}

${doc.usageCode}
\`\`\`
${
  doc.compositionTree
    ? `
## Composition
\`\`\`
${doc.compositionTree}
\`\`\`
`
    : ''
}
`;
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(pageSummary);
        setCopiedPage(true);
        setTimeout(() => setCopiedPage(false), 2000);
        showToast({
          title: 'Page Copied',
          description: `Copied ${doc.name} documentation markdown to clipboard.`,
          variant: 'success',
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyUsage = async () => {
    try {
      const fullUsage = `${doc.importCode}\n\n${doc.usageCode}`;
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(fullUsage);
        setCopiedUsage(true);
        setTimeout(() => setCopiedUsage(false), 2000);
        showToast({
          title: 'Usage Snippet Copied',
          description: `Copied ${doc.name} usage code to clipboard.`,
          variant: 'success',
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyComposition = async () => {
    if (!doc.compositionTree) return;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(doc.compositionTree);
        setCopiedComposition(true);
        setTimeout(() => setCopiedComposition(false), 2000);
        showToast({
          title: 'Composition Copied',
          description: `Copied ${doc.name} composition structure to clipboard.`,
          variant: 'success',
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <article
      style={{
        flex: 1,
        minWidth: 0,
        padding: '0 24px 80px 36px',
        maxWidth: '1000px',
      }}
    >
      {/* Top Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Badge variant="accent">{doc.category.toUpperCase()}</Badge>
            <Text size="xs" tone="tertiary">@sam.barfield/field-react</Text>
          </div>
          <h1
            style={{
              fontSize: '2.25rem',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              margin: 0,
              color: 'var(--field-text-primary)',
            }}
          >
            {doc.name}
          </h1>
          <p
            style={{
              fontSize: '1.05rem',
              lineHeight: 1.6,
              color: 'var(--field-text-secondary)',
              marginTop: '8px',
              marginBottom: 0,
            }}
          >
            {doc.description}
          </p>
        </div>

        {/* Top Right Actions: Copy Page + Prev/Next Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, paddingTop: '4px' }}>
          <button
            type="button"
            onClick={handleCopyPage}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: 'var(--field-surface-raised)',
              border: '1px solid var(--field-border-default)',
              borderRadius: '6px',
              color: copiedPage ? 'var(--field-status-success-base)' : 'var(--field-text-primary)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {copiedPage ? <Check size={13} /> : <Copy size={13} />}
            <span>{copiedPage ? 'Copied' : 'Copy Page'}</span>
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid var(--field-border-default)',
              borderRadius: '6px',
              backgroundColor: 'var(--field-surface-raised)',
              overflow: 'hidden',
            }}
          >
            <button
              type="button"
              disabled={!prevComponent}
              onClick={() => prevComponent && onSelectComponent(prevComponent.id)}
              title={prevComponent ? `Previous: ${prevComponent.name}` : 'No previous component'}
              style={{
                padding: '6px 8px',
                background: 'transparent',
                border: 'none',
                borderRight: '1px solid var(--field-border-subtle)',
                color: prevComponent ? 'var(--field-text-primary)' : 'var(--field-text-disabled)',
                cursor: prevComponent ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              disabled={!nextComponent}
              onClick={() => nextComponent && onSelectComponent(nextComponent.id)}
              title={nextComponent ? `Next: ${nextComponent.name}` : 'No next component'}
              style={{
                padding: '6px 8px',
                background: 'transparent',
                border: 'none',
                color: nextComponent ? 'var(--field-text-primary)' : 'var(--field-text-disabled)',
                cursor: nextComponent ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Interactive Component Preview */}
      {(() => {
        const PrimaryDemo = doc.primaryDemo.render;
        return (
          <ComponentPreviewCard
            code={doc.primaryDemo.code}
            align="center"
            viewport={viewport}
            onViewportChange={onViewportChange}
          >
            <PrimaryDemo />
          </ComponentPreviewCard>
        );
      })()}

      {/* Usage Section */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <FileCode size={18} style={{ color: 'var(--field-accent-primary)' }} />
          <Heading level={3}>Usage</Heading>
        </div>

        <div
          style={{
            border: '1px solid var(--field-border-default)',
            borderRadius: '10px',
            backgroundColor: '#0a0b0e',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 14px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
            }}
          >
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--field-font-mono)', color: 'var(--field-text-secondary)' }}>
              Example.tsx
            </span>
            <button
              type="button"
              onClick={handleCopyUsage}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '3px 8px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                color: copiedUsage ? 'var(--field-status-success-base)' : 'var(--field-text-secondary)',
                fontSize: '0.75rem',
                cursor: 'pointer',
              }}
            >
              {copiedUsage ? <Check size={12} /> : <Copy size={12} />}
              <span>{copiedUsage ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <pre
            style={{
              margin: 0,
              padding: '16px',
              fontFamily: 'var(--field-font-mono, monospace)',
              fontSize: '0.8125rem',
              lineHeight: '1.65',
              color: '#d4d4d8',
              overflowX: 'auto',
            }}
          >
            <code>
              {`${doc.importCode}\n\n${doc.usageCode}`.split('\n').map((line, idx) => (
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
                  <span style={{ whiteSpace: 'pre' }}>{line || ' '}</span>
                </div>
              ))}
            </code>
          </pre>
        </div>
      </section>

      {/* Composition Section (Image 2) */}
      {doc.compositionTree && (
        <section style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Layers size={18} style={{ color: 'var(--field-accent-primary)' }} />
            <Heading level={3}>Composition</Heading>
          </div>
          <Text tone="secondary" size="sm" style={{ marginBottom: '12px' }}>
            Use the following composition to build a(n) <code style={{ color: 'var(--field-text-primary)' }}>{doc.name}</code>:
          </Text>

          <div
            style={{
              position: 'relative',
              backgroundColor: '#0a0b0e',
              border: '1px solid var(--field-border-default)',
              borderRadius: '10px',
              padding: '16px 20px',
              fontFamily: 'var(--field-font-mono, monospace)',
              fontSize: '0.8125rem',
              lineHeight: '1.7',
              color: '#f4f4f5',
            }}
          >
            <button
              type="button"
              onClick={handleCopyComposition}
              title="Copy composition"
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 8px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                color: copiedComposition ? 'var(--field-status-success-base)' : 'var(--field-text-secondary)',
                fontSize: '0.75rem',
                cursor: 'pointer',
              }}
            >
              {copiedComposition ? <Check size={12} /> : <Copy size={12} />}
              <span>{copiedComposition ? 'Copied' : 'Copy'}</span>
            </button>
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>
              {doc.compositionTree}
            </pre>
          </div>
        </section>
      )}

      {/* Variants Section (Image 2) */}
      {doc.variants && doc.variants.length > 0 && (
        <section style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Sparkles size={18} style={{ color: 'var(--field-accent-primary)' }} />
            <Heading level={3}>Variants & States</Heading>
          </div>
          <Text tone="secondary" size="sm" style={{ marginBottom: '24px' }}>
            Explore the available configurations and interactive states for {doc.name}.
          </Text>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {doc.variants.map((variant) => (
              <div key={variant.id}>
                <h4
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: 'var(--field-text-primary)',
                    margin: '0 0 6px 0',
                  }}
                >
                  {variant.name}
                </h4>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--field-text-secondary)',
                    margin: '0 0 12px 0',
                  }}
                >
                  {variant.description}
                </p>

                {(() => {
                  const VariantDemo = variant.render;
                  return (
                    <ComponentPreviewCard code={variant.code} align="center">
                      <VariantDemo />
                    </ComponentPreviewCard>
                  );
                })()}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Useful Things to Know / Props & Guidelines */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Info size={18} style={{ color: 'var(--field-accent-primary)' }} />
          <Heading level={3}>Useful Things to Know</Heading>
        </div>

        {/* Props Table */}
        {doc.props && doc.props.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '10px' }}>
              Props Reference
            </h4>
            <div
              style={{
                border: '1px solid var(--field-border-default)',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: 'var(--field-surface-sunken)',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--field-surface-raised)', borderBottom: '1px solid var(--field-border-default)' }}>
                    <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 600 }}>Prop</th>
                    <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 600 }}>Type</th>
                    <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 600 }}>Default</th>
                    <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 600 }}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {doc.props.map((p, idx) => (
                    <tr
                      key={p.name}
                      style={{
                        borderBottom: idx < (doc.props?.length || 0) - 1 ? '1px solid var(--field-border-subtle)' : 'none',
                      }}
                    >
                      <td style={{ padding: '10px 14px', fontFamily: 'var(--field-font-mono)', fontWeight: 600, color: 'var(--field-accent-primary)' }}>
                        {p.name} {p.required && <span style={{ color: 'var(--field-status-danger-base)' }}>*</span>}
                      </td>
                      <td style={{ padding: '10px 14px', fontFamily: 'var(--field-font-mono)', color: 'var(--field-text-secondary)', fontSize: '0.75rem' }}>
                        {p.type}
                      </td>
                      <td style={{ padding: '10px 14px', fontFamily: 'var(--field-font-mono)', color: 'var(--field-text-tertiary)', fontSize: '0.75rem' }}>
                        {p.default || '—'}
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--field-text-secondary)' }}>
                        {p.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Keyboard Interactions */}
        {doc.keyboardInteractions && doc.keyboardInteractions.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Keyboard size={16} style={{ color: 'var(--field-text-secondary)' }} />
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, margin: 0 }}>
                Keyboard Interactions
              </h4>
            </div>
            <div
              style={{
                border: '1px solid var(--field-border-default)',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: 'var(--field-surface-sunken)',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--field-surface-raised)', borderBottom: '1px solid var(--field-border-default)' }}>
                    <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 600, width: '140px' }}>Key</th>
                    <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 600 }}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {doc.keyboardInteractions.map((k, idx) => (
                    <tr
                      key={k.key}
                      style={{
                        borderBottom: idx < (doc.keyboardInteractions?.length || 0) - 1 ? '1px solid var(--field-border-subtle)' : 'none',
                      }}
                    >
                      <td style={{ padding: '10px 14px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: 'var(--field-surface-raised)',
                            border: '1px solid var(--field-border-subtle)',
                            fontFamily: 'var(--field-font-mono)',
                            fontSize: '0.75rem',
                          }}
                        >
                          {k.key}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--field-text-secondary)' }}>
                        {k.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Useful Notes / Design Guidelines */}
        {doc.usefulNotes && doc.usefulNotes.length > 0 && (
          <div
            style={{
              padding: '16px 20px',
              borderRadius: '8px',
              backgroundColor: 'var(--field-surface-raised)',
              border: '1px solid var(--field-border-subtle)',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '8px', color: 'var(--field-text-primary)' }}>
              Implementation Tips & Guidelines
            </div>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.8125rem', color: 'var(--field-text-secondary)', lineHeight: 1.7 }}>
              {doc.usefulNotes.map((note, idx) => (
                <li key={idx} style={{ marginBottom: '4px' }}>{note}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Bottom Prev / Next Page Navigation Buttons */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '24px',
          borderTop: '1px solid var(--field-border-subtle)',
          marginTop: '40px',
        }}
      >
        {prevComponent ? (
          <button
            type="button"
            onClick={() => onSelectComponent(prevComponent.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid var(--field-border-default)',
              backgroundColor: 'var(--field-surface-raised)',
              color: 'var(--field-text-primary)',
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <ChevronLeft size={16} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--field-text-tertiary)' }}>Previous</div>
              <div style={{ fontWeight: 550 }}>{prevComponent.name}</div>
            </div>
          </button>
        ) : (
          <div />
        )}

        {nextComponent && (
          <button
            type="button"
            onClick={() => onSelectComponent(nextComponent.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid var(--field-border-default)',
              backgroundColor: 'var(--field-surface-raised)',
              color: 'var(--field-text-primary)',
              fontSize: '0.875rem',
              cursor: 'pointer',
              textAlign: 'right',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--field-text-tertiary)' }}>Next</div>
              <div style={{ fontWeight: 550 }}>{nextComponent.name}</div>
            </div>
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </article>
  );
};
