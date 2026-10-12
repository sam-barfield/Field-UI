// title: Preview count and loading
// description: previewCount shows the first photos with a "Show all" button and accepts a breakpoint object (4 on phones, 6 from 768px here). Hidden photos stay in the lightbox. Tiles get srcSet and sizes worked out from the columns.
import { useState } from 'react';
import { Button, Gallery, Stack } from '@sam.barfield/field-react';

const PHOTOS = Array.from({ length: 10 }, (_, i) => ({
  id: `photo-${i}`,
  src: `https://picsum.photos/seed/field-archive-${i}/1600/1200`,
  srcSet: [400, 800, 1600].map(w => `https://picsum.photos/seed/field-archive-${i}/${w}/${(w * 3) / 4} ${w}w`).join(', '),
  width: 1600,
  height: 1200,
  alt: `Archive photo ${i + 1}`,
}));

export default function GalleryPreviewExample() {
  const [loading, setLoading] = useState(false);
  return (
    <Stack gap="$3" className="example-wide">
      <Button size="sm" variant="outline" onClick={() => setLoading(l => !l)} style={{ alignSelf: 'flex-start' }}>
        {loading ? 'Show photos' : 'Show loading state'}
      </Button>
      <Gallery
        images={PHOTOS}
        columns={{ base: 2, md: 3 }}
        ratio={4 / 3}
        gap={{ base: '$2', md: '$3' }}
        previewCount={{ base: 4, md: 6 }}
        isLoading={loading}
        skeletonCount={6}
      />
    </Stack>
  );
}
