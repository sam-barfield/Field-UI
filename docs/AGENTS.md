# AGENTS.md — Field Design System Guide for AI Coding Agents

This is the guide for AI coding assistants (Claude, Cursor, Copilot, Gemini, ChatGPT) generating or reviewing code that **uses** the Field Design System.

> **Source of truth for props:** [`docs/COMPONENT_MANIFEST.json`](./COMPONENT_MANIFEST.json) is generated from the TypeScript source (`npm run docs:manifest`). It lists every component, prop, type, default and description. Never use a prop that is not in the manifest.

---

## 1. Golden rules

1. **Import the stylesheet once and wrap the app in `<ThemeProvider>`.**
   ```tsx
   import '@sam.barfield/field-react/styles.css';
   import { ThemeProvider, ToastProvider } from '@sam.barfield/field-react';

   <ThemeProvider defaultMode="system" storageKey="theme">
     <ToastProvider>{app}</ToastProvider>
   </ThemeProvider>
   ```
2. **Never hard-code colours or spacing.** Use `--field-*` CSS variables (section 4), layout props (`gap={12}`, `gap="$4"`), or Field components.
3. **Every control needs an accessible name.** `IconButton` requires `aria-label`; form controls take `label` (or `aria-label` when there is no visible label).
4. **Value-based `onChange`.** `Select`, `Combobox`, `Switch`, `Checkbox`, `RadioGroup`, `Slider`, `NumberInput`, `SegmentedControl`, `DatePicker`, `Tabs` and `Accordion` call `onChange` with the **value**, so `onChange={setState}` works. `TextInput` and `TextArea` are native wrappers: their `onChange` receives the **event**.
5. **Controlled or uncontrolled.** Inputs accept `value` + `onChange` or `defaultValue`; overlays accept `isOpen` + `onOpenChange` or `defaultOpen`.
6. **Router links.** Render navigation with `as={Link}` or `asChild` (Button, IconButton, NavbarItem, NavbarBrand, NavbarFlyoutItem, SidebarItem, SidebarSubItem, DropdownItem, Tabs items, Breadcrumb items). Mark the current route with `isActive`.
7. **Don't re-implement what exists.** Use `Modal`/`Drawer` (focus trap, scroll lock), `DropdownMenu`, `Popover`, `Tooltip`, `Table`, `Pagination`, `EmptyState`, `Skeleton` instead of custom versions.

---

## 2. Imports

Everything (components, hooks, tokens, theme helpers) comes from one package:

```tsx
import {
  // Theme
  ThemeProvider, ThemeScope, useTheme, createTheme, createThemePair,
  cobaltThemePair, titaniumAmberPair, emeraldPrecisionPair, themePairs,

  // Actions
  Button, IconButton, ButtonGroup, SegmentedControl,
  DropdownMenu, DropdownItem, DropdownGroup, DropdownLabel, DropdownDivider,

  // Forms
  TextInput, TextArea, Select, Combobox, NumberInput,
  Switch, Checkbox, RadioGroup, Slider, DatePicker, DateRangePicker,

  // Layout
  Box, Flex, Stack, Grid, Container, Divider, Card, CardHeader, CardContent, CardFooter,

  // Navigation
  Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarFlyout, NavbarFlyoutGrid,
  NavbarFlyoutItem, NavbarActions, NavbarToggle, NavbarMenu, useNavbar,
  Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarItem, SidebarDropdown,
  SidebarSubItem, SidebarFooter, SidebarProvider, SidebarTrigger, useSidebar,
  Tabs, TabPanel, Breadcrumb, Pagination, Stepper,

  // Data display
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  StatCard, Sparkline, Meter, StatusDot, Badge, Avatar, AvatarGroup,
  TreeView, Timeline, EmptyState, CodeBlock, DiffViewer, CopyButton,
  Terminal, TerminalHeader, TerminalBody, TerminalLine, TerminalPrompt,

  // Overlays
  Modal, Drawer, Popover, Tooltip, ContextMenu, CommandPalette,

  // Feedback
  Alert, ToastProvider, useToast, Progress, Spinner, Skeleton, Accordion,

  // Typography
  Heading, Text, Kbd, Code, UnfoldingHeading,

  // Website
  Section, Footer, FooterBrand, FooterColumn, FooterLink, FooterBottom,
  Image, AspectRatio, Gallery, Lightbox, Carousel, CarouselSlide,
  Link, Prose, CookieConsent, useCookieConsent, SkipLink, BackToTop, Reveal,

  // Responsive helpers
  breakpoints, useMediaQuery, usePrefersReducedMotion,
} from '@sam.barfield/field-react';
```

Icons in examples come from `lucide-react`.

---

## 3. Theming

```tsx
// Switch mode / pair
const { mode, toggleMode, setMode, setThemePair } = useTheme();

// Brand theme: override only what you need
const acme = createThemePair({
  id: 'acme',
  shared: { radii: { md: '6px' } },
  dark: { semantics: { accent: { primary: '#E11D48', hover: '#F43F5E', active: '#BE123C' } } },
  light: { semantics: { accent: { primary: '#BE123C', hover: '#9F1239', active: '#881337' } } },
});
<ThemeProvider themePair={acme}>…</ThemeProvider>

// Different theme for a subtree (portals inside inherit it)
<ThemeScope mode="light">…</ThemeScope>

// Customer-facing websites: light-first presets with fonts (load the webfonts yourself)
// roasteryPair (cafés), workshopPair (trades), storefrontPair (shops), sagePair (wellness), counselPair (professional)
<ThemeProvider themePair={roasteryPair} defaultMode="light">…</ThemeProvider>

// Themes can set fonts: display (headings) and sans (body)
createThemePair({ id: 'acme', shared: { fonts: { display: '"Fraunces", Georgia, serif' } } });
```

---

## 4. Design tokens

| Variable | Use |
|:---|:---|
| `--field-surface-base` | Page background |
| `--field-surface-raised` | Cards, panels |
| `--field-surface-overlay` | Modals, popovers, menus |
| `--field-surface-sunken` | Inputs, code blocks, wells |
| `--field-surface-subtle` / `-active` | Hover / pressed backgrounds |
| `--field-border-subtle` / `-default` / `-strong` | Dividers / inputs / emphasis |
| `--field-border-focus` | Focus rings |
| `--field-text-primary` / `-secondary` / `-tertiary` / `-disabled` | Text hierarchy |
| `--field-accent-primary` / `-hover` / `-active` | Brand / primary actions |
| `--field-accent-subtle` | Tinted accent backgrounds |
| `--field-accent-contrast` | Text on top of `accent-primary` |
| `--field-status-{success,warning,danger,info}-{base,surface,border,text}` | Status colours |
| `--field-space-1` … `--field-space-24` | 4px scale (`--field-space-1_5` = 6px) |
| `--field-radius-xs` / `-sm` / `-md` / `-lg` / `-xl` / `-full` | 3 / 6 / 8 / 12 / 16 px / pill (default theme) |
| `--field-shadow-xs` … `-xl` | Elevation (softer in light themes) |
| `--field-font-sans` / `-mono` | Inter / JetBrains Mono stacks |
| `--field-duration-fast` / `--field-ease-default` | Motion |

Tailwind: v4 `@import "@sam.barfield/field-tokens/tailwind.css";`, v3 `presets: [fieldTailwindPreset]` → classes like `bg-field-surface-raised`, `text-field-text-secondary`, `rounded-field-md`.

---

## 5. Recipes

### A. KPI tile
```tsx
<StatCard
  label="p99 latency"
  value="182 ms"
  delta={{ value: '12%', trend: 'down' }}
  invertTrendColors // "down" is good for latency
  chart={<Sparkline data={[220, 210, 195, 182]} color="success" />}
/>
```

### B. Data table with selection, row actions and pagination
```tsx
const columns: Column<Instance>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'state', header: 'State', render: r => <Badge variant={r.state === 'running' ? 'success' : 'default'} dot>{r.state}</Badge> },
  {
    key: 'actions',
    header: <span className="field-sr-only">Actions</span>,
    align: 'right',
    render: r => (
      <DropdownMenu align="end" trigger={<IconButton icon={<MoreHorizontal size={16} />} aria-label={`Actions for ${r.name}`} variant="ghost" />}>
        <DropdownItem onSelect={() => reboot(r)}>Reboot</DropdownItem>
        <DropdownDivider />
        <DropdownItem variant="danger" onSelect={() => terminate(r)}>Terminate</DropdownItem>
      </DropdownMenu>
    ),
  },
];

<Table
  columns={columns}
  data={pageRows}
  keyExtractor={r => r.id}
  selectable
  selectedKeys={selected}
  onSelectionChange={setSelected}
  renderBulkActions={(keys, clear) => <Button size="sm" variant="danger" onClick={() => stopMany(keys)}>Stop {keys.length}</Button>}
  emptyMessage={<EmptyState title="No instances" />}
/>
<Pagination currentPage={page} totalPages={pages} onPageChange={setPage} totalItems={total} pageSize={pageSize} onPageSizeChange={setPageSize} />
{/* Cards, feeds and tight spaces: prev/next with a page status */}
<Pagination variant="simple" currentPage={page} totalPages={pages} onPageChange={setPage} />
```

### C. Confirmation modal
```tsx
<Modal
  isOpen={open}
  onClose={() => setOpen(false)}
  title="Deploy to staging?"
  description="Build #4829 will replace the current release."
  footer={<>
    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
    <Button variant="primary" onClick={deploy}>Deploy</Button>
  </>}
>
  <Alert variant="warning" title="4 pods will restart" />
</Modal>
```

### D. Form
```tsx
<form onSubmit={handleSubmit}>
  <Stack gap="$4">
    <TextInput name="name" label="Name" required error={errors.name} />
    <Select name="region" label="Region" options={regions} value={region} onChange={setRegion} />
    <NumberInput name="replicas" label="Replicas" min={1} max={20} defaultValue={3} />
    <Switch name="autoscale" label="Auto-scaling" defaultChecked />
    <Button type="submit" variant="primary">Create</Button>
  </Stack>
</form>
```

### E. Tabs with panels
```tsx
<Tabs items={[{ id: 'overview', label: 'Overview' }, { id: 'logs', label: 'Logs', badge: 3 }]}>
  <TabPanel id="overview">…</TabPanel>
  <TabPanel id="logs">…</TabPanel>
</Tabs>
```

### F. App shell: sidebar + header trigger
```tsx
<SidebarProvider>
  <div style={{ display: 'flex', height: '100vh' }}>
    <Sidebar>
      <SidebarHeader title="Control Center" subtitle="Production" icon={<Layers size={16} />} />
      <SidebarContent>
        <SidebarGroup label="Overview">
          <SidebarItem icon={<Home size={16} />} label="Dashboard" isActive />
          <SidebarItem icon={<Activity size={16} />} label="Monitoring" badge="Live" />
          <SidebarDropdown icon={<Server size={16} />} label="Compute" defaultOpen>
            <SidebarSubItem label="Instances" badge="12" />
            <SidebarSubItem label="Auto-scaling" />
          </SidebarDropdown>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter collapsedChildren={<Avatar name="Ada Lovelace" size="sm" />}>
        <Avatar name="Ada Lovelace" size="sm" /> Ada Lovelace
      </SidebarFooter>
    </Sidebar>
    <main style={{ flex: 1, overflowY: 'auto' }}>
      <Flex align="center" gap={12} padding="$3">
        <SidebarTrigger />
        <Heading level={3}>Monitoring</Heading>
      </Flex>
    </main>
  </div>
</SidebarProvider>
```

### G. Top navigation
```tsx
<Navbar sticky blurred variant="elastic" maxWidth="xl">
  <NavbarBrand as={Link} href="/"><Layers size={18} /> Acme</NavbarBrand>
  <NavbarContent hideOnMobile>
    <NavbarItem as={Link} href="/overview" isActive={path === '/overview'}>Overview</NavbarItem>
    <NavbarItem as={Link} href="/deployments" isActive={path === '/deployments'}>Deployments</NavbarItem>
  </NavbarContent>
  <NavbarActions>
    <IconButton icon={<Sun size={16} />} aria-label="Toggle theme" variant="ghost" size="sm" onClick={toggleMode} />
    <NavbarToggle />
  </NavbarActions>
  <NavbarMenu>
    <NavbarItem as={Link} href="/overview">Overview</NavbarItem>
    <NavbarItem as={Link} href="/deployments">Deployments</NavbarItem>
  </NavbarMenu>
</Navbar>
```

### I. Website page
```tsx
<ThemeProvider themePair={roasteryPair} defaultMode="light">
  <SkipLink href="#main" />
  <Navbar sticky>…</Navbar>
  <main id="main">
    <Section spacing="xl" container="md">
      <Stack gap="$6" align="center">
        <Heading level={1} display="lg" align="center">Small-batch coffee</Heading>
        <Text size="xl" tone="secondary" align="center">Roasted round the corner.</Text>
        <Flex direction={{ base: 'column', sm: 'row' }} gap="$3">
          <Button variant="primary" size="lg">See the menu</Button>
        </Flex>
      </Stack>
    </Section>
    <Section tone="muted" id="features">
      <Grid columns={{ base: 1, md: 3 }} gap="$8">…</Grid>
    </Section>
    <Section><Gallery images={photos} columns={{ base: 2, md: 3 }} /></Section>
    <Section tone="accent" spacing="md">…call to action…</Section>
  </main>
  <Footer>
    <FooterBrand>…</FooterBrand>
    <FooterColumn title="Visit"><FooterLink href="/menu">Menu</FooterLink></FooterColumn>
    <FooterBottom>© 2026 Hearth</FooterBottom>
  </Footer>
  <CookieConsent policyHref="/cookies" />
</ThemeProvider>
```

### H. Command palette and toasts
```tsx
const { showToast } = useToast();
<CommandPalette
  isOpen={open}
  onOpen={() => setOpen(true)}   // enables ⌘K / Ctrl+K
  onClose={() => setOpen(false)}
  items={[{ id: 'new', title: 'Create instance', category: 'Actions', keywords: ['launch'], onSelect: launch }]}
/>
showToast({ title: 'Saved', variant: 'success', action: { label: 'Undo', onClick: undo } });
```

---

## 6. Component notes

- **Select / Combobox / DropdownMenu / Popover / DatePicker** render their popups in a portal: safe inside modals, tables and scroll containers.
- **Modal / Drawer** trap focus, restore it on close and lock scroll. `initialFocusRef` focuses a field; `Drawer side="left"` is available.
- **Table** sorts client-side unless `manualSorting`; selection works controlled (`selectedKeys`) or uncontrolled.
- **NumberInput** commits (clamps + rounds to `step`) on blur/Enter, not on every keystroke.
- **Date pickers** compare by calendar day; with `name` they submit local `YYYY-MM-DD`.
- **Heading** `level` sets the size, `as` sets the tag. **Text** renders `<p>` by default; use `as="span"` inline.
- **Layout** props (`gap`, `padding`) accept numbers (px), CSS lengths, or `$` spacing tokens (`"$4"`). `Grid minChildWidth={240}` makes responsive grids.
- **Responsive props**: layout props on `Flex`, `Stack`, `Grid`, `Box`, `Container` and `align` on `Heading` / `Text` accept `{ base, sm, md, lg, xl }` (mobile first; 640 / 768 / 1024 / 1280px). `hideBelow` / `hideFrom` toggle visibility. Don't hand-write media queries for these.
- **Display type**: `Heading display="sm" | "md" | "lg" | "xl"` (fluid) and `Text size="xl"` (lead). Headings use `--field-font-display`.
- **Section** sets page-band spacing, `tone` (`muted`, `raised`, `accent`, `inverse`) and a container; use it for every marketing band instead of custom padding. `backgroundImage` + `overlay` for photo bands.
- **Image** requires `alt`; `ratio` crops; lazy by default (`loading="eager"` for heroes). **Gallery** opens a **Lightbox**. Use **AspectRatio** for iframes / video.
- **CookieConsent**: mount once; gate optional scripts on `useCookieConsent().consent?.analytics`; `openPreferences()` for a footer "Cookie settings" link.
- **Link** for inline text links (underlined by default, `external` for new tabs); **Button** with `href` for standalone actions.
- **Badge** sizes `sm | md | lg`; **Alert** has `actions` and `onClose`; **StatCard** has `invertTrendColors`.
- Components are marked `'use client'`, so they can be imported in Next.js Server Components; hooks still need a client component.
