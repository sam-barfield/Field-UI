// title: Restyled with variables
// description: Accent markers large enough for an icon, the timestamp above each title (with a machine-readable dateTime), and the rail, gaps and time colour set through --field-timeline-* variables instead of overriding classes.
import { Timeline } from '@sam.barfield/field-react';
import { Flag, Plane, Wrench } from 'lucide-react';

export default function TimelineCustom() {
  return (
    <div
      className="example-col"
      style={{
        maxWidth: 520,
        ['--field-timeline-rail-color' as string]: 'var(--field-accent-subtle)',
        ['--field-timeline-gap' as string]: 'var(--field-space-4)',
        ['--field-timeline-item-gap' as string]: 'var(--field-space-8)',
        ['--field-timeline-time-color' as string]: 'var(--field-accent-text)',
        ['--field-timeline-time-weight' as string]: '600',
      }}
    >
      <Timeline
        markerSize="lg"
        timestampPosition="top"
        items={[
          { id: '1', title: 'Station opens', timestamp: 'July 1941', dateTime: '1941-07', status: 'accent', icon: <Flag size={14} />, content: 'Built as a bomber station for 4 Group.' },
          { id: '2', title: '51 Squadron arrives', timestamp: 'October 1942', dateTime: '1942-10', status: 'accent', icon: <Plane size={14} />, content: 'Halifax bombers fly from Snaith until the end of the war.' },
          { id: '3', title: 'Museum restoration', timestamp: '2004', dateTime: '2004', status: 'accent', icon: <Wrench size={14} />, content: 'Volunteers restore the original station buildings.' },
        ]}
      />
    </div>
  );
}
