// title: Collapse from elsewhere
// description: SidebarProvider shares state, so a SidebarTrigger or useSidebar() anywhere can collapse it.
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarItem, SidebarTrigger, useSidebar, Text } from '@sam.barfield/field-react';
import { Home, Inbox, Settings } from 'lucide-react';

function Status() {
  const { isCollapsed } = useSidebar();
  return <Text size="sm" tone="secondary">Sidebar is {isCollapsed ? 'collapsed' : 'expanded'}</Text>;
}

export default function SidebarProviderExample() {
  return (
    <SidebarProvider defaultCollapsed>
      <div style={{ display: 'flex', height: 240, border: '1px solid var(--field-border-subtle)', borderRadius: 'var(--field-radius-lg)', overflow: 'hidden' }}>
        <Sidebar width={220}>
          <SidebarContent>
            <SidebarGroup>
              <SidebarItem icon={<Home size={16} />} label="Home" isActive />
              <SidebarItem icon={<Inbox size={16} />} label="Inbox" badge="4" />
              <SidebarItem icon={<Settings size={16} />} label="Settings" />
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div style={{ padding: 16, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <SidebarTrigger />
          <Status />
        </div>
      </div>
    </SidebarProvider>
  );
}
