// title: Spinner and Skeleton
import { Spinner, Skeleton, Flex, Stack, Card } from '@sam.barfield/field-react';

export default function SpinnerSkeleton() {
  return (
    <Flex gap={32} align="center" wrap="wrap" justify="center">
      <Flex gap={16} align="center">
        <Spinner size={16} />
        <Spinner />
        <Spinner size={28} label="Loading metrics" />
      </Flex>
      <Card style={{ width: 280 }}>
        <Flex gap={12} align="center">
          <Skeleton circle width={40} />
          <Stack gap={8} style={{ flex: 1 }}>
            <Skeleton width="70%" height={14} />
            <Skeleton width="45%" height={12} />
          </Stack>
        </Flex>
      </Card>
    </Flex>
  );
}
