import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { cobaltThemePair, themePairToCssString } from '@sam.barfield/field-tokens';

const components = readFileSync('src/styles/field.css', 'utf8');

const layerHeader = '@layer field.tokens, field.base, field.components;\n\n';
const layeredTokens = `@layer field.tokens {\n${themePairToCssString(cobaltThemePair)}\n}\n`;
const layeredComponents = `@layer field.components {\n${components}\n}\n`;

const css = [
  '/* @sam.barfield/field-react - default theme variables and component styles */',
  layerHeader,
  layeredTokens,
  layeredComponents,
].join('\n');

mkdirSync('dist/styles', { recursive: true });
writeFileSync('dist/styles/field.css', css);
// Component styles only, for apps that ship their own theme variables.
writeFileSync('dist/styles/components.css', `${layerHeader}${layeredComponents}`);
console.log('field-react: wrote styles/field.css and styles/components.css');
