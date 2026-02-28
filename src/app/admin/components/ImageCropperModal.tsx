import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Crop, UploadCloud } from 'lucide-react';
import { getCroppedImg } from '../../../utils/cropImage';
import { toast } from 'sonner';

interface ImageCropperModalProps {
    imageSrc: string;
    onClose: () => void;
    onCropCompleteFinal: (croppedFile: File, deleteOriginal?: boolean) => Promise<void>;
    aspectRatio?: number; // Ex: 16/9, 1/1, etc.
}

export function ImageCropperModal({ imageSrc, onClose, onCropCompleteFinal, aspectRatio = 16 / 9 }: ImageCropperModalProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [deleteOriginal, setDeleteOriginal] = useState(true);

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleConfirmCrop = async () => {
        if (!croppedAreaPixels) return;

        try {
            setIsProcessing(true);
            const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);

            if (croppedFile) {
                await onCropCompleteFinal(croppedFile, deleteOriginal);
            } else {
                toast.error("Erro ao gerar o recorte da imagem.");
            }
        } catch (e) {
            console.error(e);
            toast.error("Processamento falhou.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col">
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                        <Crop className="w-5 h-5 text-[#2E7BA6]" />
                        Ajustar e Recortar Imagem
                    </h3>
                    <button
                        onClick={onClose}
                        disabled={isProcessing}
                        className="p-1 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Cropper Workspace */}
                <div className="relative w-full h-[50vh] sm:h-[60vh] bg-gray-900">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspectRatio}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                        objectFit="horizontal-cover"
                    />
                </div>

                {/* Controls Base */}
                <div className="p-4 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex flex-col w-full sm:w-1/2">
                        <label className="text-xs font-semibold text-gray-500 mb-1">Zoom ({Math.round(zoom * 100)}%)</label>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2E7BA6]"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" checked={deleteOriginal} onChange={e => setDeleteOriginal(e.target.checked)} className="w-4 h-4 text-[#2E7BA6] rounded border-gray-300 focus:ring-[#2E7BA6] cursor-pointer" />
                            <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 select-none">Excluir Original</span>
                        </label>
                        <div className="flex gap-2">
                            <button
                                onClick={onClose}
                                disabled={isProcessing}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmCrop}
                                disabled={isProcessing}
                                className="flex items-center justify-center gap-2 px-6 py-2 bg-[#2E7BA6] text-white rounded-lg hover:bg-[#246285] transition-colors font-bold shadow-md disabled:opacity-50"
                            >
                                {isProcessing ? (
                                    <>
                                        <UploadCloud className="w-4 h-4 animate-bounce" />
                                        Processando...
                                    </>
                                ) : (
                                    <>
                                        <Crop className="w-4 h-4" />
                                        Aplicar Recorte
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
