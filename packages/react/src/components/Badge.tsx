'use client';

import React, { useEffect, useState } from 'react';
import { mergeClassNames } from '../utils/polymorphic.js';

export type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Colour. Use status variants to convey state. Default `default`. */
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** Show a leading status dot. */
  dot?: boolean;
  children: React.ReactNode;
}

/**
 * A small label for status, counts or categories.
 *
 * @example
 * <Badge variant="success" dot>Running</Badge>
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  className = '',
  ...props
}) => {
  return (
    <span
      className={mergeClassNames('field-badge', `field-badge-${variant}`, `field-badge-${size}`, className)}
      {...props}
    >
      {dot && <span className="field-badge-dot" aria-hidden="true" />}
      {children}
    </span>
  );
};

export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps {
  /** Image URL. Falls back to initials if missing or it fails to load. */
  src?: string;
  /** Alt text for the image (falls back to `name`). */
  alt?: string;
  /** Used for the initials fallback and tooltip. */
  name?: string;
  size?: AvatarSize;
  className?: string;
}

const getInitials = (str?: string) => {
  if (!str) return '?';
  const parts = str.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return (parts[0] ?? '?').slice(0, 2).toUpperCase();
};

/**
 * A user or entity picture with an initials fallback.
 *
 * @example
 * <Avatar name="Ada Lovelace" src={user.photoUrl} />
 */
export const Avatar: React.FC<AvatarProps> = ({ src, alt, name, size = 'md', className = '' }) => {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  const label = alt || name;

  return (
    <span
      className={mergeClassNames('field-avatar', `field-avatar-${size}`, className)}
      title={name || alt}
      role={src && !failed ? undefined : 'img'}
      aria-label={src && !failed ? undefined : label || 'Avatar'}
    >
      {src && !failed ? (
        <img src={src} alt={label || 'Avatar'} onError={() => setFailed(true)} />
      ) : (
        <span aria-hidden="true">{getInitials(name || alt)}</span>
      )}
    </span>
  );
};

export interface AvatarGroupProps {
  children: React.ReactNode;
  /** Maximum avatars shown before collapsing the rest into "+N". Default 4. */
  max?: number;
  size?: AvatarSize;
  className?: string;
}

/** Overlapping row of avatars with a "+N" overflow indicator. */
export const AvatarGroup: React.FC<AvatarGroupProps> = ({ children, max = 4, size = 'md', className = '' }) => {
  const items = React.Children.toArray(children);
  const visibleItems = items.slice(0, max);
  const remaining = items.length - max;

  return (
    <div className={mergeClassNames('field-avatar-group', className)}>
      {visibleItems.map((child, idx) => {
        const itemKey = React.isValidElement(child) && child.key ? child.key : `avatar-item-${idx}`;
        return (
          <span key={itemKey} className="field-avatar-group-item">
            {child}
          </span>
        );
      })}
      {remaining > 0 && (
        <span
          className={mergeClassNames('field-avatar', `field-avatar-${size}`, 'field-avatar-group-item', 'field-avatar-overflow')}
          aria-label={`${remaining} more`}
          role="img"
        >
          +{remaining}
        </span>
      )}
    </div>
  );
};
