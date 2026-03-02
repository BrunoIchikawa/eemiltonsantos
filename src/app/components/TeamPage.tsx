
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
          <div className="w-full pb-8">
            {data.general.organogram && data.general.organogram.length > 0 ? (
              (() => {
                type OrgNode = { id: string; role: string; name: string; parentId?: string | null };
                const allNodes = data.general.organogram!;

                const NODE_W = 170;
                const NODE_H = 80;
                const GAP_X = 20;
                const GAP_Y = 50;
                const PAD = 30;

                const getChildren = (parentId: string | null): OrgNode[] =>
                  allNodes.filter(n => (n.parentId || null) === parentId);

                // --- MOBILE VIEW ---
                const renderMobileTree = (parentId: string | null, level: number): React.ReactNode => {
                  const nodes = getChildren(parentId);
                  if (nodes.length === 0) return null;
                  
                  return (
                    <div className={`flex flex-col gap-4 ${level > 0 ? 'ml-6 pl-4 border-l-2 border-primary/30 py-2' : ''}`}>
                      {nodes.map(node => (
                        <div key={node.id} className="relative">
                          {level > 0 && <div className="absolute top-6 -left-4 w-4 h-[2px] bg-primary/30" />}
                          <div className="bg-primary text-primary-foreground p-4 rounded-xl shadow-md border border-primary/20">
                            <div className="font-bold text-base leading-tight">{node.role}</div>
                            <div className="text-sm opacity-90 mt-1.5 inline-block bg-black/10 rounded px-2 py-0.5">{node.name}</div>
                          </div>
                          {renderMobileTree(node.id, level + 1)}
                        </div>
                      ))}
                    </div>
                  );
                };

                // --- DESKTOP VIEW (SVG) ---
                const subtreeWidthCache = new Map<string, number>();
                const getSubtreeWidth = (nodeId: string): number => {
                  if (subtreeWidthCache.has(nodeId)) return subtreeWidthCache.get(nodeId)!;
                  const children = getChildren(nodeId);
                  let w: number;
                  if (children.length === 0) {
                    w = NODE_W;
                  } else {
                    w = children.reduce((sum, c) => sum + getSubtreeWidth(c.id), 0)
                      + GAP_X * (children.length - 1);
                    w = Math.max(NODE_W, w);
                  }
                  subtreeWidthCache.set(nodeId, w);
                  return w;
                };

                const positioned: { x: number; y: number; node: OrgNode }[] = [];
                const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];

                const layout = (nodeId: string, regionLeft: number, y: number) => {
                  const node = allNodes.find(n => n.id === nodeId);
                  if (!node) return;
                  const regionW = getSubtreeWidth(nodeId);
                  const nodeX = regionLeft + (regionW - NODE_W) / 2;
                  positioned.push({ x: nodeX, y, node });

                  const children = getChildren(nodeId);
                  if (children.length === 0) return;

                  const childY = y + NODE_H + GAP_Y;
                  let childLeft = regionLeft;
                  const childrenTotalW = children.reduce((s, c) => s + getSubtreeWidth(c.id), 0)
                    + GAP_X * (children.length - 1);
                  if (childrenTotalW < regionW) {
                    childLeft = regionLeft + (regionW - childrenTotalW) / 2;
                  }

                  const parentCenterX = nodeX + NODE_W / 2;
                  const parentBottomY = y + NODE_H;

                  children.forEach(child => {
                    const childRegionW = getSubtreeWidth(child.id);
                    const childNodeX = childLeft + (childRegionW - NODE_W) / 2;
                    const childCenterX = childNodeX + NODE_W / 2;

                    lines.push({
                      x1: parentCenterX,
                      y1: parentBottomY,
                      x2: childCenterX,
                      y2: childY,
                    });

                    layout(child.id, childLeft, childY);
                    childLeft += childRegionW + GAP_X;
                  });
                };

                const roots = getChildren(null);
                let currentLeft = PAD;
                roots.forEach(root => {
                  getSubtreeWidth(root.id);
                  layout(root.id, currentLeft, PAD);
                  currentLeft += getSubtreeWidth(root.id) + GAP_X;
                });

                const svgW = positioned.length > 0
                  ? Math.max(...positioned.map(n => n.x + NODE_W)) + PAD
                  : 400;
                const svgH = positioned.length > 0
                  ? Math.max(...positioned.map(n => n.y + NODE_H)) + PAD
                  : 200;

                return (
                  <>
                    <div className="block lg:hidden w-full px-2">
                      {renderMobileTree(null, 0)}
                    </div>
                    <div className="hidden lg:block w-full overflow-x-auto pb-6">
                      <div className="flex justify-center min-w-max mx-auto px-4">
                        <svg
                          width={svgW}
                          height={svgH}
                          viewBox={`0 0 ${svgW} ${svgH}`}
                          className="block"
                        >
                          {/* Connection lines */}
                          {lines.map((l, i) => {
                            const midY = l.y1 + (l.y2 - l.y1) / 2;
                            return (
                              <path
                                key={`line-${i}`}
                                d={`M${l.x1},${l.y1} V${midY} H${l.x2} V${l.y2}`}
                                fill="none"
                                stroke="hsl(var(--primary) / 0.4)"
                                strokeWidth="2.5"
                                strokeLinejoin="round"
                              />
                            );
                          })}
                          {/* Node boxes */}
                          {positioned.map(({ x, y, node: b }) => (
                            <foreignObject key={b.id} x={x} y={y} width={NODE_W} height={NODE_H}>
                              <div
                                className="bg-primary text-primary-foreground rounded-xl shadow-md text-center w-full h-full flex flex-col items-center justify-center px-4 py-2 border border-primary/20"
                                style={{ width: NODE_W, height: NODE_H }}
                              >
                                <div className="font-bold text-sm leading-tight" style={{ wordBreak: 'break-word' }}>{b.role}</div>
                                <div className="text-xs opacity-90 mt-1.5 bg-black/10 rounded px-2 py-0.5 max-w-full truncate">{b.name}</div>
                              </div>
                            </foreignObject>
                          ))}
                        </svg>
                      </div>
                    </div>
                  </>
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
