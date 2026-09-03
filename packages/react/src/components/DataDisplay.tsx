import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Check, Folder, File } from 'lucide-react';

/* --- EmptyState --- */
export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`field-empty-state ${className}`}>
      {icon && <div className="field-empty-state-icon">{icon}</div>}
      <div className="field-empty-state-title">{title}</div>
      {description && <div className="field-empty-state-desc">{description}</div>}
      {action && <div>{action}</div>}
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
  data: TreeNode[];
  selectedId?: string;
  onSelect?: (node: TreeNode) => void;
  defaultExpandedIds?: string[];
  className?: string;
}

export const TreeView: React.FC<TreeViewProps> = ({
  data,
  selectedId,
  onSelect,
  defaultExpandedIds = [],
  className = '',
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(defaultExpandedIds));

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderNode = (node: TreeNode) => {
    const hasChildren = Boolean(node.children && node.children.length > 0);
    const isExpanded = expandedIds.has(node.id);
    const isSelected = selectedId === node.id;

    return (
      <li key={node.id} style={{ listStyle: 'none' }}>
        <div
          className={`field-tree-node ${isSelected ? 'selected' : ''}`}
          onClick={() => {
            if (!node.disabled) onSelect?.(node);
          }}
        >
          {hasChildren ? (
            <span
              className="field-tree-toggle-icon"
              onClick={e => toggleExpand(node.id, e)}
              style={{ cursor: 'pointer', padding: '2px' }}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
          ) : (
            <span style={{ width: '14px', display: 'inline-block' }} />
          )}

          <span style={{ color: 'var(--field-text-tertiary)', display: 'inline-flex' }}>
            {node.icon || (hasChildren ? <Folder size={15} /> : <File size={15} />)}
          </span>

          <span style={{ flex: 1 }}>{node.label}</span>
        </div>

        {hasChildren && isExpanded && (
          <ul className="field-tree-sublist">
            {node.children!.map(child => renderNode(child))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <ul className={`field-tree-container ${className}`} role="tree">
      {data.map(node => renderNode(node))}
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
  steps: StepItem[];
  activeStep: number;
  onStepClick?: (stepIndex: number) => void;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  activeStep,
  onStepClick,
  className = '',
}) => {
  return (
    <div className={`field-stepper ${className}`} role="tablist">
      {steps.map((step, idx) => {
        const isCompleted = idx < activeStep;
        const isActive = idx === activeStep;
        const isClickable = onStepClick && idx <= activeStep;

        return (
          <React.Fragment key={step.id}>
            <div
              className={`field-step-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
              onClick={() => isClickable && onStepClick(idx)}
              style={{ cursor: isClickable ? 'pointer' : 'default' }}
            >
              <div className="field-step-circle">
                {isCompleted ? <Check size={14} /> : idx + 1}
              </div>
              <div className="field-step-label-group">
                <span className="field-step-title">{step.title}</span>
                {step.description && <span className="field-step-desc">{step.description}</span>}
              </div>
            </div>
            {idx < steps.length - 1 && (
              <div className={`field-step-line ${isCompleted ? 'completed' : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
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

export const Timeline: React.FC<TimelineProps> = ({ items, className = '' }) => {
  return (
    <div className={`field-timeline ${className}`}>
      {items.map(item => {
        const status = item.status || 'info';
        return (
          <div key={item.id} className="field-timeline-item">
            <div className={`field-timeline-marker status-${status}`}>
              {item.icon}
            </div>
            <div className="field-timeline-header">
              <span className="field-timeline-title">{item.title}</span>
              {item.timestamp && <span className="field-timeline-time">{item.timestamp}</span>}
            </div>
            {item.content && <div className="field-timeline-content">{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
};
