import { API_BASE_URL } from '../config';

function getToken() {
  return localStorage.getItem('access_token');
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers ?? {}),
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    // intenta leer json de error
    let msg = `${res.status} ${res.statusText}`;
    try {
      const data = await res.json();
      msg = data?.message ? JSON.stringify(data.message) : JSON.stringify(data);
    } catch {}
    throw new Error(msg);
  }

  // 204 no content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}
