import React, { useState } from 'react';
import {
  Button,
  IconButton,
  ButtonGroup,
  SegmentedControl,
  TextInput,
  TextArea,
  Select,
  Switch,
  Checkbox,
  RadioGroup,
  Slider,
  Card,
  CardHeader,
  CardContent,
  StatCard,
  Badge,
  Avatar,
  AvatarGroup,
  Table,
  Modal,
  Drawer,
  Tabs,
  Accordion,
  Tooltip,
  Alert,
  Progress,
  Spinner,
  Skeleton,
  Breadcrumb,
  Flex,
  Grid,
  Stack,
  Heading,
  Text,
  Kbd,
  Code,
  Divider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarItem,
  SidebarDropdown,
  SidebarSubItem,
  SidebarFooter,
  Terminal,
  TerminalHeader,
  TerminalBody,
  TerminalLine,
  TerminalPrompt,
  DatePicker,
  DateRangePicker,
  DateRange,
  useToast,
  DropdownMenu,
  DropdownGroup,
  DropdownItem,
  DropdownDivider,
  CommandPalette,
  Popover,
  ContextMenu,
  Pagination,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  EmptyState,
  TreeView,
  Stepper,
  Timeline,
  CodeBlock,
  DiffViewer,
  CopyButton,
  StatusDot,
  Sparkline,
  Meter,
  NumberInput,
  Combobox,
} from '@field/react';
import {
  MousePointerClick,
  Sliders,
  Layout,
  Compass,
  Database,
  BellRing,
  Type,
  Search,
  Copy,
  ExternalLink,
  Shield,
  Layers,
  Zap,
  Activity,
  Cpu,
  Trash2,
  RefreshCw,
  Plus,
  Play,
  Heart,
  Share2,
  Clock,
  MoreVertical,
  Command,
  Server,
  ServerOff,
  RotateCcw,
  Square,
} from 'lucide-react';

interface ComponentEntry {
  id: string;
  name: string;
  category: string;
  description: string;
  importCode: string;
}

const componentRegistry: ComponentEntry[] = [
  // Actions
  { id: 'btn', name: 'Button', category: 'Actions', description: 'Engineered tactile action trigger with micro-interactions and specular highlights.', importCode: "import { Button } from '@field/react';" },
  { id: 'icon-btn', name: 'IconButton', category: 'Actions', description: 'Compact square action button optimized for iconography and toolbars.', importCode: "import { IconButton } from '@field/react';" },
  { id: 'btn-group', name: 'ButtonGroup', category: 'Actions', description: 'Cohesive clustered set of related button controls.', importCode: "import { ButtonGroup } from '@field/react';" },
  { id: 'segmented', name: 'SegmentedControl', category: 'Actions', description: 'Tactile multi-option switcher with smooth pill selection.', importCode: "import { SegmentedControl } from '@field/react';" },
  { id: 'dropdown-menu', name: 'DropdownMenu', category: 'Actions', description: 'Contextual actions dropdown with grouped items, icons, and danger triggers.', importCode: "import { DropdownMenu, DropdownGroup, DropdownItem, DropdownDivider } from '@field/react';" },

  // Forms
  { id: 'text-input', name: 'TextInput', category: 'Forms', description: 'Text entry with adornments, status borders, and clean focus rings.', importCode: "import { TextInput } from '@field/react';" },
  { id: 'textarea', name: 'TextArea', category: 'Forms', description: 'Multi-line expanded text input for logs, commands, and descriptions.', importCode: "import { TextArea } from '@field/react';" },
  { id: 'select', name: 'Select', category: 'Forms', description: 'Drop-down select menu with customizable options and helper states.', importCode: "import { Select } from '@field/react';" },
  { id: 'combobox', name: 'Combobox & NumberInput', category: 'Forms', description: 'Searchable multi-select with tag chips, alongside numeric stepper inputs.', importCode: "import { Combobox, NumberInput } from '@field/react';" },
  { id: 'switch', name: 'Switch', category: 'Forms', description: 'Hardware-inspired binary toggle switch with smooth spring easing.', importCode: "import { Switch } from '@field/react';" },
  { id: 'checkbox', name: 'Checkbox', category: 'Forms', description: 'Accessible boolean selection box with high-precision check icon.', importCode: "import { Checkbox } from '@field/react';" },
  { id: 'radio-group', name: 'RadioGroup', category: 'Forms', description: 'Exclusive option list with label and secondary description support.', importCode: "import { RadioGroup } from '@field/react';" },
  { id: 'slider', name: 'Slider & Threshold Levels', category: 'Forms', description: 'Numeric range slider with multi-level threshold zones, dynamic status badges, and illuminated thumb.', importCode: "import { Slider, SliderZone } from '@field/react';" },
  { id: 'datepicker', name: 'DatePicker & Range', category: 'Forms', description: 'Portal-backed precision calendar date and range selector with month jumping and quick presets.', importCode: "import { DatePicker, DateRangePicker } from '@field/react';" },

  // Navigation
  { id: 'sidebar-comp', name: 'Sidebar', category: 'Navigation', description: 'Collapsible application navigation sidebar with groups, icons, and tooltips.', importCode: "import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarItem, SidebarFooter } from '@field/react';" },
  { id: 'tabs', name: 'Tabs', category: 'Navigation', description: 'Responsive underline navigation tab bar with smooth touch rail on mobile.', importCode: "import { Tabs } from '@field/react';" },
  { id: 'breadcrumb', name: 'Breadcrumb', category: 'Navigation', description: 'Hierarchical navigation trail with auto-wrapping on small viewports.', importCode: "import { Breadcrumb } from '@field/react';" },
  { id: 'stepper', name: 'Stepper & Wizard', category: 'Navigation', description: 'Sequential multi-step workflow progress indicator.', importCode: "import { Stepper } from '@field/react';" },

  // Layout
  { id: 'card', name: 'Card', category: 'Layout', description: 'Tactile elevated container with header, content, and footer sections.', importCode: "import { Card, CardHeader, CardContent, CardFooter } from '@field/react';" },
  { id: 'stat-card', name: 'StatCard', category: 'Layout', description: 'Instrument metric card featuring value, trend delta, and status indicators.', importCode: "import { StatCard } from '@field/react';" },
  { id: 'divider', name: 'Divider', category: 'Layout', description: 'Clean structural separator for horizontal or vertical content divisions.', importCode: "import { Divider } from '@field/react';" },
  { id: 'layout-primitives', name: 'Box / Flex / Grid / Stack', category: 'Layout', description: 'Core ergonomic spatial layout primitives for responsive structure.', importCode: "import { Box, Flex, Grid, Stack, Container } from '@field/react';" },

  // Data Display
  { id: 'badge', name: 'Badge', category: 'Data Display', description: 'Status tags and category indicators with optional pulsing pulse dots.', importCode: "import { Badge } from '@field/react';" },
  { id: 'avatar', name: 'Avatar & AvatarGroup', category: 'Data Display', description: 'User profile representation with initials fallback and stacked group count.', importCode: "import { Avatar, AvatarGroup } from '@field/react';" },
  { id: 'table', name: 'DataTable & Pagination', category: 'Data Display', description: 'Tabular data grid with sorting, row selection, bulk actions, and pagination.', importCode: "import { Table, Pagination } from '@field/react';" },
  { id: 'empty-state', name: 'EmptyState', category: 'Data Display', description: 'Centered empty state with iconography, heading, and call to action.', importCode: "import { EmptyState } from '@field/react';" },
  { id: 'tree-view', name: 'TreeView', category: 'Data Display', description: 'Hierarchical directory and cloud resource tree explorer.', importCode: "import { TreeView } from '@field/react';" },
  { id: 'timeline', name: 'Timeline', category: 'Data Display', description: 'Chronological telemetry and audit event stream with status markers.', importCode: "import { Timeline } from '@field/react';" },
  { id: 'code-block', name: 'CodeBlock & DiffViewer', category: 'Data Display', description: 'Syntax-colored code snippets with line numbers and configuration diff views.', importCode: "import { CodeBlock, DiffViewer, CopyButton } from '@field/react';" },
  { id: 'metrics', name: 'StatusDot, Sparkline & Meter', category: 'Data Display', description: 'Subtle telemetry status dots, SVG trend lines, and capacity quota meters.', importCode: "import { StatusDot, Sparkline, Meter } from '@field/react';" },
  { id: 'terminal', name: 'Terminal', category: 'Data Display', description: 'Instrument-grade dark carbon terminal and telemetry log streamer with interactive prompt.', importCode: "import { Terminal, TerminalHeader, TerminalBody, TerminalLine, TerminalPrompt } from '@field/react';" },
  { id: 'kbd-code', name: 'Kbd & Code', category: 'Data Display', description: 'Monospace code snippets and physical keyboard shortcut keys.', importCode: "import { Kbd, Code } from '@field/react';" },

  // Feedback & Overlays
  { id: 'command-palette', name: 'CommandPalette (⌘K)', category: 'Feedback', description: 'Keyboard-first omnibar modal with fuzzy search and quick navigation.', importCode: "import { CommandPalette } from '@field/react';" },
  { id: 'popover', name: 'Popover', category: 'Feedback', description: 'Anchor-positioned floating card for rich interactive overlays.', importCode: "import { Popover } from '@field/react';" },
  { id: 'context-menu', name: 'ContextMenu', category: 'Feedback', description: 'Native-feeling right-click context menu positioned at cursor coordinates.', importCode: "import { ContextMenu } from '@field/react';" },
  { id: 'alert', name: 'Alert', category: 'Feedback', description: 'High-contrast status callouts with subtle tint surfaces and warning tones.', importCode: "import { Alert } from '@field/react';" },
  { id: 'toast', name: 'Toast / useToast', category: 'Feedback', description: 'Non-blocking notification system with auto-dismiss timers and actions.', importCode: "import { useToast, ToastProvider } from '@field/react';" },
  { id: 'modal', name: 'Modal', category: 'Feedback', description: 'Focus-trapped accessible dialog with backdrop blur and escape dismissal.', importCode: "import { Modal } from '@field/react';" },
  { id: 'drawer', name: 'Drawer', category: 'Feedback', description: 'Slide-out right sheet panel for detail views and side configuration.', importCode: "import { Drawer } from '@field/react';" },
  { id: 'tooltip', name: 'Tooltip', category: 'Feedback', description: 'Non-clipped floating micro-label revealing nuance on hover or focus.', importCode: "import { Tooltip } from '@field/react';" },
  { id: 'progress', name: 'Progress', category: 'Feedback', description: 'Illuminated percentage progress bar with label and numeric telemetry.', importCode: "import { Progress } from '@field/react';" },
  { id: 'spinner', name: 'Spinner', category: 'Feedback', description: 'Minimalist spinning indicator for async background operations.', importCode: "import { Spinner } from '@field/react';" },
  { id: 'skeleton', name: 'Skeleton', category: 'Feedback', description: 'Shimmering placeholder box for smooth loading content states.', importCode: "import { Skeleton } from '@field/react';" },
  { id: 'accordion', name: 'Accordion', category: 'Feedback', description: 'Expandable disclosure panel for progressive disclosure of complex settings.', importCode: "import { Accordion } from '@field/react';" },

  // Typography
  { id: 'typography', name: 'Heading & Text', category: 'Typography', description: 'Standardized typographic hierarchy with tight tracking and muted secondary tones.', importCode: "import { Heading, Text } from '@field/react';" },
];

export const ComponentCatalog: React.FC = () => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState('btn');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [catalogCollapsed, setCatalogCollapsed] = useState(false);

  // Interactive component states
  const [demoSwitch, setDemoSwitch] = useState(true);
  const [demoCheckbox, setDemoCheckbox] = useState(true);
  const [demoSegmented, setDemoSegmented] = useState('grid');
  const [demoSelect, setDemoSelect] = useState('us-east');
  const [demoRadio, setDemoRadio] = useState('balanced');
  const [demoSlider, setDemoSlider] = useState(65);
  const [demoLevelSlider, setDemoLevelSlider] = useState(72);
  const [demoSliderGlow, setDemoSliderGlow] = useState(false);
  const [demoActiveTab, setDemoActiveTab] = useState('general');
  const [demoSidebarDensity, setDemoSidebarDensity] = useState<'default' | 'compact'>('default');
  const [demoSidebarCollapsed, setDemoSidebarCollapsed] = useState(false);
  const [demoDate, setDemoDate] = useState<Date | null>(new Date());
  const [demoRange, setDemoRange] = useState<DateRange>({
    start: new Date(Date.now() - 7 * 86400000),
    end: new Date(),
  });
  const [demoDatePickerWithDone, setDemoDatePickerWithDone] = useState(true);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [demoCombobox, setDemoCombobox] = useState<string[]>(['sg-web']);
  const [demoNumber, setDemoNumber] = useState(2048);
  const [demoStep, setDemoStep] = useState(1);
  const [demoTablePage, setDemoTablePage] = useState(1);
  const [demoTableSelected, setDemoTableSelected] = useState<(string | number)[]>(['1']);
  const [demoTreeSelected, setDemoTreeSelected] = useState<string>('node-1-1');

  const copyImportCode = (code: string, name: string) => {
    navigator.clipboard.writeText(code);
    showToast({
      title: 'Import Copied',
      description: `Copied import statement for ${name} to clipboard.`,
      variant: 'success',
    });
  };

  const scrollToComponent = (id: string) => {
    setActiveItem(id);
    const element = document.getElementById(`comp-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filtered components
  const filteredComponents = componentRegistry.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = ['Actions', 'Forms', 'Navigation', 'Layout', 'Data Display', 'Feedback', 'Typography'];

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 120px)', gap: '24px' }}>
      {/* Reusable Sidebar Navigation */}
      <div style={{ position: 'sticky', top: '80px', height: 'calc(100vh - 140px)' }}>
        <Sidebar
          width={250}
          collapsedWidth={64}
          collapsed={catalogCollapsed}
          onCollapseChange={setCatalogCollapsed}
        >
          <SidebarHeader
            icon={<Layers size={18} />}
            title="Components"
            subtitle={`${componentRegistry.length} UI building blocks`}
          />
          <SidebarContent>
            {/* Realtime Search Input (cleanly adapted for collapsed icon-rail mode) */}
            {catalogCollapsed ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '0 0 8px' }}>
                <IconButton
                  aria-label="Search components"
                  icon={<Search size={15} />}
                  variant="ghost"
                  onClick={() => setCatalogCollapsed(false)}
                />
              </div>
            ) : (
              <div style={{ padding: '0 4px 8px' }}>
                <TextInput
                  placeholder="Find component..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  leftAdornment={<Search size={14} />}
                />
              </div>
            )}

            {categories.map(cat => {
              const catItems = filteredComponents.filter(c => c.category === cat);
              if (catItems.length === 0) return null;

              const getCategoryIcon = (category: string) => {
                switch (category) {
                  case 'Actions': return <MousePointerClick size={16} />;
                  case 'Forms': return <Sliders size={16} />;
                  case 'Navigation': return <Compass size={16} />;
                  case 'Layout': return <Layout size={16} />;
                  case 'Data Display': return <Database size={16} />;
                  case 'Feedback': return <BellRing size={16} />;
                  case 'Typography': return <Type size={16} />;
                  default: return <Layers size={16} />;
                }
              };

              return (
                <SidebarGroup key={cat} label={cat}>
                  {catItems.map(item => (
                    <SidebarItem
                      key={item.id}
                      icon={getCategoryIcon(item.category)}
                      label={item.name}
                      isActive={activeItem === item.id}
                      onClick={() => scrollToComponent(item.id)}
                    />
                  ))}
                </SidebarGroup>
              );
            })}
          </SidebarContent>
          <SidebarFooter>
            <Tooltip content="Field v0.1.0 Ready" position="right">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--field-text-secondary)' }}>
                <Shield size={16} style={{ color: 'var(--field-status-success-base)', flexShrink: 0 }} />
                {!catalogCollapsed && <span style={{ whiteSpace: 'nowrap' }}>Field v0.1.0 Ready</span>}
              </div>
            </Tooltip>
          </SidebarFooter>
        </Sidebar>
      </div>

      {/* Main Catalog View */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Catalog Banner */}
        <div style={{ marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid var(--field-border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Badge variant="accent">LIBRARY REFERENCE</Badge>
            <Text size="xs" tone="secondary">Strict TypeScript • WAI-ARIA Accessible</Text>
          </div>
          <Heading level={1}>Component Catalog</Heading>
          <Text tone="secondary" style={{ marginTop: '6px', maxWidth: '720px' }}>
            Every individual component in the Field design system isolated with full state coverage,
            accessible ARIA markup, and copy-paste import snippets for your apps.
          </Text>
        </div>

        {/* Component Showcase Stack */}
        <Stack gap="32px">
          {/* 1. BUTTON */}
          <section id="comp-btn">
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Heading level={3}>Button</Heading>
                      <Badge variant="default">Actions</Badge>
                    </div>
                    <Text size="sm" tone="secondary" style={{ marginTop: '4px' }}>
                      Engineered tactile action trigger with micro-interactions, scale press, and specular highlights.
                    </Text>
                  </div>
                  <Button size="sm" variant="outline" leftIcon={<Copy size={13} />} onClick={() => copyImportCode("import { Button } from '@field/react';", 'Button')}>
                    Copy Import
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Stack gap="20px">
                  <div>
                    <Text size="xs" tone="secondary" style={{ marginBottom: '10px' }}>Variants</Text>
                    <Flex gap="12px" wrap="wrap" align="center">
                      <Button variant="primary">Primary Action</Button>
                      <Button variant="secondary">Secondary Action</Button>
                      <Button variant="outline">Outline Action</Button>
                      <Button variant="ghost">Ghost Action</Button>
                      <Button variant="danger">Destructive Action</Button>
                    </Flex>
                  </div>
                  <Divider />
                  <div>
                    <Text size="xs" tone="secondary" style={{ marginBottom: '10px' }}>Sizes</Text>
                    <Flex gap="12px" wrap="wrap" align="center">
                      <Button size="sm" variant="secondary">Small (30px)</Button>
                      <Button size="md" variant="secondary">Medium (36px)</Button>
                      <Button size="lg" variant="secondary">Large (44px)</Button>
                    </Flex>
                  </div>
                  <Divider />
                  <div>
                    <Text size="xs" tone="secondary" style={{ marginBottom: '10px' }}>States (Icons, Loading, Disabled)</Text>
                    <Flex gap="12px" wrap="wrap" align="center">
                      <Button variant="primary" leftIcon={<Play size={14} />}>With Left Icon</Button>
                      <Button variant="secondary" rightIcon={<ExternalLink size={14} />}>With Right Icon</Button>
                      <Button variant="secondary" isLoading>Loading State</Button>
                      <Button variant="secondary" disabled>Disabled State</Button>
                    </Flex>
                  </div>
                </Stack>
              </CardContent>
            </Card>
          </section>

          {/* 2. ICON BUTTON */}
          <section id="comp-icon-btn">
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Heading level={3}>IconButton</Heading>
                      <Badge variant="default">Actions</Badge>
                    </div>
                    <Text size="sm" tone="secondary" style={{ marginTop: '4px' }}>
                      Square action button maintaining precise aspect ratio for toolbars and compact actions.
                    </Text>
                  </div>
                  <Button size="sm" variant="outline" leftIcon={<Copy size={13} />} onClick={() => copyImportCode("import { IconButton } from '@field/react';", 'IconButton')}>
                    Copy Import
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Flex gap="12px" align="center" wrap="wrap">
                  <IconButton aria-label="Refresh" icon={<RefreshCw size={15} />} variant="primary" />
                  <IconButton aria-label="Add" icon={<Plus size={15} />} variant="secondary" />
                  <IconButton aria-label="Share" icon={<Share2 size={15} />} variant="outline" />
                  <IconButton aria-label="Like" icon={<Heart size={15} />} variant="ghost" />
                  <IconButton aria-label="Delete" icon={<Trash2 size={15} />} variant="danger" />
                  <IconButton aria-label="Small" icon={<Activity size={13} />} size="sm" variant="secondary" />
                  <IconButton aria-label="Large" icon={<Activity size={18} />} size="lg" variant="secondary" />
                </Flex>
              </CardContent>
            </Card>
          </section>

          {/* 3. BUTTON GROUP & SEGMENTED CONTROL */}
          <section id="comp-segmented">
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Heading level={3}>SegmentedControl & ButtonGroup</Heading>
                      <Badge variant="default">Actions</Badge>
                    </div>
                    <Text size="sm" tone="secondary" style={{ marginTop: '4px' }}>
                      Tactile multi-option switcher with smooth pill selection and grouped action buttons.
                    </Text>
                  </div>
                  <Button size="sm" variant="outline" leftIcon={<Copy size={13} />} onClick={() => copyImportCode("import { SegmentedControl, ButtonGroup } from '@field/react';", 'SegmentedControl')}>
                    Copy Import
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Stack gap="20px">
                  <div>
                    <Text size="xs" tone="secondary" style={{ marginBottom: '8px' }}>Segmented Control (Active: {demoSegmented})</Text>
                    <SegmentedControl
                      value={demoSegmented}
                      onChange={setDemoSegmented}
                      options={[
                        { value: 'grid', label: 'Grid View' },
                        { value: 'list', label: 'List View' },
                        { value: 'compact', label: 'Compact' },
                        { value: 'raw', label: 'Raw JSON' },
                      ]}
                    />
                  </div>
                  <Divider />
                  <div>
                    <Text size="xs" tone="secondary" style={{ marginBottom: '8px' }}>Button Group</Text>
                    <ButtonGroup>
                      <Button variant="secondary">Day</Button>
                      <Button variant="secondary">Week</Button>
                      <Button variant="secondary">Month</Button>
                      <Button variant="secondary">Year</Button>
                    </ButtonGroup>
                  </div>
                </Stack>
              </CardContent>
            </Card>
          </section>

          {/* 3B. DROPDOWN MENU */}
          <section id="comp-dropdown-menu">
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Heading level={3}>DropdownMenu & ActionMenu</Heading>
                      <Badge variant="default">Actions</Badge>
                    </div>
                    <Text size="sm" tone="secondary" style={{ marginTop: '4px' }}>
                      Floating context menus for table rows, overflow actions, and danger operations.
                    </Text>
                  </div>
                  <Button size="sm" variant="outline" leftIcon={<Copy size={13} />} onClick={() => copyImportCode("import { DropdownMenu, DropdownGroup, DropdownItem, DropdownDivider } from '@field/react';", 'DropdownMenu')}>
                    Copy Import
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Flex gap="16px" align="center" wrap="wrap">
                  <DropdownMenu
                    trigger={
                      <Button variant="secondary" rightIcon={<MoreVertical size={14} />}>
                        Instance Actions
                      </Button>
                    }
                  >
                    <DropdownGroup label="Lifecycle">
                      <DropdownItem icon={<Play size={14} />} onSelect={() => showToast({ title: 'Started', description: 'EC2 instance starting.', variant: 'success' })}>
                        Start Instance
                      </DropdownItem>
                      <DropdownItem icon={<RotateCcw size={14} />} onSelect={() => showToast({ title: 'Rebooting', description: 'Graceful reboot initiated.', variant: 'warning' })}>
                        Reboot Instance
                      </DropdownItem>
                      <DropdownItem icon={<Square size={14} />} onSelect={() => showToast({ title: 'Stopped', description: 'Instance stopped.', variant: 'info' })}>
                        Stop Instance
                      </DropdownItem>
                    </DropdownGroup>
                    <DropdownDivider />
                    <DropdownItem
                      variant="danger"
                      icon={<Trash2 size={14} />}
                      onSelect={() => showToast({ title: 'Terminated', description: 'Resource removed.', variant: 'danger' })}
                    >
                      Terminate Instance
                    </DropdownItem>
                  </DropdownMenu>

                  <DropdownMenu
                    align="end"
                    trigger={<IconButton icon={<MoreVertical size={16} />} aria-label="Row menu" variant="outline" />}
                  >
                    <DropdownItem onSelect={() => showToast({ title: 'Exported', description: 'JSON definition copied.', variant: 'info' })}>
                      Export JSON
                    </DropdownItem>
                    <DropdownItem onSelect={() => showToast({ title: 'Cloned', description: 'Profile cloned.', variant: 'success' })}>
                      Clone Settings
                    </DropdownItem>
                  </DropdownMenu>
                </Flex>
              </CardContent>
            </Card>
          </section>

          {/* 4. TEXT INPUT & TEXT AREA */}
          <section id="comp-text-input">
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Heading level={3}>TextInput & TextArea</Heading>
                      <Badge variant="default">Forms</Badge>
                    </div>
                    <Text size="sm" tone="secondary" style={{ marginTop: '4px' }}>
                      Inputs with left/right adornments, error states, and clean focus ring highlights.
                    </Text>
                  </div>
                  <Button size="sm" variant="outline" leftIcon={<Copy size={13} />} onClick={() => copyImportCode("import { TextInput, TextArea } from '@field/react';", 'TextInput')}>
                    Copy Import
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Grid columns="repeat(auto-fit, minmax(280px, 1fr))" gap="20px">
                  <TextInput
                    label="Endpoint Hostname"
                    placeholder="api.cluster.field.internal"
                    helperText="DNS resolving to VPC mesh"
                  />
                  <TextInput
                    label="Search Filter"
                    placeholder="Search pods or nodes..."
                    leftAdornment={<Search size={15} />}
                    rightAdornment={<Kbd>⌘K</Kbd>}
                  />
                  <TextInput
                    label="Security Token (Error State)"
                    defaultValue="invalid_bearer_tok_108"
                    error="Signature verification failed against active root CA"
                  />
                  <TextArea
                    label="Runtime Policy Specification"
                    placeholder="Enter policy yaml definition or security constraint rules..."
                    defaultValue="apiVersion: field.io/v1\nkind: SecurityPolicy\nspec:\n  enforceMutualTLS: true"
                  />
                </Grid>
              </CardContent>
            </Card>
          </section>

          {/* 5. SELECT, SWITCH, CHECKBOX, RADIO, SLIDER */}
          <section id="comp-switch">
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Heading level={3}>Select, Switch, Checkbox, Radio & Slider</Heading>
                      <Badge variant="default">Forms</Badge>
                    </div>
                    <Text size="sm" tone="secondary" style={{ marginTop: '4px' }}>
                      High-precision controls with clear active feedback and accessible keyboard interaction.
                    </Text>
                  </div>
                  <Button size="sm" variant="outline" leftIcon={<Copy size={13} />} onClick={() => copyImportCode("import { Select, Switch, Checkbox, RadioGroup, Slider } from '@field/react';", 'Controls')}>
                    Copy Import
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Grid columns="repeat(auto-fit, minmax(280px, 1fr))" gap="24px">
                  <Stack gap="16px">
                    <Select
                      label="Deployment Region"
                      value={demoSelect}
                      onChange={setDemoSelect}
                      options={[
                        { value: 'us-east', label: 'US East (N. Virginia)' },
                        { value: 'us-west', label: 'US West (Oregon)' },
                        { value: 'eu-central', label: 'EU Central (Frankfurt)' },
                        { value: 'ap-east', label: 'AP East (Tokyo)' },
                      ]}
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                      <Switch
                        checked={demoSwitch}
                        onChange={setDemoSwitch}
                        label="Automatic Failover"
                        description="Reroute traffic to healthy replicas"
                      />
                      <Checkbox
                        checked={demoCheckbox}
                        onChange={setDemoCheckbox}
                        label="Enforce mTLS on ingress connections"
                      />
                    </div>
                  </Stack>

                  <Stack gap="20px">
                    <RadioGroup
                      label="Scheduling Strategy"
                      value={demoRadio}
                      onChange={setDemoRadio}
                      options={[
                        { value: 'balanced', label: 'Balanced Binpack', description: 'Even distribution across nodes' },
                        { value: 'dense', label: 'Dense Consolidation', description: 'Minimizes running node count' },
                        { value: 'spread', label: 'Topology Spread', description: 'Guarantees multi-zone redundancy' },
                      ]}
                    />

                    <Stack gap="16px">
                      <div style={{ paddingBottom: '6px' }}>
                        <Switch
                          checked={demoSliderGlow}
                          onChange={setDemoSliderGlow}
                          label="Enable Luminous Glow Effect"
                          description="Adds an ambient luminous glow to the slider thumb and progress track."
                        />
                      </div>

                      <Slider
                        label="Cluster CPU Quota Limit (Standard)"
                        value={demoSlider}
                        onChange={setDemoSlider}
                        min={0}
                        max={100}
                        step={1}
                        valueSuffix="%"
                        glow={demoSliderGlow}
                      />

                      <Slider
                        label="Memory Saturation (Threshold Levels)"
                        value={demoLevelSlider}
                        onChange={setDemoLevelSlider}
                        min={0}
                        max={100}
                        step={1}
                        valueSuffix="%"
                        showMarks={true}
                        glow={demoSliderGlow}
                        zones={[
                          { to: 60, color: 'success', label: 'Optimal' },
                          { to: 85, color: 'warning', label: 'Elevated' },
                          { to: 100, color: 'danger', label: 'Critical' },
                        ]}
                      />
                    </Stack>
                  </Stack>
                </Grid>
              </CardContent>
            </Card>
          </section>

          {/* 6. DATE PICKER & DATE RANGE PICKER */}
          <section id="comp-datepicker">
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Heading level={3}>DatePicker & RangePicker</Heading>
                      <Badge variant="accent">Forms</Badge>
                    </div>
                    <Text size="sm" tone="secondary" style={{ marginTop: '4px' }}>
                      Portal-backed precision calendar and date range selectors with quick presets and zero container clipping.
                    </Text>
                  </div>
                  <Button size="sm" variant="outline" leftIcon={<Copy size={13} />} onClick={() => copyImportCode("import { DatePicker, DateRangePicker } from '@field/react';", 'DatePicker')}>
                    Copy Import
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div style={{ marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid var(--field-border-subtle)' }}>
                  <Switch
                    checked={demoDatePickerWithDone}
                    onChange={setDemoDatePickerWithDone}
                    label="Enable Done / Close Action Buttons"
                    description="Provides explicit Done and Close buttons in the popover footer, preventing premature auto-dismissal."
                  />
                </div>

                <Grid columns="repeat(auto-fit, minmax(280px, 1fr))" gap="24px">
                  <Stack gap="12px">
                    <Text size="xs" tone="secondary" style={{ fontWeight: 600 }}>SINGLE DATE PICKER</Text>
                    <DatePicker
                      label="Deployment Cutoff Date"
                      value={demoDate}
                      onChange={setDemoDate}
                      placeholder="Select target date..."
                      showDoneButton={demoDatePickerWithDone}
                      showCloseButton={demoDatePickerWithDone}
                      onDone={() => {
                        showToast({ title: 'Date Confirmed', description: `Saved ${demoDate ? demoDate.toLocaleDateString() : 'date'}`, variant: 'success' });
                      }}
                    />
                    <Text size="xs" tone="tertiary">
                      Selected: <code style={{ color: 'var(--field-accent-primary)' }}>{demoDate ? demoDate.toLocaleDateString() : 'None'}</code>
                    </Text>
                  </Stack>

                  <Stack gap="12px">
                    <Text size="xs" tone="secondary" style={{ fontWeight: 600 }}>DATE RANGE PICKER (PRESETS & SPAN)</Text>
                    <DateRangePicker
                      label="Telemetry Analytics Window"
                      value={demoRange}
                      onChange={setDemoRange}
                      placeholder="Select time window..."
                      showDoneButton={demoDatePickerWithDone}
                      showCloseButton={demoDatePickerWithDone}
                      onDone={() => {
                        showToast({ title: 'Range Confirmed', description: 'Telemetry window updated.', variant: 'success' });
                      }}
                    />
                    <Text size="xs" tone="tertiary">
                      Range: <code style={{ color: 'var(--field-accent-primary)' }}>
                        {demoRange.start ? demoRange.start.toLocaleDateString() : '—'} to {demoRange.end ? demoRange.end.toLocaleDateString() : '—'}
                      </code>
                    </Text>
                  </Stack>
                </Grid>
              </CardContent>
            </Card>
          </section>

          {/* 6B. COMBOBOX & NUMBER INPUT */}
          <section id="comp-combobox">
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Heading level={3}>Combobox & NumberInput</Heading>
                      <Badge variant="default">Forms</Badge>
                    </div>
                    <Text size="sm" tone="secondary" style={{ marginTop: '4px' }}>
                      Searchable multi-select tags chip selector and clamped numeric stepper controls.
                    </Text>
                  </div>
                  <Button size="sm" variant="outline" leftIcon={<Copy size={13} />} onClick={() => copyImportCode("import { Combobox, NumberInput } from '@field/react';", 'Combobox')}>
                    Copy Import
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Grid columns="repeat(auto-fit, minmax(280px, 1fr))" gap="24px">
                  <Combobox
                    label="Assigned Security Groups"
                    helperText="Multi-select tags with search filtering"
                    options={[
                      { value: 'sg-web', label: 'sg-web (HTTPS 443)' },
                      { value: 'sg-db', label: 'sg-db (PostgreSQL 5432)' },
                      { value: 'sg-bastion', label: 'sg-bastion (SSH 22)' },
                      { value: 'sg-redis', label: 'sg-redis (Cluster 6379)' },
                    ]}
                    value={demoCombobox}
                    onChange={setDemoCombobox}
                  />
                  <NumberInput
                    label="Worker Memory Allocation"
                    helperText="Clamped between 512 and 16384 MiB"
                    value={demoNumber}
                    onChange={setDemoNumber}
                    min={512}
                    max={16384}
                    step={512}
                    unit="MiB"
                  />
                </Grid>
              </CardContent>
            </Card>
          </section>

          {/* 7. SIDEBAR */}
          <section id="comp-sidebar-comp">
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Heading level={3}>Sidebar</Heading>
                      <Badge variant="default">Navigation</Badge>
                    </div>
                    <Text size="sm" tone="secondary" style={{ marginTop: '4px' }}>
                      Collapsible multi-level application navigation with header, groups, badges, and tooltips.
                    </Text>
                  </div>
                  <Button size="sm" variant="outline" leftIcon={<Copy size={13} />} onClick={() => copyImportCode("import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarItem, SidebarDropdown, SidebarSubItem, SidebarFooter } from '@field/react';", 'Sidebar')}>
                    Copy Import
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Density and Collapse Controls */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Text size="xs" tone="secondary">Density:</Text>
                    <SegmentedControl
                      value={demoSidebarDensity}
                      onChange={(val) => setDemoSidebarDensity(val as 'default' | 'compact')}
                      options={[
                        { value: 'default', label: 'Default' },
                        { value: 'compact', label: 'Compact (Dense)' },
                      ]}
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDemoSidebarCollapsed(!demoSidebarCollapsed)}
                  >
                    {demoSidebarCollapsed ? 'Expand Demo Sidebar' : 'Collapse Demo Sidebar'}
                  </Button>
                </div>

                <div style={{ height: '420px', border: '1px solid var(--field-border-default)', borderRadius: 'var(--field-radius-lg)', overflow: 'hidden', display: 'flex' }}>
                  <Sidebar
                    width={260}
                    collapsedWidth={64}
                    collapsed={demoSidebarCollapsed}
                    onCollapseChange={setDemoSidebarCollapsed}
                    density={demoSidebarDensity}
                  >
                    <SidebarHeader icon={<Zap size={18} />} title="Cloud Architecture" subtitle="sambarfield.com" />
                    <SidebarContent>
                      {/* Cloudflare-Style Hierarchy Dropdown */}
                      <SidebarDropdown icon={<Clock size={16} />} label="Recents" defaultOpen>
                        <SidebarSubItem label="Workers & Pages" description="Compute" isActive />
                        <SidebarSubItem label="R2 Object Storage" description="Storage & database..." />
                        <SidebarSubItem label="Dashboards" description="Analytics" />
                        <SidebarSubItem label="Records" description="sambarfield.com / DNS" />
                        <SidebarSubItem label="sambarfield.com" description="Domains" />
                      </SidebarDropdown>

                      <SidebarGroup label="Workspaces">
                        <SidebarItem icon={<Activity size={16} />} label="Live Telemetry" />
                        <SidebarItem icon={<Cpu size={16} />} label="Workloads" badge={<Badge variant="accent">12</Badge>} />
                        <SidebarItem icon={<Shield size={16} />} label="Security Vault" />
                      </SidebarGroup>

                      <SidebarGroup label="Preferences">
                        <SidebarItem icon={<Sliders size={16} />} label="System Config" />
                      </SidebarGroup>
                    </SidebarContent>
                    <SidebarFooter>
                      <Tooltip content="admin@field.io" position="right">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Avatar name="Admin User" size="sm" />
                          {!demoSidebarCollapsed && (
                            <div style={{ minWidth: 0, overflow: 'hidden' }}>
                              <div style={{ fontSize: '0.8125rem', fontWeight: 550, color: 'var(--field-text-primary)' }}>Admin User</div>
                              <div style={{ fontSize: '0.6875rem', color: 'var(--field-text-secondary)' }}>admin@field.io</div>
                            </div>
                          )}
                        </div>
                      </Tooltip>
                    </SidebarFooter>
                  </Sidebar>
                  <div style={{ flex: 1, padding: '24px', backgroundColor: 'var(--field-surface-base)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <Badge variant="accent" style={{ marginBottom: '10px' }}>{demoSidebarDensity.toUpperCase()} MODE</Badge>
                    <Heading level={4}>Interactive Sidebar Canvas</Heading>
                    <Text size="sm" tone="secondary" style={{ marginTop: '6px', maxWidth: '440px' }}>
                      Features Cloudflare-style nested dropdown hierarchy lines, secondary description tags, compact density spacing, and zero-overlap icon-rail collapsing.
                    </Text>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 7. TABS & BREADCRUMB */}
          <section id="comp-tabs">
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Heading level={3}>Tabs & Breadcrumb</Heading>
                      <Badge variant="default">Navigation</Badge>
                    </div>
                    <Text size="sm" tone="secondary" style={{ marginTop: '4px' }}>
                      Underline navigation tabs with zero layout shift and wrapping breadcrumb trails.
                    </Text>
                  </div>
                  <Button size="sm" variant="outline" leftIcon={<Copy size={13} />} onClick={() => copyImportCode("import { Tabs, Breadcrumb } from '@field/react';", 'Tabs')}>
                    Copy Import
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Stack gap="20px">
                  <div>
                    <Text size="xs" tone="secondary" style={{ marginBottom: '8px' }}>Breadcrumb Trail</Text>
                    <Breadcrumb
                      items={[
                        { label: 'Workspaces', href: '#' },
                        { label: 'Engineering Pods', href: '#' },
                        { label: 'us-east-alpha (Active)', isCurrent: true },
                      ]}
                    />
                  </div>
                  <Divider />
                  <div>
                    <Text size="xs" tone="secondary" style={{ marginBottom: '8px' }}>Underline Tabs</Text>
                    <Tabs
                      activeId={demoActiveTab}
                      onChange={setDemoActiveTab}
                      items={[
                        { id: 'general', label: 'General Config' },
                        { id: 'security', label: 'Security Firewall' },
                        { id: 'networking', label: 'Virtual Networks' },
                        { id: 'audit', label: 'Audit Logs' },
                      ]}
                    />
                  </div>
                </Stack>
              </CardContent>
            </Card>
          </section>

          {/* 7B. STEPPER / WIZARD */}
          <section id="comp-stepper">
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Heading level={3}>Stepper & Wizard</Heading>
                      <Badge variant="default">Navigation</Badge>
                    </div>
                    <Text size="sm" tone="secondary" style={{ marginTop: '4px' }}>
                      Multi-step workflow progression indicator for complex cloud provisioning wizards.
                    </Text>
                  </div>
                  <Button size="sm" variant="outline" leftIcon={<Copy size={13} />} onClick={() => copyImportCode("import { Stepper } from '@field/react';", 'Stepper')}>
                    Copy Import
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Stack gap="20px">
                  <Stepper
                    activeStep={demoStep}
                    onStepClick={setDemoStep}
                    steps={[
                      { id: '1', title: 'Hardware Instance', description: 'Compute & memory sizing' },
                      { id: '2', title: 'VPC Networking', description: 'Subnets & security groups' },
                      { id: '3', title: 'EBS Storage Volumes', description: 'IOPS & encryption' },
                      { id: '4', title: 'Review & Deploy', description: 'Confirm launch specification' },
                    ]}
                  />
                  <Flex justify="flex-end" gap="10px">
                    <Button size="sm" variant="ghost" disabled={demoStep <= 0} onClick={() => setDemoStep(prev => Math.max(0, prev - 1))}>
                      Previous Step
                    </Button>
                    <Button size="sm" variant="primary" disabled={demoStep >= 3} onClick={() => setDemoStep(prev => Math.min(3, prev + 1))}>
                      Next Step
                    </Button>
                  </Flex>
                </Stack>
              </CardContent>
            </Card>
          </section>

          {/* 8. CARDS & STATCARDS */}
          <section id="comp-stat-card">
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Heading level={3}>Card & StatCard</Heading>
                      <Badge variant="default">Layout</Badge>
                    </div>
                    <Text size="sm" tone="secondary" style={{ marginTop: '4px' }}>
                      Tactile dark mode surface containers with specular borders and KPI metric cards.
                    </Text>
                  </div>
                  <Button size="sm" variant="outline" leftIcon={<Copy size={13} />} onClick={() => copyImportCode("import { Card, StatCard } from '@field/react';", 'Card')}>
                    Copy Import
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Grid columns="repeat(auto-fit, minmax(220px, 1fr))" gap="16px">
                  <StatCard
                    label="NETWORK THROUGHPUT"
                    value="48.2 Gbps"
                    delta={{ value: '+14.2%', trend: 'up' }}
                    icon={<Activity size={18} />}
                    subtitle="24h peak traffic"
                    chart={<Sparkline data={[14, 19, 28, 22, 35, 48]} color="success" height={32} />}
                  />
                  <StatCard
                    label="CPU COMPUTE LOAD"
                    value="28.4%"
                    delta={{ value: '-2.1%', trend: 'up' }}
                    icon={<Cpu size={18} />}
                    subtitle="Across 32 worker nodes"
                    chart={<Sparkline data={[34, 30, 25, 29, 31, 28]} color="accent" height={32} />}
                  />
                  <StatCard
                    label="ERROR BUDGET"
                    value="0.02%"
                    delta={{ value: '+0.01%', trend: 'down' }}
                    icon={<Shield size={18} />}
                    subtitle="99.98% availability"
                  />
                </Grid>
              </CardContent>
            </Card>
          </section>

          {/* 9. BADGE, AVATAR, KBD, CODE */}
          <section id="comp-badge">
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Heading level={3}>Badge, Avatar, Kbd & Code</Heading>
                      <Badge variant="default">Data Display</Badge>
                    </div>
                    <Text size="sm" tone="secondary" style={{ marginTop: '4px' }}>
                      Status indicators, user representations, and developer code elements.
                    </Text>
                  </div>
                  <Button size="sm" variant="outline" leftIcon={<Copy size={13} />} onClick={() => copyImportCode("import { Badge, Avatar, AvatarGroup, Kbd, Code } from '@field/react';", 'Badge')}>
                    Copy Import
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Stack gap="20px">
                  <div>
                    <Text size="xs" tone="secondary" style={{ marginBottom: '8px' }}>Badges</Text>
                    <Flex gap="8px" wrap="wrap">
                      <Badge variant="default">Default</Badge>
                      <Badge variant="accent" dot>Active Accent</Badge>
                      <Badge variant="success" dot>Operational</Badge>
                      <Badge variant="warning" dot>Degraded</Badge>
                      <Badge variant="danger" dot>Critical</Badge>
                      <Badge variant="info">Telemetry</Badge>
                    </Flex>
                  </div>
                  <Divider />
                  <div>
                    <Text size="xs" tone="secondary" style={{ marginBottom: '8px' }}>Avatars & AvatarGroup</Text>
                    <Flex align="center" gap="16px">
                      <Avatar name="Sarah Connor" size="sm" />
                      <Avatar name="Alex Vance" size="md" />
                      <Avatar name="Gordon Freeman" size="lg" />
                      <AvatarGroup max={3}>
                        <Avatar name="Cluster 01" />
                        <Avatar name="Cluster 02" />
                        <Avatar name="Cluster 03" />
                        <Avatar name="Cluster 04" />
                        <Avatar name="Cluster 05" />
                      </AvatarGroup>
                    </Flex>
                  </div>
                  <Divider />
                  <div>
                    <Text size="xs" tone="secondary" style={{ marginBottom: '8px' }}>Kbd & Code Snippets</Text>
                    <Flex align="center" gap="12px" wrap="wrap">
                      <Flex align="center" gap="6px">
                        <Kbd>⌘</Kbd>
                        <Kbd>K</Kbd>
                        <Text size="xs" tone="secondary">Command Palette</Text>
                      </Flex>
                      <Flex align="center" gap="6px">
                        <Kbd>Shift</Kbd>
                        <Kbd>F12</Kbd>
                        <Text size="xs" tone="secondary">Format Document</Text>
                      </Flex>
                      <Code>kubectl get pods -n kube-system</Code>
                    </Flex>
                  </div>
                </Stack>
              </CardContent>
            </Card>
          </section>

          {/* 10. ENHANCED TABLE & PAGINATION */}
          <section id="comp-table">
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Heading level={3}>DataTable & Pagination</Heading>
                      <Badge variant="default">Data Display</Badge>
                    </div>
                    <Text size="sm" tone="secondary" style={{ marginTop: '4px' }}>
                      Advanced data grid with column sorting, row selection, bulk actions bar, expandable rows, and pagination.
                    </Text>
                  </div>
                  <Button size="sm" variant="outline" leftIcon={<Copy size={13} />} onClick={() => copyImportCode("import { Table, Pagination } from '@field/react';", 'Table')}>
                    Copy Import
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table
                  keyExtractor={(row) => row.id}
                  selectable={true}
                  selectedKeys={demoTableSelected}
                  onSelectionChange={setDemoTableSelected}
                  renderBulkActions={(keys, clear) => (
                    <Flex gap="8px">
                      <Button size="sm" variant="secondary" onClick={() => { showToast({ title: 'Rebooting Fleet', description: `Rebooting ${keys.length} instances`, variant: 'info' }); clear(); }}>
                        Reboot Selected ({keys.length})
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => { showToast({ title: 'Terminated', description: `Terminated ${keys.length} instances`, variant: 'danger' }); clear(); }}>
                        Terminate ({keys.length})
                      </Button>
                    </Flex>
                  )}
                  expandable={true}
                  renderExpandedRow={(row) => (
                    <div style={{ fontSize: '0.8125rem', color: 'var(--field-text-secondary)', display: 'flex', gap: '24px' }}>
                      <div><strong>Instance ID:</strong> i-09827a{row.id}</div>
                      <div><strong>IPv4 Private:</strong> 10.0.12.{row.id.replace('node-', '')}</div>
                      <div><strong>VPC Subnet:</strong> subnet-vpc-prod-east</div>
                    </div>
                  )}
                  data={[
                    { id: '1', name: 'edge-gateway-us-01', region: 'us-east-1a', load: '14%', status: 'Healthy' },
                    { id: '2', name: 'core-router-eu-04', region: 'eu-central-1', load: '82%', status: 'Degraded' },
                    { id: '3', name: 'db-replica-ap-02', region: 'ap-northeast-1', load: '36%', status: 'Healthy' },
                    { id: '4', name: 'ingres-proxy-us-02', region: 'us-west-2b', load: '58%', status: 'Healthy' },
                  ]}
                  columns={[
                    { key: 'name', header: 'Node Name', sortable: true },
                    { key: 'region', header: 'Region', sortable: true },
                    { key: 'load', header: 'CPU Load', sortable: true },
                    {
                      key: 'status',
                      header: 'Status',
                      render: (row) => (
                        <StatusDot
                          status={row.status === 'Healthy' ? 'success' : 'warning'}
                          pulse={row.status === 'Degraded'}
                          label={row.status}
                        />
                      ),
                    },
                    {
                      key: 'actions',
                      header: 'Actions',
                      render: (row) => (
                        <DropdownMenu
                          align="end"
                          trigger={<IconButton icon={<MoreVertical size={14} />} aria-label="Row menu" variant="ghost" size="sm" />}
                        >
                          <DropdownItem onSelect={() => showToast({ title: 'Restarted', description: `Node ${row.name} restarted`, variant: 'info' })}>
                            Restart Node
                          </DropdownItem>
                          <DropdownDivider />
                          <DropdownItem variant="danger" onSelect={() => showToast({ title: 'Drained', description: `Node ${row.name} drained`, variant: 'danger' })}>
                            Drain Node
                          </DropdownItem>
                        </DropdownMenu>
                      ),
                    },
                  ]}
                />
                <Pagination
                  currentPage={demoTablePage}
                  totalPages={8}
                  pageSize={10}
                  onPageChange={setDemoTablePage}
                  totalItems={78}
                />

                <div style={{ marginTop: '20px' }}>
                  <Text size="xs" tone="secondary" style={{ marginBottom: '8px' }}>Compound Subcomponents Composition</Text>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subsystem</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Network Interface eth0</TableCell>
                        <TableCell>ena (AWS Elastic)</TableCell>
                        <TableCell><Badge variant="success" dot>Active</Badge></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>NVMe Storage Array</TableCell>
                        <TableCell>nvme-core</TableCell>
                        <TableCell><Badge variant="info">Optimized</Badge></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 10B. EMPTY STATE */}
          <section id="comp-empty-state">
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Heading level={3}>EmptyState</Heading>
                      <Badge variant="default">Data Display</Badge>
                    </div>
                    <Text size="sm" tone="secondary" style={{ marginTop: '4px' }}>
                      Clean zero-data indicators with contextual iconography and prominent action callouts.
                    </Text>
                  </div>
                  <Button size="sm" variant="outline" leftIcon={<Copy size={13} />} onClick={() => copyImportCode("import { EmptyState } from '@field/react';", 'EmptyState')}>
                    Copy Import
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <EmptyState
                  icon={<ServerOff size={28} />}
                  title="No Compute Instances Found"
                  description="No EC2 instances match your active search filters or region selection in us-east-1."
                  action={
                    <Button variant="primary" leftIcon={<Plus size={14} />} onClick={() => showToast({ title: 'Launch', description: 'Opening instance launcher', variant: 'info' })}>
                      Launch Instance
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          </section>

          {/* 10C. TREE VIEW */}
          <section id="comp-tree-view">
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Heading level={3}>TreeView</Heading>
                      <Badge variant="default">Data Display</Badge>
                    </div>
                    <Text size="sm" tone="secondary" style={{ marginTop: '4px' }}>
                      Hierarchical resource browser for S3 folders, VPC subnet trees, and IAM organizational units.
                    </Text>
                  </div>
                  <Button size="sm" variant="outline" leftIcon={<Copy size={13} />} onClick={() => copyImportCode("import { TreeView } from '@field/react';", 'TreeView')}>
                    Copy Import
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div style={{ maxWidth: '420px', border: '1px solid var(--field-border-subtle)', borderRadius: 'var(--field-radius-md)', padding: '12px' }}>
                  <TreeView
                    selectedId={demoTreeSelected}
                    onSelect={(node) => setDemoTreeSelected(node.id)}
                    defaultExpandedIds={['s3-root', 'infra']}
                    data={[
                      {
                        id: 's3-root',
                        label: 's3://field-production-artifacts',
                        children: [
                          {
                            id: 'infra',
                            label: 'infrastructure-tf',
                            children: [
                              { id: 'node-1-1', label: 'terraform.tfstate' },
                              { id: 'node-1-2', label: 'variables.tf' },
                            ],
                          },
                          {
                            id: 'logs',
                            label: 'cloudtrail-audit-logs',
                            children: [
                              { id: 'log-1', label: 'audit-2026-09-01.json.gz' },
                              { id: 'log-2', label: 'audit-2026-09-02.json.gz' },
                            ],
                          },
                        ],
                      },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 10D. TIMELINE */}
          <section id="comp-timeline">
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Heading level={3}>Timeline & AuditFeed</Heading>
                      <Badge variant="default">Data Display</Badge>
                    </div>
                    <Text size="sm" tone="secondary" style={{ marginTop: '4px' }}>
                      Chronological event feed with status nodes for deployment pipelines and CloudTrail telemetry.
                    </Text>
                  </div>
                  <Button size="sm" variant="outline" leftIcon={<Copy size={13} />} onClick={() => copyImportCode("import { Timeline } from '@field/react';", 'Timeline')}>
                    Copy Import
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Timeline
                  items={[
                    {
                      id: 't-1',
                      title: 'Production Cluster Rolled to v2.4.1',
                      content: 'Deployment pipeline #4928 finished across all 6 Kubernetes clusters without downtime.',
                      timestamp: '12 minutes ago',
                      status: 'success',
                    },
                    {
                      id: 't-2',
                      title: 'Security Group Rule Added (Port 443)',
                      content: 'Operator Sarah Connor authorized CIDR 192.168.1.0/24 on ingress router.',
                      timestamp: '1 hour ago',
                      status: 'info',
                    },
                    {
                      id: 't-3',
                      title: 'Spike in p99 API Latency',
                      content: 'Database connection pool reached 94% capacity during telemetry sync.',
                      timestamp: '3 hours ago',
                      status: 'warning',
                    },
                  ]}
                />
              </CardContent>
            </Card>
          </section>

          {/* 10E. CODE BLOCK & DIFF VIEWER */}
          <section id="comp-code-block">
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Heading level={3}>CodeBlock, DiffViewer & CopyButton</Heading>
                      <Badge variant="default">Data Display</Badge>
                    </div>
                    <Text size="sm" tone="secondary" style={{ marginTop: '4px' }}>
                      Syntax highlighting, line numbers, line highlights, and unified git/JSON diffs.
                    </Text>
                  </div>
                  <Button size="sm" variant="outline" leftIcon={<Copy size={13} />} onClick={() => copyImportCode("import { CodeBlock, DiffViewer, CopyButton } from '@field/react';", 'CodeBlock')}>
                    Copy Import
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Stack gap="20px">
                  <CodeBlock
                    title="iam-execution-policy.json"
                    language="json"
                    highlightLines={[4, 5]}
                    code={`{\n  "Version": "2012-10-17",\n  "Statement": [\n    {\n      "Effect": "Allow",\n      "Action": "s3:GetObject",\n      "Resource": "arn:aws:s3:::field-prod/*"\n    }\n  ]\n}`}
                  />
                  <DiffViewer
                    title="Cluster Helm Values Diff (staging vs production)"
                    lines={[
                      { type: 'normal', content: 'replicaCount: 3', oldLineNumber: 1, newLineNumber: 1 },
                      { type: 'removed', content: 'logLevel: "debug"', oldLineNumber: 2 },
                      { type: 'added', content: 'logLevel: "warn"', newLineNumber: 2 },
                      { type: 'added', content: 'enableTelemetryExport: true', newLineNumber: 3 },
                    ]}
                  />
                  <div>
                    <Text size="xs" tone="secondary" style={{ marginBottom: '8px' }}>Standalone CopyButton Component</Text>
                    <Flex gap="12px" align="center">
                      <Code>npm install @sam.barfield/field-react</Code>
                      <CopyButton value="npm install @sam.barfield/field-react" label="Copy Command" />
                    </Flex>
                  </div>
                </Stack>
              </CardContent>
            </Card>
          </section>

          {/* 10F. METRICS: STATUS DOT, SPARKLINE & METER */}
          <section id="comp-metrics">
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Heading level={3}>StatusDot, Sparkline & Meter</Heading>
                      <Badge variant="default">Data Display</Badge>
                    </div>
                    <Text size="sm" tone="secondary" style={{ marginTop: '4px' }}>
                      Live telemetry status indicators with pulsing animation, mini curves, and capacity meters.
                    </Text>
                  </div>
                  <Button size="sm" variant="outline" leftIcon={<Copy size={13} />} onClick={() => copyImportCode("import { StatusDot, Sparkline, Meter } from '@field/react';", 'StatusDot')}>
                    Copy Import
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Stack gap="24px">
                  <div>
                    <Text size="xs" tone="secondary" style={{ marginBottom: '10px' }}>Status Dots with Real-Time Pulse</Text>
                    <Flex gap="20px" align="center" wrap="wrap">
                      <StatusDot status="success" pulse={true} label="Active Telemetry" />
                      <StatusDot status="warning" pulse={true} label="Auto-Healing Pod" />
                      <StatusDot status="danger" pulse={true} label="Degraded Node" />
                      <StatusDot status="info" label="Rebalancing" />
                      <StatusDot status="neutral" label="Offline" />
                    </Flex>
                  </div>
                  <Divider />
                  <div>
                    <Text size="xs" tone="secondary" style={{ marginBottom: '10px' }}>Sparkline Telemetry Trendlines</Text>
                    <Flex gap="24px" align="center" wrap="wrap">
                      <Flex align="center" gap="10px">
                        <Sparkline data={[12, 16, 24, 20, 32, 45, 42]} color="accent" width={140} height={36} />
                        <Text size="xs" tone="secondary">IOPS Activity</Text>
                      </Flex>
                      <Flex align="center" gap="10px">
                        <Sparkline data={[45, 40, 32, 28, 20, 16, 14]} color="success" width={140} height={36} />
                        <Text size="xs" tone="secondary">Error Rate Reduction</Text>
                      </Flex>
                      <Flex align="center" gap="10px">
                        <Sparkline data={[10, 14, 18, 25, 45, 68, 92]} color="danger" width={140} height={36} />
                        <Text size="xs" tone="secondary">Spike Anomaly</Text>
                      </Flex>
                    </Flex>
                  </div>
                  <Divider />
                  <div>
                    <Text size="xs" tone="secondary" style={{ marginBottom: '10px' }}>Capacity Quota Meters</Text>
                    <Grid columns="repeat(auto-fit, minmax(240px, 1fr))" gap="16px">
                      <Meter label="RAM Allocation" value={62} max={100} valueLabel="62% Used" />
                      <Meter label="Disk Volume I/O" value={82} max={100} valueLabel="82% (Warning Threshold)" />
                      <Meter label="Egress Bandwidth" value={95} max={100} valueLabel="95% (Near Quota)" />
                    </Grid>
                  </div>
                </Stack>
              </CardContent>
            </Card>
          </section>


          {/* 11. TERMINAL & TELEMETRY STREAM */}
          <section id="comp-terminal">
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Heading level={3}>Terminal</Heading>
                      <Badge variant="accent">Data Display</Badge>
                    </div>
                    <Text size="sm" tone="secondary" style={{ marginTop: '4px' }}>
                      High-precision dark carbon terminal and telemetry log stream with window controls, log levels, and interactive command prompt.
                    </Text>
                  </div>
                  <Button size="sm" variant="outline" leftIcon={<Copy size={13} />} onClick={() => copyImportCode("import { Terminal, TerminalHeader, TerminalBody, TerminalLine, TerminalPrompt } from '@field/react';", 'Terminal')}>
                    Copy Import
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Terminal height="300px">
                  <TerminalHeader
                    title="cluster-ops@edge-01: ~"
                    subtitle="zsh"
                    onCopyAll={() => {
                      showToast({ title: 'Logs Copied', description: 'Terminal output copied to clipboard.', variant: 'success' });
                    }}
                  />
                  <TerminalBody>
                    <TerminalLine timestamp="12:00:01" level="info">Initializing Kubernetes cluster runtime...</TerminalLine>
                    <TerminalLine timestamp="12:00:02" level="success">Connected to control plane via TLS 1.3 mutual handshake.</TerminalLine>
                    <TerminalLine timestamp="12:00:03" level="cmd">$ kubectl get pods -n production</TerminalLine>
                    <TerminalLine timestamp="12:00:04" level="info">api-gateway-7b8f98d4    2/2    Running    0    12d</TerminalLine>
                    <TerminalLine timestamp="12:00:05" level="warn">db-replica-ap-02        1/1    Running    2    4d (High Memory Saturation 84%)</TerminalLine>
                  </TerminalBody>
                  <TerminalPrompt
                    user="ops@field"
                    path="~/prod"
                    placeholder="Type command here (e.g. status, nodes, ping)..."
                    onSubmit={(cmd) => {
                      showToast({ title: 'Command Executed', description: `Executed: ${cmd}`, variant: 'info' });
                    }}
                  />
                </Terminal>
              </CardContent>
            </Card>
          </section>

          {/* 12. ALERTS & CALLOUTS */}
          <section id="comp-alert">
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Heading level={3}>Alert & Notifications</Heading>
                      <Badge variant="default">Feedback</Badge>
                    </div>
                    <Text size="sm" tone="secondary" style={{ marginTop: '4px' }}>
                      Tactile alerts with subtle 5% status tint surfaces, crisp titles, and readable body copy.
                    </Text>
                  </div>
                  <Button size="sm" variant="outline" leftIcon={<Copy size={13} />} onClick={() => copyImportCode("import { Alert, useToast } from '@field/react';", 'Alert')}>
                    Copy Import
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Stack gap="12px">
                  <Alert variant="info" title="Cluster Provisioning Active">
                    4 new node worker pools are currently being deployed across region us-east-1a.
                  </Alert>
                  <Alert variant="success" title="Zero-Downtime Migration Complete">
                    All persistent database volumes were synchronized with 100% integrity.
                  </Alert>
                  <Alert variant="warning" title="Elevated Memory Saturation">
                    Worker pod cache pool has exceeded 85% capacity threshold. Autoscale pending.
                  </Alert>
                  <Alert variant="danger" title="Unauthorized Ingress Spike Detected">
                    Firewall isolated 1,420 rogue requests matching DDoS signature #089.
                  </Alert>
                </Stack>
              </CardContent>
            </Card>
          </section>

          {/* 12. OVERLAYS: MODAL, DRAWER, TOOLTIP */}
          <section id="comp-modal">
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Heading level={3}>Modal, Drawer & Tooltip</Heading>
                      <Badge variant="default">Feedback</Badge>
                    </div>
                    <Text size="sm" tone="secondary" style={{ marginTop: '4px' }}>
                      Accessible focus-trapped dialogs, side configuration sheets, and non-clipped tooltips.
                    </Text>
                  </div>
                  <Button size="sm" variant="outline" leftIcon={<Copy size={13} />} onClick={() => copyImportCode("import { Modal, Drawer, Tooltip } from '@field/react';", 'Overlays')}>
                    Copy Import
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Flex gap="16px" align="center" wrap="wrap">
                  <Button variant="primary" onClick={() => setIsModalOpen(true)}>Open Modal Dialog</Button>
                  <Button variant="secondary" onClick={() => setIsDrawerOpen(true)}>Open Side Drawer</Button>
                  <Tooltip content="Tooltip explains technical nuance on hover" position="top">
                    <Button variant="outline">Hover for Tooltip</Button>
                  </Tooltip>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      showToast({
                        title: 'Telemetry Synced',
                        description: 'Updated state from edge clusters.',
                        variant: 'info',
                      });
                    }}
                  >
                    Trigger System Toast
                  </Button>
                </Flex>
              </CardContent>
            </Card>
          </section>

          {/* 12B. COMMAND PALETTE (⌘K) */}
          <section id="comp-command-palette">
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Heading level={3}>CommandPalette (⌘K Omnibar)</Heading>
                      <Badge variant="default">Feedback</Badge>
                    </div>
                    <Text size="sm" tone="secondary" style={{ marginTop: '4px' }}>
                      Fast keyboard-first search modal for invoking actions, navigating clusters, and jumping to settings.
                    </Text>
                  </div>
                  <Button size="sm" variant="outline" leftIcon={<Copy size={13} />} onClick={() => copyImportCode("import { CommandPalette } from '@field/react';", 'CommandPalette')}>
                    Copy Import
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Flex gap="12px" align="center">
                  <Button variant="primary" leftIcon={<Command size={14} />} onClick={() => setIsCommandOpen(true)}>
                    Open Command Palette (⌘K)
                  </Button>
                  <Text size="xs" tone="secondary">Or press ⌘K anywhere on the page</Text>
                </Flex>
              </CardContent>
            </Card>
          </section>

          {/* 12C. POPOVER */}
          <section id="comp-popover">
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Heading level={3}>Popover</Heading>
                      <Badge variant="default">Feedback</Badge>
                    </div>
                    <Text size="sm" tone="secondary" style={{ marginTop: '4px' }}>
                      Anchor-positioned interactive floating cards with outside-click dismissal.
                    </Text>
                  </div>
                  <Button size="sm" variant="outline" leftIcon={<Copy size={13} />} onClick={() => copyImportCode("import { Popover } from '@field/react';", 'Popover')}>
                    Copy Import
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Popover
                  trigger={<Button variant="outline">Filter Dimensions</Button>}
                  width="300px"
                  content={
                    <Stack gap="12px">
                      <Heading level={4}>Filter Cluster Telemetry</Heading>
                      <TextInput label="Cluster Tag" placeholder="e.g. env:production" />
                      <Select
                        label="Log Severity"
                        defaultValue="warn"
                        options={[
                          { value: 'all', label: 'All Logs' },
                          { value: 'warn', label: 'Warnings & Errors' },
                          { value: 'error', label: 'Errors Only' },
                        ]}
                      />
                      <Flex justify="flex-end" gap="8px">
                        <Button size="sm" variant="ghost">Reset</Button>
                        <Button size="sm" variant="primary" onClick={() => showToast({ title: 'Filters Applied', description: 'Query updated.', variant: 'success' })}>Apply</Button>
                      </Flex>
                    </Stack>
                  }
                />
              </CardContent>
            </Card>
          </section>

          {/* 12D. CONTEXT MENU */}
          <section id="comp-context-menu">
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Heading level={3}>ContextMenu</Heading>
                      <Badge variant="default">Feedback</Badge>
                    </div>
                    <Text size="sm" tone="secondary" style={{ marginTop: '4px' }}>
                      Native right-click trigger area rendering cursor-positioned tactile context menus.
                    </Text>
                  </div>
                  <Button size="sm" variant="outline" leftIcon={<Copy size={13} />} onClick={() => copyImportCode("import { ContextMenu } from '@field/react';", 'ContextMenu')}>
                    Copy Import
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ContextMenu
                  items={[
                    { id: 'inspect', label: 'Inspect Pod Metrics', onSelect: () => showToast({ title: 'Inspect', description: 'Opening inspector.', variant: 'info' }) },
                    { id: 'copy', label: 'Copy Pod DNS', onSelect: () => showToast({ title: 'Copied', description: 'DNS address copied.', variant: 'success' }) },
                    { id: 'div1', label: '', divider: true },
                    { id: 'restart', label: 'Rolling Restart', onSelect: () => showToast({ title: 'Restarting', description: 'Rolling restart dispatched.', variant: 'warning' }) },
                    { id: 'terminate', label: 'Terminate Pod', variant: 'danger', onSelect: () => showToast({ title: 'Terminated', description: 'Pod stopped.', variant: 'danger' }) },
                  ]}
                >
                  <div
                    style={{
                      padding: '36px 24px',
                      border: '1px dashed var(--field-border-strong)',
                      borderRadius: 'var(--field-radius-md)',
                      backgroundColor: 'var(--field-surface-sunken)',
                      textAlign: 'center',
                      cursor: 'context-menu',
                      userSelect: 'none',
                    }}
                  >
                    <Text tone="secondary">
                      Right-click anywhere inside this target box to trigger the Field ContextMenu
                    </Text>
                  </div>
                </ContextMenu>
              </CardContent>
            </Card>
          </section>

          {/* 13. PROGRESS, SPINNER, SKELETON, ACCORDION */}
          <section id="comp-progress">
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Heading level={3}>Progress, Spinner, Skeleton & Accordion</Heading>
                      <Badge variant="default">Feedback</Badge>
                    </div>
                    <Text size="sm" tone="secondary" style={{ marginTop: '4px' }}>
                      Async loading indicators, skeleton placeholders, and expandable disclosure panels.
                    </Text>
                  </div>
                  <Button size="sm" variant="outline" leftIcon={<Copy size={13} />} onClick={() => copyImportCode("import { Progress, Spinner, Skeleton, Accordion } from '@field/react';", 'Progress')}>
                    Copy Import
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Stack gap="20px">
                  <Progress value={68} label="Data Ingestion Pipeline" showValue />

                  <div>
                    <Text size="xs" tone="secondary" style={{ marginBottom: '8px' }}>Loading Spinners & Skeletons</Text>
                    <Flex gap="16px" align="center">
                      <Spinner size={22} />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <Skeleton height="14px" width="70%" />
                        <Skeleton height="10px" width="45%" />
                      </div>
                    </Flex>
                  </div>

                  <Divider />

                  <div>
                    <Text size="xs" tone="secondary" style={{ marginBottom: '8px' }}>Accordion</Text>
                    <Accordion
                      items={[
                        {
                          id: 'acc-1',
                          title: 'How does token inheritance work in Field?',
                          content: 'Field uses a 3-tier token structure: Primitives (raw colors/scales) feed into Semantics (theme-reactive roles), which components consume via CSS variables. Zero hardcoded styles.',
                        },
                        {
                          id: 'acc-2',
                          title: 'Is keyboard navigation fully supported?',
                          content: 'Yes. Modals and drawers feature focus traps and Escape dismissal. Dropdowns and tabs support Arrow key roving focus.',
                        },
                      ]}
                    />
                  </div>
                </Stack>
              </CardContent>
            </Card>
          </section>

          {/* 14. TYPOGRAPHY */}
          <section id="comp-typography">
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Heading level={3}>Heading & Text</Heading>
                      <Badge variant="default">Typography</Badge>
                    </div>
                    <Text size="sm" tone="secondary" style={{ marginTop: '4px' }}>
                      Standardized hierarchy with tight letter tracking and optical calibration.
                    </Text>
                  </div>
                  <Button size="sm" variant="outline" leftIcon={<Copy size={13} />} onClick={() => copyImportCode("import { Heading, Text } from '@field/react';", 'Typography')}>
                    Copy Import
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Stack gap="12px">
                  <Heading level={1}>Heading 1: Instrument Control System</Heading>
                  <Heading level={2}>Heading 2: High-Performance Architecture</Heading>
                  <Heading level={3}>Heading 3: Telemetry Stream Pipeline</Heading>
                  <Heading level={4}>Heading 4: Node Cluster Status</Heading>
                  <Text tone="primary">Primary body text: Field delivers high-precision dark mode styling for mission-critical software.</Text>
                  <Text tone="secondary">Secondary muted text: Designed for telemetry descriptions, metadata, and supporting documentation.</Text>
                  <Text tone="tertiary" size="xs">Tertiary caption text: Timestamp and low-emphasis audit details.</Text>
                </Stack>
              </CardContent>
            </Card>
          </section>
        </Stack>
      </div>

      {/* Interactive Overlays */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cluster Configuration Deployment"
      >
        <Stack gap="16px">
          <Text tone="secondary" size="sm">
            Deploying revision #891 will apply updated mutual TLS certificate policies across all 128 active nodes.
          </Text>
          <Alert variant="warning" title="Brief Ingress Pause">
            Ingress connections may experience ~2ms handshake renegotiation latency during certificate swap.
          </Alert>
          <Flex justify="flex-end" gap="10px">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => {
              setIsModalOpen(false);
              showToast({ title: 'Deployment Queued', description: 'Applying policies to 128 nodes.', variant: 'success' });
            }}>
              Deploy Revision
            </Button>
          </Flex>
        </Stack>
      </Modal>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Node Runtime Inspector"
      >
        <Stack gap="20px">
          <div>
            <Text size="xs" tone="secondary">NODE IDENTIFIER</Text>
            <Heading level={4}>edge-gateway-us-01</Heading>
          </div>
          <Divider />
          <StatCard label="MEMORY SATURATION" value="64.2%" delta={{ value: '+4.1%', trend: 'up' }} />
          <TextInput label="Assigned DNS" defaultValue="edge-01.vpc.internal" />
          <Switch
            checked={demoSwitch}
            onChange={setDemoSwitch}
            label="Maintenance Mode"
            description="Drain active connections before inspection"
          />
          <Button variant="danger" leftIcon={<Trash2 size={15} />}>Terminate Node Instance</Button>
        </Stack>
      </Drawer>

      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        items={[
          {
            id: 'cmd-launch',
            title: 'Launch EC2 Compute Instance',
            category: 'Compute',
            icon: <Server size={16} />,
            shortcut: '⌘L',
            onSelect: () => showToast({ title: 'Launch', description: 'Opening instance launcher', variant: 'info' }),
          },
          {
            id: 'cmd-reboot',
            title: 'Reboot Core Router Fleet',
            category: 'Operations',
            icon: <RotateCcw size={16} />,
            onSelect: () => showToast({ title: 'Rebooting', description: 'Fleet reboot initiated', variant: 'warning' }),
          },
          {
            id: 'cmd-s3',
            title: 'Explore S3 Storage Buckets',
            category: 'Storage',
            icon: <Database size={16} />,
            onSelect: () => scrollToComponent('tree-view'),
          },
          {
            id: 'cmd-policy',
            title: 'View IAM Security Policy',
            category: 'Security',
            icon: <Shield size={16} />,
            onSelect: () => scrollToComponent('code-block'),
          },
        ]}
      />
    </div>
  );
};
