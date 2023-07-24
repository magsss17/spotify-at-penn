/* eslint-disable import/no-named-as-default */
/**
* @jest-environment jsdom
*/

import React from 'react';
import '@testing-library/jest-dom/extend-expect';

// import testing library functions
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import App from '../App';
import FriendsTable from '../components/FriendsTable';
import CommunitiesTable from '../components/CommunitiesTable';

test('renders login page', () => {
  const { getByLabelText, getByText } = render(
    <MemoryRouter initialEntries={['/login']}>
      <App />
    </MemoryRouter>,
  );

  const emailInput = getByLabelText(/Email/i);
  const passwordInput = getByLabelText(/Password/i);
  const signInButton = getByText(/Sign in/i);

  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(signInButton).toBeInTheDocument();
});

test('renders login page correctly', () => {
  const tree = renderer
    .create(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders register page correctly', () => {
  const tree = renderer
    .create(
      <MemoryRouter initialEntries={['/register']}>
        <App />
      </MemoryRouter>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders profile page correctly', () => {
  const tree = renderer
    .create(
      <MemoryRouter initialEntries={['/profile']}>
        <App />
      </MemoryRouter>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders chat page correctly', () => {
  const tree = renderer
    .create(
      <MemoryRouter initialEntries={['/chat']}>
        <App />
      </MemoryRouter>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders users page correctly', () => {
  const tree = renderer
    .create(
      <MemoryRouter initialEntries={['/users']}>
        <App />
      </MemoryRouter>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders communities page correctly', () => {
  const tree = renderer
    .create(
      <MemoryRouter initialEntries={['/communities']}>
        <App />
      </MemoryRouter>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders upload new artists page correctly', () => {
  const tree = renderer
    .create(
      <MemoryRouter initialEntries={['/uploadnewartist']}>
        <App />
      </MemoryRouter>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders new artists page correctly', () => {
  const tree = renderer
    .create(
      <MemoryRouter initialEntries={['/newartists']}>
        <App />
      </MemoryRouter>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders FriendsTable correctly', () => {
  const tree = renderer
    .create(
      <MemoryRouter>
        <FriendsTable />
      </MemoryRouter>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders FriendsTable correctly', () => {
  const tree = renderer
    .create(
      <MemoryRouter>
        <CommunitiesTable />
      </MemoryRouter>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
