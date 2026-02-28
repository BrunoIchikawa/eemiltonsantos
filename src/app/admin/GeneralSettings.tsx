import { useState, useEffect } from 'react';
import { useSiteData } from '../context/SiteContext';
import { Save, Facebook, Instagram, Youtube, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { toast } from 'sonner';

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
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone Principal</label>
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
