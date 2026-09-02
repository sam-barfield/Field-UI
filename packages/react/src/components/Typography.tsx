import React from 'react';

/* --- TYPOGRAPHY --- */
export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
}

export const Heading: React.FC<HeadingProps> = ({ level = 2, children, className = '', ...props }) => {
  const Tag = `h${level}` as React.ElementType;
  return (
    <Tag className={`field-heading field-heading-${level} ${className}`} {...props}>
      {children}
    </Tag>
  );
};

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: 'xs' | 'sm' | 'base' | 'lg';
  tone?: 'primary' | 'secondary' | 'tertiary';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  size = 'base',
  tone = 'primary',
  weight = 'normal',
  children,
  className = '',
  style,
  ...props
}) => {
  const fontWeights = {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  };

  return (
    <p
      className={`field-text field-text-${size} field-text-${tone} ${className}`}
      style={{ fontWeight: fontWeights[weight], ...style }}
      {...props}
    >
      {children}
    </p>
  );
};

export const Kbd: React.FC<React.HTMLAttributes<HTMLElement>> = ({ children, className = '', ...props }) => (
  <kbd className={`field-kbd ${className}`} {...props}>
    {children}
  </kbd>
);

export const Code: React.FC<React.HTMLAttributes<HTMLElement>> = ({ children, className = '', ...props }) => (
  <code className={`field-code ${className}`} {...props}>
    {children}
  </code>
);

/* --- LAYOUT --- */
export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Box: React.FC<BoxProps> = ({ children, className = '', ...props }) => (
  <div className={`field-box ${className}`} {...props}>
    {children}
  </div>
);

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  gap?: string | number;
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  children: React.ReactNode;
}

export const Flex: React.FC<FlexProps> = ({
  direction = 'row',
  align = 'stretch',
  justify = 'flex-start',
  gap,
  wrap = 'nowrap',
  children,
  className = '',
  style,
  ...props
}) => {
  return (
    <div
      className={`field-flex ${className}`}
      style={{
        flexDirection: direction,
        alignItems: align,
        justifyContent: justify,
        gap,
        flexWrap: wrap,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: string | number;
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  children: React.ReactNode;
}

export const Stack: React.FC<StackProps> = ({
  gap = '16px',
  align = 'stretch',
  children,
  className = '',
  style,
  ...props
}) => (
  <div
    className={`field-stack ${className}`}
    style={{
      gap,
      alignItems: align,
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number | string;
  gap?: string | number;
  children: React.ReactNode;
}

export const Grid: React.FC<GridProps> = ({
  columns = 1,
  gap = '16px',
  children,
  className = '',
  style,
  ...props
}) => {
  const gridTemplate = typeof columns === 'number' ? `repeat(${columns}, minmax(0, 1fr))` : columns;

  return (
    <div
      className={`field-grid ${className}`}
      style={{
        gridTemplateColumns: gridTemplate,
        gap,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: string;
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({
  maxWidth = '1280px',
  children,
  className = '',
  style,
  ...props
}) => (
  <div
    className={`field-container ${className}`}
    style={{
      maxWidth,
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);
