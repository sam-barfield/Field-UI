#!/usr/bin/env node
/**
 * Generates docs/COMPONENT_MANIFEST.json from the TypeScript source of
 * @sam.barfield/field-react, so the props reference can never drift from the code.
 *
 * For every exported component it records:
 *   - description and @example blocks from the component's JSDoc
 *   - every prop declared by the library (type, required, default, JSDoc description)
 *   - which native HTML/React props it also forwards (from `extends` clauses)
 *
 * Usage: npm run docs:manifest
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ts = require('typescript');

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const reactPkg = join(root, 'packages/react');
const entry = join(reactPkg, 'src/index.ts');
const srcDir = join(reactPkg, 'src') + sep;
const tokensSrcDir = join(root, 'packages/tokens/src') + sep;

const CATEGORY_BY_FILE = {
  Button: 'Actions',
  DropdownMenu: 'Actions',
  CodeBlock: 'Data Display',
  Input: 'Forms',
  Select: 'Forms',
  Controls: 'Forms',
  DatePicker: 'Forms',
  Card: 'Data Display',
  Badge: 'Data Display',
  Table: 'Data Display',
  Terminal: 'Data Display',
  DataDisplay: 'Data Display',
  Metrics: 'Data Display',
  Modal: 'Overlays',
  Popover: 'Overlays',
  ContextMenu: 'Overlays',
  CommandPalette: 'Overlays',
  Accordion: 'Feedback',
  Feedback: 'Feedback',
  Primitives: 'Feedback',
  Tabs: 'Navigation',
  Sidebar: 'Navigation',
  Navbar: 'Navigation',
  Typography: 'Typography',
  Layout: 'Layout',
  Icon: 'Data Display',
  Website: 'Website',
  ProseHtml: 'Website',
  Media: 'Website',
  CookieConsent: 'Website',
  UnfoldingHeading: 'Typography',
};
/** Fallback descriptions for conventional props that aren't documented inline. */
const COMMON_DESCRIPTIONS = {
  children: 'Content to render.',
  className: 'Additional CSS class names.',
  style: 'Inline styles.',
  id: 'Element id. Generated automatically when omitted (labels stay linked).',
  name: 'Form field name, so the value is submitted with native forms.',
  label: 'Visible label, linked to the control for screen readers.',
  placeholder: 'Text shown when there is no value.',
  disabled: 'Disables interaction and dims the control.',
  required: 'Marks the field as required (adds a * to the label and native validation).',
  value: 'Controlled value. Pair with `onChange`.',
  defaultValue: 'Initial value when uncontrolled.',
  onChange: 'Called with the new value whenever it changes.',
  checked: 'Controlled checked state.',
  defaultChecked: 'Initial checked state when uncontrolled.',
  isOpen: 'Whether it is open (controlled).',
  defaultOpen: 'Initial open state when uncontrolled.',
  onOpenChange: 'Called with the new open state.',
  onClose: 'Called when the user asks to close it (Escape, backdrop click or close button).',
  container: 'Element to render the portal into. Defaults to `document.body`.',
  helperText: 'Hint shown under the control (hidden while `error` is set).',
  error: 'Error message shown under the control; also sets `aria-invalid`.',
  'aria-label': 'Accessible name when there is no visible label.',
  size: 'Size preset.',
  variant: 'Visual style variant.',
  asChild: "Merge this component's props and styling onto its single child element instead of rendering its own (use with router `<Link>`s).",
  as: 'Render as a different element or component, e.g. `as={Link}`.',
  href: 'Render as a link (`<a>`) pointing at this URL.',
  target: 'Link target, e.g. `_blank`.',
  rel: 'Link relationship, e.g. `noopener noreferrer`.',
  onClick: 'Click handler.',
  onBlur: 'Called when the control loses focus (useful for form libraries).',
  title: 'Heading text.',
  description: 'Secondary text under the title.',
  footer: 'Footer content, typically action buttons.',
  icon: 'Icon element, e.g. `<Server size={16} />` from lucide-react.',
  badge: 'Small count or status shown on the right.',
  items: 'Items to render.',
  options: 'Options to choose from.',
  onSelect: 'Called when the item is chosen.',
  isActive: 'Marks this item as the current page (sets `aria-current="page"`).',
  isLoading: 'Shows a loading state.',
  min: 'Minimum value.',
  max: 'Maximum value.',
  step: 'Increment used by arrow keys and stepper buttons.',
  gap: 'Space between children (number = px, `"$4"` = spacing token).',
  align: 'Alignment.',
  justify: 'Main-axis distribution (`justify-content`).',
  direction: 'Flex direction.',
  wrap: 'Whether children wrap onto new lines.',
  orientation: 'Layout direction.',
  showCloseButton: 'Show a close button.',
  showDoneButton: 'Keep the popover open after picking and show a Done button.',
  doneButtonLabel: 'Text of the Done button.',
  onDone: 'Called when the Done button is pressed.',
  minDate: 'Earliest selectable day (time of day is ignored).',
  maxDate: 'Latest selectable day (time of day is ignored).',
  formatDate: 'Custom display format for the trigger text.',
  content: 'Content of the floating panel.',
  trigger: 'Element that opens it.',
  width: 'Width (number = px, or any CSS length).',
};

const LAYOUT_COMPONENTS = new Set(['Box', 'Flex', 'Stack', 'Grid', 'Container', 'Divider', 'Divided', 'VisuallyHidden']);
const NAVIGATION_COMPONENTS = new Set(['Breadcrumb', 'Pagination', 'Stepper', 'Timeline']);

const configPath = join(reactPkg, 'tsconfig.json');
const { config } = ts.readConfigFile(configPath, ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(config, ts.sys, reactPkg);
const program = ts.createProgram([entry], { ...parsed.options, noEmit: true });
const checker = program.getTypeChecker();
const entrySource = program.getSourceFile(entry);
const moduleSymbol = checker.getSymbolAtLocation(entrySource);

const isOwnFile = fileName => {
  const normalized = fileName.split('/').join(sep);
  return normalized.startsWith(srcDir) || normalized.startsWith(tokensSrcDir);
};

const docText = symbol => ts.displayPartsToString(symbol.getDocumentationComment(checker)).trim();

function jsDocTags(symbol, name) {
  return symbol
    .getJsDocTags(checker)
    .filter(tag => tag.name === name)
    .map(tag => ts.displayPartsToString(tag.text).trim())
    .filter(Boolean);
}

function cleanType(text) {
  return text
    .replace(/import\("[^"]+"\)\./g, '')
    .replace(/React\./g, '')
    .replace(/\s*\|\s*undefined\b/g, '')
    .replace(/^undefined\s*\|\s*/, '')
    .replace(/\(string & \{\}\)/g, 'string')
    .trim();
}

/** Find the function implementing a component: `const X = (props) => …`, `forwardRef((props, ref) => …)`, `function X(props)`. */
function findImplementation(declaration) {
  if (ts.isFunctionDeclaration(declaration)) return declaration;
  if (!ts.isVariableDeclaration(declaration) || !declaration.initializer) return undefined;
  let node = declaration.initializer;
  while (node) {
    if (ts.isAsExpression(node) || ts.isParenthesizedExpression(node)) {
      node = node.expression;
      continue;
    }
    if (ts.isArrowFunction(node) || ts.isFunctionExpression(node)) return node;
    if (ts.isCallExpression(node)) {
      const fn = node.arguments.find(arg => ts.isArrowFunction(arg) || ts.isFunctionExpression(arg));
      if (fn) return fn;
      // forwardRef(SelectInner): resolve the identifier to its function declaration
      const ident = node.arguments.find(arg => ts.isIdentifier(arg));
      if (ident) {
        const target = checker.getSymbolAtLocation(ident);
        const decl = target?.declarations?.[0];
        if (decl && ts.isFunctionDeclaration(decl)) return decl;
      }
      return undefined;
    }
    return undefined;
  }
  return undefined;
}

/** Default values from the destructured props parameter, e.g. `({ size = 'md' })`. */
function extractDefaults(fn) {
  const defaults = {};
  if (!fn) return defaults;
  const param = fn.parameters[0];
  if (param && ts.isObjectBindingPattern(param.name)) {
    for (const element of param.name.elements) {
      if (!element.initializer) continue;
      const key = element.propertyName ? element.propertyName.getText() : element.name.getText();
      defaults[key.replace(/^['"]|['"]$/g, '')] = element.initializer.getText();
    }
  }
  // `const { size = 'md' } = props;` inside the body (generic components)
  if (fn.body && ts.isBlock(fn.body)) {
    for (const stmt of fn.body.statements) {
      if (!ts.isVariableStatement(stmt)) continue;
      for (const decl of stmt.declarationList.declarations) {
        if (!ts.isObjectBindingPattern(decl.name) || !decl.initializer || decl.initializer.getText() !== 'props') continue;
        for (const element of decl.name.elements) {
          if (!element.initializer) continue;
          const key = element.propertyName ? element.propertyName.getText() : element.name.getText();
          defaults[key.replace(/^['"]|['"]$/g, '')] = element.initializer.getText();
        }
      }
    }
  }
  return defaults;
}

function heritageOf(propsType) {
  const declarations = propsType.getSymbol()?.declarations ?? propsType.aliasSymbol?.declarations ?? [];
  const inherits = [];
  for (const decl of declarations) {
    if (!ts.isInterfaceDeclaration(decl) || !decl.heritageClauses) continue;
    for (const clause of decl.heritageClauses) {
      for (const t of clause.types) {
        const text = cleanType(t.getText());
        const exprType = checker.getTypeAtLocation(t);
        const fromReact = (exprType.getSymbol()?.declarations ?? []).some(d => !isOwnFile(d.getSourceFile().fileName));
        if (fromReact || /HTMLAttributes|Attributes</.test(text)) inherits.push(text);
      }
    }
  }
  return inherits;
}

function describeComponent(name, symbol) {
  const resolved = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
  const declaration = resolved.valueDeclaration ?? resolved.declarations?.[0];
  if (!declaration || !isOwnFile(declaration.getSourceFile().fileName)) return undefined;
  const file = relative(srcDir, declaration.getSourceFile().fileName).split(sep).join('/');
  if (!file.startsWith('components/') && !file.startsWith('theme/')) return undefined;

  const type = checker.getTypeOfSymbolAtLocation(resolved, declaration);
  const signature = type.getCallSignatures()[0];
  if (!signature) return undefined;
  const propsParam = signature.getParameters()[0];
  if (!propsParam) return undefined;
  let propsType = checker.getTypeOfSymbolAtLocation(propsParam, declaration);
  // Generic components: Select<T>(props: SelectProps<T> & { ref?: … })
  if (propsType.isIntersection()) {
    propsType = propsType.types.find(t => t.getProperties().length > 1) ?? propsType;
  }

  const defaults = extractDefaults(findImplementation(declaration));
  const props = {};
  for (const prop of checker.getPropertiesOfType(propsType)) {
    const decls = prop.declarations ?? [];
    if (!decls.length || !decls.some(d => isOwnFile(d.getSourceFile().fileName))) continue;
    if (prop.name === 'ref' || prop.name === 'key') continue;
    const propType = checker.getTypeOfSymbolAtLocation(prop, decls[0]);
    const entry = {
      type: cleanType(checker.typeToString(propType, undefined, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope)),
      required: !(prop.flags & ts.SymbolFlags.Optional),
    };
    if (defaults[prop.name] !== undefined) entry.default = defaults[prop.name];
    const description = docText(prop) || COMMON_DESCRIPTIONS[prop.name];
    if (description) entry.description = description;
    if (prop.name === 'className' && entry.default === "''") delete entry.default;
    props[prop.name] = entry;
  }

  const base = file.split('/').pop().replace(/\.tsx?$/, '');
  let category = CATEGORY_BY_FILE[base] ?? (file.startsWith('theme/') ? 'Theming' : 'Other');
  if (LAYOUT_COMPONENTS.has(name)) category = 'Layout';
  if (NAVIGATION_COMPONENTS.has(name)) category = 'Navigation';

  const result = {
    category,
    source: `packages/react/src/${file}`,
    description: docText(resolved),
    props,
  };
  const inherits = heritageOf(propsType);
  if (inherits.length) result.inherits = inherits;
  const examples = jsDocTags(resolved, 'example');
  if (examples.length) result.examples = examples;
  return result;
}

const components = {};
const hooks = {};
for (const symbol of checker.getExportsOfModule(moduleSymbol)) {
  const name = symbol.getName();
  const resolved = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
  if (!(resolved.flags & (ts.SymbolFlags.Function | ts.SymbolFlags.Variable))) continue;

  if (/^use[A-Z]/.test(name)) {
    const decl = resolved.valueDeclaration ?? resolved.declarations?.[0];
    if (decl && isOwnFile(decl.getSourceFile().fileName)) {
      const type = checker.getTypeOfSymbolAtLocation(resolved, decl);
      const sig = type.getCallSignatures()[0];
      hooks[name] = {
        signature: sig ? cleanType(checker.signatureToString(sig)) : undefined,
        description: docText(resolved),
      };
    }
    continue;
  }
  if (!/^[A-Z]/.test(name)) continue;
  const described = describeComponent(name, symbol);
  if (described) components[name] = described;
}

const pkg = JSON.parse(readFileSync(join(reactPkg, 'package.json'), 'utf8'));
const sortObject = obj => Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)));
const manifest = {
  name: 'Field Design System Component Manifest',
  package: pkg.name,
  version: pkg.version,
  generatedBy: 'scripts/generate-manifest.mjs - do not edit by hand',
  components: sortObject(components),
  hooks: sortObject(hooks),
};

const outFile = join(root, 'docs/COMPONENT_MANIFEST.json');
// Normalise CRLF from Windows checkouts so the manifest is identical on every OS.
const lf = (_key, value) => (typeof value === 'string' ? value.replace(/\r\n/g, '\n') : value);
writeFileSync(outFile, JSON.stringify(manifest, lf, 2) + '\n');
console.log(`Wrote ${Object.keys(components).length} components and ${Object.keys(hooks).length} hooks to docs/COMPONENT_MANIFEST.json`);
