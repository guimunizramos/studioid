
import React from 'react';
import { useData } from '../../services/dataContext';
import { TaskStatus, Priority } from '../../types';
import { Clock, AlertCircle, Calendar, CheckCircle2, ArrowRight, Sun, Moon, Sunrise } from 'lucide-react';

interface HomeViewProps {
    onTaskClick?: (task: any) => void;
    onChangeView: (view: string) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onTaskClick, onChangeView }) => {
  const { tasks, clients, config } = useData();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Bom dia', icon: <Sunrise size={32} /> };
    if (hour < 18) return { text: 'Boa tarde', icon: <Sun size={32} /> };
    return { text: 'Boa noite', icon: <Moon size={32} /> };
  };

  const greeting = getGreeting();
  const getLocalISODate = (date: Date) => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().split('T')[0];
  };
  const todayStr = getLocalISODate(new Date());

  const todayTasks = tasks.filter(t => t.deadline === todayStr && t.status !== TaskStatus.COMPLETED);
  const completedToday = tasks.filter(t => t.deadline === todayStr && t.status === TaskStatus.COMPLETED);
  const urgentTasks = tasks.filter(t => t.priority === Priority.URGENT && t.status !== TaskStatus.COMPLETED);
  const upcomingSchedule = todayTasks
    .filter(t => t.startTime)
    .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

  return (
    <div className="view-container h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-12">
        
        <div className="flex items-center space-x-6">
            <div className="p-5 bg-black dark:bg-white text-white dark:text-black rounded-3xl shadow-2xl">
                {greeting.icon}
            </div>
            <div>
                <h1 className="text-5xl font-black text-black dark:text-white tracking-tighter leading-none">
                  {greeting.text}, {config.visual.userName || config.visual.agencyName || 'Equipe'}.
                </h1>
                <p className="text-gray-500 font-medium text-xl mt-1 tracking-tight">O que vamos criar hoje?</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div 
                className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 cursor-pointer hover:border-black dark:hover:border-white transition-all group"
                onClick={() => onChangeView('agenda')}
            >
                <div className="flex items-center space-x-2 text-gray-400 mb-6">
                    <Calendar size={18} />
                    <span className="font-black uppercase text-[10px] tracking-widest">Timeline Hoje</span>
                </div>
                <div className="flex items-baseline space-x-2">
                    <span className="text-6xl font-black text-black dark:text-white">{todayTasks.length}</span>
                    <span className="text-gray-400 font-bold uppercase text-xs">Tarefas</span>
                </div>
                <div className="mt-8 flex items-center text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    <CheckCircle2 size={12} className="mr-2" />
                    <span>{completedToday.length} Finalizadas</span>
                </div>
            </div>

            <div 
                className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 cursor-pointer hover:border-black dark:hover:border-white transition-all group"
                onClick={() => onChangeView('list_view')}
            >
                <div className="flex items-center space-x-2 text-gray-400 mb-6">
                    <AlertCircle size={18} />
                    <span className="font-black uppercase text-[10px] tracking-widest">Urgências</span>
                </div>
                <div className="flex items-baseline space-x-2">
                    <span className="text-6xl font-black text-black dark:text-white">{urgentTasks.length}</span>
                    <span className="text-gray-400 font-bold uppercase text-xs">Críticas</span>
                </div>
                <p className="mt-8 text-[10px] text-gray-400 font-black uppercase tracking-widest">Atenção Prioritária</p>
            </div>

            <div className="bg-black dark:bg-white p-8 rounded-3xl shadow-2xl text-white dark:text-black flex flex-col justify-between">
                <div>
                     <p className="text-gray-500 dark:text-gray-400 mb-1 font-black uppercase text-[10px] tracking-widest">Clientes Ativos</p>
                     <h3 className="text-6xl font-black tracking-tighter">{clients.length}</h3>
                </div>
                <div className="mt-8 flex -space-x-3">
                    {clients.slice(0, 5).map(c => (
                        <div key={c.id} className="w-10 h-10 rounded-full border-[3px] border-black dark:border-white shadow-lg" style={{ backgroundColor: c.color }} title={c.name}></div>
                    ))}
                    {clients.length > 5 && (
                        <div className="w-10 h-10 rounded-full border-[3px] border-black dark:border-white bg-gray-800 dark:bg-gray-200 flex items-center justify-center text-[10px] font-black">
                            +{clients.length - 5}
                        </div>
                    )}
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
            <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-10">
                <div className="flex justify-between items-center mb-10">
                    <h3 className="text-2xl font-black text-black dark:text-white tracking-tight uppercase tracking-widest text-sm">Próximos Passos</h3>
                    <button onClick={() => onChangeView('agenda')} className="text-[10px] font-black text-gray-400 hover:text-black dark:hover:text-white flex items-center uppercase tracking-widest transition-colors">
                        Agenda Completa <ArrowRight size={14} className="ml-2" />
                    </button>
                </div>

                <div className="space-y-4">
                    {upcomingSchedule.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 dark:bg-black/50 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                            <Clock size={40} className="mx-auto mb-4 text-gray-200 dark:text-gray-800" />
                            <p className="font-bold uppercase text-[10px] tracking-widest text-gray-400">Sem horários marcados</p>
                        </div>
                    ) : (
                        upcomingSchedule.slice(0, 5).map(task => {
                            const client = clients.find(c => c.id === task.clientId);
                            return (
                                <div 
                                    key={task.id} 
                                    onClick={() => onTaskClick && onTaskClick(task)}
                                    className="flex items-center p-6 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all cursor-pointer group border border-transparent hover:border-gray-100 dark:hover:border-gray-800"
                                >
                                    <div className="w-20 shrink-0">
                                        <span className="block text-lg font-black text-black dark:text-white">{task.startTime}</span>
                                    </div>
                                    <div className="w-1 h-8 rounded-full mx-6 bg-black dark:bg-white"></div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-black dark:text-white truncate text-base">{task.title}</h4>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest truncate mt-1">{client?.name}</p>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-all px-2">
                                        <ArrowRight size={20} className="text-black dark:text-white" />
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>

            <div className="flex flex-col space-y-8">
                <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 flex flex-col justify-between h-full">
                    <div>
                        <h3 className="font-black text-[10px] text-gray-400 uppercase tracking-widest mb-4">Meta de Produtividade</h3>
                        <p className="text-sm font-bold text-black dark:text-white leading-relaxed">Mantenha o foco nas urgências para liberar sua tarde para processos criativos.</p>
                    </div>
                    <button 
                        onClick={() => onChangeView('agenda')}
                        className="w-full py-5 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all active:scale-95 shadow-2xl"
                    >
                        Revisar Cronograma
                    </button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default HomeView;
