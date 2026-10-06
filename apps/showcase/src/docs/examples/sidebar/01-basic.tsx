// title: Application sidebar
// description: Groups, badges, a nested dropdown and a footer. Use the header toggle to collapse it to icons.
import { useState } from 'react';
import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarItem, SidebarDropdown, SidebarSubItem, SidebarFooter, Avatar, Text } from '@sam.barfield/field-react';
import { Activity, Database, Gauge, HardDrive, Layers, Server, Settings } from 'lucide-react';

export default function SidebarBasic() {
  const [active, setActive] = useState('overview');
  const item = (id: string) => ({ isActive: active === id, onClick: () => setActive(id) });

  return (
    <div style={{ height: 460, display: 'flex', border: '1px solid var(--field-border-subtle)', borderRadius: 'var(--field-radius-lg)', overflow: 'hidden' }}>
      <Sidebar>
        <SidebarHeader title="Acme Cloud" subtitle="Production" icon={<Layers size={16} />} />
        <SidebarContent>
          <SidebarGroup label="Home">
            <SidebarItem icon={<Gauge size={16} />} label="Overview" {...item('overview')} />
          </SidebarGroup>
          <SidebarGroup label="Infrastructure">
            <SidebarDropdown icon={<Server size={16} />} label="Compute" defaultOpen>
              <SidebarSubItem label="Instances" badge="12" {...item('instances')} />
              <SidebarSubItem label="Auto-scaling" description="3 groups" {...item('asg')} />
            </SidebarDropdown>
            <SidebarItem icon={<HardDrive size={16} />} label="Storage" {...item('storage')} />
            <SidebarItem icon={<Database size={16} />} label="Databases" badge="2" {...item('databases')} />
            <SidebarItem icon={<Activity size={16} />} label="Monitoring" disabled />
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter collapsedChildren={<Avatar name="Ada Lovelace" size="sm" />}>
          <Avatar name="Ada Lovelace" size="sm" />
          <Text size="sm">Ada Lovelace</Text>
          <Settings size={14} style={{ marginLeft: 'auto' }} />
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}
