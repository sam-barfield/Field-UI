'use client';

import React, { useMemo, useRef, useState } from 'react';
import { ChevronRight, Check, Folder, File } from 'lucide-react';
import { useControllableState } from '../utils/hooks.js';
import { mergeClassNames } from '../utils/polymorphic.js';

/* --- EmptyState --- */
export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Call to action, e.g. a primary `Button`. */
  action?: React.ReactNode;
  /** Element for the title, e.g. `h1` on a 404 page or `h2` inside a page section. Default `div`. */
  titleAs?: React.ElementType;
  className?: string;
}

/**
 * Placeholder for empty lists, search results or first-run screens.
 *
 * @example
 * <EmptyState icon={<Inbox />} title="No buckets yet" description="Create one to start storing objects."
 *   action={<Button variant="primary">Create bucket</Button>} />
 */
export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action, titleAs: TitleTag = 'div', className = '' }) => {
  return (
    <div className={mergeClassNames('field-empty-state', className)}>
      {icon && <div className="field-empty-state-icon" aria-hidden="true">{icon}</div>}
      <TitleTag className="field-empty-state-title">{title}</TitleTag>
      {description && <div className="field-empty-state-desc">{description}</div>}
      {action && <div className="field-empty-state-action">{action}</div>}
    </div>
  );
};

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
  timestamp?: string;
  status?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  icon?: React.ReactNode;
}

export interface TimelineProps {
  items: TimelineEvent[];
  className?: string;
}

/**
 * A vertical feed of events (deploys, audit logs, activity).
 *
 * @example
 * <Timeline items={[{ id: '1', title: 'Deployed v2.4.0', timestamp: '2m ago', status: 'success' }]} />
 */
export const Timeline: React.FC<TimelineProps> = ({ items, className = '' }) => {
  return (
    <ol className={mergeClassNames('field-timeline', className)}>
      {items.map(item => {
        const status = item.status || 'info';
        return (
          <li key={item.id} className="field-timeline-item">
            <span className={`field-timeline-marker status-${status}`} aria-hidden="true">
              {item.icon}
            </span>
            <div className="field-timeline-header">
              <span className="field-timeline-title">{item.title}</span>
              {item.timestamp && <span className="field-timeline-time">{item.timestamp}</span>}
            </div>
            {item.content && <div className="field-timeline-content">{item.content}</div>}
          </li>
        );
      })}
    </ol>
  );
};
