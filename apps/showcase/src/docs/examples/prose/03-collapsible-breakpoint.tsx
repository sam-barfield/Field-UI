// title: Collapse below a breakpoint
// description: collapsible accepts a breakpoint object. { base: true, lg: false } collapses below 1024px and shows everything from 1024px. It is CSS only, so the first paint is already right.
import { Prose } from '@sam.barfield/field-react';

export default function ProseCollapsibleBreakpoint() {
  return (
    <Prose as="article" collapsible={{ base: true, lg: false }} previewParagraphs={1} className="example-wide">
      <p>
        RAF Snaith opened in 1941 on farmland near the village of Pollington, and became home to No. 51 Squadron
        the following year.
      </p>
      <p>
        The squadron flew Whitleys and then Halifax bombers from the station, taking part in the main bomber
        offensive until the end of the war in Europe.
      </p>
      <p>
        After the war the airfield was closed and returned to farming. Parts of the perimeter track and several
        buildings can still be seen today.
      </p>
    </Prose>
  );
}
