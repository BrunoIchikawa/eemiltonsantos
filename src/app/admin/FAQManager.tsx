import { useState } from 'react';
import { useSiteData } from '../context/SiteContext';
import { FAQItem } from '../../types';
import { Plus, Edit2, Trash2, Save, X, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { useConfirm } from './components/ConfirmDialog';
import { PageBannerEditor } from './components/PageBannerEditor';

export function FAQManager() {
  const { data, updateFAQ } = useSiteData();
  const [faqItems, setFaqItems] = useState(data.faq);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FAQItem | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleEdit = (item: FAQItem) => {d
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingItem({
      id: Date.now().toString(),
      question: '',
      answer: '',
      category: 'Geral',
      active: true
    });
    setIsModalOpen(true);
  };

  const showConfirm = useConfirm();

  const handleDelete = async (id: string) => {
    const ok = await showConfirm({ message: 'Excluir esta pergunta?', variant: 'danger', confirmText: 'Excluir' });
    if (ok) {
      const updated = faqItems.filter(i => String(i.id) !== String(id));
      setFaqItems(updated);
      updateFAQ(updated);
      toast.success('Pergunta removida!');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    let updated;
    if (faqItems.find(i => i.id === editingItem.id)) {
      updated = faqItems.map(i => i.id === editingItem.id ? editingItem : i);
    } else {
      updated = [...faqItems, editingItem];
    }

    setFaqItems(updated);
    updateFAQ(updated);
    setIsModalOpen(false);
    toast.success('FAQ atualizado!');
  };

  return (
    <div className="space-y-6">
      <PageBannerEditor pageKey="faq" label="FAQ" />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Perguntas Frequentes (FAQ)</h1>
          <p className="text-gray-500">Gerencie as dúvidas comuns da comunidade escolar.</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-[#4A8B63] text-white px-4 py-2 rounded-lg hover:bg-[#3d7452] transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Nova Pergunta</span>
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm divide-y divide-gray-100">
        {faqItems.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Nenhuma pergunta cadastrada.</div>
        ) : (
          faqItems.map((item) => (
            <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-[#2E7BA6]" />
                      {item.question}
                    </h3>
                    {expandedId === item.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                  {expandedId === item.id && (
                    <p className="mt-2 text-sm text-gray-600 pl-6 border-l-2 border-[#2E7BA6]">
                      {item.answer}
                    </p>
                  )}
                  <div className="mt-2 pl-6">
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && editingItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {faqItems.find(i => i.id === editingItem.id) ? 'Editar Pergunta' : 'Nova Pergunta'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pergunta</label>
                <input
                  type="text"
                  value={editingItem.question}
                  onChange={(e) => setEditingItem({...editingItem, question: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7BA6]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resposta</label>
                <textarea
                  value={editingItem.answer}
                  onChange={(e) => setEditingItem({...editingItem, answer: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7BA6]"
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7BA6] bg-white"
                >
                  <option value="Geral">Geral</option>
                  <option value="Sala do Futuro">Sala do Futuro</option>
                  <option value="Matrícula">Matrícula</option>
                  <option value="Documentação">Documentação</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Alimentação">Alimentação</option>
                  <option value="Uniforme">Uniforme</option>
                  <option value="Pedagógico">Pedagógico</option>
                  <option value="Administrativo">Administrativo</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2E7BA6] text-white hover:bg-[#256285] rounded-lg transition-colors font-bold shadow-md"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
