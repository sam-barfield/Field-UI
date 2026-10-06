// title: Positions
// description: Shown on hover (after a short delay) and on keyboard focus. Flips automatically near the viewport edge.
import { Tooltip, IconButton, Button } from '@sam.barfield/field-react';
import { Bell, Copy, HelpCircle, Settings } from 'lucide-react';

export default function TooltipBasic() {
  return (
    <>
      <Tooltip content="Copy ARN" position="top">
        <IconButton icon={<Copy size={16} />} aria-label="Copy ARN" variant="ghost" />
      </Tooltip>
      <Tooltip content="Notifications" position="bottom">
        <IconButton icon={<Bell size={16} />} aria-label="Notifications" variant="ghost" />
      </Tooltip>
      <Tooltip content="Settings" position="left">
        <IconButton icon={<Settings size={16} />} aria-label="Settings" variant="ghost" />
      </Tooltip>
      <Tooltip content="Billed per second, rounded up to the nearest minute." position="right">
        <Button variant="ghost" rightIcon={<HelpCircle size={14} />}>How is this billed?</Button>
      </Tooltip>
    </>
  );
}
