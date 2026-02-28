import { MediaItem } from '../types';
import { API_URL } from './authService';

export const mediaService = {
  getAll: async (): Promise<MediaItem[]> => {
    try {
      const response = await fetch(`${API_URL}/get_media.php`);
      if (!response.ok) throw new Error('Falha ao buscar mídias');

      const result = await response.json();
      return result.success ? result.media : [];
    } catch (error) {
      console.error('Erro get_media:', error);
      return [];
    }
  },

  upload: async (file: File): Promise<MediaItem> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/upload_media.php`, {
      method: 'POST',
      body: formData,
      credentials: 'include' // Needed for admin auth session
    });

    if (!response.ok) {
      throw new Error('Falha no upload');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Erro do backend');
    }

    return result.media;
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/delete_media.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ id })
    });

    if (!response.ok) throw new Error('Falha na deleção');

    const result = await response.json();
    if (!result.success) throw new Error(result.message);
  }
};
