import { useState } from 'react';
import { Search, Upload, Trash2, Image as ImageIcon, X, Filter } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';
import { ImageWithFallback } from '../components/ui_elements/ImageWithFallback';
import { toast } from 'sonner';
import { MediaItem } from '../../types';

export function MediaManager() {
  const { data, uploadFile, deleteMedia, updateHome, updatePopups, updateSlides, updateTeam, updateAbout, updateGallery, updateProjects, updateAwards } = useSiteData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // A aba Galeria de Mídia agora exibe APENAS os dados reais salvos no Banco de Dados
  // A Fonte de Verdade (Single Source of Truth) para Mídias é o repositório `data.media`
  // Outras galerias não compõem esse array, e sim se abastecem dele através de FKs no backend.
  const allImages = data.media || [];

  const filteredItems = allImages.filter((item: MediaItem) => {
    return item.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getUsageLabel = (url: string) => {
    if (!data) return "Desconhecido";
    const usageList: string[] = [];

    if (data.home) {
      if (data.home.heroImage === url) usageList.push("Home (Hero)");
      if (data.home.schoolMenu?.imageUrl === url) usageList.push("Home (Cardápio)");
    }
    if (data.popups?.some(p => p.imageUrl === url)) usageList.push("Pop-ups");
    if (data.slides?.some(s => s.image === url)) usageList.push("Slides");
    if (data.team?.some(t => t.photo === url)) usageList.push("Equipe");
    if (data.about?.images?.includes(url)) usageList.push("Sobre (Galeria)");
    if (data.gallery?.some(g => g.coverImage === url || g.images?.includes(url))) usageList.push("Galeria (Álbuns)");
    if (data.projects?.some(p => p.image === url || p.gallery?.includes(url))) usageList.push("Projetos");
    if (data.awards?.some(a => a.image === url)) usageList.push("Prêmios");

    if (usageList.length === 0) return "Sem uso ativo no site";
    return "Usado em: " + Array.from(new Set(usageList)).join(', ');
  };

  const handleSelect = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((i) => i !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleDelete = () => {
    let homeChanged = false;
    let newHome = data.home ? { ...data.home } : null;
    let popupsChanged = false;
    let newPopups = data.popups ? [...data.popups] : [];
    let slidesChanged = false;
    let newSlides = data.slides ? [...data.slides] : [];
    let teamChanged = false;
    let newTeam = data.team ? [...data.team] : [];
    let aboutChanged = false;
    let newAbout = data.about ? { ...data.about } : null;
    let galleryChanged = false;
    let newGallery = data.gallery ? [...data.gallery] : [];
    let projectsChanged = false;
    let newProjects = data.projects ? [...data.projects] : [];
    let awardsChanged = false;
    let newAwards = data.awards ? [...data.awards] : [];

    selectedItems.forEach((id) => {
      const itemToDelete = data.media.find(m => m.id === id);
      if (!itemToDelete) {
        deleteMedia(id);
        return;
      }
      const url = itemToDelete.url;

      if (newHome) {
        if (newHome.heroImage === url) { newHome.heroImage = ''; homeChanged = true; }
        if (newHome.schoolMenu?.imageUrl === url) { newHome.schoolMenu.imageUrl = ''; homeChanged = true; }
      }

      newPopups = newPopups.map(p => {
        if (p.imageUrl === url) { popupsChanged = true; return { ...p, imageUrl: '' }; }
        return p;
      });

      newSlides = newSlides.map(s => {
        if (s.image === url) { slidesChanged = true; return { ...s, image: '' }; }
        return s;
      });

      newTeam = newTeam.map(t => {
        if (t.photo === url) { teamChanged = true; return { ...t, photo: '' }; }
        return t;
      });

      if (newAbout?.images?.includes(url)) {
        newAbout.images = newAbout.images.filter((img: string) => img !== url);
        aboutChanged = true;
      }

      newGallery = newGallery.map(g => {
        let changed = false;
        let coverImage = g.coverImage;
        let images = g.images;
        if (coverImage === url) { coverImage = ''; changed = true; }
        if (images?.includes(url)) { images = images.filter((img: string) => img !== url); changed = true; }
        if (changed) { galleryChanged = true; return { ...g, coverImage, images }; }
        return g;
      });

      newProjects = newProjects.map(p => {
        let changed = false;
        let image = p.image;
        let gallery = p.gallery;
        if (image === url) { image = ''; changed = true; }
        if (gallery?.includes(url)) { gallery = gallery.filter((img: string) => img !== url); changed = true; }
        if (changed) { projectsChanged = true; return { ...p, image, gallery }; }
        return p;
      });

      newAwards = newAwards.map(a => {
        if (a.image === url) { awardsChanged = true; return { ...a, image: '' }; }
        return a;
      });

      deleteMedia(id);
    });

    if (homeChanged && newHome) updateHome(newHome);
    if (popupsChanged) updatePopups(newPopups);
    if (slidesChanged) updateSlides(newSlides);
    if (teamChanged) updateTeam(newTeam);
    if (aboutChanged && newAbout) updateAbout(newAbout);
    if (galleryChanged) updateGallery(newGallery);
    if (projectsChanged) updateProjects(newProjects);
    if (awardsChanged) updateAwards(newAwards);

    setSelectedItems([]);
    setShowDeleteConfirm(false);
  };

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/mp4,video/webm';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setIsUploading(true);
        try {
          await uploadFile(file);
        } catch (error) {
          toast.error("Ocorreu um erro ao subir a imagem");
        } finally {
          setIsUploading(false);
          // Atualiza lista via context listener
        }
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciador de Mídia Unificado</h1>
          <p className="text-gray-500">Visualize todas as imagens do sistema em um só lugar.</p>
        </div>
        <button
          onClick={handleUpload}
          className="flex items-center gap-2 bg-[#2E7BA6] text-white px-4 py-2 rounded-lg hover:bg-[#256285] transition-colors shadow-sm"
        >
          <Upload className="w-5 h-5" />
          <span>Upload Manual</span>
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {/* Filtros e Busca */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7BA6] focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {selectedItems.length > 0 && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors border border-red-200"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Excluir ({selectedItems.length})</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Grid de Mídia */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredItems.length === 0 ? (
            <div className="col-span-full py-20 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Nenhuma imagem encontrada neste filtro.</p>
            </div>
          ) : (
            filteredItems.map((item: MediaItem) => {
              const usageText = getUsageLabel(item.url);
              const isUnused = usageText === "Sem uso ativo no site";

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`
                  group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-200 bg-gray-100
                  ${selectedItems.includes(item.id)
                      ? 'border-[#2E7BA6] ring-2 ring-[#2E7BA6] ring-opacity-50 scale-95'
                      : 'border-transparent hover:border-gray-300'
                    }
                `}
                  title={item.name + " | " + usageText}
                >
                  <ImageWithFallback src={item.url} alt={item.name} className="w-full h-full object-cover" />

                  {/* Status Badge */}
                  <div className="absolute top-2 left-2 right-2 flex justify-between items-start opacity-100">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded shadow text-white ${isUnused ? 'bg-gray-500/90' : 'bg-green-600/90'}`}>
                      {isUnused ? 'Não em uso' : 'Em Uso'}
                    </span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedItems.includes(item.id) ? 'bg-[#2E7BA6] border-[#2E7BA6]' : 'border-white bg-black/40'}`}>
                      {selectedItems.includes(item.id) && <span className="text-white text-xs">✓</span>}
                    </div>
                  </div>

                  {/* Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity flex flex-col justify-end p-3 ${selectedItems.includes(item.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                    <p className="text-white text-xs font-semibold truncate mb-1">{item.name}</p>
                    <p className="text-gray-300 text-[10px] leading-tight line-clamp-2">{usageText}</p>

                    <div className="mt-2 pt-2 border-t border-white/20 flex justify-between items-center">
                      <span className="text-[10px] text-red-300 flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> Clique para selecionar
                      </span>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmar Exclusão</h3>
            <p className="text-gray-500 mb-6">
              Tem certeza que deseja excluir <strong>{selectedItems.length}</strong> imagens da biblioteca?
              <br /><br />
              <span className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded block">
                ⚠️ Cuidado! Imagens ativamente em uso (ex: Capa de Projetos, Galeria ou Equipe) <strong>TAMPÉM SERÃO DESVINCULADAS</strong> das suas respectivas páginas e essas páginas ficarão sem imagem.
              </span>
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors font-medium"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
