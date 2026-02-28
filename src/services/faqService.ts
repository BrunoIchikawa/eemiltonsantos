import { FAQItem } from '../types';
import { fetchSection, saveSection } from './api';

export const faqService = {
  getAll: async (): Promise<FAQItem[]> =>
    fetchSection<FAQItem[]>('faq', []),

  update: async (faq: FAQItem[]): Promise<FAQItem[]> =>
    saveSection<FAQItem[]>('faq', faq),
};
