import { SiteData } from '../types';

// Dados padrão que serão exibidos quando o banco de dados estiver vazio.
// Na primeira vez que o admin acessar o site, esses dados aparecem.
// Ao salvar qualquer seção, ela é persistida no MySQL e nunca mais usa o fallback.

export const defaultData: SiteData = {
  general: {
    schoolName: 'E.E. Prof. Milton Santos',
    phone: '(11) 3222-1234',
    whatsapp: '(11) 99999-9999',
    emailSecretaria: 'e457243a@educacao.sp.gov.br',
    emailDiretoria: 'diretoria@escola.sp.gov.br',
    address: 'Rua da Educação, 123 - Centro - São Paulo/SP - CEP: 01000-000',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1975860268817!2d-46.6565158!3d-23.5646162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1709228000000!5m2!1spt-BR!2sbr',
    footerText: 'Formando cidadãos críticos e éticos para o futuro.',
    socials: [
      { name: 'Facebook', url: '#', active: true },
      { name: 'Instagram', url: '#', active: true },
    ],
    pageBanners: {
      sobre: { title: 'Sobre a Escola', subtitle: 'Conheça nossa história, missão e valores.' },
      equipe: { title: 'Equipe Gestora', subtitle: 'Conheça os profissionais que administram nossa escola.' },
      projetos: { title: 'Projetos Pedagógicos', subtitle: 'Iniciativas que transformam a teoria em prática.' },
      eventos: { title: 'Eventos Gremistas e Escolares', subtitle: 'Acompanhe as atividades, feiras e comemorações da escola.' },
      premios: { title: 'Prêmios e Conquistas', subtitle: 'Reconhecimento do talento e dedicação de nossos alunos e professores.' },
      galeria: { title: 'Galeria de Fotos', subtitle: 'Momentos especiais da nossa comunidade escolar.' },
      plataformas: { title: 'Plataformas Digitais', subtitle: 'Acesse rapidamente os sistemas e ferramentas de aprendizado da escola.' },
      faq: { title: 'Perguntas Frequentes (FAQ)', subtitle: 'Tire suas dúvidas sobre matrículas, horários e rotina escolar.' },
    },
    organogram: [
      { id: '1', role: 'Diretor', name: 'João Silva' },
      { id: '2', role: 'Vice-Diretor', name: 'Maria Souza' },
      { id: '3', role: 'Coordenador', name: 'Pedro Santos' },
      { id: '4', role: 'Secretário', name: 'Ana Oliveira' },
    ]
  },
  home: {
    heroTitle: 'Bem-vindo à E.E. Prof. Milton Santos',
    heroSubtitle: 'Educação pública de qualidade, formando cidadãos para o futuro.',
    heroImage: '',
    welcomeTitle: 'Bem-vindo ao site da E.E. Prof. Milton Santos',
    welcomeText: 'Nossa escola se dedica há mais de 40 anos a oferecer um ensino público de excelência, pautado no respeito, na inclusão e no desenvolvimento integral do aluno.',
    warnings: [],
    schoolMenu: {
      enabled: false,
      title: 'Cardápio da Semana',
      imageUrl: '',
      updatedAt: '',
      weekMenu: {
        monday: '', tuesday: '', wednesday: '', thursday: '', friday: ''
      }
    }
  },
  slides: [],
  platforms: [
    { id: '1', name: 'SED - Secretaria Digital', description: 'Consulte notas, frequências e carteirinha escolar.', url: 'https://sed.educacao.sp.gov.br', category: 'Gestão', active: true },
    { id: '2', name: 'CMSP - Centro de Mídias', description: 'Aulas online e tarefas complementares.', url: 'https://cmsp.ip.tv/', category: 'Aluno', active: true },
    { id: '3', name: 'Google Classroom', description: 'Sala de aula virtual para entrega de atividades.', url: 'https://classroom.google.com', category: 'Aluno', active: true },
  ],
  faq: [],
  media: [],
  team: [],
  projects: [],
  events: [],
  awards: [],
  about: {
    history: '',
    mission: '',
    vision: '',
    values: [],
    infrastructure: [],
    stats: [],
    images: [],
    mainImage: ''
  },
  gallery: [],
  popups: []
};
