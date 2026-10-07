import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  Flex,
  Grid,
  Heading,
  Link,
  Navbar,
  NavbarActions,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Section,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  ThemeScope,
  type FieldThemePair,
} from '@sam.barfield/field-react';
import { ArrowRight, Layers } from 'lucide-react';
import type { Mode } from './model';

// A soft "photo" for the image band, so its overlay and text can be judged without a real image.
const PHOTO = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8aa3b8"/><stop offset=".5" stop-color="#d9c7a3"/><stop offset="1" stop-color="#5d6b4f"/></linearGradient></defs><rect width="1200" height="400" fill="url(#g)"/><circle cx="930" cy="120" r="90" fill="#f4e7c8" opacity=".7"/></svg>'
)}`;

const prevent = (e: { preventDefault(): void }) => e.preventDefault();

/** A compact website + UI sample rendered with one mode of a theme pair. */
export function ThemePreview({ pair, mode, label }: { pair: FieldThemePair; mode: Mode; label?: string }) {
  return (
    <ThemeScope themePair={pair} mode={mode} className="tb-preview" aria-label={label ?? `${mode} mode preview`} role="region">
      <Navbar bordered maxWidth="full" navLabel={`Preview ${mode}`}>
        <NavbarBrand href="#" onClick={prevent}>
          <Layers size={16} aria-hidden="true" /> Northwind
        </NavbarBrand>
        <NavbarContent hideOnMobile>
          <NavbarItem href="#" onClick={prevent} isActive>
            Services
          </NavbarItem>
          <NavbarItem href="#" onClick={prevent}>
            Projects
          </NavbarItem>
          <NavbarItem href="#" onClick={prevent}>
            About
          </NavbarItem>
        </NavbarContent>
        <NavbarActions>
          <Button variant="primary" size="sm">
            Get a quote
          </Button>
        </NavbarActions>
      </Navbar>

      <Section tone="muted" spacing="sm" container={false} className="tb-preview-pad">
        <Stack gap="$3">
          <Text size="sm" weight="bold" tone="accent">
            BUILT TO LAST
          </Text>
          <Heading level={1} display="sm">
            Engineering you can rely on
          </Heading>
          <Text size="lg" tone="secondary">
            Secondary copy sits under headings. <Link href="#" onClick={prevent}>Links use the accent text colour</Link>.
          </Text>
          <Flex gap="$2" wrap="wrap">
            <Button variant="primary" rightIcon={<ArrowRight size={14} />}>
              Primary
            </Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
          </Flex>
        </Stack>
      </Section>

      <Section spacing="sm" container={false} className="tb-preview-pad">
        <Grid columns={{ base: 1, sm: 2 }} gap="$3">
          <Card>
            <Stack gap="$2">
              <Heading level={4}>Raised card</Heading>
              <Text size="sm" tone="secondary">
                Secondary text on a raised surface.
              </Text>
              <Text size="xs" tone="tertiary">
                Tertiary caption · updated today
              </Text>
              <Flex gap="$1" wrap="wrap">
                <Badge>Default</Badge>
                <Badge variant="accent">Accent</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
              </Flex>
            </Stack>
          </Card>
          <Card>
            <form onSubmit={prevent}>
              <Stack gap="$3">
                <TextInput label="Email" defaultValue="name@" error="Enter a full email address." />
                <Select
                  label="Service"
                  defaultValue="survey"
                  options={[
                    { value: 'survey', label: 'Site survey' },
                    { value: 'repair', label: 'Repair' },
                  ]}
                />
                <Flex gap="$4" wrap="wrap" align="center">
                  <Checkbox label="Checked" defaultChecked />
                  <Switch label="On" defaultChecked />
                </Flex>
              </Stack>
            </form>
          </Card>
        </Grid>
        <Grid columns={{ base: 1, sm: 2 }} gap="$2" className="tb-preview-alerts">
          <Alert variant="info" title="Info">Status text on its surface.</Alert>
          <Alert variant="success" title="Saved">Your changes are live.</Alert>
          <Alert variant="warning" title="Check">Something needs attention.</Alert>
          <Alert variant="danger" title="Error">Should not look like your brand.</Alert>
        </Grid>
      </Section>

      <Section tone="accent" spacing="sm" container={false} className="tb-preview-pad">
        <Flex justify="space-between" align="center" gap="$3" wrap="wrap">
          <Stack gap="$1">
            <Heading level={3}>Accent band</Heading>
            <Text size="sm" tone="secondary">
              Secondary text on the brand fill.
            </Text>
          </Stack>
          <Flex gap="$2" wrap="wrap">
            <Button variant="primary">Inverted</Button>
            <Button variant="outline">Outline</Button>
          </Flex>
        </Flex>
      </Section>

      <Section backgroundImage={PHOTO} overlay={0.6} spacing="sm" container={false} className="tb-preview-pad">
        <Flex justify="space-between" align="center" gap="$3" wrap="wrap">
          <Stack gap="$1">
            <Heading level={3}>Photo band</Heading>
            <Text size="sm" tone="secondary">
              Uses the band theme (or dark) in both modes.
            </Text>
          </Stack>
          <Button variant="primary">Call to action</Button>
        </Flex>
      </Section>
    </ThemeScope>
  );
}
