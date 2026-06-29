import { useState } from 'react';
import { Link } from 'react-router';
import { CheckSquare, Calendar, User, Plus, Filter } from 'lucide-react';
import { mockTasks, mockLeads } from '../data/mockData';
import type { TaskStatus } from '../types';

export default function Tarefas() {
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [filterResponsavel, setFilterResponsavel] = useState('all');

  const filteredTasks = mockTasks.filter(task => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesResponsavel = filterResponsavel === 'all' || task.responsavel === filterResponsavel;
    return matchesStatus && matchesResponsavel;
  });

  const responsaveis = Array.from(new Set(mockTasks.map(t => t.responsavel)));

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
  };

  const isOverdue = (date?: Date) => {
    if (!date) return false;
    return date < new Date();
  };

  const pendingTasks = mockTasks.filter(t => t.status === 'pending').length;
  const completedTasks = mockTasks.filter(t => t.status === 'completed').length;
  const overdueTasks = mockTasks.filter(t => t.status === 'pending' && isOverdue(t.dataVencimento)).length;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1>Tarefas</h1>
          <p className="text-muted-foreground mt-1">Gerencie tarefas e atividades relacionadas aos leads</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Tarefa
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500 rounded-lg p-3">
              <CheckSquare className="h-5 w-5 text-white" />
            </div>
          </div>
          <p className="text-muted-foreground mb-1">Tarefas Pendentes</p>
          <p className="text-[2rem] leading-none">{pendingTasks}</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-500 rounded-lg p-3">
              <Calendar className="h-5 w-5 text-white" />
            </div>
          </div>
          <p className="text-muted-foreground mb-1">Atrasadas</p>
          <p className="text-[2rem] leading-none">{overdueTasks}</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-500 rounded-lg p-3">
              <CheckSquare className="h-5 w-5 text-white" />
            </div>
          </div>
          <p className="text-muted-foreground mb-1">Concluídas</p>
          <p className="text-[2rem] leading-none">{completedTasks}</p>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-6 mb-6">
        <div className="flex gap-4 items-center">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <select
            className="px-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as TaskStatus | 'all')}
          >
            <option value="all">Todos os Status</option>
            <option value="pending">Pendentes</option>
            <option value="completed">Concluídas</option>
          </select>
          <select
            className="px-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
            value={filterResponsavel}
            onChange={e => setFilterResponsavel(e.target.value)}
          >
            <option value="all">Todos os Responsáveis</option>
            {responsaveis.map(resp => (
              <option key={resp} value={resp}>
                {resp}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTasks.map(task => {
          const lead = mockLeads.find(l => l.id === task.leadId);
          const overdue = isOverdue(task.dataVencimento);

          return (
            <div
              key={task.id}
              className={`bg-card rounded-lg border p-6 ${
                overdue && task.status === 'pending' ? 'border-red-300 bg-red-50/50' : 'border-border'
              }`}
            >
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={task.status === 'completed'}
                  className="mt-1 w-5 h-5 rounded border-border"
                  readOnly
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className={task.status === 'completed' ? 'line-through text-muted-foreground' : ''}>
                        {task.titulo}
                      </h4>
                      {lead && (
                        <Link to={`/admin/lead/${lead.id}`} className="text-[0.875rem] text-primary hover:underline">
                          {lead.empresaNome}
                        </Link>
                      )}
                    </div>
                    {overdue && task.status === 'pending' && (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-[0.875rem] ml-4">
                        Atrasada
                      </span>
                    )}
                  </div>

                  {task.descricao && (
                    <p className="text-[0.875rem] text-muted-foreground mb-3">{task.descricao}</p>
                  )}

                  <div className="flex items-center gap-6 text-[0.875rem] text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{task.responsavel}</span>
                    </div>
                    {task.dataVencimento && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span className={overdue && task.status === 'pending' ? 'text-red-600' : ''}>
                          {formatDate(task.dataVencimento)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Criada em {formatDate(task.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTasks.length === 0 && (
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <p className="text-muted-foreground">Nenhuma tarefa encontrada</p>
        </div>
      )}
    </div>
  );
}
