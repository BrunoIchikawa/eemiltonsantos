import { useState } from 'react';
import { ImageWithFallback } from './ui_elements/ImageWithFallback';
import { useSiteData } from '../context/SiteContext';
import { X, Calendar, Users, User } from 'lucide-react';


export function ProjectsPage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const onSelectProject = setSelectedProjectId;

  const { data } = useSiteData();
  const { projects } = data;

  // Robust filtering: treat undefined active as true
  const activeProjects = projects?.filter(p => p.active !== false) || [];

  const selectedProject = activeProjects.find(p => String(p.id) === String(selectedProjectId));

  // Modal de Detalhes
  if (selectedProject) {
    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm overflow-y-auto animate-in slide-in-from-bottom-10 duration-300">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 relative pointer-events-none">
          <div className="bg-white rounded-3xl shadow-2xl pointer-events-auto overflow-hidden">
            <button
              onClick={() => onSelectProject(null)}
              className="absolute top-4 right-4 bg-black/10 hover:bg-black/20 p-2 rounded-full transition-colors z-50"
            >
              <X className="w-6 h-6 text-gray-800" />
            </button>

            <div className="p-8 sm:p-12 space-y-8">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-md">
                <ImageWithFallback
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium bg-[#00A650]">
                    {selectedProject.category || 'Geral'}
                  </span>
                  <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 bg-gray-100 text-gray-600">
                    <Calendar className="w-3 h-3" /> {selectedProject.year || '2026'}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 text-gray-900">
                  {selectedProject.title}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 prose text-muted-foreground leading-relaxed whitespace-pre-wrap text-gray-600">
                    {selectedProject.fullDescription || selectedProject.description || 'Sem descrição detalhada.'}
                  </div>

                  <div className="bg-muted/50 p-6 rounded-xl h-fit border border-border bg-gray-50">
                    <h3 className="font-bold text-foreground mb-4 text-gray-900">Ficha Técnica</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm border border-border text-[#00A650]">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-bold text-gray-500">Coordenação</p>
                          <p className="text-sm font-medium text-foreground text-gray-800">{selectedProject.coordinator || 'Não informado'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-secondary shadow-sm border border-border text-[#609BA2]">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-bold text-gray-500">Participantes</p>
                          <p className="text-sm font-medium text-foreground text-gray-800">{selectedProject.participants || 0} Alunos</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-16 bg-gray-50">
      {/* Standard Header */}
      <section className="bg-gradient-to-r from-[#00A650] to-[#609BA2] text-white py-12 sm:py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">{data.general.pageBanners?.projetos?.title || 'Nossos Projetos'}</h1>
          <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto">
            {data.general.pageBanners?.projetos?.subtitle || 'Iniciativas que transformam a aprendizagem e engajam nossa comunidade.'}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeProjects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-border shadow-sm">
            <p className="text-muted-foreground text-gray-500">Nenhum projeto ativo no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => onSelectProject(String(project.id))}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-border flex flex-col hover:-translate-y-1"
              >
                <div className="aspect-[4/3] overflow-hidden relative bg-gray-100">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {project.category && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-foreground shadow-sm text-gray-800">
                      {project.category}
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors text-gray-900 group-hover:text-[#00A650]">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1 text-gray-600">
                    {project.description || 'Sem descrição.'}
                  </p>
                  <div className="pt-4 border-t border-border flex items-center justify-between text-sm border-gray-100">
                    <span className="text-secondary font-medium group-hover:underline text-[#609BA2]">Saiba mais</span>
                    <span className="text-muted-foreground text-gray-500">{project.year || '2026'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
