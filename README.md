# Field Design System

**Field** is a React design system for dashboards, consoles and developer tools, and for the customer-facing websites around them: accessible components, a token-driven theme engine with light-mode parity and website theme presets, and documentation generated from the source.

```tsx
import '@sam.barfield/field-react/styles.css';
import { ThemeProvider, ToastProvider, Button } from '@sam.barfield/field-react';

export function App() {
  return (
    <ThemeProvider defaultMode="system" storageKey="theme">
      <ToastProvider>
        <Button variant="primary">Deploy</Button>
      </ToastProvider>
    </ThemeProvider>
  );
}
```

## Using Field in an app

1. Point npm at the registry (`.npmrc`):
   ```ini
   @sam.barfield:registry=https://gitlab.xencloud.io/api/v4/packages/npm/
   //gitlab.xencloud.io/api/v4/packages/npm/:_authToken=${GITLAB_NPM_TOKEN}
   ```
2. `npm install @sam.barfield/field-react` (React 18 or 19).
3. Import `@sam.barfield/field-react/styles.css` once. It includes the default theme variables, so pages are styled before hydration.
4. Wrap the app in `ThemeProvider` (and `ToastProvider` if you use toasts).

The docs site (`npm run dev`) has guides for installation, theming, Tailwind, routers, forms, accessibility and SSR, plus a page with live examples and a generated API table for every component.

## Repository

| Path | Purpose |
|:---|:---|
| [`packages/tokens`](./packages/tokens) | `@sam.barfield/field-tokens`: colour scales, themes, `createTheme`, CSS / DTCG / TS exporters, Tailwind preset, plain CSS themes |
| [`packages/react`](./packages/react) | `@sam.barfield/field-react`: components, `ThemeProvider`, hooks and the stylesheet (re-exports the tokens package) |
| [`apps/showcase`](./apps/showcase) | Docs site: guides, component pages, sticker sheet, theme editor and full-page examples |
| [`docs/COMPONENT_MANIFEST.json`](./docs/COMPONENT_MANIFEST.json) | Every component, prop, type, default and description, generated from source |
| [`docs/AGENTS.md`](./docs/AGENTS.md) | Rules and recipes for AI coding assistants |
| [`docs/DESIGN_PHILOSOPHY.md`](./docs/DESIGN_PHILOSOPHY.md) | Visual principles behind the system |

## Development

```bash
npm install
npm run dev            # docs site at http://localhost:5173
npm run typecheck      # all packages + showcase
npm run build          # tokens → react → manifest → showcase
npm run docs:manifest  # regenerate docs/COMPONENT_MANIFEST.json after changing props/JSDoc
npm run yalc:all       # publish local builds to yalc for testing in another app
```

Prop descriptions in the docs come from JSDoc comments on the component props interfaces, so document new props there. Adding a component page to the docs means adding an entry to `apps/showcase/src/docs/componentPages.ts` and example files under `apps/showcase/src/docs/examples/<page-id>/`. See [`.agents/rules/component-lifecycle.md`](./.agents/rules/component-lifecycle.md) for the full checklist.
