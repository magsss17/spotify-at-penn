import axios from 'axios';
import { getPassword, newUser } from '../api/getUserData';

jest.mock('axios');

describe('getPassword', () => {
  it('should return user data if the API call is successful', async () => {
    const username = 'testuser';
    const expectedUserData = { id: username, password: 'testpassword' };
    axios.get.mockResolvedValueOnce({ data: expectedUserData });
    const userData = await getPassword(username);
    expect(userData).toEqual(expectedUserData);
  });

  it('should throw an error if the API returns empty data', async () => {
    const username = 'nonexistentuser';
    axios.get.mockResolvedValueOnce({ data: {} });
    await expect(getPassword(username)).rejects.toThrow('Invalid username');
  });
});

describe('newUser', () => {
  it('should return user data if the API call is successful', async () => {
    const email = 'test@example.com';
    const first = 'Test';
    const last = 'User';
    const password = 'testpassword';
    const expectedUserData = {
      id: email, first, last, password,
    };
    axios.post.mockResolvedValueOnce({ data: expectedUserData });
    const userData = await newUser(email, first, last, password);
    expect(userData).toEqual(expectedUserData);
  });
});
