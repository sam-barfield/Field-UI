import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Button,
  TextInput,
  Select,
  Switch,
  StatCard,
  Badge,
  Table,
  Heading,
  Text,
  Flex,
  Stack,
  Grid,
  Divider,
  useToast,
  Alert,
  Terminal,
  TerminalHeader,
  TerminalBody,
  TerminalLine,
  TerminalPrompt,
  LogLine,
} from '@field/react';
import {
  Server,
  ShieldCheck,
  RefreshCw,
  Plus,
  Terminal as TerminalIcon,
  Play,
  Pause,
  Activity,
  Cpu,
  Radio,
  AlertTriangle,
} from 'lucide-react';

const INITIAL_LOGS: LogLine[] = [
  { id: '1', timestamp: '14:20:01.102', level: 'info', content: 'Connecting to cluster control plane wss://control.field.internal:8443...' },
  { id: '2', timestamp: '14:20:01.320', level: 'success', content: 'Authenticated session (mTLS v1.3: ECDHE-RSA-AES256-GCM-SHA384).' },
  { id: '3', timestamp: '14:20:01.325', level: 'info', content: 'Topology sync complete: 4 regions, 24 worker nodes, 118 active pods.' },
  { id: '4', timestamp: '14:20:02.040', level: 'cmd', content: '$ kubectl get nodes -o wide --watch' },
  { id: '5', timestamp: '14:20:02.150', level: 'info', content: 'edge-gateway-us-01    Ready    control-plane,master   18d   v1.29.2   10.240.0.12' },
  { id: '6', timestamp: '14:20:02.152', level: 'info', content: 'edge-gateway-us-02    Ready    worker                 18d   v1.29.2   10.240.0.13' },
  { id: '7', timestamp: '14:20:02.154', level: 'info', content: 'core-router-eu-01     Ready    worker                 14d   v1.29.2   10.240.1.44' },
  { id: '8', timestamp: '14:20:02.158', level: 'warn', content: 'db-replica-ap-02      Ready    worker                 9d    v1.29.2   10.240.2.89   (P99 latency elevated +14ms)' },
  { id: '9', timestamp: '14:20:03.410', level: 'info', content: 'Ingress traffic router dispatched 38,780 req/s across 32 proxies.' },
  { id: '10', timestamp: '14:20:04.100', level: 'success', content: 'Telemetry collector stream initialized. Cloud Shell prompt active.' },
];

export const RealWorldDemos: React.FC = () => {
  const { showToast } = useToast();
  const [activeView, setActiveView] = useState<'dashboard' | 'settings' | 'terminal'>('terminal');

  // Dashboard filter state
  const [regionFilter, setRegionFilter] = useState('all');
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [strictTls, setStrictTls] = useState(true);

  // Terminal & Live Shell State
  const [logs, setLogs] = useState<LogLine[]>(INITIAL_LOGS);
  const [isStreaming, setIsStreaming] = useState(true);
  const autoScroll = true;
  const [logFilter, setLogFilter] = useState<'all' | 'errors' | 'warns' | 'cmds'>('all');
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  const clusterNodes = [
    { id: 'node-us-east-1', region: 'us-east', role: 'Ingress Proxy', qps: '14,280', health: 'Operational' },
    { id: 'node-us-east-2', region: 'us-east', role: 'Database Primary', qps: '8,410', health: 'Operational' },
    { id: 'node-eu-west-1', region: 'eu-west', role: 'Worker Queue', qps: '3,190', health: 'Operational' },
    { id: 'node-ap-east-1', region: 'ap-east', role: 'Edge Cache', qps: '12,900', health: 'Degraded' },
  ];

  const filteredNodes =
    regionFilter === 'all'
      ? clusterNodes
      : clusterNodes.filter(n => n.region === regionFilter);

  // Simulated live log streaming
  useEffect(() => {
    if (!isStreaming) return;

    const streamInterval = setInterval(() => {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(Math.floor(now.getMilliseconds())).padStart(3, '0')}`;

      const sampleEvents: Array<{ level: LogLine['level']; content: string }> = [
        { level: 'info', content: `HTTP 200 GET /api/v2/telemetry [duration: ${(Math.random() * 8 + 2).toFixed(1)}ms, client: us-east-gateway]` },
        { level: 'info', content: `Ingress rate-limiter: pass (bucket quota: 98% remaining)` },
        { level: 'debug', content: `Heartbeat beacon received from edge-router-eu-${Math.floor(Math.random() * 4 + 1)}` },
        { level: 'info', content: `Auto-scaler: replica pool healthy (${110 + Math.floor(Math.random() * 12)}/120 pods)` },
        { level: 'success', content: `TLS handshake completed with origin cluster (cipher: TLS_AES_128_GCM_SHA256)` },
      ];

      const chosen = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
      setLogs(prev => [
        ...prev.slice(-150), // keep latest 150 lines
        {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: timeStr,
          level: chosen.level,
          content: chosen.content,
        },
      ]);
    }, 2800);

    return () => clearInterval(streamInterval);
  }, [isStreaming]);

  // Command execution handler for TerminalPrompt
  const handleCommand = (cmd: string) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(Math.floor(now.getMilliseconds())).padStart(3, '0')}`;

    const newLogs: LogLine[] = [
      {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: timeStr,
        level: 'cmd',
        content: `$ ${cmd}`,
      },
    ];

    const cleanCmd = cmd.trim().toLowerCase();

    if (cleanCmd === 'help') {
      newLogs.push(
        { id: Math.random().toString(36).substring(2, 9), timestamp: timeStr, level: 'info', content: 'FIELD CLOUD SHELL v1.4.0 — SUPPORTED COMMANDS:' },
        { id: Math.random().toString(36).substring(2, 9), timestamp: timeStr, level: 'info', content: '  nodes          List all active cluster nodes and health status' },
        { id: Math.random().toString(36).substring(2, 9), timestamp: timeStr, level: 'info', content: '  pods           Display running container workloads and restart counts' },
        { id: Math.random().toString(36).substring(2, 9), timestamp: timeStr, level: 'info', content: '  status         Print system health, latency, and memory saturation' },
        { id: Math.random().toString(36).substring(2, 9), timestamp: timeStr, level: 'info', content: '  deploy <rev>   Execute a rolling zero-downtime canary deployment' },
        { id: Math.random().toString(36).substring(2, 9), timestamp: timeStr, level: 'info', content: '  rotate-keys    Rotate mTLS certificates across all gateways' },
        { id: Math.random().toString(36).substring(2, 9), timestamp: timeStr, level: 'info', content: '  clear          Clear the terminal scrollback buffer' }
      );
    } else if (cleanCmd === 'nodes') {
      newLogs.push(
        { id: Math.random().toString(36).substring(2, 9), timestamp: timeStr, level: 'info', content: 'NAME                    STATUS    ROLES             CPU%    MEM%    VERSION' },
        { id: Math.random().toString(36).substring(2, 9), timestamp: timeStr, level: 'success', content: 'edge-gateway-us-01      Ready     control-plane     14.2%   32.1%   v1.29.2' },
        { id: Math.random().toString(36).substring(2, 9), timestamp: timeStr, level: 'success', content: 'edge-gateway-us-02      Ready     worker            22.8%   44.6%   v1.29.2' },
        { id: Math.random().toString(36).substring(2, 9), timestamp: timeStr, level: 'success', content: 'core-router-eu-01       Ready     worker            18.4%   38.0%   v1.29.2' },
        { id: Math.random().toString(36).substring(2, 9), timestamp: timeStr, level: 'warn', content: 'db-replica-ap-02        Degraded  worker (lag 14s)  81.3%   79.4%   v1.29.2' }
      );
    } else if (cleanCmd === 'pods') {
      newLogs.push(
        { id: Math.random().toString(36).substring(2, 9), timestamp: timeStr, level: 'info', content: 'NAMESPACE      NAME                              READY   STATUS    RESTARTS   AGE' },
        { id: Math.random().toString(36).substring(2, 9), timestamp: timeStr, level: 'success', content: 'production     api-gateway-7b8f98d4-54m8c        2/2     Running   0          18d' },
        { id: Math.random().toString(36).substring(2, 9), timestamp: timeStr, level: 'success', content: 'production     telemetry-daemon-9f1c76a-xk299    1/1     Running   0          18d' },
        { id: Math.random().toString(36).substring(2, 9), timestamp: timeStr, level: 'success', content: 'production     auth-vault-669cbb8-q98lm          1/1     Running   0          18d' },
        { id: Math.random().toString(36).substring(2, 9), timestamp: timeStr, level: 'success', content: 'monitoring     grafana-core-57c4f4b9-8n7zp       1/1     Running   0          14d' }
      );
    } else if (cleanCmd === 'status') {
      newLogs.push(
        { id: Math.random().toString(36).substring(2, 9), timestamp: timeStr, level: 'success', content: 'SYSTEM STATUS: 99.98% OPERATIONAL' },
        { id: Math.random().toString(36).substring(2, 9), timestamp: timeStr, level: 'info', content: '  Ingress QPS: 38,780 req/s | P99 Latency: 11.2ms | Edge Hit Ratio: 94.2%' },
        { id: Math.random().toString(36).substring(2, 9), timestamp: timeStr, level: 'info', content: '  Active Zones: us-east (OK), us-west (OK), eu-west (OK), ap-east (Degraded)' }
      );
    } else if (cleanCmd.startsWith('deploy')) {
      const target = cleanCmd.split(' ')[1] || 'v2.1.0';
      newLogs.push(
        { id: Math.random().toString(36).substring(2, 9), timestamp: timeStr, level: 'info', content: `Initiating rolling canary deployment for ${target}...` },
        { id: Math.random().toString(36).substring(2, 9), timestamp: timeStr, level: 'info', content: `[1/3] Spinning up canary pod pool (10% traffic weight)...` },
        { id: Math.random().toString(36).substring(2, 9), timestamp: timeStr, level: 'success', content: `[2/3] Canary health probes passing: 0% error rate, P99 = 9.8ms.` },
        { id: Math.random().toString(36).substring(2, 9), timestamp: timeStr, level: 'success', content: `[3/3] Promoted ${target} to 100% traffic. Zero dropped packets.` }
      );
      showToast({ title: 'Deployment Complete', description: `Successfully deployed ${target} across cluster.`, variant: 'success' });
    } else if (cleanCmd === 'rotate-keys') {
      newLogs.push(
        { id: Math.random().toString(36).substring(2, 9), timestamp: timeStr, level: 'info', content: 'Generating new 4096-bit RSA certificate authority...' },
        { id: Math.random().toString(36).substring(2, 9), timestamp: timeStr, level: 'info', content: 'Pushing signed client certs to 24 cluster nodes...' },
        { id: Math.random().toString(36).substring(2, 9), timestamp: timeStr, level: 'success', content: 'Key rotation complete. All mTLS connections re-negotiated seamlessly.' }
      );
      showToast({ title: 'Keys Rotated', description: 'mTLS certificates successfully refreshed.', variant: 'success' });
    } else if (cleanCmd === 'clear') {
      setLogs([]);
      return;
    } else {
      newLogs.push({
        id: Math.random().toString(36).substring(2, 9),
        timestamp: timeStr,
        level: 'error',
        content: `field-shell: command not found: ${cmd}. Type "help" for a list of available commands.`,
      });
    }

    setLogs(prev => [...prev, ...newLogs]);
  };

  // Quick incident triggers for the demo toolbar
  const triggerIncident = (type: 'memory' | 'failover' | 'certs') => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(Math.floor(now.getMilliseconds())).padStart(3, '0')}`;

    if (type === 'memory') {
      setLogs(prev => [
        ...prev,
        { id: Math.random().toString(36).substring(2, 9), timestamp: timeStr, level: 'warn', content: 'ALERT: Memory saturation exceeded 85% on node [db-replica-ap-02].' },
        { id: Math.random().toString(36).substring(2, 9), timestamp: timeStr, level: 'info', content: 'Auto-scaler: Triggering horizontal pod autoscaling (+4 replicas).' },
        { id: Math.random().toString(36).substring(2, 9), timestamp: timeStr, level: 'success', content: 'Workload rebalanced. Saturation normalized to 48.2%.' },
      ]);
      showToast({ title: 'Incident Simulated', description: 'Injected memory spike and verified HPA auto-scale.', variant: 'warning' });
    } else if (type === 'failover') {
      setLogs(prev => [
        ...prev,
        { id: Math.random().toString(36).substring(2, 9), timestamp: timeStr, level: 'error', content: 'CRITICAL: Edge gateway us-01 unreachable (heartbeat timeout: 3000ms).' },
        { id: Math.random().toString(36).substring(2, 9), timestamp: timeStr, level: 'info', content: 'DNS Health Controller: Rerouting ingress traffic to edge-gateway-us-02.' },
        { id: Math.random().toString(36).substring(2, 9), timestamp: timeStr, level: 'success', content: 'Failover complete in 142ms. 0 dropped TCP connections.' },
      ]);
      showToast({ title: 'Failover Triggered', description: 'Simulated node outage and automated DNS failover.', variant: 'danger' });
    } else if (type === 'certs') {
      handleCommand('rotate-keys');
    }
  };

  // Filter logs for display
  const displayedLogs = logs.filter(l => {
    if (logFilter === 'errors') return l.level === 'error';
    if (logFilter === 'warns') return l.level === 'warn';
    if (logFilter === 'cmds') return l.level === 'cmd';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* View Switcher Sub-nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            size="sm"
            variant={activeView === 'terminal' ? 'primary' : 'secondary'}
            leftIcon={<TerminalIcon size={14} />}
            onClick={() => setActiveView('terminal')}
          >
            Cloud Shell & Live Terminal
          </Button>
          <Button
            size="sm"
            variant={activeView === 'dashboard' ? 'primary' : 'secondary'}
            leftIcon={<Activity size={14} />}
            onClick={() => setActiveView('dashboard')}
          >
            Telemetry & Fleet Ops
          </Button>
          <Button
            size="sm"
            variant={activeView === 'settings' ? 'primary' : 'secondary'}
            leftIcon={<ShieldCheck size={14} />}
            onClick={() => setActiveView('settings')}
          >
            Security & Access Policy
          </Button>
        </div>

        <Badge variant={isStreaming ? 'success' : 'default'} dot>
          {isStreaming ? 'Telemetry Stream Active' : 'Stream Paused'}
        </Badge>
      </div>

      {/* --- 1. TERMINAL & CLOUD SHELL COMPOSITE --- */}
      {activeView === 'terminal' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Operational Status Bar */}
          <Grid columns="repeat(auto-fit, minmax(220px, 1fr))" gap="14px">
            <StatCard
              label="STREAM VELOCITY"
              value={isStreaming ? '28 msgs/sec' : '0 msgs/sec'}
              delta={{ value: isStreaming ? 'Live' : 'Paused', trend: isStreaming ? 'up' : 'neutral' }}
              icon={<Radio size={16} />}
              subtitle="WebSocket stream wss://telemetry.field"
            />
            <StatCard
              label="ACTIVE CLUSTER NODES"
              value="24 / 24 Online"
              delta={{ value: '100% Quorum', trend: 'up' }}
              icon={<Server size={16} />}
              subtitle="Multi-zone redundancy active"
            />
            <StatCard
              label="TOTAL LOG EVENTS"
              value={`${logs.length} Lines`}
              delta={{ value: `${logs.filter(l => l.level === 'error').length} Errors`, trend: logs.filter(l => l.level === 'error').length > 0 ? 'down' : 'neutral' }}
              icon={<Activity size={16} />}
              subtitle="Circular memory buffer"
            />
          </Grid>

          {/* Quick Incident Simulation Toolbar */}
          <Card>
            <CardContent>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Text size="xs" tone="secondary" style={{ fontWeight: 600, letterSpacing: '0.04em' }}>SIMULATE INCIDENTS:</Text>
                  <Button size="sm" variant="outline" leftIcon={<Cpu size={13} />} onClick={() => triggerIncident('memory')}>
                    Memory Saturation
                  </Button>
                  <Button size="sm" variant="danger" leftIcon={<AlertTriangle size={13} />} onClick={() => triggerIncident('failover')}>
                    Node Outage & Failover
                  </Button>
                  <Button size="sm" variant="outline" leftIcon={<ShieldCheck size={13} />} onClick={() => triggerIncident('certs')}>
                    Rotate mTLS Keys
                  </Button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Button
                    size="sm"
                    variant={isStreaming ? 'secondary' : 'primary'}
                    leftIcon={isStreaming ? <Pause size={13} /> : <Play size={13} />}
                    onClick={() => setIsStreaming(!isStreaming)}
                  >
                    {isStreaming ? 'Pause Stream' : 'Resume Stream'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Full-Scale Terminal Component */}
          <Terminal height="500px">
            <TerminalHeader
              title="cloud-shell • admin@field-us-east-1"
              subtitle="zsh • session-8821"
              onClear={() => setLogs([])}
              onCopyAll={() => {
                const text = logs.map(l => `[${l.timestamp}] [${l.level?.toUpperCase()}] ${l.content}`).join('\n');
                navigator.clipboard.writeText(text);
                showToast({ title: 'Logs Copied', description: `Copied ${logs.length} log lines to clipboard.`, variant: 'success' });
              }}
              onScrollToBottom={() => {
                if (terminalBodyRef.current) {
                  terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
                }
              }}
            >
              {/* Log Level Filter Controls inside Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginRight: '6px' }}>
                <Button
                  size="sm"
                  variant={logFilter === 'all' ? 'primary' : 'ghost'}
                  style={{ height: '24px', fontSize: '0.6875rem', padding: '0 8px' }}
                  onClick={() => setLogFilter('all')}
                >
                  All ({logs.length})
                </Button>
                <Button
                  size="sm"
                  variant={logFilter === 'errors' ? 'danger' : 'ghost'}
                  style={{ height: '24px', fontSize: '0.6875rem', padding: '0 8px' }}
                  onClick={() => setLogFilter('errors')}
                >
                  Errors ({logs.filter(l => l.level === 'error').length})
                </Button>
                <Button
                  size="sm"
                  variant={logFilter === 'warns' ? 'secondary' : 'ghost'}
                  style={{ height: '24px', fontSize: '0.6875rem', padding: '0 8px' }}
                  onClick={() => setLogFilter('warns')}
                >
                  Warns ({logs.filter(l => l.level === 'warn').length})
                </Button>
              </div>
            </TerminalHeader>

            <TerminalBody ref={terminalBodyRef} autoScroll={autoScroll}>
              {displayedLogs.map(log => (
                <TerminalLine
                  key={log.id}
                  timestamp={log.timestamp}
                  level={log.level}
                >
                  {log.content}
                </TerminalLine>
              ))}
            </TerminalBody>

            <TerminalPrompt
              user="admin@field"
              path="~/cluster"
              onSubmit={handleCommand}
              placeholder="Try: help, nodes, pods, status, deploy v2.2, rotate-keys, clear..."
            />
          </Terminal>

          {/* Cheatsheet & Context Cards */}
          <Grid columns="repeat(auto-fit, minmax(320px, 1fr))" gap="16px">
            <Card>
              <CardHeader>
                <Heading level={4}>Interactive Shell Commands</Heading>
                <Text size="xs" tone="secondary">Type directly into the prompt above and press Enter</Text>
              </CardHeader>
              <CardContent>
                <Stack gap="10px">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <code style={{ fontSize: '0.75rem', color: 'var(--field-accent-primary)' }}>help</code>
                    <Text size="xs" tone="secondary">Display full CLI syntax reference</Text>
                  </div>
                  <Divider />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <code style={{ fontSize: '0.75rem', color: 'var(--field-accent-primary)' }}>nodes</code>
                    <Text size="xs" tone="secondary">Print live node table with CPU/Memory saturation</Text>
                  </div>
                  <Divider />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <code style={{ fontSize: '0.75rem', color: 'var(--field-accent-primary)' }}>deploy &lt;version&gt;</code>
                    <Text size="xs" tone="secondary">Simulate canary deployment rollout</Text>
                  </div>
                  <Divider />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <code style={{ fontSize: '0.75rem', color: 'var(--field-accent-primary)' }}>rotate-keys</code>
                    <Text size="xs" tone="secondary">Re-issue mTLS certificate authority</Text>
                  </div>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Heading level={4}>Stream Security & Telemetry Specs</Heading>
                <Text size="xs" tone="secondary">WAI-ARIA accessible terminal stream properties</Text>
              </CardHeader>
              <CardContent>
                <Stack gap="10px">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text size="xs" tone="secondary">Transport Protocol</Text>
                    <Badge variant="accent">WSS (TLS 1.3)</Badge>
                  </div>
                  <Divider />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text size="xs" tone="secondary">Color Space</Text>
                    <Text size="xs" style={{ fontWeight: 600 }}>Field Semantic Contrast</Text>
                  </div>
                  <Divider />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text size="xs" tone="secondary">Line Buffer Limit</Text>
                    <Text size="xs" style={{ fontWeight: 600 }}>150 lines circular buffer</Text>
                  </div>
                  <Divider />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text size="xs" tone="secondary">Command History</Text>
                    <Text size="xs" style={{ fontWeight: 600 }}>Up / Down arrow cycling enabled</Text>
                  </div>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </div>
      )}

      {/* --- 2. TELEMETRY & FLEET OPS VIEW --- */}
      {activeView === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Banner KPI */}
          <Grid columns="repeat(auto-fit, minmax(240px, 1fr))" gap="16px">
            <StatCard
              label="TOTAL REQUEST RATE"
              value="38,780 req/s"
              delta={{ value: '+8.4%', trend: 'up' }}
              icon={<Server size={18} />}
              subtitle="Aggregated across 4 geographic regions"
            />
            <StatCard
              label="P99 RESPONSE DURATION"
              value="11.2 ms"
              delta={{ value: '-2.4 ms', trend: 'up' }}
              subtitle="Edge cache hit ratio 94.2%"
            />
            <StatCard
              label="SECURITY COMPLIANCE"
              value="100%"
              delta={{ value: 'SOC2 / ISO', trend: 'neutral' }}
              icon={<ShieldCheck size={18} />}
              subtitle="Zero active vulnerabilities"
            />
          </Grid>

          {/* Main Cluster Management Table */}
          <Card>
            <CardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <Heading level={3}>Active Cluster Infrastructure</Heading>
                  <Text tone="secondary" size="xs">Real-time health telemetry and worker capacity</Text>
                </div>
                <Flex gap="10px" align="center">
                  <Select
                    value={regionFilter}
                    onChange={setRegionFilter}
                    options={[
                      { value: 'all', label: 'All Regions (Global)' },
                      { value: 'us-east', label: 'US East' },
                      { value: 'eu-west', label: 'EU West' },
                      { value: 'ap-east', label: 'AP East' },
                    ]}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<RefreshCw size={13} />}
                    onClick={() => {
                      showToast({
                        title: 'Telemetry Refreshed',
                        description: 'Node states synchronized with origin cluster.',
                        variant: 'success',
                      });
                    }}
                  >
                    Sync
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    leftIcon={<Plus size={13} />}
                    onClick={() => {
                      showToast({
                        title: 'Node Provisioning',
                        description: 'Spinning up new edge node in us-east-1...',
                        variant: 'info',
                      });
                    }}
                  >
                    Deploy Node
                  </Button>
                </Flex>
              </div>
            </CardHeader>
            <CardContent>
              <Table
                keyExtractor={(item) => item.id}
                data={filteredNodes}
                columns={[
                  { key: 'id', header: 'Node Identifier' },
                  {
                    key: 'region',
                    header: 'Region',
                    render: (item) => <Badge variant="default">{item.region.toUpperCase()}</Badge>,
                  },
                  { key: 'role', header: 'Role' },
                  { key: 'qps', header: 'Throughput' },
                  {
                    key: 'health',
                    header: 'Health Status',
                    render: (item) => (
                      <Badge
                        variant={item.health === 'Operational' ? 'success' : 'warning'}
                        dot
                      >
                        {item.health}
                      </Badge>
                    ),
                  },
                ]}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* --- 3. SECURITY & ACCESS POLICY VIEW --- */}
      {activeView === 'settings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Alert variant="info" title="Zero Trust Network Policy">
            All ingress nodes strictly authenticate traffic using mutual TLS with short-lived client certificates.
          </Alert>

          <Card>
            <CardHeader>
              <Heading level={3}>Access & Gateway Security Policies</Heading>
              <Text tone="secondary" size="xs">Configure authentication standards across control plane proxies</Text>
            </CardHeader>
            <CardContent>
              <Stack gap="24px">
                <Switch
                  checked={mfaEnabled}
                  onChange={setMfaEnabled}
                  label="Enforce Multi-Factor Authentication (WebAuthn / FIDO2)"
                  description="Hardware security keys required for all cluster administrator sessions"
                />
                <Divider />
                <Switch
                  checked={strictTls}
                  onChange={setStrictTls}
                  label="Strict TLS 1.3 Requirement"
                  description="Reject legacy TLS 1.2 handshakes and enforce forward secrecy cipher suites"
                />
                <Divider />
                <div>
                  <Text size="sm" tone="primary" style={{ fontWeight: 600, marginBottom: '8px' }}>
                    Control Plane IP Allowlist (CIDR Format)
                  </Text>
                  <TextInput defaultValue="10.240.0.0/16, 172.16.4.0/24" />
                </div>
                <Divider />
                <div>
                  <Text size="sm" tone="primary" style={{ fontWeight: 600, marginBottom: '4px' }}>
                    Emergency Session Revocation
                  </Text>
                  <Text size="xs" tone="secondary" style={{ marginBottom: '12px' }}>
                    Immediately invalidate all active tokens, draining active terminal sessions within 5 seconds.
                  </Text>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      showToast({
                        title: 'Keys Maintained',
                        description: 'Revocation simulation triggered safely.',
                        variant: 'warning',
                      });
                    }}
                  >
                    Revoke 12 Active Tokens
                  </Button>
                </div>
              </Stack>
            </CardContent>
            <CardFooter>
              <Flex justify="flex-end" gap="10px">
                <Button variant="ghost">Discard Changes</Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    showToast({
                      title: 'Settings Saved',
                      description: 'Security policies updated across all cluster nodes.',
                      variant: 'success',
                    });
                  }}
                >
                  Save Policy
                </Button>
              </Flex>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};
