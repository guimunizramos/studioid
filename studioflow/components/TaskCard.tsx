
import React from 'react';
import { Task, Client, Project, Priority } from '../types';
import { Clock, Calendar, MoreHorizontal } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  client?: Client;
  project?: Project;
  onClick?: () => void;
}

const getPriorityStyles = (priority: Priority) => {
  switch (priority) {
    case Priority.URGENT: return 'bg-black dark:bg-white text-white dark:text-black';
    default: return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
  }
};

const TaskCard: React.FC<TaskCardProps> = ({ task, client, project, onClick }) => {
  const formattedDate = new Date(task.deadline).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

  return (
    <div 
        onClick={onClick}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 mb-3 hover:border-black dark:hover:border-white transition-all relative group cursor-pointer"
    >
      {client && (
        <div 
          className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full"
          style={{ backgroundColor: client.color }}
        />
      )}
      
      <div className="pl-2">
        <div className="flex justify-between items-start mb-3">
          <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${getPriorityStyles(task.priority)}`}>
            {task.priority}
          </span>
          <button className="text-gray-300 dark:text-gray-600 hover:text-black dark:hover:text-white transition-colors">
            <MoreHorizontal size={14} />
          </button>
        </div>

        <h4 className="text-sm font-bold text-black dark:text-white mb-1 leading-tight">{task.title}</h4>
        
        {project && (
          <p className="text-[11px] text-gray-500 font-medium truncate mb-2">
            {project.name}
          </p>
        )}

        <div className="flex items-center justify-between text-[11px] text-gray-400 mt-4 border-t border-gray-100 dark:border-gray-800 pt-3">
          <div className="flex items-center space-x-1.5 font-medium">
            <Clock size={12} />
            <span>{task.estimatedHours}h</span>
          </div>
          
          <div className={`flex items-center space-x-1.5 font-bold ${new Date(task.deadline) < new Date() ? 'text-red-500' : ''}`}>
            <Calendar size={12} />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
