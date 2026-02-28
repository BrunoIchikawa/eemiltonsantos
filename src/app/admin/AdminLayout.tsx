import { useState, ReactNode } from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  FileText, 
  Calendar, 
  Image as ImageIcon, 
  LogOut, 
  Layout, 
  Monitor, 
  HelpCircle,
  Home,
  Menu,
  X
} from 'lucide-react';
import { useSiteData } from '../context/SiteContext';

interface AdminLayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function AdminLayout({ children, currentPage, onNavigate, onLogout }: AdminLayoutProps) {
  const { data } = useSiteData();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Ordem baseada no Front-end
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Visão Geral' },
    { id: 'home', icon: Home, label: 'Página Inicial' },
    { id: 'about', icon: FileText, label: 'Sobre a Escola' },
    { id: 'team', icon: Users, label: 'Equipe Escolar' },
    { id: 'projetos', icon: Layout, label: 'Projetos' },
    { id: 'eventos', icon: Calendar, label: 'Agenda & Eventos' },
    { id: 'platforms', icon: Monitor, label: 'Plataformas' },
    { id: 'gallery', icon: ImageIcon, label: 'Galeria de Fotos' },
    { id: 'faq', icon: HelpCircle, label: 'FAQ / Dúvidas' },
    { id: 'general', icon: Settings, label: 'Configurações Gerais' },
    { id: 'media', icon: ImageIcon, label: 'Gerenciador de Mídia' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 flex flex-col
          transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto md:flex
          ${isSidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full shadow-none'}
        `}
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 bg-white rounded flex items-center justify-center overflow-hidden border border-gray-100">
              <img src="/logoMS.svg" alt="Milton Santos" className="w-full h-full object-contain p-1" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 truncate">Painel Admin</h1>
              <p className="text-xs text-gray-500">v1.1.0</p>
            </div>
          </div>
          {/* Close Button for Mobile */}
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => {
             const Icon = item.icon;
             return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsSidebarOpen(false); // Close sidebar on mobile after navigation
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === item.id 
                    ? 'bg-[#2E7BA6]/10 text-[#2E7BA6]' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${currentPage === item.id ? 'text-[#2E7BA6]' : 'text-gray-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 mt-auto">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="truncate">Sair do Painel</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 shrink-0">
          
          <div className="flex items-center gap-3">
            {/* Hamburger Button (Mobile Only) */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-gray-500 hover:text-gray-700 md:hidden rounded-lg hover:bg-gray-100"
              aria-label="Abrir menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <h2 className="text-lg font-semibold text-gray-800 truncate">
              {menuItems.find(i => i.id === currentPage)?.label || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:inline">
              Logado como <strong>Administrador</strong>
            </span>
            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-gray-100">
               <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="Admin" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-4 md:p-8 relative">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
