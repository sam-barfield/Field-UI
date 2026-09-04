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
  Modal,
  Drawer,
  Tabs,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Pagination,
  Accordion,
  Tooltip,
  Alert,
  useToast,
  Progress,
  Spinner,
  Skeleton,
  Divider,
  Breadcrumb,
  Heading,
  Text,
  Kbd,
  Code,
  Flex,
  Stack,
  Grid,
  DatePicker,
  DateRangePicker,
  DateRange,
  DropdownMenu,
  DropdownGroup,
  DropdownItem,
  DropdownDivider,
  CommandPalette,
  Popover,
  ContextMenu,
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
  Combobox,
  NumberInput,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarItem,
  SidebarDropdown,
  SidebarSubItem,
  SidebarFooter,
  SidebarTrigger,
  Terminal,
  TerminalHeader,
  TerminalBody,
  TerminalLine,
  TerminalPrompt,
} from '@field/react';
import {
  Search,
  Shield,
  Send,
  Trash2,
  Settings,
  Terminal as TerminalIcon,
  Activity,
  Cpu,
  Database,
  Layers,
  MoreVertical,
  Zap,
  HardDrive,
  MousePointerClick,
  FileSearch,
} from 'lucide-react';

export const StickerSheet: React.FC = () => {
  const { showToast } = useToast();

  // Component demo states
  const [segmentedVal, setSegmentedVal] = useState('metrics');
  const [textInputVal, setTextInputVal] = useState('field_alpha_node_01');
  const [selectVal, setSelectVal] = useState('prod');
  const [comboboxVal, setComboboxVal] = useState<string[]>(['node-eu-1']);
  const [numberVal, setNumberVal] = useState(42);
  const [switchVal, setSwitchVal] = useState(true);
  const [checkboxVal, setCheckboxVal] = useState(true);
  const [radioVal, setRadioVal] = useState('dedicated');
  const [sliderVal, setSliderVal] = useState(65);
  const [dateVal, setDateVal] = useState<Date | null>(new Date());
  const [dateRangeVal, setDateRangeVal] = useState<DateRange>({
    start: new Date(Date.now() - 7 * 86400000),
    end: new Date(),
  });
  const [activeTab, setActiveTab] = useState('tab1');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [stepperStep, setStepperStep] = useState(1);
  const [page, setPage] = useState(1);
  const [sidebarDemoCollapsed, setSidebarDemoCollapsed] = useState(false);

  // Sample table data
  const sampleTableData = [
    { id: 'node-101', name: 'us-east-core', status: 'Optimal', latency: '14ms', cpu: '34%' },
    { id: 'node-102', name: 'eu-central-alpha', status: 'Optimal', latency: '28ms', cpu: '48%' },
    { id: 'node-103', name: 'ap-northeast-edge', status: 'Warning', latency: '142ms', cpu: '89%' },
    { id: 'node-104', name: 'sa-east-backup', status: 'Optimal', latency: '62ms', cpu: '18%' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', paddingBottom: '80px' }}>
      {/* 1. BUTTONS & ACTIONS */}
      <section>
        <div style={{ marginBottom: '16px' }}>
          <Badge variant="accent">01 // ACTIONS & TRIGGERS</Badge>
          <Heading level={2} style={{ marginTop: '8px' }}>Buttons, Menus & Overlays</Heading>
          <Text tone="secondary" size="sm">Tactile micro-highlights, crisp hover responses, contextual dropdowns and commands.</Text>
        </div>

        <Grid columns="repeat(auto-fit, minmax(320px, 1fr))" gap="20px">
          {/* Variants */}
          <Card>
            <CardHeader>
              <Heading level={4}>Button Variants</Heading>
              <Text tone="secondary" size="xs">Visual hierarchy mapping</Text>
            </CardHeader>
            <CardContent>
              <Flex gap="10px" wrap="wrap">
                <Button variant="primary" leftIcon={<Send size={14} />}>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger" leftIcon={<Trash2 size={14} />}>Danger</Button>
              </Flex>
            </CardContent>
          </Card>

          {/* Sizes & States */}
          <Card>
            <CardHeader>
              <Heading level={4}>Sizes & Interactive States</Heading>
              <Text tone="secondary" size="xs">Proportional scales & feedback</Text>
            </CardHeader>
            <CardContent>
              <Stack gap="14px">
                <Flex gap="10px" align="center" wrap="wrap">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </Flex>
                <Flex gap="10px" align="center" wrap="wrap">
                  <Button isLoading>Deploying</Button>
                  <Button disabled>Disabled</Button>
                  <Tooltip content="Quick system settings">
                    <IconButton icon={<Settings size={15} />} aria-label="Settings" />
                  </Tooltip>
                  <ButtonGroup>
                    <Button size="sm">Day</Button>
                    <Button size="sm" variant="secondary">Week</Button>
                    <Button size="sm" variant="secondary">Month</Button>
                  </ButtonGroup>
                </Flex>
              </Stack>
            </CardContent>
          </Card>

          {/* Menus & Popovers */}
          <Card>
            <CardHeader>
              <Heading level={4}>Dropdown, Popover & Command</Heading>
              <Text tone="secondary" size="xs">Floating contextual surfaces</Text>
            </CardHeader>
            <CardContent>
              <Flex gap="12px" align="center" wrap="wrap">
                <DropdownMenu
                  trigger={<Button variant="outline" rightIcon={<MoreVertical size={14} />}>Actions Menu</Button>}
                >
                  <DropdownGroup label="Cluster Operations">
                    <DropdownItem icon={<Zap size={14} />} onSelect={() => showToast({ title: 'Sync Triggered' })}>
                      Sync Topology
                    </DropdownItem>
                    <DropdownItem icon={<Activity size={14} />}>View Latency Stream</DropdownItem>
                  </DropdownGroup>
                  <DropdownDivider />
                  <DropdownGroup label="Configuration">
                    <DropdownItem icon={<Settings size={14} />}>Cluster Settings</DropdownItem>
                    <DropdownItem icon={<Trash2 size={14} />} variant="danger">Purge Telemetry</DropdownItem>
                  </DropdownGroup>
                </DropdownMenu>

                <Popover
                  trigger={<Button variant="secondary">Popover Details</Button>}
                  content={
                    <div style={{ padding: '4px' }}>
                      <Heading level={4}>Pod Status</Heading>
                      <Text size="xs" tone="secondary" style={{ marginTop: '4px' }}>
                        Node pod <code>us-east-1a-09</code> is running at 99.8% capacity with zero packet loss.
                      </Text>
                    </div>
                  }
                />

                <Button
                  variant="secondary"
                  leftIcon={<Search size={14} />}
                  onClick={() => setIsCommandOpen(true)}
                >
                  Search Commands <Kbd style={{ marginLeft: '6px' }}>⌘K</Kbd>
                </Button>
              </Flex>
            </CardContent>
          </Card>

          {/* Context Menu & Segmented */}
          <Card>
            <CardHeader>
              <Heading level={4}>Context Menu & Segmented Control</Heading>
              <Text tone="secondary" size="xs">Right-click canvas & multi-segmented switches</Text>
            </CardHeader>
            <CardContent>
              <Stack gap="14px">
                <SegmentedControl
                  value={segmentedVal}
                  onChange={setSegmentedVal}
                  options={[
                    { value: 'metrics', label: 'Metrics' },
                    { value: 'logs', label: 'Logs' },
                    { value: 'traces', label: 'Traces' },
                    { value: 'alerts', label: 'Alerts' },
                  ]}
                />
                <ContextMenu
                  items={[
                    { id: '1', label: 'Run Health Check', icon: <Zap size={14} />, onSelect: () => showToast({ title: 'Health Check Triggered' }) },
                    { id: '2', label: 'Inspect Manifest', icon: <FileSearch size={14} /> },
                    { id: '3', label: 'Isolate Node', icon: <Trash2 size={14} />, variant: 'danger' },
                  ]}
                >
                  <div
                    style={{
                      border: '1px dashed var(--field-border-strong)',
                      borderRadius: 'var(--field-radius-md)',
                      padding: '16px',
                      textAlign: 'center',
                      backgroundColor: 'var(--field-surface-subtle)',
                      cursor: 'context-menu',
                    }}
                  >
                    <Text size="xs" tone="secondary">
                      <MousePointerClick size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                      Right-click anywhere inside this box to open the <strong>ContextMenu</strong>
                    </Text>
                  </div>
                </ContextMenu>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </section>

      {/* 2. FORM INPUTS & DATA ENTRY */}
      <section>
        <div style={{ marginBottom: '16px' }}>
          <Badge variant="accent">02 // DATA ENTRY & CONTROLS</Badge>
          <Heading level={2} style={{ marginTop: '8px' }}>Form Inputs & Pickers</Heading>
          <Text tone="secondary" size="sm">Searchable comboboxes, numeric steppers, date pickers, and toggle switches.</Text>
        </div>

        <Grid columns="repeat(auto-fit, minmax(320px, 1fr))" gap="20px">
          {/* Text Fields */}
          <Card>
            <CardHeader>
              <Heading level={4}>Text Inputs & Combobox</Heading>
              <Text tone="secondary" size="xs">Input fields with icons and filtering</Text>
            </CardHeader>
            <CardContent>
              <Stack gap="14px">
                <TextInput
                  label="Host Identifier"
                  leftAdornment={<Database size={15} />}
                  value={textInputVal}
                  onChange={e => setTextInputVal(e.target.value)}
                />
                <Combobox
                  label="Target Node (Searchable)"
                  value={comboboxVal}
                  onChange={setComboboxVal}
                  placeholder="Select or search node..."
                  options={[
                    { value: 'node-us-1', label: 'us-east-cluster-01 (Primary)' },
                    { value: 'node-eu-1', label: 'eu-central-cluster-02' },
                    { value: 'node-ap-1', label: 'ap-southeast-cluster-03' },
                    { value: 'node-sa-1', label: 'sa-east-backup-04' },
                  ]}
                />
                <NumberInput
                  label="Replication Factor"
                  value={numberVal}
                  onChange={setNumberVal}
                  min={1}
                  max={128}
                  step={1}
                />
              </Stack>
            </CardContent>
          </Card>

          {/* Select & Textarea */}
          <Card>
            <CardHeader>
              <Heading level={4}>Select & Text Area</Heading>
              <Text tone="secondary" size="xs">Multi-line inputs and dropdowns</Text>
            </CardHeader>
            <CardContent>
              <Stack gap="14px">
                <Select
                  label="Environment Target"
                  value={selectVal}
                  onChange={setSelectVal}
                  options={[
                    { value: 'prod', label: 'Production (Tier 1)' },
                    { value: 'staging', label: 'Staging Integration' },
                    { value: 'dev', label: 'Local Development' },
                  ]}
                />
                <TextArea
                  label="Cluster Policy (YAML)"
                  defaultValue="apiVersion: field.telemetry/v1&#10;kind: ClusterNode&#10;metadata:&#10;  name: core-prod-01"
                  rows={3}
                />
              </Stack>
            </CardContent>
          </Card>

          {/* Dates & Pickers */}
          <Card>
            <CardHeader>
              <Heading level={4}>Date & DateRange Pickers</Heading>
              <Text tone="secondary" size="xs">Bidirectional hover selection</Text>
            </CardHeader>
            <CardContent>
              <Stack gap="14px">
                <DatePicker
                  label="Snapshot Timestamp"
                  value={dateVal}
                  onChange={setDateVal}
                />
                <DateRangePicker
                  label="Audit Log Window"
                  value={dateRangeVal}
                  onChange={setDateRangeVal}
                />
              </Stack>
            </CardContent>
          </Card>

          {/* Switches, Checkboxes, Radios */}
          <Card>
            <CardHeader>
              <Heading level={4}>Toggles & Sliders</Heading>
              <Text tone="secondary" size="xs">Discrete and continuous controls</Text>
            </CardHeader>
            <CardContent>
              <Stack gap="16px">
                <Flex justify="space-between" align="center">
                  <Switch
                    label="Automated Failover"
                    checked={switchVal}
                    onChange={setSwitchVal}
                  />
                  <Checkbox
                    label="Strict SSL Pinning"
                    checked={checkboxVal}
                    onChange={setCheckboxVal}
                  />
                </Flex>
                <RadioGroup
                  label="Resource Allocation"
                  value={radioVal}
                  onChange={setRadioVal}
                  options={[
                    { value: 'dedicated', label: 'Dedicated Hardware' },
                    { value: 'shared', label: 'Shared Pool' },
                  ]}
                />
                <Slider
                  label="CPU Throttle Limit"
                  value={sliderVal}
                  onChange={setSliderVal}
                  min={0}
                  max={100}
                  step={5}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </section>

      {/* 3. DATA DISPLAY, TABLES & TELEMETRY */}
      <section>
        <div style={{ marginBottom: '16px' }}>
          <Badge variant="accent">03 // VISUALIZATION & TELEMETRY</Badge>
          <Heading level={2} style={{ marginTop: '8px' }}>Data Display, Tables & Gauges</Heading>
          <Text tone="secondary" size="sm">Compound tables, responsive sparklines, meters, and status indicators.</Text>
        </div>

        <Stack gap="20px">
          {/* Navigation Tabs Bar */}
          <Tabs
            activeId={activeTab}
            onChange={setActiveTab}
            items={[
              { id: 'tab1', label: 'Cluster Summary' },
              { id: 'tab2', label: 'Telemetry Channels' },
              { id: 'tab3', label: 'Historical Audits' },
            ]}
          />

          {/* Stat Cards, Meters, Sparklines */}
          <Grid columns="repeat(auto-fit, minmax(260px, 1fr))" gap="16px">
            <StatCard
              label="TOTAL THROUGHPUT"
              value="4.82 GB/s"
              delta={{ value: '+12.4%', trend: 'up' }}
              icon={<Zap size={18} />}
            />
            <Card>
              <CardContent style={{ padding: '16px' }}>
                <Flex justify="space-between" align="center">
                  <Text size="xs" tone="secondary">BUFFER HEALTH</Text>
                  <StatusDot status="success" pulse label="Normal" />
                </Flex>
                <Heading level={3} style={{ margin: '8px 0' }}>88.4%</Heading>
                <Meter value={88.4} max={100} warningThreshold={75} dangerThreshold={90} />
              </CardContent>
            </Card>
            <Card>
              <CardContent style={{ padding: '16px' }}>
                <Flex justify="space-between" align="center">
                  <Text size="xs" tone="secondary">P99 LATENCY TREND</Text>
                  <StatusDot status="warning" label="Slight Elevation" />
                </Flex>
                <Heading level={3} style={{ margin: '8px 0' }}>18.2 ms</Heading>
                <Sparkline data={[12, 14, 15, 13, 16, 21, 18, 19, 17, 18]} height={28} />
              </CardContent>
            </Card>
            <Card>
              <CardContent style={{ padding: '16px' }}>
                <Text size="xs" tone="secondary">BADGE SIZES & VERTICAL CENTERING</Text>
                <Flex gap="8px" align="center" wrap="wrap" style={{ marginTop: '12px' }}>
                  <Badge variant="accent" size="sm" dot>Small</Badge>
                  <Badge variant="accent" size="md" dot>Medium (Default)</Badge>
                  <Badge variant="accent" size="lg" dot>Large</Badge>
                </Flex>
              </CardContent>
            </Card>
          </Grid>

          {/* Badges & Avatars Row */}
          <Grid columns="repeat(auto-fit, minmax(320px, 1fr))" gap="20px">
            <Card>
              <CardHeader>
                <Heading level={4}>Status Badges & Indicators</Heading>
                <Text tone="secondary" size="xs">Optical baseline alignment across all variants</Text>
              </CardHeader>
              <CardContent>
                <Flex gap="8px" wrap="wrap" align="center">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="accent" dot>Active Accent</Badge>
                  <Badge variant="success" dot>Operational</Badge>
                  <Badge variant="warning" dot>Degraded</Badge>
                  <Badge variant="danger" dot>Critical</Badge>
                  <Badge variant="info">Telemetry</Badge>
                </Flex>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Heading level={4}>Avatars & Avatar Groups</Heading>
                <Text tone="secondary" size="xs">User representations and fallbacks</Text>
              </CardHeader>
              <CardContent>
                <Flex gap="16px" align="center">
                  <Avatar name="Sam Barfield" size="sm" />
                  <Avatar name="Alex Vance" size="md" />
                  <Avatar name="Gordon Freeman" size="lg" />
                  <AvatarGroup max={3}>
                    <Avatar name="Dev One" />
                    <Avatar name="Dev Two" />
                    <Avatar name="Dev Three" />
                    <Avatar name="Dev Four" />
                  </AvatarGroup>
                </Flex>
              </CardContent>
            </Card>
          </Grid>

          {/* Data-Driven Table & Pagination */}
          <Card>
            <CardHeader>
              <Flex justify="space-between" align="center" style={{ width: '100%' }}>
                <div>
                  <Heading level={4}>Data-Driven Table & Pagination</Heading>
                  <Text tone="secondary" size="xs">Sortable headers, status mapping, and bottom pagination controls</Text>
                </div>
                <Badge variant="success" size="sm">4 Online</Badge>
              </Flex>
            </CardHeader>
            <CardContent style={{ padding: 0 }}>
              <Table
                columns={[
                  { key: 'name', header: 'Node Identifier', sortable: true },
                  {
                    key: 'status',
                    header: 'Health',
                    render: row => (
                      <Badge variant={row.status === 'Optimal' ? 'success' : 'warning'} dot size="sm">
                        {row.status}
                      </Badge>
                    ),
                  },
                  { key: 'latency', header: 'Roundtrip Latency', sortable: true },
                  { key: 'cpu', header: 'CPU Usage' },
                ]}
                data={sampleTableData}
              />
              <Pagination
                currentPage={page}
                totalPages={12}
                onPageChange={setPage}
                pageSize={4}
                totalItems={48}
              />
            </CardContent>
          </Card>

          {/* Compound Table Primitives */}
          <Card>
            <CardHeader>
              <Heading level={4}>Compound Table Primitives</Heading>
              <Text tone="secondary" size="xs">Composable subcomponents: TableHeader, TableBody, TableRow, TableCell, TableHead</Text>
            </CardHeader>
            <CardContent style={{ padding: 0 }}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Channel</TableHead>
                    <TableHead>Protocols</TableHead>
                    <TableHead>Ingress Rate</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell><span style={{ fontWeight: 600 }}>gRPC-Primary</span></TableCell>
                    <TableCell><Code>HTTP/2 + TLS 1.3</Code></TableCell>
                    <TableCell>1.42 GB/s</TableCell>
                    <TableCell><Badge variant="success" size="sm" dot>Active</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><span style={{ fontWeight: 600 }}>REST-Gateway</span></TableCell>
                    <TableCell><Code>HTTP/1.1 + JSON</Code></TableCell>
                    <TableCell>240 MB/s</TableCell>
                    <TableCell><Badge variant="info" size="sm">Telemetry</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Stack>
      </section>

      {/* 4. NAVIGATION, STRUCTURE & CODE */}
      <section>
        <div style={{ marginBottom: '16px' }}>
          <Badge variant="accent">04 // STRUCTURE & CODE</Badge>
          <Heading level={2} style={{ marginTop: '8px' }}>Navigation, Trees & Code Display</Heading>
          <Text tone="secondary" size="sm">Steppers, timeline events, directory trees, empty states, and syntax-highlighted diffs.</Text>
        </div>

        <Grid columns="repeat(auto-fit, minmax(320px, 1fr))" gap="20px">
          {/* Stepper & Breadcrumb */}
          <Card>
            <CardHeader>
              <Heading level={4}>Stepper Wizard & Breadcrumb</Heading>
              <Text tone="secondary" size="xs">Multi-step progressions and location paths</Text>
            </CardHeader>
            <CardContent>
              <Stack gap="18px">
                <Stepper
                  activeStep={stepperStep}
                  steps={[
                    { id: '1', title: 'Define', description: 'Specs' },
                    { id: '2', title: 'Provision', description: 'Volume' },
                    { id: '3', title: 'Verify', description: 'Tests' },
                  ]}
                />
                <Flex gap="8px" wrap="wrap">
                  <Button size="sm" variant="secondary" onClick={() => setStepperStep(s => Math.max(0, s - 1))}>
                    Previous
                  </Button>
                  <Button size="sm" variant="primary" onClick={() => setStepperStep(s => Math.min(2, s + 1))}>
                    Next Step
                  </Button>
                </Flex>
                <Divider />
                <Breadcrumb
                  items={[
                    { label: 'Workspaces', onClick: () => showToast({ title: 'Navigated to Workspaces' }) },
                    { label: 'Cluster Alpha', onClick: () => showToast({ title: 'Navigated to Cluster' }) },
                    { label: 'Node Settings' },
                  ]}
                />
              </Stack>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <Heading level={4}>Activity Timeline</Heading>
              <Text tone="secondary" size="xs">Chronological event stream with status badges</Text>
            </CardHeader>
            <CardContent>
              <Timeline
                items={[
                  { id: '1', title: 'Cluster Deploy', timestamp: '12m ago', status: 'success', content: 'Image v0.2.1 pushed' },
                  { id: '2', title: 'Health Check', timestamp: '34m ago', status: 'info', content: 'All nodes reporting green' },
                  { id: '3', title: 'Buffer Warning', timestamp: '1h ago', status: 'warning', content: 'Memory reached 85%' },
                ]}
              />
            </CardContent>
          </Card>

          {/* TreeView */}
          <Card>
            <CardHeader>
              <Heading level={4}>Directory Tree View</Heading>
              <Text tone="secondary" size="xs">Hierarchical directory navigation</Text>
            </CardHeader>
            <CardContent>
              <TreeView
                data={[
                  {
                    id: 'packages',
                    label: 'packages',
                    children: [
                      { id: 'tokens', label: 'tokens' },
                      { id: 'react', label: 'react' },
                    ],
                  },
                  {
                    id: 'apps',
                    label: 'apps',
                    children: [
                      { id: 'showcase', label: 'showcase' },
                    ],
                  },
                ]}
              />
            </CardContent>
          </Card>

          {/* EmptyState Component */}
          <Card>
            <CardHeader>
              <Heading level={4}>Empty State</Heading>
              <Text tone="secondary" size="xs">Zero-data placeholder indicators</Text>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={<FileSearch size={28} />}
                title="No Disconnected Nodes"
                description="All 24 cluster pods are currently connected and reporting healthy telemetry."
                action={
                  <Button size="sm" variant="outline" onClick={() => showToast({ title: 'Cluster Polled' })}>
                    Refresh Health
                  </Button>
                }
              />
            </CardContent>
          </Card>

          {/* CodeBlock & DiffViewer */}
          <Card style={{ gridColumn: '1 / -1' }}>
            <CardHeader>
              <Flex justify="space-between" align="center" style={{ width: '100%' }}>
                <div>
                  <Heading level={4}>Code Block & Diff Viewer</Heading>
                  <Text tone="secondary" size="xs">Syntax display, copy actions, and side-by-side git diffs</Text>
                </div>
                <CopyButton value="npm install @sam.barfield/field-react" />
              </Flex>
            </CardHeader>
            <CardContent>
              <Grid columns="repeat(auto-fit, minmax(280px, 1fr))" gap="16px">
                <CodeBlock
                  language="tsx"
                  code={`import { Button, Badge } from '@sam.barfield/field-react';\n\nexport const DeployWidget = () => (\n  <Button variant="primary" size="md">\n    Deploy <Badge variant="accent">v0.2.1</Badge>\n  </Button>\n);`}
                />
                <DiffViewer
                  title="Topology Config Diff"
                  lines={[
                    { type: 'normal', content: '  timeout: 5000,' },
                    { type: 'removed', content: '- retries: 3,' },
                    { type: 'added', content: '+ retries: 5,' },
                    { type: 'added', content: '+ circuitBreaker: true,' },
                  ]}
                />
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </section>

      {/* 5. WORKSTATION SHELL & FEEDBACK SYSTEMS */}
      <section>
        <div style={{ marginBottom: '16px' }}>
          <Badge variant="accent">05 // WORKSTATION SHELL & FEEDBACK</Badge>
          <Heading level={2} style={{ marginTop: '8px' }}>Workstation Systems & Feedback</Heading>
          <Text tone="secondary" size="sm">Docked sidebars, terminal consoles, alerts, dialogs, and sliding drawers.</Text>
        </div>

        <Grid columns="repeat(auto-fit, minmax(320px, 1fr))" gap="20px">
          {/* Feedback & Overlays */}
          <Card>
            <CardHeader>
              <Heading level={4}>Alerts & Progress</Heading>
              <Text tone="secondary" size="xs">Inline warnings, async progress bars, and skeletons</Text>
            </CardHeader>
            <CardContent>
              <Stack gap="14px">
                <Alert variant="warning" title="Elevated Memory Usage">
                  Node <code>us-east-core</code> is operating at 82% RAM threshold. Automatic compaction scheduled.
                </Alert>
                <Progress value={78} showValue label="Disk Compaction Sync" />
                <Stack gap="6px">
                  <Text size="xs" tone="secondary">Loading Skeleton States</Text>
                  <Skeleton width="100%" height="20px" />
                  <Skeleton width="60%" height="16px" />
                </Stack>
                <Flex gap="16px" align="center">
                  <Spinner size={20} />
                  <Text size="sm" tone="secondary">Orchestrator polling live clusters...</Text>
                </Flex>
                <Flex gap="10px" wrap="wrap">
                  <Button variant="secondary" onClick={() => setIsModalOpen(true)}>Open Modal</Button>
                  <Button variant="secondary" onClick={() => setIsDrawerOpen(true)}>Open Drawer</Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      showToast({
                        title: 'Telemetry Synced',
                        description: '14 nodes reported healthy metrics.',
                        variant: 'success',
                      })
                    }
                  >
                    Trigger Toast
                  </Button>
                </Flex>
              </Stack>
            </CardContent>
          </Card>

          {/* Accordion with custom flex layout */}
          <Card>
            <CardHeader>
              <Heading level={4}>Collapsible Accordion</Heading>
              <Text tone="secondary" size="xs">Full flex expansion with left/right title metadata</Text>
            </CardHeader>
            <CardContent>
              <Accordion
                defaultOpenIds={['acc1']}
                items={[
                  {
                    id: 'acc1',
                    title: (
                      <Flex justify="space-between" align="center" style={{ width: '100%' }}>
                        <span>prod-api-high-p99-latency</span>
                        <Badge variant="danger" size="sm">12m ago</Badge>
                      </Flex>
                    ),
                    content: 'Incident triggered by network spike on secondary uplink gateway. Mitigated automatically.',
                  },
                  {
                    id: 'acc2',
                    title: (
                      <Flex justify="space-between" align="center" style={{ width: '100%' }}>
                        <span>automated-db-snapshot</span>
                        <Badge variant="success" size="sm">1h ago</Badge>
                      </Flex>
                    ),
                    content: 'Daily compressed archive uploaded to secure multi-region cold vault.',
                  },
                ]}
              />
            </CardContent>
          </Card>

          {/* Terminal Console System */}
          <Card style={{ gridColumn: '1 / -1' }}>
            <CardHeader>
              <Flex justify="space-between" align="center" style={{ width: '100%' }}>
                <div>
                  <Heading level={4}>Interactive Terminal System</Heading>
                  <Text tone="secondary" size="xs">Monospace console logs, level badges, and interactive command execution</Text>
                </div>
                <Badge variant="info" size="sm">CLI Ready</Badge>
              </Flex>
            </CardHeader>
            <CardContent>
              <Terminal height="240px">
                <TerminalHeader title="cluster-telemetry-monitor" />
                <TerminalBody>
                  <TerminalLine level="cmd">field-cli cluster inspect --node us-east-core</TerminalLine>
                  <TerminalLine level="info" timestamp="12:04:18">Connecting to secure gRPC ingress port 8443...</TerminalLine>
                  <TerminalLine level="success" timestamp="12:04:19">Handshake established. TLS 1.3 session valid.</TerminalLine>
                  <TerminalLine level="warn" timestamp="12:04:22">Secondary egress buffer capacity at 78%.</TerminalLine>
                  <TerminalPrompt
                    onSubmit={cmd => {
                      showToast({
                        title: 'Command Executed',
                        description: `Sent: ${cmd}`,
                      });
                    }}
                  />
                </TerminalBody>
              </Terminal>
            </CardContent>
          </Card>

          {/* Docked Sidebar Workstation Shell Demo */}
          <Card style={{ gridColumn: '1 / -1' }}>
            <CardHeader>
              <Flex justify="space-between" align="center" style={{ width: '100%' }}>
                <div>
                  <Heading level={4}>Workstation Sidebar Shell</Heading>
                  <Text tone="secondary" size="xs">Dockable collapsible navigation tree with grouped items and footer</Text>
                </div>
                <Button size="sm" variant="secondary" onClick={() => setSidebarDemoCollapsed(c => !c)}>
                  Toggle Collapse
                </Button>
              </Flex>
            </CardHeader>
            <CardContent style={{ padding: 0 }}>
              <div style={{ height: '320px', display: 'flex', overflow: 'hidden' }}>
                <Sidebar
                  collapsed={sidebarDemoCollapsed}
                  onCollapseChange={setSidebarDemoCollapsed}
                >
                  <SidebarHeader
                    title="Field Control"
                    subtitle="Cluster v0.2.1"
                    icon={<Shield size={16} />}
                    showToggle
                  />
                  <SidebarContent>
                    <SidebarGroup label="Platform">
                      <SidebarItem icon={<Layers size={16} />} label="Overview" isActive />
                      <SidebarDropdown icon={<Cpu size={16} />} label="Compute Nodes">
                        <SidebarSubItem label="us-east-core" isActive />
                        <SidebarSubItem label="eu-central-alpha" />
                      </SidebarDropdown>
                      <SidebarItem icon={<HardDrive size={16} />} label="Storage Volumes" />
                    </SidebarGroup>
                  </SidebarContent>
                  <SidebarFooter
                    collapsedChildren={<Avatar name="Sam Barfield" size="sm" />}
                  >
                    <Flex justify="space-between" align="center" style={{ width: '100%' }}>
                      <Avatar name="Sam Barfield" size="sm" />
                      <Text size="xs" tone="secondary">Cluster Admin</Text>
                    </Flex>
                  </SidebarFooter>
                </Sidebar>
                <div style={{ flex: 1, padding: '24px', backgroundColor: 'var(--field-surface-base)' }}>
                  <Heading level={3}>Live Canvas Area</Heading>
                  <Text tone="secondary" size="sm" style={{ marginTop: '8px' }}>
                    Connected to workspace mesh. Demonstrates <code>Sidebar</code>, <code>SidebarHeader</code>, <code>SidebarGroup</code>, <code>SidebarItem</code>, <code>SidebarDropdown</code>, <code>SidebarSubItem</code>, and <code>SidebarFooter</code>.
                  </Text>
                  <div style={{ marginTop: '16px' }}>
                    <SidebarTrigger
                      isCollapsed={sidebarDemoCollapsed}
                      onToggle={() => setSidebarDemoCollapsed(c => !c)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </section>

      {/* Interactive Modal Component */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Deploy Pipeline Configuration"
        description="Verify cluster endpoint parameters before initiating continuous delivery sync."
        footer={
          <Flex justify="flex-end" gap="10px">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => {
                setIsModalOpen(false);
                showToast({
                  title: 'Deployment Initiated',
                  description: 'Pipeline task dispatched to orchestrator node.',
                  variant: 'success',
                });
              }}
            >
              Confirm & Run
            </Button>
          </Flex>
        }
      >
        <Stack gap="14px">
          <Alert variant="info">
            Targeting production cluster with <strong>Zero-Downtime Rolling Update</strong> strategy.
          </Alert>
          <TextInput label="Deployment Tag" defaultValue="v0.2.1" />
          <Switch
            label="Bypass smoke tests (Not recommended)"
            checked={false}
            onChange={() => {}}
          />
        </Stack>
      </Modal>

      {/* Interactive Drawer Component */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Node Diagnostics & Metrics"
        footer={
          <Flex justify="flex-end" gap="10px">
            <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>Close</Button>
          </Flex>
        }
      >
        <Stack gap="16px">
          <StatCard label="UPTIME" value="99.98%" subtitle="Continuous since last patch" />
          <StatCard label="THREAD POOL LOAD" value="14 / 32" subtitle="Healthy queue depth" />
          <Divider />
          <Heading level={4}>Recent Node Events</Heading>
          <Text size="sm" tone="secondary">
            [21:30:14] Heartbeat acknowledged from region us-east-1a.<br />
            [21:31:02] Garbage collection sweep executed in 4.2ms.<br />
            [21:32:45] TLS handshake cache purged successfully.
          </Text>
        </Stack>
      </Drawer>

      {/* Command Palette Component */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        items={[
          {
            id: 'deploy',
            title: 'Deploy to Production',
            description: 'Trigger continuous delivery rollout',
            icon: <Send size={15} />,
            onSelect: () => showToast({ title: 'Deploying', variant: 'info' }),
          },
          {
            id: 'purge',
            title: 'Purge Telemetry Cache',
            description: 'Flush memory cache across all edge pods',
            icon: <Trash2 size={15} />,
            onSelect: () => showToast({ title: 'Cache Purged', variant: 'warning' }),
          },
          {
            id: 'terminal',
            title: 'Open Debug CLI Terminal',
            description: 'Connect direct interactive terminal session',
            icon: <TerminalIcon size={15} />,
            onSelect: () => showToast({ title: 'Connecting CLI', variant: 'success' }),
          },
        ]}
      />
    </div>
  );
};
