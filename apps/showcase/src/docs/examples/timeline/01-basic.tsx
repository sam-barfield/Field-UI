// title: Deploy history
import { Timeline } from '@sam.barfield/field-react';

export default function TimelineBasic() {
  return (
    <div className="example-col">
      <Timeline
        items={[
          { id: '1', title: 'Deployed v2.4.0', timestamp: '2 min ago', status: 'success', content: 'Rolled out to 6 of 6 replicas.' },
          { id: '2', title: 'Health check warning', timestamp: '18 min ago', status: 'warning', content: 'p99 latency above 400 ms.' },
          { id: '3', title: 'Build failed', timestamp: '1 h ago', status: 'danger', content: 'Type error in src/billing.ts.' },
          { id: '4', title: 'Branch created', timestamp: 'Yesterday', status: 'neutral' },
        ]}
      />
    </div>
  );
}
