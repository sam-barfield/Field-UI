# AGENTS.md — Field Design System Guide for AI Coding Agents

This is the guide for AI coding assistants (Claude, Cursor, Copilot, Gemini, ChatGPT) generating or reviewing code that **uses** the Field Design System.

> **Source of truth for props:** [`docs/COMPONENT_MANIFEST.json`](./COMPONENT_MANIFEST.json) is generated from the TypeScript source (`npm run docs:manifest`). It lists every component, prop, type, default and description. Never use a prop that is not in the manifest.

---

## 1. Golden rules

1. **Import the stylesheet once and wrap the app in `<ThemeProvider>`.**
   ```tsx
   import '@sam.barfield/field-react/styles.css';
   import { ThemeProvider, ToastProvider } from '@sam.barfield/field-react';
   import { AppLink } from './AppLink'; // href → to adapter, see rule 6 (Next.js: pass `Link` from 'next/link')

   <ThemeProvider linkComponent={AppLink} defaultMode="system" storageKey="theme">
     <ToastProvider>{app}</ToastProvider>
   </ThemeProvider>
   ```
   Field's CSS is in the `field` cascade layer, so unlayered app CSS always wins. Put resets (`* { margin: 0 }`, `button { background: none }`, Tailwind Preflight) in a layer declared *before* Field (`@layer reset, field;` in a file imported before Field's stylesheet), or they strip Field's components.
2. **Never hard-code colours or spacing.** Use `--field-*` CSS variables (section 4), layout props (`gap={12}`, `gap="$4"`), or Field components.
3. **Every control needs an accessible name.** `IconButton` requires `aria-label`; form controls take `label` (or `aria-label` when there is no visible label).
4. **Value-based `onChange`.** `Select`, `Combobox`, `Switch`, `Checkbox`, `RadioGroup`, `Slider`, `NumberInput`, `SegmentedControl`, `DatePicker`, `Tabs` and `Accordion` call `onChange` with the **value**, so `onChange={setState}` works. `TextInput` and `TextArea` are native wrappers: their `onChange` receives the **event**.
5. **Controlled or uncontrolled.** Inputs accept `value` + `onChange` or `defaultValue`; overlays accept `isOpen` + `onOpenChange` or `defaultOpen`.
6. **Router links.** Provide `linkComponent` to `<ThemeProvider>` for automatic client routing on internal `href`s across `Button`, `IconButton`, `Card`, `Link`, `FooterLink`, `NavbarBrand`, `NavbarItem`, `NavbarFlyoutItem`, `Breadcrumb`, `Tabs` and the `CookieConsent` policy link. External URLs, `#` anchors and links with `download` or a `target` other than `_self` always render a plain `<a>` (unless you pass `as`), so downloads and new tabs keep working. Field passes the component **`href`**, never `to`. `next/link` takes `href`, so pass it directly. React Router and TanStack Router need `to`, so pass a small adapter:
   ```tsx
   import { forwardRef, type AnchorHTMLAttributes } from 'react';
   import { Link } from 'react-router-dom';

   export const AppLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(
     ({ href = '/', ...rest }, ref) => <Link ref={ref} to={href} {...rest} />
   );
   ```
   External URLs (`https:`, `mailto:`, `tel:`, `//`) and `#` anchors always render a plain `<a>`, so the adapter only sees internal paths.
7. **Don't re-implement what exists.** Use `Modal`/`Drawer` (focus trap, scroll lock), `DropdownMenu`, `Popover`, `Tooltip`, `Table`, `Pagination`, `EmptyState`, `Skeleton` instead of custom versions.

---

## 2. Imports

Everything (components, hooks, tokens, theme helpers) comes from one package:

```tsx
import {
  // Theme
  ThemeProvider, ThemeScope, useTheme, createTheme, createThemePair,
  cobaltThemePair, titaniumAmberPair, emeraldPrecisionPair, themePairs,
  useLinkComponent,

  // Actions
  Button, IconButton, ButtonGroup, SegmentedControl, Chip, ChipGroup,
  DropdownMenu, DropdownItem, DropdownGroup, DropdownLabel, DropdownDivider,

  // Forms
  TextInput, TextArea, Select, Combobox, NumberInput,
  Switch, Checkbox, RadioGroup, Slider, DatePicker, DateRangePicker,

  // Layout
  Box, Flex, Stack, Grid, Container, Divider, Divided, Card, CardHeader, CardContent, CardFooter,
  VisuallyHidden,

  // Navigation
  Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarFlyout, NavbarFlyoutGrid,
  NavbarFlyoutItem, NavbarActions, NavbarActionsItem, NavbarToggle, NavbarMenu, useNavbar,
  Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarItem, SidebarDropdown,
  SidebarSubItem, SidebarFooter, SidebarProvider, SidebarTrigger, useSidebar,
  Tabs, TabPanel, Breadcrumb, Pagination, Stepper,

  // Data display
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  StatCard, Sparkline, Meter, StatusDot, Badge, Avatar, AvatarGroup,
  DescriptionList, DescriptionItem,
  TreeView, Timeline, EmptyState, Icon, IconText, CodeBlock, DiffViewer, CopyButton,
  Terminal, TerminalHeader, TerminalBody, TerminalLine, TerminalPrompt,

  // Overlays
  Modal, Drawer, Popover, Tooltip, ContextMenu, CommandPalette,

  // Feedback
  Alert, ToastProvider, useToast, Progress, Spinner, Skeleton, Accordion, AsyncContent,

  // Typography
  Heading, Text, Kbd, Code, UnfoldingHeading,

  // Website
  Section, SectionHeader, Footer, FooterBrand, FooterColumn, FooterLink, FooterBottom,
  Image, AspectRatio, Gallery, Lightbox, LightboxAction, Carousel, CarouselSlide,
  Link, Prose, ProseHtml, htmlToReact, CookieConsent, useCookieConsent, SkipLink, BackToTop, FloatingButton, Reveal,

  // Responsive helpers
  breakpoints, useMediaQuery, usePrefersReducedMotion,
} from '@sam.barfield/field-react';
```

Icons in examples come from `lucide-react`.

---

## 3. Theming

> Creating a brand theme from a client's existing website? Follow `docs/skills/field-theme-from-website/SKILL.md`.

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

// Themes can set fonts: display (headings) and sans (body), plus heading weight / tracking / width
createThemePair({ id: 'acme', shared: { fonts: { display: '"Fraunces", Georgia, serif' }, typography: { displayWeight: 800 } } });

// Brand colour that can't be both a fill and readable text in dark mode (reds, yellows):
// accent.text is the accent as foreground (links, active nav); band themes photo / inverse bands.
createThemePair({
  id: 'brand',
  dark: { semantics: { accent: { primary: '#D00000', contrast: '#FFFFFF', text: '#FF6B61' } } },
  band: { semantics: { accent: { primary: '#D00000', contrast: '#FFFFFF' } } },
  checkContrast: true, // warns about every pairing below WCAG AA; or call checkThemeContrast(theme)
});
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
| `--field-accent-text` | Accent as text on surfaces (links, active nav, icons); defaults to `accent-primary`. Use it for brand-coloured text in your own CSS, and `accent-primary` for fills |
| `--field-heading-weight` / `--field-display-weight` / `--field-heading-tracking` / `--field-heading-stretch` | Heading typography; set with `createTheme({ typography })` |
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
- **Section** sets page-band spacing, `tone` (`muted`, `raised`, `accent`, `inverse`) and a container; use it for every marketing band instead of custom padding. `backgroundImage` (a URL or `{ src, srcSet, sizes, priority }`, rendered as an `<img>`) + `overlay` for photo bands; `priority` on the hero. `underNavbar` pulls a hero under a transparent sticky Navbar. Children are not repositioned by a `backgroundImage`, so absolutely positioned decoration is placed against the section, inside the container or not. **SectionHeader** gives eyebrow, title (a `Heading`, `display="sm"` by default, in the theme's display font), description and an action that drops under the title on phones (`align="start" | "center"`); `headingId` for `aria-labelledby`; it has no outer margin, so space it with the parent `Stack`'s `gap`.
- **Image** requires `alt`; `ratio` crops; lazy by default (`priority` for the hero: eager + `fetchpriority="high"`). **Gallery** opens a **Lightbox**; `previewCount={{ base: 6 }}` shows the first photos with "Show all", `isLoading` shows skeletons, photos take `id`, `srcSet`, `width`, `height`. Toolbar controls (e.g. Download) go in Lightbox `actions` / Gallery `lightboxProps.actions` as **LightboxAction** (`icon` + required `aria-label`; `download` only works same-origin, so pair it with `target="_blank"`), not in `caption`. Use **AspectRatio** for iframes / video.
- **CookieConsent**: mount once; gate optional scripts on `useCookieConsent().consent?.analytics`; `openPreferences()` for a footer "Cookie settings" link.
- **Link** for inline text links (underlined by default, `external` for new tabs); **Button** with `href` for standalone actions.
- **Badge** sizes `sm | md | lg`; **Alert** has `actions` and `onClose`; **StatCard** has `invertTrendColors`.
- **Navbar**: `collapseBelow="lg"` (or px) collapses to the toggle + `NavbarMenu` earlier than the default 768px; put desktop links in `<NavbarContent hideOnMobile>`, and wrap single actions in `<NavbarActionsItem hideOnMobile>`. `height={68}` sets the bar height once: a sticky bar publishes `--field-navbar-height` on `<html>` (use it for sticky toolbars; anchors offset automatically). Over a hero use `transparentOnTop="auto"` + `<Section underNavbar>` (no-hero pages get a solid bar); `scrolledAppearance` styles the scrolled bar; `mode="dark"` / `theme` themes the bar itself (no ThemeScope wrapper). The menu locks scroll, shows a backdrop, keeps Tab inside the bar and closes on Escape and browser back. Flyouts close on link click, focus-out, outside click and Escape, so no controlled state is needed for client-side routing. In `NavbarMenu`, use `NavbarItem`s inside `NavbarFlyout` accordions.
- **Card** with `href` is a whole-card link; don't nest links or buttons inside it. `fill` gives equal-height cards in a grid row with pinned footers (link and button cards too); `padding` accepts a breakpoint object; `variant="inset"` for a sunken panel; `as="button"` (with `aria-pressed` for a selection) is a keyboard-reachable selectable card with the button styles reset. **EmptyState** `titleAs="h1"` for 404 pages, `variant="plain"` inside a Card, `actions` for one or more buttons (stack on phones). **Select** puts `id` on its focusable trigger, so error summaries can link to `#id`.
- **Sizes line up**: `size` on `TextInput`, `Select`, `NumberInput` and `Chip` matches the Button heights (30 / 36 / 44 / 48px). Theme buttons with a theme's `button` group or the `--field-btn-*` variables, never by overriding `.field-btn` classes. `Button variant="link"` is an inline text action.
- **Website patterns**: `Text variant="overline"` (eyebrows), `Text measure` and `tabularNums`, `Chip` / `ChipGroup scroll` (filters; `scroll={{ base: true, md: false }}` scrolls on phones only), `DescriptionList` (facts; `divided` draws lines between rows in any column count), `Divided` (parts of one card separated by hairlines; `space` per breakpoint, `columns="3fr 2fr"` widths side by side), `Icon` / `IconText` (icon beside an address or hours), `VisuallyHidden below="sm"`, `FloatingButton` (basket / "Book now"; BackToTop moves above it; `badge` for a count that stays visible with `compactOnMobile`), `ProseHtml html={post.content} headingLevel={4}` (CMS HTML through an allowlist, SSR-safe, never `dangerouslySetInnerHTML`; `components={COMPONENTS}` such as `{ a: RouterLink }`, defined once outside the component because a new object re-parses the HTML on every render; its parser `htmlparser2` needs Node 20.19+), `Prose collapsible` (Read more on phones; a breakpoint object such as `{ base: true, lg: false }` picks the widths, CSS only), `Timeline` (`--field-timeline-*` variables, `status="accent"`, `markerSize="lg"`, `markerVariant="solid"`), `AsyncContent` (loading / error / empty states for remote lists).
- **Public CSS API**: `--field-navbar-height`, `--field-scroll-offset`, `--field-back-to-top-offset`, `--field-btn-*`, `--field-timeline-*`, `--field-navbar-scrolled-*`, `.field-navbar-collapsed`, `.field-navbar-hide-mobile`, `.field-sr-only`, the `field-navbar` container name and the `field.*` cascade layers are stable. Don't depend on other internal classes.
- **Stack** (default `align="stretch"`) leaves direct `img` / `svg` / `video` children at their own width. **Grid** `align="center"` vertically centres cells (e.g. text beside an image).
- **Websites in production**: self-host fonts (Fontsource) instead of a Google Fonts stylesheet; convert photos to WebP; `loading="eager"` on the hero image only; lazy-load routes with a `min-height: 100vh` Suspense fallback (avoids footer layout shift); add `public/robots.txt` to SPAs; set `document.title` per route and focus `<main>` after navigation. Measure Lighthouse on a production build, not the dev server.
- **Checkbox** takes `error` like the other form controls (required consent boxes).
- **Narrow screens**: horizontal **Stepper** shows only the current step's label below 640px (keep titles short, or use `orientation="vertical"`); **SegmentedControl** scrolls inside its box when labels don't fit; **TerminalHeader** children wrap below the title; **UnfoldingHeading** `lg` / `xl` shrink on phones. Wrap rows of buttons with `<Flex wrap="wrap">` and stack grids with `columns={{ base: 1, md: 3 }}`; fixed multi-column layouts are the usual cause of mobile overflow.
- Components are marked `'use client'`, so they can be imported in Next.js Server Components; hooks still need a client component.
