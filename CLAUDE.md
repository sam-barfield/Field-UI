# CLAUDE.md — Field Design System Assistant Guide

This file provides key commands, component inventories, and architectural guidelines for Claude Code and Anthropic assistants operating within the **Field Design System** codebase.

---

## Commands

- **Typecheck monorepo**: `npm run typecheck`
- **Build all packages**: `npm run build`
- **Dev server (showcase app)**: `npm run dev`

---

## Codebase Architecture

- **`packages/tokens`**: `@sam.barfield/field-tokens` — Token definitions, theme pairs, and CSS variables.
- **`packages/react`**: `@sam.barfield/field-react` — Accessible React components and theme engine.
- **`apps/showcase`**: `@field/showcase` — Vite-powered live documentation, sticker sheet, and theme playground.
- **`docs/COMPONENT_MANIFEST.json`**: Authoritative machine-readable schema for all components, props, and types.
- **`.agents/rules/component-lifecycle.md`**: Mandatory 7-step checklist for component additions and updates.

---

## Component Inventory Quick Reference

- **Navigation & Shell**: `Navbar` (`NavbarBrand`, `NavbarContent`, `NavbarItem`, `NavbarFlyout`, `NavbarFlyoutGrid`, `NavbarFlyoutItem`, `NavbarActions`, `NavbarToggle`, `NavbarMenu`), `Sidebar` (`SidebarHeader`, `SidebarContent`, `SidebarGroup`, `SidebarItem`, `SidebarDropdown`, `SidebarFooter`, `SidebarTrigger`), `Tabs`, `Breadcrumb`, `Pagination`, `Stepper`, `Timeline`
- **Actions**: `Button`, `IconButton`, `ButtonGroup`, `SegmentedControl`, `DropdownMenu`, `CopyButton`
- **Forms**: `TextInput`, `TextArea`, `Select`, `Combobox`, `NumberInput`, `Switch`, `Checkbox`, `RadioGroup`, `Slider`, `DatePicker`, `DateRangePicker`
- **Layout**: `Box`, `Flex`, `Stack`, `Grid`, `Container`, `Divider`
- **Data Display**: `Card`, `StatCard`, `Table`, `Terminal`, `CodeBlock`, `DiffViewer`, `Sparkline`, `Meter`, `StatusDot`, `TreeView`, `EmptyState`
- **Feedback**: `Modal`, `Drawer`, `Popover`, `ContextMenu`, `CommandPalette`, `Alert`, `ToastProvider` / `useToast`, `Tooltip`, `Progress`, `Spinner`, `Skeleton`, `Accordion`
- **Typography**: `Heading`, `UnfoldingHeading`, `Text`, `Badge`, `Avatar`, `AvatarGroup`, `Kbd`, `Code`

---

## Architecture Rules

1. **No Raw Colors or Hardcoded Spacing**: Always use `--field-*` tokens (`var(--field-surface-raised)`, `var(--field-border-default)`, `var(--field-space-4)`).
2. **Compound & Polymorphic**: Prefer compound subcomponents and provide `asChild`, `as`, and `href` on interactive links to support client-side routers (Next.js, TanStack Router).
3. **Component Synchronization**: Whenever creating or altering components, update `docs/COMPONENT_MANIFEST.json`, `apps/showcase/src/components/catalog/catalogRegistry.tsx`, and `GEMINI.md`.
4. **Top Navigation**: Use `<Navbar>` with animated variants via `<NavbarContent variant="underline" | "elastic" | "pill" | "rail" animated>`.
