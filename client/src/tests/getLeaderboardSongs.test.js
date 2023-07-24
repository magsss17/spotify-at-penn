import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import getSongs from '../api/getLeaderboardSongs';

const mockAxios = new MockAdapter(axios);

describe('the api returned correct song for rank 1', () => {
  mockAxios.onGet().reply(200, {
    rank: 1, title: 'abc', album: 'ABC', jammies: 12, likes: true,
  });

  test('the song title is abc', async () => {
    const data = await getSongs();
    expect(data.title).toBe('abc');
  });

  test('the album is correct', async () => {
    const data = await getSongs();
    expect(data.album).toBe('ABC');
  });

  test('the jammies is correct', async () => {
    const data = await getSongs();
    expect(data.jammies).toBe(12);
  });

  test('the like is correct', async () => {
    const data = await getSongs();
    expect(data.likes).toBe(true);
  });
});
