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
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">{data.general.pageBanners?.plataformas?.title || 'Plataformas Digitais'}</h1>
          <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto">
            {data.general.pageBanners?.plataformas?.subtitle || 'Acesse rapidamente os sistemas e ferramentas de aprendizado da escola.'}
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

        {/* Guia: SED e Sala do Futuro (plataformas separadas) */}
        <div className="space-y-6">
          {/* Sala do Futuro */}
          <div className="bg-emerald-50 rounded-2xl p-6 sm:p-8 shadow-sm border border-emerald-200">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-emerald-600 text-white p-4 rounded-xl shrink-0">
                <Monitor className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-3">Sala do Futuro</h2>
                <p className="text-muted-foreground mb-4">
                  A <strong>Sala do Futuro</strong> é uma plataforma acessada pelo <strong>seu próprio portal</strong>, separado da SED. Nela, alunos e professores encontram aulas, materiais didáticos e o CMSP (Centro de Mídias SP).
                </p>
                <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
                  <h3 className="font-bold text-foreground mb-2 text-lg">Como acessar?</h3>
                  <ol className="list-decimal pl-5 space-y-2 text-muted-foreground marker:text-emerald-600 marker:font-bold">
                    <li>Acesse o <strong>portal Sala do Futuro</strong> diretamente pelo navegador.</li>
                    <li>Faça login com seu <strong>RA (Registro do Aluno)</strong> ou credenciais de professor.</li>
                    <li>Acesse aulas, materiais e o CMSP (Centro de Mídias SP) pela plataforma.</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* SED */}
          <div className="bg-blue-50 rounded-2xl p-6 sm:p-8 shadow-sm border border-blue-200">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-blue-600 text-white p-4 rounded-xl shrink-0">
                <Info className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-3">SED – Secretaria Escolar Digital</h2>
                <p className="text-muted-foreground mb-4">
                  A <strong>SED</strong> é o portal administrativo da Secretaria da Educação de São Paulo, onde são feitas consultas de <strong>boletim, matrícula, frequência</strong> e outros serviços escolares.
                </p>
                <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                  <h3 className="font-bold text-foreground mb-2 text-lg">Como acessar?</h3>
                  <ol className="list-decimal pl-5 space-y-2 text-muted-foreground marker:text-blue-600 marker:font-bold">
                    <li>Acesse <strong>sed.educacao.sp.gov.br</strong> no navegador.</li>
                    <li>Faça login com seu <strong>RA</strong> (alunos) ou <strong>RG</strong> (responsáveis) e sua senha.</li>
                    <li>Consulte boletim, histórico, matrícula e demais serviços administrativos.</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}
