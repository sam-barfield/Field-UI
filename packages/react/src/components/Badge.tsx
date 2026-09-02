import React from 'react';

export type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  dot = false,
  children,
  className = '',
  ...props
}) => {
  return (
    <span className={`field-badge field-badge-${variant} ${className}`} {...props}>
      {dot && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'currentColor',
          }}
        />
      )}
      {children}
    </span>
  );
};

export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  name,
  size = 'md',
  className = '',
}) => {
  const getInitials = (str?: string) => {
    if (!str) return '?';
    const parts = str.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return str.slice(0, 2).toUpperCase();
  };

  return (
    <div className={`field-avatar field-avatar-${size} ${className}`} title={name || alt}>
      {src ? (
        <img src={src} alt={alt || name || 'Avatar'} />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};

export interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({ children, max = 4 }) => {
  const items = React.Children.toArray(children);
  const visibleItems = items.slice(0, max);
  const remaining = items.length - max;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
      {visibleItems.map((child, idx) => (
        <div
          key={idx}
          style={{
            marginLeft: idx === 0 ? 0 : '-8px',
            border: '2px solid var(--field-surface-base)',
            borderRadius: 'var(--field-radius-full)',
          }}
        >
          {child}
        </div>
      ))}
      {remaining > 0 && (
        <div
          className="field-avatar field-avatar-md"
          style={{
            marginLeft: '-8px',
            border: '2px solid var(--field-surface-base)',
            fontSize: '0.75rem',
          }}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};
