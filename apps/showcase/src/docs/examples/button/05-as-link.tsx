// title: As a link
// description: href renders an <a>. With a router, pass your Link component via as (or use asChild).
import { Button } from '@sam.barfield/field-react';
import { ExternalLink } from 'lucide-react';
// import { Link } from 'react-router-dom';

export default function ButtonLinks() {
  return (
    <>
      <Button href="https://github.com" target="_blank" rel="noreferrer" rightIcon={<ExternalLink size={14} />}>
        External link
      </Button>
      {/* <Button as={Link} to="/settings" variant="ghost">Settings</Button> */}
      <Button href="#/docs/routing" variant="ghost">
        Routing guide
      </Button>
    </>
  );
}
