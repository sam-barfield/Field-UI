// title: FAQ
import { Accordion } from '@sam.barfield/field-react';

export default function AccordionBasic() {
  return (
    <div className="example-wide" style={{ maxWidth: 620 }}>
      <Accordion
        defaultOpenIds={['billing']}
        items={[
          { id: 'billing', title: 'How am I billed?', content: 'Compute is billed per second; storage per GB-month.' },
          { id: 'regions', title: 'Which regions are available?', content: 'Twelve regions across North America, Europe and Asia Pacific.' },
          { id: 'support', title: 'How do I contact support?', content: 'Open a ticket from the console or email support@acme.dev.' },
          { id: 'legacy', title: 'Legacy plans', content: 'No longer available.', disabled: true },
        ]}
      />
    </div>
  );
}
