import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { PanelLeftClose, PanelLeft, ChevronDown } from 'lucide-react';
import { Tooltip } from './Accordion';
import { renderPolymorphic } from '../utils/polymorphic';

export interface SidebarContextValue {
  isCollapsed: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
  density: 'default' | 'compact';
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    return {
      isCollapsed: false,
      toggleCollapsed: () => {},
      setCollapsed: () => {},
      density: 'default' as const,
    };
  }
  return context;
};

/* --- SIDEBAR PROVIDER --- */
export interface SidebarProviderProps {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  density?: 'default' | 'compact';
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
  defaultCollapsed = false,
  collapsed: controlledCollapsed,
  onCollapseChange,
  density = 'default',
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const isCollapsed = controlledCollapsed ?? internalCollapsed;

  const setCollapsed = useCallback((nextCollapsed: boolean) => {
    if (controlledCollapsed === undefined) setInternalCollapsed(nextCollapsed);
    onCollapseChange?.(nextCollapsed);
  }, [controlledCollapsed, onCollapseChange]);

  const toggleCollapsed = useCallback(() => {
    setCollapsed(!isCollapsed);
  }, [setCollapsed, isCollapsed]);

  const contextValue = useMemo(
    () => ({ isCollapsed, toggleCollapsed, setCollapsed, density }),
    [isCollapsed, toggleCollapsed, setCollapsed, density]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  );
};

/* --- SIDEBAR ROOT --- */
export interface SidebarProps {
  children: React.ReactNode;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  density?: 'default' | 'compact';
  width?: number | string;
  collapsedWidth?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export const Sidebar: React.FC<SidebarProps> = ({
  children,
  collapsed: controlledCollapsed,
  defaultCollapsed = false,
  onCollapseChange,
  density: propDensity,
  width = 260,
  collapsedWidth = 64,
  className = '',
  style,
}) => {
  const outerContext = useContext(SidebarContext);
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);

  const isCollapsed = controlledCollapsed ?? outerContext?.isCollapsed ?? internalCollapsed;

  const density = propDensity || outerContext?.density || 'default';

  const setCollapsed = useCallback((nextCollapsed: boolean) => {
    if (outerContext) {
      outerContext.setCollapsed(nextCollapsed);
    } else if (controlledCollapsed === undefined) {
      setInternalCollapsed(nextCollapsed);
    }
    onCollapseChange?.(nextCollapsed);
  }, [outerContext, controlledCollapsed, onCollapseChange]);

  const toggleCollapsed = useCallback(() => {
    setCollapsed(!isCollapsed);
  }, [setCollapsed, isCollapsed]);

  const currentWidth = isCollapsed ? collapsedWidth : width;

  const asideContent = (
    <aside
      className={`field-sidebar ${isCollapsed ? 'field-sidebar-collapsed' : ''} ${density === 'compact' ? 'field-sidebar-compact' : ''} ${className}`}
      style={{
        width: typeof currentWidth === 'number' ? `${currentWidth}px` : currentWidth,
        minWidth: typeof currentWidth === 'number' ? `${currentWidth}px` : currentWidth,
        ...style,
      }}
      data-collapsed={isCollapsed}
      data-density={density}
    >
      {children}
    </aside>
  );

  const sidebarContextValue = useMemo(
    () => ({ isCollapsed, toggleCollapsed, setCollapsed, density }),
    [isCollapsed, toggleCollapsed, setCollapsed, density]
  );

  if (outerContext) {
    return asideContent;
  }

  return (
    <SidebarContext.Provider value={sidebarContextValue}>
      {asideContent}
    </SidebarContext.Provider>
  );
};

/* --- SIDEBAR HEADER --- */
export interface SidebarHeaderProps {
  children?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  showToggle?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  children,
  title,
  subtitle,
  icon,
  showToggle = true,
  className = '',
  style,
}) => {
  const { isCollapsed, toggleCollapsed } = useSidebar();

  if (children) {
    return (
      <div className={`field-sidebar-header ${className}`} style={style}>
        {children}
      </div>
    );
  }

  const renderCollapsedHeader = () => {
    if (showToggle) {
      return (
        <button
          type="button"
          className="field-sidebar-trigger"
          onClick={toggleCollapsed}
          aria-label="Expand sidebar"
          title="Expand sidebar"
        >
          <PanelLeft size={17} />
        </button>
      );
    }
    if (icon) {
      return <div className="field-sidebar-header-icon">{icon}</div>;
    }
    return null;
  };

  return (
    <div className={`field-sidebar-header ${className}`} style={style}>
      {isCollapsed ? (
        renderCollapsedHeader()
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
            {icon && <div className="field-sidebar-header-icon">{icon}</div>}
            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              {title && <div className="field-sidebar-title">{title}</div>}
              {subtitle && <div className="field-sidebar-subtitle">{subtitle}</div>}
            </div>
          </div>
          {showToggle && (
            <button
              type="button"
              className="field-sidebar-trigger"
              onClick={toggleCollapsed}
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
            >
              <PanelLeftClose size={16} />
            </button>
          )}
        </>
      )}
    </div>
  );
};

/* --- SIDEBAR CONTENT --- */
export interface SidebarContentProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const SidebarContent: React.FC<SidebarContentProps> = ({
  children,
  className = '',
  style,
}) => {
  return (
    <div className={`field-sidebar-content ${className}`} style={style}>
      {children}
    </div>
  );
};

/* --- SIDEBAR GROUP --- */
export interface SidebarGroupProps {
  children: React.ReactNode;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const SidebarGroup: React.FC<SidebarGroupProps> = ({
  children,
  label,
  className = '',
  style,
}) => {
  const { isCollapsed } = useSidebar();

  return (
    <div className={`field-sidebar-group ${className}`} style={style}>
      {label && !isCollapsed && (
        <div className="field-sidebar-group-label">{label}</div>
      )}
      <div className="field-sidebar-group-items">{children}</div>
    </div>
  );
};

/* --- SIDEBAR DROPDOWN / SUBMENU (CLOUDFLARE HIERARCHY TREE LINE) --- */
export interface SidebarDropdownProps {
  icon?: React.ReactNode;
  label: React.ReactNode;
  badge?: React.ReactNode;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const SidebarDropdown: React.FC<SidebarDropdownProps> = ({
  icon,
  label,
  badge,
  defaultOpen = false,
  isOpen: controlledOpen,
  onToggle,
  children,
  className = '',
  style,
}) => {
  const { isCollapsed, toggleCollapsed } = useSidebar();
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = controlledOpen ?? internalOpen;

  const handleToggle = () => {
    if (isCollapsed) {
      toggleCollapsed();
      if (controlledOpen === undefined) setInternalOpen(true);
      onToggle?.(true);
      return;
    }
    const next = !isOpen;
    if (controlledOpen === undefined) setInternalOpen(next);
    onToggle?.(next);
  };

  if (isCollapsed) {
    return (
      <Tooltip content={typeof label === 'string' ? label : 'Dropdown'} position="right">
        <button
          type="button"
          className={`field-sidebar-item ${className}`}
          onClick={handleToggle}
          style={style}
          aria-expanded={isOpen}
        >
          {icon && <span className="field-sidebar-item-icon">{icon}</span>}
        </button>
      </Tooltip>
    );
  }

  return (
    <div className={`field-sidebar-dropdown ${isOpen ? 'open' : ''} ${className}`} style={style}>
      <button
        type="button"
        className="field-sidebar-dropdown-trigger"
        onClick={handleToggle}
        aria-expanded={isOpen}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
          {icon && <span className="field-sidebar-item-icon">{icon}</span>}
          <span className="field-sidebar-item-label">{label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {badge && <span className="field-sidebar-item-badge">{badge}</span>}
          <ChevronDown
            size={14}
            className={`field-sidebar-dropdown-chevron ${isOpen ? 'rotated' : ''}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="field-sidebar-dropdown-list">
          {children}
        </div>
      )}
    </div>
  );
};

/* --- SIDEBAR SUB ITEM (CONNECTS TO TREE LINE WITH LABEL + OPTIONAL SUBTITLE) --- */
export interface SidebarSubItemProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  badge?: React.ReactNode;
  isActive?: boolean;
  disabled?: boolean;
  onClick?: (e?: React.MouseEvent) => void;
  href?: string;
  className?: string;
  style?: React.CSSProperties;
  asChild?: boolean;
  as?: React.ElementType;
  children?: React.ReactNode;
}

export const SidebarSubItem: React.FC<SidebarSubItemProps> = ({
  label,
  description,
  badge,
  isActive = false,
  disabled = false,
  onClick,
  href,
  className = '',
  style,
  asChild = false,
  as,
  children,
  ...props
}) => {
  const itemClass = `field-sidebar-subitem ${isActive ? 'active' : ''} ${disabled ? 'disabled' : ''} ${className}`;

  const content = (
    <>
      <div style={{ minWidth: 0, flex: 1 }}>
        {label && <div className="field-sidebar-subitem-label">{label}</div>}
        {description && <div className="field-sidebar-subitem-desc">{description}</div>}
        {children && !label && !description && children}
      </div>
      {badge && <span className="field-sidebar-item-badge">{badge}</span>}
    </>
  );

  if (asChild && React.isValidElement(children)) {
    return renderPolymorphic('button', {
      asChild: true,
      className: itemClass,
      style,
      onClick,
      disabled,
      children,
      ...props,
    });
  }

  const defaultTag = href && !disabled ? 'a' : 'button';
  const elementProps: Record<string, any> = {
    as,
    className: itemClass,
    style,
    onClick,
    children: content,
    ...props,
  };

  if (href && !disabled) {
    elementProps.href = href;
  }
  if (!as || as === 'button') {
    elementProps.type = 'button';
    elementProps.disabled = disabled;
  }

  return renderPolymorphic(defaultTag, elementProps);
};

/* --- SIDEBAR ITEM --- */
export interface SidebarItemProps {
  icon?: React.ReactNode;
  label?: React.ReactNode;
  badge?: React.ReactNode;
  isActive?: boolean;
  disabled?: boolean;
  onClick?: (e?: React.MouseEvent) => void;
  href?: string;
  className?: string;
  style?: React.CSSProperties;
  asChild?: boolean;
  as?: React.ElementType;
  children?: React.ReactNode;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  badge,
  isActive = false,
  disabled = false,
  onClick,
  href,
  className = '',
  style,
  asChild = false,
  as,
  children,
  ...props
}) => {
  const { isCollapsed } = useSidebar();

  const content = (
    <>
      {icon && <span className="field-sidebar-item-icon">{icon}</span>}
      {!isCollapsed && (
        <>
          {label && <span className="field-sidebar-item-label">{label}</span>}
          {children && !label && children}
          {badge && <span className="field-sidebar-item-badge">{badge}</span>}
        </>
      )}
    </>
  );

  const itemClass = `field-sidebar-item ${isActive ? 'active' : ''} ${disabled ? 'disabled' : ''} ${className}`;

  const renderElement = () => {
    if (asChild && React.isValidElement(children)) {
      return renderPolymorphic('button', {
        asChild: true,
        className: itemClass,
        style,
        onClick,
        disabled,
        'aria-current': isActive ? 'page' : undefined,
        children,
        ...props,
      });
    }

    const defaultTag = href && !disabled ? 'a' : 'button';
    const elementProps: Record<string, any> = {
      as,
      className: itemClass,
      style,
      onClick,
      children: content,
      'aria-current': isActive ? 'page' : undefined,
      ...props,
    };

    if (href && !disabled) {
      elementProps.href = href;
    }
    if (!as || as === 'button') {
      elementProps.type = 'button';
      elementProps.disabled = disabled;
      elementProps['aria-pressed'] = isActive;
    }

    return renderPolymorphic(defaultTag, elementProps);
  };

  if (isCollapsed && typeof label === 'string') {
    return (
      <Tooltip content={label} position="right">
        {renderElement()}
      </Tooltip>
    );
  }

  return renderElement();
};

/* --- SIDEBAR FOOTER --- */
export interface SidebarFooterProps {
  children: React.ReactNode;
  collapsedChildren?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({
  children,
  collapsedChildren,
  className = '',
  style,
}) => {
  const { isCollapsed } = useSidebar();
  return (
    <div className={`field-sidebar-footer ${className}`} style={style}>
      {isCollapsed && collapsedChildren !== undefined ? collapsedChildren : children}
    </div>
  );
};

/* --- STANDALONE SIDEBAR TRIGGER --- */
export interface SidebarTriggerProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const SidebarTrigger: React.FC<SidebarTriggerProps> = ({
  isCollapsed: controlledIsCollapsed,
  onToggle,
  className = '',
  style,
}) => {
  const context = useSidebar();
  const isCollapsed = controlledIsCollapsed ?? context.isCollapsed;
  const handleToggle = onToggle || context.toggleCollapsed;

  return (
    <button
      type="button"
      className={`field-sidebar-trigger ${className}`}
      style={style}
      onClick={handleToggle}
      aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      {isCollapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
    </button>
  );
};
