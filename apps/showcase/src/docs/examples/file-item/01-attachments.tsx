// title: Attachments
// description: Each row is one link or button. PDFs open in a new tab; other files download (same-origin files only: the browser opens files from another domain instead). onView renders a button, e.g. to open a Lightbox. The type comes from the file extension unless you pass type.
import { useState } from 'react';
import { FileItem, FileList, Lightbox } from '@sam.barfield/field-react';

const POSTER = {
  src: 'https://picsum.photos/seed/field-file-poster/1200/1600',
  thumbnail: 'https://picsum.photos/seed/field-file-poster/200/260',
  alt: 'Winter open weekend poster',
};

export default function FileItemAttachments() {
  const [open, setOpen] = useState(false);
  return (
    <div className="example-col" style={{ width: '100%', maxWidth: 420 }}>
      <FileList heading="Attachments">
        <FileItem name="Booking form" href="/files/booking-form.pdf" />
        <FileItem name="Price list for groups and schools" href="/files/prices.xlsx" meta="Spreadsheet · 18 KB" />
        <FileItem name="Winter open weekend poster" thumbnail={POSTER.thumbnail} type="image" onView={() => setOpen(true)} />
      </FileList>
      <Lightbox images={[POSTER]} isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
}
