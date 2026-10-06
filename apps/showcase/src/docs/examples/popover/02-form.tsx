// title: Small form, controlled
import { useState } from 'react';
import { Popover, Button, TextInput, Stack, Flex } from '@sam.barfield/field-react';

export default function PopoverForm() {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState('production');
  return (
    <Popover
      isOpen={open}
      onOpenChange={setOpen}
      align="center"
      width="260px"
      trigger={<Button>Label: {label}</Button>}
      content={
        <form onSubmit={e => { e.preventDefault(); setLabel(new FormData(e.currentTarget).get('label') as string); setOpen(false); }}>
          <Stack gap={12}>
            <TextInput name="label" label="Environment label" defaultValue={label} autoFocus />
            <Flex gap={8} justify="flex-end">
              <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button size="sm" variant="primary" type="submit">Save</Button>
            </Flex>
          </Stack>
        </form>
      }
    />
  );
}
