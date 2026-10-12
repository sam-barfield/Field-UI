// title: Transparent over a hero
// description: Scroll inside the frame. transparentOnTop="auto" keeps the bar clear only while a Section underNavbar sits under it (pages without one get a solid bar), and turns solid while the menu is open. scrolledAppearance sets the scrolled look; mode="dark" themes the bar itself, with no wrapper. NavbarActionsItem hideOnMobile hides one action on phones.
import { useRef } from 'react';
import {
  Button,
  Heading,
  Navbar,
  NavbarActions,
  NavbarActionsItem,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarToggle,
  Section,
  Text,
} from '@sam.barfield/field-react';

export default function NavbarTransparent() {
  const frameRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={frameRef} className="example-site" style={{ height: 360, overflowY: 'auto', ['--field-navbar-height' as string]: '64px' }}>
      <Navbar
        sticky
        mode="dark"
        height={64}
        transparentOnTop="auto"
        scrollContainerRef={frameRef}
        scrolledAppearance={{ shadow: 'md', blur: true }}
      >
        <NavbarBrand href="#/components/navbar">Snaith</NavbarBrand>
        <NavbarContent hideOnMobile>
          <NavbarItem href="#/components/navbar" isActive>Visit</NavbarItem>
          <NavbarItem href="#/components/navbar">History</NavbarItem>
          <NavbarItem href="#/components/navbar">Shop</NavbarItem>
        </NavbarContent>
        <NavbarActions>
          <NavbarActionsItem hideOnMobile asChild>
            <Button size="sm" variant="primary">Donate</Button>
          </NavbarActionsItem>
          <NavbarToggle />
        </NavbarActions>
        <NavbarMenu>
          <NavbarItem href="#/components/navbar" isActive>Visit</NavbarItem>
          <NavbarItem href="#/components/navbar">History</NavbarItem>
          <NavbarItem href="#/components/navbar">Shop</NavbarItem>
        </NavbarMenu>
      </Navbar>
      <Section underNavbar backgroundImage="https://picsum.photos/seed/field-navbar-hero/1600/900" spacing="xl" container="md">
        <Heading level={1} display="sm">RAF Snaith Museum</Heading>
        <Text size="lg" tone="secondary">Scroll down: the bar picks up its scrolled look.</Text>
      </Section>
      <Section spacing="lg" container="md">
        <Text>Content below the hero.</Text>
      </Section>
    </div>
  );
}
