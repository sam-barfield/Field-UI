// title: Showing toasts
// description: Wrap your app in <ToastProvider> once, then call useToast() anywhere.
import { useToast, Button } from '@sam.barfield/field-react';

export default function ToastBasic() {
  const { showToast } = useToast();
  return (
    <>
      <Button onClick={() => showToast({ title: 'Changes saved', variant: 'success' })}>Success</Button>
      <Button onClick={() => showToast({ title: 'Deploy queued', description: 'Position 2 in the build queue.' })}>Info</Button>
      <Button onClick={() => showToast({ title: 'Approaching quota', description: '90% of storage used.', variant: 'warning' })}>Warning</Button>
      <Button variant="danger" onClick={() => showToast({ title: 'Deploy failed', description: 'See build logs for details.', variant: 'danger', duration: 0 })}>
        Persistent error
      </Button>
    </>
  );
}
