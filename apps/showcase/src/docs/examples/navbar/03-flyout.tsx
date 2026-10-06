// title: Flyout mega-menu
// description: On phones the links move into NavbarMenu behind NavbarToggle, as a flyout panel would not fit.
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarFlyout, NavbarFlyoutGrid, NavbarFlyoutItem, NavbarActions, NavbarToggle, NavbarMenu, Badge } from '@sam.barfield/field-react';
import { Database, HardDrive, Server, Zap } from 'lucide-react';

export default function NavbarFlyoutExample() {
  return (
    <div className="example-wide" style={{ minHeight: 300 }}>
      <Navbar bordered>
        <NavbarBrand href="#">Acme Cloud</NavbarBrand>
        <NavbarContent hideOnMobile>
          <NavbarItem isActive>Home</NavbarItem>
          <NavbarFlyout trigger={<NavbarItem>Products</NavbarItem>} width={520}>
            <NavbarFlyoutGrid columns={2}>
              <NavbarFlyoutItem icon={<Server size={18} />} title="Compute" description="Virtual machines and containers" href="#" />
              <NavbarFlyoutItem icon={<Zap size={18} />} title="Functions" description="Run code without servers" badge={<Badge size="sm" variant="accent">New</Badge>} href="#" />
              <NavbarFlyoutItem icon={<HardDrive size={18} />} title="Storage" description="Object and block storage" href="#" />
              <NavbarFlyoutItem icon={<Database size={18} />} title="Databases" description="Managed Postgres and MySQL" href="#" />
            </NavbarFlyoutGrid>
          </NavbarFlyout>
          <NavbarItem>Pricing</NavbarItem>
        </NavbarContent>
        <NavbarActions>
          <NavbarToggle />
        </NavbarActions>
        <NavbarMenu>
          <NavbarItem isActive>Home</NavbarItem>
          <NavbarItem>Compute</NavbarItem>
          <NavbarItem>Functions</NavbarItem>
          <NavbarItem>Storage</NavbarItem>
          <NavbarItem>Databases</NavbarItem>
          <NavbarItem>Pricing</NavbarItem>
        </NavbarMenu>
      </Navbar>
    </div>
  );
}
