import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, useLocation, ScrollRestoration } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { TeamPage } from './components/TeamPage';
import { ProjectsPage } from './components/ProjectsPage';
import { GalleryPage } from './components/GalleryPage';
import { PlatformsPage } from './components/PlatformsPage';
import { FAQPage } from './components/FAQPage';
import { CalendarPage } from './components/CalendarPage';
import { AdminPanel } from './admin/AdminPanel';
import { SiteProvider } from './context/SiteContext';
import { PopupDisplay } from './components/PopupDisplay';
import { AuthGuard } from './components/AuthGuard';

// Layout padrão para as rotas públicas (Header, Content, Footer)
function PublicLayout() {
  const location = useLocation();
  const currentPage = location.pathname === '/' ? 'home' : location.pathname.substring(1);

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollRestoration />
      <PopupDisplay />
      <Header currentPage={currentPage} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// Configuração de rotas
const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/sobre', element: <AboutPage /> },
      { path: '/equipe', element: <TeamPage /> },
      { path: '/projetos', element: <ProjectsPage /> },
      { path: '/galeria', element: <GalleryPage /> },
      { path: '/plataformas', element: <PlatformsPage /> },
      { path: '/faq', element: <FAQPage /> },
      { path: '/calendario', element: <CalendarPage /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <AuthGuard>
        <AdminPanel />
      </AuthGuard>
    ),
  },
]);

export default function App() {
  return (
    <SiteProvider>
      <RouterProvider router={router} />
    </SiteProvider>
  );
}
