// title: Header, content and footer
import { Card, CardHeader, CardContent, CardFooter, Heading, Text, Button, Badge, Flex } from '@sam.barfield/field-react';

export default function CardBasic() {
  return (
    <Card style={{ width: 360 }}>
      <CardHeader>
        <Flex justify="space-between" align="center">
          <Heading level={4}>api-gateway</Heading>
          <Badge variant="success" dot>Healthy</Badge>
        </Flex>
      </CardHeader>
      <CardContent>
        <Text size="sm" tone="secondary">3 replicas across 2 availability zones. Last deployed 12 minutes ago.</Text>
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="ghost">View logs</Button>
        <Button size="sm" variant="primary" style={{ marginLeft: 'auto' }}>Redeploy</Button>
      </CardFooter>
    </Card>
  );
}
