import { GalleryAlbum } from '../types';
import { API_URL } from './authService';

export const galleryService = {
  getAll: async (): Promise<GalleryAlbum[]> => {
    try {
      const response = await fetch(`${API_URL}/get_gallery.php`);
      if (!response.ok) return [];

      const result = await response.json();
      return result.success ? result.gallery : [];
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  update: async (gallery: GalleryAlbum[]): Promise<GalleryAlbum[]> => {
    // A API de escrita da galeria não será abordada nesta etapa.
    // Preservando a função para não quebrar a lógica global do SiteContext.
    return gallery;
  }
};
