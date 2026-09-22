import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { renderPolymorphic } from '../utils/polymorphic';

export type NavbarVariant = 'underline' | 'elastic' | 'pill' | 'rail' | 'ghost';
export type NavbarShadow = 'none' | 'sm' | 'md' | 'lg' | boolean;
export type NavbarScrollBehavior = 'none' | 'elevate' | 'shrink' | 'blur';

/* --- NAVBAR CONTEXT --- */
export interface NavbarContextValue {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  toggleMenu: () => void;
  density: 'default' | 'compact';
  floating: boolean;
  isScrolled: boolean;
}

const NavbarContext = createContext<NavbarContextValue | undefined>(undefined);

export const useNavbar = (): NavbarContextValue => {
  const context = useContext(NavbarContext);
  if (!context) {
    return {
      isMenuOpen: false,
      setIsMenuOpen: () => {},
      toggleMenu: () => {},
      density: 'default',
      floating: false,
      isScrolled: false,
    };
  }
  return context;
};

/* --- NAVBAR MENU CONTEXT (Mobile Drawer) --- */
interface NavbarMenuContextValue {
  isInMenu: boolean;
}

const NavbarMenuContext = createContext<NavbarMenuContextValue>({
  isInMenu: false,
});

export const useNavbarMenu = (): NavbarMenuContextValue => useContext(NavbarMenuContext);

/* --- NAVBAR CONTENT CONTEXT --- */
interface NavbarContentContextValue {
  variant: NavbarVariant;
  animated: boolean;
  glow: boolean;
  hoverGlider: boolean;
}

const NavbarContentContext = createContext<NavbarContentContextValue>({
  variant: 'underline',
  animated: true,
  glow: true,
  hoverGlider: false,
});

/* --- NAVBAR ROOT --- */
export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  sticky?: boolean;
  floating?: boolean;
  blurred?: boolean;
  bordered?: boolean;
  density?: 'default' | 'compact';
  shadow?: NavbarShadow;
  scrollBehavior?: NavbarScrollBehavior;
  scrollThreshold?: number;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  transparentOnTop?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | number | string;
  isMenuOpen?: boolean;
  defaultMenuOpen?: boolean;
  onMenuOpenChange?: (open: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
}

const resolveMaxWidth = (
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | number | string
): string => {
  if (!maxWidth || maxWidth === 'full') return '100%';
  if (maxWidth === 'sm') return '640px';
  if (maxWidth === 'md') return '768px';
  if (maxWidth === 'lg') return '1024px';
  if (maxWidth === 'xl') return '1280px';
  if (typeof maxWidth === 'number') return `${maxWidth}px`;
  return maxWidth;
};

export const Navbar: React.FC<NavbarProps> = ({
  children,
  sticky = false,
  floating = false,
  blurred = false,
  bordered = true,
  density = 'default',
  shadow = 'none',
  scrollBehavior = 'none',
  scrollThreshold = 20,
  scrollContainerRef,
  transparentOnTop = false,
  maxWidth = 'full',
  isMenuOpen: controlledOpen,
  defaultMenuOpen = false,
  onMenuOpenChange,
  className = '',
  style,
  as: Component = 'header',
  ...props
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultMenuOpen);
  const isMenuOpen = controlledOpen ?? internalOpen;

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (scrollBehavior === 'none' && !transparentOnTop) return;

    const target: EventTarget = scrollContainerRef?.current || window;
    const getScrollY = () =>
      scrollContainerRef?.current ? scrollContainerRef.current.scrollTop : window.scrollY;

    const handleScroll = () => {
      const scrolled = getScrollY() > scrollThreshold;
      setIsScrolled(scrolled);
    };

    target.addEventListener('scroll', handleScroll as EventListener, { passive: true });
    handleScroll();

    return () => target.removeEventListener('scroll', handleScroll as EventListener);
  }, [scrollBehavior, scrollThreshold, transparentOnTop, scrollContainerRef]);

  const setIsMenuOpen = useCallback(
    (open: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(open);
      }
      onMenuOpenChange?.(open);
    },
    [controlledOpen, onMenuOpenChange]
  );

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [setIsMenuOpen, isMenuOpen]);

  const contextValue = useMemo(
    () => ({ isMenuOpen, setIsMenuOpen, toggleMenu, density, floating, isScrolled }),
    [isMenuOpen, setIsMenuOpen, toggleMenu, density, floating, isScrolled]
  );

  const shadowClass = useMemo(() => {
    if (!shadow || shadow === 'none') return '';
    if (shadow === true || shadow === 'md') return 'field-navbar-shadow-md';
    return `field-navbar-shadow-${shadow}`;
  }, [shadow]);

  const classNames = [
    'field-navbar',
    floating ? 'field-navbar-floating' : '',
    sticky || floating ? 'field-navbar-sticky' : '',
    blurred ? 'field-navbar-blurred' : '',
    bordered ? 'field-navbar-bordered' : '',
    density === 'compact' ? 'field-navbar-compact' : '',
    shadowClass,
    scrollBehavior !== 'none' ? `field-navbar-scroll-${scrollBehavior}` : '',
    transparentOnTop && !isScrolled ? 'field-navbar-transparent' : '',
    isScrolled ? 'field-navbar-scrolled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const containerMaxWidth = resolveMaxWidth(maxWidth);

  return (
    <NavbarContext.Provider value={contextValue}>
      <Component role="banner" className={classNames} style={style} {...props}>
        <nav
          role="navigation"
          aria-label="Main Navigation"
          className="field-navbar-container"
          style={{ maxWidth: containerMaxWidth }}
        >
          {children}
        </nav>
      </Component>
    </NavbarContext.Provider>
  );
};

Navbar.displayName = 'Navbar';

/* --- NAVBAR BRAND --- */
export interface NavbarBrandProps {
  children: React.ReactNode;
  href?: string;
  asChild?: boolean;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<any>;
}

export const NavbarBrand: React.FC<NavbarBrandProps> = ({
  children,
  href,
  asChild = false,
  as,
  className = '',
  style,
  onClick,
  ...props
}) => {
  const defaultTag = href ? 'a' : 'div';
  const classNames = ['field-navbar-brand', className].filter(Boolean).join(' ');

  return renderPolymorphic(
    defaultTag,
    {
      asChild,
      as,
      href,
      onClick,
      className: classNames,
      style,
      children,
      ...props,
    }
  );
};

NavbarBrand.displayName = 'NavbarBrand';

/* --- FLUID DYNAMICS HELPER FOR ELASTIC GLIDER --- */
const generateFluidKeyframes = (
  fromLeft: number,
  fromWidth: number,
  toLeft: number,
  toWidth: number
): Keyframe[] => {
  const dx = toLeft - fromLeft;
  const isMovingRight = dx > 0;
  const distance = Math.abs(dx);
  const fromRight = fromLeft + fromWidth;
  const toRight = toLeft + toWidth;

  // Compression strength: how much the fluid compacts against the boundary wall (up to 48% width reduction)
  const compressionStrength = Math.min(0.48, Math.max(0.25, (distance / 200) * 0.48));
  // Tiny hydraulic splash cushion bump at the boundary (1.5px to 4px depending on distance)
  const splashBumpMax = Math.min(4, Math.max(1.5, (distance / 150) * 4));

  const STEPS = 40;
  const keyframes: Keyframe[] = [];

  for (let i = 0; i <= STEPS; i++) {
    const t = i / STEPS;

    let pLead: number;
    let pTrail: number;

    if (t < 0.55) {
      // Phase 1: Viscous flight stream (leading edge shoots ahead, trailing edge lags)
      const normT = t / 0.55;
      pLead = 1 - Math.pow(1 - normT, 2.6);
      pTrail = Math.pow(normT, 2.6) * 0.32;
    } else if (t < 0.72) {
      // Phase 2: Leading edge hits the boundary wall; trailing edge momentum crashes into the wall
      const normT = (t - 0.55) / 0.17;
      pLead = 1.0;
      pTrail = 0.32 + (1.0 - 0.32) * Math.sin((normT * Math.PI) / 2);
    } else {
      // Phase 3: Settling and damped surface tension rebound
      pLead = 1.0;
      pTrail = 1.0;
    }

    let currentLeft: number;
    let currentRight: number;

    if (isMovingRight) {
      // Right edge leads to right boundary, Left edge trails from the left
      currentRight = fromRight + (toRight - fromRight) * pLead;
      currentLeft = fromLeft + (toLeft - fromLeft) * pTrail;

      if (t >= 0.55) {
        if (t < 0.72) {
          const compT = (t - 0.55) / 0.17;
          // Left edge surges rightward against the right boundary wall (width shrinks)
          const compOffset = toWidth * compressionStrength * Math.sin(compT * Math.PI * 0.5);
          currentLeft += compOffset;
          // Tiny boundary splash cushion
          currentRight += splashBumpMax * Math.sin(compT * Math.PI);
        } else {
          const s = (t - 0.72) / 0.28;
          // Damped fluid rebound relaxing back to resting width
          const compOffset =
            toWidth * compressionStrength * Math.exp(-5 * s) * Math.cos(s * Math.PI * 1.5);
          currentLeft += compOffset;
        }
      }
    } else {
      // Left edge leads to left boundary, Right edge trails from the right
      currentLeft = fromLeft + (toLeft - fromLeft) * pLead;
      currentRight = fromRight + (toRight - fromRight) * pTrail;

      if (t >= 0.55) {
        if (t < 0.72) {
          const compT = (t - 0.55) / 0.17;
          // Right edge surges leftward against the left boundary wall (width shrinks)
          const compOffset = toWidth * compressionStrength * Math.sin(compT * Math.PI * 0.5);
          currentRight -= compOffset;
          // Tiny boundary splash cushion
          currentLeft -= splashBumpMax * Math.sin(compT * Math.PI);
        } else {
          const s = (t - 0.72) / 0.28;
          // Damped fluid rebound relaxing back to resting width
          const compOffset =
            toWidth * compressionStrength * Math.exp(-5 * s) * Math.cos(s * Math.PI * 1.5);
          currentRight -= compOffset;
        }
      }
    }

    // Safety guard to ensure fluid doesn't invert
    const width = Math.max(toWidth * 0.45, currentRight - currentLeft);
    const x = isMovingRight ? currentRight - width : currentLeft;

    // Fluid volume conservation: thinner in flight when stretched, thicker when compressed at wall
    const widthRatio = toWidth / Math.max(1, width);
    const scaleY = Math.max(0.62, Math.min(1.5, Math.pow(widthRatio, 0.48)));

    keyframes.push({
      transform: `translateX(${x.toFixed(2)}px) scaleY(${scaleY.toFixed(3)})`,
      width: `${width.toFixed(2)}px`,
      offset: Number(t.toFixed(4)),
    });
  }

  return keyframes;
};

/* --- HELPER TO COMPUTE TARGET DIMENSIONS FOR INDICATORS --- */
const computeTargetDimensions = (
  activeEl: HTMLElement,
  containerRect: DOMRect,
  widthProp?: 'full' | 'content' | string | number
): { left: number; width: number } => {
  const activeRect = activeEl.getBoundingClientRect();
  const itemLeft = activeRect.left - containerRect.left;
  const itemWidth = activeRect.width;

  if (!widthProp || widthProp === 'full') {
    return { left: itemLeft, width: itemWidth };
  }

  if (widthProp === 'content') {
    const computed = window.getComputedStyle(activeEl);
    const paddingLeft = parseFloat(computed.paddingLeft) || 0;
    const paddingRight = parseFloat(computed.paddingRight) || 0;
    const contentWidth = Math.max(12, itemWidth - paddingLeft - paddingRight);
    const contentLeft = itemLeft + paddingLeft;
    return { left: contentLeft, width: contentWidth };
  }

  if (typeof widthProp === 'number') {
    const targetWidth = Math.min(itemWidth, Math.max(8, widthProp));
    const targetLeft = itemLeft + (itemWidth - targetWidth) / 2;
    return { left: targetLeft, width: targetWidth };
  }

  if (typeof widthProp === 'string') {
    if (widthProp.endsWith('%')) {
      const pct = parseFloat(widthProp) / 100;
      if (!isNaN(pct) && pct > 0) {
        const targetWidth = itemWidth * pct;
        const targetLeft = itemLeft + (itemWidth - targetWidth) / 2;
        return { left: targetLeft, width: targetWidth };
      }
    } else {
      const px = parseFloat(widthProp);
      if (!isNaN(px) && px > 0) {
        const targetWidth = Math.min(itemWidth, Math.max(8, px));
        const targetLeft = itemLeft + (itemWidth - targetWidth) / 2;
        return { left: targetLeft, width: targetWidth };
      }
    }
  }

  return { left: itemLeft, width: itemWidth };
};

/* --- NAVBAR CONTENT --- */
export interface NavbarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  gap?: string | number;
  variant?: NavbarVariant;
  indicatorWidth?: 'full' | 'content' | string | number;
  underlineWidth?: 'full' | 'content' | string | number;
  indicatorThickness?: string | number;
  underlineThickness?: string | number;
  animated?: boolean;
  glow?: boolean;
  hoverGlider?: boolean;
  hideOnMobile?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const NavbarContent: React.FC<NavbarContentProps> = ({
  children,
  align = 'center',
  gap,
  variant = 'underline',
  indicatorWidth,
  underlineWidth,
  indicatorThickness,
  underlineThickness,
  animated = true,
  glow = true,
  hoverGlider = false,
  hideOnMobile = false,
  className = '',
  style,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const prevActiveRectRef = useRef<{ left: number; width: number } | null>(null);
  const prevVariantRef = useRef(variant);
  const animationRef = useRef<Animation | null>(null);

  const [activeIndicator, setActiveIndicator] = useState<{
    left: number;
    width: number;
    opacity: number;
  } | null>(null);

  const [hoverIndicator, setHoverIndicator] = useState<{
    left: number;
    width: number;
    opacity: number;
  } | null>(null);

  const effectiveThickness = indicatorThickness ?? underlineThickness;

  const updateActiveIndicator = useCallback(
    (isResize = false) => {
      if (!containerRef.current || !animated || variant === 'ghost') {
        return;
      }

      const activeEl = containerRef.current.querySelector(
        '.field-navbar-item.active'
      ) as HTMLElement | null;

      if (activeEl) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const flyoutTrigger = activeEl.closest('.field-navbar-flyout-trigger') as HTMLElement | null;
        const measurementEl = flyoutTrigger || activeEl;

        const itemWidthAttr = activeEl.getAttribute('data-indicator-width');
        const effectiveWidth = itemWidthAttr || indicatorWidth || underlineWidth || 'full';
        const { left: nextLeft, width: nextWidth } = computeTargetDimensions(
          measurementEl,
          containerRect,
          effectiveWidth
        );

        const prevRect = prevActiveRectRef.current;
        const variantChanged = prevVariantRef.current !== variant;
        prevVariantRef.current = variant;

        const shouldAnimateElastic =
          variant === 'elastic' &&
          animated &&
          !isResize &&
          !variantChanged &&
          prevRect !== null &&
          Math.abs(nextLeft - prevRect.left) > 2;

        if (
          shouldAnimateElastic &&
          indicatorRef.current &&
          typeof indicatorRef.current.animate === 'function'
        ) {
          let fromLeft = prevRect.left;
          let fromWidth = prevRect.width;

          if (animationRef.current && animationRef.current.playState === 'running') {
            const currentRect = indicatorRef.current.getBoundingClientRect();
            fromLeft = currentRect.left - containerRect.left;
            fromWidth = currentRect.width;
            animationRef.current.cancel();
          }

          const prefersReducedMotion =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

          if (!prefersReducedMotion) {
            const fluidKeyframes = generateFluidKeyframes(
              fromLeft,
              fromWidth,
              nextLeft,
              nextWidth
            );

            animationRef.current = indicatorRef.current.animate(fluidKeyframes, {
              duration: 460,
              easing: 'linear',
              fill: 'both',
            });
          }
        }

        prevActiveRectRef.current = { left: nextLeft, width: nextWidth };

        setActiveIndicator({
          left: nextLeft,
          width: nextWidth,
          opacity: 1,
        });
      } else {
        prevActiveRectRef.current = null;
        setActiveIndicator(prev => (prev ? { ...prev, opacity: 0 } : null));
      }
    },
    [animated, variant, indicatorWidth, underlineWidth]
  );

  useEffect(() => {
    updateActiveIndicator();
  }, [children, updateActiveIndicator]);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => updateActiveIndicator(true));
      ro.observe(el);
      return () => ro.disconnect();
    }

    const handleResize = () => updateActiveIndicator(true);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateActiveIndicator]);

  // Handle magnetic hover follower
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!hoverGlider || !containerRef.current) return;
      const flyoutTrigger = (e.target as HTMLElement).closest(
        '.field-navbar-flyout-trigger'
      ) as HTMLElement | null;
      const navItem = (e.target as HTMLElement).closest(
        '.field-navbar-item'
      ) as HTMLElement | null;
      const target = (flyoutTrigger && containerRef.current.contains(flyoutTrigger))
        ? flyoutTrigger
        : (navItem && containerRef.current.contains(navItem))
        ? navItem
        : null;

      if (target) {
        const targetRect = target.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        setHoverIndicator({
          left: targetRect.left - containerRect.left,
          width: targetRect.width,
          opacity: 1,
        });
      }
    },
    [hoverGlider]
  );

  const handleMouseLeave = useCallback(() => {
    if (!hoverGlider) return;
    setHoverIndicator(prev => (prev ? { ...prev, opacity: 0 } : null));
  }, [hoverGlider]);

  const classNames = [
    'field-navbar-content',
    `field-navbar-content-${align}`,
    `field-navbar-content-${variant}`,
    animated ? 'field-navbar-content-animated' : '',
    glow ? 'field-navbar-content-glow' : '',
    hoverGlider ? 'field-navbar-content-hover-glider' : '',
    hideOnMobile ? 'field-navbar-hide-mobile' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const contextValue = useMemo(
    () => ({ variant, animated, glow, hoverGlider }),
    [variant, animated, glow, hoverGlider]
  );

  const computedStyle: React.CSSProperties = {
    gap: typeof gap === 'number' ? `${gap}px` : gap,
    ...style,
  };

  const isLineVariant = variant === 'underline' || variant === 'elastic';

  return (
    <NavbarContentContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        className={classNames}
        style={computedStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}

        {/* Magnetic Hover Spotlight Glider */}
        {hoverGlider && hoverIndicator && (
          <span
            className="field-navbar-hover-glider"
            style={{
              transform: `translateX(${hoverIndicator.left}px)`,
              width: `${hoverIndicator.width}px`,
              opacity: hoverIndicator.opacity,
            }}
            aria-hidden="true"
          />
        )}

        {/* Active Route Indicator */}
        {animated && variant !== 'ghost' && activeIndicator && (
          <span
            ref={indicatorRef}
            className={`field-navbar-indicator field-navbar-indicator-${variant} ${
              glow ? 'glow' : 'matte'
            }`}
            style={{
              transform: `translateX(${activeIndicator.left}px)`,
              width: `${activeIndicator.width}px`,
              ...(isLineVariant && effectiveThickness !== undefined
                ? {
                    height:
                      typeof effectiveThickness === 'number'
                        ? `${effectiveThickness}px`
                        : effectiveThickness,
                  }
                : {}),
              opacity: activeIndicator.opacity,
            }}
            aria-hidden="true"
          />
        )}
      </div>
    </NavbarContentContext.Provider>
  );
};

NavbarContent.displayName = 'NavbarContent';

/* --- NAVBAR ITEM --- */
export interface NavbarItemProps {
  children: React.ReactNode;
  isActive?: boolean;
  disabled?: boolean;
  variant?: NavbarVariant;
  indicatorWidth?: 'full' | 'content' | string | number;
  underlineWidth?: 'full' | 'content' | string | number;
  href?: string;
  onClick?: React.MouseEventHandler<any>;
  asChild?: boolean;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export const NavbarItem: React.FC<NavbarItemProps> = ({
  children,
  isActive = false,
  disabled = false,
  variant: propVariant,
  indicatorWidth,
  underlineWidth,
  href,
  onClick,
  asChild = false,
  as,
  className = '',
  style,
  ...props
}) => {
  const { variant: contextVariant } = useContext(NavbarContentContext);
  const variant = propVariant || contextVariant || 'underline';
  const { isInMenu } = useNavbarMenu();
  const { setIsMenuOpen } = useNavbar();

  const handleClick = (e: React.MouseEvent<any>) => {
    if (disabled) return;
    onClick?.(e);
    if (isInMenu && !e.defaultPrevented) {
      setIsMenuOpen(false);
    }
  };

  const classNames = [
    'field-navbar-item',
    `field-navbar-item-${variant}`,
    isActive ? 'active' : '',
    disabled ? 'disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const defaultTag = href ? 'a' : 'button';

  return renderPolymorphic(
    defaultTag,
    {
      asChild,
      as,
      href: disabled ? undefined : href,
      type: !href && (!as || as === 'button') ? 'button' : undefined,
      disabled,
      'aria-current': isActive ? 'page' : undefined,
      'aria-disabled': disabled ? 'true' : undefined,
      'data-active': isActive ? 'true' : undefined,
      'data-indicator-width': indicatorWidth || underlineWidth,
      onClick: disabled ? undefined : handleClick,
      className: classNames,
      style,
      children,
      ...props,
    }
  );
};

NavbarItem.displayName = 'NavbarItem';

/* --- ARCHITECTURAL FLYOUT / MEGAMENU --- */
export interface NavbarFlyoutProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: 'start' | 'center' | 'end';
  width?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export const NavbarFlyout: React.FC<NavbarFlyoutProps> = ({
  trigger,
  children,
  isOpen: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  align = 'center',
  width = '640px',
  className = '',
  style,
}) => {
  const { isInMenu } = useNavbarMenu();
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = controlledOpen ?? internalOpen;
  const containerRef = useRef<HTMLDivElement>(null);

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (controlledOpen === undefined) setInternalOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [controlledOpen, onOpenChange]
  );

  useEffect(() => {
    if (!open || isInMenu) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, setOpen, isInMenu]);

  const classNames = [
    'field-navbar-flyout-container',
    isInMenu ? 'in-menu' : '',
    open ? 'open' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const computedWidth = typeof width === 'number' ? `${width}px` : width;

  const isTriggerButton =
    React.isValidElement(trigger) &&
    (trigger.type === 'button' ||
      (trigger.props as any)?.as === 'button' ||
      (!(trigger.props as any)?.as && !(trigger.props as any)?.href && (trigger.type as any)?.displayName === 'NavbarItem'));

  const clonedTrigger =
    React.isValidElement(trigger) && isTriggerButton
      ? React.cloneElement(trigger as React.ReactElement<any>, {
          'aria-haspopup': 'menu',
          'aria-expanded': open,
        })
      : trigger;

  if (isInMenu) {
    return (
      <div ref={containerRef} className={classNames} style={style}>
        <div
          className="field-navbar-flyout-trigger"
          onClick={() => setOpen(!open)}
          role={isTriggerButton ? undefined : 'button'}
          tabIndex={isTriggerButton ? undefined : 0}
          aria-haspopup={isTriggerButton ? undefined : 'menu'}
          aria-expanded={isTriggerButton ? undefined : open}
          onKeyDown={
            isTriggerButton
              ? undefined
              : e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setOpen(!open);
                  }
                }
          }
        >
          {clonedTrigger}
          <ChevronDown
            size={16}
            className={`field-navbar-flyout-chevron ${open ? 'rotated' : ''}`}
            aria-hidden="true"
          />
        </div>

        {open && (
          <div className="field-navbar-flyout-accordion" role="region">
            {children}
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={classNames} style={style}>
      <div
        className="field-navbar-flyout-trigger"
        onClick={() => setOpen(!open)}
        role={isTriggerButton ? undefined : 'button'}
        tabIndex={isTriggerButton ? undefined : 0}
        aria-haspopup={isTriggerButton ? undefined : 'menu'}
        aria-expanded={isTriggerButton ? undefined : open}
        onKeyDown={
          isTriggerButton
            ? undefined
            : e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setOpen(!open);
                }
              }
        }
      >
        {clonedTrigger}
        <ChevronDown
          size={14}
          className={`field-navbar-flyout-chevron ${open ? 'rotated' : ''}`}
          aria-hidden="true"
        />
      </div>

      {open && (
        <div
          className={`field-navbar-flyout-panel field-navbar-flyout-align-${align}`}
          style={{ width: computedWidth }}
          role="dialog"
          aria-modal="false"
        >
          {children}
        </div>
      )}
    </div>
  );
};

NavbarFlyout.displayName = 'NavbarFlyout';

/* --- FLYOUT GRID --- */
export interface NavbarFlyoutGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number;
  gap?: string | number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const NavbarFlyoutGrid: React.FC<NavbarFlyoutGridProps> = ({
  columns = 2,
  gap = 16,
  children,
  className = '',
  style,
  ...props
}) => {
  const classNames = ['field-navbar-flyout-grid', className].filter(Boolean).join(' ');

  const computedStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gap: typeof gap === 'number' ? `${gap}px` : gap,
    ...style,
  };

  return (
    <div className={classNames} style={computedStyle} {...props}>
      {children}
    </div>
  );
};

NavbarFlyoutGrid.displayName = 'NavbarFlyoutGrid';

/* --- FLYOUT ITEM (Capability / Service Card) --- */
export interface NavbarFlyoutItemProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  badge?: React.ReactNode;
  href?: string;
  onClick?: React.MouseEventHandler<any>;
  asChild?: boolean;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export const NavbarFlyoutItem: React.FC<NavbarFlyoutItemProps> = ({
  icon,
  title,
  description,
  badge,
  href,
  onClick,
  asChild = false,
  as,
  className = '',
  style,
  ...props
}) => {
  const { isInMenu } = useNavbarMenu();
  const { setIsMenuOpen } = useNavbar();

  const handleClick = (e: React.MouseEvent<any>) => {
    onClick?.(e);
    if (isInMenu && !e.defaultPrevented) {
      setIsMenuOpen(false);
    }
  };

  const defaultTag = href ? 'a' : onClick ? 'button' : 'div';
  const classNames = ['field-navbar-flyout-item', className].filter(Boolean).join(' ');

  const content = (
    <>
      {icon && <div className="field-navbar-flyout-item-icon">{icon}</div>}
      <div className="field-navbar-flyout-item-body">
        <div className="field-navbar-flyout-item-header">
          <span className="field-navbar-flyout-item-title">{title}</span>
          {badge && <span className="field-navbar-flyout-item-badge">{badge}</span>}
        </div>
        {description && (
          <p className="field-navbar-flyout-item-desc">{description}</p>
        )}
      </div>
    </>
  );

  return renderPolymorphic(
    defaultTag,
    {
      asChild,
      as,
      href,
      type: defaultTag === 'button' && (!as || as === 'button') ? 'button' : undefined,
      onClick: handleClick,
      className: classNames,
      style,
      children: content,
      ...props,
    }
  );
};

NavbarFlyoutItem.displayName = 'NavbarFlyoutItem';

/* --- NAVBAR ACTIONS --- */
export interface NavbarActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  gap?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export const NavbarActions: React.FC<NavbarActionsProps> = ({
  children,
  gap,
  className = '',
  style,
  ...props
}) => {
  const classNames = ['field-navbar-actions', className].filter(Boolean).join(' ');

  const computedStyle: React.CSSProperties = {
    gap: typeof gap === 'number' ? `${gap}px` : gap,
    ...style,
  };

  return (
    <div className={classNames} style={computedStyle} {...props}>
      {children}
    </div>
  );
};

NavbarActions.displayName = 'NavbarActions';

/* --- NAVBAR TOGGLE --- */
export interface NavbarToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  openIcon?: React.ReactNode;
  'aria-label'?: string;
  display?: 'auto' | 'always' | 'never';
  className?: string;
  style?: React.CSSProperties;
}

export const NavbarToggle: React.FC<NavbarToggleProps> = ({
  icon,
  openIcon,
  'aria-label': ariaLabel = 'Toggle navigation menu',
  display = 'auto',
  className = '',
  style,
  onClick,
  ...props
}) => {
  const { isMenuOpen, toggleMenu } = useNavbar();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    toggleMenu();
    onClick?.(e);
  };

  const classNames = [
    'field-navbar-toggle',
    display !== 'auto' ? `field-navbar-toggle-${display}` : '',
    isMenuOpen ? 'open' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classNames}
      aria-label={ariaLabel}
      aria-expanded={isMenuOpen}
      onClick={handleClick}
      style={style}
      {...props}
    >
      {isMenuOpen ? openIcon || <X size={20} /> : icon || <Menu size={20} />}
    </button>
  );
};

NavbarToggle.displayName = 'NavbarToggle';

/* --- NAVBAR MENU (Mobile Drawer) --- */
export interface NavbarMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const NavbarMenu: React.FC<NavbarMenuProps> = ({
  children,
  className = '',
  style,
  ...props
}) => {
  const { isMenuOpen } = useNavbar();

  if (!isMenuOpen) return null;

  const classNames = [
    'field-navbar-menu',
    'open',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <NavbarMenuContext.Provider value={{ isInMenu: true }}>
      <div
        role="region"
        aria-label="Mobile Navigation"
        className={classNames}
        style={style}
        {...props}
      >
        <div className="field-navbar-menu-content">
          {children}
        </div>
      </div>
    </NavbarMenuContext.Provider>
  );
};

NavbarMenu.displayName = 'NavbarMenu';
