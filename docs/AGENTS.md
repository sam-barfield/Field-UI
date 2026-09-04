# AGENTS.md — Field Design System Specification for AI Coding Agents

This document is the authoritative guide for AI coding assistants (e.g. Antigravity, Claude, ChatGPT, Copilot) when generating, refactoring, or reviewing code that uses the **Field Design System**.

---

## 1. Golden Rules for Agents

1. **NEVER hardcode arbitrary color hexes or raw pixel paddings in component styles.**
   Always use Field design tokens via CSS variables (`var(--field-surface-raised)`, `var(--field-accent-primary)`, `var(--field-space-4)`) or Field primitive components (`<Stack>`, `<Flex>`, `<Card>`).
2. **Always wrap application root trees with `<ThemeProvider>` and import the core CSS.**
   ```tsx
   import '@sam.barfield/field-react/styles.css';
   import { ThemeProvider } from '@sam.barfield/field-react';
   ```
   *Note*: In published environments, packages are scoped to `@sam.barfield/field-react` and `@sam.barfield/field-tokens`.
3. **Use compound and compositional patterns.**
   - Prefer `<Card><CardHeader>...</CardHeader><CardContent>...</CardContent></Card>` over monolithic custom divs.
   - For custom tables, use compound primitives `<Table><TableHeader><TableRow><TableHead>...</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>...</TableCell></TableRow></TableBody></Table>`.
   - For automated data rendering, sorting, row selection, and nested rows, use `<Table columns={columns} data={data} keyExtractor={...} />`.
4. **All interactive controls must have accessible labels.**
   - For `<IconButton>`, always provide `aria-label="Action description"`.
   - For `<TextInput>`, supply `label="..."` or `aria-label="..."`.

---

## 2. Component Import Quick Reference

```tsx
import {
  // Theme & Context
  ThemeProvider,
  useTheme,
  SidebarProvider,
  useSidebar,
  
  // Actions & Buttons
  Button,
  IconButton,
  ButtonGroup,
  SegmentedControl,
  DropdownMenu,
  DropdownGroup,
  DropdownItem,
  DropdownDivider,
  DropdownLabel,
  
  // Forms & Inputs
  TextInput,
  TextArea,
  Select,
  Combobox,
  NumberInput,
  Switch,
  Checkbox,
  RadioGroup,
  Slider,
  DatePicker,
  DateRangePicker,
  
  // Navigation & Shell
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarItem,
  SidebarDropdown,
  SidebarSubItem,
  SidebarFooter,
  SidebarTrigger,
  Tabs,
  Breadcrumb,
  Pagination,
  Stepper,
  
  // Layout & Structure
  Box,
  Flex,
  Stack,
  Grid,
  Container,
  Divider,
  
  // Data Display & Terminals
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  StatCard,
  Badge,
  Avatar,
  AvatarGroup,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  EmptyState,
  TreeView,
  Timeline,
  Accordion,
  Tooltip,
  Terminal,
  TerminalHeader,
  TerminalBody,
  TerminalLine,
  TerminalPrompt,
  
  // Developer Primitives
  CodeBlock,
  DiffViewer,
  CopyButton,
  StatusDot,
  Sparkline,
  Meter,
  
  // Feedback & Overlays
  Modal,
  Drawer,
  Popover,
  ContextMenu,
  CommandPalette,
  Alert,
  ToastProvider,
  useToast,
  Progress,
  Spinner,
  Skeleton,
  
  // Typography
  Heading,
  Text,
  Kbd,
  Code,
} from '@sam.barfield/field-react';
```

---

## 3. Standard Design Token Variables Reference

| Token CSS Variable | Intended Semantic Usage |
|:---|:---|
| `--field-surface-base` | Root application background (dark obsidian or crisp light) |
| `--field-surface-raised` | Cards, panels, elevated sections |
| `--field-surface-overlay` | Modals, drawers, dropdown menus |
| `--field-surface-sunken` | Text inputs, code blocks, recessed containers |
| `--field-border-subtle` | Micro-borders, dividers, table cell lines |
| `--field-border-default` | Input borders, card outlines |
| `--field-border-strong` | Active cards, modal outlines |
| `--field-border-focus` | Keyboard focus ring color |
| `--field-border-highlight` | 1px top specular highlight on active/primary surfaces |
| `--field-text-primary` | Main readable text and headings |
| `--field-text-secondary` | Descriptive labels, captions, metadata |
| `--field-text-tertiary` | Disabled states, placeholders, subtle hints |
| `--field-accent-primary` | Primary action buttons, active toggles, highlights |
| `--field-accent-hover` | Hover state for accent elements |
| `--field-accent-contrast` | High-contrast foreground on primary accents (#FFFFFF or #000000) |
| `--field-status-success-surface` | Soft tint background for success alerts & badges |
| `--field-status-warning-surface` | Soft tint background for warning alerts & badges |
| `--field-status-danger-surface` | Soft tint background for danger alerts & buttons |
| `--field-status-info-surface` | Soft tint background for info alerts & badges |
| `--field-radius-sm` | 5px - inputs, buttons, badges |
| `--field-radius-md` | 8px - cards, dialogs, dropdowns |
| `--field-radius-lg` | 12px - modals, large containers |

---

## 4. Common Code Recipes for Agents

### Recipe A: Metric Card with Sparkline Trend
```tsx
<StatCard
  label="CPU UTILIZATION"
  value="42.8%"
  delta={{ value: "+2.1%", trend: "up" }}
  subtitle="p99 percentile across 12 worker nodes"
  chart={<Sparkline data={[20, 24, 32, 28, 45, 42]} color="accent" height={32} />}
/>
```

### Recipe B: Data Table with Sorting, Selection, and Pagination
```tsx
const columns: Column<EC2Instance>[] = [
  { key: 'name', header: 'Name', sortable: true },
  {
    key: 'status',
    header: 'Status',
    render: row => <StatusDot status={row.status === 'running' ? 'success' : 'danger'} pulse={row.status === 'running'} label={row.status} />,
  },
  { key: 'type', header: 'Instance Type', sortable: true },
  {
    key: 'actions',
    header: 'Actions',
    render: row => (
      <DropdownMenu trigger={<IconButton icon={<MoreVertical size={16} />} aria-label="Instance actions" />}>
        <DropdownGroup label="Lifecycle">
          <DropdownItem onSelect={() => handleReboot(row)}>Reboot</DropdownItem>
          <DropdownItem onSelect={() => handleStop(row)}>Stop</DropdownItem>
        </DropdownGroup>
        <DropdownDivider />
        <DropdownItem variant="danger" onSelect={() => handleTerminate(row)}>Terminate</DropdownItem>
      </DropdownMenu>
    ),
  },
];

<Table
  columns={columns}
  data={paginatedData}
  keyExtractor={row => row.id}
  selectable={true}
  selectedKeys={selectedIds}
  onSelectionChange={setSelectedIds}
  renderBulkActions={(keys, clear) => (
    <Button size="sm" variant="danger" onClick={() => handleBulkTerminate(keys)}>Terminate Selected ({keys.length})</Button>
  )}
/>
<Pagination
  currentPage={page}
  totalPages={Math.ceil(total / pageSize)}
  pageSize={pageSize}
  onPageChange={setPage}
  onPageSizeChange={setPageSize}
  totalItems={total}
/>
```

### Recipe C: Interactive Modal (with Stacking-Safe Portal)
```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Deploy to Staging"
  description="Are you sure you want to push build #4829 to the staging cluster?"
  footer={
    <Flex justify="flex-end" gap="8px">
      <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
      <Button variant="primary" onClick={handleDeploy}>Confirm Deployment</Button>
    </Flex>
  }
>
  <Text tone="secondary" size="sm">
    This operation will temporarily restart 4 worker pods in region us-east-1.
  </Text>
</Modal>
```

### Recipe D: Command Palette (⌘K Omnibar)
```tsx
<CommandPalette
  isOpen={commandOpen}
  onClose={() => setCommandOpen(false)}
  items={[
    { id: '1', title: 'Launch EC2 Instance', category: 'Compute', onSelect: handleLaunch, shortcut: '⌘L' },
    { id: '2', title: 'View S3 Buckets', category: 'Storage', onSelect: () => navigate('/s3') },
    { id: '3', title: 'Open CloudShell', category: 'Tools', onSelect: () => setShellOpen(true), shortcut: '⌘`' },
  ]}
/>
```

### Recipe E: Code Block with Syntax and Copy
```tsx
<CodeBlock
  code={policyJson}
  language="json"
  showLineNumbers={true}
  highlightLines={[4, 5]}
  title="iam-policy-production.json"
  copyable={true}
  maxHeight="320px"
/>
```

### Recipe F: Multi-Select Combobox and Number Stepper
```tsx
<Stack gap="16px">
  <Combobox
    label="Security Groups"
    options={[
      { value: 'sg-prod-web', label: 'sg-prod-web (Port 443)' },
      { value: 'sg-prod-db', label: 'sg-prod-db (Port 5432)' },
      { value: 'sg-bastion', label: 'sg-bastion (Port 22)' },
    ]}
    value={selectedSgs}
    onChange={setSelectedSgs}
  />
  <NumberInput
    label="Memory Allocation"
    value={memoryMb}
    onChange={setMemoryMb}
    min={512}
    max={65536}
    step={512}
    unit="MiB"
  />
</Stack>
```

### Recipe G: Collapsible App Shell with Sidebar & Header Trigger
```tsx
// Pattern 1: Integrated shell with SidebarProvider
<SidebarProvider defaultCollapsed={false}>
  <div style={{ display: 'flex', height: '100vh' }}>
    <Sidebar
      header={<SidebarHeader logo={<span>⚡</span>} title="Control Center" />}
      footer={<SidebarFooter collapsedChildren={<User size={16} />}><span>Admin User</span></SidebarFooter>}
    >
      <SidebarGroup label="Overview">
        <SidebarItem icon={<Home size={16} />} label="Dashboard" active />
        <SidebarItem icon={<Activity size={16} />} label="Monitoring" badge="Live" />
      </SidebarGroup>
    </Sidebar>
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '12px', borderBottom: '1px solid var(--field-border-subtle)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <SidebarTrigger />
        <Heading level={3}>Monitoring</Heading>
      </header>
      <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
        {/* Content */}
      </div>
    </main>
  </div>
</SidebarProvider>

// Pattern 2: Standalone Controlled Trigger
<SidebarTrigger isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
```

---

## 5. Recent Prop Guidelines & Patterns

- **`Badge`**: Supports `size="sm" | "md" | "lg"` (default `"md"`). Use `size="sm"` for compact inline status indicators inside tables or cards.
- **`Breadcrumb`**: Items support `onClick` handlers directly without requiring dummy `href="#"` attributes, enabling native client-side routing.
- **`SidebarFooter`**: Supports `collapsedChildren?: React.ReactNode` to provide an alternative compact view when the sidebar is minimized.
- **`SidebarTrigger`**: Works within `<Sidebar>`, `<SidebarProvider>`, or as a standalone controlled toggle (`isCollapsed`, `onToggle`). Safe to call `useSidebar()` anywhere; it returns a safe no-op fallback outside providers.
- **`Accordion`**: Supports custom flex headers; title container expands with `flex: 1` so right-aligned tags or badges in header JSX are positioned correctly.
- **`DateRangePicker`**: Supports bidirectional range selection previews when hovering either forward or backward in time.

