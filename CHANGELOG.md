# Changelog — Field Design System

All notable changes to the **Field Design System** (`@sam.barfield/field-tokens`, `@sam.barfield/field-react`, and `@field/showcase`) are documented in this file.

---

## [0.2.2] - 2026-09-04

### Component Library Documentation Redesign (Shadcn Style)
- **Shadcn-Style Documentation Architecture**: Completely redesigned the Component Catalog in `@field/showcase` to match the layout and interactive conventions of shadcn/ui.
- **Left Navigation Sidebar**: Real-time fuzzy search filtering, categorized and alphabetical component directory, and active item indicators with pill styling.
- **Header & Navigation Bar**: Component title, category badge, one-line summary, `Copy Page` markdown action, and sequential `Prev`/`Next` pagination controls.
- **Hero Interactive Preview**: Centered render canvas with interactive controls, subtle radial grid background, and a bottom code preview drawer with centered `View Code` / `Collapse Code` toggle and instant copy action.
- **Usage & Composition**: Standardized import snippets and monospace hierarchical ASCII component anatomy diagrams.
- **In-Depth Variants**: Dedicated variant sections (Basic, Destructive, Warning, Sizes, States, etc.) with individual live preview cards and code drawers.
- **Props & Guidelines**: Exhaustive props specification tables, keyboard navigation interactions, and accessibility implementation notes.
- **Hook Isolation & Remounting**: Enforced React JSX component mounting (`<PrimaryDemo />`, `<VariantDemo />`) to decouple hook execution and keyed `ComponentDocView` on component ID to cleanly reset state across transitions.

## [0.2.1] - 2026-09-04

### Summary of Upstream Fixes
This release addresses feedback and bug reports identified during integration testing in `upstream_field_fixes.md`:

#### 1. Badge Text Optical Vertical Centering & Sizing
- **Problem**: Text inside `.field-badge` sat noticeably closer to the bottom border due to `line-height: 1` font metric clamping and symmetric vertical padding. Consumers also lacked a `size` prop for compact or prominent badges.
- **Fix**: Updated `.field-badge` with optical vertical padding (`0.14rem 0.55rem 0.22rem 0.55rem`) and `line-height: 1.1`. Added `size?: 'sm' | 'md' | 'lg'` prop to `BadgeProps` with corresponding CSS classes (`.field-badge-sm`, `.field-badge-md`, `.field-badge-lg`) and proportional status dot sizing.

#### 2. Breadcrumb `onClick` Support Without `href`
- **Problem**: `Breadcrumb` items omitting `href` fell into a static branch that discarded `onClick`, breaking client-side SPA navigation unless a dummy `href="#"` was supplied. Non-current static items were also incorrectly given interactive link styling.
- **Fix**: Enabled interactive behavior whenever `href` OR `onClick` is defined. Rendered proper `role="button"` when `href` is absent, and assigned `.field-breadcrumb-static` to non-interactive, non-current items.

#### 3. Accordion Title Custom Flex Layout Support
- **Problem**: Passing custom flex JSX titles (e.g. `<Flex justify="space-between"><span>Title</span><span>Timestamp</span></Flex>`) resulted in right-aligned metadata colliding directly against the title with zero gap because the title was wrapped in an unexpanded inline `<span>`.
- **Fix**: Added `flex: 1`, `minWidth: 0`, and `display: block` to the accordion trigger title wrapper, allowing custom child flex containers to expand fully across the header.

#### 4. DateRangePicker Backward Selection Hover Preview
- **Problem**: In `DateRangePicker`, selecting a start date and hovering backward over past dates displayed no range highlight preview because `inHoverRange` strictly checked `hoverDate > value.start`.
- **Fix**: Updated hover range logic to support bidirectional selection (`isBetween(item.date, hoverDate, value.start)` when `hoverDate < value.start`).

#### 5. Stepper Number & Check Circles Distortion
- **Problem**: In `<Stepper>`, `.field-step-circle` squished into oval capsules when step titles or descriptions contained longer text due to missing `flex-shrink: 0`.
- **Fix**: Added `min-width: 28px`, `min-height: 28px`, and `flex-shrink: 0` to `.field-step-circle`, and `min-width: 0` to `.field-step-label-group`.

#### 6. Collapsed Sidebar Trigger White Compositing Blip
- **Problem**: Clicking the trigger to collapse/expand the sidebar caused a brief white/cyan flash in Chromium browsers due to user-agent `:focus-visible` styling and unaccelerated width transitions.
- **Fix**: Added explicit `outline: none` and styled `:focus-visible` rings on `.field-sidebar-trigger`, and added `will-change: width, min-width` and `contain: layout style` to `.field-sidebar`.

#### 7. Tabs Container Scrollbar Affordance
- **Problem**: When `<Tabs>` overflowed its container (e.g. within drawers or cards), scrollbars were completely hidden with `scrollbar-width: none;` and `display: none;`, leaving no visual affordance that more tabs existed.
- **Fix**: Replaced hidden scrollbars with subtle, thin scrollbars (`scrollbar-width: thin; height: 3px;`) with smooth scrolling and theme-aware scrollbar track/thumb styling.

#### 8. Collapsed Sidebar Footer Layout & `collapsedChildren`
- **Problem**: When `<Sidebar collapsed={true}>`, multi-element or spaced footer layouts pushed icons to opposite edges.
- **Fix**: Centered collapsed footer content in CSS and added `collapsedChildren?: React.ReactNode` to `SidebarFooterProps` so consumers can pass a dedicated compact layout for the collapsed state.

#### 9. Standalone `SidebarTrigger` & `SidebarProvider` Architecture
- **Problem**: `<SidebarTrigger>` threw an unhandled runtime error if rendered outside of `<Sidebar>` (e.g. inside an app top bar or header).
- **Fix**: Upgraded `useSidebar()` to return a safe fallback object `{ collapsed: false, setCollapsed: () => {}, toggleCollapsed: () => {} }` when called outside context. Added `isCollapsed?: boolean` and `onToggle?: () => void` props to `SidebarTrigger` for standalone controlled usage, and exported `SidebarProvider` from `@sam.barfield/field-react` for global shell layouts.

#### 10. Living Sticker Sheet Expansion
- **Update**: Expanded `StickerSheet` with full visual coverage of all 84 Field components and primitives across 5 dedicated sections (Core Actions & Inputs, Navigation & Indicators, Data Display & Feedback, Complex Structures & Layouts, Theming & Token Surfaces).

#### 11. Desktop Viewport Responsiveness & Layout Polish
- **Fix**: Added flex wrapping to action rows in `Alerts & Progress` to eliminate horizontal clipping. Refined Stepper CSS (`.field-step-item` as `flex: 0 0 auto`, `.field-step-line` with dynamic space absorption) and horizontal scroll protection. Decoupled `Timeline` and `TreeView` from a cramped 2-column grid into full-width dedicated cards.

#### 12. Automated GitLab Pages Showcase Deployment
- **Feature**: Added GitLab Pages CI pipeline job (`pages`) in `.gitlab-ci.yml` building and deploying `@field/showcase` with base-path awareness and SPA fallback routing (`404.html`).

#### 13. Documentation & Agent Specification Alignment
- **Update**: Synchronized `docs/AGENTS.md` with all exported components (`SidebarProvider`, `SidebarTrigger`, `useSidebar`), Recipe G for collapsible shells, and new prop guidelines (`Badge` size, `Breadcrumb` onClick, `SidebarFooter` collapsedChildren). Upgraded `docs/COMPONENT_MANIFEST.json` to v0.2.0 covering all 84 components. Aligned `README.md` and `DocsViewer.tsx` to `@sam.barfield/field-react` and `@sam.barfield/field-tokens`.

---

## [0.2.0] - 2026-09-03

### Summary of Major Evolutions
This release addresses all critical bugs, style regressions, agent documentation discrepancies, and architecture maintainability concerns outlined in the *Field Design System Master Report*, and delivers Phase 1 & 2 of the roadmap components, paired theming architecture, and developer primitives.

---

### 1. Token & Styling Bug Fixes

#### 1.1 Alert Semantic Color Disconnect
- **Problem**: Alert components previously hardcoded blue, green, amber, and red RGBA values directly in `.field-alert-*` CSS selectors, bypassing the theme compiler tokens. In custom themes (e.g. `titaniumAmberTheme`), alerts appeared with mismatched default cyan accents.
- **Fix**: Refactored `.field-alert-info`, `.field-alert-success`, `.field-alert-warning`, and `.field-alert-danger` in `field.css` to use CSS variables:
  - `var(--field-status-info-surface)` and `var(--field-status-info-border)`
  - `var(--field-status-success-surface)` and `var(--field-status-success-border)`
  - `var(--field-status-warning-surface)` and `var(--field-status-warning-border)`
  - `var(--field-status-danger-surface)` and `var(--field-status-danger-border)`

#### 1.2 Danger Button Hardcoded Hex Values
- **Problem**: `.field-btn-danger` contained hardcoded `#B91C1C` and `#FCA5A5` color hexes instead of using semantic danger status variables.
- **Fix**: Replaced all hardcoded hexes with semantic CSS variables:
  - `var(--field-status-danger-surface)`
  - `var(--field-status-danger-text)`
  - `var(--field-status-danger-border)`
  - `var(--field-status-danger-base)`

#### 1.3 Primary Button Specular Highlight Inversion
- **Problem**: `.field-btn-primary` used hardcoded `rgba(255, 255, 255, 0.22)` for top specular highlights. In light mode, this caused dark buttons to retain white glare or washed-out appearance.
- **Fix**: Linked the button highlight to `var(--field-border-highlight)`, which dynamically inverts between dark and light themes.

#### 1.4 Checkbox Icon High-Contrast Color
- **Problem**: `.field-checkbox` hardcoded `#FFFFFF` for the checkmark SVG stroke, rendering it invisible in themes that define bright amber or yellow accent fills with black contrast text.
- **Fix**: Updated icon stroke to `var(--field-accent-contrast, #FFFFFF)`.

#### 1.5 Active Accent Badge Hardcoded Cobalt Border
- **Problem**: `.field-badge-accent` hardcoded `border-color: rgba(37, 99, 235, 0.25);` (Cobalt blue). When viewing themes with amber, emerald, violet, or custom accents, the badge text and status dot were amber/emerald, but the border remained a jarring cobalt blue.
- **Fix**: Added `--field-accent-border` to the token compiler and refactored `.field-badge-accent` to use `border-color: var(--field-accent-border, color-mix(in srgb, var(--field-accent-primary) 28%, transparent));`. Also cleaned up hardcoded RGBA values in terminal badge indicators.

---

### 2. Architecture & Maintainability Fixes

#### 2.1 Paired Themes Architecture (`FieldThemePair`)
- **Problem**: Calling `toggleMode()` on `ThemeProvider` previously discarded active custom themes (such as `titaniumAmber` or `emeraldPrecision`) and fell back unconditionally to default cobalt dark/light.
- **Fix**:
  - Introduced `FieldThemePair` interface in `@sam.barfield/field-tokens`.
  - Added light-mode counterparts `titaniumAmberLightTheme` and `emeraldPrecisionLightTheme`.
  - Added preset pairs: `cobaltThemePair`, `titaniumAmberPair`, `emeraldPrecisionPair`, `defaultThemePair`, and `themePairs` registry.
  - Enhanced `ThemeProvider` with `themePair` prop, `setThemePair()` API, and automatic pair-aware `toggleMode()` that preserves the active theme identity across dark and light toggles.

#### 2.2 Portal Isolation for Overlays
- **Problem**: `Modal` and `Drawer` components rendered directly inside the DOM hierarchy where declared, causing them to be clipped or trapped by parent containers with `overflow: hidden`, `z-index`, or `transform` CSS properties.
- **Fix**: Wrapped `Modal`, `Drawer`, `ToastProvider`, `ContextMenu`, and `CommandPalette` in `createPortal(..., document.body)` with SSR guards (`typeof document !== 'undefined'`).

#### 2.3 Elimination of Imperative DOM Style Mutations
- **Problem**: `Select.tsx` directly mutated DOM element styles in `onMouseEnter` and `onMouseLeave` handlers (`e.currentTarget.style.backgroundColor = ...`).
- **Fix**: Completely eliminated imperative DOM mutations. Replaced with declarative CSS classes (`.field-select-trigger`, `.field-select-dropdown`, `.field-select-option`) with proper CSS `:hover` pseudo-classes and keyboard focus rings.

#### 2.4 Reusable CSS Classes Over Inline Styles
- **Problem**: Hundreds of lines of inline styles were duplicated across `RadioGroup`, `Breadcrumb`, `StatCard`, and `ToastProvider`.
- **Fix**: Refactored each component to consume standardized CSS classes in `field.css`:
  - `.field-radio-*`
  - `.field-breadcrumb-*`
  - `.field-stat-card-*`
  - `.field-toast-*`

---

### 3. Core Component Evolutions

#### 3.1 Compound & Data-Driven Table + Pagination
- **Problem**: `AGENTS.md` and AI coding assistants frequently hallucinated compound subcomponents (`<TableHeader>`, `<TableBody>`, `<TableRow>`, `<TableCell>`, `<TableHead>`), while `<Table>` lacked sorting, selection, and pagination.
- **Fix**:
  - Exported compound primitives: `TableHeader`, `TableBody`, `TableRow`, `TableCell`, `TableHead`.
  - Upgraded `<Table>` to seamlessly accept either compound children or structured `columns` + `data` props.
  - Added interactive column sorting with ASC/DESC indicators.
  - Added row selection with indeterminate header checkbox and floating bulk actions bar.
  - Added expandable nested sub-rows with chevron indicators.
  - Added standalone `<Pagination>` component with rows-per-page selector and first/prev/next/last navigators.

#### 3.2 Actions & Context Menus
- **New Component `<DropdownMenu>`**: Added accessible trigger-anchored dropdowns with `<DropdownGroup>`, `<DropdownItem>`, `<DropdownDivider>`, `<DropdownLabel>`, support for danger variants, icons, and click-outside/Escape dismissal.
- **New Component `<ContextMenu>`**: Right-click context trigger rendering cursor-anchored contextual action menus.

#### 3.3 Overlays & Omnibar
- **New Component `<CommandPalette>`**: Global ⌘K / Ctrl+K omnibar modal with real-time fuzzy search, keyboard navigation (Arrow keys + Enter), grouped categories, and shortcut badges.
- **New Component `<Popover>`**: Anchor-positioned floating interactive card with alignment controls (`start`, `center`, `end`, `bottom`, `top`) and outside-click dismissal.

#### 3.4 Data Display Primitives
- **New Component `<EmptyState>`**: Standard zero-data visual indicator with customizable icon, title, description, and action button.
- **New Component `<TreeView>`**: Collapsible tree explorer for directory structures, S3 bucket hierarchies, and cloud resources.
- **New Component `<Stepper>`**: Multi-step workflow wizard progress bar with active, completed, and clickable steps.
- **New Component `<Timeline>`**: Chronological audit and deployment feed with status-coded markers and timestamps.

#### 3.5 Developer & Telemetry Primitives
- **New Component `<CodeBlock>`**: Monospace code snippet renderer with line numbers, line highlights, copy button, and max-height scrolling.
- **New Component `<DiffViewer>`**: Unified diff viewer displaying line additions and deletions.
- **New Component `<CopyButton>`**: Clipboard copy micro-component with visual checkmark feedback.
- **New Component `<StatusDot>`**: Telemetry status dot with pulsing animation (`pulse={true}`) for live infrastructure.
- **New Component `<Sparkline>`**: Lightweight SVG trend line with optional filled gradient, integrated into `<StatCard>`.
- **New Component `<Meter>`**: Capacity and quota gauge with automatic warning/danger threshold color shifts.

#### 3.6 Advanced Form Controls
- **New Component `<Combobox>`**: Searchable multi-select input with removable tag chips and dropdown option toggling.
- **New Component `<NumberInput>`**: Numeric stepper with increment/decrement buttons, ArrowUp/Down stepping, clamped min/max values, and unit suffixes (e.g. `MiB`, `ms`).

---

### 4. Platform & Tooling Integration

#### 4.1 Tailwind CSS Integration
- **`fieldTailwindPreset`**: Added Tailwind configuration preset in `@sam.barfield/field-tokens/tailwind` mapping all Field CSS variables directly to Tailwind utility classes (`bg-field-surface-base`, `text-field-accent-primary`, `rounded-field-sm`, etc.).

#### 4.2 AI Agent Alignment (`docs/AGENTS.md`)
- Clarified package scopes: `@sam.barfield/field-react` and `@sam.barfield/field-tokens`.
- Documented both compound and data-driven Table recipes.
- Added comprehensive import references and code recipes for all new components.

#### 4.3 Component Manifest (`docs/COMPONENT_MANIFEST.json`)
- Updated Table component schema and added full JSON schemas for all new components and props.

#### 4.4 Showcase Application (`apps/showcase`)
- Integrated all new components into the interactive component catalog with interactive live demos and import copy actions.
- Verified TypeScript compilation and Vite production build across all workspaces.

---

### 5. Verification Matrix
- `@sam.barfield/field-tokens`: `npm run typecheck` passed (0 errors), `npm run build` passed.
- `@sam.barfield/field-react`: `npm run typecheck` passed (0 errors), `npm run build` passed.
- `@field/showcase`: `npm run typecheck` passed (0 errors), `npm run build` (Vite) passed (0 errors).
