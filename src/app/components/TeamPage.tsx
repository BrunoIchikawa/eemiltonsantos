
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
              (() => {
                type OrgNode = { id: string; role: string; name: string; parentId?: string | null };
                const allNodes = data.general.organogram!;
                
                const NODE_W = 200;
                const NODE_H = 72;
                const GAP_X = 24;
                const GAP_Y = 60;

                // Build tree structure
                const getChildren = (parentId: string | null): OrgNode[] =>
                  allNodes.filter(n => (n.parentId || null) === parentId);

                // Calculate subtree width recursively
                const getSubtreeWidth = (nodeId: string): number => {
                  const children = getChildren(nodeId);
                  if (children.length === 0) return NODE_W;
                  const childrenWidth = children.reduce((sum, c) => sum + getSubtreeWidth(c.id), 0);
                  return Math.max(NODE_W, childrenWidth + GAP_X * (children.length - 1));
                };

                // Collect positioned nodes and edges
                const nodes: { x: number; y: number; node: OrgNode }[] = [];
                const edges: { x1: number; y1: number; x2: number; y2: number }[] = [];

                const layoutTree = (nodeId: string, x: number, y: number) => {
                  const node = allNodes.find(n => n.id === nodeId);
                  if (!node) return;
                  nodes.push({ x, y, node });

                  const children = getChildren(nodeId);
                  if (children.length === 0) return;

                  const totalChildWidth = children.reduce((sum, c) => sum + getSubtreeWidth(c.id), 0) + GAP_X * (children.length - 1);
                  let childX = x + NODE_W / 2 - totalChildWidth / 2;

                  children.forEach(child => {
                    const childW = getSubtreeWidth(child.id);
                    const childCenterX = childX + childW / 2 - NODE_W / 2;
                    
                    // Edge from parent bottom center to child top center
                    edges.push({
                      x1: x + NODE_W / 2,
                      y1: y + NODE_H,
                      x2: childCenterX + NODE_W / 2,
                      y2: y + NODE_H + GAP_Y,
                    });

                    layoutTree(child.id, childCenterX, y + NODE_H + GAP_Y);
                    childX += childW + GAP_X;
                  });
                };

                // Layout all root nodes
                const roots = getChildren(null);
                const totalRootWidth = roots.reduce((sum, r) => sum + getSubtreeWidth(r.id), 0) + GAP_X * (roots.length - 1);
                let rootX = 0;
                roots.forEach(root => {
                  const w = getSubtreeWidth(root.id);
                  const cx = rootX + w / 2 - NODE_W / 2;
                  layoutTree(root.id, cx, 0);
                  rootX += w + GAP_X;
                });

                // Calculate SVG dimensions
                const maxX = Math.max(...nodes.map(n => n.x + NODE_W), totalRootWidth);
                const maxY = Math.max(...nodes.map(n => n.y + NODE_H)) + 20;

                return (
                  <svg width={maxX + 20} height={maxY} className="mx-auto">
                    {/* Edges */}
                    {edges.map((e, i) => {
                      const midY = e.y1 + (e.y2 - e.y1) / 2;
                      return (
                        <path
                          key={`edge-${i}`}
                          d={`M ${e.x1} ${e.y1} L ${e.x1} ${midY} L ${e.x2} ${midY} L ${e.x2} ${e.y2}`}
                          fill="none"
                          stroke="hsl(var(--primary) / 0.4)"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      );
                    })}
                    {/* Nodes */}
                    {nodes.map(({ x, y, node: block }) => (
                      <foreignObject key={block.id} x={x} y={y} width={NODE_W} height={NODE_H}>
                        <div className="bg-primary text-primary-foreground px-4 py-3 rounded-xl shadow-lg text-center w-full h-full flex flex-col justify-center border border-primary/20 hover:shadow-primary/30 transition-shadow">
                          <div className="font-bold text-sm leading-tight">{block.role}</div>
                          <div className="text-xs opacity-85 mt-1 bg-black/10 rounded px-2 py-0.5 truncate">{block.name}</div>
                        </div>
                      </foreignObject>
                    ))}
                  </svg>
                );
              })()
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
