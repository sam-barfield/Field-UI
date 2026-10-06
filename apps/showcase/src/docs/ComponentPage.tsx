import React from 'react';
import { Badge, CopyButton } from '@sam.barfield/field-react';
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { componentPages, getComponentPage } from './componentPages';
import { getExamples } from './examples';
import { manifest } from './manifest';
import { C, Callout, DocPage, ExampleBlock, KeyboardTable, List, PropsTable, Section, renderInlineCode } from './docKit';

const GUIDE_LINKS: Record<string, { label: string; to: string }> = {
  'forms-guide': { label: 'Forms guide', to: 'docs/forms' },
  'styling-guide': { label: 'Styling & tokens', to: 'docs/styling' },
  'routing-guide': { label: 'Routing & links', to: 'docs/routing' },
};

export const ComponentPage: React.FC<{ id: string }> = ({ id }) => {
  const page = getComponentPage(id);
  if (!page) {
    return (
      <DocPage title="Not found" lead={`There is no component page called "${id}".`}>
        <a className="docs-link" href="#/components/button">Browse components</a>
      </DocPage>
    );
  }

  const examples = getExamples(page.examples ?? page.id);
  const [primary, ...rest] = examples;
  const importLine = `import { ${page.api.join(', ')} } from '@sam.barfield/field-react';`;
  const index = componentPages.indexOf(page);
  const prev = componentPages[index - 1];
  const next = componentPages[index + 1];
  const source = manifest.components[page.api[0]]?.source;

  return (
    <DocPage
      eyebrow={<Badge variant="accent">{page.category}</Badge>}
      title={page.name}
      lead={page.summary}
    >
      {page.api.length > 0 && (
        <div className="docs-import">
          <code>{importLine}</code>
          <CopyButton value={importLine} iconOnly label="Copy import" />
        </div>
      )}
      {source && (
        <p className="docs-source">
          Source: <C>{source}</C>
        </p>
      )}

      {primary && (
        <div className="docs-hero-example">
          <ExampleBlock example={primary} />
        </div>
      )}

      {(page.whenToUse || page.whenNotToUse) && (
        <Section id="usage" title="When to use">
          <div className="docs-usage-grid">
            {page.whenToUse && (
              <div className="docs-usage-card do">
                <div className="docs-usage-label">
                  <CheckCircle2 size={16} aria-hidden="true" /> Use it for
                </div>
                <List items={page.whenToUse.map(renderInlineCode)} />
              </div>
            )}
            {page.whenNotToUse && (
              <div className="docs-usage-card dont">
                <div className="docs-usage-label">
                  <XCircle size={16} aria-hidden="true" /> Avoid it for
                </div>
                <List items={page.whenNotToUse.map(renderInlineCode)} />
              </div>
            )}
          </div>
        </Section>
      )}

      {rest.length > 0 && (
        <Section id="examples" title="Examples">
          {rest.map(example => (
            <ExampleBlock key={example.id} example={example} />
          ))}
        </Section>
      )}

      {(page.accessibility || page.keyboard) && (
        <Section id="accessibility" title="Accessibility">
          {page.accessibility && <List items={page.accessibility.map(renderInlineCode)} />}
          {page.keyboard && <KeyboardTable rows={page.keyboard} />}
        </Section>
      )}

      {page.api.length > 0 && (
      <Section id="api" title="API reference">
        <p className="docs-p docs-muted">
          Generated from the TypeScript source. Every component also accepts <C>className</C>; components marked "Also
          accepts all native props" forward everything else to the underlying element.
        </p>
        {page.api.map(name => (
          <PropsTable key={name} component={name} />
        ))}
      </Section>
      )}

      {page.related && page.related.length > 0 && (
        <Section id="related" title="Related">
          <div className="docs-related">
            {page.related.map(rel => {
              const guide = GUIDE_LINKS[rel];
              const target = guide ? null : getComponentPage(rel);
              const href = guide ? `#/${guide.to}` : target ? `#/components/${target.id}` : undefined;
              if (!href) return null;
              return (
                <a key={rel} className="docs-related-card" href={href}>
                  <span className="docs-related-name">{guide ? guide.label : target!.name}</span>
                  {target && <span className="docs-related-desc">{target.summary}</span>}
                </a>
              );
            })}
          </div>
        </Section>
      )}

      {examples.length === 0 && (
        <Callout tone="warning">This page has no examples yet.</Callout>
      )}

      <nav className="docs-pager" aria-label="Component pages">
        {prev ? (
          <a className="docs-pager-link" href={`#/components/${prev.id}`}>
            <ArrowLeft size={14} aria-hidden="true" />
            <span>
              <span className="docs-pager-hint">Previous</span>
              {prev.name}
            </span>
          </a>
        ) : <span />}
        {next && (
          <a className="docs-pager-link next" href={`#/components/${next.id}`}>
            <span>
              <span className="docs-pager-hint">Next</span>
              {next.name}
            </span>
            <ArrowRight size={14} aria-hidden="true" />
          </a>
        )}
      </nav>
    </DocPage>
  );
};
