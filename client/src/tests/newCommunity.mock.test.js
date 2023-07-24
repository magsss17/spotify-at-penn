import { newCommunity } from "../api/getCommunities";

jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({
    data: {
      name: 'Test Community', 
      image: 'https://cdn.vox-cdn.com/thumbor/rUje72-KDI-XYKbKnvYxov-ueyQ=/0x0:1000x655/1400x1050/filters:focal(420x248:580x408):format(jpeg)/cdn.vox-cdn.com/uploads/chorus_image/image/48671171/shutterstock_114033616.0.jpg',
      numMember: '1', 
      desc: 'testing testing testing'
    },
  })),
}));

describe('newCommunity function using axios mock', () => {
  test('should return correct name', async () => {
    const data = await newCommunity('Test Community', 'testing testing testing');
    expect(data.name).toBe('Test Community');
  });

  test('initial number of member should be 1', async () => {
    const data = await newCommunity('Test Community', 'testing testing testing');
    expect(data.numMember).toBe('1');
  });

  test('default image', async () => {
    const data = await newCommunity('Test Community', 'testing testing testing');
    expect(data.image).toBe('https://cdn.vox-cdn.com/thumbor/rUje72-KDI-XYKbKnvYxov-ueyQ=/0x0:1000x655/1400x1050/filters:focal(420x248:580x408):format(jpeg)/cdn.vox-cdn.com/uploads/chorus_image/image/48671171/shutterstock_114033616.0.jpg');
  });

  test('default image', async () => {
    const data = await newCommunity('Test Community', 'testing testing testing');
    expect(data.desc).toBe('testing testing testing');
  });
});