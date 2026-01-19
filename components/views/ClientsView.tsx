
import React, { useState } from 'react';
import { useData } from '../../services/dataContext';
import { Client, Priority, ContractType } from '../../types';
import { Plus, Save, Edit2, ShieldCheck, Zap, Trash2, X, Users } from 'lucide-react';

const ClientsView: React.FC = () => {
  const { clients, updateClient, addClient, deleteClient, config } = useData();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Client>>({});

  const handleEdit = (client: Client) => {
    setIsEditing(client.id);
    setEditForm(client);
  };

  const handleAddNew = () => {
    setIsEditing('new');
    setEditForm({
      name: '',
      brand: '',
      category: '',
      contractType: ContractType.RETAINER,
      color: '#000000',
      weeklyHours: 0,
      minDailyHours: 0,
      priority: Priority.MEDIUM,
    });
  };

  const handleSave = () => {
    if (!editForm.name) return alert('Nome do cliente é obrigatório.');
    
    const payload = { ...editForm, brand: editForm.name } as Client;

    if (isEditing === 'new') {
      const newClient: Client = {
        ...payload,
        id: `c-${Date.now()}`,
      };
      addClient(newClient);
    } else if (isEditing) {
      updateClient(payload);
    }
    setIsEditing(null);
    setEditForm({});
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este cliente e desvincular seus projetos?')) {
      deleteClient(id);
    }
  };

  return (
    <div className="view-container bg-white dark:bg-black h-full overflow-y-auto transition-colors">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-4xl font-black text-black dark:text-white tracking-tighter">Portfólio de Clientes</h2>
            <p className="text-gray-500 mt-1 font-medium">Gestão centralizada de contratos e parcerias.</p>
          </div>
          <button 
            onClick={handleAddNew}
            className="flex items-center space-x-2 bg-black dark:bg-white text-white dark:text-black px-8 py-4 font-black uppercase text-xs tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all rounded-2xl"
          >
            <Plus size={20} />
            <span>Adicionar Cliente</span>
          </button>
        </div>

        {isEditing && (
          <div className="bg-gray-50 dark:bg-gray-900/50 p-8 border border-gray-200 dark:border-gray-800 shadow-2xl animate-in fade-in slide-in-from-top-4 rounded-3xl">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-sm font-black text-black dark:text-white uppercase tracking-widest">
                {isEditing === 'new' ? 'Novo Parceiro' : 'Ajustar Contrato'}
              </h3>
              <button onClick={() => setIsEditing(null)} className="text-gray-400 hover:text-black dark:hover:text-white p-2">
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Nome Comercial / Marca</label>
                <input 
                  type="text" 
                  value={editForm.name || ''} 
                  onChange={e => setEditForm({...editForm, name: e.target.value})}
                  placeholder="Ex: Coca-Cola, Nike, Startup X..."
                  className="w-full border-b-2 border-gray-200 dark:border-gray-800 bg-transparent text-black dark:text-white py-4 outline-none focus:border-black dark:focus:border-white text-xl font-bold transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Categoria de Mercado</label>
                <input 
                  type="text" 
                  value={editForm.category || ''} 
                  onChange={e => setEditForm({...editForm, category: e.target.value})}
                  placeholder="Ex: Alimentação, Tecnologia, Saúde..."
                  className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-black dark:text-white px-5 py-4 rounded-xl outline-none focus:border-black dark:focus:border-white transition-all font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Tipo de Relacionamento</label>
                <select 
                  value={editForm.contractType} 
                  onChange={e => setEditForm({...editForm, contractType: e.target.value as ContractType})}
                  className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-black dark:text-white px-5 py-4 rounded-xl outline-none focus:border-black dark:focus:border-white transition-all font-bold appearance-none"
                >
                  {Object.values(ContractType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Horas Semanais</label>
                <input 
                  type="number" 
                  value={editForm.weeklyHours || 0} 
                  onChange={e => setEditForm({...editForm, weeklyHours: Number(e.target.value)})}
                  className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-black dark:text-white px-5 py-4 rounded-xl outline-none focus:border-black dark:focus:border-white transition-all font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Cor de Identificação</label>
                <div className="flex items-center space-x-4">
                  <input 
                    type="color" 
                    value={editForm.color || '#000000'} 
                    onChange={e => setEditForm({...editForm, color: e.target.value})}
                    className="h-14 w-24 cursor-pointer border-none p-1 bg-transparent"
                  />
                  <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">{editForm.color}</span>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Prioridade Estratégica</label>
                <div className="flex flex-wrap gap-4">
                  {Object.values(Priority).map((p) => (
                    <button
                      key={p}
                      onClick={() => setEditForm({...editForm, priority: p as Priority})}
                      className={`px-8 py-3 border text-xs font-black uppercase tracking-widest transition-all rounded-xl ${editForm.priority === p ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-xl scale-105' : 'bg-white dark:bg-black border-gray-200 dark:border-gray-800 text-gray-400 hover:border-black dark:hover:border-white'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-12 flex justify-end space-x-6 pt-10 border-t border-gray-100 dark:border-gray-800">
              <button onClick={() => setIsEditing(null)} className="text-[10px] font-black uppercase text-gray-400 hover:text-black dark:hover:text-white tracking-widest">Cancelar</button>
              <button 
                onClick={handleSave} 
                className="px-12 py-5 bg-black dark:bg-white text-white dark:text-black font-black uppercase text-xs tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all rounded-2xl flex items-center space-x-3"
              >
                <Save size={18} />
                <span>Salvar Parceiro</span>
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clients.map(client => (
            <div key={client.id} className="group bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-900 p-8 rounded-3xl shadow-sm hover:border-black dark:hover:border-white transition-all relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: client.color }} />
              
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-xl font-black text-black dark:text-white tracking-tight leading-tight">{client.name}</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{client.category || 'Geral'}</p>
                </div>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(client)} className="p-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(client.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-50 dark:border-gray-900">
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contrato</span>
                   <div className="flex items-center space-x-1.5 font-bold text-black dark:text-white text-xs">
                      {client.contractType === ContractType.RETAINER ? <ShieldCheck size={14} className="text-black dark:text-white" /> : <Zap size={14} className="text-black dark:text-white" />}
                      <span className="uppercase tracking-tighter">{client.contractType}</span>
                   </div>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-50 dark:border-gray-900">
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Capacidade</span>
                   <span className="font-bold text-black dark:text-white text-xs tracking-tighter">{client.weeklyHours}H / SEMANA</span>
                </div>
                <div className="flex justify-between items-center pt-3">
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</span>
                   <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded tracking-widest ${
                     client.priority === Priority.URGENT ? 'bg-black dark:bg-white text-white dark:text-black' :
                     'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                   }`}>{client.priority}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {clients.length === 0 && !isEditing && (
          <div className="py-24 text-center border-2 border-dashed border-gray-100 dark:border-gray-900 rounded-3xl">
             <Users size={48} className="mx-auto mb-6 text-gray-200 dark:text-gray-800" />
             <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Nenhum parceiro cadastrado</p>
             <button onClick={handleAddNew} className="mt-6 text-[10px] font-black uppercase tracking-widest text-black dark:text-white hover:underline transition-all">Iniciar Registro</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsView;
