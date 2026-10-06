// title: FAQ and contact form
// description: Questions on one side, an enquiry form on the other; they stack on phones.
import { useState } from 'react';
import { Section, Grid, Stack, Heading, Text, Accordion, Card, TextInput, TextArea, Select, Button, useToast } from '@sam.barfield/field-react';

export default function FaqContact() {
  const { showToast } = useToast();
  const [service, setService] = useState('repair');
  return (
    <div className="example-site">
      <Section>
        <Grid columns={{ base: 1, lg: 2 }} gap={{ base: '$10', lg: '$16' }}>
          <Stack gap="$5">
            <Heading level={2} display="sm">Questions</Heading>
            <Accordion
              items={[
                { id: 'areas', title: 'Which areas do you cover?', content: 'All BS postcodes and South Gloucestershire.' },
                { id: 'fee', title: 'Is there a call-out fee?', content: 'No. You only pay for the work, at the price we agree up front.' },
                { id: 'pay', title: 'How can I pay?', content: 'Card, bank transfer or Apple Pay on completion.' },
              ]}
            />
          </Stack>
          <Card padding="lg">
            <form
              onSubmit={e => {
                e.preventDefault();
                showToast({ title: 'Thanks, we will call you back', description: 'Usually within the hour.', variant: 'success' });
              }}
            >
              <Stack gap="$4">
                <Heading level={3}>Request a call back</Heading>
                <Text size="sm" tone="secondary">We reply within one working hour.</Text>
                <TextInput label="Name" name="name" autoComplete="name" required />
                <TextInput label="Phone" name="phone" type="tel" autoComplete="tel" required />
                <Select
                  label="Service"
                  value={service}
                  onChange={setService}
                  options={[
                    { value: 'repair', label: 'Boiler repair' },
                    { value: 'service', label: 'Annual service' },
                    { value: 'install', label: 'New installation' },
                  ]}
                />
                <TextArea label="Details" name="details" rows={3} />
                <Button type="submit" variant="primary" isFullWidth>Send request</Button>
              </Stack>
            </form>
          </Card>
        </Grid>
      </Section>
    </div>
  );
}
