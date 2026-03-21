
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
                // Flat level-based layout to prevent horizontal overflow on small screens
                const getFirstParentChildren = (parentId: string | null): OrgNode[] => {
                  return allNodes.filter(n => {
                    const pIds = n.parentIds || (n.parentId ? [n.parentId] : []);
                    if (parentId === null) return pIds.length === 0;
                    return pIds[0] === parentId; 
                  });
                };

                // Build flat ordered list with levels (BFS)
                const buildMobileList = () => {
                  const result: { node: OrgNode; level: number }[] = [];
                  const queue: { parentId: string | null; level: number }[] = [{ parentId: null, level: 0 }];
                  const visited = new Set<string>();
                  
                  while (queue.length > 0) {
                    const { parentId, level } = queue.shift()!;
                    const children = getFirstParentChildren(parentId);
                    children.forEach(child => {
                      if (!visited.has(child.id)) {
                        visited.add(child.id);
                        result.push({ node: child, level });
                        queue.push({ parentId: child.id, level: level + 1 });
                      }
                    });
                  }
                  return result;
                };

                const mobileList = buildMobileList();

                const renderMobileOrg = () => {
                  if (mobileList.length === 0) return null;
                  return (
                    <div className="flex flex-col gap-2 w-full">
                      {mobileList.map(({ node, level }) => {
                        // Cap indentation: max 3 levels deep visually, 16px per level
                        const indent = Math.min(level, 3) * 16;
                        return (
                          <div key={node.id} className="relative w-full" style={{ paddingLeft: `${indent}px` }}>
                            {level > 0 && (
                              <div 
                                className="absolute top-1/2 -translate-y-1/2 w-3 h-[2px] bg-slate-300" 
                                style={{ left: `${indent - 12}px` }}
                              />
                            )}
                            <div className="bg-white rounded-lg shadow-sm border border-slate-200/60 p-2.5 flex items-center gap-2.5 overflow-hidden">
                              <div className="w-1 self-stretch bg-primary rounded-full shrink-0"></div>
                              <div className="min-w-0 flex-1">
                                <div className="font-bold text-[13px] text-slate-800 leading-tight truncate">
                                  {node.role}
                                </div>
                                <div className="text-[11px] font-semibold text-primary truncate mt-0.5">
                                  {node.name}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                };

                // --- DESKTOP VIEW (DAG LAYOUT - NÍVEIS) ---
                // 1. Encontrar o Nível de profundidade de cada bloco
                const nodeLevels = new Map<string, number>();
                let changed = true;
                let iters = 0;
                while (changed && iters < 100) {
                  changed = false;
                  iters++;
                  allNodes.forEach(n => {
                    const pIds = n.parentIds || (n.parentId ? [n.parentId] : []);
                    if (pIds.length === 0) {
                      if (nodeLevels.get(n.id) !== 0) {
                        nodeLevels.set(n.id, 0);
                        changed = true;
                      }
                    } else {
                      let maxPLevel = -1;
                      let allParentsResolved = true;
                      pIds.forEach(pId => {
                        if (nodeLevels.has(pId)) {
                          maxPLevel = Math.max(maxPLevel, nodeLevels.get(pId)!);
                        } else {
                          allParentsResolved = false;
                        }
                      });
                      if (allParentsResolved) {
                        const expectedLevel = maxPLevel + 1;
                        if (nodeLevels.get(n.id) !== expectedLevel) {
                          nodeLevels.set(n.id, expectedLevel);
                          changed = true;
                        }
                      }
                    }
                  });
                }
                
                // Tratar blocos perdidos (loops acidentais) colocando no nível 0
                allNodes.forEach(n => {
                  if (!nodeLevels.has(n.id)) {
                    nodeLevels.set(n.id, 0);
                  }
                });

                // 2. Agrupar por Níveis Reais
                const layers: OrgNode[][] = [];
                nodeLevels.forEach((lvl, id) => {
                  if (!layers[lvl]) layers[lvl] = [];
                  const node = allNodes.find(n => n.id === id);
                  if (node) layers[lvl].push(node);
                });
                const validLayers = layers.filter(l => l && l.length > 0);

                // 3. Relaxação Geométrica (Barycenter Layout Iterativo)
                const layerNodesArray = validLayers.map(l => l.map(n => ({ node: n, x: 0 })));
                const itemMap = new Map<string, {node: OrgNode, x: number, y: number}>();
                
                // Distribuição inicial
                layerNodesArray.forEach((layer) => {
                  const layerW = layer.length * NODE_W + (layer.length - 1) * GAP_X;
                  let startX = -layerW / 2 + NODE_W / 2;
                  layer.forEach(item => {
                    item.x = startX;
                    startX += NODE_W + GAP_X;
                  });
                });

                // Evitar Overlap
                const resolveOverlaps = (layer: {x: number}[]) => {
                  layer.sort((a, b) => a.x - b.x);
                  let changed = true;
                  let loops = 0;
                  while(changed && loops < 20) {
                    changed = false;
                    loops++;
                    for (let i = 0; i < layer.length - 1; i++) {
                      const a = layer[i];
                      const b = layer[i + 1];
                      const minDist = NODE_W + GAP_X;
                      if (b.x - a.x < minDist) {
                        const overlap = minDist - (b.x - a.x);
                        a.x -= overlap / 2;
                        b.x += overlap / 2;
                        changed = true;
                      }
                    }
                  }
                };

                // Iterações de força gravitacional nos Eixos X para Pais/Filhos
                for (let iter = 0; iter < 50; iter++) {
                  // Top-down
                  for (let l = 1; l < layerNodesArray.length; l++) {
                    const layer = layerNodesArray[l];
                    layer.forEach(item => {
                      const pIds = item.node.parentIds || (item.node.parentId ? [item.node.parentId] : []);
                      let pSum = 0;
                      let count = 0;
                      pIds.forEach(pId => {
                        const pItem = layerNodesArray.flat().find(p => p.node.id === pId);
                        if (pItem) {
                          pSum += pItem.x;
                          count++;
                        }
                      });
                      if (count > 0) item.x = (item.x + (pSum / count)) / 2; 
                    });
                    resolveOverlaps(layer);
                  }
                  
                  // Bottom-up
                  for (let l = layerNodesArray.length - 2; l >= 0; l--) {
                    const layer = layerNodesArray[l];
                    layer.forEach(item => {
                      const children = layerNodesArray.flat().filter(c => {
                         const cpIds = c.node.parentIds || (c.node.parentId ? [c.node.parentId] : []);
                         return cpIds.includes(item.node.id);
                      });
                      if (children.length > 0) {
                        let cSum = 0;
                        children.forEach(c => cSum += c.x);
                        item.x = (item.x + (cSum / children.length)) / 2;
                      }
                    });
                    resolveOverlaps(layer);
                  }
                }

                // 4. Bounding Box Dinâmico com Offset
                let minX = Infinity;
                let maxX = -Infinity;
                layerNodesArray.flat().forEach(item => {
                  if (item.x < minX) minX = item.x;
                  if (item.x > maxX) maxX = item.x;
                });
                
                const graphTotalWidth = (maxX - minX) + NODE_W;
                const svgW = Math.max(800, graphTotalWidth + PAD * 2);
                const svgH = layerNodesArray.length * NODE_H + (layerNodesArray.length - 1) * GAP_Y + PAD * 2;
                
                const offsetX = (svgW / 2) - ((minX + maxX) / 2);

                const positioned = new Map<string, {x: number, y: number, node: OrgNode}>();
                const drawnLines: {x1: number, y1: number, x2: number, y2: number, midY: number}[] = [];

                layerNodesArray.forEach((layer, lvlIndex) => {
                  const y = PAD + lvlIndex * (NODE_H + GAP_Y);
                  layer.forEach(item => {
                    const finalX = item.x + offsetX - (NODE_W / 2); // get top-left X pra foreignObject
                    itemMap.set(item.node.id, { node: item.node, x: finalX, y });
                    positioned.set(item.node.id, { x: finalX, y, node: item.node });
                  });
                });

                // 5. Trilha das linhas do SVG
                allNodes.forEach(node => {
                  const pIds = node.parentIds || (node.parentId ? [node.parentId] : []);
                  const targetPos = positioned.get(node.id);
                  if (!targetPos) return;

                  pIds.forEach(pId => {
                    const sourcePos = positioned.get(pId);
                    if (!sourcePos) return;

                    const x1 = sourcePos.x + NODE_W / 2;
                    const y1 = sourcePos.y + NODE_H;
                    const x2 = targetPos.x + NODE_W / 2;
                    const y2 = targetPos.y;
                    
                    const midY = sourcePos.y + NODE_H + GAP_Y / 2;
                    drawnLines.push({ x1, y1, x2, y2, midY } as any);
                  });
                });

                return (
                  <>
                    <div className="block lg:hidden w-full px-2">
                      {renderMobileOrg()}
                    </div>
                    <div className="hidden lg:block w-full overflow-x-auto pb-6">
                      <div className="flex justify-center min-w-max mx-auto px-4">
                        <svg
                          width={svgW}
                          height={svgH}
                          viewBox={`0 0 ${svgW} ${svgH}`}
                          className="block mx-auto"
                          style={{ maxWidth: `${svgW}px`, width: '100%', maxHeight: '80vh' }}
                        >
                          {/* Connection lines DAG */}
                          {drawnLines.map((l: any, i) => (
                            <path
                              key={`line-${i}`}
                              d={`M${l.x1},${l.y1} V${l.midY} H${l.x2} V${l.y2}`}
                              fill="none"
                              stroke="#cbd5e1"
                              strokeWidth="2.5"
                              strokeLinejoin="round"
                            />
                          ))}
                          {/* Node boxes */}
                          {Array.from(positioned.values()).map(({ x, y, node: b }) => (
                            <foreignObject key={b.id} x={x} y={y} width={NODE_W} height={NODE_H}>
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
                  <div className="aspect-[4/3] sm:aspect-video bg-muted relative overflow-hidden">
                    <ImageWithFallback
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg sm:text-xl font-bold mb-1 truncate">{member.name}</h3>
                    <div className="text-primary font-semibold mb-3 text-sm sm:text-base truncate">{member.role}</div>
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
