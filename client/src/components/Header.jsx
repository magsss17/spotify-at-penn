import React, { useEffect, useState } from 'react';
import {
  createStyles,
  Header,
  Group,
  Button,
  Box,
  Burger,
  rem,
  Image,
  Text,
  Avatar,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import { darkLogo } from '../assets/logos';
import { getFullName } from '../api/getUserData';

const useStyles = createStyles((theme) => ({
  link: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,

    [theme.fn.smallerThan('sm')]: {
      height: rem(42),
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },

    ...theme.fn.hover({
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    }),
  },

  subLink: {
    width: '100%',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    borderRadius: theme.radius.md,

    ...theme.fn.hover({
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
    }),

    '&:active': theme.activeStyles,
  },

  hiddenDesktop: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },
}));

function MainHeader() {
  const [drawerOpened, { toggle: toggleDrawer }] = useDisclosure(false);
  const [currentUser, setCurrentUser] = useState('');
  const [fullName, setFullName] = useState('');
  const { classes } = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    if (window.sessionStorage.getItem('sessionId') === null) {
      navigate('/login');
    } else {
      setCurrentUser(window.sessionStorage.getItem('sessionId'));
    }
  }, []);

  useEffect(() => {
    getFullName(currentUser).then((data) => {
      setFullName(data);
    });
  }, [currentUser]);

  function clearAccessToken() {
    window.sessionStorage.removeItem('sessionId');
    window.sessionStorage.removeItem('accessToken');
    window.sessionStorage.removeItem('imageURL');
  }

  return (
    <Box>
      <Header height={60} px="md">
        <Group position="apart" sx={{ height: '100%' }}>

          <Group sx={{ height: '100%' }} spacing={0} className={classes.hiddenMobile}>
            <a href="/home">
              <Image
                width={180}
                height={50}
                fit="contain"
                src={darkLogo}
                alt="logo"
              />
            </a>

            <a href="/leaderboard" className={classes.link}>
              Leaderboard
            </a>
            <a href="/communities" className={classes.link}>
              Community
            </a>
            <a href="/chat" className={classes.link}>
              Chat
            </a>
            <a href="/users" className={classes.link}>
              Find Friends
            </a>
            <a href="/newartists" className={classes.link}>
              New Artists
            </a>
            <a href="/playlistfeed" className={classes.link}>
              Playlist Feed
            </a>
          </Group>
          <Group className={classes.hiddenMobile}>
            <Text>{`${(fullName || '')} (${currentUser})`}</Text>
            <Avatar
              component="a"
              href={`http://localhost:${window.location.port}/profile`}
              onClick={() => navigate('/profile')}
              src={window.sessionStorage.getItem('imageURL')}
              alt="User"
              radius="xl"
            />
            <Button color="dark" onClick={(() => { clearAccessToken(); navigate('/login'); })}>Log out</Button>
          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} className={classes.hiddenDesktop} />
        </Group>
      </Header>
    </Box>
  );
}

export default MainHeader;
