import { useState } from 'react';
import { Link } from 'react-router';
import { Search, Filter, Building2, Mail, Phone, User } from 'lucide-react';
import { mockLeads, statusLabels } from '../data/mockData';
import type { LeadStatus } from '../types';

export default function Cadastros() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<LeadStatus | 'all'>('all');
  const [filterPorte, setFilterPorte] = useState<string>('all');

  const filteredLeads = mockLeads.filter(lead => {
    const matchesSearch =
      lead.empresaNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.cnpj.includes(searchTerm) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;

    // Filtro por porte (baseado no número de funcionários - simulado)
    let matchesPorte = true;
    if (filterPorte !== 'all') {
      // Em produção, isso viria dos dados do lead
      // Por ora, vamos simular baseado no ID
      const leadPorte = lead.id % 4; // 0-3 para simular diferentes portes
      matchesPorte = filterPorte === leadPorte.toString();
    }

    return matchesSearch && matchesStatus && matchesPorte;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1>Cadastros</h1>
        <p className="text-muted-foreground mt-1">Gestão de todos os cadastros de leads e associados</p>
      </div>

      <div className="bg-card rounded-lg border border-border p-6 mb-6">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por empresa, CNPJ ou email..."
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <select
              className="pl-10 pr-8 py-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary appearance-none min-w-[180px]"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as LeadStatus | 'all')}
            >
              <option value="all">Todos os Status</option>
              <option value="aprovado">Aprovado</option>
              <option value="nao_aprovado">Não Aprovado</option>
              <option value="em_analise">Em Análise</option>
              <option value="cadastro-iniciado">Cadastro Incompleto</option>
            </select>
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <select
              className="pl-10 pr-8 py-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary appearance-none min-w-[180px]"
              value={filterPorte}
              onChange={e => setFilterPorte(e.target.value)}
            >
              <option value="all">Todos os Portes</option>
              <option value="0">MEI</option>
              <option value="1">Até 5 funcionários</option>
              <option value="2">6 a 25 funcionários</option>
              <option value="3">26+ funcionários</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left">Empresa</th>
              <th className="px-6 py-4 text-left">Contato</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Responsável</th>
              <th className="px-6 py-4 text-left">Progresso</th>
              <th className="px-6 py-4 text-left">Atualizado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredLeads.map(lead => (
              <tr key={lead.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <Link to={`/admin/lead/${lead.id}`} className="hover:text-primary">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p>{lead.empresaNome}</p>
                        <p className="text-[0.875rem] text-muted-foreground">{lead.cnpj}</p>
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[0.875rem]">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">{lead.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[0.875rem]">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">{lead.telefone}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-[0.875rem] whitespace-nowrap">
                    {statusLabels[lead.status]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {lead.responsavel && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-[0.875rem]">{lead.responsavel}</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="w-32">
                    <div className="flex items-center justify-between text-[0.75rem] text-muted-foreground mb-1">
                      <span>{lead.progresso}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className="bg-primary h-1.5 rounded-full transition-all"
                        style={{ width: `${lead.progresso}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[0.875rem] text-muted-foreground">{formatDate(lead.updatedAt)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredLeads.length === 0 && (
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <p className="text-muted-foreground">Nenhum cadastro encontrado</p>
        </div>
      )}
    </div>
  );
}
