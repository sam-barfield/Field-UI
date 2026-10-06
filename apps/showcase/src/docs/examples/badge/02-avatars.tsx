// title: Avatars
// description: Falls back to initials when there is no image or it fails to load.
import { Avatar, AvatarGroup, Flex } from '@sam.barfield/field-react';

export default function Avatars() {
  return (
    <Flex gap={24} align="center" wrap="wrap" justify="center">
      <Flex gap={8} align="center">
        <Avatar size="sm" name="Ada Lovelace" />
        <Avatar size="md" name="Grace Hopper" src="https://i.pravatar.cc/96?img=47" />
        <Avatar size="lg" name="Alan Turing" src="https://broken.example/avatar.png" />
      </Flex>
      <AvatarGroup max={3}>
        <Avatar name="Ada Lovelace" />
        <Avatar name="Grace Hopper" />
        <Avatar name="Linus Torvalds" />
        <Avatar name="Margaret Hamilton" />
        <Avatar name="Ken Thompson" />
      </AvatarGroup>
    </Flex>
  );
}
