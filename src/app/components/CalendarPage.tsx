import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, ChevronLeft, ChevronRight, Users, User, Info, X } from 'lucide-react';
import { useSiteData, Event } from '../context/SiteContext';

export function CalendarPage() {
  const { data } = useSiteData();
  const { events } = data;

  // Estado para filtros
  const [filter, setFilter] = useState('Todos'); // Todos, Alunos, Pais, Geral
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDateEvents, setSelectedDateEvents] = useState<{ date: string, events: Event[] } | null>(null);

  // Filter Logic
  const activeEvents = events.filter((e: Event) => {
    if (!e.active) return false;
    if (filter === 'Todos') return true;
    if (filter === 'Alunos') return e.audience === 'Alunos';
    if (filter === 'Pais') return e.audience === 'Pais';
    if (filter === 'Geral') return e.audience === 'Geral' || !e.audience;
    return true;
  });

  // Helper: Get Days Remaining
  const getDaysRemaining = (dateStr: string) => {
    const parts = dateStr.split('/');
    if (parts.length !== 3) return 0;
    const eventDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Helper: Get Color based on Audience
  const getEventColor = (audience?: string) => {
    switch (audience) {
      case 'Alunos': return 'bg-blue-500';
      case 'Pais': return 'bg-emerald-600';
      case 'Professores': return 'bg-purple-600';
      case 'Comunidade': return 'bg-orange-500';
      default: return 'bg-[#00A650]'; // Default Green
    }
  };

  const getEventColorText = (audience?: string) => {
    switch (audience) {
      case 'Alunos': return 'text-blue-600 bg-blue-50';
      case 'Pais': return 'text-emerald-700 bg-emerald-50';
      case 'Professores': return 'text-purple-700 bg-purple-50';
      case 'Comunidade': return 'text-orange-700 bg-orange-50';
      default: return 'text-[#00A650] bg-green-50';
    }
  };

  // Lógica de calendário
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay(); // 0 = Dom

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${String(day).padStart(2, '0')}/${String(currentMonth.getMonth() + 1).padStart(2, '0')}/${currentMonth.getFullYear()}`;
    const eventsOnDay = activeEvents.filter((e: Event) => e.date === dateStr);

    if (eventsOnDay.length > 0) {
      setSelectedDateEvents({ date: dateStr, events: eventsOnDay });
    }
  };

  const renderCalendarGrid = () => {
    const days = [];
    // Dias vazios antes do início do mês
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-muted/30 border border-border"></div>);
    }
    // Dias do mês
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = new Date().getDate() === i && new Date().getMonth() === currentMonth.getMonth() && new Date().getFullYear() === currentMonth.getFullYear();

      const dateStr = `${String(i).padStart(2, '0')}/${String(currentMonth.getMonth() + 1).padStart(2, '0')}/${currentMonth.getFullYear()}`;

      const dayEvents = activeEvents.filter((e: Event) => e.date === dateStr);
      const hasEvent = dayEvents.length > 0;

      days.push(
        <div
          key={i}
          onClick={() => handleDayClick(i)}
          className={`
            h-24 p-2 border border-border relative transition-colors
            ${isToday ? 'bg-primary/5' : 'bg-white'}
            ${hasEvent ? 'cursor-pointer hover:bg-gray-50' : ''}
          `}
        >
          <span className={`text-sm font-medium ${isToday ? 'text-primary' : 'text-gray-700'}`}>{i}</span>

          {/* Render dots for events */}
          <div className="flex gap-1 mt-1 flex-wrap content-start">
            {dayEvents.map((evt: Event, idx: number) => (
              <div
                key={evt.id}
                className={`w-2 h-2 rounded-full ${getEventColor(evt.audience)}`}
                title={evt.title}
              />
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  // Sort upcoming events by date
  const upcomingEvents = activeEvents
    .filter((e: Event) => getDaysRemaining(e.date) >= 0)
    .sort((a: Event, b: Event) => getDaysRemaining(a.date) - getDaysRemaining(b.date))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-muted/30 pb-16">
      {/* Standard Header */}
      <section className="bg-gradient-to-r from-[#00A650] to-[#609BA2] text-white py-12 sm:py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Calendário Escolar 2026</h1>
          <p className="text-lg sm:text-xl opacity-90 mx-auto text-[25px] text-center">
            Acompanhe as datas importantes, eventos, reuniões e feriados do ano letivo
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">

        {/* 2. Próximos Eventos */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-primary" />
            Próximos Eventos
          </h2>

          <div className="space-y-4">
            {upcomingEvents.length === 0 ? (
              <p className="text-muted-foreground italic">Nenhum evento próximo encontrado.</p>
            ) : (
              upcomingEvents.map((event: Event) => {
                const daysLeft = getDaysRemaining(event.date);
                const [d, m] = event.date.split('/');
                const monthName = monthNames[parseInt(m) - 1].substring(0, 3).toLowerCase();

                return (
                  <div key={event.id} className="bg-white rounded-xl border border-border p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row gap-5 hover:shadow-md transition-shadow">
                    {/* Date Box */}
                    <div className={`${getEventColor(event.audience)} w-full sm:w-24 rounded-lg flex flex-col items-center justify-center text-white py-3 shrink-0`}>
                      <span className="text-xs font-medium uppercase opacity-90">
                        {daysLeft === 0 ? 'Hoje' : daysLeft === 1 ? 'Amanhã' : `Em ${daysLeft} dias`}
                      </span>
                      <span className="text-xl font-bold">{d} de {monthName}</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-foreground">{event.title}</h3>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${getEventColorText(event.audience)}`}>
                              {event.audience || 'Geral'}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-sm mb-2">{event.description}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mb-3">
                            <Clock className="w-3 h-3" />
                            <span>
                              Evento Escolar
                              {event.startTime && ` • ${event.startTime}`}
                              {event.endTime && event.startTime ? ` às ${event.endTime}` : ''}
                              {event.endTime && !event.startTime ? ` • Término: ${event.endTime}` : ''}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Observação Box */}
                      <div className="bg-muted rounded-lg p-3 text-sm text-muted-foreground flex items-start gap-2">
                        <span className="font-bold text-foreground">Categoria:</span>
                        <span>{event.category}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 3. Filtrar por Público */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Filtrar por Público
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Todos', value: 'Todos' },
              { label: 'Para Alunos', value: 'Alunos' },
              { label: 'Para Pais', value: 'Pais' },
              { label: 'Geral', value: 'Geral' }
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${filter === item.value
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white text-muted-foreground border-border hover:bg-muted'
                  }`}
              >
                <span className="flex items-center gap-2">
                  {item.value === 'Alunos' && <User className="w-3 h-3" />}
                  {item.value === 'Pais' && <Users className="w-3 h-3" />}
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Calendário Mensal */}
        <div className="mb-12 relative">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-primary" />
            Calendário Mensal
          </h2>

          <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
            {/* Header Calendário */}
            <div className="bg-muted/50 border-b border-border p-4 flex items-center justify-between">
              <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-200 rounded text-muted-foreground"><ChevronLeft className="w-5 h-5" /></button>
              <h3 className="font-bold text-foreground text-lg">{monthNames[currentMonth.getMonth()]} de {currentMonth.getFullYear()}</h3>
              <button onClick={handleNextMonth} className="p-1 hover:bg-gray-200 rounded text-muted-foreground"><ChevronRight className="w-5 h-5" /></button>
            </div>

            {/* Dias da Semana */}
            <div className="grid grid-cols-7 border-b border-border bg-muted/30">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                <div key={day} className="py-2 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>

            {/* Grid de Dias */}
            <div className="grid grid-cols-7 bg-muted gap-px border-b border-border">
              {renderCalendarGrid()}
            </div>

            {/* Legenda */}
            <div className="p-4 bg-white flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="font-bold">Legenda:</span>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> Alunos</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-600 rounded-full"></div> Pais</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-purple-600 rounded-full"></div> Professores</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-orange-500 rounded-full"></div> Comunidade</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-[#00A650] rounded-full"></div> Geral</div>
            </div>
          </div>
        </div>

        {/* Modal de Detalhes do Dia */}
        {selectedDateEvents && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
              <div className="bg-primary p-4 flex justify-between items-center text-white">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Eventos em {selectedDateEvents.date}
                </h3>
                <button
                  onClick={() => setSelectedDateEvents(null)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                {selectedDateEvents.events.map(event => (
                  <div key={event.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${getEventColorText(event.audience)}`}>
                        {event.audience || 'Geral'}
                      </span>
                      <h4 className="font-bold text-gray-900">{event.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                    <div className="text-xs text-gray-400 bg-gray-50 p-2 rounded">
                      <strong>Categoria:</strong> {event.category}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-gray-50 border-t border-border flex justify-end">
                <button
                  onClick={() => setSelectedDateEvents(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium text-sm"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
