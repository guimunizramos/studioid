
import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../services/dataContext';
import { Task, Priority, TaskStatus, Project, ProjectStatus, ProjectType } from '../types';
import { X, Trash2, Save, Plus, Hash, Tag, Clock, Calendar, CheckSquare } from 'lucide-react';

interface TaskEditModalProps {
  task: Task;
  onClose: () => void;
}

const TaskEditModal: React.FC<TaskEditModalProps> = ({ task, onClose }) => {
  const { updateTask, addTask, deleteTask, clients, projects, addProject, tasks } = useData();
  const [editedTask, setEditedTask] = useState<Task>({ ...task });
  const [projectSearch, setProjectSearch] = useState('');
  const [typeSearch, setTypeSearch] = useState('');

  useEffect(() => {
    setEditedTask({ ...task });
    const currentProject = projects.find(p => p.id === task.projectId);
    setProjectSearch(currentProject ? currentProject.name : '');
    setTypeSearch(task.type || '');
  }, [task, projects]);

  const handleSave = () => {
    if (!editedTask.title) return alert('Dê um nome para a tarefa!');
    if (!editedTask.clientId) return alert('Selecione um cliente!');

    const finalTask = { 
        ...editedTask, 
        type: typeSearch || 'Geral'
    };
    
    const exists = tasks.some(t => t.id === finalTask.id);
    if (exists) {
        updateTask(finalTask);
    } else {
        addTask(finalTask);
    }
    onClose();
  };

  const handleCreateProject = () => {
    if (!projectSearch.trim() || !editedTask.clientId) return;
    const newProjectId = `p-${Date.now()}`;
    const newProject: Project = {
        id: newProjectId,
        name: projectSearch,
        clientId: editedTask.clientId,
        status: ProjectStatus.EXECUTION,
        type: ProjectType.CONTINUOUS,
        startDate: new Date().toISOString().split('T')[0],
        estimatedDeadline: '',
        description: ''
    };
    addProject(newProject);
    setEditedTask({ ...editedTask, projectId: newProjectId });
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(p => 
        p.clientId === editedTask.clientId && 
        p.name.toLowerCase().includes(projectSearch.toLowerCase())
    );
  }, [projects, editedTask.clientId, projectSearch]);

  const existingTypes = useMemo(() => {
    const types = new Set<string>();
    tasks.forEach(t => { if(t.type) types.add(t.type) });
    return Array.from(types).sort();
  }, [tasks]);

  const isNew = !tasks.some(t => t.id === task.id);

  return (
    <div className="fixed inset-0 bg-black/80 dark:bg-white/10 flex items-center justify-center z-[100] backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-black shadow-2xl w-full max-w-2xl flex flex-col my-auto border border-gray-100 dark:border-gray-900 rounded-3xl overflow-hidden">
        <div className="flex justify-between items-center p-8 border-b border-gray-100 dark:border-gray-900">
          <div className="flex items-center space-x-3 text-black dark:text-white">
             <CheckSquare size={24} />
             <h2 className="text-2xl font-black tracking-tight uppercase tracking-widest text-sm">{isNew ? 'Nova Demanda' : 'Gerenciar Demanda'}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black dark:hover:text-white p-2 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-10 space-y-10 flex-1 overflow-y-auto max-h-[70vh] custom-scrollbar">
            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Título</label>
                <input 
                    type="text"
                    value={editedTask.title}
                    onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                    placeholder="Descrição curta do trabalho..."
                    className="w-full border-b-2 border-gray-100 dark:border-gray-900 bg-transparent text-black dark:text-white py-4 outline-none focus:border-black dark:focus:border-white text-xl font-bold transition-all"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Cliente</label>
                    <select 
                        value={editedTask.clientId}
                        onChange={(e) => setEditedTask({...editedTask, clientId: e.target.value, projectId: ''})}
                        className="w-full bg-gray-50 dark:bg-gray-900 text-black dark:text-white px-5 py-4 rounded-xl outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-bold appearance-none"
                    >
                        <option value="">Selecionar Cliente...</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>

                <div className="relative">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Projeto</label>
                    <div className="relative">
                        <input 
                            type="text"
                            value={projectSearch}
                            onChange={(e) => setProjectSearch(e.target.value)}
                            placeholder="Buscar ou criar..."
                            className="w-full bg-gray-50 dark:bg-gray-900 text-black dark:text-white px-5 py-4 rounded-xl outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-bold"
                        />
                        {projectSearch && !projects.some(p => p.name.toLowerCase() === projectSearch.toLowerCase()) && (
                            <button onClick={handleCreateProject} className="absolute right-3 top-3 text-[10px] font-black uppercase text-black dark:text-white bg-white dark:bg-black px-2 py-1 rounded-md border border-black dark:border-white">Novo</button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Horas</label>
                    <input 
                        type="number"
                        step="0.5"
                        value={editedTask.estimatedHours}
                        onChange={(e) => setEditedTask({...editedTask, estimatedHours: Number(e.target.value)})}
                        className="w-full bg-gray-50 dark:bg-gray-900 text-black dark:text-white px-5 py-4 rounded-xl outline-none focus:ring-2 focus:ring-black dark:focus:ring-white font-bold"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Prazo</label>
                    <input 
                        type="date"
                        value={editedTask.deadline}
                        onChange={(e) => setEditedTask({...editedTask, deadline: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-gray-900 text-black dark:text-white px-5 py-4 rounded-xl outline-none focus:ring-2 focus:ring-black dark:focus:ring-white font-bold"
                    />
                </div>
                <div className="col-span-2 md:col-span-1">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Prioridade</label>
                    <select 
                        value={editedTask.priority}
                        onChange={(e) => setEditedTask({...editedTask, priority: e.target.value as Priority})}
                        className="w-full bg-gray-50 dark:bg-gray-900 text-black dark:text-white px-5 py-4 rounded-xl outline-none focus:ring-2 focus:ring-black dark:focus:ring-white font-black uppercase tracking-tighter"
                    >
                        {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Briefing</label>
                <textarea 
                    value={editedTask.description}
                    onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
                    placeholder="Instruções e notas importantes..."
                    className="w-full bg-gray-50 dark:bg-gray-900 text-black dark:text-white px-6 py-6 rounded-2xl outline-none focus:ring-2 focus:ring-black dark:focus:ring-white min-h-[150px] resize-none font-medium leading-relaxed"
                />
            </div>
        </div>

        <div className="p-8 border-t border-gray-100 dark:border-gray-900 flex justify-between items-center">
            {!isNew ? (
                <button 
                    onClick={() => confirm('Remover?') && (deleteTask(task.id), onClose())}
                    className="text-red-500 font-black uppercase text-[10px] tracking-widest hover:underline p-2"
                >
                    Remover
                </button>
            ) : <div />}
            
            <div className="flex space-x-6">
                <button onClick={onClose} className="text-gray-400 font-bold uppercase text-[10px] tracking-widest hover:text-black dark:hover:text-white transition-colors">Cancelar</button>
                <button 
                    onClick={handleSave}
                    className="px-12 py-5 bg-black dark:bg-white text-white dark:text-black font-black uppercase text-xs tracking-widest rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all"
                >
                    Confirmar
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TaskEditModal;
