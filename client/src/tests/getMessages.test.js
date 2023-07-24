/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import getMessages from '../api/messages';

const mockAxios = new MockAdapter(axios);

describe('getMessages function', () => {
  const socket = 1;
  const data = [
    { text: 'hello', sender: 'admin@gmail.com' },
  ];
  const expectedMessages = data.messages;

  test('returns correct messages for given socket', async () => {
    mockAxios.onGet(`http://localhost:8000/sockets/${socket}`).reply(200, data);
    const messages = await getMessages(socket);
    expect(messages).toEqual(expectedMessages);
  });

  test('handles error if request fails', async () => {
    mockAxios.onGet(`http://localhost:8000/sockets/${socket}`).reply(500);
    const messages = await getMessages(socket);
    expect(messages).toEqual([]);
  });
});
