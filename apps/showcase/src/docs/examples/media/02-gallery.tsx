// title: Gallery and lightbox
// description: Click a tile to open the full-screen viewer. Use ← / → or swipe to move between photos, Escape to close.
import { Gallery } from '@sam.barfield/field-react';

const PHOTOS = Array.from({ length: 6 }, (_, i) => ({
  src: `https://picsum.photos/seed/field-gallery-${i}/1600/1200`,
  thumbnail: `https://picsum.photos/seed/field-gallery-${i}/600/450`,
  alt: `Sample photo ${i + 1}`,
  caption: `Sample photo ${i + 1}`,
}));

export default function GalleryExample() {
  return <Gallery className="example-wide" images={PHOTOS} columns={{ base: 2, md: 3 }} ratio={4 / 3} />;
}
