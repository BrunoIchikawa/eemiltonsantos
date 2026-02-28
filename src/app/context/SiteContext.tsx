import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

// Services
import { homeService } from '../../services/homeService';
import { projectService } from '../../services/projectService';
import { eventService } from '../../services/eventService';
import { faqService } from '../../services/faqService';
import { galleryService } from '../../services/galleryService';
import { mediaService } from '../../services/mediaService';
import { generalService } from '../../services/generalService';

// Types
import {
  SiteData, GeneralSettings, TeamMember, Project, Event, Award, AboutSection,
  Platform, FAQItem, GalleryAlbum, HomeData, Slide, MediaItem, Popup
} from '../../types';

// --- Context Type ---

interface SiteContextType {
  data: SiteData;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  updateGeneral: (settings: Partial<GeneralSettings>) => void;
  updateTeam: (team: TeamMember[]) => void;
  updateProjects: (projects: Project[]) => void;
  updateEvents: (events: Event[]) => void;
  updateAwards: (awards: Award[]) => void;
  updateAbout: (about: Partial<AboutSection>) => void;
  updatePlatforms: (platforms: Platform[]) => void;
  updateFAQ: (faq: FAQItem[]) => void;
  updateGallery: (gallery: GalleryAlbum[]) => void;
  updateHome: (home: Partial<HomeData>) => void;
  updateSlides: (slides: Slide[]) => void;
  addMedia: (media: MediaItem) => void; // Legacy support
  uploadFile: (file: File) => Promise<MediaItem | null>; // New upload method
  deleteMedia: (id: string) => void;
  updatePopups: (popups: Popup[]) => void;
}

// Default empty state to prevent null checks everywhere before data loads
const defaultState: SiteData = {
  general: {
    schoolName: '', phone: '', whatsapp: '', emailSecretaria: '', emailDiretoria: '', address: '', mapUrl: '', socials: [], footerText: ''
  },
  home: {
    heroTitle: '', heroSubtitle: '', heroImage: '', welcomeTitle: '', welcomeText: '', warnings: [],
    schoolMenu: {
      enabled: false, title: '', updatedAt: '',
      weekMenu: { monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' }
    }
  },
  slides: [],
  platforms: [],
  faq: [],
  media: [],
  team: [],
  projects: [],
  events: [],
  awards: [],
  about: {
    history: '', mission: '', vision: '', values: [], infrastructure: [], stats: [], images: [], mainImage: ''
  },
  gallery: [],
  popups: []
};

// --- Context ---

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(defaultState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        general, team, projects, events, awards, about, platforms, faq, gallery, home, slides, media, popups
      ] = await Promise.all([
        generalService.getSettings(),
        generalService.getTeam(),
        projectService.getAll(),
        eventService.getAll(),
        generalService.getAwards(),
        generalService.getAbout(),
        generalService.getPlatforms(),
        faqService.getAll(),
        galleryService.getAll(),
        homeService.get(),
        generalService.getSlides(),
        mediaService.getAll(),
        generalService.getPopups()
      ]);

      setData({
        general, team, projects, events, awards, about, platforms, faq, gallery, home, slides, media, popups
      });

    } catch (err) {
      console.error("Failed to load site data", err);
      setError("Falha ao carregar dados do servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Wrappers for services
  // Note: We don't await these in the UI handlers to keep UI responsive, 
  // but we update local state immediately (optimistic update) or after promise resolves.
  // Here we update state AFTER promise resolves to ensure backend consistency.

  const updateGeneral = (s: Partial<GeneralSettings>) => {
    generalService.updateSettings(s).then(updated => {
      setData(prev => ({ ...prev, general: updated }));
      toast.success("Configurações salvas");
    }).catch(() => toast.error("Erro ao atualizar configurações"));
  };

  const updateTeam = (t: TeamMember[]) => {
    generalService.updateTeam(t).then(updated => {
      setData(prev => ({ ...prev, team: updated }));
      toast.success("Equipe atualizada");
    }).catch(() => toast.error("Erro ao atualizar equipe"));
  };

  const updateProjects = (p: Project[]) => {
    projectService.update(p).then(updated => {
      setData(prev => ({ ...prev, projects: updated }));
      toast.success("Projetos atualizados");
    }).catch(() => toast.error("Erro ao atualizar projetos"));
  };

  const updateEvents = (evt: Event[]) => {
    eventService.update(evt).then(updated => {
      setData(prev => ({ ...prev, events: updated }));
      toast.success("Eventos atualizados");
    }).catch(() => toast.error("Erro ao atualizar eventos"));
  };

  const updateAwards = (awards: Award[]) => {
    generalService.updateAwards(awards).then(updated => {
      setData(prev => ({ ...prev, awards: updated }));
      toast.success("Prêmios atualizados");
    }).catch(() => toast.error("Erro ao atualizar prêmios"));
  };

  const updateAbout = (a: Partial<AboutSection>) => {
    generalService.updateAbout(a).then(updated => {
      setData(prev => ({ ...prev, about: updated }));
      toast.success("Seção Sobre atualizada");
    }).catch(() => toast.error("Erro ao atualizar sobre"));
  };

  const updatePlatforms = (plt: Platform[]) => {
    generalService.updatePlatforms(plt).then(updated => {
      setData(prev => ({ ...prev, platforms: updated }));
      toast.success("Plataformas atualizadas");
    }).catch(() => toast.error("Erro ao atualizar plataformas"));
  };

  const updateFAQ = (f: FAQItem[]) => {
    faqService.update(f).then(updated => {
      setData(prev => ({ ...prev, faq: updated }));
      toast.success("FAQ atualizado");
    }).catch(() => toast.error("Erro ao atualizar FAQ"));
  };

  const updateGallery = (g: GalleryAlbum[]) => {
    galleryService.update(g).then(updated => {
      setData(prev => ({ ...prev, gallery: updated }));
      toast.success("Galeria atualizada");
    }).catch(() => toast.error("Erro ao atualizar galeria"));
  };

  const updateHome = (h: Partial<HomeData>) => {
    homeService.update(h).then(updated => {
      setData(prev => ({ ...prev, home: updated }));
      toast.success("Home atualizada");
    }).catch(() => toast.error("Erro ao atualizar Home"));
  };

  const updateSlides = (s: Slide[]) => {
    generalService.updateSlides(s).then(updated => {
      setData(prev => ({ ...prev, slides: updated }));
      toast.success("Slides atualizados");
    }).catch(() => toast.error("Erro ao atualizar slides"));
  };

  const updatePopups = (popups: Popup[]) => {
    generalService.updatePopups(popups).then(updated => {
      setData(prev => ({ ...prev, popups: updated }));
      toast.success("Popups atualizados");
    }).catch(() => toast.error("Erro ao atualizar popups"));
  };

  // Legacy support - keeps accepting MediaItem for compatibility
  const addMedia = (media: MediaItem) => {
    // In a real refactor, we should find who calls this and change it to uploadFile
    // For now, we simulate adding it to the list
    setData(prev => ({ ...prev, media: [...prev.media, media] }));
  };

  const uploadFile = async (file: File) => {
    try {
      const newMedia = await mediaService.upload(file);
      setData(prev => ({ ...prev, media: [newMedia, ...prev.media] }));
      toast.success("Upload concluído");
      return newMedia;
    } catch (e) {
      toast.error("Erro ao fazer upload");
      return null;
    }
  };

  const deleteMedia = (id: string) => {
    mediaService.delete(id).then(() => {
      setData(prev => ({ ...prev, media: prev.media.filter(m => m.id !== id) }));
      toast.success("Mídia removida");
    }).catch(() => toast.error("Erro ao deletar mídia"));
  };

  return (
    <SiteContext.Provider value={{
      data, loading, error, refreshData: loadAllData,
      updateGeneral, updateTeam, updateProjects, updateEvents, updateAbout, updateAwards,
      updatePlatforms, updateFAQ, updateGallery, updateHome, updateSlides, addMedia, uploadFile, deleteMedia, updatePopups
    }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSiteData() {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error("useSiteData must be used within a SiteProvider");
  }
  return context;
}
