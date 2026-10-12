// title: Left timestamp alignment
// description: Set timestampPosition="left" for chronology pages, history logs, and audit trails.
import { Timeline } from '@sam.barfield/field-react';

export default function TimelineLeftTimestamps() {
  return (
    <div className="example-col" style={{ maxWidth: 600 }}>
      <Timeline
        timestampPosition="left"
        items={[
          { id: '1', title: 'Base Established', timestamp: 'May 1941', status: 'accent', content: 'RAF Snaith opened as a satellite station for RAF Leconfield.' },
          { id: '2', title: '51 Squadron Arrival', timestamp: 'May 1942', status: 'neutral', content: 'Armstrong Whitworth Whitley aircraft transferred to Snaith.' },
          { id: '3', title: 'Halifax Conversions', timestamp: 'Jun 1942', status: 'success', content: 'Conversion to four-engine Handley Page Halifax bombers completed.' },
        ]}
      />
    </div>
  );
}
