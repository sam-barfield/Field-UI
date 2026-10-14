'use client';

import React, { useMemo } from 'react';
import { parseDocument } from 'htmlparser2';
import { Prose, type ProseProps } from './Website.js';

/* --- SAFE HTML --- */

/** Attributes kept per tag (HTML name → React prop name). Everything else is dropped. */
const ALLOWED: Record<string, Record<string, string>> = {
  p: {}, br: {}, hr: {},
  h1: {}, h2: {}, h3: {}, h4: {}, h5: {}, h6: {},
  ul: {}, ol: { start: 'start', reversed: 'reversed', type: 'type' }, li: { value: 'value' },
  dl: {}, dt: {}, dd: {},
  blockquote: {}, pre: {}, figure: {}, figcaption: {},
  table: {}, caption: {}, thead: {}, tbody: {}, tfoot: {}, tr: {},
  th: { colspan: 'colSpan', rowspan: 'rowSpan', scope: 'scope', abbr: 'abbr' },
  td: { colspan: 'colSpan', rowspan: 'rowSpan' },
  a: { href: 'href', title: 'title', hreflang: 'hrefLang' },
  img: { src: 'src', alt: 'alt', width: 'width', height: 'height', srcset: 'srcSet', sizes: 'sizes', title: 'title' },
  strong: {}, b: {}, em: {}, i: {}, u: {}, s: {}, del: {}, ins: {}, mark: {}, small: {}, sub: {}, sup: {},
  code: {}, kbd: {}, samp: {}, var: {}, abbr: { title: 'title' }, cite: {}, q: {}, dfn: {},
  time: { datetime: 'dateTime' },
};

/** Attributes kept on every allowed tag. */
const GLOBAL_ATTRS: Record<string, string> = { lang: 'lang', dir: 'dir' };

/** Tags dropped with everything inside them. Any other unknown tag is unwrapped (its content kept). */
const DROPPED = new Set([
  'script', 'style', 'noscript', 'template', 'iframe', 'frame', 'frameset', 'object', 'embed', 'applet',
  'form', 'input', 'button', 'select', 'option', 'optgroup', 'textarea', 'datalist', 'output',
  'head', 'title', 'meta', 'link', 'base', 'svg', 'math', 'canvas', 'video', 'audio', 'source', 'track', 'map', 'dialog',
]);

/** Tags whose whitespace-only text is dropped (React warns about text inside table parts). */
const NO_TEXT = new Set(['table', 'thead', 'tbody', 'tfoot', 'tr', 'ul', 'ol', 'dl']);

const VOID = new Set(['br', 'hr', 'img']);
const HEADING = /^h([1-6])$/;
const TH_SCOPES = new Set(['row', 'col', 'rowgroup', 'colgroup']);

/** The tags `ProseHtml` can render. */
export type ProseHtmlTag = keyof typeof ALLOWED & string;

/** Every tag rendered by default; pass a subset as `allowedTags` to narrow it. */
export const PROSE_HTML_TAGS = Object.keys(ALLOWED) as ProseHtmlTag[];

/**
 * A safe URL: `http(s):`, `mailto:`, `tel:`, protocol-relative, relative, or `#anchor`.
 * Control characters and whitespace (which browsers ignore inside schemes) are stripped first.
 */
const safeUrl = (raw: string): string | undefined => {
  const url = raw.replace(/[\u0000- \u007f-\u009f]/g, '');
  if (!url) return undefined;
  const scheme = /^([a-z][a-z\d+.-]*):/i.exec(url);
  if (!scheme) return raw.trim();
  return /^(https?|mailto|tel)$/i.test(scheme[1]) ? raw.trim() : undefined;
};

/** `srcset`: kept only when every candidate URL is safe. */
const safeSrcSet = (raw: string): string | undefined =>
  raw.split(',').every(candidate => safeUrl(candidate.trim().split(/\s+/)[0] ?? '') !== undefined) ? raw : undefined;

/** True for absolute `http(s):` and protocol-relative links. */
const defaultIsExternal = (href: string) => /^(https?:)?\/\//i.test(href);

export interface HtmlToReactOptions {
  /**
   * The level the content's top heading becomes; the others shift by the same amount (capped at
   * `h6`). E.g. content under a card's `h3` should start at `4`. Default: levels are kept.
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * Replace how a tag renders, like react-markdown's `components`: e.g. `{ a: RouterLink }` or
   * `{ img: props => <Image {...props} radius="md" /> }`. Each gets the cleaned attributes as
   * React props plus `children`. Define the object once (outside the component or with `useMemo`):
   * a new object on every render makes `ProseHtml` parse the HTML again each time.
   */
  components?: Partial<Record<ProseHtmlTag, React.ElementType>>;
  /**
   * Narrow the tags rendered (others are unwrapped to their content). It can only remove tags:
   * names outside `PROSE_HTML_TAGS` are ignored, because each tag's safe attributes are fixed.
   */
  allowedTags?: readonly ProseHtmlTag[];
  /**
   * Which links open in a new tab (with `rel="noopener noreferrer"`). Default: absolute `http(s)`
   * links. Pass your own to keep links to your own domain in the same tab. Like `components`,
   * define it once so the HTML isn't parsed again on every render.
   */
  isExternalLink?: (href: string) => boolean;
  /** Screen-reader text added to links that open in a new tab. Default ` (opens in a new tab)`; `''` for none. */
  newTabLabel?: string;
}

interface DomNode {
  type: string;
  name?: string;
  data?: string;
  attribs?: Record<string, string>;
  children?: DomNode[];
}

const isElement = (node: DomNode) => node.type === 'tag';
const isBlankText = (node: DomNode) => node.type === 'text' && !/[^\s ]/.test(node.data ?? '');

/** A paragraph with nothing but whitespace, `&nbsp;` and `<br>` (left behind by WordPress). */
const isEmptyParagraph = (node: DomNode): boolean =>
  (node.children ?? []).every(child => isBlankText(child) || (isElement(child) && child.name === 'br'));

/** Wraps `<tr>` that sit directly in `<table>` in a `<tbody>`, as the browser would. */
const withTbody = (children: DomNode[]): DomNode[] => {
  const result: DomNode[] = [];
  let rows: DomNode[] | null = null;
  for (const child of children) {
    if (isElement(child) && child.name === 'tr') {
      if (!rows) {
        rows = [];
        result.push({ type: 'tag', name: 'tbody', attribs: {}, children: rows });
      }
      rows.push(child);
    } else {
      if (!isBlankText(child)) rows = null;
      result.push(child);
    }
  }
  return result;
};

const topHeadingLevel = (nodes: DomNode[]): number => {
  let min = 7;
  const walk = (list: DomNode[]) => {
    for (const node of list) {
      if (!isElement(node) || DROPPED.has(node.name!)) continue;
      const match = HEADING.exec(node.name!);
      if (match) min = Math.min(min, Number(match[1]));
      if (node.children) walk(node.children);
    }
  };
  walk(nodes);
  return min;
};

/**
 * Converts HTML (e.g. from a CMS) into React elements through an allowlist. Unknown tags are
 * unwrapped to their content; `script`, `style`, `iframe`, `form` and similar are dropped whole;
 * only safe attributes are kept, and only `http(s):`, `mailto:`, `tel:`, relative and `#` URLs.
 * Text is escaped by React. Runs the same on the server and in the browser, so it hydrates cleanly.
 * `ProseHtml` wraps it in `Prose`.
 */
export function htmlToReact(html: string, options: HtmlToReactOptions = {}): React.ReactNode[] {
  const {
    headingLevel,
    components = {},
    allowedTags,
    isExternalLink = defaultIsExternal,
    newTabLabel = ' (opens in a new tab)',
  } = options;
  const allowed = new Set<string>(allowedTags ? allowedTags.filter(tag => tag in ALLOWED) : PROSE_HTML_TAGS);
  const roots = parseDocument(html ?? '').children as unknown as DomNode[];
  const top = topHeadingLevel(roots);
  const shift = headingLevel && top < 7 ? headingLevel - top : 0;

  const convertAll = (nodes: DomNode[], parent: string | undefined, key: string): React.ReactNode[] => {
    const list = parent === 'table' ? withTbody(nodes) : nodes;
    const out: React.ReactNode[] = [];
    list.forEach((node, i) => {
      const converted = convert(node, parent, list, `${key}.${i}`);
      if (Array.isArray(converted)) out.push(...converted);
      else if (converted !== null && converted !== undefined) out.push(converted);
    });
    return out;
  };

  const convert = (node: DomNode, parent: string | undefined, siblings: DomNode[], key: string): React.ReactNode => {
    if (node.type === 'text') {
      if (parent && NO_TEXT.has(parent) && isBlankText(node)) return null;
      return node.data ?? '';
    }
    // Comments, CDATA, directives (<!doctype>), and <script> / <style> (their own node types).
    if (!isElement(node)) return null;
    const name = node.name!.toLowerCase();
    if (DROPPED.has(name)) return null;
    if (!allowed.has(name)) return convertAll(node.children ?? [], parent, key);
    if (name === 'p' && isEmptyParagraph(node)) return null;

    const attribs = node.attribs ?? {};
    const props: Record<string, unknown> = { key };
    const map = { ...GLOBAL_ATTRS, ...ALLOWED[name] };
    for (const [attr, raw] of Object.entries(attribs)) {
      const prop = map[attr.toLowerCase()];
      if (!prop) continue;
      if (prop === 'href' || prop === 'src') {
        const url = safeUrl(raw);
        if (url !== undefined) props[prop] = url;
      } else if (prop === 'srcSet') {
        const srcSet = safeSrcSet(raw);
        if (srcSet) props.srcSet = srcSet;
      } else if (prop === 'colSpan' || prop === 'rowSpan' || prop === 'start' || prop === 'value') {
        const n = parseInt(raw, 10);
        if (Number.isFinite(n)) props[prop] = n;
      } else if (prop === 'reversed') {
        props.reversed = true;
      } else if (prop === 'scope') {
        if (TH_SCOPES.has(raw.toLowerCase())) props.scope = raw.toLowerCase();
      } else {
        props[prop] = raw;
      }
    }

    let tag = name;
    const heading = HEADING.exec(name);
    if (heading && shift) tag = `h${Math.min(6, Math.max(1, Number(heading[1]) + shift))}`;

    // A <th> in a row that also has <td> cells heads that row; otherwise it heads a column.
    if (name === 'th' && !props.scope) {
      props.scope = siblings.some(sibling => isElement(sibling) && sibling.name === 'td') ? 'row' : 'col';
    }

    let children: React.ReactNode[] = VOID.has(name) ? [] : convertAll(node.children ?? [], name, key);

    if (name === 'a' && typeof props.href === 'string' && isExternalLink(props.href)) {
      props.target = '_blank';
      props.rel = 'noopener noreferrer';
      if (newTabLabel) {
        children = [...children, <span key={`${key}.new-tab`} className="field-sr-only">{newTabLabel}</span>];
      }
    }
    if (name === 'img') {
      if (props.src === undefined) return null;
      if (props.alt === undefined) props.alt = '';
      props.loading = 'lazy';
      props.decoding = 'async';
    }

    const Component = (components as Record<string, React.ElementType | undefined>)[name] ?? tag;
    return VOID.has(name) && Component === tag
      ? React.createElement(Component, props)
      : React.createElement(Component, props, ...children);
  };

  return convertAll(roots, undefined, 'h');
}

export interface ProseHtmlProps
  extends Omit<ProseProps, 'children' | 'dangerouslySetInnerHTML'>,
    HtmlToReactOptions {
  /** HTML to render, e.g. a CMS post body. Cleaned through an allowlist and rebuilt as React elements. */
  html: string;
}

/**
 * `Prose` for HTML from a CMS: renders it as React elements through an allowlist, without
 * `dangerouslySetInnerHTML`. Works on the server and in the browser (no hydration mismatch).
 * Takes every `Prose` prop, including `collapsible`.
 *
 * Links: only `http(s):`, `mailto:`, `tel:`, relative and `#` hrefs; external links open in a new
 * tab. Empty paragraphs are dropped, `<tr>` directly in `<table>` get a `<tbody>`, and `<th>` get
 * `scope` (`row` beside `<td>` cells, else `col`).
 *
 * The HTML is parsed again whenever `html` or an option changes, so define `components`,
 * `allowedTags` and `isExternalLink` once (outside the component or with `useMemo`), not inline.
 * The parser, `htmlparser2`, is only bundled when `ProseHtml` or `htmlToReact` is imported.
 *
 * @example
 * const components = { a: RouterLink, img: props => <Image {...props} radius="md" /> };
 *
 * <ProseHtml
 *   html={post.content}
 *   headingLevel={4}
 *   components={components}
 * />
 */
export const ProseHtml: React.FC<ProseHtmlProps> = ({
  html,
  headingLevel,
  components,
  allowedTags,
  isExternalLink,
  newTabLabel,
  ...props
}) => {
  const content = useMemo(
    () => htmlToReact(html, { headingLevel, components, allowedTags, isExternalLink, newTabLabel }),
    [html, headingLevel, components, allowedTags, isExternalLink, newTabLabel]
  );
  return <Prose {...props}>{content}</Prose>;
};
