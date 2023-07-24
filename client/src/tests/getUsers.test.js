import axios from 'axios';
import { getOtherUsers, getOtherUsersID } from '../api/getUsers';

jest.mock('axios');

describe('otherUsers API', () => {
  describe('getOtherUsers', () => {
    it('should return data from the API', async () => {
      const mockData = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
      axios.get.mockResolvedValueOnce({ data: mockData });

      const result = await getOtherUsers();

      expect(result).toEqual(mockData);
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8000/other-users');
    });

    it('should return an empty array if API returns empty data', async () => {
      axios.get.mockResolvedValueOnce({ data: [] });
      const result = await getOtherUsers();
      expect(result).toEqual([]);
    });

    it('should reject if API returns an error', async () => {
      const error = new Error('API error');
      axios.get.mockRejectedValueOnce(error);

      await expect(getOtherUsers()).rejects.toThrow(error);
    });
  });

  describe('getOtherUsersID', () => {
    it('should return data for the given user ID from the API', async () => {
      const mockData = { id: 1, name: 'John' };
      axios.get.mockResolvedValueOnce({ data: mockData });

      const result = await getOtherUsersID(1);

      expect(result).toEqual(mockData);
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8000/other-users/1');
    });

    it('should reject if API returns an error', async () => {
      const error = new Error('API error');
      axios.get.mockRejectedValueOnce(error);

      await expect(getOtherUsersID(1)).rejects.toThrow(error);
    });
  });
});
