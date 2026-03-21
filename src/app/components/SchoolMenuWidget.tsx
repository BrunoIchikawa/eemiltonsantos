import { useState } from 'react';
import { useSiteData } from '../context/SiteContext';
import { Utensils, Calendar, X, ZoomIn, FileText, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function SchoolMenuWidget() {
  const { data } = useSiteData();
  const menu = data.home.schoolMenu;
  const [isOpen, setIsOpen] = useState(false);

  if (!menu || !menu.enabled) return null;

  // Determine current day
  const daysMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayLabels: Record<string, string> = {
    monday: 'Segunda-feira',
    tuesday: 'Terça-feira',
    wednesday: 'Quarta-feira',
    thursday: 'Quinta-feira',
    friday: 'Sexta-feira',
    saturday: 'Sábado',
    sunday: 'Domingo'
  };

  const currentDayIndex = new Date().getDay();
  const currentDayKey = daysMap[currentDayIndex];
  const isWeekend = currentDayIndex === 0 || currentDayIndex === 6;

  // Get today's content or fallback
  let displayTitle = isWeekend ? 'Cardápio da Semana' : `Cardápio de Hoje (${dayLabels[currentDayKey]})`;
  let displayContent = '';

  if (isWeekend) {
    displayContent = 'Bom descanso! Confira o cardápio completo da semana clicando no botão abaixo.';
  } else {
    // Access nested weekMenu safely
    const weekMenu = menu.weekMenu as any;
    displayContent = weekMenu?.[currentDayKey] || 'Cardápio não informado para hoje.';
  }

  return (
    <>
      {/* Widget Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden hover:shadow-md transition-all h-full flex flex-col"
      >
        <div className="bg-gradient-to-r from-orange-50 to-white p-4 border-b border-orange-100 flex items-center gap-3">
          <div className="p-2.5 bg-white text-orange-500 rounded-xl shadow-sm border border-orange-100">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 leading-tight">Merenda Escolar</h3>
            <p className="text-xs text-orange-600 font-medium flex items-center gap-1">
               {!isWeekend && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
               {isWeekend ? 'Semana Encerrada' : 'Servido Hoje'}
            </p>
          </div>
        </div>
        
        <div className="p-5 flex-1 flex flex-col">
           <h4 className="font-bold text-gray-700 mb-2 text-sm flex items-center gap-2">
             <Calendar className="w-4 h-4 text-gray-400" />
             {displayTitle}
           </h4>
           
           <div className="text-sm text-gray-600 mb-4 whitespace-pre-line flex-1 min-h-[60px] bg-orange-50/50 p-3 rounded-lg border border-orange-100/50">
             {displayContent}
           </div>
           
           <div className="flex items-center gap-1 text-xs text-gray-400 mb-4 pt-2 border-t border-gray-50">
             <Clock className="w-3 h-3" /> 
             <span>Atualizado em: {menu.updatedAt}</span>
           </div>

           <button 
             onClick={() => setIsOpen(true)}
             className="w-full py-2.5 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition-all shadow-orange-200 shadow-lg flex items-center justify-center gap-2 group transform active:scale-95"
           >
             <ZoomIn className="w-4 h-4 group-hover:scale-110 transition-transform" /> 
             Ver Cardápio Completo
           </button>
        </div>
      </motion.div>

      {/* Modal Fullscreen */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="bg-white rounded-2xl w-full max-w-5xl overflow-hidden flex flex-col relative shadow-2xl"
               style={{ maxHeight: 'min(90vh, calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 2rem))' }}
             >
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                        <Utensils className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{menu.title}</h3>
                        <p className="text-xs text-gray-500">Semana de {menu.updatedAt}</p>
                      </div>
                   </div>
                   <button 
                     onClick={() => setIsOpen(false)}
                     className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                   >
                     <X className="w-6 h-6" />
                   </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-gray-100 flex flex-col items-center">
                   {/* Se tiver imagem, mostra a imagem */}
                   {menu.imageUrl ? (
                     <img 
                       src={menu.imageUrl} 
                       alt="Cardápio Escolar Completo" 
                       className="w-full h-auto object-contain max-h-[70vh] rounded-lg shadow-sm bg-white" 
                     />
                   ) : (
                     // Se NÃO tiver imagem, mostra a lista completa dos dias
                     <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map(day => {
                           const content = (menu.weekMenu as any)?.[day];
                           if (!content) return null;
                           return (
                             <div key={day} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                               <h4 className="font-bold text-orange-600 mb-2 uppercase text-xs tracking-wider border-b border-orange-100 pb-1">
                                 {dayLabels[day]}
                               </h4>
                               <p className="text-gray-700 whitespace-pre-wrap text-sm">{content}</p>
                             </div>
                           );
                        })}
                        <div className="md:col-span-2 text-center text-gray-400 text-sm mt-4">
                          <p>Nenhuma imagem do cardápio foi anexada.</p>
                        </div>
                     </div>
                   )}
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
