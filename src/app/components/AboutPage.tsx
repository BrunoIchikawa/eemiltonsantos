import { Award, BookOpen, Target, Users, MapPin, Star, Heart } from 'lucide-react';
import { ImageWithFallback } from './ui_elements/ImageWithFallback';
import { useSiteData } from '../context/SiteContext';

// Map string icon names to components
const iconMap: Record<string, any> = {
  Award,
  Users,
  BookOpen,
  Target,
  MapPin,
  Star,
  Heart
};

export function AboutPage() {
  const { data } = useSiteData();
  const { about } = data;

  // Split history by paragraphs
  const historyParagraphs = about?.history ? about.history.split('\n\n').filter(p => p.trim()) : [];

  return (
    <div className="min-h-screen bg-white pb-16">
      {/* Standard Header - Conforme Guidelines 2.1 */}
      <section className="bg-gradient-to-r from-[#609BA2] to-[#78D2F6] text-white py-12 sm:py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Sobre a E.E. Prof. Milton Santos</h1>
          <p className="text-lg sm:text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
            Uma instituição comprometida com a educação de qualidade há mais de 40 anos.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        
        {/* Nossa História */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Nossa História</h2>
          <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
            {historyParagraphs.length > 0 ? (
              historyParagraphs.map((paragraph: string, idx: number) => (
                <p key={idx}>{paragraph}</p>
              ))
            ) : (
              <p>História não disponível.</p>
            )}
          </div>
        </section>

        {/* Nossos Valores */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Nossos Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {about?.values?.map((value: any, index: number) => {
              const Icon = iconMap[value.icon] || Star;
              return (
                <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 bg-[#0099DD]/10 rounded-lg flex items-center justify-center mb-4 text-[#0099DD]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Infraestrutura */}
        <section className="bg-[#E8F1F5] rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Infraestrutura</h2>
          <h3 className="text-xl font-semibold text-gray-700 mb-8">Estrutura Completa para o Aprendizado</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {about?.infrastructure?.map((item: string, index: number) => (
              <div key={index} className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#0099DD] shrink-0" />
                <span className="text-gray-700 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Conheça Nossa Escola */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Conheça Nossa Escola</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
             {about?.images?.map((img: string, idx: number) => {
                // Layout logic based on original hardcoded layout
                let colSpan = "lg:col-span-2";
                if (idx >= 3) colSpan = "lg:col-span-3";
                
                return (
                  <div key={idx} className={`aspect-video rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ${colSpan}`}>
                    <ImageWithFallback src={img} alt={`Escola ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                );
             })}
          </div>
        </section>

        {/* Stats */}
        <section className="border-t border-gray-200 pt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {about?.stats?.map((stat: any, index: number) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-[#0099DD] mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
