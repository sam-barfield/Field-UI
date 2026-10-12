// title: Several actions, plain inside a card
// description: actions takes several buttons. They sit in a wrapping row, and on phones they stack at full width with long labels wrapping. variant="plain" drops the box when the empty state is already inside a Card.
import { Button, Card, EmptyState } from '@sam.barfield/field-react';
import { CalendarX } from 'lucide-react';

export default function EmptyStateActions() {
  return (
    <Card className="example-col" style={{ maxWidth: 520 }}>
      <EmptyState
        variant="plain"
        icon={<CalendarX size={22} />}
        titleAs="h3"
        title="No events this month"
        description="We're planning the summer programme now."
        actions={
          <>
            <Button variant="primary">Sign up for event announcements</Button>
            <Button variant="outline">See last year's programme</Button>
          </>
        }
      />
    </Card>
  );
}
