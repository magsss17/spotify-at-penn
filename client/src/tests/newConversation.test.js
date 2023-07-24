/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import newConversation from '../api/messages';

const mockAxios = new MockAdapter(axios);

describe('newConversation function', () => {
  const socket = 1;
  const data = { id: socket, messages: [] };
  const expectedData = data;

  test('returns new conversation for given socket', async () => {
    mockAxios.onPost('http://localhost:8000/sockets').reply(200, data);
    const res = await newConversation(socket);
    expect(res).toEqual(expectedData);
  });

  test('handles error if request fails', async () => {
    mockAxios.onPost('http://localhost:8000/sockets').reply(500);
    const res = await newConversation(socket);
    expect(res).toEqual([]);
  });
});
