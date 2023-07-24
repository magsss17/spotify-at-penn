import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Table, Group, ScrollArea, Center, Title, Space, Paper, createStyles, rem, Stack, ActionIcon,
} from '@mantine/core';
import { getPlaylists } from '../api/getAllPlaylists';
import { likes, nolikes } from '../assets/likes';
import togglePlaylistLikes from '../api/playlistFeedAPI';

const useStyles = createStyles((theme) => ({
  card: {
    height: rem(200),
    // width: rem(200),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },

  name: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 500,
    color: theme.white,
    lineHeight: 1.2,
    fontSize: rem(25),
    marginTop: theme.spacing.xs,
  },

  numMember: {
    color: theme.black,
    opacity: 0.7,
    fontWeight: 700,
    textTransform: 'uppercase',
    zIndex: 2,
  },
}));

// const [reload, setReload] = useState(false);

function Card({ item }) {
  const { classes } = useStyles();
  //   const { image, name, numMember } = item;
  const { image, name } = item;

  function handleClick(itm) {
    try {
      togglePlaylistLikes(itm).then(() => {
        // setReload(!reload);
      });
    } catch (error) { /* do nothing */ }
  }

  return (
    <Paper
      shadow="md"
      p="xl"
      radius="md"
      sx={{ backgroundImage: `url(${image})` }}
      className={classes.card}
    >
      <div>
        {/* <Text className={classes.numMember} size="xs">
          {`${parseInt(numMember, 10)} ${parseInt(numMember, 10) === 1 ? 'member' : 'members'}`}
        </Text> */}
        <Title order={3} className={classes.name}>
          {name}
        </Title>
      </div>
      <ActionIcon onClick={() => handleClick(item)} size="xs">
        <img src={item.likes ? likes : nolikes} alt="Likes" />
      </ActionIcon>
    </Paper>
  );
}

Card.propTypes = {
  item: PropTypes.shape({
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    likes: PropTypes.bool.isRequired,
  }).isRequired,
};

export function PlaylistFeed() {
  const [rows, setRows] = useState(null);

  useEffect(() => {
    getPlaylists()
      .then((data) => {
        if (data.length === 0) {
          throw new Error('empty data');
        }
        setRows(
          data.map((item) => (
            <tr key={item.name}>
              <td>
                <Card item={item} />
              </td>
            </tr>
          )),
        );
      })
      .catch(() => setRows(
        <tr>
          <td>
            <Group spacing="sm" position="center">
              No Playlists!
            </Group>
          </td>
        </tr>,
      ));
  }, []);

  return (
    <Center>
      <Stack>
        <Space h="xl" />
        <Title align="center"> Playlist Feed </Title>
        <Space h="xl" />
        <ScrollArea>
          <Table sx={{ minWidth: 800 }} verticalSpacing="md">
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      </Stack>
    </Center>
  );
}

export default PlaylistFeed;
