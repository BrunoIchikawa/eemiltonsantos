
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
            Equipe Gestora
          </h1>
          <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto">
            Conheça os profissionais dedicados que lideram nossa instituição.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Organograma Simplificado - Mantido Estático por enquanto */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-8 text-center">
            Estrutura Organizacional
          </h2>
          <div className="max-w-4xl mx-auto">
            {/* Direção */}
            <div className="flex justify-center mb-8">
              <div className="bg-primary text-primary-foreground px-6 py-4 rounded-lg shadow-lg text-center">
                <div className="font-bold text-lg">Direção</div>
                <div className="text-sm opacity-90">Diretora e Vice-Diretor</div>
              </div>
            </div>

            {/* Linha de Conexão */}
            <div className="flex justify-center mb-8">
              <div className="w-0.5 h-8 bg-border"></div>
            </div>

            {/* Coordenações */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="bg-secondary text-secondary-foreground px-6 py-4 rounded-lg shadow-lg text-center">
                <div className="font-bold">Coordenação Pedagógica</div>
                <div className="text-sm opacity-90 mt-1">Ensino Fundamental II</div>
              </div>
              <div className="bg-secondary text-secondary-foreground px-6 py-4 rounded-lg shadow-lg text-center">
                <div className="font-bold">Coordenação Pedagógica</div>
                <div className="text-sm opacity-90 mt-1">Ensino Médio</div>
              </div>
            </div>

            {/* Linha de Conexão */}
            <div className="flex justify-center my-8">
              <div className="w-0.5 h-8 bg-border"></div>
            </div>

            {/* Professores e Funcionários */}
            <div className="bg-accent text-accent-foreground px-6 py-4 rounded-lg text-center max-w-md mx-auto">
              <div className="font-bold">Corpo Docente e Funcionários</div>
              <div className="text-sm opacity-90 mt-1">45+ Professores | 20+ Funcionários</div>
            </div>
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
