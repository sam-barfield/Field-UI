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
} from '@field/react';
import {
  Search,
  Key,
  Shield,
  Send,
  Trash2,
  Settings,
  Bell,
  Terminal,
  Activity,
  Cpu,
  Database,
  Layers,
} from 'lucide-react';

export const StickerSheet: React.FC = () => {
  const { showToast } = useToast();

  // Component demo state
  const [segmentedVal, setSegmentedVal] = useState('metrics');
  const [textInputVal, setTextInputVal] = useState('field_alpha_node_01');
  const [selectVal, setSelectVal] = useState('prod');
  const [switchVal, setSwitchVal] = useState(true);
  const [checkboxVal, setCheckboxVal] = useState(true);
  const [radioVal, setRadioVal] = useState('dedicated');
  const [sliderVal, setSliderVal] = useState(65);
  const [activeTab, setActiveTab] = useState('tab1');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
          <Heading level={2} style={{ marginTop: '8px' }}>Buttons & Controls</Heading>
          <Text tone="secondary" size="sm">Tactile micro-highlights, crisp hover responses, and keyboard focus outlines.</Text>
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
              <Text tone="secondary" size="xs">Scale consistency across devices</Text>
            </CardHeader>
            <CardContent>
              <Flex gap="10px" align="center" wrap="wrap">
                <Button size="sm" variant="primary">Small (30px)</Button>
                <Button size="md" variant="primary">Medium (38px)</Button>
                <Button size="lg" variant="primary">Large (46px)</Button>
                <Button size="md" variant="secondary" isLoading>Loading</Button>
                <Button size="md" variant="secondary" disabled>Disabled</Button>
              </Flex>
            </CardContent>
          </Card>

          {/* Icon Buttons & Groups */}
          <Card>
            <CardHeader>
              <Heading level={4}>Icon Buttons & Segmented</Heading>
              <Text tone="secondary" size="xs">Compact controls and tabbed switchers</Text>
            </CardHeader>
            <CardContent>
              <Stack gap="16px">
                <Flex gap="10px" align="center">
                  <IconButton icon={<Bell size={16} />} aria-label="Notifications" variant="secondary" />
                  <IconButton icon={<Settings size={16} />} aria-label="Settings" variant="outline" />
                  <IconButton icon={<Shield size={16} />} aria-label="Security" variant="primary" />
                  <ButtonGroup>
                    <Button size="sm" variant="secondary">Day</Button>
                    <Button size="sm" variant="secondary">Week</Button>
                    <Button size="sm" variant="secondary">Month</Button>
                  </ButtonGroup>
                </Flex>

                <SegmentedControl
                  value={segmentedVal}
                  onChange={setSegmentedVal}
                  options={[
                    { value: 'metrics', label: 'Telemetry' },
                    { value: 'logs', label: 'Raw Logs' },
                    { value: 'traces', label: 'Distributed Traces' },
                  ]}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </section>

      {/* 2. FORM INPUTS */}
      <section>
        <div style={{ marginBottom: '16px' }}>
          <Badge variant="accent">02 // DATA ENTRY</Badge>
          <Heading level={2} style={{ marginTop: '8px' }}>Forms & Precision Inputs</Heading>
          <Text tone="secondary" size="sm">Recessed sunken surfaces with micro-glow focus states and WAI-ARIA validation.</Text>
        </div>

        <Grid columns="repeat(auto-fit, minmax(340px, 1fr))" gap="20px">
          {/* Text Inputs */}
          <Card>
            <CardHeader>
              <Heading level={4}>Text Inputs & Adornments</Heading>
            </CardHeader>
            <CardContent>
              <Stack gap="14px">
                <TextInput
                  label="Node Identifier"
                  value={textInputVal}
                  onChange={e => setTextInputVal(e.target.value)}
                  leftAdornment={<Terminal size={14} />}
                  helperText="Unique hardware tag in cluster topology"
                />
                <TextInput
                  label="Search Workspace"
                  placeholder="Filter resources by name, tag, or region..."
                  leftAdornment={<Search size={14} />}
                />
                <TextInput
                  label="Service Token"
                  type="password"
                  defaultValue="sk_live_9481948291048"
                  leftAdornment={<Key size={14} />}
                  error="Token requires renewal within 48 hours"
                />
              </Stack>
            </CardContent>
          </Card>

          {/* Select & TextArea */}
          <Card>
            <CardHeader>
              <Heading level={4}>Dropdown Select & Textarea</Heading>
            </CardHeader>
            <CardContent>
              <Stack gap="14px">
                <Select
                  label="Target Deployment Cluster"
                  value={selectVal}
                  onChange={setSelectVal}
                  options={[
                    { value: 'dev', label: 'Development (us-east-1a)' },
                    { value: 'staging', label: 'Staging Canary (eu-west-1)' },
                    { value: 'prod', label: 'Production High-Availability (Global)' },
                  ]}
                />
                <TextArea
                  label="Deployment Notes"
                  placeholder="Summarize changes, pull request links, or rollout verification steps..."
                  rows={3}
                />
              </Stack>
            </CardContent>
          </Card>

          {/* Controls: Switch, Checkbox, Radio, Slider */}
          <Card>
            <CardHeader>
              <Heading level={4}>Binary & Scalar Controls</Heading>
            </CardHeader>
            <CardContent>
              <Stack gap="18px">
                <Switch
                  label="Strict Encrypted Tunnel (TLS 1.3)"
                  description="Enforces mutual certificate authentication on all ingress ports"
                  checked={switchVal}
                  onChange={setSwitchVal}
                />
                <Checkbox
                  label="Enable automatic edge failover"
                  checked={checkboxVal}
                  onChange={setCheckboxVal}
                />
                <RadioGroup
                  label="Instance Provisioning Strategy"
                  value={radioVal}
                  onChange={setRadioVal}
                  options={[
                    { value: 'dedicated', label: 'Dedicated Metal', description: 'Zero noisy neighbor latency variance' },
                    { value: 'spot', label: 'Preemptible Spot', description: 'Cost optimized batch worker tier' },
                  ]}
                />
                <Slider
                  label="Compute Scaling Threshold"
                  value={sliderVal}
                  onChange={setSliderVal}
                  valueSuffix="%"
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </section>

      {/* 3. DATA DISPLAY & TELEMETRY */}
      <section>
        <div style={{ marginBottom: '16px' }}>
          <Badge variant="accent">03 // VISUALIZATION</Badge>
          <Heading level={2} style={{ marginTop: '8px' }}>Metrics & Data Display</Heading>
          <Text tone="secondary" size="sm">Tabular figures, trend delta badges, and structured data tables.</Text>
        </div>

        {/* KPI Stat Cards */}
        <Grid columns="repeat(auto-fit, minmax(240px, 1fr))" gap="16px" style={{ marginBottom: '20px' }}>
          <StatCard
            label="AGGREGATE THROUGHPUT"
            value="48.2 Gbps"
            delta={{ value: '+12.4%', trend: 'up' }}
            icon={<Activity size={18} />}
            subtitle="Global ingress over past 24h"
          />
          <StatCard
            label="P99 RESPONSE LATENCY"
            value="14.8 ms"
            delta={{ value: '-3.1 ms', trend: 'up' }}
            icon={<Cpu size={18} />}
            subtitle="Calculated over 4.2M samples"
          />
          <StatCard
            label="ACTIVE CLUSTER NODES"
            value="128 / 128"
            icon={<Database size={18} />}
            subtitle="100% operational capacity"
          />
          <StatCard
            label="ERROR BUDGET BURN"
            value="0.04%"
            delta={{ value: '+0.01%', trend: 'down' }}
            icon={<Layers size={18} />}
            subtitle="99.96% availability remaining"
          />
        </Grid>

        {/* Badges, Avatars, and Data Table */}
        <Grid columns="minmax(300px, 1fr) 2fr" gap="20px">
          <Card>
            <CardHeader>
              <Heading level={4}>Badges & Identity</Heading>
            </CardHeader>
            <CardContent>
              <Stack gap="16px">
                <Flex gap="8px" wrap="wrap">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="accent" dot>Active Accent</Badge>
                  <Badge variant="success" dot>Operational</Badge>
                  <Badge variant="warning" dot>Degraded</Badge>
                  <Badge variant="danger" dot>Outage</Badge>
                  <Badge variant="info">Telemetry</Badge>
                </Flex>

                <Divider />

                <Flex align="center" gap="16px">
                  <Avatar name="Alex Vance" size="sm" />
                  <Avatar name="Dr. Breen" size="md" />
                  <Avatar name="Gordon Freeman" size="lg" />
                  <AvatarGroup max={3}>
                    <Avatar name="Unit 01" />
                    <Avatar name="Unit 02" />
                    <Avatar name="Unit 03" />
                    <Avatar name="Unit 04" />
                    <Avatar name="Unit 05" />
                  </AvatarGroup>
                </Flex>

                <Divider />

                <div>
                  <Text size="xs" tone="secondary" style={{ marginBottom: '6px' }}>Keyboard Shortcuts</Text>
                  <Flex gap="6px">
                    <Kbd>⌘</Kbd>
                    <Kbd>K</Kbd>
                    <span style={{ margin: '0 4px', color: 'var(--field-text-secondary)' }}>or</span>
                    <Code>Ctrl + Shift + P</Code>
                  </Flex>
                </div>
              </Stack>
            </CardContent>
          </Card>

          {/* Data Table */}
          <Card>
            <CardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Heading level={4}>Infrastructure Fleet Status</Heading>
                  <Text tone="secondary" size="xs">Live node status telemetry</Text>
                </div>
                <Button size="sm" variant="outline">Export CSV</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table
                columns={[
                  { key: 'id', header: 'Node ID', render: r => <span style={{ fontFamily: 'var(--field-font-mono)' }}>{r.id}</span> },
                  { key: 'name', header: 'Cluster Name', render: r => <strong>{r.name}</strong> },
                  {
                    key: 'status',
                    header: 'Health',
                    render: r => (
                      <Badge variant={r.status === 'Optimal' ? 'success' : 'warning'} dot>
                        {r.status}
                      </Badge>
                    ),
                  },
                  { key: 'latency', header: 'RTT Latency', render: r => <span style={{ fontFamily: 'var(--field-font-mono)' }}>{r.latency}</span> },
                  { key: 'cpu', header: 'CPU Load', render: r => <span style={{ fontFamily: 'var(--field-font-mono)' }}>{r.cpu}</span> },
                ]}
                data={sampleTableData}
                keyExtractor={r => r.id}
              />
            </CardContent>
          </Card>
        </Grid>
      </section>

      {/* 4. FEEDBACK, ALERTS, & OVERLAYS */}
      <section>
        <div style={{ marginBottom: '16px' }}>
          <Badge variant="accent">04 // SYSTEM FEEDBACK & OVERLAYS</Badge>
          <Heading level={2} style={{ marginTop: '8px' }}>Feedback, Modals & Drawers</Heading>
          <Text tone="secondary" size="sm">Accessible overlays with focus trapping, backdrop blurs, and animated banners.</Text>
        </div>

        <Grid columns="repeat(auto-fit, minmax(320px, 1fr))" gap="20px">
          {/* Alerts */}
          <Card>
            <CardHeader>
              <Heading level={4}>System Alerts & Callouts</Heading>
            </CardHeader>
            <CardContent>
              <Stack gap="12px">
                <Alert variant="info" title="System Maintenance">
                  Scheduled database migration in 2 hours. Read replicas remain active.
                </Alert>
                <Alert variant="success" title="Deploy Succeeded">
                  Version 3.4.1 has been propagated to all edge datacenters.
                </Alert>
                <Alert variant="warning" title="Memory Threshold">
                  Pod memory utilization exceeded 85% on node us-east-core.
                </Alert>
                <Alert variant="danger" title="Unauthorized Ingress">
                  Blocked 1,420 connection attempts matching known malicious IP block.
                </Alert>
              </Stack>
            </CardContent>
          </Card>

          {/* Overlays & Triggers */}
          <Card>
            <CardHeader>
              <Heading level={4}>Modals, Drawers & Toasts</Heading>
            </CardHeader>
            <CardContent>
              <Stack gap="16px">
                <Flex gap="10px" wrap="wrap">
                  <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                    Open Dialog Modal
                  </Button>
                  <Button variant="outline" onClick={() => setIsDrawerOpen(true)}>
                    Open Slide Drawer
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      showToast({
                        title: 'Telemetry Synced',
                        description: 'Updated 4,280 metrics from regional edge brokers.',
                        variant: 'success',
                      });
                    }}
                  >
                    Dispatch Toast Notification
                  </Button>
                </Flex>

                <Divider />

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <Tooltip content="Tooltip explains technical nuance on hover" position="top">
                    <Button size="sm" variant="ghost">Hover me for Tooltip</Button>
                  </Tooltip>
                  <Tooltip content="Secondary verification step" position="bottom">
                    <Badge variant="accent">Action Tooltip</Badge>
                  </Tooltip>
                </div>

                <Divider />

                <div>
                  <Text size="xs" tone="secondary" style={{ marginBottom: '8px' }}>Progress & Shimmer Skeletons</Text>
                  <Stack gap="10px">
                    <Progress value={68} label="Data Transfer" showValue />
                    <Flex gap="8px" align="center">
                      <Spinner size={16} />
                      <Skeleton width="120px" height="14px" />
                      <Skeleton width="60px" height="14px" />
                    </Flex>
                  </Stack>
                </div>
              </Stack>
            </CardContent>
          </Card>

          {/* Navigation & Tabs */}
          <Card>
            <CardHeader>
              <Heading level={4}>Navigation & Accordion</Heading>
            </CardHeader>
            <CardContent>
              <Stack gap="22px">
                <div>
                  <Text size="xs" tone="secondary" style={{ marginBottom: '8px' }}>Breadcrumb Hierarchy</Text>
                  <Breadcrumb
                    items={[
                      { label: 'Cluster Fleet', href: '#' },
                      { label: 'North America', href: '#' },
                      { label: 'us-east-1a (Active)', isCurrent: true },
                    ]}
                  />
                </div>

                <div>
                  <Text size="xs" tone="secondary" style={{ marginBottom: '8px' }}>Underline Navigation Tabs</Text>
                  <Tabs
                    activeId={activeTab}
                    onChange={setActiveTab}
                    items={[
                      { id: 'tab1', label: 'Cluster Config' },
                      { id: 'tab2', label: 'Security Firewall' },
                      { id: 'tab3', label: 'Audit Log' },
                    ]}
                  />
                </div>

                <div>
                  <Text size="xs" tone="secondary" style={{ marginBottom: '8px' }}>Collapsible Accordion</Text>
                  <Accordion
                    defaultOpenIds={['acc1']}
                    items={[
                      {
                        id: 'acc1',
                        title: 'How does token inheritance work in Field?',
                        content:
                          'Field uses a 3-tier token structure: Primitives (raw colors/scales) feed into Semantics (theme-reactive roles), which components consume via CSS variables. Zero hardcoded styles.',
                      },
                      {
                        id: 'acc2',
                        title: 'Is keyboard navigation fully supported?',
                        content:
                          'Yes. Modals and drawers feature focus traps and Escape dismissal. Dropdowns and tabs support Arrow key roving focus.',
                      },
                    ]}
                  />
                </div>
              </Stack>
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
          <TextInput label="Deployment Tag" defaultValue="v3.8.0-rc4" />
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
    </div>
  );
};
