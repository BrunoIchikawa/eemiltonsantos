import { useState, useEffect } from 'react';
import { useSiteData } from '../../context/SiteContext';
import { LayoutTemplate } from 'lucide-react';

interface PageBannerEditorProps {
  pageKey: string;
  label: string;
}

export function PageBannerEditor({ pageKey, label }: PageBannerEditorProps) {
  const { data, updateGeneral } = useSiteData();

  const current = data.general.pageBanners?.[pageKey] || { title: '', subtitle: '' };
  const [title, setTitle] = useState(current.title);
  const [subtitle, setSubtitle] = useState(current.subtitle);

  // Sync with context if data changes externally
  useEffect(() => {
    const updated = data.general.pageBanners?.[pageKey];
    if (updated) {
      setTitle(updated.title);
      setSubtitle(updated.subtitle);
    }
  }, [data.general.pageBanners, pageKey]);

  const handleSave = () => {
    const updatedBanners = {
      ...(data.general.pageBanners || {}),
      [pageKey]: { title, subtitle },
    };
    updateGeneral({ pageBanners: updatedBanners });
  };

  const hasChanges =
    title !== (data.general.pageBanners?.[pageKey]?.title || '') ||
    subtitle !== (data.general.pageBanners?.[pageKey]?.subtitle || '');

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <LayoutTemplate className="w-5 h-5 text-[#2E7BA6]" />
        Faixa da Página — {label}
      </h2>
      <p className="text-xs text-gray-400 mb-4">
        Defina o título e subtítulo exibidos no banner superior da página <strong>{label}</strong>.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7BA6]"
            placeholder={`Ex: ${label}`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7BA6]"
            placeholder="Breve descrição da página"
          />
        </div>
      </div>
      {hasChanges && (
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#4A8B63] text-white rounded-lg hover:bg-[#3d7452] transition-colors text-sm font-bold shadow-sm"
          >
            Salvar Faixa
          </button>
        </div>
      )}
    </div>
  );
}
