// title: DiffViewer and CopyButton
import { DiffViewer, CopyButton, Flex, Code, Stack } from '@sam.barfield/field-react';

export default function DiffCopy() {
  return (
    <Stack gap={16} className="example-wide">
      <DiffViewer
        title="deployment.yaml"
        lines={[
          { type: 'normal', content: 'spec:', oldLineNumber: 3, newLineNumber: 3 },
          { type: 'removed', content: '  replicas: 2', oldLineNumber: 4 },
          { type: 'added', content: '  replicas: 3', newLineNumber: 4 },
          { type: 'normal', content: '  strategy: RollingUpdate', oldLineNumber: 5, newLineNumber: 5 },
        ]}
      />
      <Flex align="center" gap={8} wrap="wrap">
        <Code>arn:aws:s3:::logs-production</Code>
        <CopyButton value="arn:aws:s3:::logs-production" />
        <CopyButton value="arn:aws:s3:::logs-production" iconOnly label="Copy ARN" />
      </Flex>
    </Stack>
  );
}
