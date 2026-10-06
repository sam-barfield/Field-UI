// title: Skip link
// description: Click inside the frame, then press Tab: the skip link appears first and jumps keyboard users past the navigation to the main content.
import { SkipLink, Navbar, NavbarBrand, NavbarContent, NavbarItem, Box, Text } from '@sam.barfield/field-react';

export default function SkipLinkExample() {
  return (
    <div className="example-site" style={{ position: 'relative', transform: 'translateZ(0)' }}>
      <SkipLink href="#docs-demo-main" />
      <Navbar bordered>
        <NavbarBrand>Hearth</NavbarBrand>
        <NavbarContent>
          <NavbarItem>Menu</NavbarItem>
          <NavbarItem>Visit</NavbarItem>
          <NavbarItem>Order</NavbarItem>
        </NavbarContent>
      </Navbar>
      <Box as="main" id="docs-demo-main" padding="$6">
        <Text tone="secondary">Main content. The main landmark has the matching id.</Text>
      </Box>
    </div>
  );
}
