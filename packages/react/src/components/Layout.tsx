'use client';

import React from 'react';
import { mergeClassNames } from '../utils/polymorphic.js';
import {
  applyResponsive,
  resolveSpace,
  type Breakpoint,
  type Responsive,
  type ResponsiveAccumulator,
  type SpaceValue,
} from '../utils/responsive.js';

export type { Breakpoint, Responsive, SpaceValue } from '../utils/responsive.js';
export { breakpoints, resolveSpace } from '../utils/responsive.js';

/* --- LAYOUT --- */

/**
 * Spacing values for layout props. Numbers are pixels (`gap={12}`), strings
 * are used as-is (`gap="1.5rem"`), and `$`-prefixed keys map to the Field
 * spacing scale (`gap="$4"` → `var(--field-space-4)` = 16px).
 */

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

const normalizeFlexAlign = (v: any) =>
  v === 'start' ? 'flex-start' : v === 'end' ? 'flex-end' : v;

const normalizeFlexJustify = (v: any) =>
  v === 'start' ? 'flex-start' : v === 'end' ? 'flex-end' : v;

type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type FlexAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline' | 'flex-start' | 'flex-end';
export type FlexJustify = 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly' | 'flex-start' | 'flex-end';

export interface FlexProps extends LayoutProps {
  /** Main axis. Default `row`. Accepts a breakpoint object, e.g. `{ base: 'column', md: 'row' }`. */
  direction?: Responsive<FlexDirection>;
  /** Cross-axis alignment: `start`, `center`, `end`, `stretch` (default) or `baseline` (`flex-start` / `flex-end` also work). Accepts a breakpoint object. */
  align?: Responsive<FlexAlign>;
  /** Main-axis distribution: `start` (default), `center`, `end`, `space-between`, `space-around` or `space-evenly` (`flex-start` / `flex-end` also work). Accepts a breakpoint object. */
  justify?: Responsive<FlexJustify>;
  /** Space between children; accepts a breakpoint object. */
  gap?: Responsive<SpaceValue>;
  /** Wrapping. Default `nowrap`. Accepts a breakpoint object. */
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
  direction,
  align,
  justify,
  gap,
  wrap,
  inline = false,
  padding,
  hideBelow,
  hideFrom,
  children,
  className = '',
  style,
  ...props
}) => {
  // Unset props emit nothing: `.field-flex` already has the defaults, which keeps the inline style small.
  const acc: ResponsiveAccumulator = { style: {}, classes: [] };
  applyResponsive(acc, 'fd', 'flexDirection', direction, undefined, 'row');
  applyResponsive(acc, 'ai', 'alignItems', align, normalizeFlexAlign, 'stretch');
  applyResponsive(acc, 'jc', 'justifyContent', justify, normalizeFlexJustify, 'flex-start');
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
  /** Space between children. Default 16px (`$4`). Accepts a breakpoint object. */
  gap?: Responsive<SpaceValue>;
  /**
   * Horizontal alignment of children: `start`, `center`, `end`, `stretch` (default) or `baseline`.
   * Accepts a breakpoint object. With `stretch`,
   * direct `img`, `svg`, `video` and `canvas` children keep their own width so they are not distorted.
   */
  align?: Responsive<FlexAlign>;
  children: React.ReactNode;
}

/** Vertical stack with consistent spacing between children. */
export const Stack: React.FC<StackProps> = ({
  as: Tag = 'div',
  gap,
  align,
  padding,
  hideBelow,
  hideFrom,
  children,
  className = '',
  style,
  ...props
}) => {
  // Unset props emit nothing: `.field-stack` has the default gap and alignment.
  const acc: ResponsiveAccumulator = { style: {}, classes: [] };
  applyResponsive(acc, 'gap', 'gap', gap, resolveSpace, 16);
  applyResponsive(acc, 'ai', 'alignItems', align, normalizeFlexAlign, 'stretch');
  applyLayoutBase(acc, { padding, hideBelow, hideFrom });
  return (
    <Tag
      className={mergeClassNames(
        'field-stack',
        (align === undefined || align === 'stretch') && 'field-stack-stretch',
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

export interface GridProps extends LayoutProps {
  /** Number of equal columns, or any `grid-template-columns` value. Accepts a breakpoint object, e.g. `{ base: 1, md: 2, lg: 3 }`. */
  columns?: Responsive<number | string>;
  /** Responsive auto-fit: columns at least this wide (e.g. `240` or `"16rem"`), as many as fit. Takes precedence over `columns`. */
  minChildWidth?: number | string;
  /** Space between cells. Default 16px (`$4`). Accepts a breakpoint object. */
  gap?: Responsive<SpaceValue>;
  /** Vertical alignment of items within their row (`align-items`): the same values as `Flex align`. Default `stretch`; accepts a breakpoint object. */
  align?: Responsive<FlexAlign>;
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
  columns,
  minChildWidth,
  gap,
  align,
  padding,
  hideBelow,
  hideFrom,
  children,
  className = '',
  style,
  ...props
}) => {
  // Unset props emit nothing: `.field-grid` defaults to one column and a 16px gap.
  const acc: ResponsiveAccumulator = { style: {}, classes: [] };
  if (minChildWidth !== undefined) {
    const min = typeof minChildWidth === 'number' ? `${minChildWidth}px` : minChildWidth;
    acc.style.gridTemplateColumns = `repeat(auto-fit, minmax(min(${min}, 100%), 1fr))`;
  } else {
    applyResponsive(acc, 'gtc', 'gridTemplateColumns', columns, toGridTemplate, 1);
  }
  applyResponsive(acc, 'gap', 'gap', gap, resolveSpace, 16);
  applyResponsive(acc, 'ai', 'alignItems', align, normalizeFlexAlign, 'stretch');
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

export interface DividedProps extends LayoutProps {
  /**
   * `column` (default) stacks the parts with horizontal lines between them; `row` puts them side by
   * side, equal width, with vertical lines. Accepts a breakpoint object, e.g. `{ base: 'column', md: 'row' }`.
   */
  direction?: Responsive<'row' | 'column'>;
  /** Space on each side of a line (number = px, `$6` = spacing token). Default `$6` (24px). */
  space?: SpaceValue;
  children: React.ReactNode;
}

/**
 * Several parts sharing one surface (a card, a panel, a band), separated by hairlines instead of
 * each getting its own box. The outer edges get no extra space, so the parts line up with the
 * container's padding. Line colour: `--field-divided-color`.
 *
 * @example
 * <Card>
 *   <Divided direction={{ base: 'column', md: 'row' }}>
 *     <Stack gap="$2">…opening hours…</Stack>
 *     <Stack gap="$2">…admission…</Stack>
 *     <Stack gap="$2">…getting here…</Stack>
 *   </Divided>
 * </Card>
 */
export const Divided: React.FC<DividedProps> = ({
  as: Tag = 'div',
  direction = 'column',
  space,
  padding,
  hideBelow,
  hideFrom,
  children,
  className = '',
  style,
  ...props
}) => {
  const acc: ResponsiveAccumulator = { style: {}, classes: [] };
  // Grid, so side-by-side parts are exactly equal width whatever their padding.
  applyResponsive(acc, 'gaf', 'gridAutoFlow', direction, d => (d === 'row' ? 'column' : 'row'), 'column');
  applyResponsive(acc, 'dvr', '--_dv-row', direction, d => (d === 'row' ? '1' : '0'), 'column');
  applyLayoutBase(acc, { padding, hideBelow, hideFrom });
  return (
    <Tag
      className={mergeClassNames('field-divided', ...acc.classes, className)}
      style={{ ...(space !== undefined ? { '--field-divided-space': resolveSpace(space) } : {}), ...acc.style, ...style }}
      {...props}
    >
      {children}
    </Tag>
  );
};
