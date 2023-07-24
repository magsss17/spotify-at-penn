import axios from 'axios';
import getConversations from '../api/getConversations';

jest.mock('axios');

describe('getConversations', () => {
  it('fetches conversations successfully from the API', async () => {
    const data = [{ id: 1, title: 'Conversation 1' }, { id: 2, title: 'Conversation 2' }];
    axios.get.mockImplementationOnce(() => Promise.resolve({ data }));

    await expect(getConversations()).resolves.toEqual(data);

    expect(axios.get).toHaveBeenCalledWith('http://localhost:8000/conversations');
  });

  it('returns an error when failed to fetch conversations from the API', async () => {
    const errorMessage = 'Failed to fetch conversations';
    axios.get.mockImplementationOnce(() => Promise.reject(new Error(errorMessage)));

    await expect(getConversations()).rejects.toThrow(errorMessage);
  });
});
