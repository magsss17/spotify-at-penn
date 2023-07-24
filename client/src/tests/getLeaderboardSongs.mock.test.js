import getSongs from '../api/getLeaderboardSongs';

jest.mock('../api/getLeaderboardSongs.js');

getSongs.mockResolvedValue({
  rank: 1, title: 'abc', album: 'ABC', jammies: 12, likes: true,
});

test('the title is abc', async () => {
  const data = await getSongs(1);
  expect(data.title).toBe('abc');
});

test('the album is ABC', async () => {
  const data = await getSongs(1);
  expect(data.album).toBe('ABC');
});

test('the jammies is right', async () => {
  const data = await getSongs(1);
  expect(data.jammies).toBe(12);
});

test('the likes is right', async () => {
  const data = await getSongs(1);
  expect(data.likes).toBe(true);
});
