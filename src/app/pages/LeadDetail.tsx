import { useState } from 'react';
import { useParams, Link } from 'react-router';
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  FileText,
  CheckSquare,
  Clock,
  MessageSquare,
  Upload,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { mockLeads, mockHistorico, mockDocumentos, mockTasks, statusLabels } from '../data/mockData';

export default function LeadDetail() {
  const { id } = useParams();
  const lead = mockLeads.find(l => l.id === id);
  const historico = mockHistorico.filter(h => h.leadId === id);
  const documentos = mockDocumentos.filter(d => d.leadId === id);
  const tarefas = mockTasks.filter(t => t.leadId === id);

  const [activeTab, setActiveTab] = useState<'historico' | 'documentos' | 'tarefas'>('historico');
  const [novoComentario, setNovoComentario] = useState('');

  if (!lead) {
    return (
      <div className="p-8">
        <p>Lead não encontrado</p>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getDocStatusColor = (status: string) => {
    const colors = {
      pendente: 'text-gray-600 bg-gray-100',
      enviado: 'text-blue-600 bg-blue-100',
      aprovado: 'text-green-600 bg-green-100',
      rejeitado: 'text-red-600 bg-red-100'
    };
    return colors[status as keyof typeof colors] || colors.pendente;
  };

  const getDocIcon = (status: string) => {
    const icons = {
      pendente: AlertCircle,
      enviado: Clock,
      aprovado: CheckCircle,
      rejeitado: XCircle
    };
    return icons[status as keyof typeof icons] || AlertCircle;
  };

  return (
    <div className="h-full bg-background">
      <div className="bg-card border-b border-border">
        <div className="px-8 py-6">
          <Link to="/admin/funil" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Funil
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="mb-2">{lead.empresaname}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {lead.cnpj}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Criado em {formatDate(lead.createdAt)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-lg">
                {statusLabels[lead.status]}
              </span>
              <Link
                to={`/cadastro/${id}`}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Editar Cadastro
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 p-8">
        <div className="col-span-2 space-y-6">
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="mb-4">Informações de phone</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-muted-foreground text-[0.875rem] mb-1 block">Email</label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{lead.email}</span>
                </div>
              </div>
              <div>
                <label className="text-muted-foreground text-[0.875rem] mb-1 block">phone</label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{lead.phone}</span>
                </div>
              </div>
              <div>
                <label className="text-muted-foreground text-[0.875rem] mb-1 block">Origem</label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{lead.origem}</span>
                </div>
              </div>
              {lead.responsavel && (
                <div>
                  <label className="text-muted-foreground text-[0.875rem] mb-1 block">Responsável</label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{lead.responsavel}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border">
            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveTab('historico')}
                className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 transition-colors ${
                  activeTab === 'historico'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Clock className="h-4 w-4" />
                Histórico
              </button>
              <button
                onClick={() => setActiveTab('documentos')}
                className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 transition-colors ${
                  activeTab === 'documentos'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <FileText className="h-4 w-4" />
                Documentos ({documentos.length})
              </button>
              <button
                onClick={() => setActiveTab('tarefas')}
                className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 transition-colors ${
                  activeTab === 'tarefas'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <CheckSquare className="h-4 w-4" />
                Tarefas ({tarefas.length})
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'historico' && (
                <div>
                  <div className="mb-6">
                    <h4 className="mb-3">Adicionar Comentário</h4>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Adicione uma observação..."
                        className="flex-1 px-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                        value={novoComentario}
                        onChange={e => setNovoComentario(e.target.value)}
                      />
                      <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {historico.map((item, index) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              item.tipo === 'status'
                                ? 'bg-blue-100'
                                : item.tipo === 'documento'
                                ? 'bg-green-100'
                                : 'bg-gray-100'
                            }`}
                          >
                            {item.tipo === 'status' && <CheckCircle className="h-5 w-5 text-blue-600" />}
                            {item.tipo === 'documento' && <FileText className="h-5 w-5 text-green-600" />}
                            {item.tipo === 'acao' && <Clock className="h-5 w-5 text-gray-600" />}
                            {item.tipo === 'comentario' && <MessageSquare className="h-5 w-5 text-gray-600" />}
                          </div>
                          {index < historico.length - 1 && <div className="w-0.5 flex-1 bg-border mt-2" />}
                        </div>
                        <div className="flex-1 pb-6">
                          <p className="mb-1">{item.descricao}</p>
                          <p className="text-[0.875rem] text-muted-foreground">
                            {item.usuario} • {formatDate(item.data)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'documentos' && (
                <div className="space-y-4">
                  {documentos.map(doc => {
                    const StatusIcon = getDocIcon(doc.status);
                    return (
                      <div key={doc.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <p>{doc.name}</p>
                            <p className="text-[0.875rem] text-muted-foreground">
                              {doc.tipo} • Versão {doc.versao}
                              {doc.uploadedAt && ` • ${formatDate(doc.uploadedAt)}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.875rem] ${getDocStatusColor(doc.status)}`}>
                            <StatusIcon className="h-4 w-4" />
                            {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                          </span>
                          {doc.status === 'pendente' ? (
                            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                              <Upload className="h-4 w-4" />
                            </button>
                          ) : (
                            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                              <Download className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <button className="w-full py-3 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 text-muted-foreground hover:text-primary">
                    <Upload className="h-4 w-4" />
                    Adicionar Documento
                  </button>
                </div>
              )}

              {activeTab === 'tarefas' && (
                <div className="space-y-4">
                  {tarefas.map(tarefa => (
                    <div key={tarefa.id} className="flex items-start gap-4 p-4 border border-border rounded-lg">
                      <input type="checkbox" className="mt-1" checked={tarefa.status === 'completed'} readOnly />
                      <div className="flex-1">
                        <p className={tarefa.status === 'completed' ? 'line-through text-muted-foreground' : ''}>
                          {tarefa.titulo}
                        </p>
                        {tarefa.descricao && (
                          <p className="text-[0.875rem] text-muted-foreground mt-1">{tarefa.descricao}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-[0.875rem] text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5" />
                            {tarefa.responsavel}
                          </span>
                          {tarefa.dataVencimento && (
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Intl.DateTimeFormat('pt-BR').format(tarefa.dataVencimento)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-3 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 text-muted-foreground hover:text-primary">
                    <CheckSquare className="h-4 w-4" />
                    Nova Tarefa
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6 flex flex-col">
          <div className="bg-card rounded-lg border border-border p-6 flex-1">
            <h3 className="mb-4">Progresso do Cadastro</h3>
            <div className="mb-4">
              <div className="flex items-center justify-between text-[0.875rem] text-muted-foreground mb-2">
                <span>Completude</span>
                <span>{lead.progresso}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${lead.progresso}%` }}
                />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[0.875rem]">
                {lead.progresso >= 12.5 ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Clock className="h-4 w-4 text-gray-400" />
                )}
                <span className={lead.progresso >= 12.5 ? '' : 'text-muted-foreground'}>Dados cadastrais</span>
              </div>
              <div className="flex items-center gap-2 text-[0.875rem]">
                {lead.progresso >= 25 ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Clock className="h-4 w-4 text-gray-400" />
                )}
                <span className={lead.progresso >= 25 ? '' : 'text-muted-foreground'}>phones</span>
              </div>
              <div className="flex items-center gap-2 text-[0.875rem]">
                {lead.progresso >= 37.5 ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Clock className="h-4 w-4 text-gray-400" />
                )}
                <span className={lead.progresso >= 37.5 ? '' : 'text-muted-foreground'}>Divulgação</span>
              </div>
              <div className="flex items-center gap-2 text-[0.875rem]">
                {lead.progresso >= 50 ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Clock className="h-4 w-4 text-gray-400" />
                )}
                <span className={lead.progresso >= 50 ? '' : 'text-muted-foreground'}>Redes sociais</span>
              </div>
              <div className="flex items-center gap-2 text-[0.875rem]">
                {lead.progresso >= 62.5 ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Clock className="h-4 w-4 text-gray-400" />
                )}
                <span className={lead.progresso >= 62.5 ? '' : 'text-muted-foreground'}>Soluções</span>
              </div>
              <div className="flex items-center gap-2 text-[0.875rem]">
                {lead.progresso >= 75 ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Clock className="h-4 w-4 text-gray-400" />
                )}
                <span className={lead.progresso >= 75 ? '' : 'text-muted-foreground'}>Valores</span>
              </div>
              <div className="flex items-center gap-2 text-[0.875rem]">
                {lead.progresso >= 87.5 ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Clock className="h-4 w-4 text-gray-400" />
                )}
                <span className={lead.progresso >= 87.5 ? '' : 'text-muted-foreground'}>Documentos</span>
              </div>
              <div className="flex items-center gap-2 text-[0.875rem]">
                {lead.progresso === 100 ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Clock className="h-4 w-4 text-gray-400" />
                )}
                <span className={lead.progresso === 100 ? '' : 'text-muted-foreground'}>Termo de adesão</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6 flex-1">
            <h3 className="mb-4">Pendências</h3>
            <div className="space-y-3">
              {documentos.filter(d => d.status === 'pendente').length > 0 && (
                <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-yellow-900 text-[0.875rem]">Documentos pendentes</p>
                    <p className="text-yellow-700 text-[0.75rem] mt-1">
                      {documentos.filter(d => d.status === 'pendente').length} documento(s) aguardando envio
                    </p>
                  </div>
                </div>
              )}
              {tarefas.filter(t => t.status === 'pending').length > 0 && (
                <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <CheckSquare className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-blue-900 text-[0.875rem]">Tarefas abertas</p>
                    <p className="text-blue-700 text-[0.75rem] mt-1">
                      {tarefas.filter(t => t.status === 'pending').length} tarefa(s) em andamento
                    </p>
                  </div>
                </div>
              )}
              {lead.progresso < 100 && (
                <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-orange-900 text-[0.875rem]">Cadastro incompleto</p>
                    <p className="text-orange-700 text-[0.75rem] mt-1">
                      Ainda faltam {100 - lead.progresso}% para conclusão
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
