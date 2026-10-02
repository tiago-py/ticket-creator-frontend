import { createContext } from 'react';
import type { LoginData, RegisterData } from '../../schemas';
import type { User } from '../../types';
export interface AuthValue {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}
export const AuthContext = createContext<AuthValue | null>(null);
