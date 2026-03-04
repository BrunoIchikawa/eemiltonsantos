import { useState } from 'react';
import { Plus, Calendar, Image as ImageIcon, MoreVertical, Trash2, Edit2, X, Check, Crop, Upload } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';
import { GalleryAlbum } from '../../types';
import { ImageWithFallback } from '../components/ui_elements/ImageWithFallback';
import { toast } from 'sonner';
import { MediaPicker } from './components/MediaPicker';
import { ImageCropperModal } from './components/ImageCropperModal';
import { useConfirm } from './components/ConfirmDialog';
import { PageBannerEditor } from './components/PageBannerEditor';

export function GalleryManager() {
  const { data, updateGallery, uploadFile, deleteMedia } = useSiteData();
  const [isEditing, setIsEditing] = useState(false);
  const [currentAlbum, setCurrentAlbum] = useState<Partial<GalleryAlbum>>({});
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showCoverMediaModal, setShowCoverMediaModal] = useState(false);
  const [showCropper, setShowCropper] = useState(false);

  const handleCropFinalize = async (croppedFile: File, deleteOriginal?: boolean) => {
    try {
      const novaMedia = await uploadFile(croppedFile);
      if (novaMedia) {
        if (deleteOriginal && currentAlbum.coverImage) {
          const origItem = data?.media.find(m => m.url === currentAlbum.coverImage);
          if (origItem) deleteMedia(origItem.id);
        }
        setCurrentAlbum(prev => ({ ...prev, coverImage: novaMedia.url }));
        setShowCropper(false);
      }
    } catch {
      toast.error('Erro ao subir capa recortada.');
    }
  };

  // Helpers for formatting date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
  };

  const handleSave = () => {
    if (!currentAlbum.title || !currentAlbum.date) {
      toast.error('Preencha o título e a data do evento.');
      return;
    }

    const newAlbum: GalleryAlbum = {
      id: currentAlbum.id || Date.now().toString(),
      title: currentAlbum.title,
      date: currentAlbum.date,
      category: currentAlbum.category || 'Eventos', // Default category
      coverImage: currentAlbum.coverImage || 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80', // Default placeholder
      images: currentAlbum.images || [],
      active: currentAlbum.active !== undefined ? currentAlbum.active : true,
    };

    if (currentAlbum.id) {
      // Update existing
      const updatedGallery = data.gallery.map(g => g.id === newAlbum.id ? newAlbum : g);
      updateGallery(updatedGallery);
      toast.success('Álbum atualizado com sucesso!');
    } else {
      // Create new
      updateGallery([...data.gallery, newAlbum]);
      toast.success('Álbum criado com sucesso!');
    }
    setIsEditing(false);
    setCurrentAlbum({});
  };

  const showConfirm = useConfirm();

  const handleDelete = async (id: string) => {
    const ok = await showConfirm({ message: 'Tem certeza que deseja excluir este álbum?', variant: 'danger', confirmText: 'Excluir' });
    if (ok) {
      updateGallery(data.gallery.filter(g => String(g.id) !== String(id)));
      toast.success('Álbum excluído.');
    }
  };

  const openEdit = (album: GalleryAlbum) => {
    setCurrentAlbum({ ...album });
    setIsEditing(true);
  };

  const openNew = () => {
    setCurrentAlbum({
      title: '',
      date: new Date().toISOString().split('T')[0],
      images: [],
      active: true,
      category: 'Eventos'
    });
    setIsEditing(true);
  };

  const removePhoto = (index: number) => {
    setCurrentAlbum(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index)
    }));
  };

  if (isEditing) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {currentAlbum.id ? 'Editar Álbum' : 'Novo Álbum'}
          </h1>
          <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nome do Álbum</label>
              <input
                type="text"
                value={currentAlbum.title || ''}
                onChange={e => setCurrentAlbum(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7BA6] focus:border-transparent outline-none"
                placeholder="Ex: Festa Junina 2024"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Categoria</label>
              <select
                value={currentAlbum.category || 'Eventos'}
                onChange={e => setCurrentAlbum(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7BA6] focus:border-transparent outline-none bg-white"
              >
                {(() => {
                  const options = data.general.dropdownOptions?.galleryCategories;
                  const safeOptions = options && options.length > 0 ? options : ['Eventos', 'Geral'];
                  return safeOptions.map(cat => <option key={cat} value={cat}>{cat}</option>);
                })()}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Data do Evento</label>
              <input
                type="date"
                value={currentAlbum.date?.split('T')[0] || ''}
                onChange={e => setCurrentAlbum(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7BA6] focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Capa do Álbum</label>
            <div className="aspect-[21/9] sm:aspect-[16/9] w-full md:w-2/3 lg:w-1/2 bg-gray-100 rounded-xl overflow-hidden relative group border-2 border-dashed border-gray-300 cursor-pointer hover:border-[#2E7BA6] transition-colors flex items-center justify-center">
              {currentAlbum.coverImage ? (
                <>
                  <ImageWithFallback
                    src={currentAlbum.coverImage}
                    alt="Cover Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setCurrentAlbum(prev => ({ ...prev, coverImage: '' })); }}
                    className="absolute top-2 right-2 text-white bg-red-600/80 hover:bg-red-700 p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100 z-10"
                    title="Remover Capa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-3">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setShowCoverMediaModal(true); }}
                      className="text-white text-xs sm:text-sm font-medium flex items-center gap-2 bg-black/50 hover:bg-black/70 px-4 py-2 rounded-full backdrop-blur-sm transition-colors"
                    >
                      <Upload className="w-4 h-4" /> Alterar Capa
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setShowCropper(true); }}
                      className="text-white text-xs sm:text-sm font-medium flex items-center gap-2 bg-black/50 hover:bg-black/70 px-4 py-2 rounded-full backdrop-blur-sm transition-colors"
                    >
                      <Crop className="w-4 h-4" /> Recortar/Ajustar
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center p-6" onClick={() => setShowCoverMediaModal(true)}>
                  <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <span className="text-gray-500 font-medium block text-sm">Clique para definir a capa</span>
                </div>
              )}
            </div>
            <p className="text-xs text-purple-600 font-semibold mb-2 mt-1">Dica: Recomendamos imagens horizontais na proporção 16:9 para a capa externa do álbum.</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Fotos do Álbum ({currentAlbum.images?.length || 0})</label>
              <button
                onClick={() => setShowMediaModal(true)}
                type="button"
                className="text-sm text-[#2E7BA6] font-medium hover:underline flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Adicionar Foto (MediaPicker)
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-xl min-h-[120px] border-2 border-dashed border-gray-200">
              {currentAlbum.images?.map((img, idx) => (
                <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-200">
                  <ImageWithFallback src={img} alt="Foto" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePhoto(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {currentAlbum.coverImage === img && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-1">
                      Capa
                    </div>
                  )}
                  {currentAlbum.coverImage !== img && (
                    <button
                      onClick={() => setCurrentAlbum(prev => ({ ...prev, coverImage: img }))}
                      className="absolute bottom-0 left-0 right-0 bg-blue-500/80 text-white text-[10px] text-center py-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Definir Capa
                    </button>
                  )}
                </div>
              ))}
              {(!currentAlbum.images || currentAlbum.images.length === 0) && (
                <div className="col-span-full flex items-center justify-center text-gray-400 text-sm">
                  Nenhuma foto adicionada
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-[#2E7BA6] text-white rounded-lg hover:bg-[#256285] transition-colors font-medium flex items-center gap-2"
            >
              <Check className="w-4 h-4" /> Salvar Álbum
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageBannerEditor pageKey="galeria" label="Galeria" />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Galeria de Eventos</h1>
          <p className="text-gray-500">Gerencie os álbuns de fotos e eventos da escola.</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-[#2E7BA6] text-white px-4 py-2 rounded-lg hover:bg-[#256285] transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Álbum</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.gallery.map((album) => (
          <div
            key={album.id}
            className="group bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col"
          >
            {/* Album Cover */}
            <div className="relative h-48 bg-gray-100 overflow-hidden">
              <ImageWithFallback
                src={album.coverImage}
                alt={album.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="flex items-center gap-2 text-xs opacity-90 mb-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(album.date)}
                </div>
                <h3 className="font-bold text-lg leading-tight truncate">{album.title}</h3>
                <p className="text-xs text-gray-300 mt-1">{album.category}</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
                  <ImageIcon className="w-4 h-4 text-[#2E7BA6]" />
                  <span className="font-medium">{album.images?.length || 0}</span>
                  <span className="text-gray-400 text-xs">FOTOS</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${album.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {album.active ? 'Publicado' : 'Rascunho'}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(album)}
                    className="p-2 text-gray-500 hover:text-[#2E7BA6] hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(album.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {data.gallery.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <ImageIcon className="w-12 h-12 mb-3 opacity-20" />
            <p className="font-medium">Nenhum álbum criado ainda.</p>
            <p className="text-sm">Clique em "Novo Álbum" para começar.</p>
          </div>
        )}
      </div>

      {showMediaModal && (
        <MediaPicker
          onSelect={(url) => {
            setCurrentAlbum(prev => ({
              ...prev,
              images: [...(prev.images || []), url]
            }));
            setShowMediaModal(false);
          }}
          onClose={() => setShowMediaModal(false)}
        />
      )}

      {showCoverMediaModal && (
        <MediaPicker
          onSelect={(url) => {
            setCurrentAlbum(prev => ({ ...prev, coverImage: url }));
            setShowCoverMediaModal(false);
          }}
          onClose={() => setShowCoverMediaModal(false)}
        />
      )}

      {showCropper && currentAlbum.coverImage && (
        <ImageCropperModal
          imageSrc={currentAlbum.coverImage}
          aspectRatio={16 / 9}
          onClose={() => setShowCropper(false)}
          onCropCompleteFinal={handleCropFinalize}
        />
      )}
    </div>
  );
}
