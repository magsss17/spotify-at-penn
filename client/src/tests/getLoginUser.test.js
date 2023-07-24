import axios from 'axios';
import getUsers from '../api/getLoginUser';

jest.mock('axios');

describe('getUsers', () => {
  it('should return user data for a given id', async () => {
    const id = 123;
    const userData = { id, name: 'John Doe', email: 'john.doe@example.com' };
    axios.get.mockResolvedValueOnce({ data: userData });

    const result = await getUsers(id);

    expect(axios.get).toHaveBeenCalledWith(`https://localhost:8000/user/${id}`);
    expect(result).toEqual(userData);
  });

  it('should throw an error if API returns empty data', async () => {
    const id = 456;
    axios.get.mockResolvedValueOnce({ data: {} });

    await expect(getUsers(id)).rejects.toThrow('empty data');
  });

  it('should reject if API returns an error', async () => {
    const id = 789;
    axios.get.mockRejectedValueOnce(new Error('API error'));

    await expect(getUsers(id)).rejects.toThrow('API error');
  });
});
