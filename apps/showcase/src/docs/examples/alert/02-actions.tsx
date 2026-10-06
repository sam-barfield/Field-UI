// title: Dismissible with actions
import { useState } from 'react';
import { Alert, Button } from '@sam.barfield/field-react';

export default function AlertActions() {
  const [visible, setVisible] = useState(true);
  if (!visible) return <Button onClick={() => setVisible(true)}>Show alert again</Button>;
  return (
    <div className="example-wide">
      <Alert
        variant="warning"
        title="Your trial ends in 3 days"
        onClose={() => setVisible(false)}
        actions={
          <>
            <Button size="sm" variant="primary">Upgrade</Button>
            <Button size="sm" variant="ghost">Compare plans</Button>
          </>
        }
      >
        Add a payment method to keep your projects running.
      </Alert>
    </div>
  );
}
