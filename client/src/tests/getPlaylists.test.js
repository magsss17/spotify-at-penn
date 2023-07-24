/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getPlaylists } from '../api/userPlaylists';

const mockAxios = new MockAdapter(axios);

describe('the api returned correct data for admin@gmail.com', () => {
  mockAxios.onGet().reply(200, [
    {
      id: '1',
      name: 'Playlist 1',
      desc: 'Hype songs',
    },
    {
      id: '2',
      name: 'Playlist 2',
      desc: 'Study jamss',
    },
    {
      id: '432nvsd',
      name: 'hello',
      desc: 'chill',
    },
    {
      id: 'abhijay',
      name: 'abhijay',
      desc: 'agarwal',
    },
    {
      id: 'vjfsak234',
      name: 'benjams',
      desc: 'jams for the ben',
    },
    {
      id: '43visf9vs0j3',
      name: 'metal is heavy',
      desc: 'heavy metal',
    },
  ]);

  test('the first playlist is correct', async () => {
    const data = await getPlaylists();
    expect(data[0].name).toBe('Playlist 1');
  });

  test('the third playlist has correct id', async () => {
    const data = await getPlaylists();
    expect(data[2].id).toBe('432nvsd');
  });

  test('the fifth playlist has correct description', async () => {
    const data = await getPlaylists();
    expect(data[4].desc).toBe('jams for the ben');
  });

  test('correct number of playlists returned', async () => {
    const data = await getPlaylists();
    expect(data.length).toBe(6);
  });
});
