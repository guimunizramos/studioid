
import React from 'react';
import { useData } from '../../services/dataContext';
import { Upload, Trash2, Palette, Sun, Moon, Building2, User } from 'lucide-react';

const VisualView: React.FC = () => {
  const { config, updateConfig } = useData();
  const { visual } = config;

  const updateVisual = (key: string, value: any) => {
    updateConfig({
      visual: { ...visual, [key]: value }
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateVisual('logoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="view-container h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-12 pb-24">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-black dark:text-white">Aparência</h2>
          <p className="text-gray-500 mt-2 font-medium">Ajustes fundamentais de interface e identidade.</p>
        </div>

        {/* Modo de Tema */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 text-black dark:text-white font-black uppercase text-xs tracking-widest">
            <Palette size={16} />
            <span>Modo do Sistema</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => updateVisual('themeMode', 'light')}
              className={`flex items-center justify-center space-x-3 p-6 rounded-2xl border transition-all ${visual.themeMode === 'light' ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-200 dark:bg-gray-900 dark:border-gray-800 hover:border-black dark:hover:border-white'}`}
            >
              <Sun size={24} />
              <span className="font-bold">Tema Claro</span>
            </button>
            <button 
              onClick={() => updateVisual('themeMode', 'dark')}
              className={`flex items-center justify-center space-x-3 p-6 rounded-2xl border transition-all ${visual.themeMode === 'dark' ? 'bg-white text-black border-white' : 'bg-black text-gray-600 border-gray-800 hover:border-white'}`}
            >
              <Moon size={24} />
              <span className="font-bold">Tema Escuro</span>
            </button>
          </div>
        </section>

        {/* Identidade */}
        <section className="space-y-6">
          <div className="flex items-center space-x-2 text-black dark:text-white font-black uppercase text-xs tracking-widest">
            <Building2 size={16} />
            <span>Identidade Visual</span>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900/50 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-8">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nome da Agência</label>
              <input 
                type="text" 
                value={visual.agencyName || ''}
                onChange={(e) => updateVisual('agencyName', e.target.value)}
                className="w-full px-5 py-4 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl text-lg font-bold outline-none focus:border-black dark:focus:border-white transition-colors"
                placeholder="Ex: Studio Flow"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center">
                <User size={12} className="mr-1" /> Seu Nome (Cumprimento Home)
              </label>
              <input 
                type="text" 
                value={visual.userName || ''}
                onChange={(e) => updateVisual('userName', e.target.value)}
                className="w-full px-5 py-4 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl text-lg font-bold outline-none focus:border-black dark:focus:border-white transition-colors"
                placeholder="Como quer ser chamado?"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Logotipo</label>
              <div className="flex items-center space-x-8">
                <div className="w-32 h-32 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-black overflow-hidden relative group">
                  {visual.logoUrl ? (
                    <>
                      <img src={visual.logoUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain p-2 dark:invert" />
                      <button 
                        onClick={() => updateVisual('logoUrl', undefined)}
                        className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={24} />
                      </button>
                    </>
                  ) : (
                    <Upload size={32} className="text-gray-200 dark:text-gray-800" />
                  )}
                </div>
                <div className="flex-1">
                  <label className="inline-block cursor-pointer px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase text-xs tracking-widest rounded-xl hover:scale-105 transition-transform active:scale-95 shadow-xl">
                    Selecionar Arquivo
                    <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                  </label>
                  <p className="text-gray-400 text-xs mt-3 font-medium">Recomendado: PNG com fundo transparente.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="pt-12 border-t border-gray-100 dark:border-gray-900 text-center">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">StudioFlow Black & White Edition</p>
        </div>
      </div>
    </div>
  );
};

export default VisualView;
