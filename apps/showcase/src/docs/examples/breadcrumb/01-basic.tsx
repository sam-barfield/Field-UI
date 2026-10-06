// title: Basic
// description: Items can link with href, act as buttons with onClick, or render a router link via as / asChild.
import { Breadcrumb } from '@sam.barfield/field-react';

export default function BreadcrumbBasic() {
  return (
    <Breadcrumb
      items={[
        { label: 'Console', href: '#' },
        { label: 'S3', href: '#' },
        { label: 'Buckets', onClick: () => alert('Buckets') },
        { label: 'logs-production' },
      ]}
    />
  );
}
