// title: Collapsing earlier
// description: Five items with flyouts need more room than a tablet has. collapseBelow="lg" switches to the menu below 1024px of navbar width; this example is narrower than that, so it shows the menu. Tap a section to expand it.
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarFlyout, NavbarFlyoutGrid, NavbarFlyoutItem, NavbarActions, NavbarToggle, NavbarMenu, Button } from '@sam.barfield/field-react';
import { Building2, Factory, HardHat, Truck } from 'lucide-react';

const industries = [
  { title: 'Manufacturing', icon: <Factory size={18} />, href: '#' },
  { title: 'Construction', icon: <HardHat size={18} />, href: '#' },
  { title: 'Logistics', icon: <Truck size={18} />, href: '#' },
  { title: 'Property', icon: <Building2 size={18} />, href: '#' },
];

export default function NavbarCollapseBelow() {
  return (
    <div className="example-wide" style={{ minHeight: 360 }}>
      <Navbar bordered collapseBelow="lg">
        <NavbarBrand href="#">Northwind</NavbarBrand>
        {/* hideOnMobile: hidden whenever the bar is collapsed, at any width */}
        <NavbarContent hideOnMobile>
          <NavbarFlyout trigger={<NavbarItem>Industries</NavbarItem>} width={480} align="start">
            <NavbarFlyoutGrid columns={2}>
              {industries.map(i => (
                <NavbarFlyoutItem key={i.title} {...i} />
              ))}
            </NavbarFlyoutGrid>
          </NavbarFlyout>
          <NavbarItem isActive>Services</NavbarItem>
          <NavbarItem>Projects</NavbarItem>
          <NavbarItem>About us</NavbarItem>
          <NavbarItem>Careers</NavbarItem>
        </NavbarContent>
        <NavbarActions>
          <Button variant="primary" size="sm">Get a quote</Button>
          <NavbarToggle />
        </NavbarActions>
        <NavbarMenu>
          <NavbarFlyout trigger={<NavbarItem>Industries</NavbarItem>}>
            {industries.map(i => (
              <NavbarItem key={i.title} href={i.href}>{i.title}</NavbarItem>
            ))}
          </NavbarFlyout>
          <NavbarItem isActive>Services</NavbarItem>
          <NavbarItem>Projects</NavbarItem>
          <NavbarItem>About us</NavbarItem>
          <NavbarItem>Careers</NavbarItem>
        </NavbarMenu>
      </Navbar>
    </div>
  );
}
