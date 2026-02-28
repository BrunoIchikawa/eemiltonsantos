import { useState } from 'react';
import { useSiteData } from '../../context/SiteContext';
import { Upload, X, Search, Image as ImageIcon } from 'lucide-react';
import { ImageWithFallback } from '../../components/ui_elements/ImageWithFallback';
import { toast } from 'sonner';

interface MediaPickerProps {
    onSelect: (url: string) => void;
    onClose: () => void;
}

export function MediaPicker({ onSelect, onClose }: MediaPickerProps) {
    const { data, uploadFile } = useSiteData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const allImages = data.media || [];

    const filteredItems = allImages.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*,video/mp4,video/webm';
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                setIsUploading(true);
                try {
                    const newMedia = await uploadFile(file);
                    if (newMedia) {
                        onSelect(newMedia.url);
                    }
                } catch (error: any) {
                    console.error("Upload failed in MediaPicker:", error);
                    toast.error(`Erro: ${error.message || "Falha ao subir a imagem"}`);
                } finally {
                    setIsUploading(false);
                    onClose(); // Auto-close modal after successful upload
                }
            }
        };
        input.click();
    };

    const getUsageLabel = (url: string) => {
        if (!data) return "Desconhecido";
        const usageList: string[] = [];

        if (data.home) {
            if (data.home.heroImage === url) usageList.push("Home (Hero)");
            if (data.home.schoolMenu?.imageUrl === url) usageList.push("Home (Cardápio)");
        }
        if (data.popups?.some(p => p.imageUrl === url)) usageList.push("Pop-ups");
        if (data.slides?.some(s => s.image === url)) usageList.push("Slides");
        if (data.team?.some(t => t.photo === url)) usageList.push("Equipe");
        if (data.about?.images?.includes(url)) usageList.push("Sobre (Galeria)");
        if (data.gallery?.some(g => g.coverImage === url || g.images?.includes(url))) usageList.push("Galeria (Álbuns)");
        if (data.projects?.some(p => p.image === url || p.gallery?.includes(url))) usageList.push("Projetos");
        if (data.awards?.some(a => a.image === url)) usageList.push("Prêmios");

        if (usageList.length === 0) return "Sem uso ativo no site";
        return "Usado em: " + Array.from(new Set(usageList)).join(', ');
    };

    return (
        <div className="fixed inset-0 z-[100] flex justify-center items-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Selecionar Mídia</h2>
                        <p className="text-sm text-gray-500">Escolha uma imagem da biblioteca ou envie uma nova</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar mídia salva..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7BA6]"
                        />
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#2E7BA6] text-white px-5 py-2 rounded-lg hover:bg-[#256285] transition-colors disabled:opacity-50"
                    >
                        {isUploading ? (
                            <span className="animate-pulse">Fazendo Upload...</span>
                        ) : (
                            <>
                                <Upload className="w-5 h-5" />
                                <span>Upload Direto</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Grid / Body */}
                <div className="p-4 overflow-y-auto flex-1 bg-gray-50/30">
                    {filteredItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                            <ImageIcon className="w-16 h-16 mb-4 text-gray-300" />
                            <p className="text-lg font-medium">Nenhuma mídia encontrada</p>
                            <p className="text-sm">Tente buscar por outro nome ou faça upload.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {filteredItems.map(item => {
                                const usageText = getUsageLabel(item.url);
                                const isUnused = usageText === "Sem uso ativo no site";

                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => {
                                            onSelect(item.url);
                                            onClose();
                                        }}
                                        className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-[#2E7BA6] transition-all duration-200 bg-gray-100 shadow-sm hover:shadow-md"
                                        title={item.name + " | " + usageText}
                                    >
                                        <ImageWithFallback src={item.url} alt={item.name} className="w-full h-full object-cover" />

                                        {/* Status Badge */}
                                        <div className="absolute top-2 left-2 right-2 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded shadow text-white ${isUnused ? 'bg-gray-500/90' : 'bg-green-600/90'}`}>
                                                {isUnused ? 'Não em uso' : 'Em Uso'}
                                            </span>
                                        </div>

                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end h-full">
                                            <p className="text-white text-xs font-semibold truncate mb-1">{item.name}</p>
                                            <p className="text-gray-300 text-[10px] leading-tight line-clamp-2">{usageText}</p>
                                            <div className="mt-3 flex justify-center">
                                                <span className="bg-[#2E7BA6] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                                    Selecionar
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
