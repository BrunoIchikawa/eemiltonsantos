import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, Phone, Mail, MapPin } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';
const logoImage = '/logoMS.svg';

interface HeaderProps {
  currentPage: string;
}

interface MenuItem {
  id: string;
  label: string;
  subItems?: { id: string; label: string }[];
}

export function Header({ currentPage }: HeaderProps) {
  const navigate = useNavigate();
  const { data } = useSiteData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detectar rolagem para mudar o estilo do header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Bloquear scroll do body quando menu mobile está aberto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  const menuItems: MenuItem[] = [
    { id: 'home', label: 'Início' },
    {
      id: 'institucional',
      label: 'Institucional',
      subItems: [
        { id: 'sobre', label: 'Sobre a Escola' },
        { id: 'equipe', label: 'Equipe Gestora' },
      ]
    },
    {
      id: 'pedagogico',
      label: 'Pedagógico',
      subItems: [
        { id: 'projetos', label: 'Projetos' },
        { id: 'calendario', label: 'Calendário' },
      ]
    },
    { id: 'plataformas', label: 'Plataformas' },
    { id: 'galeria', label: 'Galeria' },
    { id: 'faq', label: 'Dúvidas' },
  ];

  const handleNavigate = (page: string) => {
    navigate(page === 'home' ? '/' : `/${page}`);
    setMobileMenuOpen(false);
    setOpenSubmenu(null);
  };

  const toggleSubmenu = (id: string) => {
    setOpenSubmenu(openSubmenu === id ? null : id);
  };

  // Lógica de Estilo do Header
  const isHome = currentPage === 'home';
  // Transparente APENAS na Home e quando não scrolado e menu fechado
  const isTransparent = isHome && !isScrolled && !mobileMenuOpen;

  const headerClasses = `
    fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out
    ${isTransparent
      ? 'bg-gradient-to-b from-black/60 to-transparent border-transparent py-4'
      : 'bg-white/95 backdrop-blur-md border-b border-gray-100 py-3 shadow-sm'
    }
  `;

  // Cor do texto/ícones
  // Se transparente -> Branco
  // Se não (Home scrollada ou Outras Páginas) -> Preto
  // Se menu aberto -> Preto
  const textColorClass = (mobileMenuOpen || !isTransparent) ? 'text-gray-900' : 'text-white';
  const logoClasses = `
    w-10 h-10 sm:w-12 sm:h-12 object-contain transition-all duration-300
  `;

  return (
    <>
      <header className={headerClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center relative z-50">

            {/* Logo e Nome */}
            <button
              onClick={() => handleNavigate('home')}
              className="flex items-center gap-3 hover:opacity-80 transition-all duration-200 group"
            >
              <img
                src={logoImage}
                alt="Logo E.E. Prof. Milton Santos"
                className={logoClasses}
              />
              <div className={`text-left transition-colors duration-300 ${textColorClass}`}>
                <h1 className="text-sm sm:text-base font-bold leading-tight whitespace-nowrap tracking-tight">
                  E.E. Prof. Milton Santos
                </h1>
                <p className={`text-[11px] sm:text-xs uppercase tracking-wider font-medium opacity-80 group-hover:opacity-100`}>
                  Unidade Regional de Ensino Norte 1
                </p>
              </div>
            </button>

            {/* Menu Desktop */}
            <nav className="hidden md:flex items-center gap-1">
              {menuItems.map((item) => {
                const isActive = currentPage === item.id || item.subItems?.some(sub => sub.id === currentPage);

                if (item.subItems) {
                  return (
                    <div key={item.id} className="relative group px-1">
                      <button
                        className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-1.5 font-medium text-sm border border-transparent
                          ${isActive
                            ? (isTransparent ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-900')
                            : `${textColorClass} hover:bg-black/5 hover:text-gray-700`
                          }
                          ${isTransparent && !isActive ? 'hover:bg-white/10 hover:text-white' : ''}
                        `}
                      >
                        {item.label}
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180`} />
                      </button>

                      <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 w-60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-2 ring-1 ring-black/5">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100 rounded-tl-sm"></div>
                          <div className="relative z-10 bg-white">
                            {item.subItems.map((subItem) => (
                              <button
                                key={subItem.id}
                                onClick={() => handleNavigate(subItem.id)}
                                className={`w-full text-left px-4 py-3 text-sm rounded-xl transition-all flex items-center justify-between group/item ${currentPage === subItem.id
                                  ? 'bg-blue-50 text-[#0099DD] font-bold'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                  }`}
                              >
                                {subItem.label}
                                {currentPage === subItem.id && <div className="w-1.5 h-1.5 rounded-full bg-[#0099DD]" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  item.id === 'home' ? null : (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className={`px-5 py-2 rounded-full transition-all duration-300 font-medium text-sm
                        ${isActive
                          ? 'bg-[#0099DD] text-white shadow-md shadow-blue-500/20'
                          : `${textColorClass} hover:bg-black/5 hover:text-gray-900`
                        }
                        ${isTransparent && !isActive ? 'hover:bg-white/10 hover:text-white' : ''}
                      `}
                    >
                      {item.label}
                    </button>
                  )
                );
              })}
            </nav>

            {/* Botão Menu Mobile Animado */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-full transition-all duration-300 relative z-[60] w-12 h-12 flex items-center justify-center
                ${mobileMenuOpen
                  ? 'bg-gray-100 text-gray-900'
                  : (isTransparent ? 'bg-white/10 backdrop-blur-sm text-white' : 'hover:bg-gray-100 text-gray-900')
                }
              `}
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={mobileMenuOpen}
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span className={`w-full h-0.5 rounded-full transform transition-all duration-300 origin-left bg-current ${mobileMenuOpen ? 'rotate-45 translate-x-px -translate-y-[1px]' : ''}`} />
                <span className={`w-full h-0.5 rounded-full transform transition-all duration-300 bg-current ${mobileMenuOpen ? 'opacity-0 translate-x-3' : 'opacity-100'}`} />
                <span className={`w-full h-0.5 rounded-full transform transition-all duration-300 origin-left bg-current ${mobileMenuOpen ? '-rotate-45 translate-x-px translate-y-[1px]' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Menu Mobile Full Screen (Fora do Header para evitar conflitos de stacking) */}
      <div
        className={`fixed inset-0 z-40 bg-white md:hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          }`}
        style={{ top: 0 }}
      >
        <div className="flex flex-col h-full pt-28 pb-8 px-6 overflow-y-auto">

          <div className="flex flex-col gap-1 w-full animate-in slide-in-from-bottom-4 duration-500 fade-in fill-mode-forwards">
            {menuItems.map((item, idx) => {
              const isActive = currentPage === item.id || item.subItems?.some(sub => sub.id === currentPage);

              if (item.subItems) {
                return (
                  <div
                    key={item.id}
                    className="border-b border-gray-100 last:border-0 py-2"
                  >
                    <button
                      onClick={() => toggleSubmenu(item.id)}
                      className={`w-full flex items-center justify-between py-4 text-left text-xl font-bold transition-colors ${isActive ? 'text-[#0099DD]' : 'text-gray-900'
                        }`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`w-6 h-6 transition-transform duration-300 ${openSubmenu === item.id ? 'rotate-180 text-[#0099DD]' : 'text-gray-400'
                          }`}
                      />
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${openSubmenu === item.id ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'
                        }`}
                    >
                      <div className="bg-gray-50 rounded-2xl p-2 space-y-1">
                        {item.subItems.map((subItem) => (
                          <button
                            key={subItem.id}
                            onClick={() => handleNavigate(subItem.id)}
                            className={`w-full text-left px-5 py-3.5 rounded-xl transition-all text-base font-medium flex items-center justify-between ${currentPage === subItem.id
                              ? 'bg-white text-[#0099DD] shadow-sm'
                              : 'text-gray-600 active:bg-gray-200'
                              }`}
                          >
                            {subItem.label}
                            {currentPage === subItem.id && <ChevronRight className="w-4 h-4" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full text-left py-5 text-xl font-bold border-b border-gray-100 last:border-0 transition-all transform active:scale-[0.98] ${isActive
                    ? 'text-[#0099DD]'
                    : 'text-gray-900'
                    }`}
                >
                  <div className="flex items-center justify-between w-full">
                    {item.label}
                    {isActive && <div className="w-2 h-2 rounded-full bg-[#0099DD]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer do Menu Mobile */}
          <div className="mt-auto pt-10 grid grid-cols-2 gap-4 animate-in slide-in-from-bottom-8 duration-700 fade-in fill-mode-forwards">
            <a href={`tel:${data?.general?.whatsapp?.replace(/\D/g, '') || ''}`} className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl active:bg-gray-100 transition-colors">
              <Phone className="w-6 h-6 text-[#0099DD] mb-2" />
              <span className="text-xs font-bold text-gray-600">Ligar</span>
            </a>
            <a 
              href={data?.general?.mapUrl || '#'}
              target="_blank"
              rel="noopener noreferrer" 
              className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl active:bg-gray-100 transition-colors"
            >
              <MapPin className="w-6 h-6 text-[#0099DD] mb-2" />
              <span className="text-xs font-bold text-gray-600">Visitar</span>
            </a>
          </div>

        </div>
      </div>

      {/* Espaçador para compensar o Header Fixo em páginas internas */}
      {!isHome && <div className="h-20 md:h-24 w-full bg-white relative -z-10" />}
    </>
  );
}
