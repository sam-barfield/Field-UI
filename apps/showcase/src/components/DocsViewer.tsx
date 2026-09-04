import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Select,
  Badge,
  Heading,
  Text,
  Tabs,
  Stack,
  useToast,
} from '@field/react';
import { Copy, Bot, BookOpen, Terminal, Sparkles, Check } from 'lucide-react';

export const DocsViewer: React.FC = () => {
  const { showToast } = useToast();
  const [docTab, setDocTab] = useState<'agents' | 'manifest' | 'quickstart' | 'generator'>('generator');
  const [agentTask, setAgentTask] = useState('dashboard');
  const [copied, setCopied] = useState(false);

  const promptRecipes: Record<string, string> = {
    dashboard: `You are an expert frontend engineer using the **Field Design System** (@sam.barfield/field-react, @sam.barfield/field-tokens).
Create an analytics overview panel featuring:
- 3 StatCards with metrics: 'P99 Latency', 'Request Rate', and 'Error Budget', using tabular figures and trend deltas.
- An infrastructure Table showing Server Nodes, Status (using Badge with dot), and Throughput.
- A Filter Bar containing a TextInput search with a Search icon left adornment, and a Select for regional filtering.
Follow these rules strictly:
1. Wrap root with <ThemeProvider> and import '@sam.barfield/field-react/styles.css'.
2. Use Field components (<Card>, <Stack>, <Flex>, <Button>, <Badge>, <Table>).
3. Do NOT hardcode arbitrary colors; rely entirely on Field design tokens and CSS variables.`,
    form: `You are an expert frontend engineer using the **Field Design System** (@sam.barfield/field-react, @sam.barfield/field-tokens).
Create a secure credentials management form containing:
- Card with CardHeader, CardContent, and CardFooter.
- TextInput for 'API Key Label' and a password TextInput for 'Secret Access Token'.
- Switch toggle for 'Enforce Hardware Key (WebAuthn)'.
- Select dropdown for 'Token Expiration Duration' (30d, 90d, 1y).
- CardFooter with 'Cancel' (variant="ghost") and 'Generate Key' (variant="primary") buttons.
Follow Field accessibility guidelines: provide explicit labels, error states, and helper text.`,
    modal: `You are an expert frontend engineer using the **Field Design System** (@sam.barfield/field-react, @sam.barfield/field-tokens).
Build an accessible confirmation modal using <Modal>:
- State managed with isOpen and onClose.
- Keyboard support with Escape key dismissal and focus trapping.
- Include a descriptive title, body with an <Alert variant="warning"> callout, and a footer with 'Cancel' and 'Proceed' buttons.`,
  };

  const currentPrompt = promptRecipes[agentTask] || promptRecipes.dashboard;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(currentPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast({
      title: 'Agent Prompt Copied',
      description: 'Ready to paste into Antigravity, Claude, or ChatGPT.',
      variant: 'success',
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Heading level={2}>Field System Documentation</Heading>
          <Text tone="secondary" size="sm">
            Comprehensive specifications for engineers, designers, and autonomous AI coding agents.
          </Text>
        </div>
        <Badge variant="accent" dot>Multi-Target Documentation</Badge>
      </div>

      <Tabs
        activeId={docTab}
        onChange={id => setDocTab(id as any)}
        items={[
          { id: 'generator', label: 'Agent Prompt Generator', icon: <Sparkles size={14} /> },
          { id: 'quickstart', label: 'Quickstart & React Setup', icon: <BookOpen size={14} /> },
          { id: 'agents', label: 'AGENTS.md Spec', icon: <Bot size={14} /> },
          { id: 'manifest', label: 'Component Manifest (JSON)', icon: <Terminal size={14} /> },
        ]}
      />

      {docTab === 'generator' && (
        <Card>
          <CardHeader>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <Heading level={3}>AI Agent Prompt Generator</Heading>
                <Text tone="secondary" size="xs">
                  Generate hyper-accurate, zero-hallucination prompts to give to any coding assistant.
                </Text>
              </div>
              <Button
                variant="primary"
                size="sm"
                leftIcon={copied ? <Check size={14} /> : <Copy size={14} />}
                onClick={handleCopyPrompt}
              >
                {copied ? 'Copied to Clipboard' : 'Copy Agent Prompt'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Stack gap="16px">
              <Select
                label="Target UI Pattern"
                value={agentTask}
                onChange={setAgentTask}
                options={[
                  { value: 'dashboard', label: 'Telemetry & Analytics Overview Panel' },
                  { value: 'form', label: 'Accessible Credentials & Security Form' },
                  { value: 'modal', label: 'Interactive Confirmation Dialog Modal' },
                ]}
              />

              <div
                style={{
                  backgroundColor: 'var(--field-surface-sunken)',
                  border: '1px solid var(--field-border-default)',
                  borderRadius: 'var(--field-radius-md)',
                  padding: '16px',
                }}
              >
                <pre
                  style={{
                    margin: 0,
                    fontFamily: 'var(--field-font-mono)',
                    fontSize: '0.8125rem',
                    color: 'var(--field-text-primary)',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {currentPrompt}
                </pre>
              </div>
            </Stack>
          </CardContent>
        </Card>
      )}

      {docTab === 'quickstart' && (
        <Card>
          <CardHeader>
            <Heading level={3}>Getting Started with Field in React & TypeScript</Heading>
            <Text tone="secondary" size="xs">Installation and setup in Next.js, Vite, or Remix</Text>
          </CardHeader>
          <CardContent>
            <Stack gap="16px">
              <div>
                <Text weight="medium">1. Install packages</Text>
                <div style={{ marginTop: '8px', padding: '12px', background: 'var(--field-surface-sunken)', borderRadius: 'var(--field-radius-md)', fontFamily: 'var(--field-font-mono)', fontSize: '0.8125rem' }}>
                  npm install @sam.barfield/field-react @sam.barfield/field-tokens lucide-react
                </div>
              </div>

              <div>
                <Text weight="medium">2. Mount the ThemeProvider and CSS styles</Text>
                <div style={{ marginTop: '8px', padding: '12px', background: 'var(--field-surface-sunken)', borderRadius: 'var(--field-radius-md)', fontFamily: 'var(--field-font-mono)', fontSize: '0.8125rem' }}>
                  <pre style={{ margin: 0 }}>{`import '@sam.barfield/field-react/styles.css';
import { ThemeProvider, Button, Card, darkTheme } from '@sam.barfield/field-react';

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider initialTheme={darkTheme} defaultMode="dark">
      {children}
    </ThemeProvider>
  );
}`}</pre>
                </div>
              </div>

              <div>
                <Text weight="medium">3. Build with typed components</Text>
                <div style={{ marginTop: '8px', padding: '12px', background: 'var(--field-surface-sunken)', borderRadius: 'var(--field-radius-md)', fontFamily: 'var(--field-font-mono)', fontSize: '0.8125rem' }}>
                  <pre style={{ margin: 0 }}>{`import { Button, TextInput, StatCard } from '@sam.barfield/field-react';

export function ExampleWidget() {
  return (
    <StatCard
      label="THROUGHPUT"
      value="42.8 Gbps"
      delta={{ value: "+14%", trend: "up" }}
    />
  );
}`}</pre>
                </div>
              </div>
            </Stack>
          </CardContent>
        </Card>
      )}

      {docTab === 'agents' && (
        <Card>
          <CardHeader>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Heading level={3}>docs/AGENTS.md Specification</Heading>
              <Button
                size="sm"
                variant="secondary"
                leftIcon={<Copy size={14} />}
                onClick={() => {
                  navigator.clipboard.writeText(
                    `Find the complete AGENTS.md in the project docs/AGENTS.md directory.`
                  );
                  showToast({ title: 'Path Copied', description: 'docs/AGENTS.md', variant: 'info' });
                }}
              >
                Copy Reference
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ padding: '16px', background: 'var(--field-surface-sunken)', borderRadius: 'var(--field-radius-md)', fontFamily: 'var(--field-font-mono)', fontSize: '0.8125rem', lineHeight: 1.6 }}>
              <strong>Key Agent Rules:</strong><br />
              1. Never hardcode hex codes or pixel spacings.<br />
              2. Always use tokens via CSS variables (e.g. <code>var(--field-surface-raised)</code>) or layout primitives.<br />
              3. Provide accessible names for every button (<code>aria-label</code> on IconButton) and input.<br />
              4. Always respect dark-first defaults with high-contrast borders.
            </div>
          </CardContent>
        </Card>
      )}

      {docTab === 'manifest' && (
        <Card>
          <CardHeader>
            <Heading level={3}>Machine-Readable Component Manifest</Heading>
            <Text tone="secondary" size="xs">Exported for LLM structured tool calling and schema validation</Text>
          </CardHeader>
          <CardContent>
            <div style={{ padding: '16px', background: 'var(--field-surface-sunken)', borderRadius: 'var(--field-radius-md)', fontFamily: 'var(--field-font-mono)', fontSize: '0.8125rem' }}>
              <pre style={{ margin: 0, maxHeight: '350px', overflowY: 'auto' }}>
{`{
  "name": "Field Design System",
  "version": "0.2.0",
  "packages": [
    "@sam.barfield/field-tokens",
    "@sam.barfield/field-react"
  ],
  "components": [
    "Button", "IconButton", "ButtonGroup", "SegmentedControl",
    "TextInput", "TextArea", "Select", "Combobox", "NumberInput", "Switch", "Checkbox", "RadioGroup", "Slider",
    "DatePicker", "DateRangePicker",
    "Sidebar", "SidebarHeader", "SidebarContent", "SidebarGroup", "SidebarItem", "SidebarDropdown", "SidebarSubItem", "SidebarFooter", "SidebarTrigger", "SidebarProvider",
    "Terminal", "TerminalHeader", "TerminalBody", "TerminalLine", "TerminalPrompt",
    "Card", "CardHeader", "CardContent", "CardFooter", "StatCard", "Badge", "Avatar", "AvatarGroup", "Modal", "Drawer", "Popover", "ContextMenu", "CommandPalette",
    "Tabs", "Table", "TableHeader", "TableBody", "TableRow", "TableCell", "TableHead", "EmptyState", "TreeView", "Timeline", "Accordion", "Tooltip", "Alert", "ToastProvider", "Progress", "Spinner", "Skeleton",
    "CodeBlock", "DiffViewer", "CopyButton", "StatusDot", "Sparkline", "Meter",
    "Breadcrumb", "Pagination", "Stepper",
    "Heading", "Text", "Kbd", "Code", "Box", "Flex", "Stack", "Grid", "Container", "Divider"
  ],
  "accessibility": "WAI-ARIA 1.2 AA compliant",
  "tokenSpecification": "W3C DTCG Format"
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
