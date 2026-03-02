import { useState } from 'react';
import { useSiteData } from '../context/SiteContext';
import { TeamMember } from '../../types';
import { Plus, Edit2, Trash2, Save, X, Upload, Crop } from 'lucide-react';
import { ImageWithFallback } from '../components/ui_elements/ImageWithFallback';
import { toast } from 'sonner';
import { MediaPicker } from './components/MediaPicker';
import { ImageCropperModal } from './components/ImageCropperModal';
import { useConfirm } from './components/ConfirmDialog';
import { PageBannerEditor } from './components/PageBannerEditor';
import { OrganogramEditor } from './components/OrganogramEditor';

// Inline helpers to avoid file issues if any
const formatPhone = (value: string) => {
  if (!value) return '';
  const numbers = value.replace(/\D/g, '');
  const limit = 11;
  const truncated = numbers.slice(0, limit);

  if (truncated.length > 10) {
    return truncated.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (truncated.length > 5) {
    return truncated.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  } else if (truncated.length > 2) {
    return truncated.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
  } else {
    return truncated;
  }
};

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export function TeamManager() {
  const { data, updateTeam } = useSiteData();
  const [members, setMembers] = useState(data.team);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const { uploadFile, deleteMedia, data: siteData } = useSiteData();

  const handleCropFinalize = async (croppedFile: File, deleteOriginal?: boolean) => {
    try {
      const novaMedia = await uploadFile(croppedFile);
      if (novaMedia && editingMember) {
        if (deleteOriginal && editingMember.photo) {
          const origItem = siteData.media.find(m => m.url === editingMember.photo);
          if (origItem) deleteMedia(origItem.id);
        }
        setEditingMember({ ...editingMember, photo: novaMedia.url });
        setShowCropper(false);
      }
    } catch {
      toast.error('Ocorreu um erro no upload da imagem cortada.');
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingMember({
      id: Date.now().toString(),
      name: '',
      role: '',
      photo: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?fit=crop&w=400&q=80', // Placeholder
      email: '',
      phone: '',
      description: ''
    });
    setIsModalOpen(true);
  };

  const showConfirm = useConfirm();

  const handleDelete = async (id: string) => {
    const ok = await showConfirm({ message: 'Tem certeza que deseja remover este membro da equipe?', variant: 'danger', confirmText: 'Remover' });
    if (ok) {
      const updated = members.filter(m => String(m.id) !== String(id));
      setMembers(updated);
      updateTeam(updated);
      toast.success('Membro removido com sucesso!');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    if (editingMember.email && !isValidEmail(editingMember.email)) {
      toast.error('Por favor, insira um e-mail válido.');
      return;
    }

    let updatedMembers;
    if (members.find(m => m.id === editingMember.id)) {
      // Edit existing
      updatedMembers = members.map(m => m.id === editingMember.id ? editingMember : m);
    } else {
      // Add new
      updatedMembers = [...members, editingMember];
    }

    setMembers(updatedMembers);
    updateTeam(updatedMembers);
    setIsModalOpen(false);
    toast.success('Equipe atualizada com sucesso!');
  };

  return (
    <div className="space-y-6">
      <PageBannerEditor pageKey="equipe" label="Equipe Gestora" />
      <OrganogramEditor />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Membros da Equipe</h1>
          <p className="text-gray-500">Gerencie os membros da direção e coordenação.</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-[#4A8B63] text-white px-4 py-2 rounded-lg hover:bg-[#3d7452] transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Membro</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div key={member.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="relative h-48 bg-gray-100">
              <ImageWithFallback
                src={member.photo}
                alt={member.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleEdit(member)}
                  className="p-2 bg-white/90 rounded-full text-blue-600 hover:text-blue-700 hover:bg-white transition-colors shadow-sm"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="p-2 bg-white/90 rounded-full text-red-600 hover:text-red-700 hover:bg-white transition-colors shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg text-gray-900">{member.name}</h3>
              <p className="text-[#2E7BA6] font-medium text-sm mb-2">{member.role}</p>
              <p className="text-gray-500 text-sm line-clamp-2 mb-4">{member.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Edição */}
      {isModalOpen && editingMember && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {members.find(m => m.id === editingMember.id) ? 'Editar Membro' : 'Novo Membro'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex gap-6 flex-col sm:flex-row">
                {/* Foto Preview */}
                <div className="w-full sm:w-1/3">
                  <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden relative group">
                    <ImageWithFallback
                      src={editingMember.photo}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    {editingMember.photo && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setEditingMember({ ...editingMember, photo: '' }); }}
                        className="absolute top-2 right-2 text-white bg-red-600/80 hover:bg-red-700 p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100 z-10"
                        title="Remover Foto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-3">
                      <button
                        type="button"
                        onClick={() => setShowMediaModal(true)}
                        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-colors text-sm font-medium"
                      >
                        <Upload className="w-4 h-4" /> Alterar Foto
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCropper(true)}
                        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-colors text-sm font-medium"
                      >
                        <Crop className="w-4 h-4" /> Recortar/Ajustar
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 text-center bg-blue-50/50 border border-blue-100 rounded-lg p-2">
                    <p className="text-xs font-semibold text-blue-800">Tamanho Recomendado</p>
                    <p className="text-xs text-blue-600">400x400 (Proporção 1:1)</p>
                  </div>
                </div>

                {/* Campos */}
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                    <input
                      type="text"
                      value={editingMember.name}
                      onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7BA6]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                    <input
                      type="text"
                      value={editingMember.role}
                      onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7BA6]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minibiografia</label>
                    <textarea
                      value={editingMember.description}
                      onChange={(e) => setEditingMember({ ...editingMember, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7BA6]"
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-[#2E7BA6] text-white hover:bg-[#256285] rounded-lg transition-colors font-bold shadow-md"
                >
                  <Save className="w-4 h-4" />
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMediaModal && (
        <MediaPicker
          onSelect={(url) => {
            if (editingMember) {
              setEditingMember({ ...editingMember, photo: url });
            }
            setShowMediaModal(false);
          }}
          onClose={() => setShowMediaModal(false)}
        />
      )}

      {showCropper && editingMember && (
        <ImageCropperModal
          imageSrc={editingMember.photo}
          aspectRatio={1} // 1:1 for team members
          onClose={() => setShowCropper(false)}
          onCropCompleteFinal={handleCropFinalize}
        />
      )}
    </div>
  );
}
