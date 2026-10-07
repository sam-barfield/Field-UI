'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, ExternalLink } from 'lucide-react';
import { mergeClassNames, renderPolymorphic } from '../utils/polymorphic.js';
import { useIsomorphicLayoutEffect } from '../utils/hooks.js';
import { ThemeScope, useThemeSafe } from '../theme/ThemeProvider.js';
import { Container, type ContainerProps } from './Typography.js';

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
   * Cover image behind the content. The section switches to the dark theme (or the pair's
   * `band` theme, see `createThemePair`) and adds `overlay`.
   */
  backgroundImage?: string;
  /** Darkness of the overlay over `backgroundImage`, 0 to 1. Default `0.55`. */
  overlay?: number;
  /** Element to render. Default `section`. */
  as?: React.ElementType;
  children: React.ReactNode;
}

/**
 * A full-width page band with consistent vertical rhythm, an optional background
 * tone or image, and a centred container. The building block of marketing pages.
 * Give it an `id` to make it an in-page link target; set `--field-scroll-offset`
 * to the height of a sticky navbar so anchors are not hidden under it.
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
  overlay = 0.55,
  as = 'section',
  className = '',
  style,
  children,
  ...props
}) => {
  const imageStyle = backgroundImage
    ? ({
        '--field-section-image': `url("${backgroundImage.replace(/"/g, '\\"')}")`,
        '--field-section-overlay': String(Math.min(1, Math.max(0, overlay))),
      } as React.CSSProperties)
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
        className
      )}
      style={{ ...imageStyle, ...style }}
      {...props}
    >
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
      'a',
      {
        asChild,
        as,
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
export interface ProseProps extends React.HTMLAttributes<HTMLElement> {
  /** Base text size. Default `base`. */
  size?: 'sm' | 'base' | 'lg';
  /** Max line length. Default `68ch`; pass `none` to fill the container. */
  maxWidth?: string;
  /** Element to render. Default `div`; use `article` for posts. */
  as?: React.ElementType;
  children: React.ReactNode;
}

/**
 * Styles raw HTML content (headings, paragraphs, lists, quotes, images, tables, code)
 * from Markdown or a CMS, e.g. about pages, blog posts and policies.
 *
 * @example
 * <Prose as="article" dangerouslySetInnerHTML={{ __html: post.html }} />
 */
export const Prose: React.FC<Omit<ProseProps, 'children'> & { children?: React.ReactNode }> = ({
  size = 'base',
  maxWidth = '68ch',
  as: Tag = 'div',
  className = '',
  style,
  children,
  ...props
}) => (
  <Tag className={mergeClassNames('field-prose', `field-prose-${size}`, className)} style={{ maxWidth, ...style }} {...props}>
    {children}
  </Tag>
);

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
  as: Tag = 'div',
  className = '',
  style,
  children,
  ...props
}) => {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<'static' | 'hidden' | 'shown'>('static');

  // Before paint: hide only when the element starts below the fold, so content
  // already on screen never flashes and server-rendered HTML stays visible.
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setState('hidden');
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || state === 'static') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
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
  }, [state === 'static', once]);

  return (
    <Tag
      ref={ref}
      className={mergeClassNames('field-reveal', `field-reveal-${effect}`, state !== 'static' && `field-reveal-${state}`, className)}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined, ...style }}
      {...props}
    >
      {children}
    </Tag>
  );
};
