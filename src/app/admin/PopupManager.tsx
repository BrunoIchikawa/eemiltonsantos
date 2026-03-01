import { useState } from 'react';
import { useSiteData } from '../context/SiteContext';
import { Popup } from '../../types';
import { MediaPicker } from './components/MediaPicker';
import { Plus, Edit, Trash2, X, AlertCircle, Check, Eye, EyeOff, Image as ImageIcon, Type, Crop } from 'lucide-react';
import { ImageWithFallback } from '../components/ui_elements/ImageWithFallback';
import { ImageCropperModal } from './components/ImageCropperModal';
import { toast } from 'sonner';

export function PopupManager() {
  const { data, updatePopups, uploadFile, deleteMedia } = useSiteData();
  const [isEditing, setIsEditing] = useState(false);
  const [editingPopup, setEditingPopup] = useState<Popup | null>(null);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showCropper, setShowCropper] = useState(false);

  const handleCropFinalize = async (croppedFile: File, deleteOriginal?: boolean) => {
    try {
      const novaMedia = await uploadFile(croppedFile);
      if (novaMedia) {
        if (deleteOriginal && formData.imageUrl) {
          const origItem = data?.media.find(m => m.url === formData.imageUrl);
          if (origItem) deleteMedia(origItem.id);
        }
        setFormData(prev => ({ ...prev, imageUrl: novaMedia.url }));
        setShowCropper(false);
      }
    } catch {
      toast.error('Erro ao subir banner recortado.');
    }
  };

  // Form State
  const [formData, setFormData] = useState<Partial<Popup>>({
    title: '',
    message: '',
    active: true,
    priority: 'Normal',
    type: 'text',
    imageUrl: ''
  });

  const handleEdit = (popup: Popup) => {
    setEditingPopup(popup);
    setFormData({ ...popup }); // Clone to avoid mutation
    setIsEditing(true);
  };

  const handleCreate = () => {
    setEditingPopup(null);
    setFormData({
      title: '',
      message: '',
      active: true,
      priority: 'Normal',
      type: 'text',
      imageUrl: ''
    });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este aviso?')) {
      const newPopups = data.popups.filter(p => String(p.id) !== String(id));
      updatePopups(newPopups);
    }
  };

  const handleToggleActive = (id: string) => {
    const newPopups = data.popups.map(p =>
      p.id === id ? { ...p, active: !p.active } : p
    );
    updatePopups(newPopups);
  };

  const handleSelectMedia = (url: string) => {
    setFormData(prev => ({ ...prev, imageUrl: url }));
    setShowMediaModal(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (formData.type === 'image' && !formData.imageUrl) {
      alert('Por favor, selecione uma imagem.');
      return;
    }

    if (editingPopup) {
      // Update existing
      const newPopups = data.popups.map(p =>
        p.id === editingPopup.id ? { ...p, ...formData } as Popup : p
      );
      updatePopups(newPopups);
    } else {
      // Create new
      const newPopup: Popup = {
        ...(formData as Popup),
        id: Date.now().toString()
      };
      updatePopups([...(data.popups || []), newPopup]);
    }

    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gerenciar Avisos (Pop-ups)</h2>
          <p className="text-gray-500">Crie alertas ou banners que aparecem ao entrar no site.</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-[#2E7BA6] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#246285] transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Novo Aviso
        </button>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800">
                {editingPopup ? 'Editar Aviso' : 'Novo Aviso'}
              </h3>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">

              {/* Type Selector */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'text' })}
                  className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${formData.type === 'text'
                    ? 'border-[#2E7BA6] bg-[#2E7BA6]/5 text-[#2E7BA6]'
                    : 'border-gray-200 hover:border-gray-300 text-gray-500'
                    }`}
                >
                  <Type className="w-5 h-5" />
                  <span className="font-bold">Texto Simples</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'image' })}
                  className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${formData.type === 'image'
                    ? 'border-[#2E7BA6] bg-[#2E7BA6]/5 text-[#2E7BA6]'
                    : 'border-gray-200 hover:border-gray-300 text-gray-500'
                    }`}
                >
                  <ImageIcon className="w-5 h-5" />
                  <span className="font-bold">Imagem / Banner</span>
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.type === 'image' ? 'Título (Texto Alternativo)' : 'Título do Aviso'}
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7BA6] focus:border-[#2E7BA6]"
                  placeholder={formData.type === 'image' ? "Ex: Banner Festa Junina" : "Ex: Rematrícula 2026"}
                  required
                />
              </div>

              {formData.type === 'text' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                  <textarea
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7BA6] focus:border-[#2E7BA6] h-32 resize-none"
                    placeholder="Digite o conteúdo do aviso aqui..."
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Imagem do Banner</label>
                  <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden relative group border-2 border-dashed border-gray-300 cursor-pointer hover:border-[#2E7BA6] transition-colors flex items-center justify-center">
                    {formData.imageUrl ? (
                      <>
                        <ImageWithFallback
                          src={formData.imageUrl}
                          alt="Banner Preview"
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-3">
                          <button
                            type="button"
                            onClick={() => setShowMediaModal(true)}
                            className="text-white text-sm font-medium flex items-center gap-2 bg-black/50 hover:bg-black/70 px-4 py-2 rounded-full backdrop-blur-sm transition-colors"
                          >
                            <ImageIcon className="w-4 h-4" /> Alterar Imagem
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowCropper(true)}
                            className="text-white text-sm font-medium flex items-center gap-2 bg-black/50 hover:bg-black/70 px-4 py-2 rounded-full backdrop-blur-sm transition-colors"
                          >
                            <Crop className="w-4 h-4" /> Recortar/Ajustar
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-6" onClick={() => setShowMediaModal(true)}>
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <span className="text-gray-500 font-medium block">Clique para selecionar uma imagem</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-center bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-600">
                    <p className="font-semibold mb-1">Dica de Formato:</p>
                    <p>Recomendado: Banner Horizontal (16:9) ou Quadrado (1:1)</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                  <select
                    value={formData.priority}
                    onChange={e => setFormData({ ...formData, priority: e.target.value as 'Alta' | 'Normal' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7BA6]"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Alta">Alta Prioridade</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      id="active"
                      checked={formData.active}
                      onChange={e => setFormData({ ...formData, active: e.target.checked })}
                      className="w-5 h-5 text-[#2E7BA6] rounded focus:ring-[#2E7BA6]"
                    />
                  </div>
                  <label htmlFor="active" className="text-sm font-medium text-gray-700 select-none cursor-pointer">
                    Aviso Ativo (Visível no site)
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#2E7BA6] text-white px-6 py-2 rounded-lg hover:bg-[#246285] transition-colors font-medium flex items-center gap-2 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  Salvar {formData.type === 'image' ? 'Banner' : 'Aviso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Seleção de Mídia */}
      {showMediaModal && (
        <MediaPicker
          onSelect={handleSelectMedia}
          onClose={() => setShowMediaModal(false)}
        />
      )}

      {showCropper && formData.imageUrl && (
        <ImageCropperModal
          imageSrc={formData.imageUrl}
          aspectRatio={16 / 9} // default to 16:9 layout for banners
          onClose={() => setShowCropper(false)}
          onCropCompleteFinal={handleCropFinalize}
        />
      )}

      {/* Popup List */}
      <div className="grid gap-4">
        {(data.popups || []).length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Nenhum aviso cadastrado</p>
            <button onClick={handleCreate} className="text-[#2E7BA6] hover:underline mt-2 text-sm font-medium">
              Criar o primeiro aviso
            </button>
          </div>
        ) : (
          (data.popups || []).map(popup => (
            <div key={popup.id} className={`bg-white p-4 rounded-xl border-l-4 shadow-sm flex items-center justify-between transition-all hover:shadow-md ${popup.active ? (popup.priority === 'Alta' ? 'border-red-500' : 'border-[#2E7BA6]') : 'border-gray-300 opacity-75'}`}>
              <div className="flex items-center gap-4 flex-1">
                {/* Thumbnail Icon */}
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden border border-gray-200">
                  {popup.type === 'image' && popup.imageUrl ? (
                    <img src={popup.imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Type className="text-gray-400 w-6 h-6" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="font-bold text-gray-800 truncate max-w-[200px] md:max-w-md">{popup.title}</h3>
                    {popup.type === 'image' && (
                      <span className="bg-purple-100 text-purple-600 text-[10px] px-2 py-0.5 rounded-full font-bold border border-purple-200">IMAGEM</span>
                    )}
                    {popup.priority === 'Alta' && (
                      <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-bold border border-red-200">ALTA</span>
                    )}
                    {!popup.active && (
                      <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full font-medium border border-gray-200">INATIVO</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {popup.type === 'image' ? 'Banner Promocional / Informativo' : popup.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleToggleActive(popup.id)}
                  className={`p-2 rounded-lg transition-colors ${popup.active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                  title={popup.active ? 'Desativar' : 'Ativar'}
                >
                  {popup.active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>

                <button
                  onClick={() => handleEdit(popup)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit className="w-5 h-5" />
                </button>

                <button
                  onClick={() => handleDelete(popup.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
