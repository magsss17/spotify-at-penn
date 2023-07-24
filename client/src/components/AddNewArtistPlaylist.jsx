
import React from 'react';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';

import {
  TextInput,
  Paper,
  Stack,
  Button,
  Container,
  Title,
} from '@mantine/core';
import { postNewArtistPlaylist } from '../api/newArtistPlaylists';

function addNewArtistPlaylist() {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      artistName: '',
      email: '',
      playlistName: '',
      spotifyURL: '',
      description: '',
    },

    validate: {
      artistName: (val) => (!val.trim() ? 'Name is required' : null),
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      spotifyURL: (val) => (!val.trim() ? 'URL is required' : null),
      playlistName: (val) => (!val.trim() ? 'Playlist name is required' : null),
    },
  });

  const onSubmitHandler = () => {
    const {
      artistName, email, playlistName, spotifyURL, description,
    } = form.values;

    try {
      postNewArtistPlaylist(artistName, email, spotifyURL, playlistName, description);
    } catch (error) {
      return;
    }
    navigate('/newartists');
  };

  return (
    <Container size={420} my={20}>
      <Title
        color="white"
        align="center"
        size={60}
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        New Artists @ Penn
      </Title>
      <Paper withBorder shadow="md" p={30} mt={10} radius="md">
        <form onSubmit={form.onSubmit(() => onSubmitHandler())}>
          <Stack>
            <TextInput
              required
              label="Artist Name"
              placeholder="Artist name"
              variant="filled"
              size="sm"
              value={form.values.artistName}
              onChange={(event) => form.setFieldValue('artistName', event.currentTarget.value)}
              error={form.errors.artistName}
              radius="md"
            />

            <TextInput
              required
              label="Email"
              variant="filled"
              size="sm"
              placeholder="example@upenn.edu"
              value={form.values.email}
              onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
              error={form.errors.email && 'Invalid email'}
              radius="md"
            />

            <TextInput
              required
              label="Spotify Playlist URL"
              placeholder="https://open.spotify.com/playlist/7A4x0PAsV8mQhmcKMYqoh1?si=8116bbd893c84e17&pt=3d25df74e576bbae1f93019beb71cea0"
              variant="filled"
              size="sm"
              value={form.values.spotifyURL}
              onChange={(event) => form.setFieldValue('spotifyURL', event.currentTarget.value)}
              error={form.errors.spotifyURL}
              radius="md"
            />

            <TextInput
              required
              label="Playlist Name"
              placeholder="Rainy Daze"
              variant="filled"
              size="sm"
              value={form.values.playlistName}
              onChange={(event) => form.setFieldValue('playlistName', event.currentTarget.value)}
              error={form.errors.playlistName}
              radius="md"
            />

            <TextInput
              required
              label="Playlist Description"
              placeholder="the daze when it rains"
              variant="filled"
              size="sm"
              value={form.values.description}
              onChange={(event) => form.setFieldValue('description', event.currentTarget.value)}
              radius="md"
            />

            <Button
              type="submit"
              mt="xs"
              radius="md"
              size="md"
            >
              Submit
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}

export default addNewArtistPlaylist;
