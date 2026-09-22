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
│   └── showcase/        # @field/showcase            — Interactive catalog, sticker sheet & theme editor
├── docs/
│   ├── AGENTS.md        # Extended code recipes & usage patterns
│   ├── COMPONENT_MANIFEST.json # Machine-readable component props & types registry
│   └── DESIGN_PHILOSOPHY.md    # Contrast, tokens, motion, and accessibility foundations
└── .agents/rules/
    └── component-lifecycle.md  # Mandatory 7-step checklist for component additions/changes
```

### Essential Commands
- **Typecheck everything**: `npm run typecheck`
- **Build all packages**: `npm run build`
- **Run showcase dev server**: `npm run dev`

---

## 2. Complete Component Inventory Matrix

Field UI provides 85+ precision components organized into 7 functional categories:

| Category | Components Available in `@sam.barfield/field-react` |
|:---|:---|
| **Navigation & Shell** | [`Navbar`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Navbar.tsx) (`NavbarBrand`, `NavbarContent`, `NavbarItem`, `NavbarFlyout`, `NavbarFlyoutGrid`, `NavbarFlyoutItem`, `NavbarActions`, `NavbarToggle`, `NavbarMenu`), [`Sidebar`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Sidebar.tsx) (`SidebarHeader`, `SidebarContent`, `SidebarGroup`, `SidebarItem`, `SidebarDropdown`, `SidebarSubItem`, `SidebarFooter`, `SidebarTrigger`, `SidebarProvider`, `useSidebar`), [`Tabs`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Tabs.tsx), [`Breadcrumb`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Primitives.tsx), [`Pagination`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Table.tsx), [`Stepper`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/DataDisplay.tsx), [`Timeline`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/DataDisplay.tsx) |
| **Actions & Buttons** | [`Button`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Button.tsx), [`IconButton`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Button.tsx), [`ButtonGroup`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Button.tsx), [`SegmentedControl`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Controls.tsx), [`DropdownMenu`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/DropdownMenu.tsx) (`DropdownGroup`, `DropdownItem`, `DropdownDivider`, `DropdownLabel`), [`CopyButton`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/CodeBlock.tsx) |
| **Forms & Inputs** | [`TextInput`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Input.tsx), [`TextArea`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Input.tsx), [`Select`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Select.tsx), [`Combobox`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Select.tsx), [`NumberInput`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Controls.tsx), [`Switch`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Controls.tsx), [`Checkbox`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Controls.tsx), [`RadioGroup`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Controls.tsx), [`Slider`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Controls.tsx), [`DatePicker`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/DatePicker.tsx), [`DateRangePicker`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/DatePicker.tsx) |
| **Layout & Primitives** | [`Box`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Primitives.tsx), [`Flex`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Primitives.tsx), [`Stack`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Primitives.tsx), [`Grid`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Primitives.tsx), [`Container`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Primitives.tsx), [`Divider`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Primitives.tsx) |
| **Data Display & Code** | [`Card`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Card.tsx) (`CardHeader`, `CardContent`, `CardFooter`), [`StatCard`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Card.tsx), [`Table`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Table.tsx) (`TableHeader`, `TableBody`, `TableRow`, `TableCell`, `TableHead`), [`Terminal`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Terminal.tsx) (`TerminalHeader`, `TerminalBody`, `TerminalLine`, `TerminalPrompt`), [`CodeBlock`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/CodeBlock.tsx), [`DiffViewer`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/CodeBlock.tsx), [`Sparkline`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Metrics.tsx), [`Meter`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Metrics.tsx), [`StatusDot`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Feedback.tsx), [`TreeView`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/DataDisplay.tsx), [`EmptyState`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/DataDisplay.tsx) |
| **Feedback & Overlays** | [`Modal`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Modal.tsx), [`Drawer`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Modal.tsx), [`Popover`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Popover.tsx), [`ContextMenu`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/ContextMenu.tsx), [`CommandPalette`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/CommandPalette.tsx), [`Alert`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Feedback.tsx), [`ToastProvider`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Feedback.tsx) (`useToast`), [`Tooltip`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Accordion.tsx), [`Progress`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Primitives.tsx), [`Spinner`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Primitives.tsx), [`Skeleton`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Primitives.tsx), [`Accordion`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Accordion.tsx) |
| **Typography & Indicators** | [`Heading`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Typography.tsx), [`UnfoldingHeading`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/UnfoldingHeading.tsx), [`Text`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Typography.tsx), [`Badge`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Badge.tsx), [`Avatar`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Feedback.tsx), [`AvatarGroup`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Feedback.tsx), [`Kbd`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Typography.tsx), [`Code`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Typography.tsx) |

---

## 3. Application Shell Architecture (Negative Map & Guides)

When asked about application navigation or shell layouts:

1. **Top Navigation (`Navbar`)**:
   - Use the **`Navbar` compound suite** (`<Navbar>`, `<NavbarBrand>`, `<NavbarContent>`, `<NavbarItem>`, `<NavbarActions>`, `<NavbarToggle>`, `<NavbarMenu>`).
   - Supports `sticky`, `blurred` (backdrop filter), `bordered`, `density="default" | "compact"`, and responsive mobile drawer.
   - High-polish animated variants via `<NavbarContent variant="underline" | "elastic" | "pill" | "rail" animated>`:
     - `variant="underline"` (default): Flush accent bottom glider smoothly transitioning between active items.
     - `variant="elastic"`: Organic spring-physics squash-and-stretch bouncing underline that deforms dynamically across tab transitions.
     - `variant="pill"`: Floating translucent magnetic capsule glider.
     - `variant="rail"`: Encapsulated sunken dock rail with elevated active pill.
2. **Side Navigation (`Sidebar`)**:
   - Use the **`Sidebar` compound suite** (`<Sidebar>`, `<SidebarHeader>`, `<SidebarContent>`, `<SidebarGroup>`, `<SidebarItem>`, `<SidebarDropdown>`, `<SidebarFooter>`, `<SidebarTrigger>`).
   - Supports collapsible docking, compact density, hierarchy lines, and tooltips.
3. **Hybrid Shell (Top Nav + Sidebar)**:
   - Place `<Navbar>` at the top containing a `<SidebarTrigger />`.
   - Place `<Sidebar>` below in a flex row layout alongside the `<main>` content container.
4. **Horizontal Section Tabs**:
   - Use [`Tabs`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/packages/react/src/components/Tabs.tsx) with `items={...}` for page-level tabbed navigation.

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
4. **Follow the Component Lifecycle**:
   - When adding/modifying components, execute the checklist defined in [`.agents/rules/component-lifecycle.md`](file:///c:/Users/samb8/Desktop/Dev-Stuff/testing/3.8/design%20system/.agents/rules/component-lifecycle.md).
