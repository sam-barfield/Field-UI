'use client';

import React from 'react';
import { mergeClassNames } from '../utils/polymorphic.js';
import { applyResponsive, type Responsive, type ResponsiveAccumulator } from '../utils/responsive.js';

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
  /** Text style variant. `overline` renders compact uppercase tracked text for badges/eyebrows. */
  variant?: 'body' | 'overline';
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
  /** Limit the line length for readability: `true` = 66ch, a number = px (as on every Field size prop), or any CSS length such as `"60ch"`. */
  measure?: boolean | string | number;
  /** Tabular lining figures for numbers, timers, prices, and metrics. */
  tabularNums?: boolean;
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
  variant = 'body',
  size = 'base',
  tone = 'primary',
  weight = 'normal',
  align,
  mono = false,
  truncate = false,
  measure,
  tabularNums = false,
  as: Tag = 'p',
  children,
  className = '',
  style,
  ...props
}) => {
  const acc: ResponsiveAccumulator = { style: {}, classes: [] };
  applyResponsive(acc, 'ta', 'textAlign', align);

  const measureStyle: React.CSSProperties =
    measure === true
      ? { maxWidth: '66ch' }
      : typeof measure === 'number'
      ? { maxWidth: `${measure}px` }
      : typeof measure === 'string'
      ? { maxWidth: measure }
      : {};

  return (
    <Tag
      className={mergeClassNames(
        'field-text',
        variant === 'overline' && 'field-text-overline',
        `field-text-${size}`,
        `field-text-${tone}`,
        `field-text-weight-${weight}`,
        mono && 'field-text-mono',
        truncate && 'field-text-truncate',
        measure && 'field-text-measure',
        tabularNums && 'field-text-tabular',
        ...acc.classes,
        className
      )}
      style={{ ...measureStyle, ...acc.style, ...style }}
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
