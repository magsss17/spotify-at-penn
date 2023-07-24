import React from 'react';
import {
  Title,
} from '@mantine/core';
import Feed from './NewArtistsFeed';

export default function NewArtistsPage() {
  return (
    <>
      <Title align="center" size={80} my={50}>
        New Artists @ Penn
      </Title>
      <Feed />
    </>
  );
}
