import axios from 'axios';
import { getPlaylists, postNewPlaylist } from '../api/userPlaylists';

jest.mock('axios');

describe('playlistApi', () => {
  describe('getPlaylists', () => {
    it('should return data if response has data', async () => {
      const mockData = [{ id: 1, name: 'Playlist 1', desc: 'Playlist 1 description' }];
      axios.get.mockResolvedValueOnce({ data: mockData });
      const result = await getPlaylists();
      expect(result).toEqual(mockData);
    });

    it('should throw an error if response does not have data', async () => {
      axios.get.mockResolvedValueOnce({ data: [] });
      await expect(getPlaylists()).rejects.toThrow('empty data');
    });
  });

  describe('postNewPlaylist', () => {
    it('should return data if request is successful', async () => {
      const mockData = { id: 1, name: 'Playlist 1', desc: 'Playlist 1 description' };
      axios.post.mockResolvedValueOnce({ data: mockData });
      const result = await postNewPlaylist(1, 'Playlist 1', 'Playlist 1 description');
      expect(result).toEqual(mockData);
    });
  });
});
