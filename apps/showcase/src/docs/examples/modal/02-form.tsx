// title: Form in a modal
// description: initialFocusRef focuses a specific field. Selects and date pickers inside work because their popups are portalled.
import { useRef, useState } from 'react';
import { Modal, Button, TextInput, Select, Stack } from '@sam.barfield/field-react';

export default function ModalForm() {
  const [open, setOpen] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>Create API key</Button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Create API key"
        initialFocusRef={nameRef}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" form="api-key-form">Create</Button>
          </>
        }
      >
        <form id="api-key-form" onSubmit={e => { e.preventDefault(); setOpen(false); }}>
          <Stack gap={16}>
            <TextInput ref={nameRef} label="Name" placeholder="ci-deploy" required />
            <Select
              label="Expires"
              defaultValue="90d"
              options={[
                { value: '30d', label: '30 days' },
                { value: '90d', label: '90 days' },
                { value: 'never', label: 'Never' },
              ]}
            />
          </Stack>
        </form>
      </Modal>
    </>
  );
}
