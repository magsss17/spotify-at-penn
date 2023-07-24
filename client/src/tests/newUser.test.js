import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { newUser } from '../api/getUserData';

const mockAxios = new MockAdapter(axios);

describe('newUser', () => {
  test('returns the correct data for a valid request', async () => {
    const email = 'johndoe@example.com';
    const firstName = 'John';
    const lastName = 'Doe';
    const password = 'password';
    const expectedData = {
      id: email, first: firstName, last: lastName, password,
    };
    mockAxios.onPost('http://localhost:8000/user').reply(200, expectedData);
    const data = await newUser(email, firstName, lastName, password);
    expect(data).toEqual(expectedData);
  });

  test('throws an error if the request fails', async () => {
    const email = 'johndoe@example.com';
    const firstName = 'John';
    const lastName = 'Doe';
    const password = 'password';
    mockAxios.onPost('http://localhost:8000/user').networkError();
    await expect(newUser(email, firstName, lastName, password)).rejects.toThrow();
  });

  test('throws an error if email is missing', async () => {
    const firstName = 'John';
    const lastName = 'Doe';
    const password = 'password';
    await expect(newUser(undefined, firstName, lastName, password)).rejects.toThrow();
  });
});
