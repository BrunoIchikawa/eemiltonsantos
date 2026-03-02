import { useState, useEffect } from "react";
import { useSiteData } from "../../context/SiteContext";
import { Type, Save } from "lucide-react";

export function PageBannerEditor({ pageKey, label }: { pageKey: string; label: string }) {
  const { data, updateGeneral } = useSiteData();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  useEffect(() => {
    setTitle(data.general.pageBanners?.[pageKey]?.title || "");
    setSubtitle(data.general.pageBanners?.[pageKey]?.subtitle || "");
  }, [data.general.pageBanners, pageKey]);

  const handleSave = () => {
    updateGeneral({
      pageBanners: {
        ...data.general.pageBanners,
        [pageKey]: { title, subtitle }
      }
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Type className="w-5 h-5 text-[#2E7BA6]" />
            Faixa de Página (Banner)
          </h2>
          <p className="text-sm text-gray-500 mt-1">Texto exibido no topo da página {label}.</p>
        </div>
        <button
          onClick={handleSave}
          type="button"
          className="flex items-center gap-2 bg-[#2E7BA6] text-white px-4 py-2 rounded-lg hover:bg-[#25668a] transition-colors text-sm font-medium"
        >
          <Save className="w-4 h-4" />
          Salvar Faixa
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7BA6]"
            placeholder="Ex: Sobre a Escola"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
          <input
            type="text"
            value={subtitle}
            onChange={e => setSubtitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7BA6]"
            placeholder="Subtítulo opcional..."
          />
        </div>
      </div>
    </div>
  );
}
