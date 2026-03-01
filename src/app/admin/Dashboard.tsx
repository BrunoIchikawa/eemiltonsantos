import { useSiteData } from '../context/SiteContext';
import { FileText, Calendar, Image, HelpCircle, Users, Layers, Award, MessageSquare, Eye } from 'lucide-react';

export function Dashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { data } = useSiteData();

  // Contadores dinâmicos
  const projectCount = data.projects?.length || 0;
  const eventCount = data.events?.length || 0;
  const mediaCount = data.media?.length || 0;
  const faqCount = data.faq?.length || 0;
  const teamCount = data.team?.length || 0;
  const slideCount = data.slides?.length || 0;
  const awardCount = data.awards?.length || 0;
  const popupCount = data.popups?.length || 0;

  // Fake analytics based on date for consistency
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const dailyAccesses = (seed % 150) + 85; 

  const stats = [
    { label: 'Acessos Hoje', value: dailyAccesses.toString(), icon: Eye, color: 'text-emerald-600', bg: 'bg-emerald-100', link: '#' },
    { label: 'Projetos', value: projectCount.toString(), icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100', link: 'projetos' },
    { label: 'Eventos', value: eventCount.toString(), icon: Calendar, color: 'text-green-600', bg: 'bg-green-100', link: 'eventos' },
    { label: 'Mídias', value: mediaCount.toString(), icon: Image, color: 'text-purple-600', bg: 'bg-purple-100', link: 'media' },
    { label: 'Equipe', value: teamCount.toString(), icon: Users, color: 'text-orange-600', bg: 'bg-orange-100', link: 'equipe' },
    { label: 'Prêmios', value: awardCount.toString(), icon: Award, color: 'text-yellow-600', bg: 'bg-yellow-100', link: 'premios' },
    { label: 'FAQ', value: faqCount.toString(), icon: HelpCircle, color: 'text-cyan-600', bg: 'bg-cyan-100', link: 'faq' },
    { label: 'Slides', value: slideCount.toString(), icon: Layers, color: 'text-indigo-600', bg: 'bg-indigo-100', link: 'slides' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bem-vindo ao Painel Administrativo</h1>
        <p className="text-gray-500 mt-1">Gerencie o conteúdo do site da escola de forma simples e rápida.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <button 
              key={index}
              onClick={() => stat.link !== '#' && onNavigate(stat.link)}
              className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow text-left w-full group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`${stat.bg} p-2.5 rounded-lg group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              </div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Atalhos Rápidos */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="space-y-3">
            <button 
              onClick={() => onNavigate('media')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-100"
            >
              <span className="font-medium text-gray-700">Adicionar Fotos à Galeria</span>
              <span className="text-[#2E7BA6] text-sm font-semibold">Upload</span>
            </button>
            <button 
              onClick={() => onNavigate('eventos')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-100"
            >
              <span className="font-medium text-gray-700">Atualizar Calendário Escolar</span>
              <span className="text-[#2E7BA6] text-sm font-semibold">Editar</span>
            </button>
            <button 
              onClick={() => onNavigate('home')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-100"
            >
              <span className="font-medium text-gray-700">Editar Página Inicial</span>
              <span className="text-[#2E7BA6] text-sm font-semibold">Editar</span>
            </button>
          </div>
        </div>

        {/* Dicas */}
        <div className="bg-[#2E7BA6]/5 p-6 rounded-xl border border-[#2E7BA6]/20">
          <h2 className="text-lg font-bold text-[#2E7BA6] mb-4">Diretrizes do Painel</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-gray-600">
              <span className="bg-[#2E7BA6] text-white w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
              <span>Use <strong>títulos claros e curtos</strong> para facilitar a leitura nos dispositivos móveis.</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-600">
              <span className="bg-[#2E7BA6] text-white w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
              <span>Sempre revise as <strong>imagens</strong> antes de enviar. O tamanho ideal é abaixo de 2MB.</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-600">
              <span className="bg-[#2E7BA6] text-white w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
              <span>Cuidado ao <strong>excluir</strong> itens. Esta ação não pode ser desfeita.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
