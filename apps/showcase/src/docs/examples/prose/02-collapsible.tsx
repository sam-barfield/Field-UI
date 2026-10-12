// title: Collapsible long-form content
// description: collapsible shows the first previewParagraphs paragraphs with a "Read more" toggle on phones (below 640px; widen the window and everything shows). collapsible="always" collapses at every width. The toggle only appears when there is more to show.
import { Prose } from '@sam.barfield/field-react';

export default function ProseCollapsible() {
  return (
    <Prose as="article" collapsible previewParagraphs={2} className="example-wide">
      <h2>Station History & Operations</h2>
      <p>
        Royal Air Force Station Snaith was an operational bomber station located in the East Riding of Yorkshire,
        active throughout the Second World War as home to No. 51 Squadron and later No. 578 Squadron.
      </p>
      <p>
        Operations commenced in early 1942, initially flying Armstrong Whitworth Whitleys before converting to
        the legendary Handley Page Halifax Mk.III heavy bomber.
      </p>
      <p>
        Over 800 airmen who flew from Snaith made the ultimate sacrifice. Today, the Snaith Station Memorial preserves
        the history, flight records, and personal stories of the aircrews and ground personnel.
      </p>
      <p>
        Visitors can explore original flight logs, navigation instruments, and restored photographic archives documenting
        every daylight and night sortie conducted by the resident squadrons.
      </p>
    </Prose>
  );
}
