import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { authService } from '../../services/authService';
import type { LoginData, RegisterData } from '../../schemas';
import type { User } from '../../types';
import { AuthContext } from './authContextValue';
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    authService
      .me()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    const clear = () => setUser(null);
    window.addEventListener('auth:unauthorized', clear);
    return () => window.removeEventListener('auth:unauthorized', clear);
  }, []);
  const login = useCallback(async (data: LoginData) => setUser(await authService.login(data)), []);
  const register = useCallback(
    async (data: RegisterData) => setUser(await authService.register(data)),
    [],
  );
  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
