import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AdminLayout } from './AdminLayout';
import { Dashboard } from './Dashboard';
import { MediaManager } from './MediaManager';
import { ContentManager } from './ContentManager';
import { GeneralSettings } from './GeneralSettings';
import { TeamManager } from './TeamManager';
import { HomeManager } from './HomeManager';
import { SliderManager } from './SliderManager';
import { AboutManager } from './AboutManager';
import { PlatformsManager } from './PlatformsManager';
import { FAQManager } from './FAQManager';
import { GalleryManager } from './GalleryManager';
import { PopupManager } from './PopupManager';
import { Toaster } from 'sonner';
import { authService } from '../../services/authService';
import { ConfirmProvider } from './components/ConfirmDialog';

export function AdminPanel() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard onNavigate={setCurrentPage} />;
      case 'general': return <GeneralSettings />;
      case 'team': return <TeamManager />;
      case 'home': return <HomeManager onNavigate={setCurrentPage} />;
      case 'sliders': return <SliderManager />;
      case 'popups': return <PopupManager />;
      case 'about': return <AboutManager />;
      case 'platforms': return <PlatformsManager />;
      case 'faq': return <FAQManager />;
      case 'gallery': return <GalleryManager />;
      case 'media': return <MediaManager />;
      case 'projetos': return <ContentManager key="projetos" section="projetos" />;
      case 'eventos': return <ContentManager key="eventos" section="eventos" />;
      case 'premios': return <ContentManager key="premios" section="premios" />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>Em breve: {currentPage}</p>
          </div>
        );
    }
  };


  return (
    <ConfirmProvider>
      <DndProvider backend={HTML5Backend}>
        <AdminLayout
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onLogout={handleLogout}
        >
          {renderContent()}
          <Toaster position="top-right" />
        </AdminLayout>
      </DndProvider>
    </ConfirmProvider>
  );
}
