import { useState, useEffect } from 'react';
import { useSiteData } from '../context/SiteContext';
import { Save, Facebook, Instagram, Youtube, MapPin, Phone, Mail, Globe, Type, Users, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useConfirm } from './components/ConfirmDialog';

// Inline helpers
const formatPhone = (value: string) => {
  if (!value) return '';
  const numbers = value.replace(/\D/g, '');
  const limit = 11;
  const truncated = numbers.slice(0, limit);
  
  if (truncated.length > 10) {
    return truncated.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (truncated.length > 5) {
    return truncated.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  } else if (truncated.length > 2) {
    return truncated.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
  } else {
    return truncated;
  }
};

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export function GeneralSettings() {
  const { data, updateGeneral } = useSiteData();
  const [formData, setFormData] = useState(data.general);

  // Sync with context if it changes externally
  useEffect(() => {
    setFormData(data.general);
  }, [data.general]);

  const handleChange = (field: string, value: string) => {
    let newValue = value;
    if (field === 'phone' || field === 'whatsapp') {
      newValue = formatPhone(value);
    }
    setFormData(prev => ({ ...prev, [field]: newValue }));
  };

  const handleMapUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Check if it's an iframe code
    if (value.includes('<iframe')) {
      const srcMatch = value.match(/src="([^"]+)"/);
      if (srcMatch && srcMatch[1]) {
        value = srcMatch[1];
        toast.success('Link do mapa extraído automaticamente!');
      }
    }
    handleChange('mapUrl', value);
  };

  const handleSocialChange = (index: number, field: 'url' | 'active', value: string | boolean) => {
    const newSocials = [...formData.socials];
    newSocials[index] = { ...newSocials[index], [field]: value };
    setFormData(prev => ({ ...prev, socials: newSocials }));
  };

  const handleBannerChange = (pageKey: string, field: 'title' | 'subtitle', value: string) => {
    setFormData(prev => ({
      ...prev,
      pageBanners: {
        ...prev.pageBanners,
        [pageKey]: {
          ...(prev.pageBanners?.[pageKey] || { title: '', subtitle: '' }),
          [field]: value
        }
      }
    }));
  };

  const handleOrganogramChange = (index: number, field: 'role' | 'name' | 'parentId', value: string | null) => {
    setFormData(prev => {
      const newOrg = [...(prev.organogram || [])];
      newOrg[index] = { ...newOrg[index], [field]: value };
      return { ...prev, organogram: newOrg };
    });
  };

  const addOrganogramBlock = () => {
    setFormData(prev => ({
      ...prev,
      organogram: [...(prev.organogram || []), { id: Date.now().toString(), role: '', name: '', parentId: null }]
    }));
  };

  const showConfirm = useConfirm();

  const removeOrganogramBlock = async (index: number) => {
    const ok = await showConfirm({ message: 'Deseja realmente remover este bloco? Itens que dependem dele subirão para o topo da hierarquia.', variant: 'danger', confirmText: 'Remover' });
    if (ok) {
      setFormData(prev => {
        const newOrg = [...(prev.organogram || [])];
        const removedId = newOrg[index].id;
        newOrg.splice(index, 1);
        
        newOrg.forEach((item, i) => {
          if (item.parentId === removedId) {
            newOrg[i] = { ...item, parentId: null };
          }
        });
        
        return { ...prev, organogram: newOrg };
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate emails
    if (formData.emailSecretaria && !isValidEmail(formData.emailSecretaria)) {
      toast.error('E-mail da Secretaria inválido.');
      return;
    }
    if (formData.emailDiretoria && !isValidEmail(formData.emailDiretoria)) {
      toast.error('E-mail da Diretoria inválido.');
      return;
    }

    updateGeneral(formData);
    toast.success('Configurações atualizadas com sucesso!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações Gerais</h1>
        <p className="text-gray-500">Gerencie informações de contato, rodapé e redes sociais.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Informações Básicas */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#2E7BA6]" />
            Informações da Escola
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Escola</label>
              <input
                type="text"
                value={formData.schoolName}
                onChange={(e) => handleChange('schoolName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7BA6]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Texto Institucional (Rodapé)</label>
              <input
                type="text"
                value={formData.footerText}
                onChange={(e) => handleChange('footerText', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7BA6]"
              />
            </div>
          </div>
        </div>

        {/* Contato */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#2E7BA6]" />
            Contato
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp 1</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7BA6]"
                placeholder="(11) 3222-1234"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7BA6]"
                placeholder="(11) 99999-9999"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail Secretaria</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={formData.emailSecretaria}
                  onChange={(e) => handleChange('emailSecretaria', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7BA6]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail Diretoria</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={formData.emailDiretoria}
                  onChange={(e) => handleChange('emailDiretoria', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7BA6]"
                />
              </div>
            </div>
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Horário de Atendimento</label>
              <input
                type="text"
                value={formData.businessHours || ''}
                onChange={(e) => handleChange('businessHours', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7BA6]"
                placeholder="Ex: Segunda a Sexta: 07:00 às 17:00"
              />
              <p className="text-xs text-gray-400 mt-1">Exibido no rodapé do site</p>
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#2E7BA6]" />
            Localização
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7BA6]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL do Google Maps (Embed)</label>
              <input
                type="text"
                value={formData.mapUrl}
                onChange={handleMapUrlChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7BA6] font-mono text-xs text-gray-500"
                placeholder="https://www.google.com/maps/embed?..."
              />
              <div className="text-xs text-gray-500 mt-2 bg-blue-50 p-2 rounded border border-blue-100">
                <strong>Como obter o link correto:</strong>
                <ol className="list-decimal ml-4 mt-1 space-y-1">
                  <li>No Google Maps, clique em <strong>Compartilhar</strong></li>
                  <li>Selecione a aba <strong>Incorporar um mapa</strong></li>
                  <li>Copie o código HTML inteiro e cole aqui (nós extrairemos o link automaticamente)</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Redes Sociais */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Redes Sociais</h2>
          <div className="space-y-4">
            {formData.socials.map((social, index) => {
              const Icon = social.name === 'Facebook' ? Facebook : social.name === 'Instagram' ? Instagram : Youtube;
              return (
                <div key={social.name} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={social.url}
                      onChange={(e) => handleSocialChange(index, 'url', e.target.value)}
                      placeholder={`Link do ${social.name}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7BA6]"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={social.active}
                      onChange={(e) => handleSocialChange(index, 'active', e.target.checked)}
                      className="w-4 h-4 text-[#2E7BA6] rounded focus:ring-[#2E7BA6]"
                    />
                    <span className="text-sm text-gray-600">Ativo</span>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Faixas de Página (Banners) */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Type className="w-5 h-5 text-[#2E7BA6]" />
            Faixas de Página (Banners)
          </h2>
          <p className="text-sm text-gray-500 mb-6">Textos exibidos no cabeçalho azul de cada página do site.</p>
          <div className="space-y-6">
            {Object.entries({
              sobre: 'Sobre a Escola',
              equipe: 'Equipe Gestora',
              projetos: 'Projetos',
              eventos: 'Eventos',
              premios: 'Prêmios',
              galeria: 'Galeria',
              plataformas: 'Plataformas',
              faq: 'FAQ'
            }).map(([key, label]) => (
              <div key={key} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-3">{label}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Título</label>
                    <input
                      type="text"
                      value={formData.pageBanners?.[key]?.title || ''}
                      onChange={(e) => handleBannerChange(key, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7BA6] bg-white"
                      placeholder="Ex: Sobre a Escola"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Subtítulo</label>
                    <input
                      type="text"
                      value={formData.pageBanners?.[key]?.subtitle || ''}
                      onChange={(e) => handleBannerChange(key, 'subtitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7BA6] bg-white"
                      placeholder="Subtítulo opcional..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Organograma da Equipe */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#2E7BA6]" />
                Organograma (Página Equipe)
              </h2>
              <p className="text-sm text-gray-500">Blocos de cargos exibidos na página de Equipe Gestora.</p>
            </div>
            <button
              type="button"
              onClick={addOrganogramBlock}
              className="flex items-center gap-2 bg-[#f0f9ff] text-[#2E7BA6] hover:bg-[#e0f2fe] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border border-[#bae6fd]"
            >
              <Plus className="w-4 h-4" />
              Adicionar Cargo
            </button>
          </div>
          
          <div className="space-y-3">
            {!formData.organogram || formData.organogram.length === 0 ? (
               <div className="p-4 bg-gray-50 text-center rounded-lg text-gray-500 text-sm border border-gray-200">
                 Nenhum bloco de organograma cadastrado.
               </div>
            ) : (
              formData.organogram.map((block, index) => (
                <div key={block.id} className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center font-bold text-gray-400 text-xs shrink-0">
                    {index + 1}
                  </div>
                  <div className="grid grid-cols-3 gap-4 flex-1">
                    <div>
                      <input
                        type="text"
                        value={block.role}
                        onChange={(e) => handleOrganogramChange(index, 'role', e.target.value)}
                        placeholder="Cargo (ex: Diretor)"
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2E7BA6] bg-white"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={block.name}
                        onChange={(e) => handleOrganogramChange(index, 'name', e.target.value)}
                        placeholder="Nome (ex: João Silva)"
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2E7BA6] bg-white"
                      />
                    </div>
                    <div>
                      <select
                        value={block.parentId || ''}
                        onChange={(e) => handleOrganogramChange(index, 'parentId', e.target.value || null)}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2E7BA6] bg-white"
                      >
                        <option value="">Abaixo de (Nenhum / Topo)</option>
                        {formData.organogram?.filter(b => b.id !== block.id).map(possibleParent => (
                          <option key={'parent-'+possibleParent.id} value={possibleParent.id}>
                            {possibleParent.role} ({possibleParent.name})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeOrganogramBlock(index)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                    title="Remover"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Botão Salvar Fixo */}
        <div className="sticky bottom-4 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-[#4A8B63] text-white px-6 py-3 rounded-xl hover:bg-[#3d7452] transition-all shadow-lg hover:shadow-xl font-bold"
          >
            <Save className="w-5 h-5" />
            Salvar Alterações
          </button>
        </div>

      </form>
    </div>
  );
}
