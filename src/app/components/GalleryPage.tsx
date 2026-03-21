import { useState, useEffect } from 'react';
import { Calendar, MapPin, Lightbulb, Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './ui_elements/ImageWithFallback';
import { useSiteData } from '../context/SiteContext';
import { GalleryAlbum } from '../../types';

export function GalleryPage() {
  const { data } = useSiteData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  
  // Helpers for formatting date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
  };

  const categories = [
    { id: 'all', label: 'Todas', icon: ImageIcon },
    { id: 'Eventos', label: 'Eventos', icon: Calendar },
    { id: 'Passeios Pedagógicos', label: 'Passeios Pedagógicos', icon: MapPin },
    { id: 'Projetos Escolares', label: 'Projetos Escolares', icon: Lightbulb },
  ];

  // Filter only active albums and by category
  const filteredAlbums = data.gallery.filter(
    (album) => {
      const isActive = album.active !== false; // Default true
      const matchesCategory = selectedCategory === 'all' || album.category === selectedCategory;
      return isActive && matchesCategory;
    }
  );

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = 'auto';
  };

  const nextPhoto = () => {
    if (selectedAlbum && lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % selectedAlbum.images.length);
    }
  };

  const prevPhoto = () => {
    if (selectedAlbum && lightboxIndex !== null) {
      setLightboxIndex(
        (lightboxIndex - 1 + selectedAlbum.images.length) % selectedAlbum.images.length
      );
    }
  };

  // Visualização do álbum
  if (selectedAlbum) {
    return (
      <>
        <div className="min-h-screen">
          <div className="bg-muted py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <button
                onClick={() => setSelectedAlbum(null)}
                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="font-medium">Voltar para Galeria</span>
              </button>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">{selectedAlbum.title}</h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-muted-foreground">
                <span className="flex items-center gap-1 text-sm">
                  <Calendar className="w-4 h-4 shrink-0" />
                  {formatDate(selectedAlbum.date)}
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <ImageIcon className="w-4 h-4 shrink-0" />
                  {selectedAlbum.images.length} fotos
                </span>
                 <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                  {selectedAlbum.category}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {selectedAlbum.images.map((photo: string, index: number) => (
                <button
                  key={index}
                  onClick={() => openLightbox(index)}
                  className="aspect-square bg-muted rounded-lg overflow-hidden group"
                >
                  <ImageWithFallback
                    src={photo}
                    alt={`${selectedAlbum.title} - foto ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lightbox */}
        {lightboxIndex !== null && (
          <div 
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center animate-in fade-in duration-200"
            onTouchStart={(e) => {
              const t = e.touches[0];
              (e.currentTarget as any)._touchStartX = t.clientX;
            }}
            onTouchEnd={(e) => {
              const startX = (e.currentTarget as any)._touchStartX;
              if (startX === undefined) return;
              const endX = e.changedTouches[0].clientX;
              const diff = startX - endX;
              if (Math.abs(diff) > 50) {
                if (diff > 0) nextPhoto();
                else prevPhoto();
              }
            }}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2 z-10 bg-black/40 rounded-full backdrop-blur-sm"
              aria-label="Fechar"
            >
              <X className="w-7 h-7" />
            </button>

            <button
              onClick={prevPhoto}
              className="absolute left-2 sm:left-4 text-white hover:text-gray-300 transition-colors p-2 z-10 hidden sm:block"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <div className="max-w-6xl max-h-[90vh] px-2 sm:px-8 lg:px-16 w-full flex flex-col items-center">
              <ImageWithFallback
                src={selectedAlbum.images[lightboxIndex]}
                alt={`${selectedAlbum.title} - foto ${lightboxIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain"
              />
              <div className="text-white text-center mt-4 text-sm">
                {lightboxIndex + 1} / {selectedAlbum.images.length}
                <span className="text-white/50 ml-2 sm:hidden">← Deslize →</span>
              </div>
            </div>

            <button
              onClick={nextPhoto}
              className="absolute right-2 sm:right-4 text-white hover:text-gray-300 transition-colors p-2 z-10 hidden sm:block"
              aria-label="Próxima"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        )}
      </>
    );
  }

  // Visualização principal da galeria
  return (
    <div className="min-h-screen">
      {/* Standard Header */}
      <section className="bg-gradient-to-r from-[#705741] to-[#A88F71] text-white py-12 sm:py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">{data.general.pageBanners?.galeria?.title || 'Galeria'}</h1>
          <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto">
            {data.general.pageBanners?.galeria?.subtitle || 'Acompanhe os melhores momentos da nossa escola através de imagens.'}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Filtros */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-primary text-primary-foreground shadow-md scale-105'
                      : 'bg-card border border-border hover:border-primary hover:shadow-sm'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">{category.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Álbuns */}
        <section>
          <div className="mb-6">
            <p className="text-muted-foreground">
              {filteredAlbums.length} {filteredAlbums.length === 1 ? 'álbum encontrado' : 'álbuns encontrados'}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlbums.length > 0 ? (
              filteredAlbums.map((album) => (
                <div
                  key={album.id}
                  className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <ImageWithFallback
                      src={album.coverImage}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" />
                      {album.images.length}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(album.date)}
                      </span>
                      <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px] uppercase">
                        {album.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors">
                      {album.title}
                    </h3>
                    <button
                      onClick={() => setSelectedAlbum(album)}
                      className="w-full bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-medium hover:bg-secondary/90 transition-all duration-200 hover:shadow-md"
                    >
                      Abrir Álbum
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed">
                <p>Nenhum álbum encontrado nesta categoria.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
