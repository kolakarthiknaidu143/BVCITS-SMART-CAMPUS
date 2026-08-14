const API_BASE_URL = '/api';

export const getAuthToken = () => localStorage.getItem('bvcits_jwt_token');

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('bvcits_jwt_token', token);
  } else {
    localStorage.removeItem('bvcits_jwt_token');
  }
};

export async function apiFetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data: any = {};
  try {
    data = await response.json();
  } catch (err) {
    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}: ${response.statusText}`);
    }
  }

  if (!response.ok) {
    throw new Error(data.message || data.error || `API error (${response.status}): ${response.statusText}`);
  }

  return data;
}
