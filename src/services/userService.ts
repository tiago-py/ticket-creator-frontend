import type { User } from '../types';
import { httpClient } from './httpClient';

type ApiUser = Pick<User, 'id' | 'name' | 'email'>;

export const userService = {
  attendants: () => httpClient<ApiUser[]>('/users/attendants'),
};
