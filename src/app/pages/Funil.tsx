import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Building2, Mail, Phone, User, Calendar } from 'lucide-react';
import { mockLeads, statusLabels } from '../data/mockData';
import type { Lead, LeadStatus } from '../types';

const stages: { status: string, label: string, color: string }[] = [
  { status: 'aprovado', label: 'Aprovados', color: 'bg-green-100 border-green-300' },
  { status: 'nao_aprovado', label: 'Não Aprovados', color: 'bg-red-100 border-red-300' },
  { status: 'em_analise', label: 'Em Análise', color: 'bg-yellow-100 border-yellow-300' },
  { status: 'incompleto', label: 'Cadastro Incompleto', color: 'bg-orange-100 border-orange-300' }
];

export default function Funil() {
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [leads] = useState<Lead[]>(mockLeads);

  useEffect(() => {
    if (statusFilter) {
      setSelectedStatus(statusFilter);
    }
  }, [statusFilter]);

  const getLeadsByStatus = (status: string) => {
    if (status === 'incompleto') {
      return leads.filter(lead => lead.progresso > 0 && lead.progresso < 100);
    }
    if (status === 'em_analise') {
      return leads.filter(lead =>
        lead.status === 'em_analise' ||
        lead.status === 'documentacao' ||
        lead.status === 'validacao' ||
        lead.status === 'em-phone'
      );
    }
    if (status === 'nao_aprovado') {
      return leads.filter(lead => lead.status === 'nao_aprovado' || lead.status === 'rejeitado');
    }
    return leads.filter(lead => lead.status === status);
  };

  const getFilteredLeads = () => {
    if (selectedStatus === 'all') {
      return leads;
    }
    return getLeadsByStatus(selectedStatus);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(date);
  };

  const filteredLeads = getFilteredLeads();

  return (
    <div className="h-full flex flex-col p-8">
      <div className="mb-6">
        <h1>Funil de Empresas</h1>
        <p className="text-muted-foreground mt-1">Gerencie o acompanhamento de empresas associadas</p>
      </div>

      {/* Filtros por Status */}
      <div className="bg-card rounded-lg border border-border p-4 mb-6">
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedStatus === 'all'
                ? 'bg-[#5DA5FF] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos ({leads.length})
          </button>
          {stages.map(stage => {
            const count = getLeadsByStatus(stage.status).length;
            return (
              <button
                key={stage.status}
                onClick={() => setSelectedStatus(stage.status)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedStatus === stage.status
                    ? stage.color.replace('100', '500').replace('border-', 'bg-').split(' ')[0] + ' text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {stage.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de Empresas */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
          {filteredLeads.length === 0 ? (
            <div className="col-span-full bg-card rounded-lg border border-border p-12 text-center">
              <p className="text-muted-foreground">Nenhuma empresa encontrada neste status.</p>
            </div>
          ) : (
            filteredLeads.map(lead => (
              <Link
                key={lead.id}
                to={`/admin/lead/${lead.id}`}
                className="block bg-card rounded-lg border border-border p-4 hover:shadow-lg hover:border-[#5DA5FF] transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="flex-1 pr-2 font-semibold">{lead.companyName}</h4>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-[0.875rem] text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span className="truncate">{lead.cnpjcpf}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[0.875rem] text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{lead.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[0.875rem] text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{lead.phone}</span>
                  </div>
                </div>

                {lead.assignedTo && (
                  <div className="flex items-center gap-2 text-[0.875rem] mb-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{lead.assignedTo}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-1.5 text-[0.75rem] text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(lead.updatedAt)}</span>
                  </div>
                  <span className="text-[0.75rem] px-2 py-1 bg-secondary/50 text-secondary-foreground rounded">
                    {lead.origem}
                  </span>
                </div>

                {lead.progresso < 100 && lead.progresso > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[0.75rem] text-muted-foreground mb-1">
                      <span>Progresso</span>
                      <span>{lead.progresso}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className="bg-primary h-1.5 rounded-full transition-all"
                        style={{ width: `${lead.progresso}%` }}
                      />
                    </div>
                  </div>
                )}
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

