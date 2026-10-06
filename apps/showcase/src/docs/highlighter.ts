import { Prism, normalizeTokens } from 'prism-react-renderer';
import type { CodeHighlighter } from '@sam.barfield/field-react';

// prism-react-renderer bundles the common web grammars; add the two small ones the docs also use.
Prism.languages.bash = {
  comment: { pattern: /(^|\s)#.*/, lookbehind: true },
  string: { pattern: /(["'])(?:\\.|(?!\1)[^\\\n])*\1/, greedy: true },
  variable: /\$\{?[\w]+\}?/,
  function: { pattern: /(^|[\n;|&]\s*)(?:npm|npx|yarn|pnpm|git|cd|node|curl|echo)\b/, lookbehind: true },
  parameter: /(?:^|\s)--?[\w-]+/,
  operator: /&&|\|\||[|;>]/,
};
Prism.languages.sh = Prism.languages.shell = Prism.languages.bash;

Prism.languages.ini = {
  comment: /^[ \t]*[;#].*/m,
  selector: /^[ \t]*\[.*\]/m,
  'attr-name': { pattern: /^[ \t]*[^\s=]+(?=[ \t]*=)/m },
  'attr-value': { pattern: /(=[ \t]*).+/, lookbehind: true, inside: { variable: /\$\{[^}]+\}/ } },
  punctuation: /=/,
};

const plain = (code: string) => code.split('\n').map(line => [{ content: line, types: ['plain'] }]);

/** Prism-based highlighter for Field's CodeBlock. Unknown languages render as plain text. */
export const prismHighlighter: CodeHighlighter = (code, language = 'tsx') => {
  const grammar = Prism.languages[language.toLowerCase()];
  if (!grammar) return plain(code);
  return normalizeTokens(Prism.tokenize(code, grammar));
};
