// title: Account menu
// description: Any element can be the trigger. Items can be links via href, as or asChild.
import { DropdownMenu, DropdownItem, DropdownLabel, DropdownDivider, Button, Avatar } from '@sam.barfield/field-react';
import { ChevronDown, CreditCard, LogOut, Settings } from 'lucide-react';

export default function AccountMenu() {
  return (
    <DropdownMenu
      minWidth="220px"
      trigger={
        <Button variant="ghost" rightIcon={<ChevronDown size={14} />}>
          <Avatar name="Ada Lovelace" size="sm" />
          Ada
        </Button>
      }
    >
      <DropdownLabel>ada@acme.dev</DropdownLabel>
      <DropdownItem icon={<Settings size={14} />} href="#/docs/introduction">Settings</DropdownItem>
      <DropdownItem icon={<CreditCard size={14} />} href="#/docs/introduction">Billing</DropdownItem>
      <DropdownDivider />
      <DropdownItem icon={<LogOut size={14} />}>Sign out</DropdownItem>
    </DropdownMenu>
  );
}
