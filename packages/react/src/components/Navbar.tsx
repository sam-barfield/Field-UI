'use client';

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
import { getInteractiveElementProps, renderPolymorphic } from '../utils/polymorphic.js';
import { useIsomorphicLayoutEffect } from '../utils/hooks.js';

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
  /** True while `collapseBelow` has switched the bar to the mobile layout. */
  isCollapsed: boolean;
  variant: NavbarVariant;
  animated: boolean;
  glow: boolean;
  hoverGlider: boolean;
  indicatorWidth?: 'full' | 'content' | string | number;
  indicatorThickness?: string | number;
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
      isCollapsed: false,
      variant: 'underline',
      animated: true,
      glow: true,
      hoverGlider: false,
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
  variant?: NavbarVariant;
  animated?: boolean;
  glow?: boolean;
  hoverGlider?: boolean;
}

const NavbarContentContext = createContext<NavbarContentContextValue>({});

/* --- NAVBAR ROOT --- */
export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  /** Stick to the top of the scroll container. */
  sticky?: boolean;
  /** Detached, rounded "island" style with margins (implies sticky). */
  floating?: boolean;
  /** Translucent background with backdrop blur. */
  blurred?: boolean;
  /** Bottom border. */
  bordered?: boolean;
  /** `compact` reduces the bar height. */
  density?: 'default' | 'compact';
  /** Drop shadow strength (`true` = `md`). */
  shadow?: NavbarShadow;
  /** Effect applied once the page scrolls past `scrollThreshold`: add elevation, shrink the bar, or blur the background. */
  scrollBehavior?: NavbarScrollBehavior;
  /** Scroll distance in px before `scrollBehavior` / `transparentOnTop` change state. */
  scrollThreshold?: number;
  /** Element to watch for scrolling instead of `window` (e.g. a scrollable `<main>`). */
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  /** Transparent background until the page is scrolled. */
  transparentOnTop?: boolean;
  /** Max width of the inner content (`sm` 640px … `xl` 1280px, `full`, or any length). */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | number | string;
  /**
   * Switch to the mobile layout (`NavbarToggle` shown, `hideOnMobile` content hidden) while the
   * navbar is narrower than this: `sm` 640px … `xl` 1280px or a px number. Use it when many
   * top-level items need more room than the default. The built-in 768px collapse always applies.
   */
  collapseBelow?: 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Controlled open state of the mobile `NavbarMenu`. */
  isMenuOpen?: boolean;
  /** Initial mobile menu state when uncontrolled. */
  defaultMenuOpen?: boolean;
  /** Called when the mobile menu opens or closes. */
  onMenuOpenChange?: (open: boolean) => void;
  /** Default indicator style for every `NavbarContent`: `underline`, `elastic` (fluid stretch), `pill`, `rail` or `ghost` (no indicator). */
  variant?: NavbarVariant;
  /** Animate the active indicator between items. */
  animated?: boolean;
  /** Soft accent glow on the active indicator. */
  glow?: boolean;
  /** A spotlight that follows the pointer across items. */
  hoverGlider?: boolean;
  /** `full` item width, `content` (text width only), a px number or a % string. */
  indicatorWidth?: 'full' | 'content' | string | number;
  /** Line thickness for `underline` / `elastic` indicators. */
  indicatorThickness?: string | number;
  /** Accessible name of the inner `<nav>` landmark. Default "Main". */
  navLabel?: string;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
}

const COLLAPSE_BREAKPOINTS = { sm: 640, md: 768, lg: 1024, xl: 1280 } as const;
/** Width of the container query in field.css that always collapses the bar. */
const DEFAULT_COLLAPSE_WIDTH = 768;

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

/**
 * Responsive top navigation bar. Compose with `NavbarBrand`, `NavbarContent`
 * (holding `NavbarItem`s and `NavbarFlyout`s), `NavbarActions`, `NavbarToggle` and
 * `NavbarMenu` (the mobile drawer). Set `variant` + `animated` for a sliding
 * active indicator.
 *
 * @example
 * <Navbar sticky blurred variant="elastic">
 *   <NavbarBrand href="/">Acme</NavbarBrand>
 *   <NavbarContent>
 *     <NavbarItem href="/" isActive>Overview</NavbarItem>
 *     <NavbarItem href="/billing">Billing</NavbarItem>
 *   </NavbarContent>
 *   <NavbarActions><NavbarToggle /></NavbarActions>
 *   <NavbarMenu>…mobile links…</NavbarMenu>
 * </Navbar>
 */
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
  collapseBelow,
  isMenuOpen: controlledOpen,
  defaultMenuOpen = false,
  onMenuOpenChange,
  variant = 'underline',
  animated = true,
  glow = true,
  hoverGlider = false,
  indicatorWidth,
  indicatorThickness,
  navLabel = 'Main',
  className = '',
  style,
  as: Component = 'header',
  ...props
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultMenuOpen);
  const isMenuOpen = controlledOpen ?? internalOpen;
  const rootRef = useRef<HTMLElement | null>(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const collapseWidth =
    collapseBelow === undefined
      ? undefined
      : Math.max(
          DEFAULT_COLLAPSE_WIDTH,
          typeof collapseBelow === 'number' ? collapseBelow : COLLAPSE_BREAKPOINTS[collapseBelow]
        );

  // Same measurement as the CSS container query: the navbar's own inline size.
  useIsomorphicLayoutEffect(() => {
    const el = rootRef.current;
    if (!el || collapseWidth === undefined) {
      setIsCollapsed(false);
      return;
    }
    const measure = () => setIsCollapsed(el.clientWidth < collapseWidth);
    measure();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [collapseWidth]);

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

  // Close the mobile menu when the bar grows back into the full layout.
  useEffect(() => {
    if (collapseWidth !== undefined && !isCollapsed && isMenuOpen) {
      const el = rootRef.current;
      if (el && el.clientWidth >= collapseWidth) setIsMenuOpen(false);
    }
  }, [collapseWidth, isCollapsed, isMenuOpen, setIsMenuOpen]);

  const contextValue = useMemo(
    () => ({ isMenuOpen, setIsMenuOpen, toggleMenu, density, floating, isScrolled, isCollapsed, variant, animated, glow, hoverGlider, indicatorWidth, indicatorThickness }),
    [isMenuOpen, setIsMenuOpen, toggleMenu, density, floating, isScrolled, isCollapsed, variant, animated, glow, hoverGlider, indicatorWidth, indicatorThickness]
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
    isCollapsed ? 'field-navbar-collapsed' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const containerMaxWidth = resolveMaxWidth(maxWidth);

  return (
    <NavbarContext.Provider value={contextValue}>
      <Component ref={rootRef} className={classNames} style={style} {...props}>
        <nav
          aria-label={navLabel}
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

/**
 * Logo / product name slot. Renders a link when `href` is set (or your router link via `as` / `asChild`).
 */
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
  /** Where this group sits in the bar. */
  align?: 'start' | 'center' | 'end';
  gap?: string | number;
  /** Indicator style for this group (overrides the `Navbar` default). */
  variant?: NavbarVariant;
  /** `full` item width, `content` (text width only), a px number or a % string. */
  indicatorWidth?: 'full' | 'content' | string | number;
  /** Deprecated alias of `indicatorWidth`. */
  underlineWidth?: 'full' | 'content' | string | number;
  /** Line thickness for `underline` / `elastic` indicators. */
  indicatorThickness?: string | number;
  /** Deprecated alias of `indicatorThickness`. */
  underlineThickness?: string | number;
  /** Animate the indicator between items. */
  animated?: boolean;
  /** Soft accent glow on the indicator. */
  glow?: boolean;
  /** A spotlight that follows the pointer across items. */
  hoverGlider?: boolean;
  /** Hide this group below the mobile breakpoint (put the links in `NavbarMenu` instead). */
  hideOnMobile?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Group of navigation items. Owns the animated active indicator: the item with
 * `isActive` is tracked and the indicator slides between items on change.
 */
export const NavbarContent: React.FC<NavbarContentProps> = ({
  children,
  align = 'center',
  gap,
  variant: propVariant,
  indicatorWidth: propIndicatorWidth,
  underlineWidth: propUnderlineWidth,
  indicatorThickness: propIndicatorThickness,
  underlineThickness: propUnderlineThickness,
  animated: propAnimated,
  glow: propGlow,
  hoverGlider: propHoverGlider,
  hideOnMobile = false,
  className = '',
  style,
  ...props
}) => {
  const navbar = useNavbar();

  const variant = propVariant ?? navbar.variant ?? 'underline';
  const animated = propAnimated ?? navbar.animated ?? true;
  const glow = propGlow ?? navbar.glow ?? true;
  const hoverGlider = propHoverGlider ?? navbar.hoverGlider ?? false;
  const indicatorWidth = propIndicatorWidth ?? propUnderlineWidth ?? navbar.indicatorWidth;
  const effectiveThickness = propIndicatorThickness ?? propUnderlineThickness ?? navbar.indicatorThickness;

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

  const updateActiveIndicator = useCallback(
    (isResize = false) => {
      if (!containerRef.current || !animated || variant === 'ghost') {
        setActiveIndicator(null);
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
        const effectiveWidth = itemWidthAttr || indicatorWidth || 'full';
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

        // A resize during an elastic glide is usually caused by the glide itself: the newly
        // active item's heavier font weight changes the group's width. Let the animation
        // finish; the inline position set below takes over when it does.

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

            const animation = indicatorRef.current.animate(fluidKeyframes, {
              duration: 460,
              easing: 'linear',
              fill: 'both',
            });
            // Once finished, drop the animation so the inline transform/width
            // (already set to the final position) take over again. Otherwise the
            // filled final keyframe would pin the indicator after later resizes.
            animation.onfinish = () => {
              if (animationRef.current === animation) {
                animation.cancel();
                animationRef.current = null;
              }
            };
            animationRef.current = animation;
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
    [animated, variant, indicatorWidth]
  );

  useEffect(() => {
    updateActiveIndicator();
  }, [children, updateActiveIndicator, variant, animated, indicatorWidth, effectiveThickness]);

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
  /** Indicator style (inherited from `NavbarContent` by default). */
  variant?: NavbarVariant;
  /** Per-item override of the indicator width. */
  indicatorWidth?: 'full' | 'content' | string | number;
  /** Deprecated alias of `indicatorWidth`. */
  underlineWidth?: 'full' | 'content' | string | number;
  href?: string;
  onClick?: React.MouseEventHandler<any>;
  asChild?: boolean;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * A top-level navigation link or button. Mark the current route with `isActive` (sets `aria-current="page"`).
 */
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

  const tag: React.ElementType = as ?? (href ? 'a' : 'button');

  return renderPolymorphic(
    tag,
    {
      asChild,
      ...(asChild ? { 'aria-disabled': disabled || undefined } : getInteractiveElementProps(tag, { href, disabled })),
      'aria-current': isActive ? 'page' : undefined,
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
  /** Preferred panel alignment relative to the trigger. The panel shifts sideways as needed to stay within the navbar and viewport. */
  align?: 'start' | 'center' | 'end';
  /** Panel width (number = px). */
  width?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * A dropdown / mega-menu panel opened from a navbar trigger. Becomes an inline accordion inside `NavbarMenu` on mobile.
 * The panel closes when a link inside it is clicked, on Escape (focus returns to the trigger),
 * on an outside click, and when keyboard focus leaves it.
 */
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
  const panelRef = useRef<HTMLDivElement>(null);

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (controlledOpen === undefined) setInternalOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [controlledOpen, onOpenChange]
  );

  useEffect(() => {
    if (!open || isInMenu) return;
    const isOutside = (target: EventTarget | null) =>
      !!containerRef.current && !containerRef.current.contains(target as Node);
    const focusTrigger = () => {
      const trigger = containerRef.current?.querySelector<HTMLElement>('.field-navbar-flyout-trigger');
      const target = trigger?.matches('[role="button"]')
        ? trigger
        : trigger?.querySelector<HTMLElement>('button, a[href], [tabindex]');
      target?.focus();
    };

    const handlePointerDown = (e: MouseEvent) => {
      if (isOutside(e.target)) setOpen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const active = document.activeElement;
      const hadFocus = !isOutside(active) || active === document.body;
      setOpen(false);
      // The panel unmounts, so focus inside it would fall back to <body>.
      if (hadFocus) focusTrigger();
    };
    const handleFocusIn = (e: FocusEvent) => {
      if (isOutside(e.target)) setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', handleFocusIn);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, [open, setOpen, isInMenu]);

  // Close after navigating from inside the panel (client-side routers keep the navbar mounted).
  const handlePanelClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.defaultPrevented) return;
    if ((e.target as Element).closest('a[href], .field-navbar-flyout-item')) setOpen(false);
  };

  // Keep the panel inside the navbar's horizontal bounds (and the viewport): shift it
  // sideways when the preferred alignment would overflow, and cap its width.
  useIsomorphicLayoutEffect(() => {
    if (!open || isInMenu) return;
    const constrain = () => {
      const panel = panelRef.current;
      const container = containerRef.current;
      if (!panel || !container) return;
      const margin = 8;
      const navbarRect = (container.closest('.field-navbar') as HTMLElement | null)?.getBoundingClientRect();
      const minLeft = Math.max(margin, navbarRect?.left ?? margin);
      const maxRight = Math.min(window.innerWidth - margin, navbarRect?.right ?? window.innerWidth - margin);
      panel.style.translate = '';
      panel.style.maxWidth = `${Math.max(0, maxRight - minLeft)}px`;
      const rect = panel.getBoundingClientRect();
      let shift = 0;
      if (rect.right > maxRight) shift = maxRight - rect.right;
      if (rect.left + shift < minLeft) shift = minLeft - rect.left;
      if (shift) panel.style.translate = `${shift}px 0`;
    };
    constrain();
    window.addEventListener('resize', constrain);
    return () => window.removeEventListener('resize', constrain);
  }, [open, isInMenu, width, align]);

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
          ref={panelRef}
          className={`field-navbar-flyout-panel field-navbar-flyout-align-${align}`}
          style={{ width: computedWidth }}
          role="dialog"
          aria-modal="false"
          onClick={handlePanelClick}
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
  /** Number of equal columns. */
  columns?: number;
  gap?: string | number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Grid layout for `NavbarFlyoutItem`s inside a `NavbarFlyout`.
 */
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

/**
 * A rich link card (icon, title, description, badge) for use inside a `NavbarFlyout`.
 */
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

/**
 * Right-aligned slot for utility buttons (search, theme toggle, avatar, `NavbarToggle`).
 */
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
  /** Icon while closed. Defaults to a hamburger. */
  icon?: React.ReactNode;
  /** Icon while open. Defaults to an X. */
  openIcon?: React.ReactNode;
  'aria-label'?: string;
  /** `auto` shows the toggle only on small screens; `always` / `never` force it. */
  display?: 'auto' | 'always' | 'never';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Hamburger button that opens and closes `NavbarMenu`. Hidden on wide screens unless `display="always"`.
 */
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
      aria-controls={isMenuOpen ? 'field-navbar-menu' : undefined}
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

/**
 * The collapsible mobile navigation drawer. Clicking any link inside it closes the menu; Escape also closes it.
 */
export const NavbarMenu: React.FC<NavbarMenuProps> = ({
  children,
  className = '',
  style,
  ...props
}) => {
  const { isMenuOpen, setIsMenuOpen } = useNavbar();

  useEffect(() => {
    if (!isMenuOpen || typeof document === 'undefined') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setIsMenuOpen(false);
      document.querySelector<HTMLElement>('.field-navbar-toggle')?.focus();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen, setIsMenuOpen]);

  if (!isMenuOpen) return null;

  // NavbarItem / NavbarFlyoutItem close the menu themselves; this covers plain links and Buttons with href.
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!e.defaultPrevented && (e.target as Element).closest('a[href]')) setIsMenuOpen(false);
  };

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
        id="field-navbar-menu"
        role="region"
        aria-label="Navigation menu"
        className={classNames}
        style={style}
        {...props}
      >
        <div className="field-navbar-menu-content" onClick={handleClick}>
          {children}
        </div>
      </div>
    </NavbarMenuContext.Provider>
  );
};

NavbarMenu.displayName = 'NavbarMenu';
