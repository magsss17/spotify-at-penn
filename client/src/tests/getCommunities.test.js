import axios from 'axios';
import { getCommunities, newCommunity } from '../api/getCommunities';

jest.mock('axios');

describe('getCommunities', () => {
  it('fetches successfully data from an API', async () => {
    const data = [{ name: 'Community 1' }, { name: 'Community 2' }];
    axios.get.mockImplementationOnce(() => Promise.resolve({ data }));
    await expect(getCommunities()).resolves.toEqual(data);
  });

  it('throws an error when no data is returned', async () => {
    const errorMessage = 'Request failed with status code 404';
    axios.get.mockImplementationOnce(() => Promise.reject(new Error(errorMessage)));
    await expect(getCommunities()).rejects.toThrow(errorMessage);
  });
});

describe('newCommunity', () => {
  it('sends post request and returns data', async () => {
    const data = { name: 'Community 3', description: 'This is the third community' };
    axios.post.mockImplementationOnce(() => Promise.resolve({ data }));
    await expect(newCommunity(data.name, data.description)).resolves.toEqual(data);
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:8000/communities',
      {
        name: data.name,
        image: 'https://cdn.vox-cdn.com/thumbor/rUje72-KDI-XYKbKnvYxov-ueyQ=/0x0:1000x655/1400x1050/filters:focal(420x248:580x408):format(jpeg)/cdn.vox-cdn.com/uploads/chorus_image/image/48671171/shutterstock_114033616.0.jpg',
        numMember: '1',
        description: data.description,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  });

  it('throws an error when post request fails', async () => {
    const errorMessage = 'Request failed with status code 500';
    axios.post.mockImplementationOnce(() => Promise.reject(new Error(errorMessage)));
    await expect(newCommunity('Community 3', 'This is the third community')).rejects.toThrow(errorMessage);
  });
});
