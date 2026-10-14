// title: HTML from a CMS
// description: ProseHtml renders an HTML string through an allowlist, without dangerouslySetInnerHTML: scripts, forms and unsafe links are dropped, empty paragraphs removed and tables fixed up. headingLevel shifts the headings to fit under the card title; components swaps how a tag renders.
import { Card, Heading, ProseHtml, Stack } from '@sam.barfield/field-react';
import type { ComponentProps } from 'react';

// What a WordPress event description typically looks like.
const DESCRIPTION = `<!-- wp:paragraph -->
<p>Join us for a <strong>two-course lunch</strong> and a guided tour of the &pound;1.2m gallery restoration.</p>
<p>&nbsp;</p>
<h2 class="wp-block-heading">Programme</h2>
<table class="has-fixed-layout"><tr><th>12:00</th><td>Arrival and coffee</td></tr>
<tr><th>13:00</th><td>Lunch</td></tr><tr><th>14:30</th><td>Gallery tour</td></tr></table>
<h2>Booking</h2>
<p>Call <a href="tel:+441234567890">01234 567890</a> or read the <a href="https://www.example.org/terms">terms</a>.
<a href="javascript:alert('hi')" onclick="alert('hi')">This link is made safe</a>.</p>
<script>alert('never runs')</script>`;

// Defined once, outside the component: a new object on every render would re-parse the HTML.
const COMPONENTS = {
  strong: (props: ComponentProps<'strong'>) => <strong {...props} style={{ color: 'var(--field-accent-text)' }} />,
};

export default function ProseCmsHtml() {
  return (
    <Card className="example-wide">
      <Stack gap="$3">
        <Heading level={3}>Reunion lunch</Heading>
        <ProseHtml
          html={DESCRIPTION}
          headingLevel={4}
          size="sm"
          components={COMPONENTS}
        />
      </Stack>
    </Card>
  );
}
