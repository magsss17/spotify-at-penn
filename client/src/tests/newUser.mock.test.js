import { newUser } from '../api/getUserData';

jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({
    data: {
      id: 'test@test.com', first: 'John', last: 'Doe', password: 'password',
    },
  })),
}));

describe('newUser function using axios mock', () => {
  test('should return correct id', async () => {
    const data = await newUser('test@test.com', 'John', 'Doe', 'password');
    expect(data.id).toBe('test@test.com');
  });

  test('should return correct first name', async () => {
    const data = await newUser('test@test.com', 'John', 'Doe', 'password');
    expect(data.first).toBe('John');
  });

  test('should return correct last name', async () => {
    const data = await newUser('test@test.com', 'John', 'Doe', 'password');
    expect(data.last).toBe('Doe');
  });

  test('should return correct password', async () => {
    const data = await newUser('test@test.com', 'John', 'Doe', 'password');
    expect(data.password).toBe('password');
  });

  test('should return a resolved Promise', () => {
    expect.assertions(1);
    return newUser('test@test.com', 'John', 'Doe', 'password').then((data) => expect(data).toBeDefined());
  });
});
