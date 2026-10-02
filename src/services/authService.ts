import type { LoginData, RegisterData } from '../schemas';
import type { User, UserRole } from '../types';
import { httpClient, tokenStorage } from './httpClient';
type ApiRole = 'SOLICITANTE' | 'ATENDENTE';
type ApiUser = { id: string; name: string; email: string; initials: string; role: ApiRole };
type Session = { accessToken: string; user: ApiUser };
const mapRole = (role: ApiRole): UserRole => (role === 'ATENDENTE' ? 'atendente' : 'solicitante');
const mapUser = (user: ApiUser): User => ({ ...user, role: mapRole(user.role) });
export const authService = {
  async login(data: LoginData) {
    const session = await httpClient<Session>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    tokenStorage.set(session.accessToken);
    return mapUser(session.user);
  },
  async register(data: RegisterData) {
    const session = await httpClient<Session>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ ...data, role: data.role.toUpperCase() }),
    });
    tokenStorage.set(session.accessToken);
    return mapUser(session.user);
  },
  async me() {
    if (!tokenStorage.get()) return null;
    return mapUser(await httpClient<ApiUser>('/auth/me'));
  },
  async logout() {
    try {
      if (tokenStorage.get()) await httpClient<void>('/auth/logout', { method: 'POST' });
    } finally {
      tokenStorage.clear();
    }
  },
};
