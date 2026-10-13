'use client';

import React, { useMemo, useRef, useState } from 'react';
import { ChevronRight, Check, Folder, File } from 'lucide-react';
import { useControllableState } from '../utils/hooks.js';
import { mergeClassNames } from '../utils/polymorphic.js';
import { applyResponsive, BREAKPOINT_RANGES, createResponsiveAccumulator, resolvePerRange, type Responsive } from '../utils/responsive.js';

/* --- EmptyState --- */
export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /**
   * One or more calls to action (a `Button`, or a fragment / array of them). They sit in a wrapping row
   * and stack to full width on phones, where long labels wrap instead of overflowing.
   */
  actions?: React.ReactNode;
  /** @deprecated Use `actions`. */
  action?: React.ReactNode;
  /**
   * Element for the title. Default `div`, because the right heading level depends on where the empty state
   * sits: pass `h1` on a 404 page or `h2` / `h3` inside a page section to keep the document outline correct.
   */
  titleAs?: React.ElementType;
  /** `boxed` (default): dashed border on a sunken surface. `plain`: no box, e.g. inside a `Card`. */
  variant?: 'boxed' | 'plain';
  className?: string;
}

/**
 * Placeholder for empty lists, search results or first-run screens.
 *
 * @example
 * <EmptyState icon={<Inbox />} title="No buckets yet" description="Create one to start storing objects."
 *   action={<Button variant="primary">Create bucket</Button>} />
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  actions,
  titleAs: TitleTag = 'div',
  variant = 'boxed',
  className = '',
  children,
  ...props
}) => {
  const actionContent = actions ?? action;
  return (
    <div
      className={mergeClassNames(
        'field-empty-state',
        variant === 'plain' ? 'field-empty-state-plain' : 'field-empty-state-boxed',
        className
      )}
      {...props}
    >
      {icon && <div className="field-empty-state-icon" aria-hidden="true">{icon}</div>}
      <TitleTag className="field-empty-state-title">{title}</TitleTag>
      {description && <div className="field-empty-state-desc">{description}</div>}
      {actionContent && <div className="field-empty-state-actions">{actionContent}</div>}
      {children}
    </div>
  );
};
EmptyState.displayName = 'EmptyState';

/* --- TreeView --- */
export interface TreeNode {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: TreeNode[];
  disabled?: boolean;
}

export interface TreeViewProps {
  /** Root nodes of the tree. */
  data: TreeNode[];
  /** Id of the selected node. */
  selectedId?: string;
  onSelect?: (node: TreeNode) => void;
  /** Controlled expanded node ids. */
  expandedIds?: string[];
  /** Initially expanded node ids when uncontrolled. */
  defaultExpandedIds?: string[];
  /** Called with the expanded node ids when a node is expanded or collapsed. */
  onExpandedChange?: (expandedIds: string[]) => void;
  /** Accessible name for the tree. */
  'aria-label'?: string;
  className?: string;
}

interface FlatNode {
  node: TreeNode;
  level: number;
  parentId?: string;
  posInSet: number;
  setSize: number;
}

/**
 * A hierarchical list (file browser, resource tree). Keyboard: ↑/↓ move,
 * → expands or enters, ← collapses or goes to the parent, Enter selects.
 *
 * @example
 * <TreeView aria-label="Files" data={tree} selectedId={file} onSelect={n => setFile(n.id)} />
 */
export const TreeView: React.FC<TreeViewProps> = ({
  data,
  selectedId,
  onSelect,
  expandedIds: controlledExpanded,
  defaultExpandedIds = [],
  onExpandedChange,
  'aria-label': ariaLabel,
  className = '',
}) => {
  const [expandedList, setExpandedList] = useControllableState<string[]>({
    value: controlledExpanded,
    defaultValue: defaultExpandedIds,
    onChange: onExpandedChange,
  });
  const expandedIds = useMemo(() => new Set(expandedList), [expandedList]);
  const [focusedId, setFocusedId] = useState<string | undefined>();
  const treeRef = useRef<HTMLUListElement>(null);

  const visibleNodes = useMemo(() => {
    const out: FlatNode[] = [];
    const walk = (nodes: TreeNode[], level: number, parentId?: string) => {
      nodes.forEach((node, idx) => {
        out.push({ node, level, parentId, posInSet: idx + 1, setSize: nodes.length });
        if (node.children?.length && expandedIds.has(node.id)) walk(node.children, level + 1, node.id);
      });
    };
    walk(data, 1);
    return out;
  }, [data, expandedIds]);

  const tabStopId =
    (focusedId && visibleNodes.some(n => n.node.id === focusedId) && focusedId) ||
    (selectedId && visibleNodes.some(n => n.node.id === selectedId) && selectedId) ||
    visibleNodes[0]?.node.id;

  const setExpanded = (id: string, expanded: boolean) => {
    if (expanded === expandedIds.has(id)) return;
    setExpandedList(expanded ? [...expandedList, id] : expandedList.filter(x => x !== id));
  };

  const focusNode = (id: string) => {
    setFocusedId(id);
    treeRef.current?.querySelector<HTMLElement>(`[data-node-id="${CSS.escape(id)}"]`)?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const index = visibleNodes.findIndex(n => n.node.id === tabStopId);
    const current = visibleNodes[index];
    if (!current) return;
    const hasChildren = Boolean(current.node.children?.length);
    const isExpanded = expandedIds.has(current.node.id);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (index < visibleNodes.length - 1) focusNode(visibleNodes[index + 1].node.id);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (index > 0) focusNode(visibleNodes[index - 1].node.id);
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (hasChildren && !isExpanded) setExpanded(current.node.id, true);
        else if (hasChildren && isExpanded) focusNode(visibleNodes[index + 1].node.id);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (hasChildren && isExpanded) setExpanded(current.node.id, false);
        else if (current.parentId) focusNode(current.parentId);
        break;
      case 'Home':
        e.preventDefault();
        focusNode(visibleNodes[0].node.id);
        break;
      case 'End':
        e.preventDefault();
        focusNode(visibleNodes[visibleNodes.length - 1].node.id);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!current.node.disabled) onSelect?.(current.node);
        break;
    }
  };

  const renderNodes = (nodes: TreeNode[], level: number): React.ReactNode =>
    nodes.map((node, idx) => {
      const hasChildren = Boolean(node.children && node.children.length > 0);
      const isExpanded = expandedIds.has(node.id);
      const isSelected = selectedId === node.id;

      return (
        <li
          key={node.id}
          role="treeitem"
          aria-level={level}
          aria-posinset={idx + 1}
          aria-setsize={nodes.length}
          aria-selected={isSelected}
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-disabled={node.disabled || undefined}
          data-node-id={node.id}
          tabIndex={node.id === tabStopId ? 0 : -1}
          className="field-tree-item"
          onFocus={e => {
            if (e.target === e.currentTarget) setFocusedId(node.id);
          }}
          onClick={e => {
            e.stopPropagation();
            setFocusedId(node.id);
            if (!node.disabled) onSelect?.(node);
          }}
        >
          <div className={mergeClassNames('field-tree-node', isSelected && 'selected', node.disabled && 'disabled')}>
            {hasChildren ? (
              <span
                className={mergeClassNames('field-tree-toggle-icon', isExpanded && 'expanded')}
                aria-hidden="true"
                onClick={e => {
                  e.stopPropagation();
                  setFocusedId(node.id);
                  setExpanded(node.id, !isExpanded);
                }}
              >
                <ChevronRight size={14} />
              </span>
            ) : (
              <span className="field-tree-toggle-spacer" aria-hidden="true" />
            )}
            <span className="field-tree-node-icon" aria-hidden="true">
              {node.icon || (hasChildren ? <Folder size={15} /> : <File size={15} />)}
            </span>
            <span className="field-tree-node-label">{node.label}</span>
          </div>

          {hasChildren && isExpanded && (
            <ul role="group" className="field-tree-sublist">
              {renderNodes(node.children!, level + 1)}
            </ul>
          )}
        </li>
      );
    });

  return (
    <ul ref={treeRef} className={mergeClassNames('field-tree-container', className)} role="tree" aria-label={ariaLabel} onKeyDown={handleKeyDown}>
      {renderNodes(data, 1)}
    </ul>
  );
};

/* --- Stepper / Wizard --- */
export interface StepItem {
  id: string;
  title: string;
  description?: string;
}

export interface StepperProps {
  /** Steps in order. */
  steps: StepItem[];
  /** 0-based index of the current step. */
  activeStep: number;
  /** Makes completed steps clickable (to go back). */
  onStepClick?: (stepIndex: number) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

/**
 * Progress through a multi-step flow. The current step is marked
 * `aria-current="step"`; completed steps can be revisited via `onStepClick`.
 *
 * @example
 * <Stepper activeStep={1} steps={[{ id: 'a', title: 'Configure' }, { id: 'b', title: 'Review' }, { id: 'c', title: 'Launch' }]} />
 */
export const Stepper: React.FC<StepperProps> = ({
  steps,
  activeStep,
  onStepClick,
  orientation = 'horizontal',
  className = '',
}) => {
  return (
    <ol className={mergeClassNames('field-stepper', orientation === 'vertical' && 'vertical', className)}>
      {steps.map((step, idx) => {
        const isCompleted = idx < activeStep;
        const isActive = idx === activeStep;
        const isClickable = Boolean(onStepClick) && idx < activeStep;
        const status = isCompleted ? 'completed' : isActive ? 'current' : 'upcoming';

        const inner = (
          <>
            <span className="field-step-circle" aria-hidden="true">
              {isCompleted ? <Check size={14} /> : idx + 1}
            </span>
            <span className="field-step-label-group">
              <span className="field-step-title">{step.title}</span>
              {step.description && <span className="field-step-desc">{step.description}</span>}
              <span className="field-sr-only">({status})</span>
            </span>
          </>
        );

        return (
          <li
            key={step.id}
            className={mergeClassNames('field-step', isCompleted && 'completed', isActive && 'active')}
            aria-current={isActive ? 'step' : undefined}
          >
            {isClickable ? (
              <button
                type="button"
                className={mergeClassNames('field-step-item', 'clickable', isCompleted && 'completed')}
                onClick={() => onStepClick?.(idx)}
              >
                {inner}
              </button>
            ) : (
              <div className={mergeClassNames('field-step-item', isCompleted && 'completed', isActive && 'active')}>
                {inner}
              </div>
            )}
            {idx < steps.length - 1 && (
              <span className={mergeClassNames('field-step-line', isCompleted && 'completed')} aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
};

/* --- Timeline / AuditFeed --- */
export interface TimelineEvent {
  id: string;
  title: React.ReactNode;
  content?: React.ReactNode;
  timestamp?: React.ReactNode;
  /** ISO datetime string for `<time dateTime="...">`. */
  dateTime?: string;
  /** Status tone for the marker. */
  status?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'accent' | 'default';
  icon?: React.ReactNode;
}

export interface TimelineProps extends React.HTMLAttributes<HTMLOListElement> {
  items: TimelineEvent[];
  /** Marker diameter: `sm` 10px, `md` 16px (default), `lg` 28px (fits an icon), or a px number. Sets `--field-timeline-marker-size`. */
  markerSize?: 'sm' | 'md' | 'lg' | number;
  /** Where the timestamp renders: `inline` (beside the title), `top` (above the title) or `left` (a column left of the rail). Default `inline`. */
  timestampPosition?: 'inline' | 'top' | 'left';
  /**
   * `ring` (default): an outlined marker in the status colour. `solid`: filled with the status colour, with
   * the icon in its contrast colour (`--field-timeline-marker-icon-color` overrides it). Use `markerSize="lg"`
   * for icons.
   */
  markerVariant?: 'ring' | 'solid';
  className?: string;
}

const TIMELINE_MARKER_SIZES = { sm: '10px', md: '16px', lg: '28px' } as const;

/**
 * A vertical feed of events (deploys, audit logs, activity, history milestones).
 *
 * Restyle it with CSS variables on the list (or any ancestor): `--field-timeline-marker-size`,
 * `-marker-border-width`, `-marker-color` (overrides every status), `-marker-bg`, `-rail-width`,
 * `-rail-color`, `-gap` (marker to content), `-item-gap`, `-time-color`, `-time-weight`,
 * `-time-width` (the `left` column) and `-marker-icon-color` (`markerVariant="solid"`).
 *
 * @example
 * <Timeline items={[{ id: '1', title: 'Deployed v2.4.0', timestamp: '2m ago', dateTime: '2026-10-12T09:30', status: 'success' }]} />
 */
export const Timeline: React.FC<TimelineProps> = ({
  items,
  markerSize,
  timestampPosition = 'inline',
  markerVariant = 'ring',
  className = '',
  style,
  ...props
}) => {
  const markerVar =
    markerSize === undefined
      ? undefined
      : typeof markerSize === 'number'
      ? `${markerSize}px`
      : TIMELINE_MARKER_SIZES[markerSize];
  return (
    <ol
      className={mergeClassNames(
        'field-timeline',
        `field-timeline-time-${timestampPosition}`,
        markerVariant === 'solid' && 'field-timeline-marker-solid',
        className
      )}
      style={{ ...(markerVar ? { '--field-timeline-marker-size': markerVar } : {}), ...style } as React.CSSProperties}
      {...props}
    >
      {items.map(item => {
        const status = item.status || 'info';

        const timeElement = item.timestamp ? (
          item.dateTime ? (
            <time dateTime={item.dateTime} className="field-timeline-time">
              {item.timestamp}
            </time>
          ) : (
            <span className="field-timeline-time">{item.timestamp}</span>
          )
        ) : null;

        return (
          <li key={item.id} className="field-timeline-item">
            {timestampPosition === 'left' && <div className="field-timeline-aside">{timeElement}</div>}
            <span className={`field-timeline-marker status-${status}`} aria-hidden="true">
              {item.icon}
            </span>
            <div className="field-timeline-body">
              {timestampPosition === 'top' && timeElement}
              <div className="field-timeline-header">
                <span className="field-timeline-title">{item.title}</span>
                {timestampPosition === 'inline' && timeElement}
              </div>
              {item.content && <div className="field-timeline-content">{item.content}</div>}
            </div>
          </li>
        );
      })}
    </ol>
  );
};

Timeline.displayName = 'Timeline';

/* --- DescriptionList (F20) --- */
export interface DescriptionItemProps {
  label: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const DescriptionItem: React.FC<DescriptionItemProps> = ({
  label,
  children,
  className = '',
  style,
}) => {
  return (
    <div className={mergeClassNames('field-description-item', className)} style={style}>
      <dt className="field-description-label">{label}</dt>
      <dd className="field-description-value">{children}</dd>
    </div>
  );
};

DescriptionItem.displayName = 'DescriptionItem';

export interface DescriptionListProps extends React.HTMLAttributes<HTMLDListElement> {
  children: React.ReactNode;
  /** Number of columns; accepts a breakpoint object. Default 1. */
  columns?: Responsive<number>;
  /** Visual density. Default `default`. */
  density?: 'default' | 'compact';
  /**
   * Draw hairlines between rows. With several columns the first row has no line above it at any
   * breakpoint (supported up to 6 columns). Default `false`.
   */
  divided?: boolean;
  className?: string;
}

/**
 * A responsive label/value description list for metadata, facts, specifications, and details.
 *
 * @example
 * <DescriptionList columns={{ base: 1, md: 2 }} divided>
 *   <DescriptionItem label="Role">Heavy Bomber</DescriptionItem>
 *   <DescriptionItem label="Manufacturer">Avro</DescriptionItem>
 * </DescriptionList>
 */
export const DescriptionList: React.FC<DescriptionListProps> = ({
  children,
  columns = 1,
  density = 'default',
  divided = false,
  className = '',
  style,
  ...props
}) => {
  const acc = createResponsiveAccumulator();
  applyResponsive(acc, 'gtc', 'gridTemplateColumns', columns, n => `repeat(${n}, minmax(0, 1fr))`, 1);
  // Lines go above every item but the first row, whose length is the column count in each
  // breakpoint range (field.css: .field-description-list-cols-<range>-<n>).
  const perRange = divided ? resolvePerRange(columns, 1) : undefined;
  const rowClasses = perRange
    ? BREAKPOINT_RANGES.map(range => `field-description-list-cols-${range}-${Math.min(6, Math.max(1, Math.round(perRange[range])))}`)
    : [];

  return (
    <dl
      className={mergeClassNames(
        'field-description-list',
        density === 'compact' && 'field-description-list-compact',
        divided && 'field-description-list-divided',
        ...rowClasses,
        ...acc.classes,
        className
      )}
      style={{ ...acc.style, ...style }}
      {...props}
    >
      {children}
    </dl>
  );
};

DescriptionList.displayName = 'DescriptionList';
