// title: Sizes that match buttons
// description: size on TextInput, Select and NumberInput gives the same heights as Button (sm 30px, md 36px, lg 44px, xl 48px), so a field and its button line up in a row.
import { Button, Flex, NumberInput, Select, TextInput } from '@sam.barfield/field-react';

export default function TextInputSizes() {
  return (
    <Flex direction="column" gap="$4" className="example-col" style={{ maxWidth: 520 }}>
      <Flex gap="$2" align="end">
        <TextInput size="lg" aria-label="Email address" placeholder="you@example.com" />
        <Button size="lg" variant="primary">Subscribe</Button>
      </Flex>
      <Flex gap="$2" align="end">
        <NumberInput size="xl" aria-label="Quantity" min={1} max={10} defaultValue={1} width={120} />
        <Button size="xl" variant="primary" isFullWidth>Add to basket</Button>
      </Flex>
      <Flex gap="$2" align="end">
        <Select
          size="sm"
          aria-label="Sort by"
          defaultValue="new"
          options={[
            { value: 'new', label: 'Newest' },
            { value: 'price', label: 'Price' },
          ]}
        />
        <Button size="sm">Apply</Button>
      </Flex>
    </Flex>
  );
}
