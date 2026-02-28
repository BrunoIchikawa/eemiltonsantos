import { Project } from '../types';
import { fetchSection, saveSection } from './api';

export const projectService = {
  getAll: async (): Promise<Project[]> =>
    fetchSection<Project[]>('projects', []),

  update: async (projects: Project[]): Promise<Project[]> =>
    saveSection<Project[]>('projects', projects),
};
