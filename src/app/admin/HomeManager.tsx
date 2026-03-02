import { useState, useEffect } from 'react';
import { useSiteData } from '../context/SiteContext';
import { Warning } from '../../types';
import { Save, Plus, Trash2, AlertCircle, Layers, Trophy, Megaphone, Utensils, Calendar as CalendarIcon, FileText, Image as ImageIcon, X, Crop } from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from '../components/ui_elements/ImageWithFallback';
import { MediaPicker } from './components/MediaPicker';
import { ImageCropperModal } from './components/ImageCropperModal';
import { useConfirm } from './components/ConfirmDialog';

interface HomeManagerProps {
  onNavigate: (page: string) => void;
}

export function HomeManager({ onNavigate }: HomeManagerProps) {
  const { data, updateHome } = useSiteData();

  // Default structure for week menu
  const defaultWeekMenu = {
    monday: '',
    tuesday: '',
    wednesday: '',
    thursday: '',
    friday: ''
  };

  // Helper to safely merge menu data without duplicate keys
  const getMergedMenu = (sourceMenu: any) => {
    const { weekMenu: sourceWeekMenu, ...otherProps } = sourceMenu || {};
    return {
      enabled: false,
      title: 'Cardápio Semanal',
      imageUrl: '',
      updatedAt: new Date().toLocaleDateString('pt-BR'),
      ...otherProps,
      weekMenu: {
        ...defaultWeekMenu,
        ...(sourceWeekMenu || {})
      }
    };
  };

  // Initialize with fallback for schoolMenu to prevent crashes with old data
  const [formData, setFormData] = useState({
    ...data.home,
    schoolMenu: getMergedMenu(data.home.schoolMenu)
  });

  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [warnings, setWarnings] = useState<Warning[]>(data.home.warnings || []);
  const { uploadFile, deleteMedia, data: siteData } = useSiteData();

  const handleCropFinalize = async (croppedFile: File, deleteOriginal?: boolean) => {
    try {
      const novaMedia = await uploadFile(croppedFile);
      if (novaMedia) {
        if (deleteOriginal && formData.schoolMenu?.imageUrl) {
          const origItem = siteData.media.find(m => m.url === formData.schoolMenu?.imageUrl);
          if (origItem) deleteMedia(origItem.id);
        }
        handleMenuChange('imageUrl', novaMedia.url);
        setShowCropper(false);
      }
    } catch {
      toast.error('Erro ao subir imagem recortada do cardápio.');
    }
  };

  useEffect(() => {
    setFormData(prev => ({
      ...data.home,
      schoolMenu: getMergedMenu(data.home.schoolMenu)
    }));
    setWarnings(data.home.warnings || []);
  }, [data.home]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // School Menu specific handler
  const handleMenuChange = (field: string, value: any) => {
    setFormData(prev => {
      const currentMenu = prev.schoolMenu || getMergedMenu(undefined);

      return {
        ...prev,
        schoolMenu: {
          ...currentMenu,
          [field]: value
        }
      };
    });
  };

  // Handle specific day update
  const handleDayMenuChange = (day: string, value: string) => {
    setFormData(prev => {
      const currentMenu = prev.schoolMenu || getMergedMenu(undefined);

      return {
        ...prev,
        schoolMenu: {
          ...currentMenu,
          weekMenu: {
            ...currentMenu.weekMenu,
            [day]: value
          }
        }
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateHome({ ...formData, warnings });
    toast.success('Página Inicial atualizada com sucesso!');
  };

  // Funções de Aviso
  const addWarning = () => {
    const newWarning: Warning = {
      id: Date.now().toString(),
      title: 'Novo Aviso',
      message: '',
      date: new Date().toLocaleDateString('pt-BR'),
      priority: 'Normal',
      active: true
    };
    setWarnings([...warnings, newWarning]);
  };

  const updateWarning = (id: string, field: keyof Warning, value: any) => {
    setWarnings(warnings.map(w => w.id === id ? { ...w, [field]: value } : w));
  };

  const showConfirm = useConfirm();

  const removeWarning = async (id: string) => {
    const ok = await showConfirm({ message: 'Remover este aviso?', variant: 'danger', confirmText: 'Remover' });
    if (ok) {
      setWarnings(warnings.filter(w => w.id !== id));
    }
  };

  const handleSelectMedia = (url: string) => {
    handleMenuChange('imageUrl', url);
    setShowMediaModal(false);
  };

  const weekDays = [
    { key: 'monday', label: 'Segunda-feira' },
    { key: 'tuesday', label: 'Terça-feira' },
    { key: 'wednesday', label: 'Quarta-feira' },
    { key: 'thursday', label: 'Quinta-feira' },
    { key: 'friday', label: 'Sexta-feira' },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Página Inicial</h1>
          <p className="text-gray-500">Personalize as boas-vindas, cardápio e avisos importantes.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onNavigate('sliders')}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 hover:text-[#2E7BA6] transition-colors shadow-sm group"
          >
            <Layers className="w-4 h-4 text-gray-500 group-hover:text-[#2E7BA6]" />
            Sliders
          </button>
          <button
            type="button"
            onClick={() => onNavigate('premios')}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 hover:text-[#2E7BA6] transition-colors shadow-sm group"
          >
            <Trophy className="w-4 h-4 text-gray-500 group-hover:text-[#2E7BA6]" />
            Prêmios
          </button>
          <button
            type="button"
            onClick={() => onNavigate('popups')}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 hover:text-[#2E7BA6] transition-colors shadow-sm group"
          >
            <Megaphone className="w-4 h-4 text-gray-500 group-hover:text-[#2E7BA6]" />
            Pop-ups
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* 1. Seção Boas-vindas */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Texto Institucional (Boas-vindas)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título da Seção</label>
              <input
                type="text"
                value={formData.welcomeTitle}
                onChange={(e) => handleChange('welcomeTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Texto de Apresentação</label>
              <textarea
                value={formData.welcomeText}
                onChange={(e) => handleChange('welcomeText', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* 2. Cardápio Escolar (ATUALIZADO) */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-orange-500" />
              Cardápio Escolar
            </h2>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.schoolMenu?.enabled ?? false}
                onChange={(e) => handleMenuChange('enabled', e.target.checked)}
                className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
              />
              <span className="text-sm text-gray-600 font-medium">Ativar Cardápio</span>
            </div>
          </div>

          {formData.schoolMenu?.enabled && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-top-4 duration-300">

              {/* Coluna da Esquerda: Dados Gerais + Upload */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título do Mural</label>
                    <input
                      type="text"
                      value={formData.schoolMenu?.title ?? ''}
                      onChange={(e) => handleMenuChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Ex: Cardápio da Semana"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data da Semana</label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.schoolMenu?.updatedAt ?? ''}
                        onChange={(e) => handleMenuChange('updatedAt', e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Ex: 12/02 a 16/02"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagem do Cardápio Completo
                    <span className="block text-xs font-normal text-gray-500">Exibida ao clicar em "Ver Cardápio Completo"</span>
                  </label>
                  <div className="aspect-video bg-orange-50 rounded-xl overflow-hidden relative group border-2 border-dashed border-orange-200 cursor-pointer hover:border-orange-500 transition-colors flex items-center justify-center">
                    {formData.schoolMenu?.imageUrl ? (
                      <>
                        <ImageWithFallback
                          src={formData.schoolMenu.imageUrl}
                          alt="Cardápio Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-3">
                          <button
                            type="button"
                            onClick={() => setShowMediaModal(true)}
                            className="text-white text-sm font-medium flex items-center gap-2 bg-black/40 hover:bg-black/60 px-4 py-2 rounded-full backdrop-blur-sm transition-colors"
                          >
                            <ImageIcon className="w-4 h-4" /> Alterar Foto
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowCropper(true)}
                            className="text-white text-sm font-medium flex items-center gap-2 bg-black/40 hover:bg-black/60 px-4 py-2 rounded-full backdrop-blur-sm transition-colors"
                          >
                            <Crop className="w-4 h-4" /> Recortar / Ajustar
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-6 text-orange-400 w-full h-full flex flex-col items-center justify-center" onClick={() => setShowMediaModal(true)}>
                        <Utensils className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <span className="font-medium block">Clique para selecionar foto</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-center bg-orange-50/50 border border-orange-100 rounded-lg p-2 text-xs">
                    <p className="font-semibold text-orange-800">Dica de Formato:</p>
                    <p className="text-orange-600">Recomendado formato folha A4 vertical (Proporção 2:3 ou 9:16)</p>
                  </div>
                </div>
              </div>

              {/* Coluna da Direita: Cardápio Diário */}
              <div className="lg:col-span-7 bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-500" />
                  Definir Cardápio Diário
                </h3>
                <div className="space-y-4">
                  {weekDays.map((day) => (
                    <div key={day.key} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                        {day.label}
                      </label>
                      <textarea
                        value={formData.schoolMenu?.weekMenu?.[day.key as keyof typeof formData.schoolMenu.weekMenu] ?? ''}
                        onChange={(e) => handleDayMenuChange(day.key, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[60px]"
                        placeholder={`O que será servido na ${day.label.toLowerCase()}?`}
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Avisos Importantes */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              Avisos Importantes (Cards Home)
            </h2>
            <button
              type="button"
              onClick={addWarning}
              className="text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg font-medium hover:bg-blue-100 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Adicionar Card
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {warnings.map((warning) => (
              <div key={warning.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative group">
                <button
                  type="button"
                  onClick={() => removeWarning(warning.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="space-y-3">
                  <input
                    type="text"
                    value={warning.title}
                    onChange={(e) => updateWarning(warning.id, 'title', e.target.value)}
                    placeholder="Título do Aviso"
                    className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm font-bold"
                  />
                  <textarea
                    value={warning.message}
                    onChange={(e) => updateWarning(warning.id, 'message', e.target.value)}
                    placeholder="Mensagem"
                    className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={warning.date}
                      onChange={(e) => updateWarning(warning.id, 'date', e.target.value)}
                      placeholder="Data"
                      className="w-1/3 bg-white border border-gray-300 rounded px-2 py-1 text-xs"
                    />
                    <select
                      value={warning.priority}
                      onChange={(e) => updateWarning(warning.id, 'priority', e.target.value)}
                      className="w-1/3 bg-white border border-gray-300 rounded px-2 py-1 text-xs"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Alta">Alta Prioridade</option>
                    </select>
                    <label className="flex items-center gap-1 text-xs text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={warning.active}
                        onChange={(e) => updateWarning(warning.id, 'active', e.target.checked)}
                      />
                      Ativo
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sticky bottom-4 flex justify-end z-10">
          <button
            type="submit"
            className="flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-xl hover:bg-secondary/90 transition-all shadow-lg hover:shadow-xl font-bold"
          >
            <Save className="w-5 h-5" />
            Salvar Alterações
          </button>
        </div>
      </form>

      {/* Modal de Mídia Unificado */}
      {showMediaModal && (
        <MediaPicker
          onSelect={handleSelectMedia}
          onClose={() => setShowMediaModal(false)}
        />
      )}

      {showCropper && formData.schoolMenu?.imageUrl && (
        <ImageCropperModal
          imageSrc={formData.schoolMenu.imageUrl}
          aspectRatio={16 / 9}
          onClose={() => setShowCropper(false)}
          onCropCompleteFinal={handleCropFinalize}
        />
      )}
    </div>
  );
}
