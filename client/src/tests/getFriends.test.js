import axios from 'axios';
import getFriends from '../api/getFriends';

jest.mock('axios');

describe('getFriends', () => {
  it('should return data on successful request', async () => {
    const data = [{ name: 'Alice', avatar: 'https://example.com/alice.jpg' }];
    axios.get.mockResolvedValue({ data });

    const response = await getFriends();
    expect(response).toEqual(data);
  });

  it('should reject with error on failed request', async () => {
    const error = new Error('Network Error');
    axios.get.mockRejectedValue(error);

    await expect(getFriends()).rejects.toThrow(error);
  });
});
