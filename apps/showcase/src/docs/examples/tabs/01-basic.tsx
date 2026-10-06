// title: Tabs with panels
// description: TabPanel wires up the ARIA relationships and only renders the active panel.
import { Tabs, TabPanel, Text } from '@sam.barfield/field-react';
import { Activity, FileText, Settings } from 'lucide-react';

export default function TabsBasic() {
  return (
    <div className="example-wide">
      <Tabs
        aria-label="Service"
        items={[
          { id: 'overview', label: 'Overview', icon: <Activity size={14} /> },
          { id: 'logs', label: 'Logs', icon: <FileText size={14} />, badge: 3 },
          { id: 'settings', label: 'Settings', icon: <Settings size={14} /> },
          { id: 'billing', label: 'Billing', disabled: true },
        ]}
      >
        <TabPanel id="overview"><Text tone="secondary">Requests, latency and error rate.</Text></TabPanel>
        <TabPanel id="logs"><Text tone="secondary">3 new error lines in the last hour.</Text></TabPanel>
        <TabPanel id="settings"><Text tone="secondary">Environment variables and scaling.</Text></TabPanel>
      </Tabs>
    </div>
  );
}
