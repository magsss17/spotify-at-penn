import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getPassword } from '../api/getUserData';

const mockAxios = new MockAdapter(axios);

describe('getPassword', () => {
  test('returns the correct data for a valid username', async () => {
    const username = 'johndoe';
    const expectedData = { id: username, password: 'password' };
    mockAxios.onGet(`http://localhost:8000/user/${username}`).reply(200, expectedData);
    const data = await getPassword(username);
    expect(data).toEqual(expectedData);
  });

  test('throws an error for an invalid username', async () => {
    const username = 'invaliduser';
    mockAxios.onGet(`http://localhost:8000/user/${username}`).reply(404);
    await expect(getPassword(username)).rejects.toThrow();
  });

  test('throws an error if the API call fails', async () => {
    const username = 'johndoe';
    mockAxios.onGet(`http://localhost:8000/user/${username}`).networkError();
    await expect(getPassword(username)).rejects.toThrow();
  });

  test('returns the correct data for a username with special characters', async () => {
    const username = 'john.doe@example.com';
    const expectedData = { id: username, password: 'password' };
    mockAxios.onGet(`http://localhost:8000/user/${username}`).reply(200, expectedData);
    const data = await getPassword(username);
    expect(data).toEqual(expectedData);
  });
});
