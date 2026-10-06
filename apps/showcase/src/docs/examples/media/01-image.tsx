// title: Image
// description: ratio crops to a fixed shape (object-fit cover), caption renders a figure, and a broken src shows a fallback instead of a broken-image icon. Images lazy-load by default.
import { Image, Grid } from '@sam.barfield/field-react';

export default function ImageExample() {
  return (
    <Grid columns={{ base: 1, sm: 3 }} gap="$4" className="example-wide">
      <Image src="https://picsum.photos/seed/field-latte/800/600" alt="Sample photo" ratio={4 / 3} caption="ratio={4 / 3}" />
      <Image src="https://picsum.photos/seed/field-bread/800/800" alt="Sample photo" ratio={1} radius="full" caption='ratio={1} radius="full"' />
      <Image src="/missing-image.jpg" alt="Photo that failed to load" ratio={4 / 3} caption="Fallback when the image fails" />
    </Grid>
  );
}
