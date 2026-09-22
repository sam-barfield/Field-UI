import { useState } from 'react';
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
  CardFooter,
  StatCard,
  Badge,
  Avatar,
  AvatarGroup,
  Table,
  Modal,
  Drawer,
  Tabs,
  Accordion,
  Stepper,
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
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarItem,
  SidebarDropdown,
  SidebarSubItem,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarActions,
  NavbarToggle,
  NavbarMenu,
  NavbarFlyout,
  NavbarFlyoutGrid,
  NavbarFlyoutItem,
  Terminal,
  TerminalHeader,
  TerminalBody,
  TerminalLine,
  TerminalPrompt,
  DatePicker,
  DateRangePicker,
  DateRange,
  DropdownMenu,
  DropdownGroup,
  DropdownItem,
  DropdownDivider,
  Popover,
  Pagination,
  CodeBlock,
  StatusDot,
  Sparkline,
  Meter,
  NumberInput,
  Combobox,
  UnfoldingHeading,
  UnfoldingSize,
  UnfoldingSpeed,
  UnfoldingIntensity,
} from '@sam.barfield/field-react';
import {
  Play,
  Plus,
  Trash2,
  RefreshCw,
  Share2,
  Heart,
  ExternalLink,
  Activity,
  RotateCcw,
  Square,
  Search,
  Zap,
  Clock,
  Cpu,
  Shield,
  MoreVertical,
} from 'lucide-react';
import { ComponentDoc } from './types';

// Interactive wrappers for components that require React state
const AlertInteractiveDemo = () => {
  return (
    <Stack gap="16px" style={{ width: '100%', maxWidth: '560px' }}>
      <Alert variant="success" title="Payment successful">
        Your payment of $29.99 has been processed. A receipt has been sent to your email address.
      </Alert>
      <Alert variant="info" title="New feature available">
        We've added dark mode support. You can enable it in your account settings.
      </Alert>
    </Stack>
  );
};

const ButtonInteractiveDemo = () => {
  return (
    <Flex gap="12px" wrap="wrap" align="center" justify="center">
      <Button variant="primary">Primary Action</Button>
      <Button variant="secondary">Secondary Action</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Destructive</Button>
    </Flex>
  );
};

const DatePickerInteractiveDemo = () => {
  const [date, setDate] = useState<Date | null>(new Date());
  return (
    <div style={{ width: '100%', maxWidth: '320px' }}>
      <DatePicker
        label="Deployment Cutoff Date"
        value={date}
        onChange={setDate}
        placeholder="Select deployment date..."
        showDoneButton={true}
        showCloseButton={true}
      />
    </div>
  );
};

const DateRangePickerDemo = () => {
  const [range, setRange] = useState<DateRange>({
    start: new Date(Date.now() - 7 * 86400000),
    end: new Date(),
  });
  return (
    <div style={{ width: '100%', maxWidth: '360px' }}>
      <DateRangePicker
        label="Telemetry Analytics Window"
        value={range}
        onChange={setRange}
        showDoneButton={true}
      />
    </div>
  );
};

const SliderInteractiveDemo = () => {
  const [val, setVal] = useState(65);
  return (
    <div style={{ width: '100%', maxWidth: '420px' }}>
      <Slider
        label="Cluster Compute Allocation"
        value={val}
        onChange={setVal}
        min={0}
        max={100}
        valueSuffix="%"
        glow={true}
      />
    </div>
  );
};

const SliderZonesDemo = () => {
  const [val, setVal] = useState(72);
  return (
    <div style={{ width: '100%', maxWidth: '420px' }}>
      <Slider
        label="Memory Saturation (Thresholds)"
        value={val}
        onChange={setVal}
        min={0}
        max={100}
        valueSuffix="%"
        showMarks={true}
        glow={true}
        zones={[
          { to: 60, color: 'success', label: 'Optimal' },
          { to: 85, color: 'warning', label: 'Elevated' },
          { to: 100, color: 'danger', label: 'Critical' },
        ]}
      />
    </div>
  );
};

const ModalInteractiveDemo = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open Modal Dialog
      </Button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Deploy Cluster Configuration"
        description="Verify container cluster settings before updating production edge gateways."
        footer={
          <Flex justify="flex-end" gap="10px">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Confirm Deployment
            </Button>
          </Flex>
        }
      >
        <Stack gap="14px">
          <Text size="sm">
            You are about to roll out revision <code>v2.4.12-edge</code> across 12 distributed nodes.
          </Text>
          <Alert variant="warning" title="Gradual Canary Migration">
            10% of ingress connections will route to the new revision for the first 15 minutes.
          </Alert>
        </Stack>
      </Modal>
    </div>
  );
};

const DrawerInteractiveDemo = () => {
  const [open, setOpen] = useState(false);
  const [shield, setShield] = useState(true);
  return (
    <div>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open Right Drawer Sheet
      </Button>
      <Drawer
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Edge Gateway Settings"
        footer={
          <Flex justify="flex-end" gap="10px">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Save Settings
            </Button>
          </Flex>
        }
      >
        <Stack gap="16px">
          <TextInput label="Gateway Identifier" defaultValue="gw-edge-us-east-1" />
          <Select
            label="Failover Protocol"
            options={[
              { value: 'active-standby', label: 'Active-Standby (High Availability)' },
              { value: 'round-robin', label: 'Round-Robin Ingress' },
            ]}
          />
          <Switch label="Enable DDoS Shield" checked={shield} onChange={setShield} />
        </Stack>
      </Drawer>
    </div>
  );
};

const TableInteractiveDemo = () => {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<(string | number)[]>(['1']);

  const clusterNodes = [
    { id: '1', node: 'us-east-worker-01', region: 'us-east-1a', status: 'Healthy', cpu: '48%', memory: '14.2 GB' },
    { id: '2', node: 'us-east-worker-02', region: 'us-east-1b', status: 'Healthy', cpu: '62%', memory: '18.1 GB' },
    { id: '3', node: 'eu-west-worker-01', region: 'eu-west-1a', status: 'Elevated', cpu: '86%', memory: '28.4 GB' },
  ];

  return (
    <div style={{ width: '100%', maxWidth: '640px' }}>
      <Table
        data={clusterNodes}
        keyExtractor={(item) => item.id}
        selectable={true}
        selectedKeys={selected}
        onSelectionChange={setSelected}
        columns={[
          { key: 'node', header: 'Node Name', render: (r) => <span style={{ fontWeight: 600 }}>{r.node}</span> },
          { key: 'region', header: 'Region' },
          {
            key: 'status',
            header: 'Status',
            render: (r) => (
              <Badge variant={r.status === 'Healthy' ? 'success' : 'warning'} dot>
                {r.status}
              </Badge>
            ),
          },
          { key: 'cpu', header: 'CPU' },
        ]}
      />
      <div style={{ marginTop: '12px' }}>
        <Pagination currentPage={page} totalPages={4} onPageChange={setPage} totalItems={24} />
      </div>
    </div>
  );
};

const ControlsInteractiveDemo = () => {
  const [sw, setSw] = useState(true);
  const [cb, setCb] = useState(true);
  const [radio, setRadio] = useState('balanced');

  return (
    <Stack gap="18px" style={{ width: '100%', maxWidth: '400px' }}>
      <Switch checked={sw} onChange={setSw} label="Automatic Failover" description="Reroute traffic to healthy replicas" />
      <Checkbox checked={cb} onChange={setCb} label="Enforce mTLS on ingress connections" />
      <RadioGroup
        label="Scheduling Strategy"
        value={radio}
        onChange={setRadio}
        options={[
          { value: 'balanced', label: 'Balanced Binpack', description: 'Even distribution across nodes' },
          { value: 'dense', label: 'Dense Consolidation', description: 'Minimizes running node count' },
        ]}
      />
    </Stack>
  );
};

const NavbarInteractiveDemo = () => {
  const [activeTab, setActiveTab] = useState('capabilities');
  const [shellMode, setShellMode] = useState<'standard' | 'floating'>('standard');
  const [variant, setVariant] = useState<'underline' | 'elastic' | 'pill' | 'rail'>('underline');
  const [shadow, setShadow] = useState<'none' | 'sm' | 'md' | 'lg'>('md');
  const [glow, setGlow] = useState(true);
  const [hoverGlider, setHoverGlider] = useState(true);
  const [density, setDensity] = useState<'default' | 'compact'>('default');
  const [indicatorWidth, setIndicatorWidth] = useState<'full' | 'content' | '70%' | '36px'>('full');
  const [indicatorThickness, setIndicatorThickness] = useState<2 | 3 | 4>(2);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [simulatedWidth, setSimulatedWidth] = useState<'full' | 'tablet' | 'mobile'>('full');

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '880px',
        border: '1px solid var(--field-border-default)',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: 'var(--field-surface-base)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Live Preview Area */}
      <div
        style={{
          minHeight: '260px',
          padding: shellMode === 'floating' ? '24px 16px' : simulatedWidth !== 'full' ? '24px 16px' : '0',
          backgroundColor: 'var(--field-surface-sunken)',
          backgroundImage:
            'radial-gradient(var(--field-border-subtle) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          transition: 'padding 0.2s ease',
        }}
      >
        <div
          style={{
            width: simulatedWidth === 'mobile' ? '390px' : simulatedWidth === 'tablet' ? '768px' : '100%',
            maxWidth: '100%',
            transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            border: simulatedWidth !== 'full' ? '1px solid var(--field-border-strong)' : 'none',
            borderRadius: simulatedWidth !== 'full' ? '14px' : '0',
            boxShadow: simulatedWidth !== 'full' ? '0 10px 30px rgba(0,0,0,0.5)' : 'none',
            position: 'relative',
            backgroundColor: 'var(--field-surface-base)',
          }}
        >
          <Navbar
            floating={shellMode === 'floating'}
            density={density}
            shadow={shadow}
            bordered
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}
          >
            <NavbarContent align="start">
              <NavbarBrand>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: 'var(--field-radius-sm)',
                    backgroundColor: 'var(--field-accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                  }}
                >
                  <Zap size={16} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 700, letterSpacing: '0.02em' }}>
                    APEX
                  </span>
                  <StatusDot status="success" pulse label="Available for Q4" />
                </div>
              </NavbarBrand>
            </NavbarContent>

            <NavbarContent
              align="center"
              variant={variant}
              indicatorWidth={indicatorWidth}
              indicatorThickness={indicatorThickness}
              animated
              glow={glow}
              hoverGlider={hoverGlider}
              hideOnMobile={simulatedWidth === 'mobile'}
            >
              {/* Architectural Services Megamenu */}
              <NavbarFlyout
                width={580}
                trigger={
                  <NavbarItem as="span" isActive={activeTab === 'capabilities'}>
                    Capabilities
                  </NavbarItem>
                }
              >
                <Stack gap="16px">
                  <Flex justify="space-between" align="center">
                    <div>
                      <Heading level={4} style={{ fontSize: '0.95rem' }}>
                        Engineering & Consulting Services
                      </Heading>
                      <Text size="xs" tone="secondary">
                        Bespoke enterprise digital architecture & full-stack development
                      </Text>
                    </div>
                    <Badge variant="accent">High Reliability</Badge>
                  </Flex>

                  <NavbarFlyoutGrid columns={2} gap={12}>
                    <NavbarFlyoutItem
                      icon={<Cpu size={16} />}
                      title="Distributed Cloud Infra"
                      description="Multi-region Kubernetes, AWS/GCP terraform, and zero-downtime failover."
                      onClick={() => setActiveTab('capabilities')}
                    />
                    <NavbarFlyoutItem
                      icon={<Shield size={16} />}
                      title="Product Architecture"
                      description="Mission-critical React 19, TypeScript, and high-performance APIs."
                      onClick={() => setActiveTab('capabilities')}
                    />
                    <NavbarFlyoutItem
                      icon={<Zap size={16} />}
                      title="AI & Agentic Systems"
                      description="Enterprise RAG pipelines, vector memory, and autonomous workflows."
                      onClick={() => setActiveTab('capabilities')}
                    />
                    <NavbarFlyoutItem
                      icon={<Activity size={16} />}
                      title="Performance & Audits"
                      description="Sub-50ms p99 tuning, SOC2 security audits, and scale stress tests."
                      onClick={() => setActiveTab('capabilities')}
                    />
                  </NavbarFlyoutGrid>
                </Stack>
              </NavbarFlyout>

              <NavbarItem
                isActive={activeTab === 'work'}
                onClick={() => setActiveTab('work')}
              >
                Case Studies
              </NavbarItem>
              <NavbarItem
                isActive={activeTab === 'methodology'}
                onClick={() => setActiveTab('methodology')}
              >
                Methodology
              </NavbarItem>
              <NavbarItem
                isActive={activeTab === 'insights'}
                onClick={() => setActiveTab('insights')}
              >
                Insights
              </NavbarItem>
            </NavbarContent>

            <NavbarContent align="end">
              <NavbarActions gap="8px">
                {simulatedWidth !== 'mobile' && (
                  <IconButton
                    icon={<Search size={14} />}
                    aria-label="Search capabilities"
                    size="sm"
                    variant="ghost"
                  />
                )}
                <Button size="sm" variant="primary">
                  Inquire
                </Button>
              </NavbarActions>
              <NavbarToggle display={simulatedWidth === 'mobile' ? 'always' : 'auto'} />
            </NavbarContent>

            <NavbarMenu>
              <NavbarFlyout
                trigger={
                  <NavbarItem as="span" isActive={activeTab === 'capabilities'}>
                    Capabilities
                  </NavbarItem>
                }
              >
                <NavbarFlyoutGrid columns={1} gap={8}>
                  <NavbarFlyoutItem
                    icon={<Cpu size={16} />}
                    title="Distributed Cloud Infra"
                    description="Multi-region Kubernetes & zero-downtime failover."
                    onClick={() => {
                      setActiveTab('capabilities');
                      setIsMenuOpen(false);
                    }}
                  />
                  <NavbarFlyoutItem
                    icon={<Shield size={16} />}
                    title="Product Architecture"
                    description="React 19, TypeScript, and high-performance APIs."
                    onClick={() => {
                      setActiveTab('capabilities');
                      setIsMenuOpen(false);
                    }}
                  />
                  <NavbarFlyoutItem
                    icon={<Zap size={16} />}
                    title="AI & Agentic Systems"
                    description="Enterprise RAG pipelines & autonomous agents."
                    onClick={() => {
                      setActiveTab('capabilities');
                      setIsMenuOpen(false);
                    }}
                  />
                  <NavbarFlyoutItem
                    icon={<Activity size={16} />}
                    title="Performance & Audits"
                    description="Sub-50ms p99 latency & security audits."
                    onClick={() => {
                      setActiveTab('capabilities');
                      setIsMenuOpen(false);
                    }}
                  />
                </NavbarFlyoutGrid>
              </NavbarFlyout>

              <NavbarItem
                isActive={activeTab === 'work'}
                onClick={() => {
                  setActiveTab('work');
                  setIsMenuOpen(false);
                }}
              >
                Case Studies
              </NavbarItem>
              <NavbarItem
                isActive={activeTab === 'methodology'}
                onClick={() => {
                  setActiveTab('methodology');
                  setIsMenuOpen(false);
                }}
              >
                Methodology
              </NavbarItem>
              <NavbarItem
                isActive={activeTab === 'insights'}
                onClick={() => {
                  setActiveTab('insights');
                  setIsMenuOpen(false);
                }}
              >
                Insights
              </NavbarItem>
            </NavbarMenu>
          </Navbar>
        </div>
      </div>

      {/* Interactive Controls Panel */}
      <div
        style={{
          padding: '20px 24px',
          backgroundColor: 'var(--field-surface-raised)',
          borderTop: '1px solid var(--field-border-default)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <Flex justify="space-between" align="center" wrap="wrap" gap="16px">
          {/* Simulated Screen Width */}
          <Flex align="center" gap="10px">
            <Text size="xs" tone="secondary" weight="medium">
              Device Viewport:
            </Text>
            <SegmentedControl
              size="sm"
              value={simulatedWidth}
              onChange={val => setSimulatedWidth(val as 'full' | 'tablet' | 'mobile')}
              options={[
                { value: 'full', label: 'Desktop' },
                { value: 'tablet', label: 'Tablet (768px)' },
                { value: 'mobile', label: 'Mobile (390px)' },
              ]}
            />
          </Flex>

          {/* Shell Mode */}
          <Flex align="center" gap="10px">
            <Text size="xs" tone="secondary" weight="medium">
              Layout Shell:
            </Text>
            <SegmentedControl
              size="sm"
              value={shellMode}
              onChange={val => setShellMode(val as 'standard' | 'floating')}
              options={[
                { value: 'standard', label: 'Full-Width' },
                { value: 'floating', label: 'Floating Island' },
              ]}
            />
          </Flex>

          {/* Glider Style */}
          <Flex align="center" gap="10px">
            <Text size="xs" tone="secondary" weight="medium">
              Indicator Glider:
            </Text>
            <SegmentedControl
              size="sm"
              value={variant}
              onChange={val => setVariant(val as 'underline' | 'elastic' | 'pill' | 'rail')}
              options={[
                { value: 'underline', label: 'Underline' },
                { value: 'elastic', label: 'Elastic' },
                { value: 'pill', label: 'Pill' },
                { value: 'rail', label: 'Rail' },
              ]}
            />
          </Flex>
        </Flex>

        <Flex justify="space-between" align="center" wrap="wrap" gap="16px" style={{ borderTop: '1px solid var(--field-border-subtle)', paddingTop: '14px' }}>
          {/* Shadow Elevation */}
          <Flex align="center" gap="10px">
            <Text size="xs" tone="secondary" weight="medium">
              Shadow:
            </Text>
            <SegmentedControl
              size="sm"
              value={shadow}
              onChange={val => setShadow(val as 'none' | 'sm' | 'md' | 'lg')}
              options={[
                { value: 'none', label: 'None' },
                { value: 'sm', label: 'SM' },
                { value: 'md', label: 'MD' },
                { value: 'lg', label: 'LG' },
              ]}
            />
          </Flex>

          {/* Toggles: Glow & Hover Follower */}
          <Flex align="center" gap="20px">
            <Switch
              size="sm"
              label="Indicator Glow"
              checked={glow}
              onChange={setGlow}
            />
            <Switch
              size="sm"
              label="Hover Glider"
              checked={hoverGlider}
              onChange={setHoverGlider}
            />
          </Flex>

          {/* Density */}
          <Flex align="center" gap="10px">
            <Text size="xs" tone="secondary" weight="medium">
              Height Density:
            </Text>
            <SegmentedControl
              size="sm"
              value={density}
              onChange={val => setDensity(val as 'default' | 'compact')}
              options={[
                { value: 'default', label: 'Default (56px)' },
                { value: 'compact', label: 'Compact (48px)' },
              ]}
            />
          </Flex>
        </Flex>

        {(variant === 'underline' || variant === 'elastic') && (
          <Flex justify="flex-start" align="center" wrap="wrap" gap="24px" style={{ borderTop: '1px solid var(--field-border-subtle)', paddingTop: '14px' }}>
            {/* Underline Width */}
            <Flex align="center" gap="10px">
              <Text size="xs" tone="secondary" weight="medium">
                Underline Width:
              </Text>
              <SegmentedControl
                size="sm"
                value={indicatorWidth}
                onChange={val => setIndicatorWidth(val as any)}
                options={[
                  { value: 'full', label: 'Full Tab' },
                  { value: 'content', label: 'Snug Text' },
                  { value: '70%', label: '70% Inset' },
                  { value: '36px', label: '36px Fixed' },
                ]}
              />
            </Flex>

            {/* Line Thickness */}
            <Flex align="center" gap="10px">
              <Text size="xs" tone="secondary" weight="medium">
                Thickness:
              </Text>
              <SegmentedControl
                size="sm"
                value={String(indicatorThickness)}
                onChange={val => setIndicatorThickness(Number(val) as 2 | 3 | 4)}
                options={[
                  { value: '2', label: '2px' },
                  { value: '3', label: '3px' },
                  { value: '4', label: '4px' },
                ]}
              />
            </Flex>
          </Flex>
        )}
      </div>
    </div>
  );
};

const SidebarInteractiveDemo = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div style={{ height: '360px', width: '100%', maxWidth: '600px', border: '1px solid var(--field-border-default)', borderRadius: '10px', overflow: 'hidden', display: 'flex' }}>
      <Sidebar width={230} collapsedWidth={60} collapsed={collapsed} onCollapseChange={setCollapsed}>
        <SidebarHeader icon={<Zap size={18} />} title="Field Cloud" subtitle="us-east-1" />
        <SidebarContent>
          <SidebarDropdown icon={<Clock size={16} />} label="Recents" defaultOpen>
            <SidebarSubItem label="Edge Workers" isActive />
            <SidebarSubItem label="Object Storage" />
          </SidebarDropdown>
          <SidebarGroup label="Workspaces">
            <SidebarItem icon={<Activity size={16} />} label="Telemetry" />
            <SidebarItem icon={<Cpu size={16} />} label="Workloads" badge={<Badge variant="accent">3</Badge>} />
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--field-surface-sunken)', textAlign: 'center' }}>
        <Button size="sm" variant="outline" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? 'Expand Sidebar' : 'Collapse to Rail'}
        </Button>
      </div>
    </div>
  );
};

const TerminalInteractiveDemo = () => {
  const [lines, setLines] = useState<Array<{ level: 'info' | 'warn' | 'error' | 'success' | 'cmd'; message: string; timestamp?: string }>>([
    { level: 'info', message: 'Initialized secure enclave tunnel to us-east-mesh', timestamp: '01:14:02' },
    { level: 'success', message: 'Certificates validated. mTLS handshakes 0ms latency', timestamp: '01:14:03' },
    { level: 'warn', message: 'Telemetry sampling rate reduced to 85% on node-04', timestamp: '01:14:05' },
  ]);

  return (
    <div style={{ width: '100%', maxWidth: '640px' }}>
      <Terminal height={300}>
        <TerminalHeader title="cluster-telemetry.sh" onClear={() => setLines([])} />
        <TerminalBody>
          {lines.map((l, i) => (
            <TerminalLine key={i} level={l.level} timestamp={l.timestamp}>
              {l.message}
            </TerminalLine>
          ))}
          <TerminalPrompt
            onSubmit={(cmd) => {
              setLines((prev) => [
                ...prev,
                { level: 'cmd', message: cmd, timestamp: new Date().toLocaleTimeString() },
                { level: 'success', message: `Command executed: ${cmd}`, timestamp: new Date().toLocaleTimeString() },
              ]);
            }}
          />
        </TerminalBody>
      </Terminal>
    </div>
  );
};

const WIREFRAME_PRESET_COLORS = [
  { label: 'Cyan', value: '#00d2ff', bg: '#00d2ff' },
  { label: 'Emerald', value: '#10b981', bg: '#10b981' },
  { label: 'Violet', value: '#a855f7', bg: '#a855f7' },
  { label: 'Amber', value: '#f59e0b', bg: '#f59e0b' },
  { label: 'White', value: '#f8fafc', bg: '#f8fafc' },
];

const UnfoldingHeadingInteractiveDemo = () => {
  const [text, setText] = useState('WE CRAFT DIGITAL EXPERIENCES');
  const [size, setSize] = useState<UnfoldingSize>('xl');
  const [wireframeColor, setWireframeColor] = useState<string>('#00d2ff');
  const [speed, setSpeed] = useState<UnfoldingSpeed>('normal');
  const [intensity, setIntensity] = useState<UnfoldingIntensity>('subtle');
  const [replayKey, setReplayKey] = useState(0);

  return (
    <Stack gap="20px" align="center" style={{ width: '100%', maxWidth: '880px' }}>
      <Card style={{ width: '100%', padding: '16px' }}>
        <Stack gap="16px">
          <Flex gap="16px" wrap="wrap" align="center" justify="space-between">
            <div style={{ flex: '1 1 240px' }}>
              <TextInput
                label="Heading Text"
                value={text}
                onChange={(e) => setText(e.target.value.toUpperCase())}
                placeholder="ENTER TEXT"
              />
            </div>
            <div>
              <Text size="xs" tone="secondary" style={{ marginBottom: '6px' }}>
                Size
              </Text>
              <SegmentedControl
                size="sm"
                value={size}
                onChange={(val) => setSize(val as UnfoldingSize)}
                options={[
                  { value: 'md', label: 'MD' },
                  { value: 'lg', label: 'LG' },
                  { value: 'xl', label: 'XL' },
                  { value: 'hero', label: 'HERO' },
                ]}
              />
            </div>
          </Flex>

          <Flex gap="16px" wrap="wrap" align="center" justify="space-between" style={{ borderTop: '1px solid var(--field-border-subtle)', paddingTop: '12px' }}>
            <Flex align="center" gap="10px">
              <Text size="xs" tone="secondary" weight="medium">
                Wireframe Color:
              </Text>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {WIREFRAME_PRESET_COLORS.map((c) => {
                  const isSelected = wireframeColor === c.value;
                  return (
                    <button
                      key={c.value}
                      type="button"
                      title={c.label}
                      onClick={() => setWireframeColor(c.value)}
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        backgroundColor: c.bg,
                        border: isSelected
                          ? '2px solid #ffffff'
                          : '1px solid rgba(255,255,255,0.25)',
                        boxShadow: isSelected
                          ? `0 0 10px ${c.value}`
                          : 'none',
                        cursor: 'pointer',
                        outline: 'none',
                        padding: 0,
                        transform: isSelected ? 'scale(1.18)' : 'scale(1)',
                        transition: 'all 0.15s ease',
                      }}
                    />
                  );
                })}
              </div>
            </Flex>

            <Flex align="center" gap="10px">
              <Text size="xs" tone="secondary" weight="medium">
                Speed:
              </Text>
              <SegmentedControl
                size="sm"
                value={speed}
                onChange={(val) => setSpeed(val as UnfoldingSpeed)}
                options={[
                  { value: 'fast', label: 'Fast (14ms)' },
                  { value: 'normal', label: 'Normal (28ms)' },
                  { value: 'slow', label: 'Slow (55ms)' },
                  { value: 'cinematic', label: 'Cinematic (90ms)' },
                ]}
              />
            </Flex>

            <Flex align="center" gap="10px">
              <Text size="xs" tone="secondary" weight="medium">
                Intensity:
              </Text>
              <SegmentedControl
                size="sm"
                value={intensity}
                onChange={(val) => setIntensity(val as UnfoldingIntensity)}
                options={[
                  { value: 'subtle', label: 'Subtle' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'vibrant', label: 'Vibrant' },
                ]}
              />
            </Flex>

            <Button
              size="sm"
              variant="primary"
              leftIcon={<RotateCcw size={14} />}
              onClick={() => setReplayKey((k) => k + 1)}
            >
              Replay Fold
            </Button>
          </Flex>
        </Stack>
      </Card>

      <div
        key={replayKey}
        style={{
          width: '100%',
          minHeight: '220px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--field-surface-sunken)',
          border: '1px solid var(--field-border-subtle)',
          borderRadius: 'var(--field-radius-md)',
          padding: '48px 24px',
          overflow: 'hidden',
        }}
      >
        <UnfoldingHeading
          as="h1"
          key={`${replayKey}-${text}-${size}-${wireframeColor}-${speed}-${intensity}`}
          text={text || 'WE CRAFT DIGITAL EXPERIENCES'}
          highlightWords={['CRAFT', 'EXPERIENCES']}
          highlightColor="#2563eb"
          size={size}
          intensity={intensity}
          trigger="mount"
          wireframeColor={wireframeColor}
          speed={speed}
        />
      </div>
    </Stack>
  );
};

// =========================================================================
// Complete Shadcn Component Registry
// =========================================================================
export const componentRegistry: ComponentDoc[] = [
  // 1. ALERT
  {
    id: 'alert',
    name: 'Alert',
    category: 'Feedback',
    description: 'Displays a callout for user attention.',
    importCode: `import {\n  Alert,\n  AlertAction,\n  AlertDescription,\n  AlertTitle,\n} from "@sam.barfield/field-react";`,
    usageCode: `<Alert variant="success" title="Payment successful">\n  Your payment of $29.99 has been processed. A receipt has been sent to your email address.\n</Alert>`,
    compositionTree: `Alert\n├── Icon\n├── AlertTitle\n├── AlertDescription\n└── AlertAction`,
    primaryDemo: {
      render: () => <AlertInteractiveDemo />,
      code: `<Alert variant="success" title="Payment successful">\n  Your payment of $29.99 has been processed. A receipt has been sent to your email address.\n</Alert>\n\n<Alert variant="info" title="New feature available">\n  We've added dark mode support. You can enable it in your account settings.\n</Alert>`,
    },
    variants: [
      {
        id: 'alert-basic',
        name: 'Basic',
        description: 'A basic alert with an icon, title and description.',
        render: () => (
          <div style={{ width: '100%', maxWidth: '500px' }}>
            <Alert variant="info" title="Account updated successfully">
              Your profile information has been saved. Changes will be reflected immediately.
            </Alert>
          </div>
        ),
        code: `<Alert variant="info" title="Account updated successfully">\n  Your profile information has been saved. Changes will be reflected immediately.\n</Alert>`,
      },
      {
        id: 'alert-destructive',
        name: 'Destructive',
        description: 'Use variant="danger" to create a destructive alert.',
        render: () => (
          <div style={{ width: '100%', maxWidth: '500px' }}>
            <Alert variant="danger" title="Payment failed">
              Your payment could not be processed. Please check your billing information and retry.
            </Alert>
          </div>
        ),
        code: `<Alert variant="danger" title="Payment failed">\n  Your payment could not be processed. Please check your billing information and retry.\n</Alert>`,
      },
      {
        id: 'alert-warning',
        name: 'Warning',
        description: 'Use variant="warning" for advisory and precautionary status notifications.',
        render: () => (
          <div style={{ width: '100%', maxWidth: '500px' }}>
            <Alert variant="warning" title="Approaching resource quota">
              Cluster CPU capacity is at 88%. Consider provisioning additional replica pools.
            </Alert>
          </div>
        ),
        code: `<Alert variant="warning" title="Approaching resource quota">\n  Cluster CPU capacity is at 88%. Consider provisioning additional replica pools.\n</Alert>`,
      },
    ],
    props: [
      { name: 'variant', type: "'info' | 'success' | 'warning' | 'danger'", default: "'info'", description: 'Color tone and semantic icon for the alert' },
      { name: 'title', type: 'string', description: 'Prominent header title text displayed at top of alert' },
      { name: 'children', type: 'ReactNode', required: true, description: 'The descriptive message content or actions' },
      { name: 'onClose', type: '() => void', description: 'Callback function triggered when the user clicks the dismiss button' },
    ],
    usefulNotes: [
      'Alerts automatically set role="alert" or role="status" and aria-live="polite" for screen reader accessibility.',
      'Designed with ambient color washes and high-contrast micro-borders for legibility in both dark and light modes.',
      'Use for persistent or page-level notifications. For transient disappearing feedback, prefer using Toast notifications.',
    ],
    keyboardInteractions: [
      { key: 'Tab', description: 'Moves focus to dismiss button or nested action buttons' },
      { key: 'Enter / Space', description: 'Triggers the dismiss action or closes the alert' },
    ],
  },

  // 2. BUTTON
  {
    id: 'button',
    name: 'Button',
    category: 'Actions',
    description: 'Engineered tactile action trigger with micro-interactions, scale press, and specular highlights.',
    importCode: `import { Button } from "@sam.barfield/field-react";`,
    usageCode: `<Button variant="primary" onClick={() => console.log('Clicked')}>\n  Deploy Changes\n</Button>`,
    compositionTree: `Button\n├── LeftIcon (optional)\n├── ButtonLabel / Children\n└── RightIcon (optional)`,
    primaryDemo: {
      render: () => <ButtonInteractiveDemo />,
      code: `<Button variant="primary">Primary Action</Button>\n<Button variant="secondary">Secondary Action</Button>\n<Button variant="outline">Outline</Button>\n<Button variant="ghost">Ghost</Button>\n<Button variant="danger">Destructive</Button>`,
    },
    variants: [
      {
        id: 'button-sizes',
        name: 'Sizes',
        description: 'Supports small (30px), medium (36px), and large (44px) heights.',
        render: () => (
          <Flex gap="12px" align="center">
            <Button size="sm" variant="secondary">Small (30px)</Button>
            <Button size="md" variant="secondary">Medium (36px)</Button>
            <Button size="lg" variant="secondary">Large (44px)</Button>
          </Flex>
        ),
        code: `<Button size="sm" variant="secondary">Small</Button>\n<Button size="md" variant="secondary">Medium</Button>\n<Button size="lg" variant="secondary">Large</Button>`,
      },
      {
        id: 'button-icons',
        name: 'With Icons & Loading State',
        description: 'Incorporate left/right iconography or show a smooth indeterminate spinner during async operations.',
        render: () => (
          <Flex gap="12px" align="center" wrap="wrap">
            <Button variant="primary" leftIcon={<Play size={14} />}>Start Instance</Button>
            <Button variant="secondary" rightIcon={<ExternalLink size={14} />}>Open Console</Button>
            <Button variant="secondary" isLoading>Saving State</Button>
            <Button variant="secondary" disabled>Disabled</Button>
          </Flex>
        ),
        code: `<Button variant="primary" leftIcon={<Play size={14} />}>Start Instance</Button>\n<Button variant="secondary" rightIcon={<ExternalLink size={14} />}>Open Console</Button>\n<Button variant="secondary" isLoading>Saving State</Button>`,
      },
    ],
    props: [
      { name: 'variant', type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'", default: "'secondary'", description: 'Visual style and priority' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Button dimensions and typographic scale' },
      { name: 'isLoading', type: 'boolean', default: 'false', description: 'Replaces icon with a spinner and disables user interactions' },
      { name: 'leftIcon', type: 'ReactNode', description: 'Icon rendered before the label' },
      { name: 'rightIcon', type: 'ReactNode', description: 'Icon rendered after the label' },
    ],
    usefulNotes: [
      'Includes active scale-down physics (transform: scale(0.98)) for high tactile response on click or tap.',
      'Primary buttons feature an illuminated top specular reflection border.',
    ],
  },

  // 3. ICON BUTTON
  {
    id: 'icon-button',
    name: 'IconButton',
    category: 'Actions',
    description: 'Square aspect-ratio icon button optimized for toolbars and compact actions.',
    importCode: `import { IconButton } from "@sam.barfield/field-react";`,
    usageCode: `<IconButton aria-label="Refresh telemetry" icon={<RefreshCw size={15} />} variant="primary" />`,
    compositionTree: `IconButton\n└── Icon`,
    primaryDemo: {
      render: () => (
        <Flex gap="12px" align="center" wrap="wrap">
          <IconButton aria-label="Refresh" icon={<RefreshCw size={15} />} variant="primary" />
          <IconButton aria-label="Add" icon={<Plus size={15} />} variant="secondary" />
          <IconButton aria-label="Share" icon={<Share2 size={15} />} variant="outline" />
          <IconButton aria-label="Like" icon={<Heart size={15} />} variant="ghost" />
          <IconButton aria-label="Delete" icon={<Trash2 size={15} />} variant="danger" />
        </Flex>
      ),
      code: `<IconButton aria-label="Refresh" icon={<RefreshCw size={15} />} variant="primary" />\n<IconButton aria-label="Add" icon={<Plus size={15} />} variant="secondary" />\n<IconButton aria-label="Share" icon={<Share2 size={15} />} variant="outline" />\n<IconButton aria-label="Like" icon={<Heart size={15} />} variant="ghost" />\n<IconButton aria-label="Delete" icon={<Trash2 size={15} />} variant="danger" />`,
    },
    props: [
      { name: 'icon', type: 'ReactNode', required: true, description: 'Icon element to render inside the button' },
      { name: 'aria-label', type: 'string', required: true, description: 'Required accessible label for screen readers' },
      { name: 'variant', type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'", default: "'secondary'", description: 'Styling tone' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Square dimensions (30px, 36px, 44px)' },
    ],
  },

  // 4. BUTTON GROUP & SEGMENTED CONTROL
  {
    id: 'segmented-control',
    name: 'SegmentedControl',
    category: 'Actions',
    description: 'Tactile multi-option switcher with smooth pill selection and attached button clusters.',
    importCode: `import { SegmentedControl, ButtonGroup } from "@sam.barfield/field-react";`,
    usageCode: `<SegmentedControl\n  value="grid"\n  onChange={(val) => console.log(val)}\n  options={[\n    { value: 'grid', label: 'Grid View' },\n    { value: 'list', label: 'List View' },\n  ]}\n/>`,
    compositionTree: `SegmentedControl\n├── SegmentOption (Active Pill)\n└── SegmentOption`,
    primaryDemo: {
      render: () => {
        const [view, setView] = useState('grid');
        return (
          <Stack gap="20px" align="center">
            <SegmentedControl
              value={view}
              onChange={setView}
              options={[
                { value: 'grid', label: 'Grid View' },
                { value: 'list', label: 'List View' },
                { value: 'compact', label: 'Compact' },
                { value: 'raw', label: 'Raw JSON' },
              ]}
            />
            <ButtonGroup>
              <Button variant="secondary">Day</Button>
              <Button variant="secondary">Week</Button>
              <Button variant="secondary">Month</Button>
              <Button variant="secondary">Year</Button>
            </ButtonGroup>
          </Stack>
        );
      },
      code: `<SegmentedControl\n  value={view}\n  onChange={setView}\n  options={[\n    { value: 'grid', label: 'Grid View' },\n    { value: 'list', label: 'List View' },\n    { value: 'compact', label: 'Compact' },\n  ]}\n/>`,
    },
    props: [
      { name: 'options', type: 'Array<{ value: string, label: ReactNode, icon?: ReactNode }>', required: true, description: 'The choices rendered in the control' },
      { name: 'value', type: 'string', required: true, description: 'Selected option value' },
      { name: 'onChange', type: '(val: string) => void', required: true, description: 'Selection change handler' },
    ],
  },

  // 5. DROPDOWN MENU
  {
    id: 'dropdown-menu',
    name: 'DropdownMenu',
    category: 'Actions',
    description: 'Contextual actions dropdown with grouped items, icons, shortcuts, and destructive items.',
    importCode: `import {\n  DropdownMenu,\n  DropdownGroup,\n  DropdownItem,\n  DropdownDivider\n} from "@sam.barfield/field-react";`,
    usageCode: `<DropdownMenu\n  trigger={<Button variant="secondary">Actions</Button>}\n>\n  <DropdownGroup label="Lifecycle">\n    <DropdownItem icon={<Play size={14} />}>Start Instance</DropdownItem>\n  </DropdownGroup>\n</DropdownMenu>`,
    compositionTree: `DropdownMenu\n├── Trigger\n└── MenuPortal\n    ├── DropdownGroup\n    │   ├── DropdownItem\n    │   └── DropdownItem\n    ├── DropdownDivider\n    └── DropdownItem (Danger)`,
    primaryDemo: {
      render: () => (
        <Flex gap="16px" align="center">
          <DropdownMenu
            trigger={
              <Button variant="secondary" rightIcon={<MoreVertical size={14} />}>
                Instance Actions
              </Button>
            }
          >
            <DropdownGroup label="Lifecycle">
              <DropdownItem icon={<Play size={14} />}>Start Instance</DropdownItem>
              <DropdownItem icon={<RotateCcw size={14} />}>Reboot Instance</DropdownItem>
              <DropdownItem icon={<Square size={14} />}>Stop Instance</DropdownItem>
            </DropdownGroup>
            <DropdownDivider />
            <DropdownItem variant="danger" icon={<Trash2 size={14} />}>
              Terminate Instance
            </DropdownItem>
          </DropdownMenu>
        </Flex>
      ),
      code: `<DropdownMenu\n  trigger={<Button variant="secondary" rightIcon={<MoreVertical size={14} />}>Instance Actions</Button>}\n>\n  <DropdownGroup label="Lifecycle">\n    <DropdownItem icon={<Play size={14} />}>Start Instance</DropdownItem>\n    <DropdownItem icon={<RotateCcw size={14} />}>Reboot Instance</DropdownItem>\n  </DropdownGroup>\n  <DropdownDivider />\n  <DropdownItem variant="danger" icon={<Trash2 size={14} />}>\n    Terminate Instance\n  </DropdownItem>\n</DropdownMenu>`,
    },
    props: [
      { name: 'trigger', type: 'ReactNode', required: true, description: 'Interactive trigger element opening the menu' },
      { name: 'align', type: "'start' | 'end'", default: "'start'", description: 'Horizontal anchor alignment' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Groups and items' },
    ],
  },

  // 6. TEXT INPUT & TEXT AREA
  {
    id: 'text-input',
    name: 'TextInput & TextArea',
    category: 'Forms',
    description: 'Text entry with adornments, status borders, clean focus rings, and multi-line editor support.',
    importCode: `import { TextInput, TextArea } from "@sam.barfield/field-react";`,
    usageCode: `<TextInput\n  label="Endpoint Hostname"\n  placeholder="api.cluster.internal"\n  helperText="DNS resolving to VPC mesh"\n/>`,
    compositionTree: `TextInput\n├── Label\n├── LeftAdornment\n├── NativeInput\n├── RightAdornment\n└── HelperText / ErrorText`,
    primaryDemo: {
      render: () => (
        <Grid columns="repeat(auto-fit, minmax(260px, 1fr))" gap="20px" style={{ width: '100%', maxWidth: '680px' }}>
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
            defaultValue="apiVersion: field.io/v1\nkind: SecurityPolicy\nspec:\n  enforceMutualTLS: true"
          />
        </Grid>
      ),
      code: `<TextInput\n  label="Endpoint Hostname"\n  placeholder="api.cluster.field.internal"\n  helperText="DNS resolving to VPC mesh"\n/>\n\n<TextInput\n  label="Search Filter"\n  leftAdornment={<Search size={15} />}\n  rightAdornment={<Kbd>⌘K</Kbd>}\n/>`,
    },
    props: [
      { name: 'label', type: 'string', description: 'Label displayed above input' },
      { name: 'helperText', type: 'string', description: 'Subtle guidance message beneath input' },
      { name: 'error', type: 'string', description: 'Error message that tints input border red and displays text' },
      { name: 'leftAdornment', type: 'ReactNode', description: 'Element placed inside the input on left side' },
      { name: 'rightAdornment', type: 'ReactNode', description: 'Element placed inside the input on right side' },
    ],
  },

  // 7. SELECT
  {
    id: 'select',
    name: 'Select',
    category: 'Forms',
    description: 'Custom accessible dropdown select menu with custom options and helper states.',
    importCode: `import { Select } from "@sam.barfield/field-react";`,
    usageCode: `<Select\n  label="Deployment Region"\n  value="us-east"\n  onChange={(val) => console.log(val)}\n  options={[\n    { value: 'us-east', label: 'US East (N. Virginia)' },\n    { value: 'us-west', label: 'US West (Oregon)' },\n  ]}\n/>`,
    compositionTree: `Select\n├── Label\n├── SelectTrigger\n└── SelectOptionsList`,
    primaryDemo: {
      render: () => {
        const [val, setVal] = useState('us-east');
        return (
          <div style={{ width: '100%', maxWidth: '320px' }}>
            <Select
              label="Deployment Region"
              value={val}
              onChange={setVal}
              options={[
                { value: 'us-east', label: 'US East (N. Virginia)' },
                { value: 'us-west', label: 'US West (Oregon)' },
                { value: 'eu-central', label: 'EU Central (Frankfurt)' },
                { value: 'ap-east', label: 'AP East (Tokyo)' },
              ]}
            />
          </div>
        );
      },
      code: `<Select\n  label="Deployment Region"\n  value={region}\n  onChange={setRegion}\n  options={[\n    { value: 'us-east', label: 'US East (N. Virginia)' },\n    { value: 'us-west', label: 'US West (Oregon)' },\n  ]}\n/>`,
    },
    props: [
      { name: 'options', type: 'Array<{ value: string, label: string }>', required: true, description: 'Available list items' },
      { name: 'value', type: 'string', description: 'Currently active item value' },
      { name: 'onChange', type: '(val: string) => void', description: 'Change callback' },
    ],
  },

  // 8. SWITCH, CHECKBOX, RADIO
  {
    id: 'switch',
    name: 'Switch, Checkbox & Radio',
    category: 'Forms',
    description: 'High-precision boolean selectors and exclusive option groups with accessible keyboard focus.',
    importCode: `import { Switch, Checkbox, RadioGroup } from "@sam.barfield/field-react";`,
    usageCode: `<Switch\n  checked={enabled}\n  onChange={setEnabled}\n  label="Automatic Failover"\n  description="Reroute traffic to healthy replicas"\n/>`,
    compositionTree: `ControlField\n├── Label\n├── Switch / Checkbox / Radio\n└── Description`,
    primaryDemo: {
      render: () => <ControlsInteractiveDemo />,
      code: `<Switch checked={enabled} onChange={setEnabled} label="Automatic Failover" description="Reroute traffic to healthy replicas" />\n<Checkbox checked={mTLS} onChange={setMTLS} label="Enforce mTLS on ingress connections" />\n<RadioGroup label="Scheduling Strategy" value={strategy} onChange={setStrategy} options={[...]} />`,
    },
    props: [
      { name: 'checked', type: 'boolean', required: true, description: 'Boolean switch or checkbox state' },
      { name: 'onChange', type: '(checked: boolean) => void', required: true, description: 'State toggle callback' },
      { name: 'label', type: 'string', description: 'Primary label' },
      { name: 'description', type: 'string', description: 'Subtext explaining the setting' },
    ],
  },

  // 9. SLIDER
  {
    id: 'slider',
    name: 'Slider',
    category: 'Forms',
    description: 'Numeric range slider supporting threshold zones, divider notches, and optional luminous glow.',
    importCode: `import { Slider } from "@sam.barfield/field-react";`,
    usageCode: `<Slider\n  label="Cluster Compute Allocation"\n  value={65}\n  onChange={(val) => console.log(val)}\n  min={0}\n  max={100}\n  valueSuffix="%"\n  glow={true}\n/>`,
    compositionTree: `Slider\n├── Label & ValueDisplay\n├── Track\n│   ├── FilledProgress\n│   └── ThresholdZones\n└── Thumb (with specular glow)`,
    primaryDemo: {
      render: () => <SliderInteractiveDemo />,
      code: `<Slider\n  label="Cluster Compute Allocation"\n  value={val}\n  onChange={setVal}\n  min={0}\n  max={100}\n  valueSuffix="%"\n  glow={true}\n/>`,
    },
    variants: [
      {
        id: 'slider-zones',
        name: 'Threshold Multi-Zones',
        description: 'Visual status coloration across numeric regions (Optimal, Elevated, Critical).',
        render: () => <SliderZonesDemo />,
        code: `<Slider\n  label="Memory Saturation (Thresholds)"\n  value={val}\n  onChange={setVal}\n  zones={[\n    { to: 60, color: 'success', label: 'Optimal' },\n    { to: 85, color: 'warning', label: 'Elevated' },\n    { to: 100, color: 'danger', label: 'Critical' },\n  ]}\n/>`,
      },
    ],
    props: [
      { name: 'value', type: 'number', required: true, description: 'Current numeric value' },
      { name: 'onChange', type: '(val: number) => void', required: true, description: 'Value update callback' },
      { name: 'min', type: 'number', default: '0', description: 'Minimum slider range limit' },
      { name: 'max', type: 'number', default: '100', description: 'Maximum slider range limit' },
      { name: 'glow', type: 'boolean', default: 'false', description: 'Enables ambient luminous glow on thumb' },
    ],
  },

  // 10. DATE PICKER & RANGE
  {
    id: 'datepicker',
    name: 'DatePicker & DateRangePicker',
    category: 'Forms',
    description: 'Portal-backed precision calendar date and range selector with month jumping and quick presets.',
    importCode: `import { DatePicker, DateRangePicker } from "@sam.barfield/field-react";`,
    usageCode: `<DatePicker\n  label="Target Cutoff"\n  value={date}\n  onChange={setDate}\n  showDoneButton={true}\n/>`,
    compositionTree: `DatePicker\n├── Label\n├── DateInputTrigger\n└── CalendarPortal\n    ├── MonthNavigation\n    ├── DayGrid\n    └── ActionFooter (Done / Close)`,
    primaryDemo: {
      render: () => <DatePickerInteractiveDemo />,
      code: `<DatePicker\n  label="Deployment Cutoff Date"\n  value={date}\n  onChange={setDate}\n  placeholder="Select deployment date..."\n  showDoneButton={true}\n  showCloseButton={true}\n/>`,
    },
    variants: [
      {
        id: 'date-range',
        name: 'Date Range Selector',
        description: 'Connected range span with start/end highlighted bounding days.',
        render: () => <DateRangePickerDemo />,
        code: `<DateRangePicker\n  label="Telemetry Analytics Window"\n  value={range}\n  onChange={setRange}\n  showDoneButton={true}\n/>`,
      },
    ],
    props: [
      { name: 'value', type: 'Date | null', description: 'Currently selected Date object' },
      { name: 'onChange', type: '(date: Date | null) => void', description: 'Selection handler' },
      { name: 'showDoneButton', type: 'boolean', default: 'false', description: 'Provides explicit Done button in popover' },
    ],
  },

  // 11. COMBOBOX & NUMBER INPUT
  {
    id: 'combobox',
    name: 'Combobox & NumberInput',
    category: 'Forms',
    description: 'Searchable multi-select with tag chips, alongside numeric stepper inputs with keyboard arrows.',
    importCode: `import { Combobox, NumberInput } from "@sam.barfield/field-react";`,
    usageCode: `<Combobox\n  label="Assigned Security Groups"\n  options={[\n    { value: 'sg-web', label: 'sg-web (HTTPS 443)' },\n    { value: 'sg-db', label: 'sg-db (PostgreSQL 5432)' },\n  ]}\n  value={selectedGroups}\n  onChange={setSelectedGroups}\n/>`,
    compositionTree: `Combobox\n├── Label\n├── ChipsContainer\n│   ├── TagChip (Removable)\n│   └── SearchInput\n└── DropdownOptionsList`,
    primaryDemo: {
      render: () => {
        const [tags, setTags] = useState(['sg-web']);
        const [num, setNum] = useState(2048);
        return (
          <Grid columns="repeat(auto-fit, minmax(260px, 1fr))" gap="20px" style={{ width: '100%', maxWidth: '640px' }}>
            <Combobox
              label="Assigned Security Groups"
              options={[
                { value: 'sg-web', label: 'sg-web (HTTPS 443)' },
                { value: 'sg-db', label: 'sg-db (PostgreSQL 5432)' },
                { value: 'sg-bastion', label: 'sg-bastion (SSH 22)' },
              ]}
              value={tags}
              onChange={setTags}
            />
            <NumberInput
              label="Worker Memory Allocation"
              value={num}
              onChange={setNum}
              min={512}
              max={16384}
              step={512}
              unit="MiB"
            />
          </Grid>
        );
      },
      code: `<Combobox\n  label="Assigned Security Groups"\n  options={[...]}\n  value={tags}\n  onChange={setTags}\n/>\n\n<NumberInput\n  label="Worker Memory Allocation"\n  value={num}\n  onChange={setNum}\n  step={512}\n  unit="MiB"\n/>`,
    },
    props: [
      { name: 'options', type: 'Array<{ value: string, label: string }>', required: true, description: 'Available multi-select items' },
      { name: 'value', type: 'Array<string>', description: 'Array of selected item values' },
    ],
  },

  // 12. NAVBAR
  {
    id: 'navbar',
    name: 'Navbar',
    category: 'Navigation',
    description: 'Header navigation bar with support for sticky positioning, backdrop blur, borders, and responsive mobile drawers.',
    importCode: `import {\n  Navbar,\n  NavbarBrand,\n  NavbarContent,\n  NavbarItem,\n  NavbarActions,\n  NavbarToggle,\n  NavbarMenu\n} from "@sam.barfield/field-react";`,
    usageCode: `<Navbar sticky blurred bordered>\n  <NavbarContent align="start">\n    <NavbarBrand href="/dashboard">Field Cloud</NavbarBrand>\n  </NavbarContent>\n  <NavbarContent align="center">\n    <NavbarItem href="/overview" isActive>Overview</NavbarItem>\n    <NavbarItem href="/deployments">Deployments</NavbarItem>\n  </NavbarContent>\n  <NavbarContent align="end">\n    <NavbarActions>\n      <Button size="sm">Action</Button>\n    </NavbarActions>\n    <NavbarToggle />\n  </NavbarContent>\n  <NavbarMenu>\n    <NavbarItem href="/overview">Overview</NavbarItem>\n  </NavbarMenu>\n</Navbar>`,
    compositionTree: `Navbar\n├── NavbarContent (align="start")\n│   └── NavbarBrand (Logo, Title, Badge)\n├── NavbarContent (align="center")\n│   └── NavbarItem (Active Underline / Pill)\n├── NavbarContent (align="end")\n│   ├── NavbarActions (Search, Theme, Avatar)\n│   └── NavbarToggle (Mobile Hamburger Button)\n└── NavbarMenu (Mobile Drawer Dropdown)`,
    primaryDemo: {
      render: () => <NavbarInteractiveDemo />,
      code: `<Navbar density={density} bordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>\n  <NavbarContent align="start">\n    <NavbarBrand>...</NavbarBrand>\n  </NavbarContent>\n  <NavbarContent align="center">\n    <NavbarItem isActive>Overview</NavbarItem>\n  </NavbarContent>\n  <NavbarContent align="end">\n    <NavbarActions>...</NavbarActions>\n    <NavbarToggle />\n  </NavbarContent>\n  <NavbarMenu>...</NavbarMenu>\n</Navbar>`,
    },
    props: [
      { name: 'density', type: "'default' | 'compact'", default: "'default'", description: 'Vertical height: 56px default or 48px compact' },
      { name: 'variant', type: "'underline' | 'pill' | 'rail' | 'ghost'", default: "'underline'", description: 'Visual and animated layout style on NavbarContent / NavbarItem' },
      { name: 'animated', type: 'boolean', default: 'true', description: 'Enables 120fps hardware-accelerated sliding glider indicator' },
      { name: 'sticky', type: 'boolean', default: 'false', description: 'Pins navbar to top of viewport with z-index 50' },
      { name: 'blurred', type: 'boolean', default: 'false', description: 'Translucent background with 12px backdrop-filter blur' },
      { name: 'bordered', type: 'boolean', default: 'true', description: 'Subtle 1px micro-border along bottom edge' },
      { name: 'maxWidth', type: "'sm' | 'md' | 'lg' | 'xl' | 'full' | number", default: "'full'", description: 'Constrains inner container width' },
      { name: 'isMenuOpen', type: 'boolean', description: 'Controlled mobile drawer open state' },
      { name: 'onMenuOpenChange', type: '(open: boolean) => void', description: 'Callback fired when mobile drawer toggles' },
    ],
  },

  // 13. SIDEBAR
  {
    id: 'sidebar',
    name: 'Sidebar',
    category: 'Navigation',
    description: 'Collapsible application navigation sidebar with Cloudflare-style nested dropdown hierarchy lines.',
    importCode: `import {\n  Sidebar,\n  SidebarHeader,\n  SidebarContent,\n  SidebarGroup,\n  SidebarItem,\n  SidebarDropdown,\n  SidebarSubItem\n} from "@sam.barfield/field-react";`,
    usageCode: `<Sidebar width={260} collapsed={false}>\n  <SidebarHeader icon={<Zap size={18} />} title="Field Cloud" />\n  <SidebarContent>\n    <SidebarGroup label="Workspaces">\n      <SidebarItem icon={<Activity size={16} />} label="Telemetry" />\n    </SidebarGroup>\n  </SidebarContent>\n</Sidebar>`,
    compositionTree: `Sidebar\n├── SidebarHeader\n├── SidebarContent\n│   ├── SidebarGroup\n│   │   └── SidebarItem\n│   └── SidebarDropdown\n│       ├── 1px Vertical Hierarchy Line\n│       └── SidebarSubItem\n└── SidebarFooter`,
    primaryDemo: {
      render: () => <SidebarInteractiveDemo />,
      code: `<Sidebar width={230} collapsed={collapsed} onCollapseChange={setCollapsed}>\n  <SidebarHeader icon={<Zap size={18} />} title="Field Cloud" />\n  <SidebarContent>\n    <SidebarDropdown icon={<Clock size={16} />} label="Recents" defaultOpen>\n      <SidebarSubItem label="Edge Workers" isActive />\n      <SidebarSubItem label="Object Storage" />\n    </SidebarDropdown>\n  </SidebarContent>\n</Sidebar>`,
    },
    props: [
      { name: 'width', type: 'string | number', default: "'260px'", description: 'Expanded sidebar width' },
      { name: 'collapsedWidth', type: 'string | number', default: "'68px'", description: 'Icon-rail width when collapsed' },
      { name: 'collapsed', type: 'boolean', default: 'false', description: 'Whether the sidebar is collapsed to an icon rail' },
    ],
  },

  // 13. TABS & BREADCRUMB
  {
    id: 'tabs',
    name: 'Tabs & Breadcrumb',
    category: 'Navigation',
    description: 'Underline navigation tab bar with smooth touch rail and hierarchical trail breadcrumbs.',
    importCode: `import { Tabs, Breadcrumb } from "@sam.barfield/field-react";`,
    usageCode: `<Tabs\n  activeId="general"\n  onChange={(id) => console.log(id)}\n  items={[\n    { id: 'general', label: 'General Config' },\n    { id: 'security', label: 'Security Firewall' },\n  ]}\n/>`,
    compositionTree: `Tabs\n├── TabItem (Active Indicator Underline)\n└── TabItem`,
    primaryDemo: {
      render: () => {
        const [tab, setTab] = useState('general');
        return (
          <Stack gap="20px" style={{ width: '100%', maxWidth: '540px' }}>
            <Breadcrumb
              items={[
                { label: 'Workspaces', href: '#' },
                { label: 'Engineering Pods', href: '#' },
                { label: 'us-east-alpha (Active)' },
              ]}
            />
            <Tabs
              activeId={tab}
              onChange={setTab}
              items={[
                { id: 'general', label: 'General Config' },
                { id: 'security', label: 'Security Firewall' },
                { id: 'networking', label: 'Virtual Networks' },
                { id: 'audit', label: 'Audit Logs' },
              ]}
            />
          </Stack>
        );
      },
      code: `<Breadcrumb items={[{ label: 'Workspaces' }, { label: 'us-east-alpha' }]} />\n<Tabs activeId={tab} onChange={setTab} items={[...]} />`,
    },
    props: [
      { name: 'items', type: 'Array<{ id: string, label: ReactNode, icon?: ReactNode }>', required: true, description: 'Tab headers' },
      { name: 'activeId', type: 'string', description: 'Selected tab id' },
      { name: 'onChange', type: '(id: string) => void', description: 'Tab change handler' },
    ],
  },

  // 14. STEPPER
  {
    id: 'stepper',
    name: 'Stepper',
    category: 'Navigation',
    description: 'Sequential multi-step workflow progress indicator for wizards and deployments.',
    importCode: `import { Stepper } from "@sam.barfield/field-react";`,
    usageCode: `<Stepper\n  activeStep={1}\n  steps={[\n    { id: '1', title: 'Hardware Instance', description: 'Compute & memory' },\n    { id: '2', title: 'Networking', description: 'VPC & subnets' },\n  ]}\n/>`,
    compositionTree: `Stepper\n├── StepNode (Completed / Active / Pending)\n├── ConnectorLine\n└── StepNode`,
    primaryDemo: {
      render: () => {
        const [step, setStep] = useState(1);
        return (
          <div style={{ width: '100%', maxWidth: '640px' }}>
            <Stepper
              activeStep={step}
              onStepClick={setStep}
              steps={[
                { id: '1', title: 'Compute', description: 'Instance sizing' },
                { id: '2', title: 'Networking', description: 'Subnets & IP' },
                { id: '3', title: 'Storage', description: 'EBS volumes' },
                { id: '4', title: 'Deploy', description: 'Review & launch' },
              ]}
            />
          </div>
        );
      },
      code: `<Stepper\n  activeStep={step}\n  onStepClick={setStep}\n  steps={[\n    { id: '1', title: 'Compute' },\n    { id: '2', title: 'Networking' },\n    { id: '3', title: 'Storage' },\n  ]}\n/>`,
    },
    props: [
      { name: 'activeStep', type: 'number', required: true, description: 'Zero-based index of the active step' },
      { name: 'steps', type: 'Array<StepItem>', required: true, description: 'Step title and descriptions' },
      { name: 'onStepClick', type: '(index: number) => void', description: 'Callback when clicking step node' },
    ],
  },

  // 15. CARD & STAT CARD
  {
    id: 'card',
    name: 'Card & StatCard',
    category: 'Layout',
    description: 'Tactile elevated containers with header, content, and footer sections alongside telemetry KPI cards.',
    importCode: `import { Card, CardHeader, CardContent, CardFooter, StatCard } from "@sam.barfield/field-react";`,
    usageCode: `<Card>\n  <CardHeader>\n    <Heading level={4}>Compute Cluster</Heading>\n  </CardHeader>\n  <CardContent>\n    <Text>8 active worker nodes healthy.</Text>\n  </CardContent>\n</Card>`,
    compositionTree: `Card\n├── CardHeader\n├── CardContent\n└── CardFooter`,
    primaryDemo: {
      render: () => (
        <Grid columns="repeat(auto-fit, minmax(260px, 1fr))" gap="20px" style={{ width: '100%', maxWidth: '640px' }}>
          <StatCard
            label="API Requests / Sec"
            value="48,290"
            delta={{ value: '+14.2%', trend: 'up' }}
            subtitle="Trailing 15m ingress"
          />
          <Card>
            <CardHeader>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Heading level={4}>Edge Node</Heading>
                <Badge variant="success" dot>Online</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Text size="sm" tone="secondary">
                Running revision <code>v2.4.12</code> on dedicated hardware in eu-west-1.
              </Text>
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="outline">View Metrics</Button>
            </CardFooter>
          </Card>
        </Grid>
      ),
      code: `<StatCard\n  label="API Requests / Sec"\n  value="48,290"\n  delta={{ value: '+14.2%', trend: 'up' }}\n/>\n\n<Card>\n  <CardHeader><Heading level={4}>Edge Node</Heading></CardHeader>\n  <CardContent><Text>Node healthy</Text></CardContent>\n  <CardFooter><Button size="sm">View</Button></CardFooter>\n</Card>`,
    },
    props: [
      { name: 'variant', type: "'default' | 'interactive'", default: "'default'", description: 'Interactive adds hover lift and cursor' },
    ],
  },

  // 16. BADGE & AVATAR
  {
    id: 'badge',
    name: 'Badge & Avatar',
    category: 'Data Display',
    description: 'Compact status tags with pulsing dots, alongside user profile representations with initials fallback.',
    importCode: `import { Badge, Avatar, AvatarGroup } from "@sam.barfield/field-react";`,
    usageCode: `<Badge variant="success" dot>Operational</Badge>\n<Avatar name="Sarah Lin" size="md" />`,
    compositionTree: `Badge\n├── StatusDot (optional pulse)\n└── LabelText`,
    primaryDemo: {
      render: () => (
        <Stack gap="20px" align="center">
          <Flex gap="10px" wrap="wrap" justify="center">
            <Badge variant="default">Default</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="success" dot>Success</Badge>
            <Badge variant="warning" dot>Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="info">Info</Badge>
          </Flex>
          <Flex gap="16px" align="center" justify="center">
            <Avatar name="Alex Lin" size="md" />
            <Avatar name="Jane Doe" size="md" />
            <AvatarGroup max={3}>
              <Avatar name="User One" />
              <Avatar name="User Two" />
              <Avatar name="User Three" />
              <Avatar name="User Four" />
            </AvatarGroup>
          </Flex>
        </Stack>
      ),
      code: `<Badge variant="success" dot>Success</Badge>\n<Badge variant="warning" dot>Warning</Badge>\n<Avatar name="Alex Lin" size="md" />\n<AvatarGroup max={3}>...</AvatarGroup>`,
    },
    props: [
      { name: 'variant', type: "'default' | 'accent' | 'success' | 'warning' | 'danger' | 'info'", default: "'default'", description: 'Color token styling' },
      { name: 'dot', type: 'boolean', default: 'false', description: 'Includes real-time indicator dot' },
    ],
  },

  // 17. TABLE & PAGINATION
  {
    id: 'table',
    name: 'Table & Pagination',
    category: 'Data Display',
    description: 'Tabular data grid with multi-row selection, sorting, pagination, and compound sub-components.',
    importCode: `import { Table, Pagination } from "@sam.barfield/field-react";`,
    usageCode: `<Table\n  data={nodes}\n  keyExtractor={(r) => r.id}\n  columns={[\n    { key: 'node', header: 'Node Name' },\n    { key: 'status', header: 'Status' },\n  ]}\n/>`,
    compositionTree: `Table\n├── TableHeader\n│   └── TableRow\n│       └── TableHead (Sortable)\n└── TableBody\n    └── TableRow (Selectable / Hover)\n        └── TableCell`,
    primaryDemo: {
      render: () => <TableInteractiveDemo />,
      code: `<Table\n  data={clusterNodes}\n  keyExtractor={(item) => item.id}\n  selectable={true}\n  columns={[\n    { key: 'node', header: 'Node Name' },\n    { key: 'region', header: 'Region' },\n    { key: 'status', header: 'Status' },\n  ]}\n/>\n<Pagination currentPage={1} totalPages={4} onPageChange={setPage} />`,
    },
    props: [
      { name: 'data', type: 'Array<T>', required: true, description: 'Record data items' },
      { name: 'columns', type: 'Array<Column<T>>', required: true, description: 'Column formatting definitions' },
      { name: 'selectable', type: 'boolean', default: 'false', description: 'Renders checkbox selection column' },
    ],
  },

  // 18. TERMINAL
  {
    id: 'terminal',
    name: 'Terminal',
    category: 'Data Display',
    description: 'Instrument-grade dark carbon terminal and telemetry log streamer with interactive prompt.',
    importCode: `import {\n  Terminal,\n  TerminalHeader,\n  TerminalBody,\n  TerminalLine,\n  TerminalPrompt\n} from "@sam.barfield/field-react";`,
    usageCode: `<Terminal>\n  <TerminalHeader title="cluster.log" />\n  <TerminalBody>\n    <TerminalLine level="info">Mesh connected</TerminalLine>\n    <TerminalPrompt onSubmit={(cmd) => console.log(cmd)} />\n  </TerminalBody>\n</Terminal>`,
    compositionTree: `Terminal\n├── TerminalHeader (Traffic Lights & Session Title)\n└── TerminalBody\n    ├── TerminalLine (Level badge & timestamp)\n    └── TerminalPrompt (History cycling)`,
    primaryDemo: {
      render: () => <TerminalInteractiveDemo />,
      code: `<Terminal>\n  <TerminalHeader title="cluster-telemetry.sh" onClear={clearLogs} />\n  <TerminalBody>\n    <TerminalLine level="info">Enclave tunnel established</TerminalLine>\n    <TerminalLine level="success">Certificates verified</TerminalLine>\n    <TerminalPrompt onSubmit={handleCommand} />\n  </TerminalBody>\n</Terminal>`,
    },
    props: [
      { name: 'title', type: 'string', default: "'terminal session'", description: 'Terminal header title' },
      { name: 'onClear', type: '() => void', description: 'Clear button callback' },
    ],
  },

  // 19. CODE BLOCK & DIFF VIEWER
  {
    id: 'code-block',
    name: 'CodeBlock & DiffViewer',
    category: 'Data Display',
    description: 'Syntax-colored code snippets with line numbers, copy actions, and unified git diff views.',
    importCode: `import { CodeBlock, DiffViewer, CopyButton } from "@sam.barfield/field-react";`,
    usageCode: `<CodeBlock\n  language="typescript"\n  code="export const api = createClient();"\n/>`,
    compositionTree: `CodeBlock\n├── Header (Language badge & CopyButton)\n└── Pre / Code (Line numbers & highlighted lines)`,
    primaryDemo: {
      render: () => (
        <div style={{ width: '100%', maxWidth: '640px' }}>
          <CodeBlock
            language="typescript"
            title="cluster-config.ts"
            code={`export const clusterConfig = {\n  meshPort: 8443,\n  mtlsEnabled: true,\n  nodes: ['us-east-1', 'eu-west-1'],\n};`}
          />
        </div>
      ),
      code: `<CodeBlock\n  language="typescript"\n  title="cluster-config.ts"\n  code="export const clusterConfig = { ... }"\n/>`,
    },
    props: [
      { name: 'code', type: 'string', required: true, description: 'Source code string' },
      { name: 'language', type: 'string', description: 'Language indicator' },
      { name: 'showLineNumbers', type: 'boolean', default: 'true', description: 'Toggles line numbers' },
    ],
  },

  // 20. METRICS (StatusDot, Sparkline, Meter)
  {
    id: 'metrics',
    name: 'StatusDot, Sparkline & Meter',
    category: 'Data Display',
    description: 'Telemetry status dots, lightweight SVG trend curves, and visual quota meters.',
    importCode: `import { StatusDot, Sparkline, Meter } from "@sam.barfield/field-react";`,
    usageCode: `<StatusDot status="success" pulse label="Ingress Active" />\n<Sparkline data={[12, 19, 15, 28, 22, 34, 42]} />\n<Meter value={74} />`,
    compositionTree: `StatusDot\n├── Dot (Pulse Animation)\n└── Label`,
    primaryDemo: {
      render: () => (
        <Stack gap="20px" style={{ width: '100%', maxWidth: '440px' }}>
          <Flex gap="16px" wrap="wrap" justify="center">
            <StatusDot status="success" pulse label="Cluster Healthy" />
            <StatusDot status="warning" label="High Latency" />
            <StatusDot status="danger" label="Pod Evicted" />
          </Flex>
          <div>
            <Text size="xs" tone="secondary" style={{ marginBottom: '6px' }}>Network Throughput Trend (Gbps)</Text>
            <Sparkline data={[14, 22, 18, 32, 28, 45, 52, 48, 65]} height={40} />
          </div>
          <div>
            <Text size="xs" tone="secondary" style={{ marginBottom: '6px' }}>Memory Limit Quota (74%)</Text>
            <Meter value={74} />
          </div>
        </Stack>
      ),
      code: `<StatusDot status="success" pulse label="Cluster Healthy" />\n<Sparkline data={[14, 22, 18, 32, 28, 45, 52]} />\n<Meter value={74} />`,
    },
    props: [
      { name: 'status', type: "'success' | 'warning' | 'danger' | 'info' | 'neutral'", default: "'info'", description: 'Status color' },
      { name: 'pulse', type: 'boolean', default: 'false', description: 'Enables glowing pulse ripple' },
    ],
  },

  // 21. MODAL & DRAWER
  {
    id: 'modal',
    name: 'Modal & Drawer',
    category: 'Feedback',
    description: 'Focus-trapped accessible dialogs and slide-in panels with backdrop blur and escape dismissal.',
    importCode: `import { Modal, Drawer } from "@sam.barfield/field-react";`,
    usageCode: `<Modal isOpen={isOpen} onClose={() => setOpen(false)} title="Confirm Action">\n  <Text>Modal body content</Text>\n</Modal>`,
    compositionTree: `ModalPortal\n├── Backdrop (Blur overlay)\n└── Dialog\n    ├── ModalHeader\n    ├── ModalBody\n    └── ModalFooter`,
    primaryDemo: {
      render: () => (
        <Flex gap="16px" justify="center">
          <ModalInteractiveDemo />
          <DrawerInteractiveDemo />
        </Flex>
      ),
      code: `<Modal isOpen={open} onClose={() => setOpen(false)} title="Deploy Cluster">\n  <Text>Dialog contents</Text>\n</Modal>\n\n<Drawer isOpen={open} onClose={() => setOpen(false)} title="Settings">\n  <Text>Sheet contents</Text>\n</Drawer>`,
    },
    props: [
      { name: 'isOpen', type: 'boolean', required: true, description: 'Controls visibility of the dialog or sheet' },
      { name: 'onClose', type: '() => void', required: true, description: 'Escape key or backdrop click handler' },
      { name: 'title', type: 'ReactNode', description: 'Dialog header title' },
    ],
  },

  // 22. TOOLTIP & POPOVER
  {
    id: 'tooltip',
    name: 'Tooltip & Popover',
    category: 'Feedback',
    description: 'Portal-backed unclipped floating micro-labels and rich interactive cards anchored to triggers.',
    importCode: `import { Tooltip, Popover } from "@sam.barfield/field-react";`,
    usageCode: `<Tooltip content="Copy command to clipboard">\n  <Button>Hover Me</Button>\n</Tooltip>`,
    compositionTree: `Tooltip\n├── Children (Trigger)\n└── TooltipPortal (Floating Tooltip bubble)`,
    primaryDemo: {
      render: () => (
        <Flex gap="24px" align="center" justify="center">
          <Tooltip content="TLS 1.3 encryption actively enforced" position="top">
            <Button variant="secondary" leftIcon={<Shield size={14} />}>
              Hover for Tooltip
            </Button>
          </Tooltip>
          <Popover
            trigger={<Button variant="outline">Interactive Popover</Button>}
            content={
              <div style={{ padding: '12px', maxWidth: '240px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '6px' }}>Virtual Network</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--field-text-secondary)' }}>
                  Assigned Subnet: 10.0.4.0/24 with NAT Gateway failover.
                </div>
              </div>
            }
          />
        </Flex>
      ),
      code: `<Tooltip content="TLS 1.3 encryption enforced" position="top">\n  <Button variant="secondary">Hover for Tooltip</Button>\n</Tooltip>`,
    },
    props: [
      { name: 'content', type: 'ReactNode', required: true, description: 'Tooltip message' },
      { name: 'position', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: 'Anchor placement' },
    ],
  },

  // 23. PROGRESS, SPINNER, SKELETON
  {
    id: 'progress',
    name: 'Progress, Spinner & Skeleton',
    category: 'Feedback',
    description: 'Illuminated progress bars, indeterminate circular spinners, and shimmering placeholder skeletons.',
    importCode: `import { Progress, Spinner, Skeleton } from "@sam.barfield/field-react";`,
    usageCode: `<Progress value={65} showValue />\n<Spinner size={24} />\n<Skeleton width={200} height={24} />`,
    compositionTree: `Progress\n├── Track\n└── ProgressBar (with glowing specular front edge)`,
    primaryDemo: {
      render: () => (
        <Stack gap="20px" style={{ width: '100%', maxWidth: '440px' }}>
          <Progress value={78} showValue />
          <Flex gap="16px" align="center" justify="center">
            <Spinner size={16} />
            <Spinner size={22} />
            <Spinner size={28} />
          </Flex>
          <Stack gap="8px">
            <Skeleton width="100%" height="20px" />
            <Skeleton width="60%" height="16px" />
          </Stack>
        </Stack>
      ),
      code: `<Progress value={78} showValue />\n<Spinner size={22} />\n<Skeleton width="100%" height="20px" />`,
    },
    props: [
      { name: 'value', type: 'number', required: true, description: 'Progress percentage (0-100)' },
    ],
  },

  // 24. ACCORDION
  {
    id: 'accordion',
    name: 'Accordion',
    category: 'Feedback',
    description: 'Expandable disclosure panels for progressive disclosure of complex settings with smooth spring easing.',
    importCode: `import { Accordion } from "@sam.barfield/field-react";`,
    usageCode: `<Accordion\n  items={[\n    { id: '1', title: 'Network Security', content: 'mTLS rules and VPC peering.' },\n    { id: '2', title: 'Telemetry Metrics', content: 'Prometheus scrapers and OpenTelemetry.' },\n  ]}\n/>`,
    compositionTree: `Accordion\n└── AccordionItem\n    ├── AccordionTrigger (Chevron rotation)\n    └── AccordionContent (Height transition)`,
    primaryDemo: {
      render: () => (
        <div style={{ width: '100%', maxWidth: '540px' }}>
          <Accordion
            items={[
              {
                id: '1',
                title: 'Mutual TLS & Zero-Trust Authentication',
                content: 'All ingress connections are inspected against the active enterprise Root CA with automated certificate renewal.',
              },
              {
                id: '2',
                title: 'High Availability Replica Distribution',
                content: 'Workload pods are scheduled across 3 availability zones with topology spread constraints guaranteeing zero downtime.',
              },
              {
                id: '3',
                title: 'Telemetry Sampling & Retention',
                content: 'Full traces are retained in deep carbon storage for 30 days, with 100% sampling for errors and 5% for successful calls.',
              },
            ]}
          />
        </div>
      ),
      code: `<Accordion\n  items={[\n    { id: '1', title: 'Mutual TLS', content: 'All ingress inspected...' },\n    { id: '2', title: 'High Availability', content: 'Pods scheduled...' },\n  ]}\n/>`,
    },
    props: [
      { name: 'items', type: 'Array<{ id: string, title: ReactNode, content: ReactNode }>', required: true, description: 'List of accordion panels' },
      { name: 'allowMultiple', type: 'boolean', default: 'false', description: 'Allows multiple sections to remain open simultaneously' },
    ],
  },

  // 25. TYPOGRAPHY
  {
    id: 'typography',
    name: 'Heading, Text, Kbd & Code',
    category: 'Typography',
    description: 'Standardized typographic hierarchy with tight tracking, muted secondary tones, and monospace keys.',
    importCode: `import { Heading, Text, Kbd, Code } from "@sam.barfield/field-react";`,
    usageCode: `<Heading level={2}>Production Clusters</Heading>\n<Text tone="secondary">Press <Kbd>⌘K</Kbd> to open the omnibar.</Text>`,
    compositionTree: `Typography\n├── Heading (H1-H6 levels)\n├── Text (sizes xs-lg, tones primary/secondary/tertiary)\n├── Kbd (Hardware keycap)\n└── Code (Monospace badge)`,
    primaryDemo: {
      render: () => (
        <Stack gap="16px" style={{ width: '100%', maxWidth: '540px' }}>
          <Heading level={2}>Field Typography Hierarchy</Heading>
          <Text size="base" tone="secondary">
            Engineered for data-dense dashboards with high contrast and optical character legibility.
          </Text>
          <Flex gap="8px" align="center">
            <Text size="sm">Quick command shortcut:</Text>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
            <Text size="sm">or use</Text>
            <Code>kubectl get pods</Code>
          </Flex>
        </Stack>
      ),
      code: `<Heading level={2}>Field Typography Hierarchy</Heading>\n<Text size="base" tone="secondary">Engineered for data-dense dashboards.</Text>\n<Kbd>⌘K</Kbd>\n<Code>kubectl get pods</Code>`,
    },
    props: [
      { name: 'level', type: '1 | 2 | 3 | 4 | 5 | 6', default: '2', description: 'Heading level' },
      { name: 'tone', type: "'primary' | 'secondary' | 'tertiary' | 'danger' | 'success'", default: "'primary'", description: 'Text color tone' },
    ],
  },

  // 26. UNFOLDING HEADING
  {
    id: 'unfolding-heading',
    name: 'UnfoldingHeading',
    category: 'Typography',
    description: 'Precision typographic wireframe heading that unfolds letter-by-letter in calligraphic stroke order with a trailing materialization wave that solidifies into styled typography.',
    importCode: `import { UnfoldingHeading } from "@sam.barfield/field-react";`,
    usageCode: `<UnfoldingHeading\n  as="h1"\n  size="hero"\n  text="WE CRAFT DIGITAL EXPERIENCES"\n  highlightWords={["CRAFT", "EXPERIENCES"]}\n  highlightColor="#2563eb"\n  intensity="subtle"\n  trigger="mount"\n/>`,
    compositionTree: `UnfoldingHeading\n├── Accessible Semantic Tag (Screen Reader & SEO)\n└── Dual-Layer Typographic Vector Cells\n    ├── Architectural Blueprint Wireframe (SVG Silhouette Dilation)\n    └── Solid Materialized Typography (Native Color Crossfade & Scale Settle)`,
    primaryDemo: {
      render: () => <UnfoldingHeadingInteractiveDemo />,
      code: `<UnfoldingHeading\n  as="h1"\n  size="xl"\n  text="WE CRAFT DIGITAL EXPERIENCES"\n  highlightWords={["CRAFT", "EXPERIENCES"]}\n  highlightColor="#2563eb"\n  intensity="subtle"\n  trigger="mount"\n/>`,
    },
    variants: [
      {
        id: 'unfold-mount',
        name: 'Mount Reveal (Hero Heading)',
        description: 'Unfolds automatically upon component mount with top-down calligraphic stroke order.',
        render: () => (
          <div style={{ padding: '24px', backgroundColor: 'var(--field-surface-sunken)', borderRadius: 'var(--field-radius-sm)' }}>
            <UnfoldingHeading as="h2" size="lg" text="MOUNT REVEAL" trigger="mount" />
          </div>
        ),
        code: `<UnfoldingHeading as="h2" size="lg" text="MOUNT REVEAL" trigger="mount" />`,
      },
      {
        id: 'unfold-highlight',
        name: 'Accent Word Highlighting',
        description: 'Highlights specific terms with native brand color crossfades and zero white color flash.',
        render: () => (
          <div style={{ padding: '24px', backgroundColor: 'var(--field-surface-sunken)', borderRadius: 'var(--field-radius-sm)' }}>
            <UnfoldingHeading as="h2" size="lg" text="PRECISION CRAFT" highlightWords={['CRAFT']} highlightColor="#2563eb" trigger="mount" />
          </div>
        ),
        code: `<UnfoldingHeading as="h2" size="lg" text="PRECISION CRAFT" highlightWords={["CRAFT"]} highlightColor="#2563eb" trigger="mount" />`,
      },
      {
        id: 'unfold-scroll',
        name: 'Scroll Triggered',
        description: 'Uses IntersectionObserver to trigger animation as the heading enters the viewport.',
        render: () => (
          <div style={{ padding: '24px', backgroundColor: 'var(--field-surface-sunken)', borderRadius: 'var(--field-radius-sm)' }}>
            <UnfoldingHeading as="h3" size="md" text="SCROLL REVEAL" trigger="scroll" />
          </div>
        ),
        code: `<UnfoldingHeading as="h3" size="md" text="SCROLL REVEAL" trigger="scroll" />`,
      },
    ],
    props: [
      { name: 'text', type: 'string', required: true, description: 'The text string to unfold' },
      { name: 'as', type: "'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'div'", default: "'h2'", description: 'Semantic heading tag level for DOM & screen readers' },
      { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl' | 'hero'", default: "'lg'", description: 'Typographic dimensions' },
      { name: 'variant', type: "'faceted' | 'modular'", default: "'faceted'", description: 'Optional / Deprecated: The component now uses a unified calligraphic facet drafting architecture.' },
      { name: 'trigger', type: "'mount' | 'scroll' | 'manual'", default: "'mount'", description: 'Animation trigger mode' },
      { name: 'intensity', type: "'subtle' | 'medium' | 'vibrant'", default: "'subtle'", description: 'Wireframe prominence: subtle (muted ghosted hairline), medium, or vibrant (neon HUD)' },
      { name: 'wireframeOpacity', type: 'number', description: 'Direct numeric override for wireframe stroke opacity (0.0 to 1.0)' },
      { name: 'speed', type: "'fast' | 'normal' | 'slow' | 'cinematic' | number", default: "'normal'", description: 'Animation speed preset or custom ms per facet step' },
      { name: 'triangleSpeedMs', type: 'number', default: '28', description: 'Milliseconds per facet step draw (overrides speed preset)' },
      { name: 'leadLetterLag', type: 'number', default: '2', description: 'Number of letters the wireframe leads ahead before trailing letters materialize' },
      { name: 'wireframeColor', type: 'string', default: "'#00d2ff'", description: 'Wireframe hairline and interior wash color' },
      { name: 'fillColor', type: 'string', default: "'var(--field-text-primary)'", description: 'Solid fill color for standard words' },
      { name: 'highlightWords', type: 'string[]', default: '[]', description: 'Array of words to render in highlight accent color' },
      { name: 'highlightColor', type: 'string', default: "'#2563eb'", description: 'Color for highlighted words' },
      { name: 'once', type: 'boolean', default: 'true', description: 'Whether the unfold animation plays once' },
      { name: 'isUnfolded', type: 'boolean', description: 'Manual unfold trigger control (when trigger="manual")' },
      { name: 'onComplete', type: '() => void', description: 'Callback fired when the entire heading animation finishes' },
    ],
    usefulNotes: [
      'Renders the exact typography of the design system: zero box seam overlap, using unified SVG dilation filters.',
      'Top-down calligraphic stroke order: letters like W, M, N, A unfold in their natural stroke directions.',
      'Dual-layer coordinated crossfade: solid text fades in natively with zero white color flash, while wireframes dissolve seamlessly.',
      'Adjustable wireframe prominence: subtle mode delivers an understated architectural drafting watermark without neon glare.',
      'Zero resting CPU/GPU overhead: unmounts animated layers upon completion and renders pure static semantic typography.',
      'Built-in accessibility: hidden accessible heading tag ensures 100% screen reader compatibility and copy-paste support.',
    ],
  },
];
