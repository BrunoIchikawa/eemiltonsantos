
import { ImageWithFallback } from './ui_elements/ImageWithFallback';
import { useSiteData } from '../context/SiteContext';

export function TeamPage() {
  const { data } = useSiteData();
  const { team } = data;

  return (
    <div className="min-h-screen">
      {/* Standard Header */}
      <section className="bg-gradient-to-r from-[#609BA2] to-[#78D2F6] text-white py-12 sm:py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            {data.general.pageBanners?.equipe?.title || 'Equipe Gestora'}
          </h1>
          <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto">
            {data.general.pageBanners?.equipe?.subtitle || 'Conheça os profissionais dedicados que lideram nossa instituição.'}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Organograma (Dinâmico) */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-8 text-center">
            Estrutura Organizacional
          </h2>
          <div className="max-w-full overflow-x-auto pb-8 mx-auto flex justify-center">
            {data.general.organogram && data.general.organogram.length > 0 ? (
              <div className="min-w-fit">
                {(() => {
                  const renderTree = (parentId: string | null = null, level = 0) => {
                    const nodes = data.general.organogram!.filter(b => (b.parentId || null) === parentId);
                    if (nodes.length === 0) return null;

                    return (
                      <div className={`flex flex-col items-center relative ${level > 0 ? 'mt-8' : ''}`}>
                        {level > 0 && <div className="absolute -top-8 left-1/2 w-0.5 h-8 bg-primary/40 -translate-x-1/2 z-0"></div>}
                        
                        <div className="flex flex-row justify-center items-start gap-4 sm:gap-8 relative z-10">
                          {nodes.length > 1 && level > 0 && (
                            <div className="absolute -top-8 h-0.5 bg-primary/40 z-0" style={{ left: 'calc(50% / ' + nodes.length + ')', right: 'calc(50% / ' + nodes.length + ')' }}></div>
                          )}
                          {nodes.map((block, i) => (
                            <div key={block.id} className="flex flex-col items-center relative">
                              {nodes.length > 1 && level > 0 && (
                                <div className="absolute -top-8 left-1/2 w-0.5 h-8 bg-primary/40 -translate-x-1/2 z-0"></div>
                              )}
                              
                              <div className="bg-primary text-primary-foreground px-6 py-4 rounded-xl shadow-lg text-center w-[220px] border border-primary/20 hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 relative z-20">
                                <div className="font-bold text-lg leading-tight">{block.role}</div>
                                <div className="text-sm opacity-90 mt-2 p-2 bg-black/10 rounded-lg font-medium shadow-inner">{block.name}</div>
                              </div>
                              
                              {renderTree(block.id, level + 1)}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  };

                  return renderTree(null, 0);
                })()}
              </div>
            ) : (
              <div className="text-center text-muted-foreground w-full py-8 bg-muted/30 rounded-lg">
                Estrutura organizacional não cadastrada.
              </div>
            )}
          </div>
        </section>

        {/* Perfis da Equipe (Dinâmico) */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-8">
            Membros da Gestão
          </h2>
          {team.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-xl">
              <p>Nenhum membro cadastrado ainda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {team.map((member) => (
                <div
                  key={member.id}
                  className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <ImageWithFallback
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <div className="text-primary font-semibold mb-3">{member.role}</div>
                    <p className="text-sm text-muted-foreground">
                      {member.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Mensagem */}
        <section className="mt-12 sm:mt-16 bg-accent rounded-xl p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-accent-foreground mb-4">
            Compromisso com a Educação
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Nossa equipe gestora trabalha diariamente para garantir um ambiente educacional de excelência,
            onde cada estudante possa desenvolver todo seu potencial. Com formação sólida e experiência
            comprovada, nossos gestores coordenam ações pedagógicas, administrativas e de relacionamento
            com a comunidade escolar, sempre priorizando a qualidade do ensino e o bem-estar de todos.
          </p>
        </section>
      </div>
    </div>
  );
}
