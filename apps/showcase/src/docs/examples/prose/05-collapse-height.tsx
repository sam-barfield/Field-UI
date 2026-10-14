// title: Collapse by height
// description: For structured content (a heading and a table after the first paragraph), collapseBy="height" clips at collapsedHeight instead of counting paragraphs, and fade fades out the bottom. The toggle only appears when the content is taller than collapsedHeight × collapseThreshold, so the short card has none. Collapsing scrolls back only if the top of the text has left the screen.
import { Card, Grid, Heading, Prose, Stack } from '@sam.barfield/field-react';

function EventCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <Stack gap="$3">
        <Heading level={3}>{title}</Heading>
        <Prose collapsible="always" collapseBy="height" collapsedHeight="9rem" fade size="sm">
          {children}
        </Prose>
      </Stack>
    </Card>
  );
}

export default function ProseCollapseHeight() {
  return (
    <Grid className="example-wide" columns={{ base: 1, md: 2 }} gap="$4">
      <EventCard title="Open day">
        <p>Tour the restored buildings, meet the volunteers and see the archive up close.</p>
        <h4>Programme</h4>
        <table>
          <tbody>
            <tr><th scope="row">10:00</th><td>Doors open</td></tr>
            <tr><th scope="row">11:30</th><td>Guided tour</td></tr>
            <tr><th scope="row">13:00</th><td>Lunch in the café</td></tr>
            <tr><th scope="row">14:30</th><td>Archive talk</td></tr>
            <tr><th scope="row">16:00</th><td>Close</td></tr>
          </tbody>
        </table>
        <h4>Getting here</h4>
        <p>Free parking on site. The nearest station is a 20-minute walk away.</p>
      </EventCard>
      <EventCard title="Members' evening">
        <p>Drinks and a short talk for members. No booking needed.</p>
      </EventCard>
    </Grid>
  );
}
