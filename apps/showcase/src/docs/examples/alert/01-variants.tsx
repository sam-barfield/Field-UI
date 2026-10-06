// title: Variants
import { Alert, Stack } from '@sam.barfield/field-react';

export default function AlertVariants() {
  return (
    <Stack gap={12} className="example-wide">
      <Alert variant="info" title="Scheduled maintenance">Database upgrades run Sunday 02:00–03:00 UTC.</Alert>
      <Alert variant="success" title="Backup complete">412 GB backed up to eu-west-1.</Alert>
      <Alert variant="warning" title="Quota at 90%">Request a limit increase to avoid throttling.</Alert>
      <Alert variant="danger" title="Deploy failed">The health check did not pass within 5 minutes.</Alert>
    </Stack>
  );
}
