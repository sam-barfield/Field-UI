# AGENTS.md — Field Design System Specification for AI Coding Agents

This document is the authoritative guide for AI coding assistants (e.g. Antigravity, Claude, ChatGPT, Copilot) when generating, refactoring, or reviewing code that uses the **Field Design System**.

---

## 1. Golden Rules for Agents

1. **NEVER hardcode arbitrary color hexes or raw pixel paddings in component styles.**
   Always use Field design tokens via CSS variables (`var(--field-surface-raised)`, `var(--field-accent-primary)`, `var(--field-space-4)`) or Field primitive components (`<Stack>`, `<Flex>`, `<Card>`).
2. **Always wrap application root trees with `<ThemeProvider>` and import the core CSS.**
   ```tsx
   import '@field/react/styles.css'; // or include field.css
   import { ThemeProvider } from '@field/react';
   ```
3. **Use compound and compositional patterns.**
   - Prefer `<Card><CardHeader>...</CardHeader><CardContent>...</CardContent></Card>` over monolithic custom divs.
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
  
  // Actions & Buttons
  Button,
  IconButton,
  ButtonGroup,
  SegmentedControl,
  
  // Forms & Inputs
  TextInput,
  TextArea,
  Select,
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
  Tabs,
  Breadcrumb,
  
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
  Accordion,
  Tooltip,
  Terminal,
  TerminalHeader,
  TerminalBody,
  TerminalLine,
  TerminalPrompt,
  
  // Feedback & Overlays
  Modal,
  Drawer,
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
} from '@field/react';
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
| `--field-text-primary` | Main readable text and headings |
| `--field-text-secondary` | Descriptive labels, captions, metadata |
| `--field-text-tertiary` | Disabled states, placeholders, subtle hints |
| `--field-accent-primary` | Primary action buttons, active toggles, highlights |
| `--field-accent-hover` | Hover state for accent elements |
| `--field-accent-subtle` | Translucent background wash for tags and badges |
| `--field-radius-sm` | 5px - inputs, buttons, badges |
| `--field-radius-md` | 8px - cards, dialogs, dropdowns |
| `--field-radius-lg` | 12px - modals, large containers |

---

## 4. Common Code Recipes for Agents

### Recipe A: Metric Card with Trend
```tsx
<StatCard
  label="SYSTEM LATENCY"
  value="18.4 ms"
  delta={{ value: "-4.2%", trend: "up" }}
  subtitle="p99 percentile across 12 edge nodes"
/>
```

### Recipe B: Accessible Form Section
```tsx
<Card>
  <CardHeader>
    <Heading level={3}>Security Settings</Heading>
    <Text tone="secondary" size="sm">Manage two-factor authentication and session keys</Text>
  </CardHeader>
  <CardContent>
    <Stack gap="16px">
      <TextInput
        label="Service Key Name"
        placeholder="e.g. prod-agent-worker"
        helperText="Alphanumeric string used for telemetry identification"
      />
      <Select
        label="Key Expiration"
        options={[
          { value: '30d', label: '30 Days' },
          { value: '90d', label: '90 Days' },
          { value: '1y', label: '1 Year' },
        ]}
        defaultValue="90d"
      />
      <Switch
        label="Enforce Hardware Token"
        description="Requires FIDO2 WebAuthn credential on every session"
        checked={enforceMfa}
        onChange={setEnforceMfa}
      />
    </Stack>
  </CardContent>
  <CardFooter>
    <Flex justify="flex-end" gap="8px">
      <Button variant="ghost">Cancel</Button>
      <Button variant="primary">Save Changes</Button>
    </Flex>
  </CardFooter>
</Card>
```

### Recipe C: Interactive Modal
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

### Recipe D: Date & Range Selection with Done/Close
```tsx
<Stack gap="16px">
  <DatePicker
    label="Release Date"
    value={selectedDate}
    onChange={setSelectedDate}
    showDoneButton={true}
    showCloseButton={true}
  />
  <DateRangePicker
    label="Audit Window"
    value={dateRange}
    onChange={setDateRange}
    showDoneButton={true}
  />
</Stack>
```

### Recipe E: Cloud Shell Terminal
```tsx
<Terminal>
  <TerminalHeader
    title="cluster-telemetry: us-east-1"
    onClear={handleClear}
    onCopyAll={handleCopy}
  />
  <TerminalBody>
    {logs.map((log, i) => (
      <TerminalLine
        key={i}
        level={log.level}
        timestamp={log.timestamp}
        message={log.message}
      />
    ))}
  </TerminalBody>
  <TerminalPrompt onSubmit={handleCommand} />
</Terminal>
```

### Recipe F: Application Navigation Sidebar with Dropdowns
```tsx
<Sidebar isCollapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} density="compact">
  <SidebarHeader logo={<Shield size={20} />} title="Field Cloud" />
  <SidebarContent>
    <SidebarGroup title="Platform">
      <SidebarItem icon={<Server size={18} />} label="Overview" active />
      <SidebarDropdown icon={<Cloud size={18} />} label="Infrastructure">
        <SidebarSubItem label="Kubernetes Clusters" description="Multi-region fleet" />
        <SidebarSubItem label="Edge DNS" description="Global Anycast routing" />
      </SidebarDropdown>
    </SidebarGroup>
  </SidebarContent>
  <SidebarFooter user={{ name: 'Operator Alex', role: 'SecOps' }} />
</Sidebar>
```

