import { Award as AwardIcon, Trophy, Star } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';
import { ImageWithFallback } from './ui_elements/ImageWithFallback';

export function AwardsSection() {
  const { data } = useSiteData();
  const { awards } = data;
  const activeAwards = awards?.filter((a: any) => a.active).sort((a: any, b: any) => Number(b.year) - Number(a.year)) || [];

  if (activeAwards.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-gray-50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-yellow-100 rounded-full mb-4">
            <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{data.general.pageBanners?.premios?.title || 'Nossas Conquistas'}</h2>
          <p className="text-base sm:text-lg text-gray-600 mt-2 max-w-2xl mx-auto">
            {data.general.pageBanners?.premios?.subtitle || 'Reconhecimento do nosso compromisso com a excelência educacional e o desenvolvimento dos nossos alunos.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {activeAwards.map((award: any) => (
            <div key={award.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 group flex flex-col h-full">
              <div className="h-48 relative overflow-hidden bg-gray-100">
                {award.image ? (
                  <ImageWithFallback 
                    src={award.image} 
                    alt={award.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <AwardIcon className="w-16 h-16 text-gray-300" />
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm border border-gray-100">
                  {award.year}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <div className="mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#00A650] bg-green-50 px-2 py-1 rounded-md">
                    {award.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#2E7BA6] transition-colors">
                  {award.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed flex-1">
                  {award.description}
                </p>
                
                {award.link && (
                  <a 
                    href={award.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center text-sm font-semibold text-[#2E7BA6] hover:text-[#256285]"
                  >
                    Saiba mais <Star className="w-3 h-3 ml-1 fill-current" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
