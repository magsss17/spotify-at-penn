import axios from 'axios';
import { getNewArtistPlaylists, postNewArtistPlaylist } from '../api/newArtistPlaylists';

jest.mock('axios');

describe('getNewArtistPlaylists', () => {
  it('returns data when successful', async () => {
    const mockData = [{ id: 1, artistName: 'Adele', email: 'adele@example.com' }];
    axios.get.mockResolvedValueOnce({ data: mockData });

    const result = await getNewArtistPlaylists();
    expect(result).toEqual(mockData);
  });

  it('throws an error when no data is returned', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    await expect(getNewArtistPlaylists()).rejects.toThrow('empty data');
  });
});

describe('postNewArtistPlaylist', () => {
  it('returns data when successful', async () => {
    const mockData = { id: 1, artistName: 'Adele', email: 'adele@example.com' };
    axios.post.mockResolvedValueOnce({ data: mockData });

    const result = await postNewArtistPlaylist(
      1,
      'Adele',
      'adele@example.com',
      'https://open.spotify.com/playlist/4FtEFO0tBxQDOoOe7UU2fp',
      'Adele Favorites',
      'My favorite Adele songs',
    );
    expect(result).toEqual(mockData);
  });
});
