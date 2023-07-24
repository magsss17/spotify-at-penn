/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import updateMessages from '../api/messages';

const mockAxios = new MockAdapter(axios);

describe('updateMessages function', () => {
  const socket = 1;
  const newMessages = [
    { text: 'hello', sender: 'admin@gmail.com' },
    { text: 'hi', sender: 'user@gmail.com' },
    { text: 'hey', sender: 'user2@gmail.com' },
  ];
  const data = { id: socket, messages: newMessages };
  const expectedData = data;

  test('returns updated data for given socket and messages', async () => {
    mockAxios.onPut(`http://localhost:8000/sockets/${socket}`).reply(200, data);
    const res = await updateMessages(socket, newMessages);
    expect(res).toEqual(expectedData);
  });

  test('handles error if request fails', async () => {
    mockAxios.onPut(`http://localhost:8000/sockets/${socket}`).reply(500);
    const res = await updateMessages(socket, newMessages);
    expect(res).toEqual([]);
  });
});
