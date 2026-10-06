// title: Background image
// description: backgroundImage covers the band with a photo and switches the content to dark-theme colours. overlay (0 to 1) controls how much the photo is darkened for legibility.
import { Section, Stack, Heading, Text, Button } from '@sam.barfield/field-react';

export default function SectionImage() {
  return (
    <div className="example-site">
      <Section backgroundImage="https://picsum.photos/seed/field-hero/1600/900" overlay={0.6} spacing="xl" container="md">
        <Stack gap="$5" align="flex-start">
          <Heading level={2} display="md">Private hire for up to 40 guests</Heading>
          <Text size="xl" tone="secondary">
            Birthdays, launches and team breakfasts. We handle the food, the coffee and the washing up.
          </Text>
          <Button variant="primary" size="lg">Enquire about hire</Button>
        </Stack>
      </Section>
    </div>
  );
}
