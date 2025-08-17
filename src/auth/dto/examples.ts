import { Roles } from '../roles'; // Import the roles

export const createUserDtoExample = {
  summary: 'Пример регистрации',
  value: {
    username: 'user',
    email: 'user@example.com',
    password: 'user',
    role: Roles.USER,
  },
};

export const loginUserDtoExample = {
  summary: 'Пример авторизации',
  value: {
    username: 'user',
    password: 'user',
  },
};
