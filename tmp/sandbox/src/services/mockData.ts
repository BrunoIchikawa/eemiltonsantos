// Images from Figma (Simulating local imports)
// Replaced figma:asset imports with static paths for external build compatibility

import { SiteData } from '@/app/context/SiteContext';

// This file simulates the database content
// In a real scenario, this would be returned by your PHP/MySQL backend

// Static Asset Constants
const imgSchool1 = "/uploads/school-front.png";
const imgSchool2 = "/uploads/school-hall.png";
const imgSchool3 = "/uploads/school-lab.png";
const imgSchool4 = "/uploads/school-courtyard.png";
const imgSchool5 = "/uploads/school-library.png";

export const mockData: SiteData = {
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
    ]
  },
  home: {
    heroTitle: 'Bem-vindo à E.E. Prof. Milton Santos',
    heroSubtitle: 'Educação pública de qualidade, formando cidadãos para o futuro.',
    heroImage: '/uploads/hero-main.jpg',
    welcomeTitle: 'Bem-vindo ao site da E.E. Prof. Milton Santos',
    welcomeText: 'Nossa escola se dedica há mais de 40 anos a oferecer um ensino público de excelência, pautado no respeito, na inclusão e no desenvolvimento integral do aluno. Aqui, acreditamos que a educação é a ferramenta mais poderosa para transformar vidas e construir um futuro melhor.',
    warnings: [
      { id: '1', title: 'Rematrícula 2026', message: 'O prazo para rematrícula foi prorrogado até o dia 30/01.', date: '20/01/2026', priority: 'Alta', active: true },
      { id: '2', title: 'Reunião de Pais', message: 'Primeira reunião de pais e mestres do ano letivo.', date: '15/02/2026', priority: 'Normal', active: true },
      { id: '3', title: 'Entrega de Uniformes', message: 'Cronograma de entrega disponível na secretaria.', date: '10/02/2026', priority: 'Normal', active: true },
    ],
    schoolMenu: {
      enabled: true,
      title: 'Cardápio da Semana',
      imageUrl: '/uploads/menu-weekly.jpg',
      updatedAt: '12/02/2026',
      weekMenu: {
        monday: 'Arroz, Feijão, Frango Assado e Salada',
        tuesday: 'Macarrão com Carne Moída e Fruta',
        wednesday: 'Arroz, Feijão, Ovo Mexido e Legumes',
        thursday: 'Galinhada com Salada de Repolho',
        friday: 'Feijoada Light e Laranja'
      }
    }
  },
  slides: [
    {
      id: '1',
      title: 'Bem-vindo à E.E. Prof. Milton Santos',
      subtitle: 'Educação pública de qualidade, formando cidadãos para o futuro.',
      image: imgSchool1,
      active: true,
      order: 1,
      button1: { text: 'Conheça a Escola', link: 'sobre', active: true },
      button2: { text: 'Calendário 2026', link: 'calendario', active: true }
    },
    {
      id: '2',
      title: 'Ensino Integral de Excelência',
      subtitle: 'Estrutura completa e projetos pedagógicos inovadores para o desenvolvimento pleno.',
      image: imgSchool2,
      active: true,
      order: 2,
      button1: { text: 'Nossos Projetos', link: 'projetos', active: true },
      button2: { text: 'Fale Conosco', link: 'faq', active: true }
    },
    {
      id: '3',
      title: 'Tecnologia e Inovação',
      subtitle: 'Laboratórios equipados e plataformas digitais integradas ao currículo escolar.',
      image: imgSchool3,
      active: true,
      order: 3,
      button1: { text: 'Plataformas', link: 'plataformas', active: true },
      button2: { text: '', link: '', active: false }
    }
  ],
  platforms: [
    { id: '1', name: 'SED - Secretaria Digital', description: 'Consulte notas, frequências e carteirinha escolar.', url: 'https://sed.educacao.sp.gov.br', category: 'Gestão', active: true },
    { id: '2', name: 'CMSP - Centro de Mídias', description: 'Aulas online e tarefas complementares.', url: 'https://cmsp.ip.tv/', category: 'Aluno', active: true },
    { id: '3', name: 'Google Classroom', description: 'Sala de aula virtual para entrega de atividades.', url: 'https://classroom.google.com', category: 'Aluno', active: true },
    { id: '4', name: 'Khan Academy', description: 'Reforço de matemática e ciências.', url: 'https://pt.khanacademy.org/', category: 'Aluno', active: true },
    { id: '5', name: 'Redação SP', description: 'Plataforma de correção de redações.', url: '#', category: 'Aluno', active: true },
  ],
  faq: [
    { id: '1', question: 'Como faço para solicitar a transferência do meu filho?', answer: 'A transferência pode ser solicitada diretamente na secretaria da escola de origem ou pelo portal da Secretaria Escolar Digital (SED). É necessário apresentar comprovante de residência atualizado.', category: 'Documentação e Matrícula', active: true },
    { id: '2', question: 'Quais documentos são necessários para a matrícula/rematrícula?', answer: 'RG e CPF do aluno e do responsável, Certidão de Nascimento, Comprovante de Residência recente e Carteirinha de Vacinação atualizada.', category: 'Documentação e Matrícula', active: true },
    { id: '3', question: 'Como consultar o RA (Registro do Aluno)?', answer: 'O número do RA pode ser consultado na secretaria da escola ou no boletim escolar. Ele também está disponível no acesso à Secretaria Escolar Digital (SED).', category: 'Documentação e Matrícula', active: true },
    { id: '4', question: 'Como acesso o boletim escolar?', answer: 'O boletim escolar está disponível online na plataforma SED (Secretaria Escolar Digital). O acesso é feito com o RA do aluno e senha cadastrada.', category: 'Vida Escolar e Avaliação', active: true },
    { id: '5', question: 'Qual é a média para aprovação e como funcionam as recuperações?', answer: 'A média para aprovação é 5,0. Alunos com nota inferior terão oportunidades de recuperação contínua durante o bimestre e recuperação intensiva ao final do semestre.', category: 'Vida Escolar e Avaliação', active: true },
    { id: '6', question: 'Onde vejo as faltas do meu filho?', answer: 'As faltas são registradas diariamente e podem ser consultadas pelos responsáveis através do aplicativo Minha Escola SP ou no portal da SED.', category: 'Vida Escolar e Avaliação', active: true },
    { id: '7', question: 'Quais são os horários de entrada e saída?', answer: 'Período da Manhã: 07h00 às 12h35. Período da Tarde: 13h00 às 18h35. Período Noturno (EJA): 19h00 às 23h00.', category: 'Rotina e Infraestrutura', active: true },
    { id: '8', question: 'A escola oferece uniforme e material escolar?', answer: 'Sim, o Governo do Estado fornece kit de material escolar e uniforme no início do ano letivo. A entrega segue cronograma divulgado pela direção.', category: 'Rotina e Infraestrutura', active: true },
    { id: '9', question: 'Como funciona o cardápio da merenda?', answer: 'A alimentação escolar é balanceada e segue cardápio elaborado por nutricionistas da Secretaria da Educação, disponível para consulta na cozinha da escola.', category: 'Rotina e Infraestrutura', active: true },
    { id: '10', question: 'Esqueci a senha do CMSP ou da Prova Paulista, o que fazer?', answer: 'A senha pode ser redefinida no portal da SED clicando em "Esqueci a Senha". Caso não consiga, procure a secretaria ou o PROATEC da escola.', category: 'Plataformas Digitais (Foco no Aluno)', active: true },
    { id: '11', question: 'Como usar o LeiaSP para ler os livros obrigatórios?', answer: 'O acesso ao LeiaSP é feito com as mesmas credenciais do CMSP. Basta baixar o aplicativo ou acessar via web para encontrar os livros indicados.', category: 'Plataformas Digitais (Foco no Aluno)', active: true },
    { id: '12', question: 'O que é o Prepara SP e quem deve fazer?', answer: 'O Prepara SP é um programa de reforço voltado para alunos do Ensino Médio, com foco no vestibular e ENEM. O acesso é via CMSP.', category: 'Plataformas Digitais (Foco no Aluno)', active: true },
    { id: '13', question: 'Como posso agendar uma conversa com a coordenação ou direção?', answer: 'O atendimento pode ser agendado presencialmente na secretaria, por telefone ou e-mail institucional. Recomendamos agendar com antecedência.', category: 'Comunicação com a Gestão', active: true },
    { id: '14', question: 'Quando acontecem as reuniões de pais e mestres?', answer: 'As reuniões ocorrem bimestralmente após o fechamento das notas. As datas são enviadas por bilhete e divulgadas nas redes sociais da escola.', category: 'Comunicação com a Gestão', active: true },
  ],
  media: [
    { id: 'm1', url: '/uploads/fachada.jpg', name: 'Fachada Escola', type: 'image' },
    { id: 'm2', url: '/uploads/sala-aula.jpg', name: 'Sala de Aula', type: 'image' },
    { id: 'm3', url: '/uploads/lab-info.jpg', name: 'Laboratório', type: 'image' }
  ],
  team: [],
  projects: [],
  events: [],
  awards: [
    { id: '1', title: 'Prêmio Gestão Escolar', year: '2024', description: 'Reconhecimento pela excelência na administração e práticas pedagógicas inovadoras.', category: 'Gestão', image: '/uploads/premio-gestao.jpg', active: true },
    { id: '2', title: 'Medalha de Ouro OBMEP', year: '2023', description: 'Nossos alunos conquistaram 3 medalhas de ouro na Olimpíada Brasileira de Matemática.', category: 'Acadêmico', image: '/uploads/obmep.jpg', active: true }
  ],
  about: { 
    history: 'Fundada em 1980, a Escola Estadual Professor Milton Santos nasceu com o propósito de oferecer educação pública de qualidade para a comunidade local. Localizada no coração de São Paulo, nossa escola tem sido um pilar fundamental na formação de milhares de estudantes ao longo de mais de quatro décadas.\n\nO nome da escola homenageia Milton Santos, ilustre geógrafo brasileiro, Prêmio Vasco de Gama de Geografia e primeiro brasileiro a receber o Prêmio Internacional de Geografia. Sua dedicação à ciência e à educação inspiram nosso compromisso diário com a excelência acadêmica e a formação cidadã.\n\nAo longo dos anos, expandimos nossa infraestrutura e implementamos diversos projetos pedagógicos inovadores. Hoje, atendemos alunos do Ensino Fundamental II e Ensino Médio, oferecendo um ambiente acolhedor, seguro e estimulante para o aprendizado.',
    mission: '', 
    vision: '', 
    values: [
      { icon: 'Award', title: "Excelência", description: "Comprometimento com a qualidade do ensino e formação integral dos alunos." },
      { icon: 'Users', title: "Inclusão", description: "Ambiente acolhedor que respeita e valoriza a diversidade." },
      { icon: 'BookOpen', title: "Conhecimento", description: "Estímulo ao aprendizado contínuo e ao pensamento crítico." },
      { icon: 'Target', title: "Protagonismo", description: "Incentivo à participação ativa dos estudantes em sua formação." }
    ],
    infrastructure: [
      "20 salas de aula equipadas",
      "Laboratório de Informática",
      "Laboratório de Ciências",
      "Biblioteca com acervo de 10.000 livros",
      "Quadra poliesportiva coberta",
      "Sala de leitura",
      "Refeitório",
      "Acessibilidade completa"
    ],
    stats: [
      { number: "40+", label: "Anos de História" },
      { number: "500+", label: "Alunos Matriculados" },
      { number: "40+", label: "Professores" },
      { number: "8+", label: "Projetos Ativos" }
    ],
    images: [
      imgSchool1,
      imgSchool2,
      imgSchool3,
      imgSchool4,
      imgSchool5
    ],
    mainImage: imgSchool1
  },
  gallery: [],
  popups: [
    {
      id: 'welcome-popup',
      type: 'text',
      title: 'Boas-vindas ao Ano Letivo 2026!',
      message: 'Estamos muito felizes em receber nossos alunos para mais um ano de aprendizado e conquistas. As aulas começam no dia 05/02.',
      active: true,
      priority: 'Normal'
    }
  ]
};
