// title: Solid markers
// description: markerVariant="solid" fills each marker with its status colour and draws the icon in the contrast colour. Use markerSize="lg" so icons fit.
import { Timeline } from '@sam.barfield/field-react';
import { Award, Flag, Plane } from 'lucide-react';

export default function TimelineSolidMarkers() {
  return (
    <div className="example-col">
      <Timeline
        markerVariant="solid"
        markerSize="lg"
        timestampPosition="top"
        items={[
          { id: '1941', title: 'Station opens', timestamp: '1941', status: 'neutral', icon: <Flag size={14} /> },
          { id: '1942', title: 'No. 51 Squadron arrives', timestamp: '1942', status: 'accent', icon: <Plane size={14} /> },
          { id: '1945', title: 'Final operations', timestamp: '1945', status: 'success', icon: <Award size={14} /> },
        ]}
      />
    </div>
  );
}
