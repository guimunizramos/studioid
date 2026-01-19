
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Client, Project, Task, AppConfig, TaskStatus, ContractType, Priority } from '../types';

interface DataContextType {
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  config: AppConfig;
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  updateTaskStatus: (taskId: string, status: any) => void;
  updateTask: (task: Task) => void;
  addTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  addClient: (client: Client) => void;
  updateClient: (client: Client) => void;
  deleteClient: (clientId: string) => void;
  addProject: (project: Project) => void;
  updateConfig: (newConfig: Partial<AppConfig>) => void;
  autoScheduleDay: (date: string) => void;
}

const STORAGE_KEY = 'studioflow_v3_bw_edition';

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [config, setConfig] = useState<AppConfig>({
    totalHoursPerDay: 8,
    workWindowStart: '09:00',
    workWindowEnd: '18:00',
    notes: '',
    workDays: [1, 2, 3, 4, 5],
    visual: {
      themeMode: 'light',
      agencyName: 'StudioFlow',
      userName: 'Criativo',
    }
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setClients(parsed.clients || []);
        setProjects(parsed.projects || []);
        setTasks(parsed.tasks || []);
        if (parsed.config) {
          setConfig({
            ...parsed.config,
            visual: { ...config.visual, ...parsed.config.visual }
          });
        }
        if (parsed.isSidebarCollapsed !== undefined) setSidebarCollapsed(parsed.isSidebarCollapsed);
      } catch (e) {
        console.error("Erro ao carregar banco de dados", e);
      }
    } else {
      setClients([{
        id: 'c-1',
        name: 'Cliente Exemplo',
        brand: 'Brand One',
        category: 'Tecnologia',
        contractType: ContractType.RETAINER,
        color: '#000000',
        weeklyHours: 10,
        minDailyHours: 1,
        priority: Priority.MEDIUM
      }]);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ clients, projects, tasks, config, isSidebarCollapsed }));
      
      const root = document.documentElement;
      if (config.visual.themeMode === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [clients, projects, tasks, config, isLoaded, isSidebarCollapsed]);

  const updateTaskStatus = (taskId: string, newStatus: any) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const addTask = (newTask: Task) => {
    setTasks(prev => [...prev, newTask]);
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const addClient = (client: Client) => {
    setClients(prev => [...prev, client]);
  };

  const updateClient = (updatedClient: Client) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
  };

  const deleteClient = (clientId: string) => {
    setClients(prev => prev.filter(c => c.id !== clientId));
  };

  const addProject = (project: Project) => {
    setProjects(prev => [...prev, project]);
  };

  const updateConfig = (newConfig: Partial<AppConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const autoScheduleDay = (dateStr: string) => {
    alert('Agendamento automático para: ' + dateStr);
  };

  if (!isLoaded) return null;

  return (
    <DataContext.Provider value={{ 
      clients, projects, tasks, config, isSidebarCollapsed, setSidebarCollapsed,
      updateTaskStatus, updateTask, addTask, deleteTask, addClient, updateClient, deleteClient, addProject, updateConfig, autoScheduleDay 
    }}>
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors">
        {children}
      </div>
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) throw new Error('useData deve ser usado dentro de um DataProvider');
  return context;
};
