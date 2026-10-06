'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, ImageOff, Pause, Play, X } from 'lucide-react';
import { mergeClassNames } from '../utils/polymorphic.js';
import { useControllableState, useDismissableLayer, useFocusTrap, usePrefersReducedMotion, useScrollLock } from '../utils/hooks.js';
import { applyResponsive, createResponsiveAccumulator, type Responsive } from '../utils/responsive.js';
import { getPortalTarget, usePortalThemeProps } from '../theme/usePortalTheme.js';

type Ratio = number | `${number}/${number}` | `${number} / ${number}`;
type Radius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

const ratioToCss = (ratio: Ratio) => (typeof ratio === 'number' ? String(ratio) : ratio);

/* --- ASPECT RATIO --- */
export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width / height, e.g. `16 / 9`, `1`, or `"4/3"`. Default `16 / 9`. */
  ratio?: Ratio;
  /** Corner radius from the theme. Default `none`. */
  radius?: Radius;
  children: React.ReactNode;
}

/**
 * Keeps its child (iframe, video, map, image) at a fixed aspect ratio; the child fills the box.
 *
 * @example
 * <AspectRatio ratio={16 / 9} radius="lg">
 *   <iframe src="https://www.youtube-nocookie.com/embed/…" title="Tour of the café" allowFullScreen />
 * </AspectRatio>
 */
export const AspectRatio: React.FC<AspectRatioProps> = ({ ratio = 16 / 9, radius = 'none', className = '', style, children, ...props }) => (
  <div
    className={mergeClassNames('field-aspect', `field-radius-${radius}`, className)}
    style={{ aspectRatio: ratioToCss(ratio), ...style }}
    {...props}
  >
    {children}
  </div>
);

/* --- IMAGE --- */
export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'alt'> {
  src: string;
  /** Describe the image; pass `""` for purely decorative images. */
  alt: string;
  /** Crop to a fixed aspect ratio (e.g. `4 / 3`). Without it the image keeps its natural shape. */
  ratio?: Ratio;
  /** How the image fills a fixed ratio. Default `cover`. */
  fit?: 'cover' | 'contain';
  /** Focal point when cropping, e.g. `"center top"`. */
  position?: string;
  /** Corner radius from the theme. Default `md`. */
  radius?: Radius;
  /** Renders a `<figure>` with this caption. */
  caption?: React.ReactNode;
  /** Shown if the image fails to load. Defaults to an icon on a neutral background. */
  fallback?: React.ReactNode;
}

/**
 * Responsive image with optional aspect-ratio cropping, rounded corners, caption and an
 * error fallback. Lazy-loads by default; pass `loading="eager"` for above-the-fold heroes.
 * Works with `srcSet` / `sizes` like a normal `<img>`.
 *
 * @example
 * <Image src="/img/latte.jpg" alt="Latte art in a ceramic cup" ratio={4 / 3} caption="Our house blend" />
 */
export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    { src, alt, ratio, fit = 'cover', position, radius = 'md', caption, fallback, loading = 'lazy', decoding = 'async', className = '', style, onError, ...props },
    ref
  ) => {
    const [failed, setFailed] = useState(false);
    useEffect(() => setFailed(false), [src]);

    const frame = (
      <div
        className={mergeClassNames('field-image', ratio !== undefined && 'field-image-ratio', `field-radius-${radius}`, !caption && className)}
        style={{ aspectRatio: ratio !== undefined ? ratioToCss(ratio) : undefined, ...(!caption ? style : undefined) }}
      >
        {failed ? (
          <div className="field-image-fallback" role={alt ? 'img' : undefined} aria-label={alt || undefined}>
            {fallback ?? <ImageOff size={24} aria-hidden="true" />}
          </div>
        ) : (
          <img
            ref={ref}
            src={src}
            alt={alt}
            loading={loading}
            decoding={decoding}
            style={{ objectFit: fit, objectPosition: position }}
            onError={e => {
              setFailed(true);
              onError?.(e);
            }}
            {...props}
          />
        )}
      </div>
    );

    if (!caption) return frame;
    return (
      <figure className={mergeClassNames('field-figure', className)} style={style}>
        {frame}
        <figcaption className="field-figure-caption">{caption}</figcaption>
      </figure>
    );
  }
);
Image.displayName = 'Image';

/* --- LIGHTBOX --- */
export interface LightboxImage {
  src: string;
  alt: string;
  caption?: React.ReactNode;
  /** Smaller image for gallery tiles. Defaults to `src`. */
  thumbnail?: string;
}

export interface LightboxProps {
  images: LightboxImage[];
  isOpen: boolean;
  onClose: () => void;
  /** Index of the image shown (controlled). */
  index?: number;
  /** Initial index when uncontrolled. Default `0`. */
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  /** Accessible name of the dialog. Default `Image viewer`. */
  'aria-label'?: string;
  className?: string;
}

/**
 * Full-screen image viewer with previous/next, captions, a counter, arrow-key and swipe
 * navigation. Used by `Gallery`; render it yourself for custom triggers.
 */
export const Lightbox: React.FC<LightboxProps> = ({
  images,
  isOpen,
  onClose,
  index: indexProp,
  defaultIndex = 0,
  onIndexChange,
  'aria-label': ariaLabel = 'Image viewer',
  className = '',
}) => {
  const [index, setIndex] = useControllableState({ value: indexProp, defaultValue: defaultIndex, onChange: onIndexChange });
  const dialogRef = useRef<HTMLDivElement>(null);
  const pointerStart = useRef<number | null>(null);
  const portalProps = usePortalThemeProps(mergeClassNames('field-lightbox', className));
  const count = images.length;
  const current = images[Math.min(Math.max(index, 0), Math.max(count - 1, 0))];

  const go = useCallback((delta: number) => setIndex((index + delta + count) % count), [index, count, setIndex]);

  useScrollLock(isOpen);
  useFocusTrap(dialogRef, isOpen);
  useDismissableLayer(isOpen, { refs: [dialogRef], onDismiss: onClose, outsidePress: false });

  if (!isOpen || !current) return null;
  const target = getPortalTarget();
  if (!target) return null;

  return createPortal(
    <div {...portalProps}>
      <div
        ref={dialogRef}
        className="field-lightbox-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
        onKeyDown={e => {
          if (count < 2) return;
          if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
          if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
        }}
        onPointerDown={e => { pointerStart.current = e.clientX; }}
        onPointerUp={e => {
          if (pointerStart.current === null || count < 2) return;
          const dx = e.clientX - pointerStart.current;
          pointerStart.current = null;
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        }}
        onClick={e => {
          // Clicking the dark backdrop (not the image or controls) closes the viewer.
          if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('field-lightbox-stage')) onClose();
        }}
      >
        <div className="field-lightbox-toolbar">
          {count > 1 && (
            <span className="field-lightbox-counter" aria-live="polite">
              {index + 1} / {count}
            </span>
          )}
          <button type="button" className="field-lightbox-btn" onClick={onClose} aria-label="Close">
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="field-lightbox-stage">
          {count > 1 && (
            <button type="button" className="field-lightbox-btn field-lightbox-prev" onClick={() => go(-1)} aria-label="Previous image">
              <ChevronLeft size={24} aria-hidden="true" />
            </button>
          )}
          <figure className="field-lightbox-figure">
            <img key={current.src} src={current.src} alt={current.alt} className="field-lightbox-img" draggable={false} />
            {current.caption && <figcaption className="field-lightbox-caption">{current.caption}</figcaption>}
          </figure>
          {count > 1 && (
            <button type="button" className="field-lightbox-btn field-lightbox-next" onClick={() => go(1)} aria-label="Next image">
              <ChevronRight size={24} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>,
    target
  );
};

/* --- GALLERY --- */
export interface GalleryProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  images: LightboxImage[];
  /** Columns; accepts a breakpoint object. Default `{ base: 2, md: 3 }`. */
  columns?: Responsive<number>;
  /** Tile aspect ratio. Default `1` (square). */
  ratio?: Ratio;
  /** Gap between tiles (px). Default `8`. */
  gap?: number;
  /** Tile corner radius. Default `md`. */
  radius?: Radius;
  /** Open a full-screen `Lightbox` when a tile is clicked. Default `true`. */
  lightbox?: boolean;
}

/**
 * A grid of image tiles that open in a full-screen `Lightbox`.
 *
 * @example
 * <Gallery images={photos} columns={{ base: 2, lg: 4 }} ratio={4 / 3} />
 */
export const Gallery: React.FC<GalleryProps> = ({
  images,
  columns = { base: 2, md: 3 },
  ratio = 1,
  gap = 8,
  radius = 'md',
  lightbox = true,
  className = '',
  style,
  ...props
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const acc = createResponsiveAccumulator();
  applyResponsive(acc, 'gtc', 'gridTemplateColumns', columns, n => `repeat(${n}, minmax(0, 1fr))`, 2);

  return (
    <>
      <div
        className={mergeClassNames('field-gallery', ...acc.classes, className)}
        style={{ gap: `${gap}px`, ...acc.style, ...style }}
        {...props}
      >
        {images.map((image, i) =>
          lightbox ? (
            <button
              key={image.src}
              type="button"
              className="field-gallery-tile"
              onClick={() => setOpenIndex(i)}
              aria-label={`View image ${i + 1} of ${images.length}${image.alt ? `: ${image.alt}` : ''}`}
            >
              <Image src={image.thumbnail ?? image.src} alt="" ratio={ratio} radius={radius} />
            </button>
          ) : (
            <Image key={image.src} src={image.thumbnail ?? image.src} alt={image.alt} ratio={ratio} radius={radius} />
          )
        )}
      </div>
      {lightbox && (
        <Lightbox
          images={images}
          isOpen={openIndex !== null}
          index={openIndex ?? 0}
          onIndexChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  );
};

/* --- CAROUSEL --- */
export interface CarouselProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** Accessible name, e.g. "Customer reviews". Required: a carousel is a landmark region. */
  'aria-label': string;
  /** Slides visible at once; accepts a breakpoint object. Default `1`. */
  slidesPerView?: Responsive<number>;
  /** Gap between slides (px). Default `16`. */
  gap?: number;
  /** Show previous/next buttons. Default `true`. */
  showArrows?: boolean;
  /** Show page dots. Default `true`. */
  showDots?: boolean;
  /** Wrap from the last page back to the first. Default `false`. */
  loop?: boolean;
  /** Advance automatically every N ms. Pauses on hover/focus, adds a pause button, and is disabled for reduced motion. */
  autoPlay?: number;
  children: React.ReactNode;
}

/**
 * A horizontally scrolling set of slides with native swipe (CSS scroll-snap),
 * arrow buttons, page dots and optional autoplay. Wrap each slide in `CarouselSlide`.
 *
 * @example
 * <Carousel aria-label="Customer reviews" slidesPerView={{ base: 1, md: 2, lg: 3 }}>
 *   {reviews.map(r => <CarouselSlide key={r.id}><Card>…</Card></CarouselSlide>)}
 * </Carousel>
 */
export const Carousel: React.FC<CarouselProps> = ({
  'aria-label': ariaLabel,
  slidesPerView = 1,
  gap = 16,
  showArrows = true,
  showDots = true,
  loop = false,
  autoPlay,
  className = '',
  style,
  children,
  ...props
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [paused, setPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const slides = React.Children.toArray(children);

  const acc = createResponsiveAccumulator();
  applyResponsive(acc, 'cpv', '--field-carousel-per-view', slidesPerView, n => String(n), 1);

  // One "page" = one slide step; the last page is when the final slide is fully visible.
  const measure = useCallback(() => {
    const track = trackRef.current;
    const first = track?.firstElementChild as HTMLElement | null;
    if (!track || !first) return;
    const step = first.offsetWidth + gap;
    const perView = Math.max(1, Math.round((track.clientWidth + gap) / step));
    setPageCount(Math.max(1, slides.length - perView + 1));
    setPage(Math.round(track.scrollLeft / step));
  }, [gap, slides.length]);

  useEffect(() => {
    measure();
    const track = trackRef.current;
    if (!track || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, [measure]);

  const scrollToPage = useCallback(
    (target: number) => {
      const track = trackRef.current;
      const first = track?.firstElementChild as HTMLElement | null;
      if (!track || !first) return;
      const next = loop ? (target + pageCount) % pageCount : Math.min(Math.max(target, 0), pageCount - 1);
      track.scrollTo({ left: next * (first.offsetWidth + gap), behavior: reduceMotion ? 'auto' : 'smooth' });
    },
    [gap, loop, pageCount, reduceMotion]
  );

  const autoPlaying = !!autoPlay && !reduceMotion && !userPaused && pageCount > 1;
  useEffect(() => {
    if (!autoPlaying || paused) return;
    const id = window.setInterval(() => {
      const atEnd = page >= pageCount - 1;
      scrollToPage(atEnd ? 0 : page + 1);
    }, autoPlay);
    return () => window.clearInterval(id);
  }, [autoPlaying, paused, autoPlay, page, pageCount, scrollToPage]);

  const canPrev = loop || page > 0;
  const canNext = loop || page < pageCount - 1;

  return (
    <section
      className={mergeClassNames('field-carousel', ...acc.classes, className)}
      style={{ '--field-carousel-gap': `${gap}px`, ...acc.style, ...style } as React.CSSProperties}
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={e => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
      {...props}
    >
      <div
        ref={trackRef}
        className="field-carousel-track"
        onScroll={measure}
        aria-live={autoPlaying && !paused ? 'off' : 'polite'}
      >
        {slides.map((slide, i) => (
          <div key={(React.isValidElement(slide) && slide.key) || i} className="field-carousel-slide" role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${slides.length}`}>
            {React.isValidElement(slide) && slide.type === CarouselSlide ? (slide.props as CarouselSlideProps).children : slide}
          </div>
        ))}
      </div>

      {(showArrows || showDots || autoPlay) && pageCount > 1 && (
        <div className="field-carousel-controls">
          {autoPlay && !reduceMotion && (
            <button
              type="button"
              className="field-carousel-btn"
              onClick={() => setUserPaused(p => !p)}
              aria-label={userPaused ? 'Start automatic slide show' : 'Stop automatic slide show'}
            >
              {userPaused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
            </button>
          )}
          {showArrows && (
            <button type="button" className="field-carousel-btn" onClick={() => scrollToPage(page - 1)} disabled={!canPrev} aria-label="Previous slide">
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
          )}
          {showDots && (
            <div className="field-carousel-dots">
              {Array.from({ length: pageCount }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  className={mergeClassNames('field-carousel-dot', i === page && 'active')}
                  onClick={() => scrollToPage(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === page ? 'true' : undefined}
                />
              ))}
            </div>
          )}
          {showArrows && (
            <button type="button" className="field-carousel-btn" onClick={() => scrollToPage(page + 1)} disabled={!canNext} aria-label="Next slide">
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export interface CarouselSlideProps {
  children: React.ReactNode;
}

/** One slide inside a `Carousel`. */
export const CarouselSlide: React.FC<CarouselSlideProps> = ({ children }) => <>{children}</>;
