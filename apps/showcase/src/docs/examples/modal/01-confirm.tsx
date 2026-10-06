// title: Confirmation dialog
// description: Focus moves into the dialog, Tab is trapped, Escape closes, and focus returns to the trigger.
import { useState } from 'react';
import { Modal, Button, Alert } from '@sam.barfield/field-react';

export default function ModalConfirm() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>Delete bucket</Button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Delete logs-production?"
        description="This permanently deletes the bucket and its 1.2 M objects."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => setOpen(false)}>Delete</Button>
          </>
        }
      >
        <Alert variant="warning" title="This cannot be undone">
          Consider enabling versioning instead.
        </Alert>
      </Modal>
    </>
  );
}
