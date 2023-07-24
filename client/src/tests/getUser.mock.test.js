import getUsers from '../api/getLoginUser';

jest.mock('../api/getLoginUser.js');

getUsers.mockResolvedValue({
  id: 'admin@gmail.com', firstName: 'admin', lastName: 'admin', password: 'password',
});

test('the first name is admin', async () => {
  const data = await getUsers('admin@gmail.com');
  expect(data.firstName).toBe('admin');
});

test('the last name is admin', async () => {
  const data = await getUsers('admin@gmail.com');
  expect(data.lastName).toBe('admin');
});

test('the password is password', async () => {
  const data = await getUsers('admin@gmail.com');
  expect(data.password).toBe('password');
});
