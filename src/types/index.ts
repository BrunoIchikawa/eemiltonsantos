export interface SocialLink {
  name: string;
  url: string;
  active: boolean;
}

export interface GeneralSettings {
  schoolName: string;
  phone: string;
  whatsapp: string;
  emailSecretaria: string;
  emailDiretoria: string;
  address: string;
  mapUrl: string;
  socials: SocialLink[];
  footerText: string;
  businessHours?: string;
  pageBanners?: Record<string, { title: string; subtitle: string }>;
  organogram?: { id: string; role: string; name: string; parentId?: string | null; parentIds?: string[] }[];
  dropdownOptions?: {
    projectCategories: string[];
    galleryCategories: string[];
    eventCategories: string[];
    awardCategories: string[];
    faqCategories: string[];
    audienceCategories: string[];
  };
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string;
  email?: string;
  phone?: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  year: string;
  image: string;
  fullDescription: string;
  coordinator: string;
  participants: number;
  gallery: string[];
  active: boolean;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  description: string;
  category?: string;
  audience?: string;
  active: boolean;
}

export interface Award {
  id: string;
  title: string;
  year: string;
  description: string;
  category: string;
  image: string;
  link?: string;
  active: boolean;
}

export interface AboutSection {
  history: string;
  mission: string;
  vision: string;
  values: { icon: string; title: string; description: string }[];
  infrastructure: string[];
  stats: { number: string; label: string }[];
  images: string[]; // List of image URLs
  mainImage: string; // Keep for legacy/admin preview if needed
}

export interface Platform {
  id: string;
  name: string;
  description: string;
  url: string;
  category: 'Aluno' | 'Professor' | 'Gestão';
  icon?: string;
  active: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  active: boolean;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  date: string;
  coverImage: string;
  category: string;
  images: string[];
  active: boolean;
}

export interface Warning {
  id: string;
  title: string;
  message: string;
  date: string;
  priority: 'Alta' | 'Normal';
  active: boolean;
}

export interface SlideButton {
  text: string;
  link: string; // internal route or external url
  active: boolean;
  isExternal?: boolean;
}

export interface Slide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  active: boolean;
  order: number;
  button1: SlideButton;
  button2: SlideButton;
}

export interface SchoolMenu {
  enabled: boolean;
  title: string;
  imageUrl?: string;
  updatedAt: string;
  weekMenu: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
  };
}

export interface HomeData {
  heroTitle: string; // Legacy
  heroSubtitle: string; // Legacy
  heroImage: string; // Legacy
  welcomeTitle: string;
  welcomeText: string;
  warnings: Warning[];
  schoolMenu?: SchoolMenu;
}

export interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: 'image';
  size?: string;
  date?: string;
}

export interface Popup {
  id: string;
  type: 'text' | 'image';
  title: string;
  message?: string;
  imageUrl?: string;
  active: boolean;
  priority: 'Alta' | 'Normal';
}

export interface SiteData {
  general: GeneralSettings;
  team: TeamMember[];
  projects: Project[];
  events: Event[];
  awards: Award[];
  about: AboutSection;
  platforms: Platform[];
  faq: FAQItem[];
  gallery: GalleryAlbum[];
  home: HomeData;
  slides: Slide[];
  media: MediaItem[];
  popups: Popup[];
}
