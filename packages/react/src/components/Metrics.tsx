'use client';

import React from 'react';
import { mergeClassNames } from '../utils/polymorphic.js';

/* --- StatusDot / LiveIndicator --- */
export type StatusDotType = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface StatusDotProps {
  /** Colour / meaning of the dot. */
  status?: StatusDotType;
  /** Animated ring for "live" states. Respects reduced motion. */
  pulse?: boolean;
  label?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const DOT_SIZES = { sm: 6, md: 8, lg: 10 };

/**
 * A coloured dot indicating health or connection state, optionally labelled.
 *
 * @example
 * <StatusDot status="success" pulse label="Live" />
 */
export const StatusDot: React.FC<StatusDotProps> = ({ status = 'info', pulse = false, label, size = 'md', className = '' }) => {
  const dimension = DOT_SIZES[size];
  return (
    <span className={mergeClassNames('field-status-dot-wrapper', className)}>
      <span
        className={mergeClassNames('field-status-dot', status, pulse && 'pulse')}
        style={{ width: `${dimension}px`, height: `${dimension}px` }}
        aria-hidden="true"
      />
      {label && <span>{label}</span>}
    </span>
  );
};

/* --- Sparkline --- */
export interface SparklineProps {
  /** Values to plot, oldest first. */
  data: number[];
  /** Status keyword or any CSS colour. */
  color?: 'accent' | 'success' | 'warning' | 'danger' | (string & {});
  /** Width in px. */
  width?: number;
  /** Height in px. */
  height?: number;
  /** Line thickness in px. */
  strokeWidth?: number;
  /** Fill the area under the line. Default `true`. */
  filled?: boolean;
  /** Describe the trend for screen readers (otherwise the chart is decorative). */
  'aria-label'?: string;
  className?: string;
}

const SPARK_COLORS: Record<string, string> = {
  accent: 'var(--field-accent-primary)',
  success: 'var(--field-status-success-base)',
  warning: 'var(--field-status-warning-base)',
  danger: 'var(--field-status-danger-base)',
};

/**
 * A tiny inline trend line with no axes. Pair with a number in a `StatCard`.
 *
 * @example
 * <Sparkline data={[4, 6, 5, 9, 12]} color="success" aria-label="Requests trending up" />
 */
export const Sparkline: React.FC<SparklineProps> = ({
  data,
  color = 'accent',
  width = 120,
  height = 32,
  strokeWidth = 2,
  filled = true,
  'aria-label': ariaLabel,
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
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const fillD = `${pathD} L ${width - padding},${height} L ${padding},${height} Z`;
  const strokeColor = SPARK_COLORS[color] || color;

  return (
    <svg
      width={width}
      height={height}
      className={mergeClassNames('field-sparkline', className)}
      viewBox={`0 0 ${width} ${height}`}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    >
      {filled && <path d={fillD} fill={strokeColor} fillOpacity={0.15} stroke="none" />}
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
  label?: React.ReactNode;
  /** Text on the right of the header. Defaults to the percentage. */
  valueLabel?: string;
  /** Percentage at which the bar turns amber. Default 75. */
  warningThreshold?: number;
  /** Percentage at which the bar turns red. Default 90. */
  dangerThreshold?: number;
  className?: string;
}

/**
 * Shows a measurement within a known range (disk usage, quota), turning amber
 * and red past the thresholds.
 *
 * @example
 * <Meter label="Disk" value={412} max={500} valueLabel="412 / 500 GB" />
 */
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
  const labelId = React.useId();
  const span = max - min || 1;
  const clamped = Math.min(Math.max(value, min), max);
  const percentage = Math.round(((clamped - min) / span) * 100);

  let statusClass = 'normal';
  if (percentage >= dangerThreshold) statusClass = 'danger';
  else if (percentage >= warningThreshold) statusClass = 'warning';

  return (
    <div className={mergeClassNames('field-meter-container', className)}>
      {(label || valueLabel) && (
        <div className="field-meter-header">
          {label && <span id={labelId}>{label}</span>}
          <span aria-hidden="true">{valueLabel || `${percentage}%`}</span>
        </div>
      )}
      <div
        className="field-meter-track"
        role="meter"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={clamped}
        aria-valuetext={valueLabel || `${percentage}%`}
        aria-labelledby={label ? labelId : undefined}
      >
        <div className={`field-meter-fill ${statusClass}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};
