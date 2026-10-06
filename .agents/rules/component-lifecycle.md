# Component Lifecycle & Synchronization Rule

> **Scope**: All AI coding agents (Claude, Gemini, Cursor, Copilot) working on the **Field Design System** repository.
> **Enforcement**: Mandatory for any task that creates, renames, deprecates or changes a component in `@sam.barfield/field-react`.

## Checklist

### 1. Implementation (`packages/react/src/components/<Name>.tsx`)
- Start the file with `'use client';` and end relative imports with `.js`.
- Prefer compound components (`<Name>`, `<NameHeader>`, `<NameItem>`) over large prop bags.
- **Accessibility**: native elements where possible; correct WAI-ARIA pattern otherwise; full keyboard support; generated ids (`useId`) to link labels, descriptions and errors.
- **Overlays**: portal with `usePortalThemeProps()`, position with `useAnchoredPosition`, dismiss with `useDismissableLayer`; dialogs also use `useFocusTrap` and `useScrollLock`.
- **State**: support controlled and uncontrolled use via `useControllableState`; `onChange` receives the value.
- **Links**: interactive items support `asChild`, `as` and `href` (`renderPolymorphic` + `getInteractiveElementProps`).
- **Docs**: JSDoc on the component (summary + `@example`) and on every prop.

### 2. Styles (`packages/react/src/styles/field.css`)
- Only `--field-*` tokens (surfaces, borders, text, accent, status, `--field-space-*`, `--field-radius-*`, `--field-shadow-*`, `--field-duration-*`, `--field-ease-*`). No hex colours or arbitrary pixel spacing.
- Prefix classes with `field-`; provide `:focus-visible` styles; respect `prefers-reduced-motion`.

### 3. Exports
- Export components, hooks and types from `packages/react/src/components/index.ts` (re-exported by `src/index.ts`).

### 4. Manifest
- Run `npm run docs:manifest`. It regenerates `docs/COMPONENT_MANIFEST.json` from the source; never edit it by hand. Check the new component appears with descriptions for every prop.

### 5. Docs site (`apps/showcase/src/docs`)
- Add or update the page in `componentPages.ts` (summary, `api`, when to use, accessibility, keyboard, related).
- Add examples in `examples/<page-id>/NN-name.tsx`. Each file default-exports a component and starts with `// title:` and optional `// description:` comments; the source is shown verbatim, so keep it realistic and copy-pasteable.

### 6. Agent guidance
- Update the inventory in `CLAUDE.md` and `GEMINI.md`, and recipes / notes in `docs/AGENTS.md` if the change affects how the component is used.
- Add a `CHANGELOG.md` entry.

### 7. Verification
```bash
npm run typecheck
npm run build
```
Then open the component's docs page (`npm run dev`) and check the examples with mouse and keyboard, in dark and light mode.
