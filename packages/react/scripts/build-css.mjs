// Builds dist/styles/field.css: the default theme variables (from
// @sam.barfield/field-tokens) followed by the component styles. Shipping the
// variables means the page is styled on first paint, before React hydrates,
// and works even without <ThemeProvider>.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { cobaltThemePair, themePairToCssString } from '@sam.barfield/field-tokens';

const components = readFileSync('src/styles/field.css', 'utf8');
const css = [
  '/* @sam.barfield/field-react - default theme variables (generated) */',
  themePairToCssString(cobaltThemePair),
  components,
].join('\n');

mkdirSync('dist/styles', { recursive: true });
writeFileSync('dist/styles/field.css', css);
// Component styles only, for apps that ship their own theme variables.
writeFileSync('dist/styles/components.css', components);
console.log('field-react: wrote styles/field.css and styles/components.css');
