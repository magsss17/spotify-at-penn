import React from 'react';
import {
  Space,
} from '@mantine/core';
import NewFriends from './NewFriendsTable';

function UserList() {
  return (
    <>
      <Space h="xl" />
      <NewFriends />
      <Space h="40px" />
    </>
  );
}
export default UserList;
