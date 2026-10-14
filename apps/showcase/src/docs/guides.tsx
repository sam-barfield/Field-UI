import React from 'react';
import { Badge, Button, Card, Grid, Stack, Text } from '@sam.barfield/field-react';
import { ArrowRight, Blocks, Palette, Route, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { componentPages } from './componentPages';
import { manifest, type ManifestUtility } from './manifest';
import { C, Callout, DocLink, DocPage, H3, List, P, PropsTable, Section, Snippet, renderInlineCode } from './docKit';

export interface GuideDef {
  slug: string;
  title: string;
  group: 'Getting started' | 'Guides';
  render: React.FC;
}

/* ------------------------------------------------------------------ */

const Introduction: React.FC = () => (
  <DocPage
    eyebrow="Field Design System"
    title="Build dense, polished product UI quickly"
    lead="Field is a dark-first React design system for dashboards, consoles and developer tools: accessible components, a token-driven theme engine, and sensible defaults so you can stay in your product code."
  >
    <div className="docs-hero-actions">
      <Button as="a" href="#/docs/installation" variant="primary" rightIcon={<ArrowRight size={16} />}>
        Get started
      </Button>
      <Button as="a" href="#/components/button" variant="secondary">
        Browse components
      </Button>
    </div>

    <Grid minChildWidth={240} gap={16} className="docs-feature-grid">
      {[
        { icon: <Blocks size={18} />, title: `${componentPages.length} component pages`, body: `${Object.keys(manifest.components).length} exported components, from buttons to data tables, navbars and command palettes.` },
        { icon: <ShieldCheck size={18} />, title: 'Accessible by default', body: 'Native inputs, focus management, keyboard support and ARIA patterns are built in, not bolted on.' },
        { icon: <Palette size={18} />, title: 'Themeable', body: 'Every colour, radius and shadow is a CSS variable. Ship the built-in themes or create your own in a few lines.' },
        { icon: <Route size={18} />, title: 'Router friendly', body: 'Links accept as={Link} or asChild, so Next.js, React Router and TanStack Router just work.' },
        { icon: <Zap size={18} />, title: 'SSR ready', body: 'Default theme variables ship in the stylesheet, components are marked use client, and ESM output runs in Node.' },
        { icon: <Sparkles size={18} />, title: 'Typed and documented', body: 'Every prop is typed and documented. The API tables on these pages are generated straight from the source.' },
      ].map(f => (
        <Card key={f.title} padding="lg">
          <Stack gap={8}>
            <span className="docs-feature-icon">{f.icon}</span>
            <Text weight="semibold">{f.title}</Text>
            <Text size="sm" tone="secondary">{f.body}</Text>
          </Stack>
        </Card>
      ))}
    </Grid>

    <Section id="at-a-glance" title="At a glance">
      <Snippet
        code={`import '@sam.barfield/field-react/styles.css';
import { ThemeProvider, ToastProvider, Button, useToast } from '@sam.barfield/field-react';

function SaveButton() {
  const { showToast } = useToast();
  return (
    <Button variant="primary" onClick={() => showToast({ title: 'Saved', variant: 'success' })}>
      Save changes
    </Button>
  );
}

export function App() {
  return (
    <ThemeProvider defaultMode="system" storageKey="theme">
      <ToastProvider>
        <SaveButton />
      </ToastProvider>
    </ThemeProvider>
  );
}`}
      />
    </Section>

    <Section id="packages" title="Packages">
      <div className="docs-table-wrap">
        <table className="docs-table">
          <thead>
            <tr><th>Package</th><th>What it contains</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><C>@sam.barfield/field-react</C></td>
              <td>React components, <C>ThemeProvider</C>, hooks and the stylesheet. Re-exports everything from the tokens package, so this is usually the only import you need.</td>
            </tr>
            <tr>
              <td><C>@sam.barfield/field-tokens</C></td>
              <td>Framework-agnostic design tokens: colour scales, themes, <C>createTheme</C>, CSS/DTCG exporters, a Tailwind preset and plain CSS theme files.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Section>

    <Section id="next-steps" title="Next steps">
      <List
        items={[
          <><DocLink to="docs/installation">Installation</DocLink> - add the packages, stylesheet and providers.</>,
          <><DocLink to="docs/theming">Theming</DocLink> - pick a theme, toggle dark/light, build your own.</>,
          <><DocLink to="docs/routing">Routing & links</DocLink> - wire components to your router.</>,
          <><DocLink to="docs/forms">Forms</DocLink> - controlled vs uncontrolled, native forms and React Hook Form.</>,
        ]}
      />
    </Section>
  </DocPage>
);

/* ------------------------------------------------------------------ */

const Installation: React.FC = () => (
  <DocPage title="Installation" lead="Add Field to a React 18 or 19 app in four steps.">
    <Section id="registry" title="1. Point npm at the registry">
      <P>
        The packages are published to a private GitLab registry. Add this to the <C>.npmrc</C> next to your{' '}
        <C>package.json</C> (keep the token out of version control, e.g. via an environment variable):
      </P>
      <Snippet
        language="ini"
        title=".npmrc"
        code={`@sam.barfield:registry=https://gitlab.xencloud.io/api/v4/packages/npm/
//gitlab.xencloud.io/api/v4/packages/npm/:_authToken=\${GITLAB_NPM_TOKEN}`}
      />
    </Section>

    <Section id="install" title="2. Install">
      <Snippet language="bash" code="npm install @sam.barfield/field-react" />
      <P>
        <C>react</C> and <C>react-dom</C> (18 or 19) are peer dependencies. The tokens package and <C>lucide-react</C>{' '}
        are installed automatically; install <C>lucide-react</C> yourself if you want to use its icons in your own code
        (all examples here do).
      </P>
      <P>
        <C>htmlparser2</C> is installed too, for <DocLink to="components/prose">ProseHtml</DocLink>. It is only bundled
        if you import <C>ProseHtml</C> or <C>htmlToReact</C>, and it needs Node 20.19 or newer (older versions show an
        npm engine warning).
      </P>
    </Section>

    <Section id="styles" title="3. Import the stylesheet">
      <P>Import it once, at the root of your app (e.g. <C>main.tsx</C>, <C>app/layout.tsx</C> or <C>_app.tsx</C>):</P>
      <Snippet code={`import '@sam.barfield/field-react/styles.css';`} />
      <P>
        It contains the component styles <em>and</em> the default theme variables (dark on <C>:root</C>, light under{' '}
        <C>[data-theme="light"]</C>), so the page is styled before React hydrates. It also removes the browser's
        default <C>body</C> margin so full-width bands reach the edges of the window; the reset has zero specificity,
        so any <C>body</C> rule of your own still wins. If you define all theme variables yourself, import{' '}
        <C>@sam.barfield/field-react/styles/components.css</C> instead.
      </P>
      <H3>Cascade layers and resets</H3>
      <P>
        Field's styles live in the <C>field</C> cascade layer, so any unlayered CSS of yours beats them without
        matching their specificity. That includes resets: an unlayered <C>{'button { background: none }'}</C> or{' '}
        <C>{'* { margin: 0 }'}</C> would strip Field's components. Put resets in a layer ordered before{' '}
        <C>field</C>. Layer order is set by first appearance, so declare it in a file imported before Field's stylesheet:
      </P>
      <Snippet
        language="css"
        title="layers.css (import first)"
        code={`@layer reset, field;

@layer reset {
  /* your resets */
}`}
      />
      <H3>Fonts</H3>
      <P>
        Field uses Inter and JetBrains Mono, falling back to system fonts. They are not bundled. The quickest way to
        try them is Google Fonts:
      </P>
      <Snippet
        language="html"
        code={`<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />`}
      />
      <P>
        For production, self-host them instead. A third-party stylesheet blocks the first render while the browser
        connects to another origin; with Fontsource the font files ship in your own bundle. Import only the weights
        you use, and the <C>latin</C> subset if your content is English:
      </P>
      <Snippet
        code={`// npm install @fontsource-variable/inter @fontsource/jetbrains-mono
import '@fontsource-variable/inter';              // one variable file covers every weight
import '@fontsource/jetbrains-mono/latin-400.css';`}
      />
      <P>
        A variable font registers under its own family name (<C>"Inter Variable"</C>), so put it first in your theme's
        font stack: <C>{'fonts: { sans: \'"Inter Variable", "Inter", system-ui, sans-serif\' }'}</C>.
      </P>
    </Section>

    <Section id="providers" title="4. Add the providers">
      <Snippet
        code={`import { ThemeProvider, ToastProvider } from '@sam.barfield/field-react';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultMode="system" storageKey="my-app-theme">
    <ToastProvider>
      <App />
    </ToastProvider>
  </ThemeProvider>
);`}
      />
      <List
        items={[
          <><C>ThemeProvider</C> applies the theme and powers <C>useTheme()</C>. Components still render with the default theme without it, but you need it to switch themes or modes.</>,
          <><C>ToastProvider</C> is only needed if you use <C>useToast()</C>.</>,
          <><C>defaultMode="system"</C> follows the OS setting; <C>storageKey</C> remembers the user's choice.</>,
        ]}
      />
      <Callout tone="success" title="That's it">
        Render a <C>{'<Button variant="primary">'}</C> to check everything is wired up, then head to{' '}
        <DocLink to="docs/theming">Theming</DocLink>.
      </Callout>
    </Section>

    <Section id="typescript" title="TypeScript">
      <P>
        Types ship with the packages. Every prop has JSDoc, so hovering a prop in your editor shows the same
        description as the API tables here. Generic components infer their value type from the options:
      </P>
      <Snippet
        code={`type Region = 'us-east-1' | 'eu-west-1';

<Select<Region>
  value={region}
  onChange={setRegion} // (value: Region) => void
  options={[{ value: 'us-east-1', label: 'US East' }, { value: 'eu-west-1', label: 'EU West' }]}
/>`}
      />
    </Section>
  </DocPage>
);

/* ------------------------------------------------------------------ */

const Theming: React.FC = () => (
  <DocPage
    title="Theming"
    lead="Themes are plain objects of design tokens. ThemeProvider turns the active theme into CSS variables, so every component (and your own CSS) updates instantly."
  >
    <Section id="built-in" title="Built-in themes">
      <P>
        Themes come in dark/light <em>pairs</em> so the mode toggle has a matching counterpart. The default pair is{' '}
        Obsidian / Cobalt.
      </P>
      <Snippet
        code={`import { ThemeProvider, cobaltThemePair, titaniumAmberPair, emeraldPrecisionPair } from '@sam.barfield/field-react';

<ThemeProvider themePair={titaniumAmberPair} defaultMode="dark">…</ThemeProvider>`}
      />
      <P>
        <C>themePairs</C> lists all pairs and <C>themePresets</C> lists every individual theme (including{' '}
        <C>hyperVioletTheme</C> and <C>highContrastDarkTheme</C>), handy for building a theme picker.
      </P>
    </Section>

    <Section id="website-themes" title="Website themes">
      <P>
        Five light-first pairs are designed for customer-facing sites. Each sets colours, corner radii and a font
        pairing; <C>businessThemePairs</C> lists them. Try them with the theme picker in the header.
      </P>
      <List
        items={[
          <><C>roasteryPair</C>: cafés, bakeries, restaurants. Cream and espresso, terracotta accent, Fraunces + DM Sans.</>,
          <><C>workshopPair</C>: plumbers, electricians, builders. Navy with safety orange, tight corners, Archivo + Inter.</>,
          <><C>storefrontPair</C>: online shops. Clean white, near-black buttons, Manrope + Inter.</>,
          <><C>sagePair</C>: salons, studios, therapists. Sage green, soft corners, Lora + Nunito Sans.</>,
          <><C>counselPair</C>: law firms, accountants, consultants. Navy (gold in dark mode), Libre Baskerville + Source Sans 3.</>,
        ]}
      />
      <Snippet
        code={`import { ThemeProvider, roasteryPair } from '@sam.barfield/field-react';

<ThemeProvider themePair={roasteryPair} defaultMode="light">…</ThemeProvider>`}
      />
      <Callout title="Load the fonts">
        Fonts are not bundled. Add the webfonts the preset names (e.g. from Google Fonts), or the stack falls back to
        system serif / sans fonts. <C>{'roasteryPair.light.fonts'}</C> lists the stacks.
      </Callout>
    </Section>

    <Section id="switching" title="Switching mode and theme">
      <Snippet
        code={`import { useTheme, IconButton } from '@sam.barfield/field-react';
import { Moon, Sun } from 'lucide-react';

function ThemeToggle() {
  const { mode, toggleMode } = useTheme();
  return (
    <IconButton
      variant="ghost"
      aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      icon={mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      onClick={toggleMode}
    />
  );
}`}
      />
      <P>
        <C>useTheme()</C> also gives you <C>setMode('light')</C>, <C>setThemePair(pair)</C>, <C>setTheme(theme)</C> and the
        active <C>theme</C> object.
      </P>
    </Section>

    <Section id="custom" title="Create your own theme">
      <P>
        <C>createThemePair</C> starts from the default themes; override only what you need. Anything you leave out is
        inherited.
      </P>
      <Snippet
        code={`import { createThemePair } from '@sam.barfield/field-react';

export const acme = createThemePair({
  id: 'acme',
  label: 'Acme',
  shared: {
    radii: { sm: '4px', md: '6px', lg: '10px' },
  },
  dark: {
    semantics: { accent: { primary: '#E11D48', hover: '#F43F5E', active: '#BE123C', subtle: 'rgba(225, 29, 72, 0.14)' } },
  },
  light: {
    semantics: { accent: { primary: '#BE123C', hover: '#9F1239', active: '#881337', subtle: 'rgba(190, 18, 60, 0.08)' } },
  },
});

<ThemeProvider themePair={acme}>…</ThemeProvider>`}
      />
      <P>
        Themes can also set <C>fonts</C>: <C>{'shared: { fonts: { display: \'"Fraunces", Georgia, serif\' } }'}</C>.{' '}
        <C>display</C> is used by headings, <C>sans</C> by body text and controls.
      </P>
      <P>
        For a single theme use <C>createTheme({'{'} id, base, semantics, radii, fonts, typography {'}'})</C>.
      </P>
      <P>
        The quickest way to get the values is the <DocLink to="theme-editor">Theme Builder</DocLink>. Start from the
        closest preset, set your brand colour (it derives hover states, tints, button text and a readable text tint for
        you), generate neutrals, pick fonts, and watch a light and a dark preview update as you go. The Contrast tab
        checks every pairing in both modes and fixes failures with the smallest lightness change. Export the result as
        the <C>createThemePair</C> code above, containing only what differs from Field's defaults. Save a snapshot
        before a big change and use Compare to see exactly which tokens moved.
      </P>
    </Section>

    <Section id="brand-colours" title="Brand colours that fight dark mode">
      <P>
        The accent does two jobs. <C>accent.primary</C> is a <em>fill</em>: buttons, toggles and indicators, with{' '}
        <C>accent.contrast</C> text on top. <C>accent.text</C> is the accent as <em>foreground</em>: links,{' '}
        <C>{'Text tone="accent"'}</C>, active nav items and accent icons. It defaults to the primary colour, which is
        fine for most blues and greens. Strong reds, oranges and yellows are different: a red dark enough to carry white
        button text is too dark to read as text on a near-black page. Keep the true brand colour as the fill and give
        dark mode a lighter tint for text.
      </P>
      <P>
        <C>band</C> gives photo and inverse sections their own dark theme, for when they need different tokens from dark
        mode. <C>typography</C> tunes headings for your display font: geometric and grotesque faces often want a
        heavier <C>displayWeight</C> and less negative tracking than Field's defaults.
      </P>
      <Snippet
        code={`import { createThemePair, checkThemeContrast } from '@sam.barfield/field-tokens';

export const brand = createThemePair({
  id: 'brand',
  shared: {
    fonts: { display: '"Archivo", system-ui, sans-serif', sans: '"Lato", system-ui, sans-serif' },
    typography: { displayWeight: 800, headingTracking: 0.5 },
  },
  light: { semantics: { accent: { primary: '#D00000', contrast: '#FFFFFF' } } },
  // Dark mode: white text on red fills, a lighter red wherever red is text.
  dark: { semantics: { accent: { primary: '#D00000', contrast: '#FFFFFF', text: '#FF6B61' } } },
  // Photo bands keep the true brand red.
  band: { semantics: { accent: { primary: '#D00000', contrast: '#FFFFFF' } } },
  checkContrast: true, // console.warn every pairing below WCAG AA while you design
});

checkThemeContrast(brand.dark).filter(c => !c.pass); // or check in a test / script`}
      />
      <List
        items={[
          <>Check both modes. A colour that works on white often fails on a dark surface, and the other way round.</>,
          <>Pick <C>status.danger</C> so it can't be mistaken for the brand: with a red brand, a raspberry or pink-leaning danger keeps error states distinct. Always pair error colour with text too.</>,
          <>Test <C>tone="accent"</C> sections: their secondary text is a slightly lighter mix of <C>accent.contrast</C>, so aim for at least 5:1 between <C>accent.contrast</C> and <C>accent.primary</C>.</>,
          <>Put <C>checkThemeContrast</C> in a unit test (see <DocLink to="docs/frameworks">Testing</DocLink>) so a later colour tweak can't quietly break AA.</>,
        ]}
      />
    </Section>

    <Section id="scoped" title="Scoped themes">
      <P>
        <C>ThemeScope</C> applies a different theme or mode to part of the page, e.g. a light preview card inside a dark
        app. Portals opened from inside (tooltips, modals, menus) inherit the scoped theme.
      </P>
      <Snippet
        code={`import { ThemeScope, Card } from '@sam.barfield/field-react';

<ThemeScope mode="light">
  <Card>Always light, whatever the page mode is.</Card>
</ThemeScope>`}
      />
    </Section>

    <Section id="without-react" title="Themes without JavaScript">
      <P>Every built-in pair is also shipped as a plain stylesheet, useful for static pages, emails or non-React apps:</P>
      <Snippet
        code={`import '@sam.barfield/field-tokens/tokens.css';               // default pair
import '@sam.barfield/field-tokens/themes/titanium-amber.css'; // any pair by id`}
      />
      <P>
        Switch mode by setting <C>data-theme="light"</C> on <C>{'<html>'}</C>. To generate CSS for a custom theme, use{' '}
        <C>themePairToCssString(pair)</C> or <C>themeToCssString(theme, selector)</C>.
      </P>
    </Section>

    <Section id="api" title="API reference">
      <P>
        Hooks (<C>useTheme</C>, <C>useThemeSafe</C>, <C>usePortalThemeProps</C>) and the theme objects and exporters are
        listed in <DocLink to="docs/utilities">Hooks & utilities</DocLink>.
      </P>
      <PropsTable component="ThemeProvider" />
      <PropsTable component="ThemeScope" />
    </Section>
  </DocPage>
);

/* ------------------------------------------------------------------ */

const Websites: React.FC = () => (
  <DocPage
    title="Building a website"
    lead="Field is not just for dashboards. Pick a website theme, compose pages from Section bands, and use the Website components for footers, media, cookie consent and more."
  >
    <Section id="setup" title="Set up the page">
      <Snippet
        code={`import '@sam.barfield/field-react/styles.css';
import { ThemeProvider, roasteryPair, SkipLink, CookieConsent, BackToTop } from '@sam.barfield/field-react';

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider themePair={roasteryPair} defaultMode="light">
      <SkipLink href="#main" />
      <SiteNavbar />
      <main id="main">{children}</main>
      <SiteFooter />
      <CookieConsent policyHref="/cookies" />
      <BackToTop />
    </ThemeProvider>
  );
}`}
      />
      <List
        items={[
          <>Choose a <DocLink to="docs/theming">website theme</DocLink> and load its fonts, or build your own with <C>createThemePair</C>.</>,
          <>Use <DocLink to="components/navbar">Navbar</DocLink> with <C>sticky</C> for the header. Set its <C>height</C> once: a sticky navbar publishes <C>--field-navbar-height</C> on <C>{'<html>'}</C>, and <C>--field-scroll-offset</C> (so in-page anchors land below the bar) is derived from it. Use the variable for your own sticky toolbars and pull the hero under a transparent bar with <C>Section underNavbar</C>. If the top-level items need more room than a tablet has, set <C>collapseBelow</C> so the bar switches to the menu before they collide.</>,
          <><DocLink to="components/cookie-consent">CookieConsent</DocLink> once at the root; read choices with <C>useCookieConsent()</C> before loading analytics.</>,
        ]}
      />
    </Section>

    <Section id="sections" title="Compose pages from sections">
      <P>
        A marketing page is a stack of <DocLink to="components/section">Section</DocLink> bands. Each one sets
        consistent vertical spacing, an optional background tone or photo, and a centred container. Use <C>SectionHeader</C> for
        consistent eyebrow, title, description, and action layout, and <C>underNavbar</C> on heroes to slide under transparent sticky headers.
      </P>
      <Snippet
        code={`<Section spacing="xl" container="md">
  <Stack gap="$6" align="center">
    <Heading level={1} display="lg" align="center">Small-batch coffee</Heading>
    <Text size="xl" tone="secondary" align="center">Roasted round the corner.</Text>
    <Flex direction={{ base: 'column', sm: 'row' }} gap="$3">
      <Button variant="primary" size="lg">See the menu</Button>
      <Button variant="outline" size="lg">Find us</Button>
    </Flex>
  </Stack>
</Section>

<Section tone="muted" id="menu" aria-labelledby="menu-title">…</Section>
<Section tone="accent" spacing="md">…call to action…</Section>`}
      />
      <P>
        <DocLink to="components/page-sections">Page sections</DocLink> has copy-paste recipes for heroes, feature
        grids, testimonials, pricing, logo rows, calls to action and contact forms.
      </P>
    </Section>

    <Section id="responsive" title="Responsive layout">
      <P>
        Layout props on <C>Flex</C>, <C>Stack</C>, <C>Grid</C>, <C>Box</C> and <C>Container</C>, plus <C>align</C> on{' '}
        <C>Heading</C> and <C>Text</C>, accept a breakpoint object. Values apply mobile first and each breakpoint
        inherits the one below it.
      </P>
      <Snippet
        code={`<Grid columns={{ base: 1, md: 2, lg: 3 }} gap={{ base: '$4', lg: '$8' }}>…</Grid>
<Flex direction={{ base: 'column', md: 'row' }}>…</Flex>
<Box hideBelow="md">Desktop only</Box>

// In JavaScript
const isDesktop = useMediaQuery(\`(min-width: \${breakpoints.md}px)\`);`}
      />
      <P>Breakpoints: <C>sm</C> 640px, <C>md</C> 768px, <C>lg</C> 1024px, <C>xl</C> 1280px.</P>
    </Section>

    <Section id="components" title="Website components">
      <List
        items={[
          <><DocLink to="components/typography">Heading display</DocLink> sizes and <C>Text size="xl"</C> for fluid hero type.</>,
          <><DocLink to="components/footer">Footer</DocLink> with brand, link columns and a legal row.</>,
          <><DocLink to="components/card">Card</DocLink> with <C>href</C> for whole-card links (service tiles, blog posts). Keep other links and buttons out of a link card.</>,
          <><DocLink to="components/media">Image, Gallery, Lightbox and AspectRatio</DocLink> for photos, portfolios, maps and video.</>,
          <><DocLink to="components/carousel">Carousel</DocLink> for reviews and highlights.</>,
          <><DocLink to="components/link">Link</DocLink> for text links and <DocLink to="components/prose">Prose</DocLink> for CMS / Markdown content, and <C>ProseHtml</C> for an HTML string from a CMS (safe, and the same on the server and in the browser).</>,
          <><DocLink to="components/date-tile">DateTile</DocLink> for event and post dates, and <DocLink to="components/file-item">FileItem and FileList</DocLink> for downloads and attachments.</>,
          <><DocLink to="components/site-utilities">SkipLink, BackToTop and Reveal</DocLink>.</>,
        ]}
      />
      <P>
        See them together in the <DocLink to="examples">Business site example</DocLink>, which switches between the
        five website themes.
      </P>
    </Section>

    <Section id="performance" title="Performance">
      <P>
        Field itself is light: JavaScript is tree-shaken, so a full brochure site (theme, navbar, sections, gallery,
        carousel, forms, footer, cookie banner) ships about 21 KB of Field code gzipped, and the stylesheet is a single
        cached file of about 23 KB. Most of a site's weight is its own images, fonts and page code:
      </P>
      <List
        items={[
          <><strong>Images</strong> are usually the biggest win. Convert photos to WebP or AVIF (often 70-80% smaller than JPEG/PNG), give <C>Image</C> its <C>width</C> and <C>height</C> so the layout doesn't jump, pass <C>loading="eager"</C> to the hero image only (everything else lazy-loads), and use <C>srcSet</C> / <C>sizes</C> for images shown at very different widths. <C>Section backgroundImage</C> is scaled to cover, so keep banner photos full size there.</>,
          <><strong>Fonts:</strong> self-host them (see <DocLink to="docs/installation">Installation</DocLink>) rather than loading a third-party stylesheet that blocks the first render.</>,
          <><strong>Page code:</strong> in a single-page app, lazy-load routes with <C>React.lazy</C>. Give the <C>Suspense</C> fallback <C>min-height: 100vh</C> so the footer stays below the fold while a page loads; a short fallback makes the footer visibly jump (layout shift).</>,
          <><strong>Server rendering</strong> (Next.js, Remix, Astro) makes content visible and indexable before JavaScript runs; a client-only app can't paint until its bundle has loaded.</>,
          <>Single-page apps usually serve <C>index.html</C> for unknown paths, including <C>/robots.txt</C>. Add a real <C>public/robots.txt</C> so search engines don't read your HTML as rules.</>,
        ]}
      />
      <Callout tone="info" title="Measure the production build">
        Run Lighthouse (Chrome DevTools, or <C>npx lighthouse &lt;url&gt;</C>) against a production build served by{' '}
        <C>vite preview</C> or your host. A dev server ships unminified code and per-module requests, so its scores are
        not meaningful. Check mobile as well as desktop: Lighthouse simulates a mid-range phone on a slow connection.
      </Callout>
    </Section>
  </DocPage>
);

/* ------------------------------------------------------------------ */

const TOKEN_GROUPS: { title: string; vars: string[]; note?: string }[] = [
  { title: 'Surfaces', vars: ['--field-surface-base', '--field-surface-raised', '--field-surface-overlay', '--field-surface-sunken', '--field-surface-subtle', '--field-surface-active'], note: 'base is the page; raised is cards; overlay is popovers and dialogs; sunken is inputs and wells.' },
  { title: 'Text', vars: ['--field-text-primary', '--field-text-secondary', '--field-text-tertiary', '--field-text-disabled', '--field-text-inverse'] },
  { title: 'Borders', vars: ['--field-border-subtle', '--field-border-default', '--field-border-strong', '--field-border-focus'] },
  { title: 'Accent', vars: ['--field-accent-primary', '--field-accent-hover', '--field-accent-active', '--field-accent-subtle', '--field-accent-contrast', '--field-accent-text'], note: 'contrast is the text colour on top of accent-primary; accent-text is the accent used as text on surfaces (links, active nav).' },
  { title: 'Status (success, warning, danger, info)', vars: ['--field-status-success-base', '--field-status-success-surface', '--field-status-success-border', '--field-status-success-text'], note: 'Same four tokens for each status.' },
  { title: 'Spacing', vars: ['--field-space-1 (4px)', '--field-space-2 (8px)', '--field-space-3 (12px)', '--field-space-4 (16px)', '--field-space-6 (24px)', '--field-space-8 (32px)'], note: 'Half steps use an underscore: --field-space-1_5 = 6px.' },
  { title: 'Headings', vars: ['--field-heading-weight', '--field-display-weight', '--field-heading-tracking', '--field-heading-stretch'], note: 'Set with createTheme({ typography }). tracking is a multiplier: 0 removes the negative letter-spacing, 1 is the default.' },
  { title: 'Radius, shadow, type, motion', vars: ['--field-radius-sm … --field-radius-xl, --field-radius-full', '--field-shadow-xs … --field-shadow-xl', '--field-font-sans, --field-font-mono, --field-font-display', '--field-duration-fast, --field-ease-default'] },
];

const Styling: React.FC = () => (
  <DocPage title="Styling & tokens" lead="Use Field's CSS variables in your own styles so custom UI matches the components and follows the active theme automatically.">
    <Section id="variables" title="CSS variables">
      <P>
        Never hard-code colours or spacing; reference the tokens instead. For the brand colour, use{' '}
        <C>--field-accent-primary</C> for fills and borders and <C>--field-accent-text</C> for text and icons; that way
        a theme can lighten its text tint for dark mode without touching your CSS.
      </P>
      <Snippet
        language="css"
        code={`.usage-panel {
  background: var(--field-surface-raised);
  border: 1px solid var(--field-border-subtle);
  border-radius: var(--field-radius-lg);
  padding: var(--field-space-4);
  color: var(--field-text-secondary);
}`}
      />
      <div className="docs-token-groups">
        {TOKEN_GROUPS.map(group => (
          <div key={group.title} className="docs-token-group">
            <div className="docs-token-title">{group.title}</div>
            <ul>
              {group.vars.map(v => (
                <li key={v}>
                  {v.startsWith('--field-surface') || v.startsWith('--field-accent') || v.startsWith('--field-status') || v.startsWith('--field-text') || v.startsWith('--field-border') ? (
                    <span className="docs-swatch" style={{ background: `var(${v})` }} aria-hidden="true" />
                  ) : null}
                  <code>{v}</code>
                </li>
              ))}
            </ul>
            {group.note && <p className="docs-token-note">{group.note}</p>}
          </div>
        ))}
      </div>
    </Section>

    <Section id="overrides" title="Customising components">
      <List
        items={[
          <>Every component accepts <C>className</C>, and most accept <C>style</C> and native element props.</>,
          <>Component styles are declared inside CSS Cascade Layers (<C>@layer field.tokens, field.base, field.components</C>), so unlayered consumer styles and utility classes naturally take precedence without requiring <C>!important</C>. Keep resets in an earlier layer (see <DocLink to="docs/installation">Installation</DocLink>).</>,
          <>Responsive layout props on <C>Flex</C>, <C>Stack</C>, <C>Grid</C> and <C>Box</C> emit custom properties (<C>--field-r-*</C>) and utility classes, keeping them fully overridable from your stylesheet.</>,
          <>Component classes are stable and prefixed (<C>.field-btn</C>, <C>.field-card</C>…), so you can target them from your CSS.</>,
          <>Prefer changing tokens (globally or with <C>ThemeScope</C>) over overriding many individual rules.</>,
        ]}
      />
      <Snippet
        code={`// Layout props accept px numbers, any CSS length, or $-prefixed spacing tokens
<Stack gap="$4" padding="$6">
  <Flex justify="space-between" align="center" gap={12}>…</Flex>
  <Grid minChildWidth={260} gap="$4">…</Grid>
</Stack>`}
      />
    </Section>

    <Section id="css-api" title="Public CSS API">
      <P>
        These variables, classes and names are part of Field's public API: you can rely on them in your own CSS, and
        any change to them is a breaking change listed in the changelog. Everything else in <C>field.css</C> is
        internal.
      </P>
      <H3>Variables you can read or set</H3>
      <List
        items={[
          <><C>--field-*</C> theme tokens (surfaces, text, accent, status, radii, shadows, spacing, fonts): see Design tokens above.</>,
          <><C>--field-navbar-height</C>: the bar height. A sticky, floating or <C>transparentOnTop</C> Navbar sets it on <C>{'<html>'}</C>; set it in <C>:root</C> too for server-rendered pages.</>,
          <><C>--field-scroll-offset</C>: how far below the top in-page anchors stop. Defaults to <C>--field-navbar-height</C>; set it to override.</>,
          <><C>--field-back-to-top-offset</C>: lifts <C>BackToTop</C> above other floating elements (a <C>FloatingButton</C> sets it for you). <C>--field-floating-inset</C>: their distance from the window edges.</>,
          <><C>--field-btn-height-sm|md|lg|xl</C>, <C>--field-btn-padding-x-*</C>, <C>--field-btn-font-size-*</C>, <C>--field-btn-radius</C>, <C>--field-btn-font-weight</C>, <C>--field-btn-letter-spacing</C>, <C>--field-btn-text-transform</C>, <C>--field-btn-shadow</C> / <C>-hover</C> / <C>-active</C>, <C>--field-btn-press-transform</C>: button theming (or a theme's <C>button</C> group). TextInput, Select, NumberInput and Chip sizes follow the heights.</>,
          <><C>--field-navbar-scrolled-bg</C>, <C>-border</C>, <C>-shadow</C>, <C>-blur</C>: the scrolled bar (or <C>scrolledAppearance</C>).</>,
          <><C>--field-timeline-marker-size</C>, <C>-marker-border-width</C>, <C>-marker-color</C>, <C>-marker-bg</C>, <C>-rail-width</C>, <C>-rail-color</C>, <C>-gap</C>, <C>-item-gap</C>, <C>-time-color</C>, <C>-time-weight</C>, <C>-time-width</C>: Timeline.</>,
          <><C>--field-divided-space</C>, <C>--field-divided-color</C>: Divided. <C>--field-icon-size</C>: Icon.</>,
        ]}
      />
      <H3>Classes, attributes and names</H3>
      <List
        items={[
          <><C>.field-navbar-collapsed</C>: on the Navbar while it is in its menu layout (below 768px or <C>collapseBelow</C>).</>,
          <><C>.field-navbar-hide-mobile</C>: hides any element inside the Navbar while it is collapsed (<C>NavbarActionsItem hideOnMobile</C> adds it for you).</>,
          <>The container name <C>field-navbar</C>: query the bar's own width, e.g. <C>{'@container field-navbar (max-width: 768px) { … }'}</C>.</>,
          <><C>data-navbar-overlap</C>: put it on a custom hero to tell <C>Navbar transparentOnTop="auto"</C> that a band sits under the bar (<C>Section underNavbar</C> does this for you).</>,
          <><C>.field-sr-only</C>: visually hidden, still read by screen readers (or <DocLink to="components/site-utilities">VisuallyHidden</DocLink>, which can also hide only below a breakpoint).</>,
          <>The cascade layers <C>field.tokens</C>, <C>field.base</C> and <C>field.components</C> (all under <C>field</C>), for ordering your own layers.</>,
          <>The <C>.field-*</C> component class names, for targeting components from your CSS.</>,
        ]}
      />
    </Section>

    <Section id="tailwind" title="Tailwind CSS">
      <H3>Tailwind v4</H3>
      <P>
        Declare the layer order first, so Preflight sits under Field and utilities sit over it. Import this file
        before <C>@sam.barfield/field-react/styles.css</C>:
      </P>
      <Snippet language="css" code={`@layer theme, base, field, components, utilities;\n@import "tailwindcss";\n@import "@sam.barfield/field-tokens/tailwind.css";`} />
      <H3>Tailwind v3</H3>
      <Snippet
        language="js"
        title="tailwind.config.js"
        code={`import { fieldTailwindPreset } from '@sam.barfield/field-tokens';

export default {
  presets: [fieldTailwindPreset],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
};`}
      />
      <P>
        Tailwind v3's Preflight is not in a cascade layer, so it overrides Field (buttons lose their background, for
        example). Turn it off with <C>{'corePlugins: { preflight: false }'}</C>, or keep it out of the page.
      </P>
      <P>Then use classes like <C>bg-field-surface-raised</C>, <C>text-field-text-secondary</C>, <C>border-field-border-subtle</C>, <C>rounded-field-md</C> and <C>shadow-field-lg</C>. They resolve to the same CSS variables, so they follow theme changes.</P>
    </Section>
  </DocPage>
);

/* ------------------------------------------------------------------ */

const Routing: React.FC = () => (
  <DocPage title="Routing & links" lead="Interactive components can render as your router's link component, so navigation stays client-side.">
    <Section id="provider" title="App-wide router integration">
      <P>
        Pass a router link component to <C>ThemeProvider</C>. When configured, all internal <C>href</C> props on{' '}
        <C>Button</C>, <C>IconButton</C>, <C>NavbarBrand</C>, <C>NavbarItem</C>, <C>NavbarFlyoutItem</C>, <C>Card</C>,{' '}
        <C>Link</C>, <C>Tabs</C> items, <C>Breadcrumb</C>, <C>FooterLink</C> and the <C>CookieConsent</C> policy link render with it, avoiding full-page reloads without needing{' '}
        <C>as={'{Link}'}</C> on every element. External URLs (<C>https:</C>, <C>mailto:</C>, <C>tel:</C>) and anchor
        hashes stay as native <C>{'<a>'}</C> tags, and so do links with <C>download</C> or a <C>target</C> other than{' '}
        <C>_self</C> (e.g. <C>{'<Button href="/files/form.pdf" download>'}</C>), since a router link would intercept the
        click. An explicit <C>as</C> always wins.
      </P>
      <P>
        The component receives <C>href</C>, not <C>to</C>. Next.js's <C>Link</C> takes <C>href</C>, so pass it
        directly. React Router and TanStack Router take <C>to</C>: pass a small adapter instead of their <C>Link</C>,
        or every link renders without a destination.
      </P>
      <Snippet
        code={`import { forwardRef, type AnchorHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import { ThemeProvider, Button, NavbarItem } from '@sam.barfield/field-react';

// Field passes href; React Router's Link wants to.
const AppLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(
  ({ href = '/', ...rest }, ref) => <Link ref={ref} to={href} {...rest} />
);

export function App() {
  return (
    <ThemeProvider linkComponent={AppLink}>
      {/* Renders client-side <Link to="/dashboard"> automatically */}
      <Button href="/dashboard" variant="primary">Dashboard</Button>
      <NavbarItem href="/settings">Settings</NavbarItem>
      {/* External links and anchor hashes stay as native <a> */}
      <Button href="https://github.com" target="_blank">GitHub</Button>
    </ThemeProvider>
  );
}`}
      />
    </Section>

    <Section id="three-ways" title="Individual link rendering">
      <List
        items={[
          <><C>href</C> renders a plain <C>{'<a>'}</C> (or your <C>ThemeProvider</C> router link for internal paths).</>,
          <><C>as={'{Link}'}</C> renders your component with Field's props and classes. Pass router props (<C>to</C>, <C>params</C>…) directly.</>,
          <><C>asChild</C> merges Field's props, classes and handlers onto the single child element you provide.</>,
        ]}
      />
      <P>Supported by <C>Button</C>, <C>IconButton</C>, <C>Card</C>, <C>Link</C>, <C>NavbarBrand</C>, <C>NavbarItem</C>, <C>NavbarFlyoutItem</C>, <C>SidebarItem</C>, <C>SidebarSubItem</C>, <C>DropdownItem</C>, <C>ContextMenu</C> items, <C>Tabs</C> items, <C>Breadcrumb</C> items and <C>FooterLink</C>.</P>
      <P>
        Links inside CMS content rendered with <C>ProseHtml</C> are plain <C>{'<a>'}</C> tags. To route them, pass your
        link component as <C>{'components={{ a: RouterLink }}'}</C>. Define that object once, outside the component, so
        the HTML isn't parsed again on every render.
      </P>
    </Section>

    <Section id="next" title="Next.js">
      <Snippet
        code={`import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button, NavbarItem } from '@sam.barfield/field-react';

<Button as={Link} href="/settings" variant="ghost">Settings</Button>

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  return <NavbarItem as={Link} href={href} isActive={pathname === href}>{children}</NavbarItem>;
}`}
      />
    </Section>

    <Section id="react-router" title="React Router">
      <Snippet
        code={`import { Link, useLocation } from 'react-router-dom';
import { SidebarItem } from '@sam.barfield/field-react';

const { pathname } = useLocation();
<SidebarItem asChild icon={<Server size={16} />} label="Instances" isActive={pathname === '/instances'}>
  <Link to="/instances">Instances</Link>
</SidebarItem>`}
      />
    </Section>

    <Section id="after-navigation" title="After navigation">
      <P>
        Client-side navigation doesn't do what a full page load does for free. Two small additions make a single-page
        site behave like a normal one: set the document title on every route (it is what tabs, history and screen
        readers announce), and after the path changes, scroll to the top and move focus to <C>{'<main>'}</C> so
        keyboard and screen-reader users start at the new content rather than on the link they clicked.
      </P>
      <Snippet
        code={`function useRouteFocus() {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; } // leave the initial page load alone
    window.scrollTo(0, 0);
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);
  return mainRef;
}

const mainRef = useRouteFocus();
<main id="main" ref={mainRef} tabIndex={-1}>…</main> // tabIndex={-1}: focusable by script, not by Tab`}
      />
      <P>
        Open <C>NavbarFlyout</C> panels and the mobile <C>NavbarMenu</C> close themselves when a link inside them is
        clicked, so no extra state is needed.
      </P>
    </Section>

    <Section id="tanstack" title="TanStack Router">
      <Snippet
        code={`import { Link } from '@tanstack/react-router';

<Button as={Link} to="/projects/$id" params={{ id }} variant="primary">Open project</Button>

// Breadcrumb items pass extra props to the link component via linkProps
<Breadcrumb items={[
  { label: 'Projects', as: Link, linkProps: { to: '/projects' } },
  { label: project.name },
]} />`}
      />
      <Callout tone="info">
        Mark the current route with <C>isActive</C>; Field sets <C>aria-current="page"</C> and drives the animated navbar
        indicator from it.
      </Callout>
    </Section>
  </DocPage>
);

/* ------------------------------------------------------------------ */

const Forms: React.FC = () => (
  <DocPage title="Forms" lead="Form controls work controlled, uncontrolled, with native form submission, and with form libraries.">
    <Section id="controlled" title="Controlled and uncontrolled">
      <P>
        Every input accepts either <C>value</C> + <C>onChange</C> (controlled) or <C>defaultValue</C> (uncontrolled).
        Field's <C>onChange</C> handlers receive the <em>value</em> (not an event), so you can pass a state setter directly:
      </P>
      <Snippet
        code={`const [region, setRegion] = useState('us-east-1');
const [enabled, setEnabled] = useState(true);

<Select label="Region" value={region} onChange={setRegion} options={regions} />
<Switch label="Auto-scaling" checked={enabled} onChange={setEnabled} />
<NumberInput label="Replicas" defaultValue={3} min={1} max={20} />`}
      />
      <Callout tone="info" title="Exception: TextInput and TextArea">
        These are thin wrappers around native elements, so their <C>onChange</C> receives the normal{' '}
        <C>ChangeEvent</C>, exactly like <C>{'<input>'}</C>.
      </Callout>
    </Section>

    <Section id="native" title="Native form submission">
      <P>
        Give controls a <C>name</C> and they submit with a regular <C>{'<form>'}</C>. Custom controls render hidden
        inputs: <C>Select</C> submits its value, <C>Combobox</C> one entry per selected value, and date pickers submit
        local <C>YYYY-MM-DD</C> strings (<C>DateRangePicker</C> uses <C>name_start</C> / <C>name_end</C>).
      </P>
      <Snippet
        code={`<form onSubmit={e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.currentTarget));
}}>
  <TextInput name="email" type="email" label="Email" required />
  <Select name="plan" label="Plan" options={plans} required />
  <Checkbox name="terms" label="I accept the terms" required />
  <Button type="submit" variant="primary">Create account</Button>
</form>`}
      />
    </Section>

    <Section id="validation" title="Labels, help and errors">
      <P>
        Pass <C>label</C>, <C>helperText</C> and <C>error</C>; Field links them for screen readers (<C>aria-describedby</C>,{' '}
        <C>aria-invalid</C>) and announces errors. <C>required</C> adds an asterisk to the label.
      </P>
      <Snippet code={`<TextInput label="Bucket name" required helperText="Lowercase letters, numbers and dashes." error={errors.name} />`} />
      <P>
        <C>Checkbox</C> takes <C>error</C> too, which suits a required consent box. Every control puts its <C>id</C> on
        the element that receives focus (for <C>Select</C>, the trigger button), so <C>{'<label htmlFor>'}</C> and{' '}
        <C>#id</C> links reach it.
      </P>
      <H3>Error summaries for longer forms</H3>
      <P>
        On a form longer than a screen, per-field messages can be out of view when the user presses submit. Add a
        summary at the top that lists each problem as a link to its field, and focus the summary on a failed submit so
        it is announced:
      </P>
      <Snippet
        code={`{errorList.length > 0 && (
  <div ref={summaryRef} tabIndex={-1}>
    <Alert variant="danger" title={\`Please fix \${errorList.length} problems\`}>
      <ul>
        {errorList.map(({ id, message }) => (
          <li key={id}>
            <Link href={\`#\${id}\`} onClick={e => { e.preventDefault(); document.getElementById(id)?.focus(); }}>
              {message}
            </Link>
          </li>
        ))}
      </ul>
    </Alert>
  </div>
)}

<Checkbox id="consent" required label="I agree to the privacy policy" error={errors.consent} />`}
      />
      <P>
        Clear each error as soon as the field is corrected, list errors in the same order as the fields, and phrase
        messages as instructions ("Enter an email address like name@company.com") rather than verdicts ("Invalid").
      </P>
    </Section>

    <Section id="react-hook-form" title="React Hook Form">
      <P>Native-backed fields work with <C>register</C>; value-based controls use <C>Controller</C>:</P>
      <Snippet
        code={`import { useForm, Controller } from 'react-hook-form';

const { register, control, handleSubmit, formState: { errors } } = useForm<Values>();

<TextInput label="Name" {...register('name', { required: 'Name is required' })} error={errors.name?.message} />

<Controller
  name="region"
  control={control}
  render={({ field, fieldState }) => (
    <Select label="Region" options={regions} value={field.value} onChange={field.onChange}
      onBlur={field.onBlur} error={fieldState.error?.message} />
  )}
/>

<Controller
  name="notifications"
  control={control}
  render={({ field }) => <Switch label="Notifications" checked={field.value} onChange={field.onChange} />}
/>`}
      />
    </Section>
  </DocPage>
);

/* ------------------------------------------------------------------ */

const Accessibility: React.FC = () => (
  <DocPage title="Accessibility" lead="Field handles the hard parts of accessible widgets. A few things are still up to you.">
    <Section id="built-in" title="What Field does for you">
      <List
        items={[
          'Form controls are real native inputs (checkbox, radio, range) or follow WAI-ARIA patterns (combobox, listbox, menu, tree, grid, tabs).',
          'Labels, helper text and errors are linked automatically; ids are generated when you don\'t pass one.',
          'Dialogs trap focus, restore it on close, lock page scroll and close on Escape. Nested overlays close one at a time.',
          'Menus, selects, tabs, trees and calendars support full keyboard navigation (see each component page).',
          'Popups render in portals, so they are never clipped, and keep the active theme.',
          'Animations respect prefers-reduced-motion.',
        ]}
      />
    </Section>
    <Section id="your-job" title="What you need to do">
      <List
        items={[
          <>Give icon-only buttons an <C>aria-label</C> (required by <C>IconButton</C>'s types).</>,
          <>Give controls without a visible label an <C>aria-label</C>, e.g. a search field or table row checkbox.</>,
          <>Use <DocLink to="components/site-utilities">VisuallyHidden</DocLink> for text only screen readers need, such as "(current page)" or the name of an icon-only link.</>,
          <>Building a custom form control? Use <DocLink to="components/text-input">FieldLabel and FieldMessage</DocLink> so its label, helper and error text match Field's inputs.</>,
          <>Don't rely on colour alone: pair <C>StatusDot</C> and coloured <C>Badge</C>s with text.</>,
          <>Keep heading levels in order and give each page exactly one <C>h1</C>; use <C>{'<Heading level={1} as="h2">'}</C> to change the look without breaking the outline. On a 404 page, <C>{'<EmptyState titleAs="h1">'}</C> makes the message the page heading.</>,
          <>Check custom theme colours with <C>checkThemeContrast</C> (both modes) before you ship; see <DocLink to="docs/theming">Theming</DocLink>.</>,
          <>Use <C>Tooltip</C> for supplementary text only; it is not available on touch devices.</>,
        ]}
      />
    </Section>
  </DocPage>
);

/* ------------------------------------------------------------------ */

const Frameworks: React.FC = () => (
  <DocPage title="SSR & frameworks" lead="Field works with Vite, Next.js (App and Pages Router), Remix and anything else that renders React.">
    <Section id="next-app" title="Next.js App Router">
      <P>
        Components are marked <C>'use client'</C>, so you can import them from Server Components. Hooks like{' '}
        <C>useTheme</C> and <C>useToast</C> still need to be called from a Client Component. Put the providers in a
        client component:
      </P>
      <Snippet
        title="app/providers.tsx"
        code={`'use client';
import { ThemeProvider, ToastProvider } from '@sam.barfield/field-react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultMode="system" storageKey="theme">
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  );
}`}
      />
      <Snippet
        title="app/layout.tsx"
        code={`import '@sam.barfield/field-react/styles.css';
import { Providers } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}`}
      />
      <Callout tone="info">
        <C>suppressHydrationWarning</C> on <C>{'<html>'}</C> is needed because the provider writes the theme's{' '}
        <C>data-theme</C> attribute and variables there on the client.
      </Callout>
    </Section>
    <Section id="cms-html" title="HTML from a CMS">
      <P>
        Render CMS HTML with <DocLink to="components/prose">ProseHtml</DocLink> rather than{' '}
        <C>dangerouslySetInnerHTML</C> or a <C>DOMParser</C>-based sanitiser. <C>DOMParser</C> does not exist on the
        server, so a browser-only sanitiser renders different markup on the server and causes a hydration mismatch.{' '}
        <C>ProseHtml</C> parses with <C>htmlparser2</C>, which runs the same in both places, so it works in Server
        Components and server-rendered pages. It needs Node 20.19 or newer.
      </P>
    </Section>
    <Section id="flash" title="Avoiding a flash of the wrong theme">
      <P>
        The stylesheet already contains the default dark theme, so server-rendered HTML is styled. If users can pick
        light mode, the stored choice is applied on the client before paint. For a fully flash-free experience with a
        custom pair, also ship its CSS (see <DocLink to="docs/theming">Themes without JavaScript</DocLink>) and set{' '}
        <C>data-theme</C> on the server from a cookie.
      </P>
    </Section>
    <Section id="testing" title="Testing">
      <P>
        The packages are standard ES modules, so they load in Node, Vitest and Jest (with ESM support) without extra
        transform configuration. Components query by role and label just like native elements:
      </P>
      <Snippet
        code={`render(<Select label="Region" options={regions} />);
await user.click(screen.getByRole('combobox', { name: /region/i }));
await user.click(screen.getByRole('option', { name: 'EU West' }));`}
      />
      <P>Custom themes are plain objects, so their contrast can be tested too:</P>
      <Snippet
        code={`import { checkThemeContrast } from '@sam.barfield/field-tokens';
import { brand } from './theme';

test.each(['light', 'dark'] as const)('%s theme meets WCAG AA', mode => {
  expect(checkThemeContrast(brand[mode]).filter(c => !c.pass)).toEqual([]);
});`}
      />
    </Section>
  </DocPage>
);

/* ------------------------------------------------------------------ */

const AiAssistants: React.FC = () => (
  <DocPage title="AI coding assistants" lead="Field ships machine-readable docs so assistants such as Claude, Cursor or Copilot generate correct code.">
    <Section id="files" title="Files to give your assistant">
      <List
        items={[
          <><C>docs/COMPONENT_MANIFEST.json</C> - every component, prop, type, default and description, and every hook and utility with its signature, generated from the source (<C>npm run docs:manifest</C>).</>,
          <><C>docs/AGENTS.md</C> - conventions, recipes and rules for building UIs with Field.</>,
          <><C>docs/DESIGN_PHILOSOPHY.md</C> - the visual principles behind the system.</>,
        ]}
      />
    </Section>
    <Section id="prompt" title="A good starting prompt">
      <Snippet
        language="md"
        code={`Use the Field Design System (@sam.barfield/field-react) for all UI.
- Import '@sam.barfield/field-react/styles.css' once and wrap the app in <ThemeProvider>.
- Only use components and props listed in docs/COMPONENT_MANIFEST.json.
- Use --field-* CSS variables for any custom styling; never hard-code colours or spacing.
  Brand-coloured text and icons use --field-accent-text; fills use --field-accent-primary.
- Give IconButtons an aria-label and every form control a label.
- Render router links with as={Link} or asChild.`}
      />
    </Section>
    <Section id="at-a-glance" title="Library at a glance">
      <Grid minChildWidth={200} gap={12}>
        {Object.entries(manifest.hooks).map(([name, hook]) => (
          <Card key={name} padding="sm">
            <Stack gap={4}>
              <Badge variant="info" size="sm">hook</Badge>
              <Text size="sm" weight="semibold" mono>{name}</Text>
              <Text size="xs" tone="secondary">{hook.description.split('\n')[0]}</Text>
            </Stack>
          </Card>
        ))}
      </Grid>
    </Section>
  </DocPage>
);

/* ------------------------------------------------------------------ */

/** Utility groups by source file (anything not listed falls into "Other"). */
const UTILITY_GROUPS: { title: string; id: string; intro?: string; match: (source: string) => boolean }[] = [
  {
    title: 'Links and polymorphism',
    id: 'links',
    intro: 'What Field uses to render items as a button, a link or your router link. Use them to build your own link-aware components.',
    match: s => /utils\/(polymorphic|classNames)$/.test(s),
  },
  {
    title: 'Focus, refs and keyboard',
    id: 'dom',
    intro: 'The building blocks behind Field’s overlays and menus.',
    match: s => /utils\/hooks$|theme\/usePortalTheme$/.test(s),
  },
  {
    title: 'Responsive props',
    id: 'responsive',
    intro: 'Breakpoints, and the helpers that turn breakpoint-object props into CSS. The lower-level helpers are for building components like Field’s own.',
    match: s => /utils\/responsive$/.test(s),
  },
  { title: 'Dates', id: 'dates', match: s => /utils\/date$|components\/DatePicker$/.test(s) },
  { title: 'Component helpers', id: 'component-helpers', match: s => s.startsWith('packages/react/src/components/') },
  {
    title: 'Themes and presets',
    id: 'themes',
    intro: 'From @sam.barfield/field-tokens (also re-exported by @sam.barfield/field-react). See Theming for how to use them.',
    match: s => /tokens\/src\/(themes|presets|create)/.test(s),
  },
  { title: 'Exporters and contrast', id: 'exporters', match: s => /tokens\/src\/(compiler|tailwind|contrast)/.test(s) },
  { title: 'Primitive tokens', id: 'primitives', intro: 'The raw scales the themes are built from.', match: s => /tokens\/src\/primitives/.test(s) },
];

const ReferenceTable: React.FC<{ rows: [string, { signature?: string; type?: string; description: string }][] }> = ({ rows }) => (
  <div className="docs-table-wrap">
    <table className="docs-table">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([name, entry]) => (
          <tr key={name} id={`ref-${name}`}>
            <td className="docs-prop-name">
              <code>{name}</code>
            </td>
            <td className="docs-prop-desc">
              {renderInlineCode(entry.description.split(/\n\s*\n/)[0].replace(/\n/g, ' '))}
              {(entry.signature || entry.type) && (
                <div>
                  <code className="docs-prop-type">{entry.signature ?? entry.type}</code>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const HooksAndUtilities: React.FC = () => {
  const utilities = Object.entries(manifest.utilities) as [string, ManifestUtility][];
  // Each utility goes in the first group that matches.
  const groupOf = (source: string) => UTILITY_GROUPS.find(group => group.match(source));
  const grouped = UTILITY_GROUPS.map(group => ({ ...group, rows: utilities.filter(([, u]) => groupOf(u.source) === group) }));
  const other = utilities.filter(([, u]) => !UTILITY_GROUPS.some(group => group.match(u.source)));
  return (
    <DocPage
      title="Hooks & utilities"
      lead="Every hook, function and constant Field exports besides its components, generated from the source. Components are on their own pages; the helpers here are for state, theming, building your own components and working with tokens."
    >
      <Section id="hooks" title="Hooks">
        <ReferenceTable rows={Object.entries(manifest.hooks)} />
      </Section>
      {grouped.map(group =>
        group.rows.length ? (
          <Section key={group.id} id={group.id} title={group.title}>
            {group.intro && <P>{group.intro}</P>}
            <ReferenceTable rows={group.rows} />
          </Section>
        ) : null
      )}
      {other.length > 0 && (
        <Section id="other" title="Other">
          <ReferenceTable rows={other} />
        </Section>
      )}
    </DocPage>
  );
};

export const guides: GuideDef[] = [
  { slug: 'introduction', title: 'Introduction', group: 'Getting started', render: Introduction },
  { slug: 'installation', title: 'Installation', group: 'Getting started', render: Installation },
  { slug: 'theming', title: 'Theming', group: 'Getting started', render: Theming },
  { slug: 'websites', title: 'Building a website', group: 'Guides', render: Websites },
  { slug: 'styling', title: 'Styling & tokens', group: 'Guides', render: Styling },
  { slug: 'routing', title: 'Routing & links', group: 'Guides', render: Routing },
  { slug: 'forms', title: 'Forms', group: 'Guides', render: Forms },
  { slug: 'accessibility', title: 'Accessibility', group: 'Guides', render: Accessibility },
  { slug: 'frameworks', title: 'SSR & frameworks', group: 'Guides', render: Frameworks },
  { slug: 'utilities', title: 'Hooks & utilities', group: 'Guides', render: HooksAndUtilities },
  { slug: 'ai-assistants', title: 'AI coding assistants', group: 'Guides', render: AiAssistants },
];
