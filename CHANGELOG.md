# Changelog — Field Design System

All notable changes to the **Field Design System** (`@sam.barfield/field-tokens`, `@sam.barfield/field-react`, and `@field/showcase`) are documented in this file.

## [0.3.1] - 2026-10-07

Fixes and additions from building a complete multi-page marketing site with a custom brand theme.

### Added
- Theme token `accent.text` (`--field-accent-text`): the accent used as text on surfaces (links, `Text tone="accent"`, active nav items, outline buttons). Defaults to `accent.primary`. Lets a brand keep white text on its fill in dark mode while links use a lighter tint.
- `createThemePair({ band })`: a dedicated dark theme for forced-dark bands (`Section backgroundImage`, `tone="inverse"` on a light page), exposed as `pair.band`. Bands previously always used `pair.dark`.
- Theme `typography` (`headingWeight`, `displayWeight`, `headingTracking`, `headingStretch`) for display fonts that need different weight, letter-spacing or width. New CSS variables `--field-heading-weight`, `--field-display-weight`, `--field-heading-tracking`, `--field-heading-stretch`.
- `contrastRatio()`, `checkThemeContrast()` and the `checkContrast` option on `createTheme` / `createThemePair`, which warns about every text / surface pairing below WCAG AA.
- `Navbar collapseBelow` (`sm`–`xl` or px) switches to the toggle and `NavbarMenu` earlier than the built-in 768px, for bars with many top-level items.
- `Card href` / `as`: a whole-card link (defaults to `variant="interactive"`).
- `EmptyState titleAs`, e.g. `h1` on a 404 page.
- `Checkbox error`: shows a message under the checkbox, sets `aria-invalid` and links it with `aria-describedby` (consent boxes no longer need a hand-built error).
- `Grid align` (`align-items`, accepts a breakpoint object), so grids no longer need `style={{ alignItems }}`.

### Changed
- `Select` puts `id` on its focusable trigger (previously `${id}-trigger`), so `<label for>` and error-summary links to `#id` reach it.
- `NavbarFlyoutItem`s inside the mobile `NavbarMenu` render as plain rows (no card border or icon box) and are vertically centred.

### Fixed
- `NavbarFlyout` stayed open after clicking a link inside it (client-side routing), stayed open when keyboard focus moved past it, and left focus on `<body>` after Escape. It now closes in all three cases and Escape returns focus to the trigger.
- `NavbarMenu` closes when any link inside it is clicked, not only `NavbarItem`s.
- Inside `NavbarMenu`, tapping a `NavbarFlyout` whose trigger is a `NavbarItem` closed the whole menu instead of opening the accordion.
- The stylesheet now resets the default `body` margin (zero specificity), so `Navbar`, `Section` and `Footer` bands reach the window edges. Previously every site showed an 8px gap unless it added its own reset (the docs site did, which hid the problem).
- `Section tone="accent"`: secondary text failed WCAG AA on brand fills (4.4:1 on a 5.7:1 red); secondary and tertiary text are now 92% / 88% of the contrast colour. The inverted primary button uses `accent.primary` text, not `accent.text`.
- An active `NavbarItem` used as a flyout trigger in the mobile menu highlights the whole row.
- `BackToTop` covered right-aligned `FooterBottom` links at the end of the page.
- `Stack` with the default `align="stretch"` distorted `img` / `svg` / `video` children with fixed dimensions (e.g. a logo).
- `Badge variant="accent"` text used `accent.hover`; it now uses `accent.text`.
- Docs: the interactive Card example used `role="link"` with `onClick` and no keyboard support; it now uses `href`.

### Fixed (layout)
- Mobile and narrow-container layout fixes, found by a responsive sweep of every docs page at 375, 768, 850 and 1280px:
  - `Stepper` (horizontal): labels overlapped on phones. Below 640px only the active step shows its label (the others stay available to screen readers), and labels truncate in other narrow containers.
  - `UnfoldingHeading`: headings never wrapped and ran off-screen. The container is capped at its parent's width, and the `lg` / `xl` sizes scale down on phones (desktop sizes unchanged).
  - `SegmentedControl`: long labels pushed past narrow containers; the control now scrolls horizontally inside its own box.
  - `TerminalHeader`: custom header actions overlapped the title; they now wrap to a second row and long titles truncate.
  - `Pagination`: in narrow containers rows-per-page gets its own line and page buttons stay on one row.
  - `Slider`: zone marks at either end of the track no longer hang outside the slider.
- Showcase: the header no longer overflows between 769 and 960px; the theme editor stacks below 1024px; example pages and docs examples (navbar, landing page, dashboard, terminal, code block, sticker sheet sidebar) fit at phone width.
- `npm run docs:manifest` normalises Windows line endings, so the generated manifest no longer changes depending on the OS it was built on.
- Docs: Stepper, SegmentedControl, Terminal and UnfoldingHeading pages and `docs/AGENTS.md` describe their narrow-screen behaviour.

## [0.3.0] - 2026-10-06

A review and hardening release focused on correctness, accessibility and developer experience. Most APIs are unchanged; see **Breaking changes** before upgrading.

### Breaking changes
- Packages are now proper ES modules (`"type": "module"`, explicit `.js` import paths). Bundlers are unaffected; Node, Vitest and SSR now load them without extra config.
- `exports` maps are explicit: use `@sam.barfield/field-react/styles.css` (or `styles/components.css`); the old `./styles/*` wildcard is gone.
- Markup changes that may affect custom CSS: `Tabs` root is now `.field-tabs` (the list stays in `.field-tabs-container`); `Stepper` and `Timeline` render `<ol>` / `<li>`; `Modal` / `Drawer` titles are `<h2 class="field-modal-title">`; Switch/Checkbox/Radio use visually hidden native inputs; `Select`, `Combobox`, `DropdownMenu`, `Popover` and date picker popovers render in a portal.
- `ButtonGroup` no longer leaks `attached` to the DOM; `attached={false}` now actually spaces buttons.

### Fixed
- `Table` called hooks after an early return (Rules of Hooks violation); uncontrolled selection with only `onSelectionChange` did not update; string sorting is now locale/numeric aware.
- Modal/Drawer/command palette overlays painted an opaque background over the page (portal roots matched the base `[data-field-theme]` rule).
- Modal/Drawer had no focus trap or focus restore and could unlock page scroll while another overlay was open.
- `Select` options were not keyboard navigable and Escape did not work once open; dropdowns were clipped inside modals and tables.
- `Switch` exposed two `role="switch"` elements and the visible one had no accessible name; `Checkbox` dropped `aria-label`; `RadioGroup` had no arrow-key support.
- `NumberInput` clamped on every keystroke (typing `50` with `min=10` produced `10`) and accumulated floating-point errors.
- `Combobox` had two tab stops and `role="combobox"` on a div; added arrow keys, Backspace to remove chips and Escape.
- `DatePicker` disabled today when `minDate` had a time component, ignored its `style` prop, was controlled-only, and submitted a UTC-shifted date; now uncontrolled-capable, keyboard navigable and submits local `YYYY-MM-DD`.
- Links rendered by `Button`, `IconButton`, `Sidebar*`, `Tabs`, dropdown and context menu items received `type="button"` / `disabled`.
- Elastic navbar indicator stayed pinned to an old position after resizes (`fill: 'both'` animation never released).
- `UnfoldingHeading` fired `onComplete` twice in StrictMode and generated SSR-unsafe random ids.
- `asChild` read `element.ref`, which warns in React 19.
- Light-mode CSS selectors targeted `[data-field-theme='light']` (never set); they now use `[data-theme='light']`.
- `themeToTypeScript` imported from a non-existent package name.
- Elastic navbar indicator only animated between some items: the active item's heavier font weight resized the group and the resize handler cancelled the glide.
- `NavbarFlyout` panels overflowed the navbar / viewport; they now shift sideways and cap their width to stay in bounds.
- `Button` labels with rich content (e.g. avatar + name) had no gap between children.
- Consecutive selected options in `Select` / `Combobox` merged into one block; options now have a small gap.
- `Text` / `Heading` with long unbroken tokens (identifiers, URLs) overflowed their container; they now wrap.
- `TerminalPrompt` submit button had no accessible name and skipped history reset.

### Added
- `createTheme` / `createThemePair` to build themes by overriding only the tokens you need.
- `ThemeProvider` `defaultMode="system"` and `storageKey` (persist the chosen mode); variables are applied before paint.
- Default theme variables ship inside `styles.css`; `@sam.barfield/field-tokens/tokens.css` and `themes/<pair>.css` for JS-free theming; light themes get softer shadows; `--field-ease-in/out/in-out` tokens.
- `'use client'` directives for Next.js App Router.
- `TabPanel`; controlled/uncontrolled support across Accordion, Tabs, Popover, DropdownMenu, RadioGroup, Slider, Switch, Checkbox, Select, TreeView and date pickers.
- Toasts: variants with icons, actions (e.g. Undo), positions, `limit`, replace-by-id, `dismissAll`.
- `Alert` `actions`, `StatCard` `invertTrendColors`, `Progress` indeterminate/variants, `Spinner` label, `Skeleton` `circle`, `Card` `padding`, `Drawer` `side`, `Text` `as`/`mono`/`truncate`/status tones, `Heading` `as`, layout `padding`/`as`/`$` spacing tokens, `Grid` `minChildWidth`, `Table` `onRowClick`/`density`/`stickyHeader`/`manualSorting`/controlled sorting, `CommandPalette` `keywords`, `DateRangePicker` `presets`/`minDate`/`maxDate`, `CopyButton` `iconOnly` and insecure-origin fallback.
- Pluggable syntax highlighting for `CodeBlock`: a `highlighter` prop and `CodeHighlighterProvider` render `field-token-*` classes coloured by theme tokens (the docs use Prism via `prism-react-renderer`).
- `Pagination` `variant="simple"` (prev/next with a page status) and `showFirstLast`.
- Website building blocks: `Section` (page bands with tones, fluid spacing, background images), `Footer` (`FooterBrand`, `FooterColumn`, `FooterLink`, `FooterBottom`), `Image`, `AspectRatio`, `Gallery` + `Lightbox`, `Carousel` (`CarouselSlide`), `Link`, `Prose`, `CookieConsent` + `useCookieConsent`, `SkipLink`, `BackToTop` and `Reveal`.
- Responsive props: layout props on `Flex`, `Stack`, `Grid`, `Box`, `Container` and `align` on `Heading` / `Text` accept breakpoint objects (`{ base, sm, md, lg, xl }`); `hideBelow` / `hideFrom`; `breakpoints`, `useMediaQuery`, `usePrefersReducedMotion`. `Container maxWidth` presets (`sm`…`xl`, `prose`).
- Display type: `Heading display="sm" | "md" | "lg" | "xl"` (fluid), `Text size="xl"` and `align`. Headings now use `--field-font-display` and balance their lines.
- Website theme presets (light-first, with fonts): `roasteryPair` (cafés), `workshopPair` (trades), `storefrontPair` (e-commerce), `sagePair` (wellness), `counselPair` (professional); `businessThemePairs`. Themes and `createTheme` / `createThemePair` accept `fonts`.
- `ThemeScope` forwards HTML attributes (`id`, `aria-*`, …) to its element.
- `Terminal` `variant="minimal"` for flat embedded consoles; `TerminalHeader` `icon={null}`, `TerminalLine` `showBadge`, `TerminalPrompt` `prompt` and `showSubmitButton`.
- Full keyboard support: menus (arrows, Home/End, type-ahead), TreeView (WAI-ARIA tree), calendar grid, tabs, segmented control, context menu (Shift+F10).

### Docs & tooling
- New "Website" docs category (Section, Page sections recipes, Footer, media, Carousel, Link, Prose, Cookie consent, site utilities), a "Building a website" guide, website themes in the theme picker, and a "Business Website" example that switches between the five presets.
- `docs/COMPONENT_MANIFEST.json` is now generated from the TypeScript source and JSDoc (`npm run docs:manifest`); every prop is documented.
- Rebuilt showcase as a docs site: getting-started and topic guides (installation, theming, styling & Tailwind, routing, forms, accessibility, SSR, AI assistants), and a page per component with live examples whose code is the real source, generated API tables, usage guidance, accessibility and keyboard reference.
- Rewrote `docs/AGENTS.md` (removed non-existent Sidebar props from recipes), `README.md`, `CLAUDE.md` and the component lifecycle rule.

## [0.2.7] - 2026-09-22

### Top Navigation (`Navbar`) & Fluid Motion Engine
- **New Component Suite `<Navbar>`**:
  - Added full compound Top Navigation suite: `Navbar`, `NavbarBrand`, `NavbarContent`, `NavbarItem`, `NavbarFlyout`, `NavbarFlyoutGrid`, `NavbarFlyoutItem`, `NavbarActions`, `NavbarToggle`, and `NavbarMenu`.
  - Built-in `NavbarContext` (`useNavbar`) for managing responsive mobile menu drawer state.
  - Supports `floating` (floating detached island navbar with rounded pill borders), `sticky`, `blurred` (12px backdrop blur), `bordered`, `density` (`default` | `compact`), and container `maxWidth`.
  - **Togglable Shadow Elevation**: Configurable `shadow?: 'none' | 'sm' | 'md' | 'lg' | boolean` utilizing design token surface elevations.
  - **Scroll-Aware Dynamics**: Integrated `scrollBehavior="elevate" | "shrink" | "blur"` and `transparentOnTop` morphing dynamically as the user scrolls.
  - **High-Polish Animated Gliders**:
    - `NavbarContent variant="underline"`: Smooth Cobalt accent glider sliding beneath the active nav link with optional specular glow (`glow?: boolean`).
    - `NavbarContent variant="elastic"`: Continuous 40-step fluid boundary-impact glider powered by native Web Animations API. Features in-flight stream stretching, viscous trailing lag, boundary-wall impact compression ($\approx 52\%$ width compaction against destination barrier), fluid volume conservation (`scaleY` splash surge), and damped surface tension rebound.
    - `NavbarContent variant="pill"`: Floating translucent magnetic capsule glider smoothly gliding between active destinations.
    - `NavbarContent variant="rail"`: Encapsulated sunken dock rail with elevated active indicator.
    - **Magnetic Hover Spotlight (`hoverGlider`)**: Magnetic follower spotlight that previews hover states seamlessly.
  - **Customizable Indicator Dimensions**:
    - `indicatorWidth` / `underlineWidth`: Supports `'full'` (default), `'content'` (snug text fit subtracting item padding), percentage insets (e.g. `'70%'`), and fixed pixels (e.g. `36px`).
    - `indicatorThickness` / `underlineThickness`: Configurable stroke height (e.g. `2`, `3`, `4px`).
    - Supported globally on `<NavbarContent>` and as per-tab overrides on `<NavbarItem>`.
  - **Architectural Megamenu Flyout Suite**:
    - `NavbarFlyout`: Anchored popover megamenu on desktop with click-outside and escape-key handling, custom alignment (`start` | `center` | `end`), and customizable width.
    - **Mobile Drawer Accordion Mode**: Automatically detects `NavbarMenuContext` inside mobile drawers and adapts into an inline collapsible accordion with a $180^\circ$ rotating chevron and single-column stacked cards.
    - Accessible trigger architecture preventing redundant nested interactive button semantics.
    - `NavbarFlyoutGrid`: Multi-column layout grid for technical capabilities.
    - `NavbarFlyoutItem`: High-polish service card with icon receptacle, title, badge indicator, description, and polymorphic routing.
  - First-class polymorphic client-side router support (`asChild`, `as`, `href`) on `NavbarBrand`, `NavbarItem`, and `NavbarFlyoutItem`.
  - Dedicated token-based CSS classes in `field.css` with zero raw color hexes or hardcoded spacing.
- **Agent Guidelines & Lifecycle Enforcement**:
  - Added root-level `GEMINI.md` and `CLAUDE.md` providing instant component matrices and shell architecture guides for AI assistants.
  - Added `.agents/rules/component-lifecycle.md` enforcing the mandatory 7-step component checklist whenever components are added or modified.
- **Showcase & Manifest**:
  - Registered all `Navbar` components, props, and types in `docs/COMPONENT_MANIFEST.json`.
  - Updated showcase `Header.tsx` to dogfood `<Navbar>`, `<NavbarBrand>`, `<NavbarContent variant="underline" animated>`, and `<NavbarActions>`.
  - Built comprehensive interactive catalog demo in `catalogRegistry.tsx` featuring live toggles for full-width vs floating island, glider styles (underline/elastic/pill/rail), underline width (full/content/70%/36px), thickness (2/3/4px), shadow elevation levels, glow aura, hover spotlight, density, and live digital services megamenu.

## [0.2.6] - 2026-09-21

### Quality Assurance & Animation Engine Hardening
- **UnfoldingHeading Architecture**:
  - Unified character folding mechanism, eliminating legacy origami/scorecard split in favour of a responsive, unified folding glyph engine.
  - Eliminated infinite re-render loops by persisting `onComplete` in mutable refs.
  - Stabilized animation lifecycle against arbitrary parent re-renders by decoupling character parsing from render-time mutation.
  - Hardened unmount and timer cleanups across sequence timeouts and intersection observers.
  - Scoped CSS variables (`--field-unfold-speed`, `--field-unfold-color`, etc.) and cleaned up global CSS leaks.
  - Added strict accessibility attributes (`aria-label`, `aria-hidden`) ensuring screen readers read unbroken textual copy.
- **Showcase Integration**:
  - Integrated full Landing Page Demo into the Live Composites tab suite.
  - Updated component docs, interactive demos, and machine-readable manifests.

---

## [0.2.4] - 2026-09-06

### Summary of Enhancements
This release implements the architecture improvements and targeted developer ergonomics outlined in the `design_system_enhancements_rfc.md` across `@sam.barfield/field-tokens` and `@sam.barfield/field-react`, extending all enhancements consistently across the entire component library.

#### 1. Tailwind CSS v4 Theme Integration & CSS Variable Scoping
- **Tailwind v4 `@theme` Configuration**: Added `packages/tokens/src/tailwind.css` exporting all Field design tokens as standard Tailwind CSS variables (`--color-surface-*`, `--color-border-*`, `--color-text-*`, `--color-accent-*`, `--color-status-*`, `--radius-*`, `--shadow-*`, `--font-*`).
- **Export & Build**: Configured package export `"@sam.barfield/field-tokens/tailwind.css"` and automated copy to `dist/tailwind.css` during package build.
- **Strictly Scoped Focus Ring Reset**: Replaced global `*:focus-visible` reset with scoped selectors (`.field-scope :is(...)`, `[data-field-theme] :is(...)`, `.field-focus-ring:focus-visible`), eliminating style bleed when consumed in applications alongside Tailwind or unstyled components.

#### 2. Client-Side Router Polymorphism (`asChild`, `as`, `href`)
- **Polymorphic Slot Utility**: Implemented `renderPolymorphic` helper supporting `asChild` (cloning child element while merging `className`, `style`, and event handlers like `onClick`), custom element types via `as`, and default element rendering.
- **Components Extended**:
  - `DropdownItem`: Full router polymorphism (`asChild`, `as`, `href`).
  - `SidebarItem` & `SidebarSubItem`: Full router polymorphism (`asChild`, `as`).
  - `BreadcrumbItem`: Full router polymorphism (`asChild`, `as`), with `label` prop updated to `React.ReactNode` for rendering rich content or icons.
  - `Button` & `IconButton`: Full router polymorphism (`asChild`, `as`, `href`) with `forwardRef` preservation.
  - `Tabs` (`TabItem`): Router polymorphism (`asChild`, `as`, `href`).
  - `ContextMenu` (`ContextMenuItem`): Router polymorphism (`asChild`, `as`, `href`).

#### 3. Container-Level Theme Scoping & Unmount Cleanup
- **`ThemeProvider` Unmount Cleanup**: Added cleanup handler stripping `--field-*` properties, `data-field-theme`, `data-theme`, and `colorScheme` from `document.documentElement` when the provider unmounts, preventing ghost styles from polluting adjacent routes.
- **Container Scoping (`scope="container"`)**: Added `scope?: 'root' | 'container'`, `as?: React.ElementType`, `className`, and `style` to `ThemeProviderProps`. Renders a styled wrapper element with class `.field-scope` and localized CSS variables without touching `:root`.
- **`<ThemeScope>` Component**: Exported convenient `<ThemeScope theme={...} as="div">` container primitive.
- **`useThemeSafe()` Hook**: Safe hook returning active theme or falling back to `darkTheme` without throwing when called outside `<ThemeProvider>`.

#### 4. Form Library & Native Form Submission Integration
- **`forwardRef` & Native Form Fields**:
  - `Checkbox`: Wrapped with `forwardRef<HTMLInputElement>`, added `name`, `id`, `value`, `required`, `onBlur`, and rendered visually hidden native checkbox input for seamless integration with `react-hook-form`, Formik, and native `FormData`.
  - `Switch`: Wrapped with `forwardRef<HTMLInputElement>`, added `name`, `id`, `value`, `required`, `onBlur`, and rendered visually hidden native checkbox input.
  - `Select`: Wrapped with `forwardRef<HTMLSelectElement>` with generic type safety, added `name`, `id`, `required`, `onBlur`, and rendered hidden form input with selected value.
  - `RadioGroup`: Added `name`, `required`, and hidden native radio inputs for each option.
  - `Slider`: Added `name`, `id`, `required` props and native `<input type="range">`.
  - `NumberInput`: Added `name`, `id`, `required`, `onBlur` props and native `<input type="number">`.
  - `Combobox`: Added `name`, `id`, `required` props and hidden inputs for selected values.
  - `DatePicker` & `DateRangePicker`: Added `name`, `id`, `required` props and hidden ISO date inputs.

#### 5. Portaled Overlays Theme Inheritance & Scoped Mounting
- **Targeted Container Mounting**: Added `container?: HTMLElement | null` prop to portaled overlays (`Modal`, `Drawer`, `ToastProvider`, `ContextMenu`, `CommandPalette`, `Tooltip`, `DatePicker`, `DateRangePicker`).
- **Theme Data Attributes**: Portaled overlay wrappers now automatically inherit theme context via `.field-scope`, `data-field-theme`, and `data-theme`, guaranteeing dark/light contrast and accent styling inside scoped portals without manual CSS variable forwarding.

#### 6. Table Alignment & Asynchronous Loading States
- **Column & Cell Alignment**: Added `align?: 'left' | 'center' | 'right'` to `Column<T>`, `TableHeadProps`, and `TableCellProps`. Automatically aligns header text and sort button (`justifyContent`), and body cell content.
- **Table Loading Skeleton**: Added `isLoading?: boolean` to `TableProps`. When `true`, renders 5 skeleton rows matching columns and alignment.
- **StatCard Loading Skeleton**: Added `isLoading?: boolean` to `StatCardProps`. When `true`, renders structured `<Skeleton>` placeholders in place of metric value and delta.

---

## [0.2.3] - 2026-09-05

### Mobile Polish & Responsive Improvements
- Fixed responsive padding and mobile overflow behaviors in showcase layouts, dialogs, and component demo sheets.
- Updated version references across packages.

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
