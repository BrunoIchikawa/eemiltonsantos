import { useState } from 'react';
import { Search, Upload, Trash2, Image as ImageIcon, X, Copy, CheckCircle2, ChevronRight, Info } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';
import { ImageWithFallback } from '../components/ui_elements/ImageWithFallback';
import { toast } from 'sonner';
import { MediaItem } from '../../types';

export function MediaManager() {
  const { data, uploadFile, deleteMedia, updateHome, updatePopups, updateSlides, updateTeam, updateAbout, updateGallery, updateProjects, updateAwards } = useSiteData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'used' | 'unused'>('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  const allImages = data.media || [];

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
    return Array.from(new Set(usageList)).join(', ');
  };

  const filteredItems = allImages.filter((item: MediaItem) => {
    const usageText = getUsageLabel(item.url);
    const isUnused = usageText === "Sem uso ativo no site";

    if (filter === 'used' && isUnused) return false;
    if (filter === 'unused' && !isUnused) return false;

    return item.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSelect = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((i) => i !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleSelectAllFiltered = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
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
    setPreviewItem(null); // Ensure preview modal is closed if the previewed item was deleted
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
        }
      }
    };
    input.click();
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Link copiado para a área de transferência!');
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciador de Mídia</h1>
          <p className="text-gray-500">Visualize todas as imagens do sistema, consulte usos e copie links diretos.</p>
        </div>
        <button
          onClick={handleUpload}
          className="flex items-center gap-2 bg-[#2E7BA6] text-white px-4 py-2 rounded-lg hover:bg-[#256285] transition-colors shadow-sm"
          disabled={isUploading}
        >
          <Upload className="w-5 h-5" />
          <span>{isUploading ? 'Enviando...' : 'Fazer Upload'}</span>
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {/* Filtros e Busca Repaginados */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
          
          {/* Caixa de Busca */}
          <div className="relative flex-1 p-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar pelo nome do arquivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-full pl-10 pr-4 py-2 bg-transparent focus:outline-none text-gray-700"
            />
          </div>

          {/* Abas de Filtros */}
          <div className="flex items-center bg-gray-50/50 p-2 sm:px-4">
            <div className="flex bg-gray-200/50 p-1 rounded-lg gap-1">
              <button 
                onClick={() => setFilter('all')} 
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'all' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'}`}
              >
                Todas
              </button>
              <button 
                onClick={() => setFilter('used')} 
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'used' ? 'bg-white shadow-sm text-[#2E7BA6]' : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'}`}
              >
                Em Uso
              </button>
              <button 
                onClick={() => setFilter('unused')} 
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'unused' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'}`}
              >
                Sem Uso
              </button>
            </div>
          </div>
        </div>

        {/* Barra de Ações de Lote (Aparece quando itens são selecionados) */}
        {selectedItems.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex justify-between items-center animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <span className="text-red-700 font-medium text-sm">
                {selectedItems.length} imagem(ns) selecionada(s) para exclusão
              </span>
              <button onClick={() => setSelectedItems([])} className="text-sm text-red-500 hover:underline">
                Cancelar seleção
              </button>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 px-4 py-1.5 rounded-lg transition-colors font-medium text-sm shadow-sm opacity-90 hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
              Excluir Definitivamente
            </button>
          </div>
        )}

        {/* Ações Rápidas de Seleção */}
        {filteredItems.length > 0 && (
          <div className="flex justify-between items-center px-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {filteredItems.length} Mídias Encontradas
            </p>
            <button
              onClick={handleSelectAllFiltered}
              className="text-xs font-medium text-[#2E7BA6] hover:underline"
            >
              {selectedItems.length === filteredItems.length ? 'Desmarcar Todas' : 'Selecionar Todas desta view'}
            </button>
          </div>
        )}

        {/* Grid de Mídia */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          
          {/* Esqueleto de Upload Ativo */}
          {isUploading && (
            <div className="group relative aspect-square rounded-xl overflow-hidden border-2 border-dashed border-[#2E7BA6] bg-[#2E7BA6]/5 flex flex-col items-center justify-center animate-pulse">
              <div className="w-8 h-8 rounded-full border-4 border-[#2E7BA6] border-t-transparent animate-spin mb-2" />
              <span className="text-sm font-bold text-[#2E7BA6]">Enviando...</span>
            </div>
          )}

          {filteredItems.length === 0 && !isUploading ? (
            <div className="col-span-full py-20 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-xl bg-white shadow-sm">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium text-gray-800">Nenhuma imagem encontrada.</p>
              <p className="text-sm">Envie uma nova imagem ou altere seus filtros.</p>
            </div>
          ) : (
            filteredItems.map((item: MediaItem) => {
              const usageText = getUsageLabel(item.url);
              const isUnused = usageText === "Sem uso ativo no site";
              const isSelected = selectedItems.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={`
                    group relative aspect-square rounded-xl overflow-hidden bg-white shadow-sm transition-all duration-200 border-2
                    ${isSelected ? 'border-red-500 scale-[0.98]' : 'border-transparent hover:border-gray-300 hover:shadow-md'}
                  `}
                >
                  {/* Fundo de visualização da imagem com ação principal (Preview) */}
                  <div 
                    onClick={() => setPreviewItem(item)} 
                    className="w-full h-full cursor-pointer absolute inset-0 z-0 bg-gray-100"
                  >
                    <ImageWithFallback src={item.url} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Badge de Seleção para Exclusão (Canto Superior Esquerdo) */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleSelect(item.id); }}
                    title={isSelected ? "Desmarcar" : "Selecionar para exclusão"}
                    className={`absolute top-2 left-2 z-10 w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200 ${
                      isSelected 
                        ? 'bg-red-500 text-white shadow-sm' 
                        : 'bg-white/80 text-gray-300 hover:text-red-400 border border-gray-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  {/* Status Badge de Uso (Canto Superior Direito) */}
                  <div className="absolute top-2 right-2 z-10 pointer-events-none">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded shadow-sm text-white uppercase tracking-wider ${isUnused ? 'bg-gray-500/90' : 'bg-[#4A8B63]/90'}`}>
                      {isUnused ? 'Sem Uso' : 'Em Uso'}
                    </span>
                  </div>

                  {/* Overlay Escuro com Infos no Hover */}
                  <div 
                    onClick={() => setPreviewItem(item)}
                    className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-8 pb-3 px-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer pointer-events-none z-0"
                  >
                    <p className="text-white text-xs font-semibold truncate mb-0.5">{item.name}</p>
                    {item.size && <p className="text-gray-300 text-[10px] mb-1">{item.size}</p>}
                    <p className="text-[#A2D5F2] text-[10px] leading-tight line-clamp-2">
                       {usageText === "Sem uso ativo no site" ? '-' : `Usado em: ${usageText}`}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal de Detalhes da Mídia (Preview) */}
      {previewItem && (
         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 xl:p-10 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
             
             {/* Área de Visualização da Imagem (Esquerda/Topo) */}
             <div className="flex-1 bg-gray-100 relative min-h-[300px] flex items-center justify-center">
                <button 
                  onClick={() => setPreviewItem(null)}
                  className="absolute top-4 left-4 p-2 bg-white/50 hover:bg-white text-gray-800 rounded-full md:hidden z-10 backdrop-blur-sm"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute inset-0 pattern-checkerboard opacity-5"></div>
                <img 
                  src={previewItem.url} 
                  alt={previewItem.name} 
                  className="max-w-full max-h-full object-contain relative z-0 p-4 drop-shadow-md"
                />
             </div>

             {/* Painel de Informações (Direita/Base) */}
             <div className="w-full md:w-80 lg:w-96 p-6 flex flex-col bg-white border-l border-gray-100 shrink-0 overflow-y-auto">
               <div className="flex justify-between items-start mb-6 hidden md:flex">
                  <h3 className="text-lg font-bold text-gray-900">Detalhes do Arquivo</h3>
                  <button onClick={() => setPreviewItem(null)} className="text-gray-400 hover:text-gray-600 transition-colors p-1 bg-gray-50 rounded-full hover:bg-gray-100">
                    <X className="w-5 h-5" />
                  </button>
               </div>

               <div className="flex-1 space-y-6">
                 <div>
                   <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Nome do Arquivo</label>
                   <p className="text-sm text-gray-900 font-medium break-all">{previewItem.name}</p>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Data de Upload</label>
                     <p className="text-sm text-gray-900 font-medium">{previewItem.date || 'Desconhecida'}</p>
                   </div>
                   <div>
                     <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Tamanho</label>
                     <p className="text-sm text-gray-900 font-medium">{previewItem.size || 'N/A'}</p>
                   </div>
                 </div>

                 <div>
                   <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                     <Info className="w-3.5 h-3.5" /> Onde está sendo usada?
                   </label>
                   {getUsageLabel(previewItem.url) === "Sem uso ativo no site" ? (
                     <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-500 text-center">
                       Sem uso atual. Pode ser excluída com segurança.
                     </div>
                   ) : (
                     <div className="flex flex-wrap gap-2">
                       {getUsageLabel(previewItem.url).split(', ').map(tag => (
                         <span key={tag} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded border border-blue-100">
                           {tag}
                         </span>
                       ))}
                     </div>
                   )}
                 </div>

                 <div className="pt-4 border-t border-gray-100">
                   <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">URL Direta (Link)</label>
                   <div className="flex gap-2">
                     <input 
                       type="text" 
                       readOnly 
                       value={previewItem.url} 
                       className="text-xs bg-gray-50 border border-gray-200 rounded py-2 px-3 flex-1 text-gray-600 focus:outline-none"
                     />
                     <button 
                       onClick={() => copyToClipboard(previewItem.url)}
                       className="bg-[#2E7BA6] hover:bg-[#256285] text-white p-2 rounded transition-colors flex items-center justify-center"
                       title="Copiar URL"
                     >
                       <Copy className="w-4 h-4" />
                     </button>
                   </div>
                   <p className="text-[10px] text-gray-400 mt-2">
                     Copie este link para incorporar manualmente em editores ricos das seções do site (se aplicável), ou no popup em formato HTML.
                   </p>
                 </div>
               </div>

               <div className="mt-8 pt-4 border-t border-gray-100 flex gap-3">
                 <button 
                   onClick={() => {
                     handleSelect(previewItem.id);
                     if (!selectedItems.includes(previewItem.id)) {
                        toast.success('Adicionado à fila de exclusão.');
                     }
                   }}
                   className={`flex-1 flex justify-center items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors border ${
                     selectedItems.includes(previewItem.id) 
                       ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                       : 'bg-white text-red-600 border-gray-200 hover:border-red-200 hover:bg-red-50'
                   }`}
                 >
                   <Trash2 className="w-4 h-4" /> 
                   {selectedItems.includes(previewItem.id) ? 'Cancelar exclusão' : 'Marcar para excluir'}
                 </button>
               </div>

             </div>
           </div>
         </div>
      )}

      {/* Modal de Confirmação de Exclusão (Preservado e Estilizado) */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmar Exclusão</h3>
            <p className="text-gray-500 mb-6">
              Tem certeza que deseja excluir <strong>{selectedItems.length}</strong> imagem(ns) da biblioteca?
              <br /><br />
              <span className="text-sm text-yellow-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200 block">
                <strong>⚠️ Cuidado!</strong> Mídias ativamente em uso serão <strong>desvinculadas</strong> das suas respectivas páginas e essas páginas ficarão sem imagem.
              </span>
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium border border-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors font-bold shadow-sm"
              >
                Sim, Excluir Definitivamente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
