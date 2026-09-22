# Component Lifecycle & Synchronization Rule

> **Scope**: All AI coding agents (Antigravity, Gemini, Claude, Cursor, Copilot) operating on the **Field Design System** repository.
> **Enforcement**: Mandatory on any task that creates, renames, deprecates, or modifies a component in `@sam.barfield/field-react`.

---

## The Mandatory 7-Step Component Lifecycle Checklist

Whenever you introduce a new component or significantly alter an existing one in this repository, you **MUST** complete all 7 steps before declaring the task finished:

```
[1. Component Implementation] ──► [2. Design Token CSS] ──► [3. Component Exports]
                                                                     │
┌────────────────────────────────────────────────────────────────────┘
│
▼
[4. Component Manifest] ──► [5. Agent Guidance Files] ──► [6. Showcase Catalog] ──► [7. Verification]
```

### 1. Component Implementation (`packages/react/src/components/<Name>.tsx`)
- **Compound Architecture**: Favor compound components (`<Name>`, `<NameHeader>`, `<NameContent>`, `<NameItem>`) over monolithic prop bags.
- **Accessibility & ARIA**:
  - Appropriate ARIA roles (`role="navigation"`, `role="tablist"`, `role="dialog"`, etc.).
  - Keyboard focus management and accessible labeling (`aria-label`, `aria-expanded`, `aria-controls`).
- **Polymorphic Routing**:
  - For interactive items / links, always support `asChild?: boolean`, `as?: React.ElementType`, and `href?: string` using `renderPolymorphic` from `../utils/polymorphic`.
  - This ensures compatibility with TanStack Router, Next.js `<Link>`, and Remix.

### 2. Design Token CSS (`packages/react/src/styles/field.css`)
- **Strict Token Adherence**:
  - **Zero hardcoded color hexes** (e.g. `#111827`, `#2563EB`) or arbitrary raw pixel margins/paddings.
  - Always use `--field-*` CSS variables:
    - Surfaces: `var(--field-surface-base)`, `var(--field-surface-raised)`, `var(--field-surface-overlay)`, `var(--field-surface-sunken)`
    - Borders: `var(--field-border-subtle)`, `var(--field-border-default)`, `var(--field-border-strong)`, `var(--field-border-focus)`
    - Text: `var(--field-text-primary)`, `var(--field-text-secondary)`, `var(--field-text-tertiary)`
    - Spacing: `var(--field-space-1)` through `var(--field-space-12)`
    - Radii: `var(--field-radius-sm)`, `var(--field-radius-md)`, `var(--field-radius-lg)`
    - Transitions: `var(--field-transition-fast)`, `var(--field-transition-normal)`

### 3. Component Exports (`packages/react/src/components/index.ts`)
- Export all component functions, contexts, hooks, and TypeScript interfaces from `packages/react/src/components/index.ts`.
- Ensure `packages/react/src/index.ts` re-exports `./components`.

### 4. Machine-Readable Component Manifest (`docs/COMPONENT_MANIFEST.json`)
- Register every new component and subcomponent in `docs/COMPONENT_MANIFEST.json`.
- Provide accurate `description`, prop definitions, types, enums, and default values.
- AI tooling and automated scripts rely on this manifest for schema validation and tool calling.

### 5. Agent Guidance Files (`GEMINI.md`, `CLAUDE.md`, `docs/AGENTS.md`)
- Update the **Component Inventory Matrix** across all agent guidance files.
- If the component establishes or replaces an application pattern (such as Shell layouts, Top Nav, or Overlays), update the architecture notes so future agents have zero ambiguity.

### 6. Interactive Showcase Catalog (`apps/showcase/src/components/catalog/catalogRegistry.tsx`)
- Add a new catalog item under the relevant category (`Navigation`, `Actions`, `Forms`, `Layout`, `Data Display`, `Feedback`, `Typography`).
- Include:
  - `id`, `name`, `category`, `description`
  - `compositionTree`: Visual hierarchy diagram
  - `props`: Array of props specifications
  - `interactivePreview`: Functional interactive sandbox rendered within the showcase
  - `usage`: Code snippet showing real-world application

### 7. Build Verification
Always run and pass:
```pwsh
npm run typecheck
npm run build
```
Never commit code with type errors or broken workspace dependencies.
