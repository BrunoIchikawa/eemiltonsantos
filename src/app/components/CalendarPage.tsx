import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Users, User, Info, X, MapPin } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';
import { Event } from '../../types';

export function CalendarPage() {
  const { data } = useSiteData();
  const { events } = data;

  // Estado para filtros e navegação
  const [filter, setFilter] = useState('Todos');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDateEvents, setSelectedDateEvents] = useState<{ date: string, events: Event[] } | null>(null);

  // Filtra eventos ativos e pelo público
  const activeEvents = events.filter((e: Event) => {
    if (!e.active) return false;
    if (filter === 'Todos') return true;
    if (filter === 'Alunos') return e.audience === 'Alunos';
    if (filter === 'Pais') return e.audience === 'Pais';
    if (filter === 'Geral') return e.audience === 'Geral' || !e.audience;
    return true;
  });

  const getDaysRemaining = (dateStr: string) => {
    const parts = dateStr.split('/');
    if (parts.length !== 3) return -1;
    const eventDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = eventDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Cores Temáticas Modificadas para um visual limpo
  const getEventThemes = (audience?: string) => {
    switch (audience) {
      case 'Alunos': return { bg: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
      case 'Pais': return { bg: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
      case 'Professores': return { bg: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' };
      case 'Comunidade': return { bg: 'bg-orange-500', light: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' };
      default: return { bg: 'bg-[#00A650]', light: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
    }
  };

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const parseDate = (d: string) => {
    const p = d.split('/');
    return new Date(`${p[2]}-${p[1]}-${p[0]}T00:00:00`);
  };

  const handleDayClick = (dayDate: Date, dayEvents: Event[]) => {
    if (dayEvents.length > 0) {
      const dateStr = `${String(dayDate.getDate()).padStart(2, '0')}/${String(dayDate.getMonth() + 1).padStart(2, '0')}/${dayDate.getFullYear()}`;
      setSelectedDateEvents({ date: dateStr, events: dayEvents });
    }
  };

  const renderCalendarGrid = () => {
    const days = [];
    // Dias vazios antes do dia 1
    for (let i = 0; i < firstDayOfMonth; i++) {
       days.push(<div key={`empty-${i}`} className="min-h-[100px] sm:min-h-[120px] bg-gray-50/50 border-r border-b border-gray-100"></div>);
    }
    
    // Dias reais
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      const isToday = new Date().getDate() === i && new Date().getMonth() === currentMonth.getMonth() && new Date().getFullYear() === currentMonth.getFullYear();

      const dayEvents = activeEvents.filter((e: Event) => {
        const startDate = parseDate(e.date);
        const endDate = e.endDate ? parseDate(e.endDate) : startDate;
        return dayDate >= startDate && dayDate <= endDate;
      });

      const hasEvent = dayEvents.length > 0;

      days.push(
        <div
          key={i}
          onClick={() => handleDayClick(dayDate, dayEvents)}
          className={`
            min-h-[100px] sm:min-h-[120px] p-1.5 sm:p-2 border-r border-b border-gray-200 relative transition-all group overflow-hidden flex flex-col gap-1
            ${isToday ? 'bg-blue-50/20' : 'bg-white'}
            ${hasEvent ? 'cursor-pointer hover:bg-gray-50 hover:shadow-inner' : ''}
          `}
        >
          {/* Cabeçalho do Dia */}
          <div className="flex justify-between items-start">
            <span className={`
              inline-flex items-center justify-center w-7 h-7 text-xs sm:text-sm font-bold rounded-full
              ${isToday ? 'bg-[#00A650] text-white shadow-sm' : 'text-gray-700 group-hover:bg-gray-100'}
            `}>
              {i}
            </span>
          </div>

          {/* Chips de Eventos */}
          <div className="flex-1 flex flex-col gap-1 overflow-hidden">
            {dayEvents.slice(0, 3).map((evt: Event) => {
              const theme = getEventThemes(evt.audience);
              return (
                <div 
                  key={evt.id} 
                  title={evt.title} 
                  className={`text-[9px] sm:text-[10px] leading-tight px-1.5 py-1 rounded truncate border font-semibold transition-colors ${theme.light} ${theme.text} ${theme.border} group-hover:brightness-95`}
                >
                  {evt.title}
                </div>
              );
            })}
            {dayEvents.length > 3 && (
              <div className="text-[10px] text-gray-400 font-bold px-1 mt-0.5">
                +{dayEvents.length - 3} mais
              </div>
            )}
          </div>
        </div>
      );
    }
    return days;
  };

  const upcomingEvents = activeEvents
    .filter((e: Event) => getDaysRemaining(e.date) >= 0)
    .sort((a: Event, b: Event) => getDaysRemaining(a.date) - getDaysRemaining(b.date))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-16">
      {/* HEADER PRINCIPAL */}
      <section className="bg-gradient-to-r from-[#00A650] to-[#609BA2] text-white py-12 sm:py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">{data.general.pageBanners?.eventos?.title || 'Calendário Escolar'}</h1>
          <p className="text-lg sm:text-xl opacity-90 mx-auto max-w-2xl text-center">
            {data.general.pageBanners?.eventos?.subtitle || 'Acompanhe as datas importantes, eventos, reuniões e feriados do ano letivo.'}
          </p>
        </div>
      </section>

      {/* CONTEÚDO */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* COLUNA ESQUERDA: Filtros & Próximos Eventos */}
            <div className="lg:col-span-4 space-y-6">
               
               {/* Box Filtros */}
               <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
                 <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                   <Users className="w-5 h-5 text-[#00A650]" />
                   Filtrar por Público
                 </h2>
                 <div className="grid grid-cols-2 gap-2">
                    {['Todos', ...(data.general.dropdownOptions?.audienceCategories || ['Alunos', 'Pais e Responsáveis', 'Professores', 'Comunidade', 'Geral'])].map(category => {
                      const Icon = category === 'Todos' ? Users : category === 'Alunos' ? User : category === 'Geral' ? CalendarIcon : Users;
                      const isActive = filter === category;
                      return (
                        <button
                          key={category}
                          onClick={() => setFilter(category)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border truncate ${
                            isActive 
                              ? 'bg-[#00A650] text-white border-[#00A650] shadow-md transform scale-[1.02]' 
                              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                          }`}
                        >
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                          <span className="truncate">{category}</span>
                        </button>
                      );
                    })}
                 </div>
               </div>

               {/* Box Próximos Eventos */}
               <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
                 <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                   <Clock className="w-5 h-5 text-[#00A650]" />
                   Próximos Eventos
                 </h2>
                 
                 <div className="space-y-4">
                   {upcomingEvents.length === 0 ? (
                     <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-500 text-sm">Nenhum evento próximo programado.</p>
                     </div>
                   ) : (
                     upcomingEvents.map(event => {
                       const daysLeft = getDaysRemaining(event.date);
                       const theme = getEventThemes(event.audience);
                       const [d, m] = event.date.split('/');
                       const monthName = monthNames[parseInt(m) - 1].substring(0, 3).toLowerCase();
                       
                       return (
                         <div key={event.id} className="group flex gap-4 bg-gray-50 hover:bg-white rounded-xl p-3 border border-transparent hover:border-gray-200 hover:shadow-md transition-all">
                           {/* Data Info */}
                           <div className={`shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center border shadow-sm ${theme.light} ${theme.border} ${theme.text}`}>
                             <span className="text-2xl font-black leading-none">{d}</span>
                             <span className="text-[10px] font-bold uppercase">{monthName}</span>
                           </div>
                           
                           {/* Texto Info */}
                           <div className="flex-1 min-w-0 flex flex-col justify-center">
                             <div className="flex justify-between items-start gap-2 mb-1">
                               <h4 className="font-bold text-gray-900 text-sm truncate group-hover:text-[#00A650] transition-colors">
                                 {event.title}
                               </h4>
                               <span className={`shrink-0 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide border ${theme.light} ${theme.border} ${theme.text}`}>
                                 {event.audience || 'Geral'}
                               </span>
                             </div>
                             <p className="text-xs text-gray-500 font-medium truncate mb-1 flex items-center gap-1">
                               {daysLeft === 0 ? (
                                 <span className="text-red-600 font-bold">Hoje</span>
                               ) : daysLeft === 1 ? (
                                 <span className="text-orange-500 font-bold">Amanhã</span>
                               ) : (
                                 <span>Em {daysLeft} dias</span>
                               )}
                               {event.endDate && event.endDate !== event.date && ` • Até ${event.endDate.substring(0, 5)}`}
                             </p>
                             {(event.startTime || event.endTime) && (
                               <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-auto">
                                 <Clock className="w-3 h-3" />
                                 {event.startTime} {event.endTime ? `às ${event.endTime}` : ''}
                               </p>
                             )}
                           </div>
                         </div>
                       )
                     })
                   )}
                 </div>
               </div>

            </div>

            {/* COLUNA DIREITA: CALENDÁRIO MENSAL */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
               
               {/* Toolbar Calendário */}
               <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 bg-gray-50/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 text-[#2E7BA6] rounded-xl">
                      <CalendarIcon className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 capitalize" style={{ textTransform: 'capitalize' }}>
                      {monthNames[currentMonth.getMonth()].toLowerCase()} <span className="text-gray-400 font-medium">{currentMonth.getFullYear()}</span>
                    </h2>
                  </div>
                  
                  <div className="flex items-center gap-1 bg-white rounded-xl p-1 border border-gray-200 shadow-sm">
                    <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
                      <ChevronLeft className="w-5 h-5"/>
                    </button>
                    <button onClick={() => setCurrentMonth(new Date())} className="px-4 py-1.5 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      Hoje
                    </button>
                    <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
                      <ChevronRight className="w-5 h-5"/>
                    </button>
                  </div>
               </div>

               {/* Grid Headers */}
               <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                     <div key={day} className="py-3 text-center text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest">{day}</div>
                  ))}
               </div>

               {/* Grid Body */}
               <div className="grid grid-cols-7 bg-white">
                  {renderCalendarGrid()}
               </div>
               
               {/* Legenda Discreta */}
               <div className="bg-gray-50 p-4 border-t border-gray-200 flex flex-wrap justify-center sm:justify-start gap-4 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase">
                 <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-blue-500"></div> Alunos</div>
                 <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></div> Pais</div>
                 <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-purple-500"></div> Profs</div>
                 <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-orange-500"></div> Comu.</div>
                 <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-[#00A650]"></div> Geral</div>
               </div>

            </div>
         </div>
      </div>

      {/* Modal de Detalhes do Dia */}
      {selectedDateEvents && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-5 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-gray-400" />
                Eventos em {selectedDateEvents.date}
              </h3>
              <button
                onClick={() => setSelectedDateEvents(null)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5 bg-gray-50">
              {selectedDateEvents.events.map(event => {
                const theme = getEventThemes(event.audience);
                return (
                  <div key={event.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <h4 className="font-bold text-gray-900 text-lg leading-tight">{event.title}</h4>
                      <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${theme.light} ${theme.text}`}>
                        {event.audience || 'Geral'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4 whitespace-pre-wrap">{event.description}</p>
                    
                    <div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">
                          {event.date}
                          {event.endDate && event.endDate !== event.date && ` até ${event.endDate}`}
                        </span>
                      </div>
                      {(event.startTime || event.endTime) && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">
                            {event.startTime || ''} {event.endTime ? `às ${event.endTime}` : ''}
                          </span>
                        </div>
                      )}
                      {event.category && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <Info className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{event.category}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
