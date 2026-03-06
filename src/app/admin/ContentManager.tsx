import { useState } from 'react';
import { useSiteData } from '../context/SiteContext';
import { Project, Event, Award } from '../../types';
import { Plus, Edit2, Trash2, Calendar, Layout, Save, X, Image as ImageIcon, Users, Award as AwardIcon, Link as LinkIcon, Crop } from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from '../components/ui_elements/ImageWithFallback';
import { MediaPicker } from './components/MediaPicker';
import { ImageCropperModal } from './components/ImageCropperModal';
import { useConfirm } from './components/ConfirmDialog';
import { PageBannerEditor } from './components/PageBannerEditor';

interface ContentManagerProps {
  section: 'projetos' | 'eventos' | 'premios';
}

export function ContentManager({ section }: ContentManagerProps) {
  const { data, updateProjects, updateEvents, updateAwards, uploadFile, deleteMedia } = useSiteData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showCropper, setShowCropper] = useState(false);

  // Generic state for editing
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const handleCropFinalize = async (croppedFile: File, deleteOriginal?: boolean) => {
    try {
      const novaMedia = await uploadFile(croppedFile);
      if (novaMedia) {
        if (deleteOriginal && editingItem.image) {
          const origItem = data?.media.find(m => m.url === editingItem.image);
          if (origItem) deleteMedia(origItem.id);
        }
        setEditingItem((prev: any) => ({ ...prev, image: novaMedia.url }));
        setShowCropper(false);
      }
    } catch {
      toast.error('Erro ao subir imagem recortada.');
    }
  };

  // Helper functions for Date conversion
  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return '';
    // DD/MM/YYYY -> YYYY-MM-DD
    const parts = dateStr.split('/');
    if (parts.length !== 3) return '';
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const formatDateForStorage = (dateStr: string) => {
    if (!dateStr) return '';
    // YYYY-MM-DD -> DD/MM/YYYY
    const parts = dateStr.split('-');
    if (parts.length !== 3) return '';
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  const isDatePast = (dateStr: string) => {
    if (!dateStr) return false;
    // Expects DD/MM/YYYY
    const parts = dateStr.split('/');
    if (parts.length !== 3) return false;

    const eventDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`); // Local time
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return eventDate < today;
  };

  // Configuration based on section
  const getConfig = () => {
    if (section === 'projetos') {
      return {
        title: 'Gerenciar Projetos',
        description: 'Adicione ou edite os projetos pedagógicos da escola.',
        items: data.projects || [],
        updateFn: updateProjects,
        emptyItem: {
          id: '',
          title: '',
          description: '',
          fullDescription: '',
          category: 'Geral',
          year: new Date().getFullYear().toString(),
          image: '',
          coordinator: '',
          participants: 0,
          gallery: [],
          active: true
        } as Project
      };
    } else if (section === 'eventos') {
      return {
        title: 'Gerenciar Eventos',
        description: 'Mantenha a agenda escolar atualizada.',
        items: data.events || [],
        updateFn: updateEvents,
        emptyItem: {
          id: '',
          title: '',
          date: '',
          endDate: '',
          description: '',
          audience: 'Geral',
          active: true
        } as Event
      };
    } else {
      // Prêmios
      return {
        title: 'Gerenciar Prêmios',
        description: 'Adicione conquistas e reconhecimentos da escola.',
        items: data.awards || [],
        updateFn: updateAwards,
        emptyItem: {
          id: '',
          title: '',
          year: new Date().getFullYear().toString(),
          description: '',
          category: 'Acadêmico',
          image: '',
          link: '',
          active: true
        } as Award
      };
    }
  };

  const config = getConfig();

  const handleCreate = () => {
    setEditingItem({ ...config.emptyItem, id: Date.now().toString() });
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem({ ...item }); // Clone to avoid mutation
    setIsModalOpen(true);
  };

  const showConfirm = useConfirm();

  const handleDelete = async (id: string) => {
    const ok = await showConfirm({ message: 'Tem certeza que deseja excluir este item?', variant: 'danger', confirmText: 'Excluir' });
    if (ok) {
      const updated = config.items.filter((i: any) => String(i.id) !== String(id));
      config.updateFn(updated as any);
      toast.success('Item removido com sucesso!');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    // Validate required fields
    if (!editingItem.title) {
      toast.error('O título é obrigatório.');
      return;
    }

    // Specific validations for Events
    if (section === 'eventos') {
      if (!editingItem.date) {
        toast.error('A data do evento é obrigatória.');
        return;
      }

      if (isDatePast(editingItem.date)) {
        const ok = await showConfirm({ message: 'A data selecionada já passou. Deseja criar o evento mesmo assim?', variant: 'warning', confirmText: 'Criar mesmo assim' });
        if (!ok) return;
      }
    }

    let updatedItems;
    const exists = config.items.some((i: any) => i.id === editingItem.id);

    if (exists) {
      updatedItems = config.items.map((i: any) => i.id === editingItem.id ? editingItem : i);
    } else {
      updatedItems = [...config.items, editingItem];
    }

    config.updateFn(updatedItems as any);
    setIsModalOpen(false);
    toast.success('Salvo com sucesso!');
  };

  const handleSelectMedia = (url: string) => {
    setEditingItem({ ...editingItem, image: url });
    setShowMediaModal(false);
  };

  return (
    <div className="space-y-6 pb-20">
      {section !== 'premios' && (
        <PageBannerEditor
          pageKey={section}
          label={section === 'projetos' ? 'Projetos' : 'Eventos'}
        />
      )}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{config.title}</h1>
          <p className="text-gray-500">{config.description}</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-[#2E7BA6] text-white px-4 py-2 rounded-lg hover:bg-[#256285] transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Item</span>
        </button>
      </div>

      {/* Lista de Itens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(config.items || []).length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">Nenhum item cadastrado.</p>
            <button onClick={handleCreate} className="mt-4 text-[#2E7BA6] font-medium hover:underline">
              Cadastrar o primeiro item
            </button>
          </div>
        ) : (
          (config.items || []).map((item: any) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
              {item.image ? (
                <div className="h-48 overflow-hidden relative shrink-0">
                  <ImageWithFallback src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  {!item.active && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-white/90 px-3 py-1 rounded text-xs font-bold">Inativo</span>
                    </div>
                  )}
                </div>
              ) : section === 'premios' ? (
                <div className="h-48 bg-yellow-50 flex items-center justify-center text-yellow-500 relative shrink-0">
                  <AwardIcon className="w-16 h-16 opacity-50" />
                  {!item.active && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-white/90 px-3 py-1 rounded text-xs font-bold">Inativo</span>
                    </div>
                  )}
                </div>
              ) : null}

              <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{item.title}</h3>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Editar">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Excluir">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-1">{item.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-auto pt-2 border-t border-gray-100">
                  {section === 'eventos' && item.date && (
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {item.date} {item.startTime ? ` ${item.startTime}` : ''}{item.endTime && item.startTime ? ` às ${item.endTime}` : ''}</span>
                  )}
                  {section === 'eventos' && item.audience && (
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">{item.audience}</span>
                  )}
                  {(section === 'projetos' || section === 'premios') && item.year && (
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {item.year}</span>
                  )}
                  {item.category && <span className="bg-gray-100 px-2 py-0.5 rounded">{item.category}</span>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Edição */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {config.items.some((i: any) => i.id === editingItem.id) ? 'Editar Item' : 'Novo Item'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-gray-100 p-1 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={editingItem.title || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7BA6] focus:border-transparent outline-none transition-all"
                    required
                    placeholder="Nome do projeto, evento ou prêmio"
                  />
                </div>

                {/* Campos Específicos de Projeto e Prêmio */}
                {(section === 'projetos' || section === 'premios') && (
                  <>
                    <div className="col-span-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Imagem de Capa</label>
                      <div className="aspect-video sm:aspect-[21/9] w-full bg-gray-100 rounded-xl overflow-hidden relative group border-2 border-dashed border-gray-300 cursor-pointer hover:border-[#2E7BA6] transition-colors flex items-center justify-center">
                        {editingItem.image ? (
                          <>
                            <ImageWithFallback src={editingItem.image} alt="Preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setEditingItem((prev: any) => ({ ...prev, image: '' })); }}
                              className="absolute top-2 right-2 text-white bg-red-600/80 hover:bg-red-700 p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100 z-10"
                              title="Remover Capa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-3">
                              <button
                                type="button"
                                onClick={() => setShowMediaModal(true)}
                                className="text-white text-xs sm:text-sm font-medium flex items-center gap-2 bg-black/50 hover:bg-black/70 px-4 py-2 rounded-full backdrop-blur-sm transition-colors"
                              >
                                <ImageIcon className="w-4 h-4" /> Alterar Capa
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowCropper(true)}
                                className="text-white text-xs sm:text-sm font-medium flex items-center gap-2 bg-black/50 hover:bg-black/70 px-4 py-2 rounded-full backdrop-blur-sm transition-colors"
                              >
                                <Crop className="w-4 h-4" /> Recortar/Ajustar
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="text-center p-6" onClick={() => setShowMediaModal(true)}>
                            <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                            <span className="text-gray-500 font-medium block text-sm">Clique para definir a capa (Exibida na listagem)</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-purple-600 font-semibold mb-2 mt-1">Dica: Recomendamos imagens horizontais (panorâmicas 16:9 ou 21:9) para a capa.</p>
                    </div>
                  </>
                )}

                {section === 'projetos' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Coordenador</label>
                      <input
                        type="text"
                        value={editingItem.coordinator || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, coordinator: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7BA6] outline-none"
                        placeholder="Nome do responsável"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Participantes (Qtd.)</label>
                      <input
                        type="number"
                        value={editingItem.participants || 0}
                        onChange={(e) => setEditingItem({ ...editingItem, participants: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7BA6] outline-none"
                        min="0"
                      />
                    </div>
                    <div className="col-span-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Completa</label>
                      <textarea
                        value={editingItem.fullDescription || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, fullDescription: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7BA6] outline-none"
                        rows={6}
                        placeholder="Detalhes completos do projeto..."
                      />
                    </div>
                  </>
                )}

                {(section === 'projetos' || section === 'premios') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
                    <input
                      type="text"
                      value={editingItem.year || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, year: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7BA6] outline-none"
                      placeholder="Ex: 2026"
                    />
                  </div>
                )}

                {section === 'premios' && (
                  <div className="col-span-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Link para Detalhes (Opcional)</label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={editingItem.link || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, link: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7BA6] outline-none"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                )}

                {/* Campos Específicos de Eventos */}
                {section === 'eventos' && (
                  <>
                    <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Data <span className="text-red-500">*</span></label>
                        <input
                          type="date"
                          value={formatDateForInput(editingItem.date || '')}
                          onChange={(e) => setEditingItem({ ...editingItem, date: formatDateForStorage(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7BA6] outline-none [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:p-1 [&::-webkit-calendar-picker-indicator]:hover:bg-gray-100 [&::-webkit-calendar-picker-indicator]:rounded-full"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Data de Término <span className="text-xs text-gray-400">(opcional)</span></label>
                        <input
                          type="date"
                          value={formatDateForInput(editingItem.endDate || '')}
                          onChange={(e) => setEditingItem({ ...editingItem, endDate: formatDateForStorage(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7BA6] outline-none [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:p-1 [&::-webkit-calendar-picker-indicator]:hover:bg-gray-100 [&::-webkit-calendar-picker-indicator]:rounded-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hora de Início</label>
                        <input
                          type="time"
                          value={editingItem.startTime || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, startTime: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7BA6] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hora de Término</label>
                        <input
                          type="time"
                          value={editingItem.endTime || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, endTime: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7BA6] outline-none"
                        />
                      </div>
                    </div>
                    <div className="col-span-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Público Alvo</label>
                      <select
                        value={editingItem.audience || 'Geral'}
                        onChange={(e) => setEditingItem({ ...editingItem, audience: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7BA6] outline-none bg-white"
                      >
                        {(data.general.dropdownOptions?.audienceCategories || ['Geral']).map(aud => (
                          <option key={aud} value={aud}>{aud}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <select
                    value={editingItem.category || (section === 'premios' ? 'Acadêmico' : 'Geral')}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7BA6] outline-none bg-white"
                  >
                    {(() => {
                      let options: string[] = [];
                      if (section === 'projetos') {
                        options = data.general.dropdownOptions?.projectCategories || ['Geral'];
                      } else if (section === 'premios') {
                        options = data.general.dropdownOptions?.awardCategories || ['Acadêmico', 'Geral'];
                      } else if (section === 'eventos') {
                        options = data.general.dropdownOptions?.eventCategories || ['Geral'];
                      }
                      
                      const safeOptions = options.length > 0 ? options : ['Geral'];
                      return safeOptions.map(cat => <option key={cat} value={cat}>{cat}</option>);
                    })()}
                  </select>
                </div>

                <div className="col-span-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea
                    value={editingItem.description || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7BA6] outline-none"
                    rows={section === 'premios' ? 4 : 2}
                    placeholder="Descrição do item..."
                  />
                </div>

                <div className="col-span-full flex items-center pt-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editingItem.active || false}
                      onChange={(e) => setEditingItem({ ...editingItem, active: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-[#2E7BA6] focus:ring-[#2E7BA6]"
                    />
                    <span className="text-gray-900 font-medium">Item Ativo (Visível no site)</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2E7BA6] text-white hover:bg-[#256285] rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Seleção de Mídia (Reutilizado) */}
      {showMediaModal && (
        <MediaPicker
          onSelect={handleSelectMedia}
          onClose={() => setShowMediaModal(false)}
        />
      )}

      {showCropper && editingItem?.image && (
        <ImageCropperModal
          imageSrc={editingItem.image}
          aspectRatio={16 / 9}
          onClose={() => setShowCropper(false)}
          onCropCompleteFinal={handleCropFinalize}
        />
      )}
    </div>
  );
}
