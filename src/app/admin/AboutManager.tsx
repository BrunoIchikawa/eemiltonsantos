import { useState, useEffect } from 'react';
import { useSiteData } from '../context/SiteContext';
import { Save, History, Award, Users, BookOpen, Target, Plus, Trash2, Layout, Image as ImageIcon, BarChart, Upload, Crop } from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from '../components/ui_elements/ImageWithFallback';
import { MediaPicker } from './components/MediaPicker';
import { ImageCropperModal } from './components/ImageCropperModal';
import { PageBannerEditor } from './components/PageBannerEditor';

export function AboutManager() {
  const { data, updateAbout, uploadFile, deleteMedia } = useSiteData();
  const [formData, setFormData] = useState(data.about);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(-1);

  const handleCropFinalize = async (croppedFile: File, deleteOriginal?: boolean) => {
    try {
      const novaMedia = await uploadFile(croppedFile);
      if (novaMedia) {
        if (activeImageIndex === -1) {
          setFormData(prev => ({ ...prev, images: [...prev.images, novaMedia.url] }));
        } else {
          const oldUrl = formData.images[activeImageIndex];
          if (deleteOriginal && oldUrl) {
            const origItem = data?.media.find(m => m.url === oldUrl);
            if (origItem) deleteMedia(origItem.id);
          }
          const newImages = [...formData.images];
          newImages[activeImageIndex] = novaMedia.url;
          setFormData(prev => ({ ...prev, images: newImages }));
        }
        setShowCropper(false);
        setActiveImageIndex(-1);
      }
    } catch {
      toast.error('Erro ao subir imagem recortada.');
    }
  };

  useEffect(() => {
    setFormData(data.about);
  }, [data.about]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // --- Values Management ---
  const handleValueChange = (index: number, field: string, value: string) => {
    const newValues = [...formData.values];
    newValues[index] = { ...newValues[index], [field]: value };
    setFormData(prev => ({ ...prev, values: newValues }));
  };

  const addValue = () => {
    setFormData(prev => ({
      ...prev,
      values: [...prev.values, { icon: 'Star', title: '', description: '' }]
    }));
  };

  const removeValue = (index: number) => {
    setFormData(prev => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index)
    }));
  };

  // --- Infrastructure Management ---
  const handleInfraChange = (index: number, value: string) => {
    const newInfra = [...formData.infrastructure];
    newInfra[index] = value;
    setFormData(prev => ({ ...prev, infrastructure: newInfra }));
  };

  const addInfra = () => {
    setFormData(prev => ({
      ...prev,
      infrastructure: [...prev.infrastructure, '']
    }));
  };

  const removeInfra = (index: number) => {
    setFormData(prev => ({
      ...prev,
      infrastructure: prev.infrastructure.filter((_, i) => i !== index)
    }));
  };

  // --- Stats Management ---
  const handleStatChange = (index: number, field: string, value: string) => {
    const newStats = [...formData.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setFormData(prev => ({ ...prev, stats: newStats }));
  };

  const addStat = () => {
    setFormData(prev => ({
      ...prev,
      stats: [...prev.stats, { number: '0+', label: 'Novo Dado' }]
    }));
  };

  const removeStat = (index: number) => {
    setFormData(prev => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index)
    }));
  };

  // --- Images Management ---
  const handleOpenMedia = (index: number = -1) => {
    setActiveImageIndex(index);
    setShowMediaModal(true);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAbout(formData);
    toast.success('Página Sobre atualizada com sucesso!');
  };

  const iconOptions = [
    { value: 'Award', label: 'Prêmio/Medalha' },
    { value: 'Users', label: 'Pessoas/Equipe' },
    { value: 'BookOpen', label: 'Livro/Conhecimento' },
    { value: 'Target', label: 'Alvo/Objetivo' },
    { value: 'Star', label: 'Estrela/Destaque' },
    { value: 'Heart', label: 'Coração/Cuidado' },
    { value: 'MapPin', label: 'Localização' },
  ];

  return (
    <div className="space-y-6 pb-20">
      <PageBannerEditor pageKey="sobre" label="Sobre a Escola" />
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Página Sobre</h1>
        <p className="text-gray-500">Edite todos os conteúdos exibidos na página "Sobre a Escola".</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* História */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-[#2E7BA6]" />
            Nossa História
          </h2>
          <p className="text-sm text-gray-500 mb-2">Use quebras de linha duplas para criar parágrafos.</p>
          <textarea
            value={formData.history}
            onChange={(e) => handleChange('history', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7BA6] min-h-[200px]"
            placeholder="Conte a história da escola..."
          />
        </div>

        {/* Valores */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#4A8B63]" />
              Nossos Valores
            </h2>
            <button type="button" onClick={addValue} className="text-sm text-[#2E7BA6] font-medium hover:underline flex items-center gap-1">
              <Plus className="w-4 h-4" /> Adicionar
            </button>
          </div>
          <div className="space-y-4">
            {formData.values.map((value, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 items-start">
                <div className="md:col-span-3">
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Ícone</label>
                  <select
                    value={value.icon}
                    onChange={(e) => handleValueChange(index, 'icon', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    {iconOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-4">
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Título</label>
                  <input
                    type="text"
                    value={value.title}
                    onChange={(e) => handleValueChange(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7BA6] font-medium"
                    placeholder="Título"
                  />
                </div>
                <div className="md:col-span-4">
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Descrição</label>
                  <textarea
                    value={value.description}
                    onChange={(e) => handleValueChange(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7BA6] text-sm"
                    rows={2}
                    placeholder="Descrição"
                  />
                </div>
                <div className="md:col-span-1 flex justify-center mt-6">
                  <button type="button" onClick={() => removeValue(index)} className="text-red-500 hover:text-red-700 p-2">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Infraestrutura */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Layout className="w-5 h-5 text-[#9A8367]" />
              Infraestrutura
            </h2>
            <button type="button" onClick={addInfra} className="text-sm text-[#2E7BA6] font-medium hover:underline flex items-center gap-1">
              <Plus className="w-4 h-4" /> Adicionar Item
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.infrastructure.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleInfraChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7BA6]"
                  placeholder="Ex: Laboratório de Informática"
                />
                <button type="button" onClick={() => removeInfra(index)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <BarChart className="w-5 h-5 text-[#0099DD]" />
              Números e Estatísticas
            </h2>
            <button type="button" onClick={addStat} className="text-sm text-[#2E7BA6] font-medium hover:underline flex items-center gap-1">
              <Plus className="w-4 h-4" /> Adicionar
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {formData.stats.map((stat, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-100 relative group">
                <button
                  type="button"
                  onClick={() => removeStat(index)}
                  className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500">Número</label>
                  <input
                    type="text"
                    value={stat.number}
                    onChange={(e) => handleStatChange(index, 'number', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2E7BA6] font-bold text-lg"
                    placeholder="Ex: 500+"
                  />
                  <label className="text-xs font-medium text-gray-500">Legenda</label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2E7BA6] text-sm"
                    placeholder="Ex: Alunos"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Galeria de Fotos (Conheça Nossa Escola) */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-600" />
              Galeria "Conheça Nossa Escola"
            </h2>
            <button type="button" onClick={() => handleOpenMedia(-1)} className="text-sm text-[#2E7BA6] font-medium hover:underline flex items-center gap-1">
              <Plus className="w-4 h-4" /> Adicionar Foto (MediaPicker)
            </button>
          </div>
          <div className="flex flex-col gap-1 col-span-full">
            <p className="text-xs text-purple-600 font-semibold mb-2">Dica de Formato: As fotos da galeria são renderizadas lado a lado. Recomendamos a proporção 16:9 panorâmica.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {formData.images.map((img, index) => (
              <div key={index} className="space-y-2 group relative">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative group cursor-pointer">
                  <ImageWithFallback src={img} alt={`Foto ${index}`} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />

                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleOpenMedia(index); }}
                      className="text-white text-xs font-medium flex items-center gap-2 bg-black/50 hover:bg-black/80 px-3 py-2 rounded-full backdrop-blur-sm transition-colors"
                    >
                      <Upload className="w-4 h-4" /> Alterar Foto
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setActiveImageIndex(index); setShowCropper(true); }}
                      className="text-white text-xs font-medium flex items-center gap-2 bg-black/50 hover:bg-black/80 px-3 py-2 rounded-full backdrop-blur-sm transition-colors"
                    >
                      <Crop className="w-4 h-4" /> Recortar/Ajustar
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 flex items-center justify-center z-10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botão Salvar Fixo */}
        <div className="sticky bottom-4 flex justify-end z-10">
          <button
            type="submit"
            className="flex items-center gap-2 bg-[#4A8B63] text-white px-6 py-3 rounded-xl hover:bg-[#3d7452] transition-all shadow-lg hover:shadow-xl font-bold"
          >
            <Save className="w-5 h-5" />
            Salvar Alterações
          </button>
        </div>
      </form >

      {showMediaModal && (
        <MediaPicker
          onSelect={(url) => {
            if (activeImageIndex === -1) {
              setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
            } else {
              const newImages = [...formData.images];
              newImages[activeImageIndex] = url;
              setFormData(prev => ({ ...prev, images: newImages }));
            }
            setShowMediaModal(false);
          }}
          onClose={() => setShowMediaModal(false)}
        />
      )
      }

      {
        showCropper && activeImageIndex !== -1 && formData.images[activeImageIndex] && (
          <ImageCropperModal
            imageSrc={formData.images[activeImageIndex]}
            aspectRatio={16 / 9}
            onClose={() => { setShowCropper(false); setActiveImageIndex(-1); }}
            onCropCompleteFinal={handleCropFinalize}
          />
        )
      }
    </div >
  );
}
