import { HomeData } from '../types';
import { fetchSection, saveSection } from './api';
import { defaultData } from './defaults';

export const homeService = {
  get: async (): Promise<HomeData> =>
    fetchSection<HomeData>('home', defaultData.home),

  update: async (data: Partial<HomeData>): Promise<HomeData> => {
    const current = await fetchSection<HomeData>('home', defaultData.home);
    const merged = { ...current, ...data };
    return saveSection<HomeData>('home', merged);
  },
};
