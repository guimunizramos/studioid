
import React, { useState } from 'react';
import { useData } from '../../services/dataContext';
import { TaskStatus } from '../../types';
import { PieChart, BarChart3, TrendingUp, Calendar } from 'lucide-react';

const ReportsView: React.FC = () => {
  const { clients, tasks, config } = useData();
  const [period, setPeriod] = useState<'week' | 'month'>('month');

  // Helper para verificar se data está no período
  const isDateInPeriod = (dateStr: string) => {
    const date = new Date(dateStr);
    date.setHours(0,0,0,0);
    
    const today = new Date();
    today.setHours(0,0,0,0);

    if (period === 'month') {
        return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    } else {
        const day = today.getDay(); 
        const diff = today.getDate() - day; 
        const startOfWeek = new Date(today);
        startOfWeek.setDate(diff);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        return date >= startOfWeek && date <= endOfWeek;
    }
  };

  const clientStats = clients.map(client => {
    const periodTasks = tasks.filter(t => t.clientId === client.id && isDateInPeriod(t.deadline));
    const completedTasks = periodTasks.filter(t => t.status === TaskStatus.COMPLETED);
    const executedHours = completedTasks.reduce((acc, task) => acc + task.estimatedHours, 0);
    const totalPending = periodTasks.filter(t => t.status !== TaskStatus.COMPLETED).length;
    const contractedHours = period === 'week' ? client.weeklyHours : client.weeklyHours * 4;

    return {
        client,
        totalTasks: periodTasks.length,
        completedTasks: completedTasks.length,
        executedHours,
        contractedHours,
        pendingTasks: totalPending
    };
  });

  const totalExecuted = clientStats.reduce((acc, curr) => acc + curr.executedHours, 0);
  const totalCompleted = clientStats.reduce((acc, curr) => acc + curr.completedTasks, 0);
  const totalPendingGlobal = clientStats.reduce((acc, curr) => acc + curr.pendingTasks, 0);

  return (
    <div className="p-8 bg-white dark:bg-black h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <h2 className="text-4xl font-black text-black dark:text-white tracking-tighter">Relatórios</h2>
                <p className="text-gray-500 font-medium">Acompanhamento de entregas e eficiência.</p>
            </div>

            <div className="bg-gray-100 dark:bg-gray-900 p-1 rounded-2xl flex border border-gray-200 dark:border-gray-800">
                <button 
                    onClick={() => setPeriod('week')}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${period === 'week' ? 'bg-black dark:bg-white text-white dark:text-black shadow-xl' : 'text-gray-400 hover:text-black dark:hover:text-white'}`}
                >
                    Semana
                </button>
                <button 
                    onClick={() => setPeriod('month')}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${period === 'month' ? 'bg-black dark:bg-white text-white dark:text-black shadow-xl' : 'text-gray-400 hover:text-black dark:hover:text-white'}`}
                >
                    Mês
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-950 p-8 rounded-3xl border border-gray-100 dark:border-gray-900 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                    <TrendingUp size={20} className="text-gray-400" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Horas Executadas</span>
                </div>
                <p className="text-5xl font-black text-black dark:text-white tracking-tighter">{totalExecuted}h</p>
            </div>
            <div className="bg-white dark:bg-gray-950 p-8 rounded-3xl border border-gray-100 dark:border-gray-900 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                    <BarChart3 size={20} className="text-gray-400" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Finalizadas</span>
                </div>
                <p className="text-5xl font-black text-black dark:text-white tracking-tighter">{totalCompleted}</p>
            </div>
             <div className="bg-black dark:bg-white p-8 rounded-3xl shadow-2xl text-white dark:text-black">
                <div className="flex items-center space-x-3 mb-4">
                    <PieChart size={20} className="opacity-40" />
                    <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">Pendências</span>
                </div>
                <p className="text-5xl font-black tracking-tighter">{totalPendingGlobal}</p>
            </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-3xl border border-gray-100 dark:border-gray-900 overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-900 bg-gray-50 dark:bg-gray-900/50">
                <h3 className="text-xs font-black text-black dark:text-white uppercase tracking-widest">Detalhamento por Parceiro</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="text-[10px] text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-900/30 border-b border-gray-50 dark:border-gray-900">
                        <tr>
                            <th className="px-8 py-5 font-black">Cliente</th>
                            <th className="px-8 py-5 font-black">Contratado</th>
                            <th className="px-8 py-5 font-black">Realizado</th>
                            <th className="px-8 py-5 font-black">Utilização</th>
                            <th className="px-8 py-5 font-black">Entregas</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
                        {clientStats.map((stat, index) => {
                            const percentage = stat.contractedHours > 0 ? (stat.executedHours / stat.contractedHours) * 100 : 0;
                            return (
                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-all group">
                                    <td className="px-8 py-6 flex items-center space-x-4">
                                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: stat.client.color }}></div>
                                        <span className="font-bold text-black dark:text-white">{stat.client.name}</span>
                                    </td>
                                    <td className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-tighter">{stat.contractedHours}h</td>
                                    <td className="px-8 py-6 text-black dark:text-white font-black">{stat.executedHours}h</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-24 bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                                                <div 
                                                    className={`h-full transition-all duration-500 ${percentage > 100 ? 'bg-black dark:bg-white' : 'bg-black dark:bg-white'}`}
                                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-[10px] font-black text-gray-400 tracking-tighter">{percentage.toFixed(0)}%</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-tighter">
                                        {stat.completedTasks} <span className="opacity-30">/</span> {stat.totalTasks}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {clientStats.length === 0 && (
                <div className="p-20 text-center text-gray-300 font-bold uppercase text-[10px] tracking-widest">
                    Nenhum dado registrado para este período.
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
