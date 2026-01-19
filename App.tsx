
import React, { useState } from 'react';
import { DataProvider, useData } from './services/dataContext';
import Sidebar from './components/Sidebar';
import KanbanView from './components/views/KanbanView';
import ListView from './components/views/ListView';
import AgendaView from './components/views/AgendaView';
import ClientsView from './components/views/ClientsView';
import SettingsView from './components/views/SettingsView';
import VisualView from './components/views/VisualView';
import ReportsView from './components/views/ReportsView';
import HomeView from './components/views/HomeView';
import TaskEditModal from './components/TaskEditModal';
import { Task, TaskStatus, TaskType, Priority } from './types';
import { Plus } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const [currentView, setCurrentView] = useState('home');
  const [filterClientId, setFilterClientId] = useState<string | undefined>(undefined);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleViewChange = (viewId: string) => {
    setCurrentView(viewId);
    if (viewId !== 'kanban_client') {
       setFilterClientId(undefined);
    }
  };

  const handleCreateTask = () => {
    const newTask: Task = {
        id: `t-${Date.now()}`,
        title: '',
        description: '',
        clientId: '',
        projectId: '',
        status: TaskStatus.BACKLOG,
        type: TaskType.COPY,
        priority: Priority.MEDIUM,
        estimatedHours: 1,
        deadline: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        isRecurring: false
    };
    setEditingTask(newTask);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <HomeView onTaskClick={setEditingTask} onChangeView={handleViewChange} />;
      case 'kanban_general':
        return <KanbanView onTaskClick={setEditingTask} />;
      case 'kanban_client':
        return <KanbanView filterClientId={filterClientId} setFilterClientId={setFilterClientId} onTaskClick={setEditingTask} />;
      case 'list_view':
        return <ListView onTaskClick={setEditingTask} />;
      case 'agenda':
        return <AgendaView onTaskClick={setEditingTask} />;
      case 'reports':
        return <ReportsView />;
      case 'clients':
        return <ClientsView />;
      case 'settings':
        return <SettingsView />;
      case 'visual':
        return <VisualView />;
      default:
        return <HomeView onTaskClick={setEditingTask} onChangeView={handleViewChange} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-black text-black dark:text-white">
      <Sidebar currentView={currentView} onViewChange={handleViewChange} />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {renderContent()}
        
        {/* FAB - Botão Monocromático */}
        <button 
            onClick={handleCreateTask}
            className="fixed bottom-10 right-10 w-16 h-16 rounded-3xl bg-black dark:bg-white text-white dark:text-black shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 border-4 border-white dark:border-black"
            title="Nova Tarefa"
        >
            <Plus size={32} />
        </button>

        {editingTask && (
            <TaskEditModal 
                task={editingTask} 
                onClose={() => setEditingTask(null)} 
            />
        )}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <DashboardContent />
    </DataProvider>
  );
};

export default App;
