import React from 'react';

/* --- StatusDot / LiveIndicator --- */
export type StatusDotType = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface StatusDotProps {
  status?: StatusDotType;
  pulse?: boolean;
  label?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusDot: React.FC<StatusDotProps> = ({
  status = 'info',
  pulse = false,
  label,
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 6,
    md: 8,
    lg: 10,
  };
  const dimension = sizeMap[size];

  return (
    <span className={`field-status-dot-wrapper ${className}`}>
      <span
        className={`field-status-dot ${status} ${pulse ? 'pulse' : ''}`}
        style={{ width: `${dimension}px`, height: `${dimension}px` }}
      />
      {label && <span>{label}</span>}
    </span>
  );
};

/* --- Sparkline --- */
export interface SparklineProps {
  data: number[];
  color?: 'accent' | 'success' | 'warning' | 'danger' | string;
  width?: number;
  height?: number;
  strokeWidth?: number;
  filled?: boolean;
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  color = 'accent',
  width = 120,
  height = 32,
  strokeWidth = 2,
  filled = true,
  className = '',
}) => {
  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const padding = strokeWidth;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;

  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1 || 1)) * usableWidth;
    const y = height - padding - ((val - min) / range) * usableHeight;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const fillD = `${pathD} L ${width - padding},${height} L ${padding},${height} Z`;

  const colorMap: Record<string, string> = {
    accent: 'var(--field-accent-primary)',
    success: 'var(--field-status-success-base)',
    warning: 'var(--field-status-warning-base)',
    danger: 'var(--field-status-danger-base)',
  };
  const strokeColor = colorMap[color] || color;

  return (
    <svg
      width={width}
      height={height}
      className={`field-sparkline ${className}`}
      viewBox={`0 0 ${width} ${height}`}
      style={{ overflow: 'visible' }}
    >
      {filled && (
        <path
          d={fillD}
          fill={strokeColor}
          fillOpacity={0.15}
          stroke="none"
        />
      )}
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/* --- Meter / Gauge --- */
export interface MeterProps {
  value: number;
  min?: number;
  max?: number;
  label?: string;
  valueLabel?: string;
  warningThreshold?: number;
  dangerThreshold?: number;
  className?: string;
}

export const Meter: React.FC<MeterProps> = ({
  value,
  min = 0,
  max = 100,
  label,
  valueLabel,
  warningThreshold = 75,
  dangerThreshold = 90,
  className = '',
}) => {
  const clamped = Math.min(Math.max(value, min), max);
  const percentage = Math.round(((clamped - min) / (max - min)) * 100);

  let statusClass = 'normal';
  if (percentage >= dangerThreshold) {
    statusClass = 'danger';
  } else if (percentage >= warningThreshold) {
    statusClass = 'warning';
  }

  return (
    <div className={`field-meter-container ${className}`} role="meter" aria-valuenow={value} aria-valuemin={min} aria-valuemax={max}>
      {(label || valueLabel) && (
        <div className="field-meter-header">
          {label && <span>{label}</span>}
          <span>{valueLabel || `${percentage}%`}</span>
        </div>
      )}
      <div className="field-meter-track">
        <div
          className={`field-meter-fill ${statusClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
