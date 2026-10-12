'use client';

import React from 'react';
import { mergeClassNames } from '../utils/polymorphic.js';
import { resolveSpace, type SpaceValue } from '../utils/responsive.js';

export type IconTone = 'inherit' | 'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'danger';

const ICON_SIZES = { xs: 14, sm: 16, md: 20, lg: 24, xl: 32 } as const;

/* --- ICON --- */
export interface IconProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** The icon: a component such as Lucide's `MapPin`, or an element (`<MapPin />`). */
  icon: React.ElementType | React.ReactElement;
  /** `xs` 14px, `sm` 16px, `md` 20px (default), `lg` 24px, `xl` 32px, or a px number. */
  size?: keyof typeof ICON_SIZES | number;
  /** Colour from the theme. Default `inherit` (the surrounding text colour). */
  tone?: IconTone;
  /** Accessible name. Without it the icon is decorative and hidden from screen readers. */
  label?: string;
  /** Sit the icon on the text baseline, for an icon before a few words in a sentence. */
  inline?: boolean;
}

/**
 * A theme-coloured, sized icon. Decorative by default (hidden from screen readers); give it a
 * `label` when the icon is the only thing conveying the meaning.
 *
 * @example
 * <Icon icon={MapPin} tone="accent" />
 * <Icon icon={AlertTriangle} tone="warning" label="Warning" />
 */
export const Icon: React.FC<IconProps> = ({ icon, size = 'md', tone = 'inherit', label, inline = false, className = '', style, ...props }) => {
  const px = typeof size === 'number' ? size : ICON_SIZES[size];
  const glyph = React.isValidElement(icon)
    ? icon
    : React.createElement(icon as React.ElementType, { 'aria-hidden': true, focusable: 'false' });
  return (
    <span
      className={mergeClassNames('field-icon', tone !== 'inherit' && `field-icon-${tone}`, inline && 'field-icon-inline', className)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{ '--field-icon-size': `${px}px`, ...style } as React.CSSProperties}
      {...props}
    >
      {glyph}
    </span>
  );
};

/* --- ICON TEXT --- */
export interface IconTextProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The icon: a component such as Lucide's `Clock`, or an element. */
  icon: React.ElementType | React.ReactElement;
  /** Icon size, as on `Icon`. Default `md` (20px). */
  iconSize?: IconProps['size'];
  /** Icon colour, as on `Icon`. Default `accent`. */
  tone?: IconTone;
  /** Space between the icon and the text (number = px, `$3` = spacing token). Default `$2.5` (10px). */
  gap?: SpaceValue;
  /** Align the icon with the first line of text (`start`, default) or centre it on the whole block. */
  align?: 'start' | 'center';
  /** Element to render. Default `div`. */
  as?: React.ElementType;
  children: React.ReactNode;
}

/**
 * An icon beside a block of text: an address, opening hours, a feature list item. The icon is
 * decorative; the text carries the meaning.
 *
 * @example
 * <IconText icon={MapPin}>
 *   <Text weight="semibold">RAF Snaith Museum</Text>
 *   <Text tone="secondary">Pollington, East Yorkshire</Text>
 * </IconText>
 */
export const IconText: React.FC<IconTextProps> = ({
  icon,
  iconSize = 'md',
  tone = 'accent',
  gap = '$2.5',
  align = 'start',
  as: Tag = 'div',
  className = '',
  style,
  children,
  ...props
}) => (
  <Tag
    className={mergeClassNames('field-icon-text', `field-icon-text-${align}`, className)}
    style={{ gap: resolveSpace(gap), ...style }}
    {...props}
  >
    <Icon icon={icon} size={iconSize} tone={tone} />
    <div className="field-icon-text-body">{children}</div>
  </Tag>
);
