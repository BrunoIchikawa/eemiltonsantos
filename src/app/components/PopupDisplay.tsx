import { useState, useEffect } from 'react';
import { useSiteData } from '../context/SiteContext';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function PopupDisplay() {
  const { data } = useSiteData();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Filtering active popups
  const activePopups = data.popups ? data.popups.filter(p => p.active) : [];
  
  // Logic to show popup
  const currentPopup = activePopups[currentIndex];
  
  // Reset index if popups change significantly
  useEffect(() => {
     if (currentIndex >= activePopups.length && activePopups.length > 0) {
       setCurrentIndex(0);
     }
  }, [activePopups.length]);

  if (!currentPopup) return null;

  const isImage = currentPopup.type === 'image' && currentPopup.imageUrl;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
        <motion.div 
          key={currentPopup.id}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`relative w-full ${
            isImage 
              ? 'max-w-5xl flex flex-col items-center' // Imagem: Sem overflow-hidden, sem fundo
              : 'max-w-lg bg-white shadow-2xl rounded-xl border-t-4 border-[#004E75] overflow-hidden' // Texto: Card padrão
          }`}
        >
          {isImage ? (
            // Layout de Imagem (Banner/Folder)
            <div className="relative w-full flex flex-col items-center group">
              {/* Botão de Fechar com Safe Area */}
              <button 
                onClick={() => setCurrentIndex(prev => prev + 1)} 
                className="absolute right-3 md:-right-12 md:top-0 bg-black/60 hover:bg-black/80 md:bg-white/10 md:hover:bg-white/20 text-white p-2.5 md:p-2 rounded-full backdrop-blur-md transition-all z-20 border border-white/20 shadow-lg"
                style={{ top: 'max(0.75rem, env(safe-area-inset-top))' }}
                title="Fechar"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="w-full flex items-center justify-center bg-black/40 rounded-lg shadow-2xl relative overflow-hidden aspect-video md:aspect-auto md:h-[70vh]">
                <img 
                  src={currentPopup.imageUrl} 
                  alt={currentPopup.title} 
                  className="absolute inset-0 w-full h-full object-cover blur-xl opacity-50 scale-125"
                  aria-hidden="true"
                />
                <img 
                  src={currentPopup.imageUrl} 
                  alt={currentPopup.title} 
                  className="w-full h-full object-contain relative z-10" 
                />
              </div>
              
              {/* Contador (Opcional) */}
              {activePopups.length > 1 && (
                 <div className="mt-4 bg-black/50 text-white px-4 py-1.5 rounded-full text-sm backdrop-blur-md border border-white/10">
                   Aviso {currentIndex + 1} de {activePopups.length}
                 </div>
              )}
            </div>
          ) : (
            // Layout de Texto (Padrão)
            <div className="bg-white">
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                   <div className={`p-3 rounded-full shrink-0 ${currentPopup.priority === 'Alta' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-[#004E75]'}`}>
                      <AlertCircle className="w-6 h-6" />
                   </div>
                   <div className="flex-1">
                     <h3 className="text-xl font-bold text-gray-900 mb-1">{currentPopup.title}</h3>
                     {currentPopup.priority === 'Alta' && (
                       <span className="inline-block px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded mb-2">IMPORTANTE</span>
                     )}
                   </div>
                   <button 
                     onClick={() => setCurrentIndex(prev => prev + 1)} 
                     className="text-gray-400 hover:text-gray-600 transition-colors -mt-2 -mr-2 p-2 hover:bg-gray-100 rounded-full"
                   >
                     <X className="w-5 h-5" />
                   </button>
                </div>
                
                <div className="text-gray-600 leading-relaxed mb-8 whitespace-pre-wrap max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar break-words">
                  {currentPopup.message}
                </div>
    
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                   <div className="text-xs text-gray-400 font-medium">
                     {activePopups.length > 1 ? `Aviso ${currentIndex + 1} de ${activePopups.length}` : 'Aviso do Sistema'}
                   </div>
                  <button 
                    onClick={() => setCurrentIndex(prev => prev + 1)}
                    className="bg-[#004E75] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#003B5C] transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {currentIndex < activePopups.length - 1 ? 'Próximo' : 'Entendi e Fechar'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
