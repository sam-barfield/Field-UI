// title: Lightbox toolbar actions
// description: Add controls beside Close with lightboxProps.actions (or Lightbox actions). They follow the photo shown. download only saves same-origin files; target="_blank" opens other files in a new tab instead.
import { Gallery, LightboxAction } from '@sam.barfield/field-react';
import { Download, ExternalLink } from 'lucide-react';

const POSTERS = Array.from({ length: 4 }, (_, i) => ({
  src: `https://picsum.photos/seed/field-poster-${i}/1200/1600`,
  thumbnail: `https://picsum.photos/seed/field-poster-${i}/450/600`,
  alt: `Event poster ${i + 1}`,
  caption: `Event poster ${i + 1}`,
}));

export default function LightboxActionsExample() {
  return (
    <Gallery
      className="example-wide"
      images={POSTERS}
      columns={{ base: 2, md: 4 }}
      ratio={3 / 4}
      lightboxProps={{
        actions: image => (
          <>
            <LightboxAction
              icon={<ExternalLink size={20} aria-hidden="true" />}
              aria-label={`Open ${image.alt} in a new tab`}
              href={image.src}
              target="_blank"
            />
            <LightboxAction
              icon={<Download size={20} aria-hidden="true" />}
              aria-label={`Download ${image.alt}`}
              href={image.src}
              download
              target="_blank"
            />
          </>
        ),
      }}
    />
  );
}
