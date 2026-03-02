import { useState } from "react";
import { useSiteData } from "../../context/SiteContext";
import { Users, Plus, Trash2, Save } from "lucide-react";
import { useConfirm } from "./ConfirmDialog";

export function OrganogramEditor() {
  const { data, updateGeneral } = useSiteData();
  const [organogram, setOrganogram] = useState(data.general.organogram || []);

  const handleOrganogramChange = (index: number, field: 'role' | 'name' | 'parentId', value: string | null) => {
    const newOrg = [...organogram];
    newOrg[index] = { ...newOrg[index], [field]: value };
    setOrganogram(newOrg);
  };

  const addOrganogramBlock = () => {
    setOrganogram([...organogram, { id: Date.now().toString(), role: '', name: '', parentId: null }]);
  };

  const showConfirm = useConfirm();

  const removeOrganogramBlock = async (index: number) => {
    const ok = await showConfirm({ message: "Deseja realmente remover este bloco?", variant: 'danger', confirmText: 'Remover' });
    if (ok) {
      const removedId = organogram[index].id;
      const newOrg = [...organogram];
      newOrg.splice(index, 1);
      newOrg.forEach((item, i) => {
        if (item.parentId === removedId) {
          newOrg[i] = { ...item, parentId: null };
        }
      });
      setOrganogram(newOrg);
    }
  };

  const handleSave = () => {
    updateGeneral({ organogram });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#2E7BA6]" />
            Organograma da Instituição
          </h2>
          <p className="text-sm text-gray-500">Blocos de hierarquia exibidos na página da Equipe.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={addOrganogramBlock}
            className="flex items-center gap-2 bg-[#f0f9ff] text-[#2E7BA6] hover:bg-[#e0f2fe] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border border-[#bae6fd]"
          >
            <Plus className="w-4 h-4" />
            Add Cargo
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-[#2E7BA6] text-white px-4 py-2 rounded-lg hover:bg-[#25668a] transition-colors text-sm font-medium"
          >
            <Save className="w-4 h-4" />
            Salvar Organograma
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        {organogram.length === 0 ? (
            <div className="p-4 bg-gray-50 text-center rounded-lg text-gray-500 text-sm border border-gray-200">
              Nenhum bloco de organograma cadastrado.
            </div>
        ) : (
          organogram.map((block, index) => (
            <div key={block.id} className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center font-bold text-gray-400 text-xs shrink-0">
                {index + 1}
              </div>
              <div className="grid grid-cols-3 gap-4 flex-1">
                <div>
                  <input
                    type="text"
                    value={block.role}
                    onChange={(e) => handleOrganogramChange(index, 'role', e.target.value)}
                    placeholder="Cargo (ex: Diretor)"
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2E7BA6] bg-white"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={block.name}
                    onChange={(e) => handleOrganogramChange(index, 'name', e.target.value)}
                    placeholder="Nome (ex: João Silva)"
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2E7BA6] bg-white"
                  />
                </div>
                <div>
                  <select
                    value={block.parentId || ''}
                    onChange={(e) => handleOrganogramChange(index, 'parentId', e.target.value || null)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2E7BA6] bg-white"
                  >
                    <option value="">Abaixo de (Nenhum / Topo)</option>
                    {organogram.filter(b => b.id !== block.id).map(possibleParent => (
                      <option key={'parent-'+possibleParent.id} value={possibleParent.id}>
                        {possibleParent.role} ({possibleParent.name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeOrganogramBlock(index)}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                title="Remover"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
