import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, Clock, ExternalLink, ChevronRight, Lock, Globe, X, Loader2, Eye, EyeOff } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';
import { authService } from '../../services/authService';
import { toast } from 'sonner';
import { useState } from "react";

import { useNavigate } from 'react-router-dom';

export function Footer() {
  const navigate = useNavigate();
  const { data } = useSiteData();
  const { general } = data;
  const currentYear = new Date().getFullYear();

  // Login State
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleNav = (page: string) => {
    navigate(page === 'home' ? '/' : `/${page}`);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.login(password);
      setShowLoginModal(false);
      setPassword('');
      handleNav('admin');
      toast.success('Login realizado com sucesso');
    } catch (err: any) {
      setError('Senha incorreta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const getSocialIcon = (name: string) => {
    switch (name) {
      case 'Facebook': return Facebook;
      case 'Instagram': return Instagram;
      case 'YouTube': return Youtube;
      default: return Globe; // Fallback
    }
  };

  const getSocialColor = (name: string) => {
    switch (name) {
      case 'Facebook': return 'hover:text-[#1877F2]';
      case 'Instagram': return 'hover:text-[#E4405F]';
      case 'YouTube': return 'hover:text-[#FF0000]';
      default: return 'hover:text-white';
    }
  };

  const quickLinks = [
    { name: 'Início', href: 'home' },
    { name: 'Sobre a Escola', href: 'sobre' },
    { name: 'Equipe Gestora', href: 'equipe' },
    { name: 'Projetos', href: 'projetos' },
    { name: 'Calendário', href: 'calendario' },
    { name: 'Plataformas', href: 'plataformas' },
  ];

  // Cor institucional profunda para o footer (Derivada do Azul da Logo)
  const footerBgColor = "bg-[#004E75]";

  const isEmbedUrl = general.mapUrl && general.mapUrl.includes('embed');

  return (
    <>
      <footer className={`${footerBgColor} text-gray-100 mt-auto border-t-4 border-[#0099DD]`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* Coluna 1: Identidade e Horários */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{general.schoolName}</h2>
                <p className="text-sm text-blue-100 leading-relaxed">
                  {general.footerText}
                </p>
              </div>

              <div className="bg-white/10 p-4 rounded-lg border border-white/10">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#0099DD] mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">Horário de Atendimento</h3>
                    <p className="text-sm text-blue-100">{general.businessHours || 'Segunda a Sexta: 07:00 às 17:00'}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                {general.socials.filter(s => s.active).map((social) => {
                  const Icon = getSocialIcon(social.name);
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`bg-white/10 p-2.5 rounded-lg text-blue-100 transition-all duration-300 hover:bg-white hover:scale-110 ${getSocialColor(social.name)}`}
                      aria-label={`Visitar nosso ${social.name}`}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Coluna 2: Links Rápidos */}
            <div>
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-[#009B3A] rounded-full"></span>
                Acesso Rápido
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <button
                      onClick={() => handleNav(link.href)}
                      className="group flex items-center gap-2 text-sm hover:text-[#0099DD] transition-colors duration-200 w-full text-left text-blue-100 hover:text-white"
                    >
                      <ChevronRight className="w-4 h-4 text-[#009B3A] transition-transform duration-200 group-hover:translate-x-1" />
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Coluna 3: Contato */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-[#705741] rounded-full"></span>
                Fale Conosco
              </h3>
              <div className="space-y-4">
                <a
                  href={general.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 group"
                >
                  <div className="bg-white/10 p-2 rounded-lg group-hover:bg-[#0099DD] transition-colors duration-300">
                    <MapPin className="w-5 h-5 text-blue-100 group-hover:text-white" />
                  </div>
                  <div className="text-sm group-hover:text-white transition-colors text-blue-100">
                    <p className="whitespace-pre-line">{general.address}</p>
                  </div>
                </a>

                <div className="flex items-center gap-3 group">
                  <div className="bg-white/10 p-2 rounded-lg group-hover:bg-[#25D366] transition-colors duration-300">
                    <Phone className="w-5 h-5 text-blue-100 group-hover:text-white" />
                  </div>
                  <div className="text-sm text-blue-100">
                    {general.whatsapp && (
                      <a href={`https://wa.me/55${general.whatsapp.replace(/\D/g, '')}`} className="block hover:text-white transition-colors mb-1 font-medium">
                        {general.whatsapp} (WhatsApp)
                      </a>
                    )}
                    {general.phone && (
                      <a href={`tel:${general.phone.replace(/\D/g, '')}`} className="block text-blue-200 hover:text-white transition-colors">
                        {general.phone}
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 group">
                  <div className="bg-white/10 p-2 rounded-lg group-hover:bg-[#705741] transition-colors duration-300">
                    <Mail className="w-5 h-5 text-blue-100 group-hover:text-white" />
                  </div>
                  <div className="text-sm text-blue-100">
                    <a href={`mailto:${general.emailSecretaria}`} className="block hover:text-white transition-colors break-all">
                      {general.emailSecretaria}
                    </a>
                    <a href={`mailto:${general.emailDiretoria}`} className="block text-blue-200 hover:text-white transition-colors mt-1 break-all">
                      {general.emailDiretoria}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna 4: Mapa */}
            <div className="flex flex-col h-full">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-[#0099DD] rounded-full"></span>
                Localização
              </h3>
              <div className="flex-1 bg-white/5 rounded-xl overflow-hidden min-h-[200px] relative border border-white/10">
                {isEmbedUrl ? (
                  <iframe
                    src={general.mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '200px' }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full absolute inset-0"
                    title="Google Maps"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full min-h-[200px] p-6 text-center group">
                    <div className="text-center">
                      <div className="bg-white/10 p-4 rounded-full inline-flex mb-3 group-hover:bg-[#0099DD] transition-colors">
                        <MapPin className="w-8 h-8 text-blue-100 group-hover:text-white" />
                      </div>
                      <p className="text-sm text-blue-200 mb-4">Veja nossa localização no Google Maps</p>
                      <a
                        href={general.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white text-[#004E75] px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors"
                      >
                        Abrir Mapa <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Rodapé Inferior */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
              <div>
                <p className="text-sm font-medium text-white">
                  © {currentYear} {general.schoolName}
                </p>
                <a href="https://www.educacao.sp.gov.br/" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-200 mt-1 hover:text-white transition-colors">
                  Governo do Estado de São Paulo - Secretaria da Educação
                </a>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex flex-wrap justify-center gap-6 text-xs text-blue-200">
                  <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
                  <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
                </div>

                <button
                  onClick={() => setShowLoginModal(true)}
                  className="text-blue-300 hover:text-white transition-colors flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-white/10"
                  title="Acesso Administrativo"
                >
                  <Lock className="w-3 h-3" />
                  <span className="sr-only">Admin</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#0099DD]" />
                  Acesso Restrito
                </h3>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Senha de Administrador</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError('');
                      }}
                      className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099DD] focus:border-transparent"
                      placeholder="Digite a senha..."
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-[#0099DD] text-white rounded-lg font-bold hover:bg-[#007bb1] transition-colors shadow-lg shadow-blue-500/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    'Entrar no Painel'
                  )}
                </button>
              </form>

              <p className="text-center text-xs text-gray-400 mt-4">
                Área exclusiva para gestores da escola.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
