// title: Progress
import { Progress, Stack } from '@sam.barfield/field-react';

export default function ProgressExample() {
  return (
    <Stack gap={18} className="example-col">
      <Progress label="Uploading backup.tar.gz" value={64} showValue />
      <Progress label="Storage used" value={92} variant="warning" showValue size="sm" />
      <Progress label="Provisioning" />
    </Stack>
  );
}
