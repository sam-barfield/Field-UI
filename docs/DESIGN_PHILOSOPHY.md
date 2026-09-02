# Field Design System — Design Philosophy & Technical Specification

> "Bespoke, tactical precision for engineers and craftsmen. Built for high-contrast dark environments with flawless light parity."

---

## 1. Aesthetic Foundations

Most design systems produced today fall into one of two traps:
1. **Generic AI / Bootstrap Archetypes**: Washed-out grays, oversaturated purple/indigo gradients, giant blurry drop-shadows, and bubbly rounded pill corners that lack intentionality.
2. **Brutalist / Unusable Quirks**: Excessively raw layouts that sacrifice readability and accessibility.

**Field** was engineered as an antidote:
- **Obsidian & Deep Carbon Baselines**: Deep surfaces (`#090B0E`, `#11141B`, `#171B24`) configured with subtle cool undertones that reduce eye fatigue during extended technical workflows while maximizing contrast.
- **Micro-Luminescent 1px Borders**: Instead of heavy shadows, components use crisp 1px borders (`rgba(255, 255, 255, 0.08)`) with subtle specular highlights on top edges (`inset 0 1px 0 rgba(255, 255, 255, 0.14)`).
- **Tactical Accent Colors**: High-contrast, surgical accents—Field Cobalt (`#2563EB`), Titanium Amber (`#D97706`), Emerald Cybernetic (`#10B981`), and Hyper Violet (`#7C3AED`).
- **Tabular Precision**: Numeric values, metrics, and data grids utilize monospace tabular numbers (`font-variant-numeric: tabular-nums`) for alignment integrity.
- **Snappy Motion Curves**: Micro-interactions rely on spring-like curves (`cubic-bezier(0.16, 1, 0.3, 1)`) with quick 120ms–200ms durations to feel instantaneous and responsive.

---

## 2. Token Hierarchy & Inheritance Model

Field employs a strict 3-tier token inheritance structure:

```
[ Tier 1: Primitive Tokens ]
  - Raw color scales (Obsidian, Cobalt, Amber, etc. 50-950)
  - Geometric scales (spacing 0-24, radii 0-full)
  - Raw typography & timing
          │
          ▼
[ Tier 2: Semantic Tokens ]
  - Mode-mapped roles: surface-base, surface-raised, surface-overlay
  - Interaction roles: accent-primary, accent-hover, accent-subtle
  - Content roles: text-primary, text-secondary, text-tertiary
  - Feedback roles: success, warning, danger, info
          │
          ▼
[ Tier 3: Component Implementation ]
  - Buttons, Inputs, Cards, Overlays resolve directly to Tier 2 tokens
  - Zero hardcoded colors or sizing in component CSS
```

### Overriding Tokens
- **Via CSS Variables**: Simply redefine any `--field-*` variable at the `:root` level or within a container:
  ```css
  .my-custom-panel {
    --field-accent-primary: #10B981;
    --field-radius-md: 4px;
  }
  ```
- **Via ThemeProvider in React**:
  ```tsx
  <ThemeProvider initialTheme={titaniumAmberTheme}>
    <App />
  </ThemeProvider>
  ```

---

## 3. Accessibility & Multi-Platform Standards

1. **WAI-ARIA Compliance**:
   - All interactive controls feature appropriate ARIA roles (`role="switch"`, `role="dialog"`, `role="radiogroup"`, `role="tablist"`).
   - Dialogs, Drawers, and Dropdowns provide automatic keyboard focus traps and close on `Escape`.
2. **Keyboard Navigation & High Visibility**:
   - 2px high-contrast focus rings with 2px offset (`outline: 2px solid var(--field-border-focus)`).
3. **Contrast Ratios**:
   - All text combinations comply with WCAG 2.1 AA (minimum 4.5:1 for normal text, 3:1 for large text). The included High-Contrast theme delivers AAA ratios (>7:1).
4. **Touch & Mobile Readiness**:
   - Touch targets for interactive elements are tuned to at least 38px–46px on mobile devices.
