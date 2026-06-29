import { useState } from 'react';
import { Link } from 'react-router';
import { FileText, Download, Upload, CheckCircle, XCircle, Clock, AlertCircle, Search } from 'lucide-react';
import { mockDocumentos, mockLeads } from '../data/mockData';
import type { DocumentStatus } from '../types';

export default function Documentos() {
  const [filterStatus, setFilterStatus] = useState<DocumentStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocumentos = mockDocumentos.filter(doc => {
    const lead = mockLeads.find(l => l.id === doc.leadId);
    const matchesSearch =
      doc.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead?.empresaNome.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: DocumentStatus) => {
    const icons = {
      pendente: AlertCircle,
      enviado: Clock,
      aprovado: CheckCircle,
      rejeitado: XCircle
    };
    return icons[status];
  };

  const getStatusColor = (status: DocumentStatus) => {
    const colors = {
      pendente: 'text-gray-600 bg-gray-100',
      enviado: 'text-blue-600 bg-blue-100',
      aprovado: 'text-green-600 bg-green-100',
      rejeitado: 'text-red-600 bg-red-100'
    };
    return colors[status];
  };

  const statusLabels = {
    pendente: 'Pendente',
    enviado: 'Enviado',
    aprovado: 'Aprovado',
    rejeitado: 'Rejeitado'
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
  };

  const statusCounts = {
    pendente: mockDocumentos.filter(d => d.status === 'pendente').length,
    enviado: mockDocumentos.filter(d => d.status === 'enviado').length,
    aprovado: mockDocumentos.filter(d => d.status === 'aprovado').length,
    rejeitado: mockDocumentos.filter(d => d.status === 'rejeitado').length
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1>Documentos</h1>
        <p className="text-muted-foreground mt-1">Gestão e validação de documentos dos leads</p>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        {Object.entries(statusCounts).map(([status, count]) => {
          const StatusIcon = getStatusIcon(status as DocumentStatus);
          const color = getStatusColor(status as DocumentStatus);
          return (
            <div key={status} className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`${color} rounded-lg p-3`}>
                  <StatusIcon className="h-5 w-5" />
                </div>
              </div>
              <p className="text-muted-foreground mb-1">{statusLabels[status as DocumentStatus]}</p>
              <p className="text-[2rem] leading-none">{count}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-card rounded-lg border border-border p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por documento ou empresa..."
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as DocumentStatus | 'all')}
          >
            <option value="all">Todos os Status</option>
            {Object.entries(statusLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredDocumentos.map(doc => {
          const lead = mockLeads.find(l => l.id === doc.leadId);
          const StatusIcon = getStatusIcon(doc.status);
          const statusColor = getStatusColor(doc.status);

          return (
            <div key={doc.id} className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="h-7 w-7 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="mb-1">{doc.nome}</h4>
                        {lead && (
                          <Link to={`/admin/lead/${lead.id}`} className="text-[0.875rem] text-primary hover:underline">
                            {lead.empresaNome}
                          </Link>
                        )}
                      </div>
                      <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[0.875rem] ${statusColor}`}>
                        <StatusIcon className="h-4 w-4" />
                        {statusLabels[doc.status]}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-[0.875rem] text-muted-foreground">
                      <span>Tipo: {doc.tipo}</span>
                      <span>Versão: {doc.versao}</span>
                      {doc.uploadedAt && <span>Enviado em: {formatDate(doc.uploadedAt)}</span>}
                    </div>
                    {doc.observacao && (
                      <p className="mt-3 text-[0.875rem] text-muted-foreground p-3 bg-muted rounded-lg">
                        {doc.observacao}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-6">
                  {doc.status === 'enviado' && (
                    <>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Aprovar
                      </button>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                        <XCircle className="h-4 w-4" />
                        Rejeitar
                      </button>
                    </>
                  )}
                  {doc.status === 'pendente' && (
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Upload
                    </button>
                  )}
                  {(doc.status === 'aprovado' || doc.status === 'enviado') && (
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                      <Download className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDocumentos.length === 0 && (
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <p className="text-muted-foreground">Nenhum documento encontrado</p>
        </div>
      )}
    </div>
  );
}
