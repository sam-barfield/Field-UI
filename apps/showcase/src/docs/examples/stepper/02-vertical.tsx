// title: Vertical
import { Stepper } from '@sam.barfield/field-react';

export default function StepperVertical() {
  return (
    <Stepper
      orientation="vertical"
      activeStep={2}
      steps={[
        { id: '1', title: 'Create account' },
        { id: '2', title: 'Verify email' },
        { id: '3', title: 'Invite your team' },
        { id: '4', title: 'Deploy your first app' },
      ]}
    />
  );
}
