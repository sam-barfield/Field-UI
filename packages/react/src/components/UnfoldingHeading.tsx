import React, { useEffect, useRef, useState, useMemo } from 'react';

export type UnfoldingVariant = 'modular' | 'faceted';
export type UnfoldingTrigger = 'mount' | 'scroll' | 'manual';
export type UnfoldingSize = 'sm' | 'md' | 'lg' | 'xl' | 'hero';
export type UnfoldingSpeed = 'fast' | 'normal' | 'slow' | 'cinematic';

export const SPEED_PRESETS: Record<UnfoldingSpeed, number> = {
  fast: 14,
  normal: 28,
  slow: 55,
  cinematic: 90,
};

export interface UnfoldingHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** The text string to unfold */
  text: string;
  /** Semantic heading tag level */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'div';
  /** Typographic size preset */
  size?: UnfoldingSize;
  /** Style variant: 'modular' (clean scorecard flips) or 'faceted' (origami creases) */
  variant?: UnfoldingVariant;
  /** Animation trigger mode: 'mount' (immediate), 'scroll' (on viewport entry), or 'manual' */
  trigger?: UnfoldingTrigger;
  /** Animation speed preset ('fast' | 'normal' | 'slow' | 'cinematic') or custom milliseconds per facet step */
  speed?: UnfoldingSpeed | number;
  /** Milliseconds per individual facet draw (overrides speed preset if specified, default: 28ms) */
  triangleSpeedMs?: number;
  /** Number of letters the wireframe leads ahead before trailing letters materialize into styled font (default: 2) */
  leadLetterLag?: number;
  /** Wireframe stroke/crease color (defaults to cyan blueprint accent #00d2ff) */
  wireframeColor?: string;
  /** Solid fill color for standard words (defaults to var(--field-text-primary)) */
  fillColor?: string;
  /** Array of words to highlight with accent color (like 'CRAFT' and 'EXPERIENCES') */
  highlightWords?: string[];
  /** Color for highlighted words (defaults to vibrant blue #2563eb) */
  highlightColor?: string;
  /** Whether the animation should only play once */
  once?: boolean;
  /** Total animation duration override in seconds (optional) */
  duration?: number;
  /** Delay between characters in seconds (optional) */
  charStagger?: number;
  /** Manual unfold trigger (when trigger="manual") */
  isUnfolded?: boolean;
  /** Callback fired when the entire heading animation finishes */
  onComplete?: () => void;
}

// ---------------------------------------------------------------------------
// Helpers: Step Counts & Polygonal Origami Unfolding Clips
// ---------------------------------------------------------------------------

function getGlyphTotalSteps(char: string): number {
  const upper = char.toUpperCase();
  if (upper === 'W' || upper === 'M') return 5;
  if (upper === 'N' || upper === 'A') return 4;
  if (['.', ',', '-', '_', "'", '"', '`'].includes(upper)) return 2;
  if (['!', '?', ':', ';', '/', '\\', '(', ')'].includes(upper)) return 3;
  return 5;
}

function getGlyphFoldState(
  char: string,
  step: number,
  totalSteps: number,
  variant: UnfoldingVariant = 'faceted'
): string {
  if (step <= 0) {
    return 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)';
  }

  if (step >= totalSteps) {
    return 'none';
  }

  const upper = char.toUpperCase();

  // Calligraphic stroke progression for W:
  // Starts at top of first stroke down to bottom, up to top of middle, down again, back up to top of last stroke
  if (upper === 'W') {
    switch (step) {
      case 1:
        return 'polygon(0% 0%, 34% 0%, 34% 100%, 0% 100%)';
      case 2:
        return 'polygon(0% 0%, 58% 0%, 58% 100%, 0% 100%)';
      case 3:
        return 'polygon(0% 0%, 80% 0%, 80% 100%, 0% 100%)';
      case 4:
        return 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';
      default:
        return 'none';
    }
  }

  // M: Left stem down -> diagonal to center valley -> diagonal to right apex -> right stem down
  if (upper === 'M') {
    switch (step) {
      case 1:
        return 'polygon(0% 0%, 30% 0%, 30% 100%, 0% 100%)';
      case 2:
        return 'polygon(0% 0%, 56% 0%, 56% 100%, 0% 100%)';
      case 3:
        return 'polygon(0% 0%, 78% 0%, 78% 100%, 0% 100%)';
      case 4:
        return 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';
      default:
        return 'none';
    }
  }

  // N: Left stem down -> diagonal down to bottom-right -> right stem
  if (upper === 'N') {
    switch (step) {
      case 1:
        return 'polygon(0% 0%, 34% 0%, 34% 100%, 0% 100%)';
      case 2:
        return 'polygon(0% 0%, 76% 0%, 76% 100%, 0% 100%)';
      case 3:
        return 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';
      default:
        return 'none';
    }
  }

  // A: Apex down to bottom-left -> apex down to bottom-right -> crossbar
  if (upper === 'A') {
    switch (step) {
      case 1:
        return 'polygon(0% 0%, 52% 0%, 52% 100%, 0% 100%)';
      case 2:
        return 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';
      default:
        return 'none';
    }
  }

  // Modular style: Clean scorecard perpendicular horizontal folds
  if (variant === 'modular') {
    const fraction = step / totalSteps;
    const pct = Math.round(fraction * 100);
    return `polygon(0% 0%, 100% 0%, 100% ${pct}%, 0% ${pct}%)`;
  }

  // Faceted style (Default): Top-down alternating origami diagonal creases
  switch (step) {
    case 1:
      return 'polygon(0% 0%, 100% 0%, 100% 26%, 0% 16%)';
    case 2:
      return 'polygon(0% 0%, 100% 0%, 100% 38%, 0% 48%)';
    case 3:
      return 'polygon(0% 0%, 100% 0%, 100% 70%, 0% 58%)';
    case 4:
      return 'polygon(0% 0%, 100% 0%, 100% 82%, 0% 90%)';
    default:
      return 'none';
  }
}

// ---------------------------------------------------------------------------
// Typographic Presets
// ---------------------------------------------------------------------------

const SIZE_CONFIG: Record<UnfoldingSize, { fontSize: string }> = {
  sm: { fontSize: '1.25rem' },
  md: { fontSize: '1.75rem' },
  lg: { fontSize: '2.5rem' },
  xl: { fontSize: '3.75rem' },
  hero: { fontSize: 'clamp(2.5rem, 5.5vw, 4.75rem)' },
};

// ---------------------------------------------------------------------------
// UnfoldingHeading Component
// ---------------------------------------------------------------------------

export const UnfoldingHeading: React.FC<UnfoldingHeadingProps> = ({
  text,
  as: Component = 'h2',
  size = 'lg',
  variant = 'faceted',
  trigger = 'mount',
  speed = 'normal',
  triangleSpeedMs,
  leadLetterLag = 2,
  wireframeColor = '#00d2ff',
  fillColor,
  highlightWords = [],
  highlightColor = '#2563eb',
  once = true,
  isUnfolded: controlledIsUnfolded,
  onComplete,
  className = '',
  style,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const hasTriggeredRef = useRef(false);

  // Stable unique filter ID per component instance
  const filterIdRef = useRef<string>('');
  if (!filterIdRef.current) {
    filterIdRef.current = `field-wf-${Math.random().toString(36).slice(2, 9)}`;
  }
  const filterId = filterIdRef.current;

  // Sequential State Machine:
  // - activeCharSeqIdx: index in allChars currently drawing its wireframe
  // - activeStepCount: how many facet steps of activeCharSeqIdx are drawn
  // - maxMaterializedIdx: highest index in allChars that has materialized into styled font
  // - isFinished: whether all letters are permanently finished
  const [activeCharSeqIdx, setActiveCharSeqIdx] = useState<number>(-1);
  const [activeStepCount, setActiveStepCount] = useState<number>(0);
  const [maxMaterializedIdx, setMaxMaterializedIdx] = useState<number>(-1);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Check prefers-reduced-motion
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const config = SIZE_CONFIG[size] || SIZE_CONFIG.lg;

  // Resolve timing per facet draw
  const resolvedSpeedMs = useMemo(() => {
    if (typeof triangleSpeedMs === 'number') return triangleSpeedMs;
    if (typeof speed === 'number') return speed;
    if (typeof speed === 'string' && speed in SPEED_PRESETS) return SPEED_PRESETS[speed as UnfoldingSpeed];
    return 28;
  }, [triangleSpeedMs, speed]);

  // Scroll Trigger via IntersectionObserver
  useEffect(() => {
    if (trigger !== 'scroll') return;
    if (hasTriggeredRef.current && once) return;

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setInView(true);
          hasTriggeredRef.current = true;
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setInView(false);
          setIsFinished(false);
          setActiveCharSeqIdx(-1);
          setActiveStepCount(0);
          setMaxMaterializedIdx(-1);
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [trigger, once]);

  // Determine if animation should run
  const shouldAnimate = useMemo(() => {
    if (prefersReducedMotion) return false;
    if (trigger === 'manual') return !!controlledIsUnfolded;
    if (trigger === 'mount') return true;
    return inView;
  }, [prefersReducedMotion, trigger, controlledIsUnfolded, inView]);

  // Stable highlight set based on joined string
  const highlightKey = useMemo(() => (highlightWords || []).join(','), [highlightWords]);
  const highlightSet = useMemo(() => {
    return new Set((highlightWords || []).map((w) => w.toUpperCase().trim()));
  }, [highlightKey]);

  // Words & Characters decomposition with strict sequence indexing
  const { wordsData, allChars } = useMemo(() => {
    const rawWords = text.split(' ');
    let globalCharSeqIdx = 0;
    const allCharsList: Array<{
      char: string;
      charSeqIdx: number;
      totalSteps: number;
      wordIdx: number;
      isHighlighted: boolean;
    }> = [];

    const words = rawWords.map((word, wordIdx) => {
      const cleanWord = word.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
      const isHighlighted = highlightSet.has(cleanWord);

      const chars = word.split('').map((char) => {
        const charSeqIdx = globalCharSeqIdx++;
        const totalSteps = getGlyphTotalSteps(char);
        const item = { char, charSeqIdx, totalSteps, wordIdx, isHighlighted };
        allCharsList.push(item);
        return item;
      });

      return { word, chars, isHighlighted };
    });

    return { wordsData: words, allChars: allCharsList };
  }, [text, highlightSet]);

  // Sequential Animation Orchestration
  useEffect(() => {
    if (prefersReducedMotion) {
      setIsFinished(true);
      return;
    }

    if (!shouldAnimate) {
      if (!once) {
        setIsFinished(false);
        setActiveCharSeqIdx(-1);
        setActiveStepCount(0);
        setMaxMaterializedIdx(-1);
      }
      return;
    }

    if (allChars.length === 0) {
      setIsFinished(true);
      return;
    }

    setIsFinished(false);
    setActiveCharSeqIdx(0);
    setActiveStepCount(0);
    setMaxMaterializedIdx(-1);

    let isCancelled = false;
    let currentCharIdx = 0;
    let currentStepIdx = 0;

    const runSequence = () => {
      if (isCancelled) return;

      // 1. If lead wave finished all characters, flush trailing letters to styled font
      if (currentCharIdx >= allChars.length) {
        const flushInterval = setInterval(() => {
          if (isCancelled) {
            clearInterval(flushInterval);
            return;
          }
          setMaxMaterializedIdx((prev) => {
            const next = prev + 1;
            if (next >= allChars.length - 1) {
              clearInterval(flushInterval);
              setIsFinished(true);
              if (onComplete) onComplete();
              return allChars.length - 1;
            }
            return next;
          });
        }, Math.max(resolvedSpeedMs * 2, 60));

        return;
      }

      // 2. Lead wave: advance next facet step of current active character
      const activeChar = allChars[currentCharIdx];
      const totalSteps = activeChar.totalSteps;

      currentStepIdx++;
      setActiveCharSeqIdx(currentCharIdx);
      setActiveStepCount(currentStepIdx);

      // 3. Trailing wave: materialize completed letters that are leadLetterLag behind
      if (currentCharIdx >= leadLetterLag) {
        const targetMatIdx = currentCharIdx - leadLetterLag;
        setMaxMaterializedIdx((prev) => Math.max(prev, targetMatIdx));
      }

      // 4. When current character's facet steps are complete, advance to next letter
      if (currentStepIdx >= totalSteps) {
        currentCharIdx++;
        currentStepIdx = 0;
      }

      setTimeout(runSequence, resolvedSpeedMs);
    };

    const startTimeout = setTimeout(runSequence, 80);

    return () => {
      isCancelled = true;
      clearTimeout(startTimeout);
    };
  }, [shouldAnimate, allChars, resolvedSpeedMs, leadLetterLag, prefersReducedMotion, once, onComplete]);

  const Tag = Component as React.ElementType;

  return (
    <div
      ref={containerRef}
      className={`field-unfolding-container field-unfolding-${size} ${className}`}
      style={{
        display: 'inline-flex',
        flexWrap: 'wrap',
        alignItems: 'baseline',
        columnGap: '0.34em',
        rowGap: '0.15em',
        fontFamily: 'var(--field-font-sans, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
        fontWeight: 800,
        fontSize: config.fontSize,
        lineHeight: 1.1,
        letterSpacing: '-0.03em',
        textTransform: 'uppercase',
        userSelect: 'none',
        ...style,
      }}
      {...props}
    >
      {/* Semantic Accessible Tag for Screen Readers & SEO */}
      <Tag
        aria-label={text}
        className="field-unfolding-accessible-text"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        {text}
      </Tag>

      {/* Dynamic SVG Filter for 100% Unified Typographic Wireframe (Zero Overlapping Seams) */}
      <svg
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <defs>
          <filter
            id={filterId}
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
            colorInterpolationFilters="sRGB"
          >
            {/* 1. Dilate the unified font alpha mask by 1.25px */}
            <feMorphology
              in="SourceAlpha"
              operator="dilate"
              radius="1.25"
              result="dilated"
            />
            {/* 2. Subtract SourceAlpha from dilated: gives ONLY the outer perimeter outline */}
            <feComposite
              in="dilated"
              in2="SourceAlpha"
              operator="out"
              result="outlineMask"
            />
            {/* 3. Color the outer perimeter outline with wireframeColor */}
            <feFlood floodColor={wireframeColor} result="strokeColor" />
            <feComposite
              in="strokeColor"
              in2="outlineMask"
              operator="in"
              result="strokeOnly"
            />

            {/* 4. Subtle neon bloom glow on the stroke */}
            <feGaussianBlur
              in="strokeOnly"
              stdDeviation="2.5"
              result="strokeGlow"
            />

            {/* 5. Translucent 14% blueprint wash fill for the interior */}
            <feComponentTransfer in="SourceAlpha" result="dimmedMask">
              <feFuncA type="linear" slope="0.14" />
            </feComponentTransfer>
            <feComposite
              in="strokeColor"
              in2="dimmedMask"
              operator="in"
              result="fillOnly"
            />

            {/* 6. Merge fill + glow + crisp stroke */}
            <feMerge>
              <feMergeNode in="strokeGlow" />
              <feMergeNode in="fillOnly" />
              <feMergeNode in="strokeOnly" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Render Words */}
      {wordsData.map((wordObj, wordIdx) => {
        const wordColor = wordObj.isHighlighted
          ? highlightColor
          : fillColor || 'var(--field-text-primary, #0f172a)';

        return (
          <span
            key={wordIdx}
            className="field-unfolding-word"
            style={{
              display: 'inline-block',
              whiteSpace: 'nowrap',
              color: wordColor,
            }}
          >
            {wordObj.chars.map(({ char, charSeqIdx, totalSteps }) => {
              let visibleStepCount = 0;
              let isMaterialized = false;
              let isActive = false;

              if (isFinished) {
                isMaterialized = true;
              } else if (charSeqIdx <= maxMaterializedIdx) {
                // Trailing materialization wave has reached this character
                isMaterialized = true;
              } else if (charSeqIdx < activeCharSeqIdx) {
                // Completed wireframe waiting for materialization wave
                visibleStepCount = totalSteps;
                isMaterialized = false;
              } else if (charSeqIdx === activeCharSeqIdx) {
                // Actively unfolding facet by facet
                visibleStepCount = activeStepCount;
                isActive = true;
                isMaterialized = false;
              } else {
                // Upcoming letter
                visibleStepCount = 0;
                isMaterialized = false;
              }

              return (
                <LetterPolygonalCell
                  key={charSeqIdx}
                  char={char}
                  color={wordColor}
                  filterId={filterId}
                  visibleStepCount={visibleStepCount}
                  totalSteps={totalSteps}
                  variant={variant}
                  isMaterialized={isMaterialized}
                  isFinished={isFinished}
                  isActive={isActive}
                />
              );
            })}
          </span>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Single Letter Cell: Real Typographic Font Vector Contours (Zero Overlapping Seams)
// ---------------------------------------------------------------------------

interface LetterPolygonalCellProps {
  char: string;
  color: string;
  filterId: string;
  visibleStepCount: number;
  totalSteps: number;
  variant: UnfoldingVariant;
  isMaterialized: boolean;
  isFinished: boolean;
  isActive: boolean;
}

const LetterPolygonalCell: React.FC<LetterPolygonalCellProps> = ({
  char,
  color,
  filterId,
  visibleStepCount,
  totalSteps,
  variant,
  isMaterialized,
  isFinished,
  isActive,
}) => {
  // If animation has permanently completed, render pure static text for 0% ongoing CPU overhead
  if (isFinished) {
    return (
      <span
        style={{
          display: 'inline-block',
          color,
          transform: 'translateZ(0)',
        }}
      >
        {char}
      </span>
    );
  }

  // Upcoming character: invisible in DOM but occupies its exact natural font layout width & kerning
  if (visibleStepCount === 0 && !isMaterialized) {
    return (
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          position: 'relative',
          verticalAlign: 'baseline',
          opacity: 0,
          userSelect: 'none',
        }}
      >
        {char}
      </span>
    );
  }

  const isWireframe = !isMaterialized;
  const clipPath = isActive && isWireframe
    ? getGlyphFoldState(char, visibleStepCount, totalSteps, variant)
    : 'none';

  return (
    <span
      className="field-unfolding-letter-box"
      style={{
        display: 'inline-block',
        position: 'relative',
        verticalAlign: 'baseline',
      }}
    >
      {/* Real Typographic Font Glyph:
             Uses the SVG unified silhouette filter in wireframe mode to eliminate 100% of internal
             overlapping component contours (like the crossbar box in 'A' or the arm boxes in 'F' and 'E').
             Transitions smoothly to solid text on materialization. */}
      <span
        className="field-unfolding-glyph"
        style={{
          display: 'inline-block',
          position: 'relative',
          clipPath: clipPath !== 'none' ? clipPath : undefined,
          color: isWireframe ? '#ffffff' : color,
          filter: isWireframe ? `url(#${filterId})` : 'none',
          transition: 'color 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: 'translateZ(0)',
        }}
      >
        {char}
      </span>
    </span>
  );
};
