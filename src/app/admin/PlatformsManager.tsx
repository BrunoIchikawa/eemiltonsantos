import { useState } from 'react';
import { useSiteData } from '../context/SiteContext';
import { Platform } from '../../types';
import { Plus, Edit2, Trash2, Save, X, Link as LinkIcon, ExternalLink, Monitor } from 'lucide-react';
import { toast } from 'sonner';

export function PlatformsManager() {
  const { data, updatePlatforms } = useSiteData();
  const [platforms, setPlatforms] = useState(data.platforms);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Platform | null>(null);

  const handleEdit = (item: Platform) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingItem({
      id: Date.now().toString(),
      name: '',
      description: '',
      url: '',
      category: 'Aluno',
      active: true
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta plataforma?')) {
      const updated = platforms.filter(p => String(p.id) !== String(id));
      setPlatforms(updated);
      updatePlatforms(updated);
      toast.success('Plataforma removida com sucesso!');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    let updated;
    if (platforms.find(p => p.id === editingItem.id)) {
      updated = platforms.map(p => p.id === editingItem.id ? editingItem : p);
    } else {
      updated = [...platforms, editingItem];
    }

    setPlatforms(updated);
    updatePlatforms(updated);
    setIsModalOpen(false);
    toast.success('Plataformas atualizadas com sucesso!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Plataformas</h1>
          <p className="text-gray-500">Adicione e edite os links úteis do site.</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-[#4A8B63] text-white px-5 py-2.5 rounded-xl hover:bg-[#3d7452] transition-all shadow-md hover:shadow-lg font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Nova Plataforma</span>
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {platforms.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Monitor className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Nenhuma plataforma cadastrada</h3>
            <p className="text-gray-500 mt-1">Clique em "Nova Plataforma" para começar.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {platforms.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-gray-900 text-lg truncate">{item.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${
                      item.category === 'Aluno' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      item.category === 'Professor' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                      'bg-orange-50 text-orange-700 border-orange-200'
                    }`}>
                      {item.category}
                    </span>
                    {!item.active && (
                      <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-xs">Inativo</span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm mb-2">{item.description}</p>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[#2E7BA6] text-xs flex items-center gap-1 hover:underline">
                    {item.url} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button 
                    onClick={() => handleEdit(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                    title="Editar"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                    title="Excluir"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Edição */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {platforms.find(p => p.id === editingItem.id) ? 'Editar Plataforma' : 'Nova Plataforma'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Plataforma</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7BA6] focus:border-transparent transition-shadow"
                  placeholder="Ex: Secretaria Digital"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Curta</label>
                <input
                  type="text"
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7BA6] focus:border-transparent transition-shadow"
                  placeholder="Ex: Consulta de notas e faltas"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link de Acesso (URL)</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    value={editingItem.url}
                    onChange={(e) => setEditingItem({...editingItem, url: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7BA6] focus:border-transparent transition-shadow font-mono text-sm"
                    placeholder="https://..."
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({...editingItem, category: e.target.value as any})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7BA6] bg-white"
                  >
                    <option value="Aluno">Aluno</option>
                    <option value="Professor">Professor</option>
                    <option value="Gestão">Gestão</option>
                  </select>
                </div>
                
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editingItem.active}
                      onChange={(e) => setEditingItem({...editingItem, active: e.target.checked})}
                      className="w-5 h-5 text-[#2E7BA6] rounded focus:ring-[#2E7BA6] border-gray-300"
                    />
                    <span className="text-gray-700 font-medium">Ativo no site</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#2E7BA6] text-white hover:bg-[#256285] rounded-lg transition-colors font-bold shadow-md"
                >
                  <Save className="w-4 h-4" />
                  Salvar Plataforma
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
