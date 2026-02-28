import { useState } from 'react';
import { useSiteData } from '../context/SiteContext';
import { Slide } from '../../types';
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon, Link as LinkIcon, Move, Crop } from 'lucide-react';
import { toast } from 'sonner';
import { MediaPicker } from './components/MediaPicker';
import { ImageCropperModal } from './components/ImageCropperModal';

export function SliderManager() {
  const { data, updateSlides, uploadFile, deleteMedia } = useSiteData();
  // Safe default for slides
  const slides = data?.slides || [];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Slide | null>(null);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showCropper, setShowCropper] = useState(false);

  const handleCropFinalize = async (croppedFile: File, deleteOriginal?: boolean) => {
    try {
      const novaMedia = await uploadFile(croppedFile);
      if (novaMedia && formData) {
        if (deleteOriginal && formData.image) {
          const origItem = data?.media.find(m => m.url === formData.image);
          if (origItem) deleteMedia(origItem.id);
        }
        setFormData({ ...formData, image: novaMedia.url });
        setShowCropper(false);
      }
    } catch {
      toast.error('Ocorreu um erro no upload da imagem cortada.');
    }
  };

  // Rotas internas disponíveis para seleção
  const availableRoutes = [
    { value: 'sobre', label: 'Sobre a Escola' },
    { value: 'equipe', label: 'Equipe Gestora' },
    { value: 'projetos', label: 'Projetos' },
    { value: 'calendario', label: 'Calendário' },
    { value: 'plataformas', label: 'Plataformas' },
    { value: 'galeria', label: 'Galeria' },
    { value: 'faq', label: 'Dúvidas / FAQ' },
  ];

  const handleEdit = (slide: Slide) => {
    setEditingId(slide.id);
    setFormData({ ...slide });
  };

  const handleCreate = () => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      title: 'Novo Slide',
      subtitle: 'Descrição do novo slide',
      image: '',
      active: true,
      order: slides.length + 1,
      button1: { text: 'Saiba Mais', link: 'sobre', active: true },
      button2: { text: 'Contato', link: 'faq', active: false }
    };
    setEditingId(newSlide.id);
    setFormData(newSlide);
  };

  const handleSave = () => {
    if (!formData) return;

    let newSlides = [...slides];
    const existingIndex = newSlides.findIndex(s => s.id === formData.id);

    if (existingIndex >= 0) {
      newSlides[existingIndex] = formData;
    } else {
      newSlides.push(formData);
    }

    updateSlides(newSlides);
    setEditingId(null);
    setFormData(null);
    toast.success('Slide salvo com sucesso!');
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este slide?')) {
      const newSlides = slides.filter((s: Slide) => s.id !== id);
      updateSlides(newSlides);
      toast.success('Slide excluído com sucesso!');
    }
  };

  const handleChange = (field: keyof Slide, value: any) => {
    if (!formData) return;
    setFormData({ ...formData, [field]: value });
  };

  const handleButtonChange = (btn: 'button1' | 'button2', field: string, value: any) => {
    if (!formData) return;
    setFormData({
      ...formData,
      [btn]: { ...formData[btn], [field]: value }
    });
  };

  if (editingId && formData) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {slides.find((s: Slide) => s.id === editingId) ? 'Editar Slide' : 'Novo Slide'}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => { setEditingId(null); setFormData(null); }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
            >
              <X size={18} /> Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#0099DD] text-white rounded-lg hover:bg-[#0088CC] transition-colors flex items-center gap-2 shadow-sm"
            >
              <Save size={18} /> Salvar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Coluna Esquerda: Configurações */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Conteúdo Principal</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => handleChange('title', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0099DD] focus:border-transparent outline-none"
                  placeholder="Título principal do slide"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
                <textarea
                  value={formData.subtitle}
                  onChange={e => handleChange('subtitle', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0099DD] focus:border-transparent outline-none h-24 resize-none"
                  placeholder="Descrição curta abaixo do título"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagem do Slide</label>
                <div className="relative group">
                  <div
                    className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 min-h-[120px] overflow-hidden"
                  >
                    {formData.image ? (
                      <>
                        <img src={formData.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => setShowMediaModal(true)}
                            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-colors font-medium text-sm"
                          >
                            <ImageIcon size={16} /> Trocar Mídia
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowCropper(true)}
                            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-colors font-medium text-sm"
                          >
                            <Crop size={16} /> Recortar/Ajustar
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowMediaModal(true)}
                        className="flex flex-col items-center text-gray-500 hover:text-[#0099DD] transition-colors"
                      >
                        <ImageIcon size={28} className="mb-2" />
                        <span className="text-sm font-medium">Clique para selecionar imagem (MediaPicker)</span>
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-3 text-center bg-blue-50/50 border border-blue-100 rounded-lg p-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                  <span className="text-xs font-semibold text-blue-800">🖼️ Capa do Slide Otimizada:</span>
                  <span className="text-xs text-blue-600">1920x1080 (Proporção 16:9 widescreen)</span>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ordem</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={e => handleChange('order', parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0099DD] focus:border-transparent outline-none"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={e => handleChange('active', e.target.checked)}
                      className="w-5 h-5 text-[#0099DD] rounded focus:ring-[#0099DD]"
                    />
                    <span className="text-sm font-medium text-gray-700">Slide Ativo</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Botões de Ação</h3>

              {/* Botão 1 */}
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-700">Botão Principal (Branco)</span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.button1?.active}
                      onChange={e => handleButtonChange('button1', 'active', e.target.checked)}
                      className="w-4 h-4 text-[#0099DD] rounded"
                    />
                    <span className="text-xs text-gray-600">Ativar</span>
                  </label>
                </div>

                {formData.button1?.active && (
                  <div className="grid grid-cols-2 gap-3 animate-in fade-in">
                    <input
                      type="text"
                      value={formData.button1.text}
                      onChange={e => handleButtonChange('button1', 'text', e.target.value)}
                      className="p-2 border border-gray-300 rounded-md text-sm"
                      placeholder="Texto do botão"
                    />
                    <select
                      value={formData.button1.link}
                      onChange={e => handleButtonChange('button1', 'link', e.target.value)}
                      className="p-2 border border-gray-300 rounded-md text-sm bg-white"
                    >
                      {availableRoutes.map(route => (
                        <option key={route.value} value={route.value}>{route.label}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Botão 2 */}
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-700">Botão Secundário (Transparente)</span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.button2?.active}
                      onChange={e => handleButtonChange('button2', 'active', e.target.checked)}
                      className="w-4 h-4 text-[#0099DD] rounded"
                    />
                    <span className="text-xs text-gray-600">Ativar</span>
                  </label>
                </div>

                {formData.button2?.active && (
                  <div className="grid grid-cols-2 gap-3 animate-in fade-in">
                    <input
                      type="text"
                      value={formData.button2.text}
                      onChange={e => handleButtonChange('button2', 'text', e.target.value)}
                      className="p-2 border border-gray-300 rounded-md text-sm"
                      placeholder="Texto do botão"
                    />
                    <select
                      value={formData.button2.link}
                      onChange={e => handleButtonChange('button2', 'link', e.target.value)}
                      className="p-2 border border-gray-300 rounded-md text-sm bg-white"
                    >
                      {availableRoutes.map(route => (
                        <option key={route.value} value={route.value}>{route.label}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Coluna Direita: Preview */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-700">Pré-visualização (Aproximada)</h3>
            <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-lg bg-gray-900 group">
              <img
                src={formData.image}
                alt="Preview"
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

              <div className="absolute inset-0 flex flex-col justify-center px-8 z-10">
                <h1 className="text-2xl font-bold text-white mb-2 leading-tight drop-shadow-md">{formData.title}</h1>
                <p className="text-sm text-gray-200 mb-6 drop-shadow-md line-clamp-3">{formData.subtitle}</p>

                <div className="flex gap-2">
                  {formData.button1?.active && (
                    <div className="px-4 py-2 bg-white text-gray-900 rounded-full text-xs font-bold shadow-lg">
                      {formData.button1.text}
                    </div>
                  )}
                  {formData.button2?.active && (
                    <div className="px-4 py-2 bg-white/10 backdrop-blur border border-white/30 text-white rounded-full text-xs font-bold">
                      {formData.button2.text}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 italic text-center">
              * A visualização real pode variar dependendo do tamanho da tela.
            </p>
          </div>
        </div>

        {showMediaModal && (
          <MediaPicker
            onSelect={(url) => {
              handleChange('image', url);
              setShowMediaModal(false);
            }}
            onClose={() => setShowMediaModal(false)}
          />
        )}

        {showCropper && formData && (
          <ImageCropperModal
            imageSrc={formData.image}
            aspectRatio={16 / 9}
            onClose={() => setShowCropper(false)}
            onCropCompleteFinal={handleCropFinalize}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Slider da Home</h2>
          <p className="text-gray-500">Gerencie as imagens e textos do carrossel principal.</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-[#0099DD] text-white px-4 py-2 rounded-lg hover:bg-[#0088CC] transition-colors flex items-center gap-2 shadow-sm font-medium"
        >
          <Plus size={20} /> Novo Slide
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {slides.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium">Nenhum slide cadastrado</p>
            <p className="text-sm">Clique em "Novo Slide" para começar.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            <div className="grid grid-cols-12 bg-gray-50 p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <div className="col-span-1 text-center">Ordem</div>
              <div className="col-span-2">Imagem</div>
              <div className="col-span-4">Título / Subtítulo</div>
              <div className="col-span-3">Botões</div>
              <div className="col-span-1 text-center">Status</div>
              <div className="col-span-1 text-center">Ações</div>
            </div>

            {slides
              .sort((a: Slide, b: Slide) => a.order - b.order)
              .map((slide: Slide) => (
                <div key={slide.id} className="grid grid-cols-12 p-4 items-center hover:bg-gray-50 transition-colors group">
                  <div className="col-span-1 text-center font-bold text-gray-400">
                    #{slide.order}
                  </div>
                  <div className="col-span-2 pr-4">
                    <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden border border-gray-200 relative">
                      <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="col-span-4 pr-4">
                    <h4 className="font-bold text-gray-900 truncate">{slide.title}</h4>
                    <p className="text-sm text-gray-500 line-clamp-2">{slide.subtitle}</p>
                  </div>
                  <div className="col-span-3 flex flex-col gap-1 text-xs">
                    {slide.button1?.active ? (
                      <span className="flex items-center gap-1 text-green-600 truncate">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        {slide.button1.text} ({slide.button1.link})
                      </span>
                    ) : <span className="text-gray-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-gray-300 rounded-full" /> Sem botão 1</span>}

                    {slide.button2?.active ? (
                      <span className="flex items-center gap-1 text-blue-600 truncate">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        {slide.button2.text} ({slide.button2.link})
                      </span>
                    ) : <span className="text-gray-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-gray-300 rounded-full" /> Sem botão 2</span>}
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${slide.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                      {slide.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <div className="col-span-1 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(slide)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(slide.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
