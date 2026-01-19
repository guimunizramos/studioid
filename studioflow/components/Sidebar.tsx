
import React from 'react';
import { Home, Calendar, Briefcase, CheckSquare, BarChart3, Users, Settings, Palette, ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '../services/dataContext';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const { config, isSidebarCollapsed, setSidebarCollapsed } = useData();
  const { visual } = config;

  const navItems = [
    { id: 'home', label: 'Home', icon: <Home size={20} /> },
    { id: 'agenda', label: 'Agenda', icon: <Calendar size={20} /> },
    { id: 'kanban_client', label: 'Visão Geral', icon: <Briefcase size={20} /> },
    { id: 'list_view', label: 'Minhas Tarefas', icon: <CheckSquare size={20} /> },
    { id: 'reports', label: 'Relatórios', icon: <BarChart3 size={20} /> },
  ];

  const configItems = [
    { id: 'clients', label: 'Clientes', icon: <Users size={20} /> },
    { id: 'settings', label: 'Configurações', icon: <Settings size={20} /> },
    { id: 'visual', label: 'Visual', icon: <Palette size={20} /> },
  ];

  return (
    <div 
      className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} flex flex-col h-full border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-black transition-all duration-300 relative z-50`} 
    >
      {/* Toggle Button */}
      <button 
        onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
        className="absolute -right-3 top-20 bg-white dark:bg-black text-black dark:text-white rounded-full p-1 shadow-md border border-gray-200 dark:border-gray-800 z-[60] hover:scale-110 transition-all active:scale-90"
      >
        {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Header / Logo */}
      <div className={`p-6 border-b border-gray-100 dark:border-gray-900 flex items-center min-h-[88px] ${isSidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
        {visual.logoUrl ? (
          <img src={visual.logoUrl} alt="Logo" className="h-10 w-auto object-contain dark:invert" />
        ) : (
          <div className="w-10 h-10 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black font-black text-xl rounded-lg">
            SF
          </div>
        )}
        {!isSidebarCollapsed && (
          <span className="text-xl font-black text-black dark:text-white tracking-tighter truncate">
            {visual.agencyName || 'StudioFlow'}
          </span>
        )}
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar overflow-x-hidden">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-xl transition-all group relative ${currentView === item.id ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'}`}
          >
            <div className="shrink-0">{item.icon}</div>
            {!isSidebarCollapsed && (
              <span className="font-bold text-sm">{item.label}</span>
            )}
          </button>
        ))}

        <div className={`pt-6 mt-6 border-t border-gray-100 dark:border-gray-900`}>
          {!isSidebarCollapsed && (
            <p className="px-4 text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-3">Admin</p>
          )}
          {configItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-xl transition-all group relative ${currentView === item.id ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'}`}
            >
              <div className="shrink-0">{item.icon}</div>
              {!isSidebarCollapsed && (
                <span className="font-bold text-sm">{item.label}</span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {!isSidebarCollapsed && (
        <div className="p-6 border-t border-gray-100 dark:border-gray-900">
          <div className="flex items-center justify-between text-[10px] text-gray-400 font-black uppercase tracking-widest">
            <span>v2.0 Monocromo</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
