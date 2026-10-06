// title: Wizard
// description: Completed steps become clickable when you pass onStepClick.
import { useState } from 'react';
import { Stepper, Button, Flex, Stack } from '@sam.barfield/field-react';

const STEPS = [
  { id: 'source', title: 'Source', description: 'Repository' },
  { id: 'build', title: 'Build', description: 'Runtime & command' },
  { id: 'env', title: 'Environment', description: 'Variables' },
  { id: 'deploy', title: 'Deploy', description: 'Review' },
];

export default function StepperBasic() {
  const [step, setStep] = useState(1);
  return (
    <Stack gap={20} className="example-wide">
      <Stepper steps={STEPS} activeStep={step} onStepClick={setStep} />
      <Flex gap={8} justify="flex-end">
        <Button disabled={step === 0} onClick={() => setStep(s => s - 1)}>Back</Button>
        <Button variant="primary" disabled={step === STEPS.length - 1} onClick={() => setStep(s => s + 1)}>Next</Button>
      </Flex>
    </Stack>
  );
}
