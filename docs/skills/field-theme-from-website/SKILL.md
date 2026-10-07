---
name: field-theme-from-website
description: Create a Field Design System theme (a light + dark createThemePair) from an existing website's brand - its colours, fonts, corner style and tone - so a rebuild with @sam.barfield/field-react looks like the client's brand and passes WCAG AA. Use when given a website URL (or screenshots / brand guidelines) and asked to make a Field theme, match a brand, or restyle a Field site for a client.
---

# Field theme from a website

Turn a client's existing website into a Field theme: one `createThemePair` with a light and a dark theme, the client's fonts, and every text/surface pairing at WCAG AA. The output is a `theme.ts` file plus a short report of the decisions you made.

Field is `@sam.barfield/field-react` (components) and `@sam.barfield/field-tokens` (tokens, `createThemePair`, `checkThemeContrast`). Read `docs/AGENTS.md` for component usage; this skill only covers the theme.

## What a Field theme contains

`createThemePair` starts from Field's default themes; you override only what differs. Anything omitted is inherited.

| Group | Tokens | Meaning |
|:---|:---|:---|
| `surfaces` | `base` `raised` `overlay` `sunken` `subtle` `active` | Page, cards, menus/dialogs, inputs/wells, hover background, pressed background |
| `text` | `primary` `secondary` `tertiary` `inverse` `disabled` | Body/headings, supporting copy, captions/meta, text on inverted fills, disabled |
| `accent` | `primary` `hover` `active` `subtle` `subtleHover` `contrast` `text` | Brand **fill** (buttons), its states and tints, text **on** the fill, and the brand colour **as text** (links, active nav). `text` defaults to `primary` |
| `borders` | `subtle` `default` `strong` `focus` `highlight` | Dividers, inputs, emphasis, keyboard focus ring (3:1 against the page), top-edge highlight |
| `status.{success,warning,danger,info}` | `base` `surface` `border` `text` | Icon/dot colour, alert background, alert border, readable status text |
| `fonts` | `display` `sans` `mono` | Headings, body and controls, code |
| `radii` | `xs` `sm` `md` `lg` `xl` | Corner scale (`md` is buttons and inputs) |
| `typography` | `headingWeight` `displayWeight` `headingTracking` `headingStretch` | Heading weight for levels 2-4 and for level 1 / display; letter-spacing multiplier (0 = none, 1 = Field default); font-stretch |
| `band` (pair option) | any semantics | Separate dark theme for photo sections and inverse bands on a light page. Omit unless needed |

## Workflow

### 1. Gather the brand

Visit the site (browser tool, fetched HTML/CSS, or screenshots the user provides). Look at the home page plus one inner page and the contact page. Collect:

- **Brand colours:** the logo (often the truest brand colour), primary buttons, links, header/nav background, footer, section backgrounds, and any accent used for highlights. Prefer colours defined in CSS (custom properties, button rules) over colours sampled from photos.
- **Neutrals:** page background, card/panel backgrounds, body text colour, muted text colour, border colour. Note whether greys are warm, cool or neutral.
- **Fonts:** `font-family` of headings and body. Check the `<link>` to Google Fonts / Typekit or `@font-face` rules. Note heading weight and whether headings are uppercase, tight or wide.
- **Shape:** button and card corner radius (sharp, slightly rounded, pill).
- **Tone:** dense and corporate, warm and friendly, bold and industrial, editorial. This guides radius, weight and tracking.

If you can run JavaScript on the page, this collects most of it in one go:

```js
(() => {
  const css = el => el && getComputedStyle(el);
  const pick = (sel) => { const el = document.querySelector(sel); const s = css(el); return s && { sel, color: s.color, bg: s.backgroundColor, font: s.fontFamily, weight: s.fontWeight, radius: s.borderRadius, transform: s.textTransform, spacing: s.letterSpacing }; };
  const vars = [...document.styleSheets].flatMap(sh => { try { return [...sh.cssRules]; } catch { return []; } })
    .filter(r => r.selectorText === ':root').flatMap(r => [...r.style].filter(p => p.startsWith('--')).map(p => `${p}: ${r.style.getPropertyValue(p).trim()}`));
  const colours = {};
  document.querySelectorAll('body *').forEach(el => { const s = css(el); for (const v of [s.color, s.backgroundColor, s.borderTopColor]) if (v && !v.includes('0)') && v !== 'rgba(0, 0, 0, 0)') colours[v] = (colours[v] || 0) + 1; });
  return {
    body: pick('body'), h1: pick('h1'), h2: pick('h2'), link: pick('main a, a'), button: pick('button, .btn, [class*="button"], a[class*="btn"]'),
    header: pick('header'), footer: pick('footer'), cssVariables: vars.slice(0, 80),
    topColours: Object.entries(colours).sort((a, b) => b[1] - a[1]).slice(0, 25),
    fontLinks: [...document.querySelectorAll('link[href*="fonts"]')].map(l => l.href),
  };
})();
```

Write down a short brand summary before building anything: brand colour(s) with hex values and where each came from, neutrals, fonts, radius, tone.

### 2. Decide the accent

- **`accent.primary`** is the main call-to-action colour (usually the button colour, or the logo colour if buttons are generic). One accent; secondary brand colours become status colours, badges or decoration, not a second accent.
- **`accent.contrast`** is white or near-black, whichever passes 4.5:1 on `primary` **and** `hover`. Yellows, ambers, limes and light cyans usually need dark text.
- If the brand colour is close but fails (e.g. white on it is 4.2:1), deepen it by a few lightness points rather than changing hue. Say so in the report.
- **`hover` / `active`:** light mode, hover a step darker and active darker still; dark mode, hover a step lighter. Both must keep `contrast` text at 4.5:1.
- **`subtle` / `subtleHover`:** the primary at about 8% / 14% alpha (light) and 14% / 22% (dark), written as `rgba()`.
- **`accent.text`:** set it whenever `primary` is below 4.5:1 as text on `surfaces.base`, `raised`, `sunken` or on `subtle`. This is common for reds, oranges and yellows in dark mode, and for light brand colours in light mode. Keep the hue and move lightness only. Never lower the fill's quality to make it readable as text; that is what `accent.text` is for.

### 3. Build the neutrals

- **Light mode:** `base` is the site's page colour (often white or a warm/cool off-white). `raised` and `overlay` are usually `#FFFFFF`; `sunken` is 3-5% darker than base; `subtle` 2-3% darker; `active` 7-9% darker. Keep the site's undertone (warm, cool or neutral) across all of them.
- **Dark mode:** build it even if the site has none; it must feel like the same brand at night. `base` around 4-8% lightness with the same undertone; each layer above it slightly lighter (`raised` +3, `overlay` +6, `subtle` +7, `active` +11 lightness points); `sunken` a little darker than base.
- **Text:** `primary` is the site's body/heading colour (near-black in light mode, near-white in dark). `secondary` about 7:1 and `tertiary` about 5:1 against `base`, and **every tier at least 4.5:1 on `base`, `raised` and `sunken`**. `inverse` is the page colour of the opposite mode; `disabled` is a soft mix with no contrast requirement.
- **Borders:** translucent versions of the text colour adapt to every surface: about `rgba(text, 0.07)` / `0.13` / `0.24` for `subtle` / `default` / `strong` in light mode, and slightly higher alphas in dark mode. `focus` is usually the text primary or accent text, at 3:1 or more against `base`.

### 4. Status colours

Keep Field's defaults unless they clash. The main rule: **`status.danger` must be a visibly different hue from the accent (at least 20-30° apart)**, or errors look like branding. With a red brand, use a raspberry/pink danger (hue about 330-340°), not orange (that reads as warning). Status `text` must pass 4.5:1 on `base` and on its own `surface` tint.

### 5. Type and shape

- **Fonts:** use the site's fonts. List fallbacks: `'"Lato", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'`. If the font is a variable font loaded through Fontsource, put its variable family first (`"Inter Variable", "Inter", ...`). Set `display` (headings) and `sans` (body and controls) in `shared.fonts`. If the site's font is unavailable or unlicensed, pick the closest free Google Font and say so.
- **Typography:** heavy grotesques and condensed industrial faces often want `displayWeight: 800` and `headingTracking: 0.5` (less negative tracking). Serifs usually look best at `headingWeight: 600`, `displayWeight: 700`, tracking `0.5` to `1`. Leave the defaults if the headings already look right.
- **Radii:** sharp corporate/industrial sites `md` 2-4px; most sites 6-8px; friendly consumer brands 10-12px; pill buttons are a component choice, not a theme radius. Scale the rest from `md`: `xs` about 0.4×, `sm` 0.7×, `lg` 1.5×, `xl` 2×.

### 6. Photo and inverse bands

Sections with a background photo and `tone="inverse"` bands on a light page use the **dark** theme. If dark mode uses a lighter tint of the brand for text (step 2), the bands still get the real brand fill because `accent.primary` is unchanged. Only add `band: { semantics: { ... } }` when the bands genuinely need different tokens from dark mode (for example a different fill or focus ring on photos).

### 7. Write the theme

```ts
import { createThemePair } from '@sam.barfield/field-tokens';

/*
 * <Client> brand theme.
 * Source: <where each colour and font came from>.
 * Notes: <any colour you adjusted for contrast, and why>.
 * Run the contrast check after changing any colour.
 */
export const brandPair = createThemePair({
  id: 'brand',
  label: 'Brand',
  shared: {
    fonts: { display: '"Archivo", system-ui, sans-serif', sans: '"Lato", system-ui, sans-serif' },
    radii: { xs: '2px', sm: '3px', md: '4px', lg: '6px', xl: '10px' },
    typography: { displayWeight: 800, headingTracking: 0.5 },
  },
  light: {
    semantics: {
      surfaces: { base: '#FFFFFF', raised: '#FFFFFF', overlay: '#FFFFFF', sunken: '#F3F3F5', subtle: '#EDEDF0', active: '#E2E1E6' },
      text: { primary: '#0A0A0A', secondary: '#3D3B43', tertiary: '#605F5F', inverse: '#FFFFFF', disabled: '#A9A8AE' },
      accent: { primary: '#D00000', hover: '#B00000', active: '#930000', subtle: 'rgba(208, 0, 0, 0.07)', subtleHover: 'rgba(208, 0, 0, 0.13)', contrast: '#FFFFFF' },
      status: { danger: { base: '#BE185D', surface: 'rgba(190, 24, 93, 0.07)', border: 'rgba(190, 24, 93, 0.28)', text: '#9D174D' } },
    },
  },
  dark: {
    semantics: {
      surfaces: { base: '#111114', raised: '#19191D', overlay: '#212126', sunken: '#0B0B0D', subtle: '#24242A', active: '#2E2E35' },
      text: { primary: '#F4F4F6', secondary: '#C6C5CC', tertiary: '#9B9AA3', inverse: '#0A0A0A', disabled: '#56555D' },
      // Same red fill with white text; a lighter coral wherever red is text.
      accent: { primary: '#D00000', hover: '#E00000', active: '#B00000', subtle: 'rgba(255, 92, 82, 0.13)', subtleHover: 'rgba(255, 92, 82, 0.21)', contrast: '#FFFFFF', text: '#FF5C52' },
      status: { danger: { base: '#F472B6', surface: 'rgba(244, 114, 182, 0.11)', border: 'rgba(244, 114, 182, 0.32)', text: '#F9A8D4' } },
    },
  },
});
```

Use it with `<ThemeProvider themePair={brandPair} defaultMode="light" storageKey="site-theme">`. Most client websites should default to `light`.

Rules for the file:
- Hex for opaque colours, `rgba()` for translucent ones. No `color-mix()`, CSS variables or named colours in tokens (the contrast checker cannot read them).
- Override whole groups you have designed (`surfaces`, `text`, `accent`) in both modes so nothing silently inherits Field's blue/slate defaults. If you override `accent.primary` without `accent.text`, links use the new primary.
- Comment where each brand value came from and every value you adjusted for accessibility.

### 8. Check contrast (required)

Run the checker on both modes and fix every failure before handing over:

```ts
import { checkThemeContrast } from '@sam.barfield/field-tokens';
import { brandPair } from './theme';

for (const mode of ['light', 'dark'] as const) {
  const failing = checkThemeContrast(brandPair[mode]).filter(c => !c.pass);
  console.log(mode, failing.map(c => `${c.label} ${c.ratio.toFixed(2)}:1 (needs ${c.minimum})`));
}
```

Or pass `checkContrast: true` to `createThemePair` while designing (it `console.warn`s failures). It checks body text tiers on every surface, accent text, text on the accent fill and its hover, status text on the page and on its tint, and the focus ring. To fix a failure, move the **foreground's lightness** (keep its hue) until it passes; for text on the accent fill, switch `contrast` between white and near-black first, then adjust the fill's lightness. Also confirm the danger/accent hue gap yourself.

For a project, add a script such as `npm run contrast` that runs this check and exits non-zero on failure.

### 9. Verify visually

If you can run the site: render a page with a navbar, primary/outline/ghost buttons, a card with secondary and tertiary text, a form field with an error, the four alerts, a `tone="accent"` section and a photo `Section`. Check light and dark mode, then compare with the original site side by side. The brand should be recognisable in both modes, buttons and links unmistakably on-brand, and errors clearly not the brand colour.

The Field showcase has a **Theme Builder** (`#/theme-editor`) for this: import the pair as JSON, preview both modes, use the Contrast tab's fixes, and export `createThemePair` code. Point the user to it when they want to fine-tune by eye.

### 10. Hand over

Deliver:
1. `src/theme.ts` (the pair, commented).
2. The contrast check result (all pass), or the exact pairings you left failing and why.
3. A short report: the brand values you found and their sources, what you adjusted and why (with before/after hex and ratios), font choices and licensing notes, and anything you could not determine.
4. Font loading: self-host in production (e.g. `npm install @fontsource-variable/archivo @fontsource/lato`, then `import '@fontsource-variable/archivo/wght.css'` and only the Lato weights/subsets used) rather than a render-blocking Google Fonts stylesheet.

## Pitfalls

- **Matching the old site's mistakes.** Old sites often have low-contrast grey text or brand-coloured body links that fail AA. Match the look, not the failures, and report each change.
- **One colour doing two jobs.** If the brand colour fails as text on the dark page, do not lighten the button fill; set `accent.text`.
- **Leaving dark mode as Field's default blue.** Always design the dark theme's accent and neutrals from the brand.
- **Danger equals brand.** Red, orange and pink brands need a danger colour of a clearly different hue.
- **Sampling photos.** Colours from photographs and gradients are rarely brand colours; use CSS, logos and buttons.
- **Too many accents.** Field has one accent. Extra brand colours go into imagery, badges or a custom CSS class using `--field-*` tokens.
- **Tokens that cannot be checked.** `color-mix()`, `var()` and named colours make contrast checks skip a pairing.
- **Forgetting fonts.** Themes only name font families; the app must load them.
