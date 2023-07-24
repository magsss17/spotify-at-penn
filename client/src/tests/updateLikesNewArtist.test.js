import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import updateLikes from '../api/updateLikesNewArtist';

describe('updateLikes', () => {
  const mock = new MockAdapter(axios);

  afterEach(() => {
    mock.reset();
  });

  it('should update the likes of a playlist item', async () => {
    const item = { id: 1, likes: false };
    const expectedResponse = { id: 1, likes: true };
    mock.onPatch(`http://localhost:8000/newartistplaylists/${item.id}`).reply(200, expectedResponse);

    const response = await updateLikes(item);

    expect(response).toEqual(expectedResponse);
  });
});
