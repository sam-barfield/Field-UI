'use client';

import React from 'react';
import { mergeClassNames } from '../utils/polymorphic.js';
import {
  applyResponsive,
  type Breakpoint,
  type Responsive,
  type ResponsiveAccumulator,
} from '../utils/responsive.js';

export type { Breakpoint, Responsive } from '../utils/responsive.js';
export { breakpoints } from '../utils/responsive.js';

/* --- TYPOGRAPHY --- */
type TextAlign = 'start' | 'center' | 'end';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Visual size and, by default, the rendered `h1`-`h4` tag. Default 2. */
  level?: 1 | 2 | 3 | 4;
  /**
   * Large, fluid display size for hero and section headlines (`sm` to `xl`). Scales with the
   * viewport and overrides the size implied by `level` (the tag still follows `level` / `as`).
   */
  display?: 'sm' | 'md' | 'lg' | 'xl';
  /** Text alignment; accepts a breakpoint object. */
  align?: Responsive<TextAlign>;
  /** Render a different tag than the level implies (keep the document outline correct while choosing the look). */
  as?: React.ElementType;
  children: React.ReactNode;
}

/**
 * Section heading. `level` sets the size; pass `as` to decouple the visual
 * size from the semantic tag, e.g. `<Heading level={1} as="h2">`. Use `display`
 * for hero-sized headlines. Headings use the theme's `--field-font-display`.
 *
 * @example
 * <Heading level={1} display="lg" align={{ base: 'start', md: 'center' }}>Fresh bread, every morning</Heading>
 */
export const Heading: React.FC<HeadingProps> = ({ level = 2, display, align, as, children, className = '', style, ...props }) => {
  const Tag = (as ?? `h${level}`) as React.ElementType;
  const acc: ResponsiveAccumulator = { style: {}, classes: [] };
  applyResponsive(acc, 'ta', 'textAlign', align);
  return (
    <Tag
      className={mergeClassNames(
        'field-heading',
        `field-heading-${level}`,
        display && `field-heading-display-${display}`,
        ...acc.classes,
        className
      )}
      style={{ ...acc.style, ...style }}
      {...props}
    >
      {children}
    </Tag>
  );
};

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /** Text size. `xl` is a fluid lead/intro size for hero and section copy. */
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  /** Colour emphasis. Default `primary`. */
  tone?: 'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'danger';
  /** Font weight. */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  /** Text alignment; accepts a breakpoint object. */
  align?: Responsive<TextAlign>;
  /** Use the monospace font. */
  mono?: boolean;
  /** Truncate to a single line with an ellipsis. */
  truncate?: boolean;
  /** Element to render. Default `p`; use `span` inside inline contexts. */
  as?: React.ElementType;
  children: React.ReactNode;
}

/**
 * Body text with size, tone and weight presets.
 *
 * @example
 * <Text size="sm" tone="secondary">Last deployed 3 minutes ago</Text>
 * <Text size="xl" tone="secondary" align="center">Small-batch coffee, roasted on site.</Text>
 */
export const Text: React.FC<TextProps> = ({
  size = 'base',
  tone = 'primary',
  weight = 'normal',
  align,
  mono = false,
  truncate = false,
  as: Tag = 'p',
  children,
  className = '',
  style,
  ...props
}) => {
  const acc: ResponsiveAccumulator = { style: {}, classes: [] };
  applyResponsive(acc, 'ta', 'textAlign', align);
  return (
    <Tag
      className={mergeClassNames(
        'field-text',
        `field-text-${size}`,
        `field-text-${tone}`,
        `field-text-weight-${weight}`,
        mono && 'field-text-mono',
        truncate && 'field-text-truncate',
        ...acc.classes,
        className
      )}
      style={{ ...acc.style, ...style }}
      {...props}
    >
      {children}
    </Tag>
  );
};

/** Keyboard key, e.g. `<Kbd>⌘</Kbd><Kbd>K</Kbd>`. */
export const Kbd: React.FC<React.HTMLAttributes<HTMLElement>> = ({ children, className = '', ...props }) => (
  <kbd className={mergeClassNames('field-kbd', className)} {...props}>
    {children}
  </kbd>
);

/** Inline code. For multi-line snippets use `CodeBlock`. */
export const Code: React.FC<React.HTMLAttributes<HTMLElement>> = ({ children, className = '', ...props }) => (
  <code className={mergeClassNames('field-code', className)} {...props}>
    {children}
  </code>
);

/* --- LAYOUT --- */

/**
 * Spacing values for layout props. Numbers are pixels (`gap={12}`), strings
 * are used as-is (`gap="1.5rem"`), and `$`-prefixed keys map to the Field
 * spacing scale (`gap="$4"` → `var(--field-space-4)` = 16px).
 */
export type SpaceValue = number | string;

function resolveSpace(value: SpaceValue | undefined): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return `${value}px`;
  if (value.startsWith('$')) {
    return `var(--field-space-${value.slice(1).replace('.', '_')})`;
  }
  return value;
}

interface LayoutProps extends React.HTMLAttributes<HTMLElement> {
  /** Element to render. Default `div`. */
  as?: React.ElementType;
  /** Padding (number = px, `$4` = spacing token); accepts a breakpoint object. */
  padding?: Responsive<SpaceValue>;
  /** Hide below this breakpoint (e.g. `hideBelow="md"` shows only from 768px). */
  hideBelow?: Breakpoint;
  /** Hide from this breakpoint up (e.g. `hideFrom="md"` shows only below 768px). */
  hideFrom?: Breakpoint;
}

/** Shared handling for `padding`, `hideBelow` and `hideFrom`. */
function applyLayoutBase(
  acc: ResponsiveAccumulator,
  { padding, hideBelow, hideFrom }: Pick<LayoutProps, 'padding' | 'hideBelow' | 'hideFrom'>
) {
  applyResponsive(acc, 'p', 'padding', padding, resolveSpace);
  if (hideBelow) acc.classes.push(`field-hide-below-${hideBelow}`);
  if (hideFrom) acc.classes.push(`field-hide-from-${hideFrom}`);
}

export interface BoxProps extends LayoutProps {
  children?: React.ReactNode;
}

/** A plain block container, useful with `as`, `padding` and `hideBelow` / `hideFrom`. */
export const Box: React.FC<BoxProps> = ({
  as: Tag = 'div',
  padding,
  hideBelow,
  hideFrom,
  children,
  className = '',
  style,
  ...props
}) => {
  const acc: ResponsiveAccumulator = { style: {}, classes: [] };
  applyLayoutBase(acc, { padding, hideBelow, hideFrom });
  return (
    <Tag className={mergeClassNames('field-box', ...acc.classes, className)} style={{ ...acc.style, ...style }} {...props}>
      {children}
    </Tag>
  );
};

type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
type FlexAlign = 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
type FlexJustify = 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';

export interface FlexProps extends LayoutProps {
  /** Main axis; accepts a breakpoint object, e.g. `{ base: 'column', md: 'row' }`. */
  direction?: Responsive<FlexDirection>;
  /** Cross-axis alignment; accepts a breakpoint object. */
  align?: Responsive<FlexAlign>;
  /** Main-axis distribution; accepts a breakpoint object. */
  justify?: Responsive<FlexJustify>;
  /** Space between children; accepts a breakpoint object. */
  gap?: Responsive<SpaceValue>;
  /** Wrapping; accepts a breakpoint object. */
  wrap?: Responsive<'nowrap' | 'wrap' | 'wrap-reverse'>;
  /** Render as `inline-flex`. */
  inline?: boolean;
  children: React.ReactNode;
}

/**
 * Flexbox row/column. Every layout prop accepts a breakpoint object (mobile first).
 *
 * @example
 * <Flex align="center" justify="space-between" gap={12}>…</Flex>
 * <Flex direction={{ base: 'column', md: 'row' }} gap={{ base: '$4', lg: '$8' }}>…</Flex>
 */
export const Flex: React.FC<FlexProps> = ({
  as: Tag = 'div',
  direction = 'row',
  align = 'stretch',
  justify = 'flex-start',
  gap,
  wrap = 'nowrap',
  inline = false,
  padding,
  hideBelow,
  hideFrom,
  children,
  className = '',
  style,
  ...props
}) => {
  const acc: ResponsiveAccumulator = { style: {}, classes: [] };
  applyResponsive(acc, 'fd', 'flexDirection', direction, undefined, 'row');
  applyResponsive(acc, 'ai', 'alignItems', align, undefined, 'stretch');
  applyResponsive(acc, 'jc', 'justifyContent', justify, undefined, 'flex-start');
  applyResponsive(acc, 'gap', 'gap', gap, resolveSpace);
  applyResponsive(acc, 'fw', 'flexWrap', wrap, undefined, 'nowrap');
  applyLayoutBase(acc, { padding, hideBelow, hideFrom });
  return (
    <Tag
      className={mergeClassNames('field-flex', ...acc.classes, className)}
      style={{ display: inline ? 'inline-flex' : undefined, ...acc.style, ...style }}
      {...props}
    >
      {children}
    </Tag>
  );
};

export interface StackProps extends LayoutProps {
  /** Space between children. Default 16px. Accepts a breakpoint object. */
  gap?: Responsive<SpaceValue>;
  /**
   * Horizontal alignment of children; accepts a breakpoint object. With the default `stretch`,
   * direct `img`, `svg`, `video` and `canvas` children keep their own width so they are not distorted.
   */
  align?: Responsive<'flex-start' | 'center' | 'flex-end' | 'stretch'>;
  children: React.ReactNode;
}

/** Vertical stack with consistent spacing between children. */
export const Stack: React.FC<StackProps> = ({
  as: Tag = 'div',
  gap = 16,
  align = 'stretch',
  padding,
  hideBelow,
  hideFrom,
  children,
  className = '',
  style,
  ...props
}) => {
  const acc: ResponsiveAccumulator = { style: {}, classes: [] };
  applyResponsive(acc, 'gap', 'gap', gap, resolveSpace, 16);
  applyResponsive(acc, 'ai', 'alignItems', align, undefined, 'stretch');
  applyLayoutBase(acc, { padding, hideBelow, hideFrom });
  return (
    <Tag
      className={mergeClassNames('field-stack', align === 'stretch' && 'field-stack-stretch', ...acc.classes, className)}
      style={{ ...acc.style, ...style }}
      {...props}
    >
      {children}
    </Tag>
  );
};

export interface GridProps extends LayoutProps {
  /** Number of equal columns, or any `grid-template-columns` value. Accepts a breakpoint object, e.g. `{ base: 1, md: 2, lg: 3 }`. */
  columns?: Responsive<number | string>;
  /** Responsive auto-fit: columns at least this wide (e.g. `240` or `"16rem"`), as many as fit. Takes precedence over `columns`. */
  minChildWidth?: number | string;
  /** Space between cells; accepts a breakpoint object. */
  gap?: Responsive<SpaceValue>;
  /** Vertical alignment of items within their row (`align-items`). Default `stretch`; accepts a breakpoint object. */
  align?: Responsive<'start' | 'center' | 'end' | 'stretch' | 'baseline'>;
  children: React.ReactNode;
}

const toGridTemplate = (columns: number | string) =>
  typeof columns === 'number' ? `repeat(${columns}, minmax(0, 1fr))` : columns;

/**
 * CSS grid. Use `minChildWidth` for card grids that reflow on their own, or a
 * breakpoint object on `columns` for explicit control.
 *
 * @example
 * <Grid minChildWidth={260} gap={16}>{cards}</Grid>
 * <Grid columns={{ base: 1, md: 2, lg: 3 }} gap="$6">{features}</Grid>
 */
export const Grid: React.FC<GridProps> = ({
  as: Tag = 'div',
  columns = 1,
  minChildWidth,
  gap = 16,
  align,
  padding,
  hideBelow,
  hideFrom,
  children,
  className = '',
  style,
  ...props
}) => {
  const acc: ResponsiveAccumulator = { style: {}, classes: [] };
  if (minChildWidth !== undefined) {
    const min = typeof minChildWidth === 'number' ? `${minChildWidth}px` : minChildWidth;
    acc.style.gridTemplateColumns = `repeat(auto-fit, minmax(min(${min}, 100%), 1fr))`;
  } else {
    applyResponsive(acc, 'gtc', 'gridTemplateColumns', columns, toGridTemplate, 1);
  }
  applyResponsive(acc, 'gap', 'gap', gap, resolveSpace, 16);
  applyResponsive(acc, 'ai', 'alignItems', align, undefined, 'stretch');
  applyLayoutBase(acc, { padding, hideBelow, hideFrom });

  return (
    <Tag className={mergeClassNames('field-grid', ...acc.classes, className)} style={{ ...acc.style, ...style }} {...props}>
      {children}
    </Tag>
  );
};

export interface ContainerProps extends LayoutProps {
  /** Max content width. Default `xl` (1280px). Presets: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, `prose` 68ch; or any CSS length. */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'prose' | (string & {});
  children: React.ReactNode;
}

const CONTAINER_WIDTHS: Record<string, string> = { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', prose: '68ch' };

/** Centres content with a max width and horizontal padding (wider gutters from `md`). */
export const Container: React.FC<ContainerProps> = ({
  as: Tag = 'div',
  maxWidth = 'xl',
  padding,
  hideBelow,
  hideFrom,
  children,
  className = '',
  style,
  ...props
}) => {
  const acc: ResponsiveAccumulator = { style: {}, classes: [] };
  applyLayoutBase(acc, { padding, hideBelow, hideFrom });
  return (
    <Tag
      className={mergeClassNames('field-container', ...acc.classes, className)}
      style={{ maxWidth: CONTAINER_WIDTHS[maxWidth] ?? maxWidth, ...acc.style, ...style }}
      {...props}
    >
      {children}
    </Tag>
  );
};
