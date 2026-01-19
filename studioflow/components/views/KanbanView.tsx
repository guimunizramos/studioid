
import React, { useState, useMemo } from 'react';
import { useData } from '../../services/dataContext';
import { TaskStatus, Priority } from '../../types';
import { KANBAN_COLUMNS } from '../../constants';
import TaskCard from '../TaskCard';
import { Filter, Search } from 'lucide-react';

interface KanbanViewProps {
  filterClientId?: string; 
  setFilterClientId?: (id: string | undefined) => void;
  onTaskClick?: (task: any) => void;
}

const KanbanView: React.FC<KanbanViewProps> = ({ filterClientId, setFilterClientId, onTaskClick }) => {
  const { tasks, clients, projects, updateTaskStatus } = useData();
  
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filterClientId && task.clientId !== filterClientId) return false;
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filterPriority !== 'ALL' && task.priority !== filterPriority) return false;
      return true;
    });
  }, [tasks, filterClientId, searchQuery, filterPriority]);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      updateTaskStatus(taskId, status);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-black">
      <div className="px-6 py-4 bg-white dark:bg-black border-b border-gray-100 dark:border-gray-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {setFilterClientId ? (
           <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
             <button 
                onClick={() => setFilterClientId(undefined)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${!filterClientId ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
             >
                Todos
             </button>
             {clients.map(client => (
               <button 
                 key={client.id}
                 onClick={() => setFilterClientId(client.id)}
                 className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center space-x-2 ${filterClientId === client.id ? 'bg-black dark:bg-white text-white dark:text-black shadow-md' : 'bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'}`}
               >
                 <span className="w-2 h-2 rounded-full" style={{ backgroundColor: client.color }} />
                 <span>{client.name}</span>
               </button>
             ))}
           </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold text-black dark:text-white">Kanban Geral</h2>
            <p className="text-sm text-gray-500">Fluxo macro de produção.</p>
          </div>
        )}

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white rounded-lg text-sm focus:ring-0 w-48 md:w-64"
            />
          </div>
          
          <div className="relative flex items-center space-x-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2">
            <Filter size={16} className="text-gray-400" />
            <select 
              value={filterPriority} 
              onChange={(e) => setFilterPriority(e.target.value)}
              className="text-sm bg-transparent border-none focus:ring-0 text-black dark:text-white cursor-pointer outline-none appearance-none"
            >
              <option value="ALL">Filtro</option>
              {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 bg-gray-50 dark:bg-black">
        <div className="flex h-full space-x-4 min-w-max">
          {KANBAN_COLUMNS.map(columnId => (
            <div 
              key={columnId} 
              className="w-72 flex flex-col bg-gray-100 dark:bg-gray-900 rounded-2xl border border-gray-200/50 dark:border-gray-800/50"
              onDrop={(e) => handleDrop(e, columnId as TaskStatus)}
              onDragOver={handleDragOver}
            >
              <div className="p-4 font-black text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest flex justify-between items-center">
                <span>{columnId}</span>
                <span className="bg-white dark:bg-black text-black dark:text-white py-0.5 px-2 rounded-full border border-gray-200 dark:border-gray-800">
                  {filteredTasks.filter(t => t.status === columnId).length}
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                {filteredTasks
                  .filter(task => task.status === columnId)
                  .map(task => (
                    <div 
                      key={task.id} 
                      draggable 
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className="cursor-move"
                    >
                      <TaskCard 
                        task={task} 
                        client={clients.find(c => c.id === task.clientId)}
                        project={projects.find(p => p.id === task.projectId)}
                        onClick={() => onTaskClick && onTaskClick(task)}
                      />
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KanbanView;
