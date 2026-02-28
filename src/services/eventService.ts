import { Event } from '../types';
import { fetchSection, saveSection } from './api';

export const eventService = {
  getAll: async (): Promise<Event[]> =>
    fetchSection<Event[]>('events', []),

  update: async (events: Event[]): Promise<Event[]> =>
    saveSection<Event[]>('events', events),
};
