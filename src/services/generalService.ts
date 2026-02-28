import { GeneralSettings, TeamMember, Award, AboutSection, Platform, Slide, Popup } from '../types';
import { fetchSection, saveSection } from './api';
import { defaultData } from './defaults';

export const generalService = {
  getSettings: async (): Promise<GeneralSettings> =>
    fetchSection<GeneralSettings>('general', defaultData.general),

  updateSettings: async (settings: Partial<GeneralSettings>): Promise<GeneralSettings> => {
    const current = await fetchSection<GeneralSettings>('general', defaultData.general);
    const merged = { ...current, ...settings };
    return saveSection<GeneralSettings>('general', merged);
  },

  getTeam: async (): Promise<TeamMember[]> =>
    fetchSection<TeamMember[]>('team', defaultData.team),

  updateTeam: async (team: TeamMember[]): Promise<TeamMember[]> =>
    saveSection<TeamMember[]>('team', team),

  getAwards: async (): Promise<Award[]> =>
    fetchSection<Award[]>('awards', defaultData.awards),

  updateAwards: async (awards: Award[]): Promise<Award[]> =>
    saveSection<Award[]>('awards', awards),

  getAbout: async (): Promise<AboutSection> =>
    fetchSection<AboutSection>('about', defaultData.about),

  updateAbout: async (about: Partial<AboutSection>): Promise<AboutSection> => {
    const current = await fetchSection<AboutSection>('about', defaultData.about);
    const merged = { ...current, ...about };
    return saveSection<AboutSection>('about', merged);
  },

  getPlatforms: async (): Promise<Platform[]> =>
    fetchSection<Platform[]>('platforms', defaultData.platforms),

  updatePlatforms: async (platforms: Platform[]): Promise<Platform[]> =>
    saveSection<Platform[]>('platforms', platforms),

  getSlides: async (): Promise<Slide[]> =>
    fetchSection<Slide[]>('slides', defaultData.slides),

  updateSlides: async (slides: Slide[]): Promise<Slide[]> =>
    saveSection<Slide[]>('slides', slides),

  getPopups: async (): Promise<Popup[]> =>
    fetchSection<Popup[]>('popups', defaultData.popups),

  updatePopups: async (popups: Popup[]): Promise<Popup[]> =>
    saveSection<Popup[]>('popups', popups),
};
