import { API_URL } from './authService';

// Busca dados de uma seção do site no backend
export async function fetchSection<T>(section: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${API_URL}/get_data.php?section=${section}`, {
      credentials: 'include',
    });
    if (!response.ok) return fallback;
    const result = await response.json();
    return result.success && result.data !== null ? result.data as T : fallback;
  } catch {
    return fallback;
  }
}

// Salva dados de uma seção do site no backend
export async function saveSection<T>(section: string, data: T): Promise<T> {
  const response = await fetch(`${API_URL}/update_data.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ section, data }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(err.message || 'Erro ao salvar');
  }

  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Erro ao salvar');
  return result.data as T;
}
