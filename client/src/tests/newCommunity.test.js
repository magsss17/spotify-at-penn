import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { newCommunity } from '../api/getCommunities';

const mockAxios = new MockAdapter(axios);

describe('newUser', () => {
  test('returns the correct data for a valid request', async () => {
    const name = 'Second test Community';
    const image = 'https://cdn.vox-cdn.com/thumbor/rUje72-KDI-XYKbKnvYxov-ueyQ=/0x0:1000x655/1400x1050/filters:focal(420x248:580x408):format(jpeg)/cdn.vox-cdn.com/uploads/chorus_image/image/48671171/shutterstock_114033616.0.jpg';
    const numMember = '1';
    const desc = 'this is the second testing community';
    const expectedData = {
      name: name, image: image, numMember: numMember, desc: desc,
    };
    mockAxios.onPost('http://localhost:8000/communities').reply(200, expectedData);
    const data = await newCommunity(name, desc);
    expect(data).toEqual(expectedData);
  });
});
