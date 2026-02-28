import { Bell, ArrowRight, Calendar, Users, MapPin, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';
import { AwardsSection } from './AwardsSection';
import { SchoolMenuWidget } from './SchoolMenuWidget';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from 'react-router-dom';

// Custom Arrows Components (Apenas Desktop - lg e acima)
function NextArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white/70 hover:text-white transition-all duration-300 hover:scale-110 group focus:outline-none hidden lg:block"
      aria-label="Próximo slide"
      type="button"
    >
      <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform stroke-[1.5]" />
    </button>
  );
}

function PrevArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white/70 hover:text-white transition-all duration-300 hover:scale-110 group focus:outline-none hidden lg:block"
      aria-label="Slide anterior"
      type="button"
    >
      <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform stroke-[1.5]" />
    </button>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const onNavigate = (page: string) => navigate(page === 'home' ? '/' : `/${page}`);
  const { data } = useSiteData();
  // Safe destructuring with defaults
  const home = data?.home || {};
  const events = data?.events || [];
  const slides = data?.slides || [];

  const activeEvents = events.filter(e => e.active).slice(0, 3);
  const activeWarnings = home.warnings?.filter((w: any) => w.active) || [];
  const hasMenu = home.schoolMenu?.enabled;

  // Filtrar e ordenar slides ativos
  const activeSlides = slides
    .filter(s => s.active)
    .sort((a, b) => a.order - b.order);

  // Fallback se não houver slides ativos
  const hasSlides = activeSlides.length > 0;

  const settings = {
    dots: true,
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    fade: true,
    pauseOnHover: false,
    focusOnSelect: false,
    accessibility: false,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    dotsClass: "slick-dots custom-dots",
    appendDots: (dots: any) => (
      <div className="absolute w-full pointer-events-none z-30 bottom-24 sm:bottom-28 lg:bottom-32">
        <ul className="m-0 p-0 flex justify-center gap-3 pointer-events-auto"> {dots} </ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white/30 hover:bg-white/80 transition-all cursor-pointer ring-1 ring-transparent hover:ring-white/50" />
    )
  };

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">

      {/* 1. Hero Section Imersiva */}
      <section className="relative w-full h-[100svh] min-h-[500px] bg-gray-900 overflow-hidden group">

        {/* Carrossel de Fundo */}
        <div className="absolute inset-0 w-full h-full">
          {hasSlides ? (
            <Slider {...settings} className="h-full">
              {activeSlides.map((slide) => (
                <div key={slide.id} className="relative w-full h-full outline-none focus:outline-none">
                  <div
                    className="absolute inset-0 bg-cover bg-center animate-ken-burns"
                    style={{
                      backgroundImage: `url(${slide.image})`,
                      animation: 'ken-burns 25s ease-out infinite alternate'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent opacity-90" />

                  {/* Conteúdo do Slide */}
                  <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 sm:px-12 lg:px-24 pointer-events-none pb-16 sm:pb-20">
                    <div className="max-w-5xl text-left pointer-events-auto pt-12 sm:pt-0">

                      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 text-white tracking-tighter leading-[1.1] sm:leading-[0.95] drop-shadow-2xl text-balance animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {slide.title}
                      </h1>

                      <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-200 max-w-xl sm:max-w-2xl mb-8 sm:mb-12 font-light leading-relaxed drop-shadow-lg text-pretty opacity-90 hidden sm:block animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        {slide.subtitle}
                      </p>
                      {/* Subtítulo Mobile */}
                      <p className="text-base text-gray-200 max-w-sm mb-8 font-light leading-relaxed drop-shadow-lg opacity-90 sm:hidden animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        {slide.subtitle}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                        {slide.button1?.active && (
                          <button
                            onClick={() => onNavigate(slide.button1!.link)}
                            className="group relative bg-white text-gray-900 px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 sm:gap-3 overflow-hidden w-full sm:w-auto active:scale-95"
                          >
                            <span className="relative z-10 tracking-tight whitespace-nowrap">{slide.button1.text}</span>
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 transition-transform group-hover:translate-x-1" />
                          </button>
                        )}

                        {slide.button2?.active && (
                          <button
                            onClick={() => onNavigate(slide.button2!.link)}
                            className="group bg-white/10 backdrop-blur-md border border-white/30 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-medium text-base sm:text-lg transition-all duration-300 hover:bg-white/20 hover:border-white/50 shadow-lg flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto active:bg-white/15"
                          >
                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 opacity-80" />
                            <span className="whitespace-nowrap">{slide.button2.text}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            // Fallback caso não haja slides
            <div className="flex items-center justify-center h-full text-white bg-gray-900">
              {/* Mensagem discreta ou apenas o fundo escuro */}
            </div>
          )}
        </div>

        <style>{`
          @keyframes ken-burns {
            0% { transform: scale(1); }
            100% { transform: scale(1.15); }
          }
          .animate-ken-burns {
            animation: ken-burns 25s ease-out infinite alternate;
          }
          .slick-dots li.slick-active div {
            background-color: white !important;
            transform: scale(1.3);
            box-shadow: 0 0 10px rgba(255,255,255,0.5);
          }
          .slick-slider, .slick-list, .slick-track, .slick-slide > div {
            height: 100%;
          }
        `}</style>

        {/* Indicador de Scroll Mobile/Desktop */}
        <div
          onClick={scrollToContent}
          className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 sm:gap-3 cursor-pointer group animate-fade-in-up delay-1000 active:scale-90 transition-transform"
        >
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white/60 group-hover:text-white transition-colors font-medium drop-shadow-md">
            Descubra Mais
          </span>
          <div className="w-[22px] h-[36px] sm:w-[26px] sm:h-[42px] rounded-full border-2 border-white/40 group-hover:border-white p-1 flex justify-center transition-colors shadow-lg backdrop-blur-sm bg-black/10 box-content">
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full animate-bounce mt-1" />
          </div>
        </div>

      </section>

      {/* 2. Seção de Boas-vindas & Menu */}
      <section className="relative z-20 py-16 sm:py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {hasMenu ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Texto de Boas-Vindas */}
              <div className="lg:col-span-8 lg:pr-8">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 tracking-tight leading-tight">
                  {home.welcomeTitle || 'Bem-vindo ao site da E.E. Prof. Milton Santos'}
                </h2>
                <div className="w-24 h-1.5 bg-gradient-to-r from-[#0099DD] to-[#78D2F6] rounded-full mb-8 sm:mb-10"></div>
                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed text-pretty font-light">
                  {home.welcomeText}
                </p>
              </div>

              {/* Widget Lateral */}
              <div className="lg:col-span-4 w-full">
                <div className="sticky top-24">
                  <SchoolMenuWidget />
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 tracking-tight leading-tight">
                {home.welcomeTitle || 'Bem-vindo ao site da E.E. Prof. Milton Santos'}
              </h2>
              <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-[#0099DD] to-[#78D2F6] mx-auto rounded-full mb-8 sm:mb-10"></div>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed text-pretty font-light">
                {home.welcomeText}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 3. Seção Avisos Importantes */}
      {activeWarnings.length > 0 && (
        <section className="py-12 sm:py-16 bg-gray-50/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 sm:mb-10">
              <div className="p-3 bg-white rounded-xl shadow-sm text-[#0099DD] border border-gray-100 shrink-0">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Mural de Avisos</h2>
                <p className="text-sm sm:text-base text-gray-500">Fique atento aos comunicados oficiais</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeWarnings.map((warning: any) => (
                <div key={warning.id} className={`bg-white border-l-[6px] p-6 sm:p-8 rounded-r-2xl shadow-sm hover:shadow-xl transition-all duration-300 group ${warning.priority === 'Alta' ? 'border-red-500' : 'border-[#0099DD]'
                  }`}>
                  <div className="flex justify-between items-start mb-4 gap-2">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 sm:px-3 py-1.5 rounded-lg shrink-0">
                      {warning.date}
                    </span>
                    {warning.priority === 'Alta' && (
                      <span className="bg-red-50 text-red-600 text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                        Urgente
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-3 group-hover:text-[#0099DD] transition-colors line-clamp-2">{warning.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-4">{warning.message}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Acesso Rápido (Links Institucionais) */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div
              onClick={() => onNavigate('equipe')}
              className="p-8 sm:p-10 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-2xl transition-all cursor-pointer group active:scale-[0.98] duration-300"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                <Users className="w-7 h-7 sm:w-8 sm:h-8 text-[#0099DD]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#0099DD] transition-colors">Equipe Gestora</h3>
              <p className="text-sm sm:text-base text-gray-500 leading-relaxed">Conheça nossos professores e gestores comprometidos com o ensino.</p>
            </div>
            <div
              onClick={() => onNavigate('calendario')}
              className="p-8 sm:p-10 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-2xl transition-all cursor-pointer group active:scale-[0.98] duration-300"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                <Calendar className="w-7 h-7 sm:w-8 sm:h-8 text-[#009B3A]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#009B3A] transition-colors">Agenda Escolar</h3>
              <p className="text-sm sm:text-base text-gray-500 leading-relaxed">Fique por dentro das datas de provas, reuniões e eventos.</p>
            </div>
            <div
              onClick={() => onNavigate('sobre')}
              className="p-8 sm:p-10 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-2xl transition-all cursor-pointer group active:scale-[0.98] duration-300"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                <MapPin className="w-7 h-7 sm:w-8 sm:h-8 text-[#705741]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#705741] transition-colors">Localização</h3>
              <p className="text-sm sm:text-base text-gray-500 leading-relaxed">Saiba onde estamos e as melhores rotas para chegar.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4.5 Seção de Prêmios e Reconhecimentos */}
      <AwardsSection />

      {/* 5. Eventos */}
      {activeEvents.length > 0 && (
        <section className="py-16 sm:py-24 bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 sm:mb-16 gap-4">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Acontece na Escola</h2>
                <div className="h-1.5 w-24 bg-gradient-to-r from-[#0099DD] to-[#78D2F6] rounded-full mt-4 sm:mt-6"></div>
              </div>
              <button
                onClick={() => onNavigate('calendario')}
                className="hidden sm:flex items-center gap-2 text-[#0099DD] font-bold hover:gap-3 transition-all px-6 py-3 hover:bg-white rounded-xl shadow-sm"
              >
                Ver agenda completa <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {activeEvents.map((event) => (
                <div key={event.id} className="bg-white p-0 rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group overflow-hidden flex flex-col h-full hover:-translate-y-2">
                  <div className="h-1.5 bg-gradient-to-r from-[#0099DD] to-[#78D2F6] w-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  <div className="p-6 sm:p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-blue-50 text-[#0099DD] px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold border border-blue-100 group-hover:bg-[#0099DD] group-hover:text-white transition-colors duration-300 shadow-sm">
                        {event.date}
                      </div>
                      <span className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-wider border border-gray-100 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">{event.category}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#0099DD] transition-colors leading-tight line-clamp-2">{event.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-6 leading-relaxed flex-1 font-light line-clamp-3">
                      {event.description}
                    </p>
                    <div className="pt-6 border-t border-gray-50 mt-auto">
                      <span className="text-sm font-bold text-[#0099DD] flex items-center gap-2 group-hover:gap-3 transition-all">
                        Ler mais <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('calendario')}
              className="mt-8 sm:mt-12 w-full sm:hidden flex items-center justify-center gap-2 text-[#0099DD] font-bold p-4 bg-white rounded-2xl border border-gray-200 shadow-sm active:bg-gray-50"
            >
              Ver agenda completa <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
