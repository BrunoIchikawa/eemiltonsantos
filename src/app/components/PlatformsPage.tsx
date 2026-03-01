import { ExternalLink, GraduationCap, Users, Monitor, BookOpen, FileText, Phone, Mail, PlayCircle, Info } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';

export function PlatformsPage() {
  const { data } = useSiteData();
  const { platforms } = data;
  const activePlatforms = platforms.filter(p => p.active);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Aluno': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Professor': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Gestão': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'Aluno': return GraduationCap;
      case 'Professor': return BookOpen;
      case 'Gestão': return Users;
      default: return Monitor;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-16">
      {/* Standard Header */}
      <section className="bg-gradient-to-r from-[#32C5F4] to-[#78D2F6] text-white py-12 sm:py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Plataformas Digitais</h1>
          <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto">
            Acesse rapidamente os sistemas e ferramentas de aprendizado da escola.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Lista de Plataformas */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-12 border border-border">
           {activePlatforms.length === 0 ? (
            <div className="text-center py-16">
              <Monitor className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">Nenhuma plataforma disponível no momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activePlatforms.map((platform) => {
                const Icon = getIcon(platform.category);
                return (
                  <div 
                    key={platform.id}
                    className="bg-white rounded-xl border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col group overflow-hidden"
                  >
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${getCategoryColor(platform.category)}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getCategoryColor(platform.category)}`}>
                          {platform.category}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {platform.name}
                      </h3>

                      <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1 border-l-2 border-border pl-3">
                        {platform.description}
                      </p>

                      <a
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full mt-auto flex items-center justify-center gap-2 bg-muted hover:bg-primary text-foreground hover:text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200"
                      >
                        Acessar
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>


        {/* Seção Precisa de Ajuda */}
        <section className="bg-primary rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div>
              <h2 className="text-3xl font-bold mb-4">Precisa de Ajuda?</h2>
              <p className="text-primary-foreground/90 text-lg max-w-xl">
                Se você está com dificuldades de acesso ou problemas técnicos nas plataformas, nossa secretaria está pronta para auxiliar.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href={`tel:${data.general.phone.replace(/\D/g, '')}`}
                className="flex items-center justify-center gap-3 bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg min-w-[200px]"
              >
                <Phone className="w-5 h-5" />
                Ligar Agora
              </a>
              <a 
                href={`mailto:${data.general.emailSecretaria}`}
                className="flex items-center justify-center gap-3 bg-primary-foreground/20 border border-white/20 text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-foreground/30 transition-all shadow-lg min-w-[200px]"
              >
                <Mail className="w-5 h-5" />
                Enviar E-mail
              </a>
            </div>
          </div>
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
        </section>

      </div>
    </div>
  );
}
