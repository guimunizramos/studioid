
import React, { useState } from 'react';
import { useData } from '../../services/dataContext';
import { Save, Calendar, Clock, Globe } from 'lucide-react';

const WEEKDAYS = [
  { id: 0, label: 'Dom' },
  { id: 1, label: 'Seg' },
  { id: 2, label: 'Ter' },
  { id: 3, label: 'Qua' },
  { id: 4, label: 'Qui' },
  { id: 5, label: 'Sex' },
  { id: 6, label: 'Sáb' },
];

const SettingsView: React.FC = () => {
  const { config, updateConfig } = useData();
  const [localConfig, setLocalConfig] = useState({
    totalHoursPerDay: config.totalHoursPerDay,
    workWindowStart: config.workWindowStart,
    workWindowEnd: config.workWindowEnd,
    workDays: config.workDays || [1, 2, 3, 4, 5],
  });

  const handleSave = () => {
    updateConfig(localConfig);
    alert('Configurações de agência atualizadas!');
  };

  const toggleWorkDay = (day: number) => {
    const current = [...localConfig.workDays];
    if (current.includes(day)) {
      setLocalConfig({ ...localConfig, workDays: current.filter(d => d !== day) });
    } else {
      setLocalConfig({ ...localConfig, workDays: [...current, day].sort() });
    }
  };

  return (
    <div className="p-8 bg-white dark:bg-black h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-extrabold text-black dark:text-white tracking-tight">Preferências da Agência</h2>
          <p className="text-gray-500 mt-1">Configure o ecossistema de trabalho e horários padrão.</p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900/50 p-8 border border-gray-200 dark:border-gray-800 shadow-sm space-y-8 rounded-3xl">
          
          {/* Dias Úteis */}
          <div>
            <div className="flex items-center space-x-2 text-black dark:text-white font-bold mb-4">
              <Calendar size={20} className="text-black dark:text-white" />
              <span>Calendário de Operação</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">Selecione os dias da semana em que a agência processa demandas.</p>
            <div className="flex flex-wrap gap-3">
              {WEEKDAYS.map(day => (
                <button
                  key={day.id}
                  onClick={() => toggleWorkDay(day.id)}
                  className={`w-14 h-14 border flex flex-col items-center justify-center transition-all rounded-xl ${
                    localConfig.workDays.includes(day.id) 
                      ? 'bg-black dark:bg-white text-white dark:text-black font-bold shadow-lg scale-105 border-black dark:border-white' 
                      : 'bg-white dark:bg-black border-gray-200 dark:border-gray-800 text-gray-400 hover:border-black dark:hover:border-white'
                  }`}
                >
                  <span className="text-xs">{day.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-200 dark:border-gray-800">
             {/* Horas Diárias */}
            <div>
              <div className="flex items-center space-x-2 text-black dark:text-white font-bold mb-4">
                <Clock size={20} className="text-black dark:text-white" />
                <span>Carga Horária Padrão</span>
              </div>
              <div className="relative">
                <input 
                  type="number" 
                  value={localConfig.totalHoursPerDay} 
                  onChange={e => setLocalConfig({...localConfig, totalHoursPerDay: Number(e.target.value)})}
                  className="w-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white px-4 py-3 outline-none focus:border-black dark:focus:border-white font-bold text-lg rounded-xl transition-colors"
                />
                <span className="absolute right-4 top-3 text-gray-400 font-bold text-xs">HORAS/DIA</span>
              </div>
            </div>

            {/* Janela de Trabalho */}
            <div>
              <div className="flex items-center space-x-2 text-black dark:text-white font-bold mb-4">
                <Globe size={20} className="text-black dark:text-white" />
                <span>Janela de Atendimento</span>
              </div>
              <div className="flex items-center space-x-3">
                <input 
                  type="time" 
                  value={localConfig.workWindowStart} 
                  onChange={e => setLocalConfig({...localConfig, workWindowStart: e.target.value})}
                  className="flex-1 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white px-4 py-3 outline-none focus:border-black dark:focus:border-white font-bold rounded-xl transition-colors"
                />
                <span className="text-gray-300 font-bold text-xs uppercase">Até</span>
                <input 
                  type="time" 
                  value={localConfig.workWindowEnd} 
                  onChange={e => setLocalConfig({...localConfig, workWindowEnd: e.target.value})}
                  className="flex-1 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white px-4 py-3 outline-none focus:border-black dark:focus:border-white font-bold rounded-xl transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex justify-end">
             <button 
                onClick={handleSave} 
                className="px-12 py-5 bg-black dark:bg-white text-white dark:text-black font-black shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center space-x-3 rounded-2xl uppercase text-[10px] tracking-widest"
              >
                <Save size={18} />
                <span>Salvar Configurações</span>
              </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsView;
