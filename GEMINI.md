# GEMINI.md — Field Design System Agent Reference & Guidelines

Welcome to the **Field Design System** repository. This document is the primary, always-loaded context reference for Google Gemini, Antigravity, and DeepMind coding agents.

---

## 1. Monorepo Architecture & Packages

```
field-design-system/
├── packages/
│   ├── tokens/          # @sam.barfield/field-tokens — Core design tokens, CSS variables, themes
│   └── react/           # @sam.barfield/field-react  — Production React UI component library
├── apps/
│   └── showcase/        # @field/showcase            — Docs site: guides, component pages, sticker sheet, theme editor
├── docs/
│   ├── AGENTS.md        # Extended code recipes & usage patterns
│   ├── COMPONENT_MANIFEST.json # Generated component props & types registry (npm run docs:manifest)
│   └── DESIGN_PHILOSOPHY.md    # Contrast, tokens, motion, and accessibility foundations
└── .agents/rules/
    └── component-lifecycle.md  # Checklist for component additions/changes
```

### Essential Commands
- **Typecheck everything**: `npm run typecheck`
- **Build all packages**: `npm run build`
- **Run docs site dev server**: `npm run dev`
- **Regenerate component manifest**: `npm run docs:manifest`

---

## 2. Complete Component Inventory Matrix

Field provides 100+ exported components. Full props: `docs/COMPONENT_MANIFEST.json` (generated; run `npm run docs:manifest`).

| Category | Components Available in `@sam.barfield/field-react` |
|:---|:---|
| **Navigation & Shell** | `Navbar` (`NavbarBrand`, `NavbarContent`, `NavbarItem`, `NavbarFlyout`, `NavbarFlyoutGrid`, `NavbarFlyoutItem`, `NavbarActions`, `NavbarToggle`, `NavbarMenu`), `Sidebar` (`SidebarHeader`, `SidebarContent`, `SidebarGroup`, `SidebarItem`, `SidebarDropdown`, `SidebarSubItem`, `SidebarFooter`, `SidebarTrigger`, `SidebarProvider`, `useSidebar`), `Tabs` (`TabPanel`), `Breadcrumb`, `Pagination`, `Stepper`, `Timeline` |
| **Actions & Buttons** | `Button`, `IconButton`, `ButtonGroup`, `SegmentedControl`, `DropdownMenu` (`DropdownGroup`, `DropdownItem`, `DropdownDivider`, `DropdownLabel`), `CopyButton` |
| **Forms & Inputs** | `TextInput`, `TextArea`, `Select`, `Combobox`, `NumberInput`, `Switch`, `Checkbox`, `RadioGroup`, `Slider`, `DatePicker`, `DateRangePicker` |
| **Layout & Primitives** | `Box`, `Flex`, `Stack`, `Grid`, `Container`, `Divider` (layout props accept breakpoint objects; `breakpoints`, `useMediaQuery`) |
| **Website** | `Section`, `Footer` (`FooterBrand`, `FooterColumn`, `FooterLink`, `FooterBottom`), `Image`, `AspectRatio`, `Gallery`, `Lightbox`, `Carousel` (`CarouselSlide`), `Link`, `Prose`, `CookieConsent` (`useCookieConsent`), `SkipLink`, `BackToTop`, `Reveal`; website theme presets `businessThemePairs` |
| **Data Display & Code** | `Card` (`CardHeader`, `CardContent`, `CardFooter`), `StatCard`, `Table` (`TableHeader`, `TableBody`, `TableRow`, `TableCell`, `TableHead`), `Terminal` (`TerminalHeader`, `TerminalBody`, `TerminalLine`, `TerminalPrompt`), `CodeBlock`, `DiffViewer`, `Sparkline`, `Meter`, `StatusDot`, `TreeView`, `EmptyState` |
| **Feedback & Overlays** | `Modal`, `Drawer`, `Popover`, `ContextMenu`, `CommandPalette`, `Alert`, `ToastProvider` (`useToast`), `Tooltip`, `Progress`, `Spinner`, `Skeleton`, `Accordion` |
| **Typography & Indicators** | `Heading`, `UnfoldingHeading`, `Text`, `Badge`, `Avatar`, `AvatarGroup`, `Kbd`, `Code` |

---

## 3. Application Shell Architecture (Negative Map & Guides)

When asked about application navigation or shell layouts:

1. **Top Navigation (`Navbar`)**:
   - Use the **`Navbar` compound suite** (`<Navbar>`, `<NavbarBrand>`, `<NavbarContent>`, `<NavbarItem>`, `<NavbarActions>`, `<NavbarToggle>`, `<NavbarMenu>`).
   - Supports `sticky`, `blurred` (backdrop filter), `bordered`, `density="default" | "compact"`, and responsive mobile drawer.
   - Many top-level items: `collapseBelow="lg"` (or px) collapses to `NavbarToggle` + `NavbarMenu` earlier than 768px; put desktop links in `<NavbarContent hideOnMobile>`. `NavbarFlyout` closes itself on link click, focus-out, outside click and Escape.
   - High-polish animated variants via `<Navbar variant="underline" | "elastic" | "pill" | "rail" | "ghost" animated glow>`:
     - `variant="underline"` (default): Flush accent bottom glider smoothly transitioning between active items.
     - `variant="elastic"`: Organic spring-physics squash-and-stretch bouncing underline that deforms dynamically across tab transitions.
     - `variant="pill"`: Floating translucent magnetic capsule glider with neon glow.
     - `variant="rail"`: Encapsulated sunken dock rail with elevated active pill.
     - `variant="ghost"`: Minimalist subtle tinted background highlight with accent text color.
2. **Side Navigation (`Sidebar`)**:
   - Use the **`Sidebar` compound suite** (`<Sidebar>`, `<SidebarHeader>`, `<SidebarContent>`, `<SidebarGroup>`, `<SidebarItem>`, `<SidebarDropdown>`, `<SidebarFooter>`, `<SidebarTrigger>`).
   - Supports collapsible docking, compact density, hierarchy lines, and tooltips.
3. **Hybrid Shell (Top Nav + Sidebar)**:
   - Place `<Navbar>` at the top containing a `<SidebarTrigger />`.
   - Place `<Sidebar>` below in a flex row layout alongside the `<main>` content container.
4. **Horizontal Section Tabs**:
   - Use `Tabs` with `items={...}` for page-level tabbed navigation.

---

## 4. Golden Rules for Agents

1. **NEVER hardcode raw hex colors or arbitrary pixel margins/paddings.** Always use `--field-*` variables.
2. **Always wrap root trees with `<ThemeProvider>` and import styles**:
   ```tsx
   import '@sam.barfield/field-react/styles.css';
   import { ThemeProvider } from '@sam.barfield/field-react';
   ```
3. **Use compound and polymorphic patterns**:
   - Support `asChild`, `as`, and `href` on interactive items so router links (`<Link>`) work without full-page reloads.
4. **Value-based onChange, controlled or uncontrolled**: form controls call `onChange(value)` (except native wrappers `TextInput`/`TextArea`) and accept `value` or `defaultValue`.
5. **Follow the Component Lifecycle**:
   - When adding/modifying components, execute the checklist defined in `.agents/rules/component-lifecycle.md`.
