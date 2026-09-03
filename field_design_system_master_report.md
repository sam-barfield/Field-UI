# Field Design System — Unified Master Report & System Roadmap
**An Exhaustive Technical Audit, Bug Analysis, and Evolution Proposal**  
*Evaluated during production deployment of the AWS Cloud Management Console dashboard using `@sam.barfield/field-react` and `@sam.barfield/field-tokens` (v0.1.0).*

---

## Executive Summary

The **Field Design System** exhibits an exceptional visual foundation: a tactile aesthetic, specular micro-rims, multi-level slider zones, and a clean DTCG-aligned design token architecture in `@field/tokens`.

During the implementation of a full-scale cloud dashboard, we conducted an end-to-end stress test across all components, layout shells, theme switches, and interactive overlays. This master report synthesizes all our findings into two complementary sections:
1. **The Technical Audit (Parts I–III)**: Pinpoints existing bugs, token leaks (including the Alert color mismatch), documentation discrepancies, and React maintainability concerns, complete with code-level remedies.
2. **The System Roadmap (Parts IV–VI)**: Details desirable missing components, proposed TypeScript APIs, and architectural evolutions to scale Field into an enterprise-grade design system.

---

# PART I: Code Audit, Bug Reports & Token Leaks

### 1.1 The Alert Component Color Disconnect (Orange Icon in Blue Box)
* **Observed Symptom**: When applying the custom theme (`customFieldTheme`) where the `info` semantic token is configured with Amber (`#F59E0B`), rendering `<Alert variant="info">` produced an **amber/orange icon inside a cyan/blue box**.
* **Root Cause in `field.css` (lines 984–1014)**:
  ```css
  /* Actual code in field.css */
  .field-alert-info {
    background-color: rgba(6, 182, 212, 0.05); /* ❌ Hardcoded cyan/blue */
    border-color: rgba(6, 182, 212, 0.22);     /* ❌ Hardcoded cyan/blue */
  }
  .field-alert-info .field-alert-icon {
    color: var(--field-status-info-base);       /* ✅ Uses theme token */
  }
  ```
  While `compiler.ts` correctly compiled and injected `--field-status-info-surface` and `--field-status-info-border`, `field.css` completely bypassed them in `.field-alert-*`.
* **Systemic Issue**: This identical bug is duplicated across all alert variants:
  - `.field-alert-success`: Hardcodes `rgba(16, 185, 129, 0.05)` instead of `var(--field-status-success-surface)`.
  - `.field-alert-warning`: Hardcodes `rgba(245, 158, 11, 0.05)` instead of `var(--field-status-warning-surface)`.
  - `.field-alert-danger`: Hardcodes `rgba(239, 68, 68, 0.05)` instead of `var(--field-status-danger-surface)`.
* **Permanent Remedy for `field.css`**:
  ```css
  .field-alert-info {
    background-color: var(--field-status-info-surface);
    border-color: var(--field-status-info-border);
  }
  .field-alert-success {
    background-color: var(--field-status-success-surface);
    border-color: var(--field-status-success-border);
  }
  .field-alert-warning {
    background-color: var(--field-status-warning-surface);
    border-color: var(--field-status-warning-border);
  }
  .field-alert-danger {
    background-color: var(--field-status-danger-surface);
    border-color: var(--field-status-danger-border);
  }
  ```

---

### 1.2 Hardcoded Color Hexes in `.field-btn-danger`
* **Location**: `field.css` (lines 244–258)
  ```css
  .field-btn-danger {
    background-color: rgba(239, 68, 68, 0.12); /* ❌ Hardcoded red */
    color: #FCA5A5;                             /* ❌ Hardcoded hex */
    border: 1px solid rgba(239, 68, 68, 0.3);   /* ❌ Hardcoded red */
  }
  .field-btn-danger:active:not(:disabled) {
    background-color: #B91C1C;                  /* ❌ Hardcoded hex */
    border-color: #B91C1C;                      /* ❌ Hardcoded hex */
  }
  ```
* **Consequence**: Violates Golden Rule #1 in `AGENTS.md` (*"NEVER hardcode arbitrary color hexes"*). Custom danger palettes configured in themes will not tint danger buttons.
* **Remedy**: Replace with `var(--field-status-danger-surface)`, `var(--field-status-danger-text)`, and `var(--field-status-danger-base)`.

---

### 1.3 Specular Highlight Inversion in Light Mode
* In `.field-btn-primary`, the top chamfer highlight is hardcoded as:
  ```css
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.22);
  ```
  In dark mode, white specular highlights look crisp. In light themes with light or amber buttons, a hardcoded semi-opaque white specular rim lowers contrast.
* **Remedy**: Use `inset 0 1px 0 var(--field-border-highlight)` or theme-adaptive specular tokens.

---

### 1.4 Hardcoded Icon Color in `.field-checkbox`
* **Location**: `field.css` (line 458):
  ```css
  .field-checkbox {
    color: #FFFFFF; /* ❌ Hardcoded white icon */
  }
  ```
* **Consequence**: If a light theme uses a light accent color (e.g. bright yellow or light mint), the checkmark icon disappears due to lack of contrast.
* **Remedy**: Use `color: var(--field-accent-contrast, #FFFFFF);`.

---

# PART II: AGENTS.md vs. Implementation Discrepancies

### 2.1 The Table Component Hallucination
* **In `AGENTS.md` (Lines 78–83)**:
  The documentation instructs AI agents and developers to import:
  ```tsx
  import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@field/react';
  ```
  And Rule 3 specifies: *"Use compound and compositional patterns. Prefer compound over monolithic."*
* **In `Table.tsx` (Actual Package)**:
  `TableHeader`, `TableBody`, `TableRow`, `TableCell`, and `TableHead` **do not exist**.
  The package only exports a single monolithic component:
  ```tsx
  export function Table<T>({ columns, data, keyExtractor, emptyMessage, className }: TableProps<T>)
  ```
* **Consequence**: Any AI coding assistant (or human developer) following `AGENTS.md` writes compound table JSX that immediately causes fatal TypeScript compilation errors (`TS2305: Module has no exported member 'TableHeader'`).
* **Remedy**:
  - Update `AGENTS.md` to document the actual `columns` / `data` / `keyExtractor` interface.
  - Or better: export compound subcomponents alongside the data-driven table.

### 2.2 Package Scope Discrepancy
* `AGENTS.md` states: `import { ... } from '@field/react'`, but the published GitLab registry packages are scoped to `@sam.barfield/field-react` and `@sam.barfield/field-tokens`.

---

# PART III: React Architecture & Maintainability Concerns

### 3.1 `ThemeProvider.toggleMode` Erases Custom Themes
* **Location**: `ThemeProvider.tsx` (lines 17–24)
  ```tsx
  const toggleMode = () => {
    const nextMode = theme.mode === 'dark' ? 'light' : 'dark';
    if (nextMode === 'light') {
      setTheme(lightTheme);
    } else {
      setTheme(darkTheme);
    }
  };
  ```
* **Problem**: If an application passes an `initialTheme` like `customFieldTheme` (Titanium Amber), invoking `toggleMode()` switches to `lightTheme`, and the next toggle switches to `darkTheme` (default Cobalt), **completely erasing the custom theme from state**.
* **Remedy**: Allow `ThemeProvider` to register paired themes (see Section 5.1).

---

### 3.2 Modal & Drawer Lack `createPortal` (Stacking Context Traps)
* **Location**: `Modal.tsx` and `Drawer.tsx`
* **Problem**: Unlike `DatePicker` and `Tooltip` (which correctly use `createPortal(..., document.body)`), `Modal` and `Drawer` render directly inline in the component hierarchy.
  - If any ancestor container uses `overflow: hidden`, `position: relative`, or CSS `transform` / `filter`, the `position: fixed` overlay is **clipped, offset, or rendered underneath other elements**.
* **Remedy**: Wrap the backdrop and panel in `createPortal(..., document.body)`.

---

### 3.3 Direct DOM Style Mutation in `Select.tsx`
* **Location**: `Select.tsx` (lines 158–167)
  ```tsx
  onMouseEnter={e => {
    if (!opt.disabled && !isSelected) {
      e.currentTarget.style.backgroundColor = 'var(--field-surface-subtle)';
    }
  }}
  onMouseLeave={e => {
    if (!opt.disabled && !isSelected) {
      e.currentTarget.style.backgroundColor = 'transparent';
    }
  }}
  ```
* **Problem**: Direct imperative mutation of `e.currentTarget.style` inside React mouse handlers. This bypasses React reconciliation and creates visual glitches if the element is re-rendered or unmounted while hovered.
* **Remedy**: Use standard CSS:
  ```css
  .field-select-item:hover:not(.disabled):not(.selected) {
    background-color: var(--field-surface-subtle);
  }
  ```

---

### 3.4 Proliferation of Massive Inline Style Objects
Across `RadioGroup` (`Controls.tsx`), `Breadcrumb` (`Primitives.tsx`), `StatCard` (`Card.tsx`), and `ToastProvider` (`Feedback.tsx`), layout and styling are implemented via 20–40 lines of inline `style={{ ... }}` objects rather than CSS classes in `field.css`.
* **Impact**:
  - Significantly increases runtime DOM footprint and bundle size.
  - Styles cannot be overridden via CSS cascade or media queries.
  - React recreates these style objects on every render cycle.

---

# PART IV: Desirable Missing Components & Proposed APIs

During the development of the AWS Cloud Console, several foundational cloud and developer platform patterns were absent from the component library. Below is the proposed component suite:

---

### 4.1 High-Priority Overlays & Menus

#### A. `DropdownMenu` / `ActionMenu`
* **Why**: Essential for table row actions (e.g. EC2 "Actions": Reboot, Stop, Terminate, View JSON). We were forced to render icon buttons side-by-side, which clutters wide tables.
* **Proposed API**:
  ```tsx
  <DropdownMenu
    trigger={<IconButton icon={<MoreVertical size={16} />} aria-label="Instance actions" />}
    align="end"
  >
    <DropdownGroup label="Lifecycle">
      <DropdownItem icon={<Play size={14} />} onSelect={handleStart}>Start Instance</DropdownItem>
      <DropdownItem icon={<RotateCcw size={14} />} onSelect={handleReboot}>Reboot</DropdownItem>
      <DropdownItem icon={<Square size={14} />} onSelect={handleStop}>Stop</DropdownItem>
    </DropdownGroup>
    <DropdownDivider />
    <DropdownItem variant="danger" icon={<Trash2 size={14} />} onSelect={handleTerminate}>
      Terminate Instance
    </DropdownItem>
  </DropdownMenu>
  ```

#### B. `CommandPalette` / `CommandDialog` (⌘K Omnibar)
* **Why**: The signature feature of modern developer platforms (Linear, Raycast, Vercel, AWS Console). Enables keyboard-first fuzzy search across services, commands, and cloud resources.
* **Features**: Global hotkey (`⌘K` / `/`), categorized result groups, tactile focus rings.

#### C. `Popover`
* **Why**: An anchor-positioned floating card for rich interactive content (filter panels, mini calendars, column selectors) with click-outside detection and collision flip.

#### D. `ContextMenu`
* **Why**: Native-feeling right-click menus for data tables, tree nodes, and terminal windows.

---

### 4.2 Advanced Data Display & Navigation

#### A. `DataTable` Enhancements & `Pagination`
* **Why**: The existing `Table<T>` is strictly read-only and unpaginated. Enterprise consoles handle hundreds to thousands of records.
* **Proposed API**:
  ```tsx
  <Pagination
    currentPage={page}
    totalPages={24}
    pageSize={25}
    pageSizeOptions={[10, 25, 50, 100]}
    onPageChange={setPage}
    onPageSizeChange={setPageSize}
    totalItems={580}
  />
  ```
* **Additional Capabilities**:
  - Column sorting with comparator callbacks.
  - Row selection with indeterminate checkbox state and floating bulk action bar.
  - Expandable nested sub-rows.

#### B. `EmptyState`
* **Why**: In our dashboard, when search filters returned 0 results, `Table` simply rendered centered plain text. A polished component is standard.
* **Proposed API**:
  ```tsx
  <EmptyState
    icon={<ServerOff size={32} />}
    title="No EC2 Instances Found"
    description="No compute instances match your active search filters in us-east-1."
    action={
      <Button variant="primary" leftIcon={<Plus size={14} />} onClick={handleLaunch}>
        Launch New Instance
      </Button>
    }
  />
  ```

#### C. `TreeView` / `ResourceTree`
* **Why**: Hierarchical exploration for S3 folder trees, IAM organizational units, VPC subnets, and JSON document structures.

#### D. `Stepper` / `Wizard`
* **Why**: Multi-step workflows (e.g., Launch Instance: Hardware -> Networking -> Storage -> Review).

#### E. `Timeline` / `AuditFeed`
* **Why**: Chronological event logs with status-colored nodes for CloudTrail events, audit logs, and CI/CD pipelines.

---

### 4.3 Developer & Code-Centric Primitives

#### A. `CodeBlock` with Syntax Highlighting & Copy
* **Current Gap**: Field has `<Code>` for single-line snippets and `<Terminal>` for CLI emulation, but no component for multi-line JSON, YAML, Bash, or SQL snippets with syntax coloring and line numbers.
* **Proposed API**:
  ```tsx
  <CodeBlock
    code={policyJson}
    language="json"
    showLineNumbers={true}
    highlightLines={[4, 5]}
    title="iam-policy-production.json"
    copyable={true}
    maxHeight="320px"
  />
  ```

#### B. `DiffViewer`
* **Why**: Infrastructure-as-code reviews (Terraform plan diffs), IAM policy edits, configuration version comparisons. Supports unified and split side-by-side views.

#### C. `StatusDot` / `LiveIndicator`
* **Why**: Pill badges can be visually heavy in compact table cells. A subtle status dot with optional pulsing animation is ideal for real-time telemetry.
* **Proposed API**:
  ```tsx
  <StatusDot status="success" pulse={true} label="Running" />
  <StatusDot status="danger" label="Degraded" />
  ```

#### D. `CopyButton`
* **Why**: Micro-component for copying ARNs, IPs, IDs, and endpoints with built-in tooltip feedback (`Copy` -> `Copied!`).

---

### 4.4 Form Controls & Metrics

#### A. `Combobox` / `MultiSelect`
* **Current Gap**: Field’s `<Select>` is single-select only. A searchable multi-select with removable tag chips is necessary for selecting security groups, VPC tags, or regions.

#### B. `NumberInput` / `InputStepper`
* **Why**: Clamped numeric inputs for memory allocation (MB), CPU counts, IOPS limits, with ArrowUp/Down stepping and unit suffixes (`GiB`, `ms`).

#### C. `Sparkline`
* **Why**: Enhancing `<StatCard>` with live 24h mini telemetry trend curves.
* **Proposed API**:
  ```tsx
  <StatCard
    label="CPU UTILIZATION"
    value="42.8%"
    delta={{ value: "+2.1%", trend: "up" }}
    chart={<Sparkline data={[20, 24, 32, 28, 45, 42]} color="accent" height={32} />}
  />
  ```

#### D. `Meter` / `Gauge`
* **Why**: Capacity and quota visualizers (e.g. 78% RAM used, disk volume limit warnings).

---

# PART V: System Architecture & Platform Evolution

### 5.1 Paired Themes (`FieldThemePair`)
* **Problem**: Currently, `FieldTheme` defines either `'dark'` or `'light'`. Toggling modes reverts custom themes back to default Cobalt.
* **Proposed Architecture**: Allow themes to register paired modes under a single ID:
  ```ts
  export interface FieldThemePair {
    id: 'titanium-amber';
    label: 'Titanium Amber';
    dark: FieldTheme;
    light: FieldTheme;
  }
  ```
  `ThemeProvider` then toggles between the pair's light and dark definitions without losing brand identity.

### 5.2 Adopting Headless Primitives Internally
* **Recommendation**: Power complex overlays (`DropdownMenu`, `Modal`, `Popover`, `Tooltip`) using `@radix-ui/react-*` or `@floating-ui/react` internally while keeping Field's CSS classes and tokens.
* **Benefits**:
  - Full WAI-ARIA compliance out of the box.
  - Automatic collision-aware positioning (no dropdowns running off-screen).
  - Robust focus management and keyboard traps.

### 5.3 Tailwind CSS / CSS Modules Integration Package
* **Proposal**: Publish `@sam.barfield/field-tailwind-preset`.
* **Benefit**: Developers can use Field design tokens directly in utility classes:
  ```html
  <div class="bg-field-surface-raised border border-field-border-subtle rounded-field-md text-field-text-primary">
  ```
  This bridges standard component usage with rapid custom layout styling.

### 5.4 Icon System Agnosticism
* **Recommendation**: Avoid hardcoding direct imports to `lucide-react` inside core components. Allowing custom icon nodes guarantees no peer-dependency conflicts with consumer apps using Phosphor, Heroicons, or custom SVG icons.

---

# PART VI: Prioritized Action Plan & Roadmap Matrix

| Phase | Item | Impact | Complexity | Area |
| :--- | :--- | :--- | :--- | :--- |
| **P0 (Immediate)** | Fix `.field-alert-*` hardcoded RGBA to use `var(--field-status-*)` | Critical | 10 mins | CSS Engine |
| **P0 (Immediate)** | Fix `.field-btn-danger` hardcoded hexes | High | 10 mins | CSS Engine |
| **P0 (Immediate)** | Fix `AGENTS.md` Table documentation to match `TableProps<T>` | Critical | 15 mins | Documentation |
| **P1 (Quick Win)** | Add `createPortal` to `Modal` and `Drawer` | High | 30 mins | React Overlays |
| **P1 (Quick Win)** | Replace imperative DOM style mutation in `Select.tsx` with CSS | Medium | 15 mins | React Components |
| **P1 (Quick Win)** | Support paired themes in `ThemeProvider` | High | 1 hour | Tokens / Theme |
| **P2 (Feature)** | Add `DropdownMenu` / `ActionMenu` | High | 2–3 hours | New Component |
| **P2 (Feature)** | Add `Pagination` and column sorting to `Table` | High | 3–4 hours | New Component |
| **P2 (Feature)** | Add `EmptyState` and `StatusDot` | Medium | 1 hour | New Component |
| **P2 (Feature)** | Add `CodeBlock` with syntax highlighting and copy | High | 2 hours | New Component |
| **P3 (Strategic)** | Add `CommandPalette` (⌘K Omnibar) | High | 4–6 hours | New Component |
| **P3 (Strategic)** | Add `Combobox` / `MultiSelect` with tag chips | High | 4–5 hours | New Component |
| **P3 (Strategic)** | Publish `@field/tailwind-preset` | Medium | 2 hours | Developer Tooling |
| **P3 (Strategic)** | Adopt headless primitives (`@radix-ui`) under-the-hood | High | 1–2 days | Architecture |
