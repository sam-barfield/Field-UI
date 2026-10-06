// title: App navigation
// description: Mark the current page with isActive. The underline indicator animates between items. Narrow the window to see the mobile menu.
import { useState } from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarActions, NavbarToggle, NavbarMenu, Button } from '@sam.barfield/field-react';
import { Layers } from 'lucide-react';

const LINKS = ['Overview', 'Deployments', 'Metrics', 'Settings'];

export default function NavbarBasic() {
  const [active, setActive] = useState('Overview');
  return (
    <div className="example-wide">
      <Navbar bordered variant="underline">
        <NavbarBrand href="#">
          <Layers size={18} /> Acme
        </NavbarBrand>
        <NavbarContent hideOnMobile>
          {LINKS.map(link => (
            <NavbarItem key={link} isActive={active === link} onClick={() => setActive(link)}>
              {link}
            </NavbarItem>
          ))}
        </NavbarContent>
        <NavbarActions>
          <Button size="sm" variant="primary">Deploy</Button>
          <NavbarToggle />
        </NavbarActions>
        <NavbarMenu>
          {LINKS.map(link => (
            <NavbarItem key={link} isActive={active === link} onClick={() => setActive(link)}>
              {link}
            </NavbarItem>
          ))}
        </NavbarMenu>
      </Navbar>
    </div>
  );
}
