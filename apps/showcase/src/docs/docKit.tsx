import React, { useState } from 'react';
import { Alert, Badge, Button, Code, CodeBlock, Kbd } from '@sam.barfield/field-react';
import { Code2, Link as LinkIcon } from 'lucide-react';
import { manifest } from './manifest';
import type { DocExample } from './examples';

/* Building blocks for documentation pages. Every page uses these so the docs
   look and read consistently. */

export const DocPage: React.FC<{
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  lead?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}> = ({ eyebrow, title, lead, actions, children }) => (
  <article className="docs-page">
    <header className="docs-page-header">
      {eyebrow && <div className="docs-eyebrow">{eyebrow}</div>}
      <div className="docs-title-row">
        <h1 className="docs-title">{title}</h1>
        {actions}
      </div>
      {lead && <p className="docs-lead">{lead}</p>}
    </header>
    {children}
  </article>
);

export const Section: React.FC<{ id: string; title: React.ReactNode; children: React.ReactNode }> = ({
  id,
  title,
  children,
}) => (
  <section className="docs-section" aria-labelledby={id}>
    <h2 id={id} className="docs-h2">
      <a href={`#${id}`} onClick={e => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }} className="docs-anchor" aria-label={`Link to ${typeof title === 'string' ? title : 'section'}`}>
        <LinkIcon size={14} aria-hidden="true" />
      </a>
      {title}
    </h2>
    {children}
  </section>
);

export const H3: React.FC<{ children: React.ReactNode }> = ({ children }) => <h3 className="docs-h3">{children}</h3>;

export const P: React.FC<{ children: React.ReactNode }> = ({ children }) => <p className="docs-p">{children}</p>;

export const List: React.FC<{ items: React.ReactNode[]; ordered?: boolean }> = ({ items, ordered }) => {
  const Tag = ordered ? 'ol' : 'ul';
  return (
    <Tag className="docs-list">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </Tag>
  );
};

/** Inline code. */
export const C: React.FC<{ children: React.ReactNode }> = ({ children }) => <Code>{children}</Code>;

export const Snippet: React.FC<{ code: string; language?: string; title?: string }> = ({ code, language = 'tsx', title }) => (
  <div className="docs-snippet">
    <CodeBlock code={code.trim()} language={language} title={title} showLineNumbers={false} />
  </div>
);

export const Callout: React.FC<{ tone?: 'info' | 'success' | 'warning' | 'danger'; title?: string; children: React.ReactNode }> = ({
  tone = 'info',
  title,
  children,
}) => (
  <div className="docs-callout">
    <Alert variant={tone} title={title}>
      {children}
    </Alert>
  </div>
);

/** Internal link to another docs page. */
export const DocLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <a className="docs-link" href={`#/${to}`}>
    {children}
  </a>
);

/** Live preview + source of an example file. */
export const ExampleBlock: React.FC<{ example: DocExample; defaultShowCode?: boolean }> = ({ example, defaultShowCode = false }) => {
  const [showCode, setShowCode] = useState(defaultShowCode);
  const Render = example.Component;
  return (
    <div className="docs-example">
      {(example.title || example.description) && (
        <div className="docs-example-heading">
          {example.title && <h3 className="docs-h3">{example.title}</h3>}
          {example.description && <p className="docs-p docs-example-desc">{example.description}</p>}
        </div>
      )}
      <div className="docs-example-frame">
        <div className="docs-example-preview">
          <Render />
        </div>
        <div className="docs-example-toolbar">
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<Code2 size={14} />}
            onClick={() => setShowCode(s => !s)}
            aria-expanded={showCode}
          >
            {showCode ? 'Hide code' : 'Show code'}
          </Button>
        </div>
        {showCode && (
          <div className="docs-example-code">
            <CodeBlock code={example.code} language="tsx" showLineNumbers={false} />
          </div>
        )}
      </div>
    </div>
  );
};

/** Props reference generated from the library source (docs/COMPONENT_MANIFEST.json). */
export const PropsTable: React.FC<{ component: string }> = ({ component }) => {
  const entry = manifest.components[component];
  if (!entry) {
    return <Callout tone="warning">No API data found for {component}. Run <C>npm run docs:manifest</C>.</Callout>;
  }
  const props = Object.entries(entry.props).sort(([, a], [, b]) => Number(b.required) - Number(a.required));

  return (
    <div className="docs-api">
      <div className="docs-api-heading">
        <h3 className="docs-h3">
          <code>{`<${component}>`}</code>
        </h3>
        {entry.inherits && (
          <span className="docs-api-inherits">
            Also accepts all native props of <C>{entry.inherits.join(', ')}</C>
          </span>
        )}
      </div>
      {entry.description && <p className="docs-p">{firstParagraph(entry.description)}</p>}
      {props.length === 0 ? (
        <p className="docs-p docs-muted">No props of its own.</p>
      ) : (
        <div className="docs-table-wrap">
          <table className="docs-table">
            <thead>
              <tr>
                <th scope="col">Prop</th>
                <th scope="col">Type</th>
                <th scope="col">Default</th>
                <th scope="col">Description</th>
              </tr>
            </thead>
            <tbody>
              {props.map(([name, prop]) => (
                <tr key={name}>
                  <td className="docs-prop-name">
                    <code>{name}</code>
                    {prop.required && (
                      <Badge size="sm" variant="accent">
                        required
                      </Badge>
                    )}
                  </td>
                  <td>
                    <code className="docs-prop-type">{prop.type}</code>
                  </td>
                  <td>{prop.default ? <code className="docs-prop-default">{prop.default}</code> : <span className="docs-muted">—</span>}</td>
                  <td className="docs-prop-desc">{renderInlineCode(prop.description ?? '')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export const KeyboardTable: React.FC<{ rows: { keys: string[]; description: string }[] }> = ({ rows }) => (
  <div className="docs-table-wrap">
    <table className="docs-table">
      <thead>
        <tr>
          <th scope="col">Key</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr key={row.keys.join('+') + row.description}>
            <td className="docs-keys">
              {row.keys.map(k => (
                <Kbd key={k}>{k}</Kbd>
              ))}
            </td>
            <td>{row.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

function firstParagraph(text: string) {
  return renderInlineCode(text.split(/\n\s*\n/)[0].replace(/\n/g, ' '));
}

/** Render `backtick` spans in manifest text as <code>. */
export function renderInlineCode(text: string): React.ReactNode {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) =>
    part.startsWith('`') && part.endsWith('`') ? <code key={i}>{part.slice(1, -1)}</code> : <React.Fragment key={i}>{part}</React.Fragment>
  );
}
