// title: Indicator variants
// description: underline, elastic (fluid stretch), pill, rail or ghost. Set it on Navbar or per NavbarContent; glow adds a soft accent halo.
import { useState } from 'react';
import { Navbar, NavbarContent, NavbarItem, SegmentedControl, Stack, Flex, Switch, type NavbarVariant } from '@sam.barfield/field-react';

const LINKS = ['Compute', 'Storage', 'Network', 'Billing'];

export default function NavbarVariants() {
  const [variant, setVariant] = useState<NavbarVariant>('elastic');
  const [glow, setGlow] = useState(true);
  const [active, setActive] = useState('Compute');
  return (
    <Stack gap={16} className="example-wide" align="center">
      <Flex gap={16} align="center" wrap="wrap" justify="center">
        <SegmentedControl<NavbarVariant>
          size="sm"
          aria-label="Indicator variant"
          value={variant}
          onChange={setVariant}
          options={['underline', 'elastic', 'pill', 'rail', 'ghost'].map(v => ({ value: v as NavbarVariant, label: v }))}
        />
        <Switch label="Glow" size="sm" checked={glow} onChange={setGlow} />
      </Flex>
      <Navbar variant={variant} glow={glow} bordered={false} style={{ background: 'transparent' }}>
        <NavbarContent align="center">
          {LINKS.map(link => (
            <NavbarItem key={link} isActive={active === link} onClick={() => setActive(link)}>
              {link}
            </NavbarItem>
          ))}
        </NavbarContent>
      </Navbar>
    </Stack>
  );
}
