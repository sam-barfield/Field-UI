// title: Undo and updating a toast
// description: Add an action button, or pass an id to replace an existing toast (e.g. progress updates).
import { useToast, Button } from '@sam.barfield/field-react';

export default function ToastActions() {
  const { showToast } = useToast();

  const archive = () =>
    showToast({
      title: 'Project archived',
      action: { label: 'Undo', onClick: () => showToast({ title: 'Restored', variant: 'success' }) },
      duration: 6000,
    });

  const upload = () => {
    showToast({ id: 'upload', title: 'Uploading… 0%', duration: 0 });
    setTimeout(() => showToast({ id: 'upload', title: 'Uploading… 60%', duration: 0 }), 800);
    setTimeout(() => showToast({ id: 'upload', title: 'Upload complete', variant: 'success' }), 1600);
  };

  return (
    <>
      <Button onClick={archive}>Archive with undo</Button>
      <Button onClick={upload}>Simulate upload</Button>
    </>
  );
}
