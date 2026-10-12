// title: Theming buttons
// description: A theme's button group (or the --field-btn-* variables) sets heights, lettering, radius, shadows and the press effect for every button, with no component CSS. The link variant is an inline text link whose right icon nudges on hover.
import { Button, Flex, ThemeScope, createThemePair } from '@sam.barfield/field-react';
import { ArrowRight } from 'lucide-react';

const museum = createThemePair({
  id: 'button-demo',
  shared: {
    button: {
      height: { md: '48px' },
      paddingX: { md: '24px' },
      radius: '2px',
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      shadow: 'none',
      shadowHover: 'none',
      pressTransform: 'translateY(1px)',
    },
  },
});

export default function ButtonTheming() {
  return (
    <ThemeScope themePair={museum} style={{ background: 'transparent' }}>
      <Flex gap="$3" wrap="wrap" align="center">
        <Button variant="primary">Plan your visit</Button>
        <Button variant="outline">Opening times</Button>
        <Button variant="link" rightIcon={<ArrowRight size={16} />}>
          Read the history
        </Button>
      </Flex>
    </ThemeScope>
  );
}
