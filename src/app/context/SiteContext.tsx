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
    schoolName: '', phone: '', whatsapp: '', emailSecretaria: '', emailDiretoria: '', address: '', mapUrl: '', socials: [], footerText: '',
    dropdownOptions: {
      projectCategories: ['Sustentabilidade', 'Tecnologia', 'Artes e Cultura', 'Esportes', 'Ciências', 'Geral'],
      galleryCategories: ['Eventos', 'Trabalhos de Alunos', 'Estrutura da Escola', 'Passeios Culturais', 'Geral'],
      eventCategories: ['Seminário', 'Apresentação', 'Competição Esportiva', 'Festa Escolar', 'Geral'],
      awardCategories: ['Acadêmico', 'Esportivo', 'Artístico', 'Sustentabilidade', 'Geral'],
      faqCategories: ['Geral', 'Matrícula', 'Documentação', 'Transporte', 'Alimentação', 'Uniforme', 'Pedagógico', 'Administrativo'],
      audienceCategories: ['Geral', 'Alunos', 'Pais e Responsáveis', 'Professores', 'Comunidade']
    }
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

  // Optimistic updates: atualiza UI imediatamente e sincroniza com backend em paralelo

  const updateGeneral = (s: Partial<GeneralSettings>) => {
    setData(prev => ({ ...prev, general: { ...prev.general, ...s } }));
    generalService.updateSettings(s)
      .then(() => toast.success("Configurações salvas"))
      .catch((err: any) => toast.error(`Erro: ${err.message || 'Erro ao salvar no servidor'}`));
  };

  const updateTeam = (t: TeamMember[]) => {
    setData(prev => ({ ...prev, team: t }));
    generalService.updateTeam(t)
      .then(() => toast.success("Equipe atualizada"))
      .catch((err: any) => toast.error(`Erro: ${err.message || 'Erro ao salvar no servidor'}`));
  };

  const updateProjects = (p: Project[]) => {
    setData(prev => ({ ...prev, projects: p }));
    projectService.update(p)
      .then(() => toast.success("Projetos atualizados"))
      .catch((err: any) => toast.error(`Erro: ${err.message || 'Erro ao salvar no servidor'}`));
  };

  const updateEvents = (evt: Event[]) => {
    setData(prev => ({ ...prev, events: evt }));
    eventService.update(evt)
      .then(() => toast.success("Eventos atualizados"))
      .catch((err: any) => toast.error(`Erro: ${err.message || 'Erro ao salvar no servidor'}`));
  };

  const updateAwards = (awards: Award[]) => {
    setData(prev => ({ ...prev, awards }));
    generalService.updateAwards(awards)
      .then(() => toast.success("Prêmios atualizados"))
      .catch((err: any) => toast.error(`Erro: ${err.message || 'Erro ao salvar no servidor'}`));
  };

  const updateAbout = (a: Partial<AboutSection>) => {
    setData(prev => ({ ...prev, about: { ...prev.about, ...a } }));
    generalService.updateAbout(a)
      .then(() => toast.success("Seção Sobre atualizada"))
      .catch((err: any) => toast.error(`Erro: ${err.message || 'Erro ao salvar no servidor'}`));
  };

  const updatePlatforms = (plt: Platform[]) => {
    setData(prev => ({ ...prev, platforms: plt }));
    generalService.updatePlatforms(plt)
      .then(() => toast.success("Plataformas atualizadas"))
      .catch((err: any) => toast.error(`Erro: ${err.message || 'Erro ao salvar no servidor'}`));
  };

  const updateFAQ = (f: FAQItem[]) => {
    setData(prev => ({ ...prev, faq: f }));
    faqService.update(f)
      .then(() => toast.success("FAQ atualizado"))
      .catch((err: any) => toast.error(`Erro: ${err.message || 'Erro ao salvar no servidor'}`));
  };

  const updateGallery = (g: GalleryAlbum[]) => {
    setData(prev => ({ ...prev, gallery: g }));
    galleryService.update(g)
      .then(() => toast.success("Galeria atualizada"))
      .catch((err: any) => toast.error(`Erro: ${err.message || 'Erro ao salvar no servidor'}`));
  };

  const updateHome = (h: Partial<HomeData>) => {
    setData(prev => ({ ...prev, home: { ...prev.home, ...h } }));
    homeService.update(h)
      .then(() => toast.success("Home atualizada"))
      .catch((err: any) => toast.error(`Erro: ${err.message || 'Erro ao salvar no servidor'}`));
  };

  const updateSlides = (s: Slide[]) => {
    setData(prev => ({ ...prev, slides: s }));
    generalService.updateSlides(s)
      .then(() => toast.success("Slides atualizados"))
      .catch((err: any) => toast.error(`Erro: ${err.message || 'Erro ao salvar no servidor'}`));
  };

  const updatePopups = (popups: Popup[]) => {
    setData(prev => ({ ...prev, popups }));
    generalService.updatePopups(popups)
      .then(() => toast.success("Popups atualizados"))
      .catch((err: any) => toast.error(`Erro: ${err.message || 'Erro ao salvar no servidor'}`));
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
