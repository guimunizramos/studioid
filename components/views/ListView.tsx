
import React from 'react';
import { useData } from '../../services/dataContext';
import { TaskStatus, Priority, Task } from '../../types';
import { Calendar, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ListViewProps {
    onTaskClick?: (task: Task) => void;
}

const ListView: React.FC<ListViewProps> = ({ onTaskClick }) => {
  const { tasks, clients, projects, updateTaskStatus } = useData();

  const getDaysDiff = (dateStr: string) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const date = new Date(dateStr);
    date.setHours(0,0,0,0);
    const diffTime = date.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  };

  const upcomingTasks = tasks.filter(task => {
    const diff = getDaysDiff(task.deadline);
    return diff <= 7 && task.status !== TaskStatus.COMPLETED;
  });

  const priorityWeight = {
    [Priority.URGENT]: 4,
    [Priority.HIGH]: 3,
    [Priority.MEDIUM]: 2,
    [Priority.LOW]: 1
  };

  upcomingTasks.sort((a, b) => {
    const pA = priorityWeight[a.priority];
    const pB = priorityWeight[b.priority];
    if (pA !== pB) return pB - pA;
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  const getDayLabel = (diff: number) => {
    if (diff < 0) return 'Atrasado';
    if (diff === 0) return 'Hoje';
    if (diff === 1) return 'Amanhã';
    return `Em ${diff} dias`;
  };

  const getStatusColor = (status: TaskStatus) => {
    if (status === TaskStatus.IN_PROGRESS) return 'bg-black dark:bg-white text-white dark:text-black';
    return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
  };

  return (
    <div className="p-8 bg-white dark:bg-black h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h2 className="text-4xl font-black text-black dark:text-white tracking-tighter">Minhas Tarefas</h2>
          <p className="text-gray-500 font-medium">Próximos 7 dias e urgências.</p>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-3xl border border-gray-100 dark:border-gray-900 overflow-hidden shadow-sm">
          {upcomingTasks.length === 0 ? (
            <div className="p-20 text-center text-gray-400">
              <CheckCircle2 size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-bold uppercase text-[10px] tracking-widest">Nada pendente no radar</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-gray-900">
              {upcomingTasks.map(task => {
                const client = clients.find(c => c.id === task.clientId);
                const project = projects.find(p => p.id === task.projectId);
                const diff = getDaysDiff(task.deadline);
                const dayLabel = getDayLabel(diff);

                return (
                  <div 
                    key={task.id} 
                    onClick={() => onTaskClick && onTaskClick(task)}
                    className="p-6 hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6 cursor-pointer group"
                  >
                    
                    <div className="flex items-start space-x-6">
                       <button 
                          onClick={(e) => { e.stopPropagation(); updateTaskStatus(task.id, TaskStatus.COMPLETED); }}
                          className="mt-1 w-6 h-6 rounded-full border-2 border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-all flex items-center justify-center"
                       >
                         <CheckCircle2 size={16} className="opacity-0 hover:opacity-100 text-black dark:text-white" />
                       </button>

                       <div>
                         <div className="flex items-center space-x-3 mb-2">
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${diff < 0 ? 'bg-red-500 text-white' : 'bg-black dark:bg-white text-white dark:text-black'}`}>
                              {dayLabel}
                            </span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                              {task.type}
                            </span>
                         </div>
                         <h3 className="text-lg font-bold text-black dark:text-white group-hover:underline underline-offset-4">{task.title}</h3>
                         <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1 font-medium">
                            <span className="flex items-center space-x-1.5">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: client?.color }}></span>
                              <span>{client?.name}</span>
                            </span>
                            <span className="text-gray-300">/</span>
                            <span>{project?.name}</span>
                         </div>
                       </div>
                    </div>

                    <div className="flex items-center space-x-6 pl-12 sm:pl-0">
                      <div className="flex flex-col items-end">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-2 ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                        <div className="flex items-center space-x-4">
                           <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase">
                              <AlertCircle size={12} className={`mr-1.5 ${task.priority === Priority.URGENT ? 'text-black dark:text-white' : ''}`} />
                              <span>{task.priority}</span>
                           </div>
                           <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase">
                              <Clock size={12} className="mr-1.5" />
                              <span>{task.estimatedHours}h</span>
                           </div>
                        </div>
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
};

export default ListView;
