// title: SectionHeader with eyebrow and action
// description: SectionHeader provides a standard header block for page sections: an eyebrow, a title in the theme's display font (display="sm" by default), a description and an action that drops under the title on phones. headingId labels the section, and the parent Stack's gap spaces it from the content.
import { Button, Card, Grid, Section, SectionHeader, Stack, Text } from '@sam.barfield/field-react';
import { ArrowRight } from 'lucide-react';

export default function SectionHeaderExample() {
  return (
    <Section spacing="sm" container={false} aria-labelledby="exhibits-title" className="example-wide">
      <Stack gap="$8">
        <SectionHeader
          eyebrow="Archival Collection"
          title="Permanent Exhibits & Relics"
          headingId="exhibits-title"
          description="Explore original flight logs, navigation instruments, and firsthand accounts preserved from 1941 through 1945."
          action={
            <Button variant="outline" rightIcon={<ArrowRight size={16} />}>
              Browse archive
            </Button>
          }
        />
        <Grid columns={{ base: 1, sm: 2 }} gap="$4">
          <Card>
            <Text>Flight logs</Text>
          </Card>
          <Card>
            <Text>Navigation instruments</Text>
          </Card>
        </Grid>
      </Stack>
    </Section>
  );
}
