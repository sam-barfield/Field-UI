'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { ArrowUp, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { mergeClassNames, renderPolymorphic, useResolvedTag } from '../utils/polymorphic.js';
import { getElementRef, mergeRefs } from '../utils/hooks.js';
import { ThemeScope, useThemeSafe } from '../theme/ThemeProvider.js';
import { Container, type ContainerProps } from './Layout.js';
import { Button, type ButtonElement, type ButtonProps } from './Button.js';
import { Heading, Text, type HeadingProps } from './Typography.js';
import { applyResponsive, BREAKPOINT_RANGES, createResponsiveAccumulator, resolvePerRange, type Responsive } from '../utils/responsive.js';
import { fetchPriorityProps } from '../utils/dom.js';

/* --- SURFACE (shared by Section and Footer) --- */
type SurfaceTone = 'default' | 'muted' | 'raised' | 'accent' | 'inverse';

interface SurfaceProps extends React.HTMLAttributes<HTMLElement> {
  as: React.ElementType;
  tone: SurfaceTone;
  /** Forces dark mode (e.g. text over a darkened photo). */
  forceDark?: boolean;
}

/**
 * Renders a plain element, or a ThemeScope when the tone needs the opposite (or dark) theme.
 * Forced-dark bands use the pair's `band` theme when it has one.
 */
const Surface: React.FC<SurfaceProps> = ({ as, tone, forceDark, className, children, ...props }) => {
  const { mode, themePair } = useThemeSafe();
  if (tone === 'inverse' || forceDark) {
    const scopeMode = forceDark ? 'dark' : mode === 'dark' ? 'light' : 'dark';
    const bandTheme = scopeMode === 'dark' ? themePair?.band : undefined;
    return (
      <ThemeScope as={as} mode={scopeMode} theme={bandTheme} className={className} {...props}>
        {children}
      </ThemeScope>
    );
  }
  const Tag = as;
  return (
    <Tag className={className} {...props}>
      {children}
    </Tag>
  );
};

export type SectionBackgroundImage =
  | string
  | {
      src: string;
      srcSet?: string;
      sizes?: string;
      position?: string;
      priority?: boolean;
    };

/* --- SECTION --- */
export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Background band. `muted` / `raised` use theme surfaces, `accent` fills with the brand colour,
   * `inverse` flips to the opposite light/dark theme (e.g. a dark band on a light site).
   */
  tone?: SurfaceTone;
  /** Vertical padding; fluid, so it shrinks on small screens. Default `lg`. */
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Wraps children in a `Container` of this width. Pass `false` for full-bleed content. Default `xl`. */
  container?: ContainerProps['maxWidth'] | false;
  /**
   * Pull the section up under a transparent sticky `Navbar` (negative margin of `--field-navbar-height`, with the
   * same amount added to the top padding). Also tells `Navbar transparentOnTop="auto"` that a band sits under it.
   */
  underNavbar?: boolean;
  /**
   * Cover image behind the content: a URL, or `{ src, srcSet, sizes, position, priority }`. It renders as an
   * `<img>` (object-fit cover), so `srcSet` picks the right file on phones and `priority` (for the hero)
   * loads it first. The section switches to the dark theme (or the pair's `band` theme, see
   * `createThemePair`) and adds `overlay`.
   */
  backgroundImage?: SectionBackgroundImage;
  /** Darkness of the overlay over `backgroundImage`, 0 to 1. Default `0.55`. */
  overlay?: number;
  /** Element to render. Default `section`. */
  as?: React.ElementType;
  children: React.ReactNode;
}

/**
 * A full-width page band with consistent vertical rhythm, an optional background
 * tone or image, and a centred container. The building block of marketing pages.
 * Give it an `id` to make it an in-page link target: anchors stop below a sticky `Navbar`
 * automatically (`--field-scroll-offset`, derived from `--field-navbar-height`).
 *
 * @example
 * <Section tone="muted" id="menu" aria-labelledby="menu-title">
 *   <Heading id="menu-title" display="sm">Our menu</Heading>
 * </Section>
 */
export const Section: React.FC<SectionProps> = ({
  tone = 'default',
  spacing = 'lg',
  container = 'xl',
  backgroundImage,
  underNavbar = false,
  overlay = 0.55,
  as = 'section',
  className = '',
  style,
  children,
  ...props
}) => {
  // Both forms render a real <img>, so the browser finds it straight away and can use
  // srcSet, sizes and fetchpriority (a CSS background can't) (F9).
  const image = typeof backgroundImage === 'string' ? { src: backgroundImage } : backgroundImage;
  const imageStyle = image
    ? ({ '--field-section-overlay': String(Math.min(1, Math.max(0, overlay))) } as React.CSSProperties)
    : undefined;

  return (
    <Surface
      as={as}
      tone={tone}
      forceDark={!!backgroundImage}
      className={mergeClassNames(
        'field-section',
        `field-section-${tone}`,
        `field-section-spacing-${spacing}`,
        backgroundImage && 'field-section-image',
        underNavbar && 'field-section-under-navbar',
        className
      )}
      style={{ ...imageStyle, ...style }}
      {...props}
    >
      {image && (
        <img
          src={image.src}
          srcSet={image.srcSet}
          sizes={image.sizes ?? (image.srcSet ? '100vw' : undefined)}
          loading={image.priority ? 'eager' : 'lazy'}
          decoding={image.priority ? 'sync' : 'async'}
          {...fetchPriorityProps(image.priority ? 'high' : undefined)}
          className="field-section-bg-image"
          style={{ objectPosition: image.position }}
          alt=""
          aria-hidden="true"
        />
      )}
      {container === false ? children : <Container maxWidth={container}>{children}</Container>}
    </Surface>
  );
};

/* --- LINK --- */
export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Colour: `accent` (default), `inherit` from the surrounding text, or `subtle` (secondary text). */
  tone?: 'accent' | 'inherit' | 'subtle';
  /** Underline behaviour. Default `always`, which keeps links distinguishable in body copy. */
  underline?: 'always' | 'hover' | 'none';
  /** Opens in a new tab with `rel="noopener noreferrer"`, adds an icon and a screen-reader hint. */
  external?: boolean;
  /** Render as a router link, e.g. `as={NextLink}`. */
  as?: React.ElementType;
  /** Merge the link styles onto the single child element. */
  asChild?: boolean;
  children: React.ReactNode;
}

/**
 * Inline text link for body copy, footers and legal text.
 *
 * @example
 * <Text>Read our <Link href="/privacy">privacy policy</Link>.</Text>
 * <Link href="https://maps.google.com/?q=..." external>Get directions</Link>
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ tone = 'accent', underline = 'always', external = false, as, asChild, className = '', children, ...props }, ref) => {
    const tag = useResolvedTag(as, external ? undefined : props.href, 'a');
    const content = external && !asChild ? (
      <>
        {children}
        <ExternalLink className="field-link-external-icon" size="0.85em" aria-hidden="true" />
        <span className="field-sr-only"> (opens in a new tab)</span>
      </>
    ) : (
      children
    );
    return renderPolymorphic(
      tag,
      {
        asChild,
        as: tag,
        ...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
        ...props,
        className: mergeClassNames('field-link', `field-link-${tone}`, `field-link-underline-${underline}`, className),
        children: asChild ? children : content,
      },
      ref
    );
  }
);
Link.displayName = 'Link';

/* --- FOOTER --- */
export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  /** Background band, as on `Section`. Default `muted`. */
  tone?: SurfaceTone;
  /** Container width, as on `Section`. Default `xl`. */
  container?: ContainerProps['maxWidth'];
  children: React.ReactNode;
}

/**
 * Site footer. Columns (`FooterBrand`, `FooterColumn`) flow into a responsive grid;
 * `FooterBottom` sits underneath for copyright and legal links.
 *
 * @example
 * <Footer>
 *   <FooterBrand><Heading level={3}>Hearth Bakery</Heading><Text size="sm" tone="secondary">12 Mill Lane, Bristol</Text></FooterBrand>
 *   <FooterColumn title="Visit"><FooterLink href="#hours">Opening hours</FooterLink></FooterColumn>
 *   <FooterBottom><Text size="sm" tone="tertiary">© 2026 Hearth Bakery</Text></FooterBottom>
 * </Footer>
 */
export const Footer: React.FC<FooterProps> = ({ tone = 'muted', container = 'xl', className = '', children, ...props }) => {
  const items = React.Children.toArray(children);
  const bottom = items.filter(child => React.isValidElement(child) && child.type === FooterBottom);
  const main = items.filter(child => !(React.isValidElement(child) && child.type === FooterBottom));
  return (
    <Surface as="footer" tone={tone} className={mergeClassNames('field-footer', `field-section-${tone}`, className)} {...props}>
      <Container maxWidth={container}>
        {main.length > 0 && <div className="field-footer-main">{main}</div>}
        {bottom}
      </Container>
    </Surface>
  );
};

export interface FooterBrandProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/** The wide first footer column: logo, short description, contact details or social links. */
export const FooterBrand: React.FC<FooterBrandProps> = ({ className = '', children, ...props }) => (
  <div className={mergeClassNames('field-footer-brand', className)} {...props}>
    {children}
  </div>
);

export interface FooterColumnProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Column heading. */
  title?: React.ReactNode;
  /** Heading element. Default `h2`. */
  titleAs?: React.ElementType;
  children: React.ReactNode;
}

/** A titled footer column. When it only contains `FooterLink`s they are rendered as a list inside a `nav`. */
export const FooterColumn: React.FC<FooterColumnProps> = ({ title, titleAs: TitleTag = 'h2', className = '', children, ...props }) => {
  const titleId = React.useId();
  const items = React.Children.toArray(children);
  const onlyLinks = items.length > 0 && items.every(child => React.isValidElement(child) && child.type === FooterLink);
  return (
    <div className={mergeClassNames('field-footer-column', className)} {...props}>
      {title && (
        <TitleTag id={titleId} className="field-footer-title">
          {title}
        </TitleTag>
      )}
      {onlyLinks ? (
        <nav aria-labelledby={title ? titleId : undefined}>
          <ul className="field-footer-list">
            {items.map((child, i) => (
              <li key={(React.isValidElement(child) && child.key) || i}>{child}</li>
            ))}
          </ul>
        </nav>
      ) : (
        <div className="field-footer-list">{children}</div>
      )}
    </div>
  );
};

/** A footer link. Same API as `Link` (`href`, `as`, `asChild`, `external`), styled for footers. */
export const FooterLink = React.forwardRef<HTMLAnchorElement, Omit<LinkProps, 'tone' | 'underline'>>(
  ({ className = '', ...props }, ref) => (
    <Link ref={ref} tone="subtle" underline="hover" className={mergeClassNames('field-footer-link', className)} {...props} />
  )
);
FooterLink.displayName = 'FooterLink';

export interface FooterBottomProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/** The bottom row of the footer: copyright, legal links, cookie settings. */
export const FooterBottom: React.FC<FooterBottomProps> = ({ className = '', children, ...props }) => (
  <div className={mergeClassNames('field-footer-bottom', className)} {...props}>
    {children}
  </div>
);

/* --- PROSE --- */
const PROSE_SIZES = {
  sm: { fontSize: '0.875rem', lineHeight: '1.65' },
  base: { fontSize: '1rem', lineHeight: '1.7' },
  lg: { fontSize: '1.125rem', lineHeight: '1.75' },
} as const;
type ProseSize = keyof typeof PROSE_SIZES;

export interface ProseProps extends React.HTMLAttributes<HTMLElement> {
  /** Base text size. Default `base`. Accepts a breakpoint object, e.g. `{ base: 'base', lg: 'lg' }`. */
  size?: Responsive<'sm' | 'base' | 'lg'>;
  /** Max line length. Default `68ch`; pass `none` to fill the container. */
  maxWidth?: string;
  /**
   * Collapse long text to its first `previewParagraphs` paragraphs with a "Read more" toggle. `true`
   * collapses on phones only (below 640px); `'always'` at every width; a breakpoint object chooses per
   * breakpoint, e.g. `{ base: true, lg: false }` collapses below 1024px. It is CSS only, so the first
   * paint is already right. The toggle only appears where the text collapses and there is more to show.
   * When set, the content and toggle render inside a `div.field-prose-collapsible` wrapper, which
   * receives `className` and `style`.
   */
  collapsible?: boolean | 'always' | Responsive<boolean>;
  /** Paragraphs shown while collapsed (1–10); everything after the last one is hidden. Default `2`. */
  previewParagraphs?: number;
  /** Label for expand button. Default `Read more`. */
  expandLabel?: string;
  /** Label for collapse button. Default `Show less`. */
  collapseLabel?: string;
  /** Element to render. Default `div`; use `article` for posts. */
  as?: React.ElementType;
  children?: React.ReactNode;
}

/**
 * Styles raw HTML content (headings, paragraphs, lists, quotes, images, tables, code)
 * from Markdown or a CMS, e.g. about pages, blog posts and policies.
 *
 * @example
 * <Prose as="article" dangerouslySetInnerHTML={{ __html: post.html }} />
 */
export const Prose: React.FC<ProseProps> = ({
  size = 'base',
  maxWidth = '68ch',
  collapsible = false,
  previewParagraphs = 2,
  expandLabel = 'Read more',
  collapseLabel = 'Show less',
  as: Tag = 'div',
  className = '',
  style,
  id,
  children,
  ...props
}) => {
  const [expanded, setExpanded] = useState(false);
  const generatedId = useId();
  const contentId = id ?? `${generatedId}-prose`;
  const acc = createResponsiveAccumulator();
  const isStringSize = typeof size === 'string';
  if (!isStringSize && size) {
    applyResponsive<ProseSize>(acc, 'psz', 'fontSize', size, s => PROSE_SIZES[s].fontSize, 'base');
    applyResponsive<ProseSize>(acc, 'plh', 'lineHeight', size, s => PROSE_SIZES[s].lineHeight, 'base');
  }
  const preview = Math.min(10, Math.max(1, Math.round(previewParagraphs)));
  // The breakpoint ranges the text collapses in (field.css: .field-prose-collapse-<range>).
  const collapsePerRange =
    collapsible === 'always' || collapsible === true || !collapsible ? undefined : resolvePerRange(collapsible, false);
  const collapseRanges: readonly string[] =
    collapsible === 'always'
      ? BREAKPOINT_RANGES
      : collapsible === true
      ? ['base']
      : collapsePerRange
      ? BREAKPOINT_RANGES.filter(range => collapsePerRange[range])
      : [];
  const isCollapsible = collapseRanges.length > 0;

  // When collapsible, the toggle sits beside the content inside a wrapper (which takes
  // `className` and `style`), so the content element can take `dangerouslySetInnerHTML`
  // and the collapse selectors only see the content. The collapsing itself is CSS
  // (field.css: .field-prose-preview-N), so it can be limited to phones without JS.
  const content = (
    <Tag
      id={isCollapsible ? contentId : id}
      className={mergeClassNames(
        'field-prose',
        isStringSize && size !== 'base' && `field-prose-${size}`,
        ...acc.classes,
        !isCollapsible && className
      )}
      style={{
        maxWidth: maxWidth === 'none' ? 'none' : maxWidth,
        ...acc.style,
        ...(!isCollapsible && style),
      }}
      {...props}
    >
      {children}
    </Tag>
  );

  if (!isCollapsible) return content;

  return (
    <div
      className={mergeClassNames(
        'field-prose-collapsible',
        `field-prose-preview-${preview}`,
        ...collapseRanges.map(range => `field-prose-collapse-${range}`),
        !expanded && 'field-prose-collapsed',
        className
      )}
      style={style}
    >
      {content}
      <button
        type="button"
        className="field-prose-toggle"
        aria-expanded={expanded}
        aria-controls={contentId}
        onClick={() => setExpanded(prev => !prev)}
      >
        {expanded ? (
          <>
            {collapseLabel} <ChevronUp size={16} aria-hidden="true" />
          </>
        ) : (
          <>
            {expandLabel} <ChevronDown size={16} aria-hidden="true" />
          </>
        )}
      </button>
    </div>
  );
};

/* --- SKIP LINK --- */
export interface SkipLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Target of the main content, e.g. `#main`. Default `#main`. */
  href?: string;
  children?: React.ReactNode;
}

/**
 * "Skip to content" link for keyboard users. Hidden until focused; place it first in the page
 * and give your main landmark the matching id (`<main id="main">`). Focus is moved to the
 * target directly, so it also works with hash routers and targets that are not focusable.
 */
export const SkipLink: React.FC<SkipLinkProps> = ({ href = '#main', className = '', children = 'Skip to content', onClick, ...props }) => (
  <a
    href={href}
    className={mergeClassNames('field-skip-link', className)}
    onClick={e => {
      onClick?.(e);
      if (e.defaultPrevented || !href.startsWith('#')) return;
      const target = document.getElementById(decodeURIComponent(href.slice(1)));
      if (!target) return;
      e.preventDefault();
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus();
    }}
    {...props}
  >
    {children}
  </a>
);

/* --- BACK TO TOP --- */
export interface BackToTopProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Scroll distance (px) after which the button appears. Default `600`. */
  threshold?: number;
  /** Element to move focus to after scrolling (e.g. `#main`), so keyboard users land at the top too. */
  focusTarget?: string;
  /** Accessible label. Default `Back to top`. */
  label?: string;
}

/** A floating button that appears after scrolling down and returns to the top of the page. */
export const BackToTop: React.FC<BackToTopProps> = ({
  threshold = 600,
  focusTarget,
  label = 'Back to top',
  className = '',
  onClick,
  ...props
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > threshold);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [threshold]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    if (focusTarget) document.querySelector<HTMLElement>(focusTarget)?.focus({ preventScroll: true });
  };

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={mergeClassNames('field-back-to-top', visible && 'visible', className)}
      tabIndex={visible ? undefined : -1}
      aria-hidden={visible ? undefined : true}
      onClick={handleClick}
      {...props}
    >
      <ArrowUp size={18} aria-hidden="true" />
    </button>
  );
};

/* --- REVEAL --- */
export interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  /** Entrance effect. Default `fade-up`. */
  effect?: 'fade' | 'fade-up' | 'zoom';
  /** Delay in ms, e.g. to stagger cards. */
  delay?: number;
  /** Animate only the first time it enters the viewport. Default `true`. */
  once?: boolean;
  /** Apply reveal directly to the single child instead of creating a wrapper element. */
  asChild?: boolean;
  /** Stretch wrapper to 100% height of parent container (preserves equal-height grids). */
  fill?: boolean;
  /** Element to render. Default `div`. */
  as?: React.ElementType;
  children: React.ReactNode;
}

/**
 * Fades content in as it scrolls into view. Skipped entirely for users who prefer
 * reduced motion, and content stays visible if JavaScript has not run (SSR).
 */
export const Reveal: React.FC<RevealProps> = ({
  effect = 'fade-up',
  delay = 0,
  once = true,
  asChild = false,
  fill = false,
  as: Tag = 'div',
  className = '',
  style,
  children,
  ...props
}) => {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<'static' | 'hidden' | 'shown'>('static');

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setState('static');
      return;
    }

    let isInitial = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (isInitial) {
          isInitial = false;
          if (entry.isIntersecting) {
            setState('shown');
            if (once) observer.disconnect();
            return;
          }
          setState('hidden');
          return;
        }

        if (entry.isIntersecting) {
          setState('shown');
          if (once) observer.disconnect();
        } else if (!once) {
          setState('hidden');
        }
      },
      { rootMargin: '0px 0px -10% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  const classNames = mergeClassNames(
    'field-reveal',
    `field-reveal-${effect}`,
    fill && 'field-reveal-fill',
    state !== 'static' && `field-reveal-${state}`,
    className
  );
  const revealStyle = { transitionDelay: delay ? `${delay}ms` : undefined, ...style };

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<any>;
    const childProps = child.props || {};
    return React.cloneElement(child, {
      ref: mergeRefs(ref, getElementRef(child) as React.Ref<HTMLElement>),
      className: mergeClassNames(classNames, childProps.className),
      style: { ...revealStyle, ...childProps.style },
      ...props,
    });
  }

  return (
    <Tag
      ref={ref}
      className={classNames}
      style={revealStyle}
      {...props}
    >
      {children}
    </Tag>
  );
};

/* --- FLOATING BUTTON --- */
export interface FloatingButtonProps extends ButtonProps {
  /**
   * On phones (below 640px), hide the label visually (it stays part of the accessible name) and show only
   * the icon, plus `badge` when set.
   */
  compactOnMobile?: boolean;
  /**
   * A count or short status after the label, styled like `Chip`'s count, e.g. the items in a basket. It stays
   * visible when `compactOnMobile` hides the label, and is read after it ("Basket 3"), so word the label to
   * suit. `0` is shown; pass `undefined` to hide it.
   */
  badge?: React.ReactNode;
}

/**
 * A button fixed to the bottom-right corner, e.g. a basket or "Book now". `BackToTop` moves up
 * above it automatically. Use one per page; give it a `leftIcon` if you set `compactOnMobile`.
 *
 * @example
 * <FloatingButton href="/basket" leftIcon={<ShoppingBag size={18} />} badge={count} compactOnMobile>
 *   Basket
 * </FloatingButton>
 */
export const FloatingButton = React.forwardRef<ButtonElement, FloatingButtonProps>(
  ({ compactOnMobile = false, badge, variant = 'primary', size = 'xl', className = '', asChild, children, ...props }, ref) => {
    const hasBadge = badge !== undefined && badge !== null && badge !== false;
    // The label text gets its own span so compact mode can hide it while the badge stays visible.
    const wrapLabel = (label: React.ReactNode) => (
      <>
        <span className="field-floating-button-text">{label}</span>
        {/* A space so the accessible name reads "Basket 3", not "Basket3" (collapsed by the flex label). */}
        {hasBadge && ' '}
        {hasBadge && <span className="field-floating-button-badge">{badge}</span>}
      </>
    );
    const content =
      asChild && React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<any>, {
            children: wrapLabel((children as React.ReactElement<any>).props.children),
          })
        : wrapLabel(children);
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        asChild={asChild}
        className={mergeClassNames(
          'field-floating-button',
          compactOnMobile && 'field-floating-button-compact',
          hasBadge && 'field-floating-button-has-badge',
          className
        )}
        {...props}
      >
        {content}
      </Button>
    );
  }
);
FloatingButton.displayName = 'FloatingButton';

/* --- SECTION HEADER --- */
export interface SectionHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Eyebrow / overline label displayed above the title (rendered as `Text variant="overline"`). */
  eyebrow?: React.ReactNode;
  /** Primary section title, rendered with `Heading`, so it uses the theme's display font, weights and tracking. */
  title: React.ReactNode;
  /** Heading element level. Default `2`. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** `Heading` display size of the title. Default `sm`; pass `false` for the size `headingLevel` implies (levels 5 and 6 use level 4's). */
  display?: HeadingProps['display'] | false;
  /** `id` of the heading element, e.g. for the section's `aria-labelledby`. Other props go to the wrapper. */
  headingId?: string;
  /** Optional lead or description paragraph (`Text size="lg" tone="secondary" measure`). */
  description?: React.ReactNode;
  /** Call to action button or link, placed beside the header on wide screens and below on mobile. */
  action?: React.ReactNode;
  /** Text alignment: `start` (default) or `center`, as on `Heading` and `Text`. */
  align?: 'start' | 'center';
}

/**
 * Responsive header block for section introductions: eyebrow, title, lead text, and optional action.
 * On mobile, actions wrap underneath the title and description cleanly. It has no outer margin, so
 * space it with the parent's `gap` (e.g. a `Stack`).
 *
 * @example
 * <Section aria-labelledby="archive-title">
 *   <Stack gap="$8">
 *     <SectionHeader
 *       eyebrow="Collections"
 *       title="Our Aircraft Archive"
 *       headingId="archive-title"
 *       description="Explore photographic history from RAF Snaith."
 *       action={<Button variant="outline">View all</Button>}
 *     />
 *     …
 *   </Stack>
 * </Section>
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  headingLevel = 2,
  display = 'sm',
  headingId,
  description,
  action,
  align = 'start',
  className = '',
  children,
  ...props
}) => (
  <div
    className={mergeClassNames(
      'field-section-header',
      `field-section-header-${align}`,
      action && 'field-section-header-has-action',
      className
    )}
    {...props}
  >
    <div className="field-section-header-content">
      {eyebrow && (
        <Text as="span" variant="overline" className="field-section-eyebrow">
          {eyebrow}
        </Text>
      )}
      <Heading
        id={headingId}
        level={Math.min(headingLevel, 4) as HeadingProps['level']}
        as={`h${headingLevel}`}
        display={display || undefined}
        className="field-section-title"
      >
        {title}
      </Heading>
      {description && (
        <Text size="lg" tone="secondary" measure className="field-section-description">
          {description}
        </Text>
      )}
      {children}
    </div>
    {action && <div className="field-section-header-action">{action}</div>}
  </div>
);
