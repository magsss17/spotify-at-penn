import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getOtherUsers } from '../api/getUsers';

const mockAxios = new MockAdapter(axios);

describe('the api returned correct communities', () => {
  mockAxios.onGet().reply(200, {
    id: 5,
    avatar: 'https://images.nightcafe.studio//assets/profile.png?tr=w-1600,c-at_max',
    name: 'Student 2',
  });

  test('id being 5', async () => {
    const data = await getOtherUsers();
    expect(data.id).toBe(5);
  });

  test('check that avatar is not null', async () => {
    const data = await getOtherUsers();
    expect(data.avatar).not.toBeNull();
  });

  test('test student name', async () => {
    const data = await getOtherUsers();
    expect(data.name).toBe('Student 2');
  });
});
