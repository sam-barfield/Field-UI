// title: Meter, Sparkline and StatusDot
import { Meter, Sparkline, StatusDot, Stack, Flex } from '@sam.barfield/field-react';

export default function MeterStatus() {
  return (
    <Stack gap={20} className="example-col">
      <Meter label="Disk" value={412} max={500} valueLabel="412 / 500 GB" />
      <Meter label="Memory" value={62} />
      <Meter label="Quota" value={96} />
      <Flex gap={16} wrap="wrap" align="center">
        <StatusDot status="success" label="Operational" />
        <StatusDot status="warning" label="Degraded" pulse />
        <StatusDot status="danger" label="Outage" />
        <StatusDot status="neutral" label="Paused" />
      </Flex>
      <Sparkline data={[3, 5, 4, 8, 7, 11, 9, 14]} width={240} height={48} color="success" aria-label="Requests trending up" />
    </Stack>
  );
}
