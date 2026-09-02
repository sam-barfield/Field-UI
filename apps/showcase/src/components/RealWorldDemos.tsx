import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Button,
  IconButton,
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
} from '@field/react';
import {
  Server,
  ShieldCheck,
  RefreshCw,
  Plus,
} from 'lucide-react';

export const RealWorldDemos: React.FC = () => {
  const { showToast } = useToast();
  const [activeView, setActiveView] = useState<'dashboard' | 'settings'>('dashboard');

  // Dashboard filter state
  const [regionFilter, setRegionFilter] = useState('all');
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [strictTls, setStrictTls] = useState(true);

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* View Switcher Sub-nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            size="sm"
            variant={activeView === 'dashboard' ? 'primary' : 'secondary'}
            onClick={() => setActiveView('dashboard')}
          >
            Telemetry & Cluster Ops
          </Button>
          <Button
            size="sm"
            variant={activeView === 'settings' ? 'primary' : 'secondary'}
            onClick={() => setActiveView('settings')}
          >
            Security & Access Policy
          </Button>
        </div>

        <Badge variant="success" dot>Live Cluster Sync Active</Badge>
      </div>

      {activeView === 'dashboard' ? (
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
                  <IconButton
                    icon={<RefreshCw size={16} />}
                    aria-label="Refresh node telemetry"
                    variant="outline"
                    onClick={() => {
                      showToast({
                        title: 'Telemetry Refreshed',
                        description: 'Polled status from 4 regional controllers.',
                        variant: 'info',
                      });
                    }}
                  />
                  <Button variant="primary" size="sm" leftIcon={<Plus size={14} />}>
                    Provision Node
                  </Button>
                </Flex>
              </div>
            </CardHeader>
            <CardContent>
              <Table
                columns={[
                  { key: 'id', header: 'Node Ident', render: r => <span style={{ fontFamily: 'var(--field-font-mono)' }}>{r.id}</span> },
                  { key: 'region', header: 'Region', render: r => <Badge variant="default">{r.region}</Badge> },
                  { key: 'role', header: 'Topology Role' },
                  { key: 'qps', header: 'Throughput', render: r => <span style={{ fontFamily: 'var(--field-font-mono)' }}>{r.qps}</span> },
                  {
                    key: 'health',
                    header: 'Status',
                    render: r => (
                      <Badge variant={r.health === 'Operational' ? 'success' : 'warning'} dot>
                        {r.health}
                      </Badge>
                    ),
                  },
                ]}
                data={filteredNodes}
                keyExtractor={r => r.id}
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        <div style={{ maxWidth: '780px', margin: '0 auto', width: '100%' }}>
          <Card>
            <CardHeader>
              <Heading level={3}>Access & Authentication Policy</Heading>
              <Text tone="secondary" size="sm">
                Configure credential expiration, mutual TLS, and role-based access enforcement.
              </Text>
            </CardHeader>
            <CardContent>
              <Stack gap="20px">
                <Alert variant="info" title="Encrypted Certificate Authority">
                  Certificates are automatically rotated every 90 days via Let's Encrypt / ACME.
                </Alert>

                <TextInput
                  label="Organization Policy Domain"
                  defaultValue="corp.internal.field-systems.io"
                  helperText="Primary domain for SSO OIDC token exchange"
                />

                <Select
                  label="Session Inactivity Timeout"
                  defaultValue="60m"
                  options={[
                    { value: '15m', label: '15 minutes (High Security)' },
                    { value: '60m', label: '1 hour (Standard)' },
                    { value: '12h', label: '12 hours' },
                  ]}
                />

                <Divider />

                <Stack gap="16px">
                  <Switch
                    label="Require Multi-Factor Authentication (WebAuthn / FIDO2)"
                    description="Prevents single-factor password logins for all service accounts"
                    checked={mfaEnabled}
                    onChange={setMfaEnabled}
                  />

                  <Switch
                    label="Strict mTLS on Regional VPC Connectors"
                    description="Drop unauthenticated handshake attempts at edge ingress"
                    checked={strictTls}
                    onChange={setStrictTls}
                  />
                </Stack>

                <Divider />

                <div
                  style={{
                    backgroundColor: 'var(--field-status-danger-surface)',
                    border: '1px solid var(--field-status-danger-border)',
                    borderRadius: 'var(--field-radius-md)',
                    padding: '16px',
                  }}
                >
                  <Heading level={4} style={{ color: 'var(--field-status-danger-text)' }}>
                    Danger Zone: Revoke All Active Service Keys
                  </Heading>
                  <Text size="xs" tone="secondary" style={{ marginTop: '4px', marginBottom: '12px' }}>
                    Immediately terminates all authorized bearer tokens across production nodes.
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
