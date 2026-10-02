const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';
const TOKEN_KEY = 'atende_access_token';
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};
export async function httpClient<T>(path: string, init?: RequestInit): Promise<T> {
  const token = tokenStorage.get();
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...init?.headers,
    },
  });
  if (response.status === 401) {
    tokenStorage.clear();
    window.dispatchEvent(new Event('auth:unauthorized'));
  }
  if (!response.ok) {
    let message = 'Não foi possível concluir a operação';
    try {
      const body = (await response.json()) as { message?: string | string[] };
      if (body.message)
        message = Array.isArray(body.message) ? body.message.join('. ') : body.message;
    } catch {
      /* resposta sem JSON */
    }
    throw new ApiError(message, response.status);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
