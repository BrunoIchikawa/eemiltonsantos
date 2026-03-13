
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
          <div className="w-full pb-8 bg-slate-50 border border-slate-200/60 rounded-3xl p-4 sm:p-8 shadow-inner">
            {data.general.organogram && data.general.organogram.length > 0 ? (
              (() => {
                type OrgNode = { id: string; role: string; name: string; parentId?: string | null; parentIds?: string[] };
                const allNodes = data.general.organogram as OrgNode[] || [];

                const NODE_W = 240;
                const NODE_H = 100;
                const GAP_X = 24;
                const GAP_Y = 54;
                const PAD = 30;

                const getChildren = (parentId: string | null): OrgNode[] => {
                  return allNodes.filter(n => {
                    const pIds = n.parentIds || (n.parentId ? [n.parentId] : []);
                    if (parentId === null) return pIds.length === 0;
                    return pIds.includes(parentId);
                  });
                };

                const OrgNodeCard = ({ block }: { block: OrgNode }) => (
                  <div className="bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] border border-slate-200/60 w-full h-full flex flex-col items-center justify-center p-3 relative overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.12)] hover:-translate-y-0.5">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>
                    <div 
                      className="font-bold text-[15px] sm:text-base text-slate-800 text-center leading-tight mb-1.5 w-full px-1"
                      style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                    >
                      {block.role}
                    </div>
                    <div className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full truncate max-w-full">
                      {block.name}
                    </div>
                  </div>
                );

                // --- MOBILE VIEW ---
                const renderMobileTree = (parentId: string | null, level: number): React.ReactNode => {
                  const nodes = getChildren(parentId);
                  if (nodes.length === 0) return null;
                  
                  return (
                    <div className={`flex flex-col gap-5 ${level > 0 ? 'ml-6 pl-4 border-l-2 border-slate-200 py-2' : ''}`}>
                      {nodes.map((node, i) => (
                        <div key={`${parentId}-${node.id}-${i}`} className="relative w-full max-w-sm">
                          {level > 0 && <div className="absolute top-8 -left-4 w-4 h-[2px] bg-slate-200" />}
                          <div className="h-[100px]">
                            <OrgNodeCard block={node} />
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

                const positioned: { uniqueKey: string; x: number; y: number; node: OrgNode }[] = [];
                const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];

                const layout = (nodeId: string, regionLeft: number, y: number, parentIdForUniqueKey: string | null = null) => {
                  const node = allNodes.find(n => n.id === nodeId);
                  if (!node) return;
                  const regionW = getSubtreeWidth(nodeId);
                  const nodeX = regionLeft + (regionW - NODE_W) / 2;
                  
                  // Chave única composta para evitar bugs do React quando o layout desenha o mesmo node 2x
                  const uniqueKey = `${parentIdForUniqueKey}-${nodeId}-${xCounter++}`;
                  positioned.push({ uniqueKey, x: nodeX, y, node });

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

                    layout(child.id, childLeft, childY, nodeId);
                    childLeft += childRegionW + GAP_X;
                  });
                };

                let xCounter = 0;
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
                          className="block mx-auto"
                          style={{ maxWidth: `${svgW}px`, width: '100%', maxHeight: '75vh' }}
                        >
                          {/* Connection lines */}
                          {lines.map((l, i) => {
                            const midY = l.y1 + (l.y2 - l.y1) / 2;
                            return (
                              <path
                                key={`line-${i}`}
                                d={`M${l.x1},${l.y1} V${midY} H${l.x2} V${l.y2}`}
                                fill="none"
                                stroke="#cbd5e1"
                                strokeWidth="2.5"
                                strokeLinejoin="round"
                              />
                            );
                          })}
                          {/* Node boxes */}
                          {positioned.map(({ uniqueKey, x, y, node: b }) => (
                            <foreignObject key={uniqueKey} x={x} y={y} width={NODE_W} height={NODE_H}>
                              <OrgNodeCard block={b} />
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
