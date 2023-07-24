import { getOtherUsers } from '../api/getUsers';

jest.mock('../api/getUsers.js');

getOtherUsers.mockResolvedValue({
  id: 4, avatar: 'https://images.nightcafe.studio//assets/profile.png?tr=w-1600,c-at_max', name: 'Student 1',
});

test('User id is 4', async () => {
  const data = await getOtherUsers();
  expect(data.id).toBe(4);
});

test('avatar is not null', async () => {
  const data = await getOtherUsers();
  expect(data.avatar).not.toBeNull();
});

test('Student name is Student 1', async () => {
  const data = await getOtherUsers();
  expect(data.name).toBe('Student 1');
});
