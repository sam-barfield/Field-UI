// title: Syntax highlighting
// description: Field ships no grammars to stay small. Plug in any tokenizer (here Prism via prism-react-renderer) once with CodeHighlighterProvider, or per block with the highlighter prop. Colours come from theme tokens, so they follow every theme. highlighter={null} opts a block out.
import { CodeBlock, CodeHighlighterProvider, Stack, type CodeHighlighter } from '@sam.barfield/field-react';
import { Prism, normalizeTokens } from 'prism-react-renderer';

const prismHighlighter: CodeHighlighter = (code, language = 'tsx') => {
  const grammar = Prism.languages[language];
  return grammar
    ? normalizeTokens(Prism.tokenize(code, grammar))
    : code.split('\n').map(line => [{ content: line, types: ['plain'] }]);
};

const CODE = `const config = { replicas: 3, region: 'eu-west-1' };
// Scale up when CPU is high
export function scale(cpu: number) {
  return cpu > 80 ? config.replicas + 1 : config.replicas;
}`;

export default function SyntaxHighlighting() {
  return (
    <CodeHighlighterProvider highlighter={prismHighlighter}>
      <Stack gap={12} className="example-wide">
        <CodeBlock code={CODE} language="ts" title="Highlighted" />
        <CodeBlock code={CODE} language="ts" title="Plain" highlighter={null} />
      </Stack>
    </CodeHighlighterProvider>
  );
}
