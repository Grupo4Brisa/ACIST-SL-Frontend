import { useState } from 'react';
import { useNavigate } from 'react-router';
import { CheckCircle, XCircle, Eye, Calendar, Mail, Phone, Building2, MapPin, FileText, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AprovacaoCadastros() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<'todos' | 'pendente' | 'aprovado' | 'reprovado'>('pendente');

  // Verificar se o usuário tem permissão de aprovador
  const podeAprovar = userProfile === 'aprovador';

  // Mock data - em produção viria de uma API
  const [cadastros, setCadastros] = useState([
    {
      id: 1,
      empresa: 'Tech Solutions Ltda',
      assignedTo: 'João Silva',
      email: 'joao@techsolutions.com.br',
      phone: '(51) 99999-9999',
      city: 'São Leopoldo',
      dataSubmissao: '2026-04-14',
      status: 'pendente',
      progresso: 100,
      cnpj: '12.345.678/0001-90',
      segmento: 'Tecnologia'
    },
    {
      id: 2,
      empresa: 'Comercial ABC S.A.',
      assignedTo: 'Maria Santos',
      email: 'maria@comercialabc.com.br',
      phone: '(51) 98888-8888',
      city: 'Novo Hamburgo',
      dataSubmissao: '2026-04-15',
      status: 'pendente',
      progresso: 100,
      cnpj: '98.765.432/0001-10',
      segmento: 'Comércio'
    },
    {
      id: 3,
      empresa: 'Indústria XYZ Ltda',
      assignedTo: 'Pedro Oliveira',
      email: 'pedro@industriaxyz.com.br',
      phone: '(51) 97777-7777',
      city: 'Sapucaia do Sul',
      dataSubmissao: '2026-04-13',
      status: 'aprovado',
      progresso: 100,
      cnpj: '11.222.333/0001-44',
      segmento: 'Indústria',
      dataAprovacao: '2026-04-14',
      aprovadoPor: 'Você'
    },
    {
      id: 4,
      empresa: 'Serviços Beta ME',
      assignedTo: 'Ana Costa',
      email: 'ana@servicosbeta.com.br',
      phone: '(51) 96666-6666',
      city: 'Canoas',
      dataSubmissao: '2026-04-12',
      status: 'reprovado',
      progresso: 100,
      cnpj: '55.666.777/0001-88',
      segmento: 'Serviços',
      dataReprovacao: '2026-04-13',
      reprovadoPor: 'Você',
      motivoReprovacao: 'Documentação incompleta - falta comprovante de endereço atualizado'
    }
  ]);

  const handleAprovar = (id: number) => {
    if (confirm('Tem certeza que deseja aprovar este cadastro?')) {
      setCadastros(prev =>
        prev.map(c =>
          c.id === id
            ? {
                ...c,
                status: 'aprovado',
                dataAprovacao: new Date().toISOString().split('T')[0],
                aprovadoPor: 'Você'
              }
            : c
        )
      );
      alert('Cadastro aprovado com sucesso!');
    }
  };

  const handleReprovar = (id: number) => {
    console.log("Reprovar", id);

    setCadastros(prev =>
      prev.map(c =>
        c.id === id
          ? {
              ...c,
              status: 'reprovado',
              dataReprovacao: new Date().toISOString().split('T')[0],
              reprovadoPor: 'Teste',
              motivoReprovacao: 'Teste'
            }
          : c
      )
    );
  };

  const cadastrosFiltrados = cadastros.filter(c => {
    if (selectedFilter === 'todos') return true;
    return c.status === selectedFilter;
  });

  const pendentes = cadastros.filter(c => c.status === 'pendente').length;
  const aprovadosCount = cadastros.filter(c => c.status === 'aprovado').length;
  const reprovadosCount = cadastros.filter(c => c.status === 'reprovado').length;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pendente':
        return { label: 'Pendente', color: 'text-orange-700', bg: 'bg-orange-100', icon: Clock };
      case 'aprovado':
        return { label: 'Aprovado', color: 'text-green-700', bg: 'bg-green-100', icon: CheckCircle };
      case 'reprovado':
        return { label: 'Reprovado', color: 'text-red-700', bg: 'bg-red-100', icon: XCircle };
      default:
        return { label: 'Desconhecido', color: 'text-gray-700', bg: 'bg-gray-100', icon: Clock };
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1>Aprovação de Cadastros</h1>
        <p className="text-muted-foreground mt-1">Analise e aprove os cadastros de novos associados</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-8 w-8 text-orange-500" />
            <span className="text-[2rem] leading-none font-bold">{pendentes}</span>
          </div>
          <p className="text-muted-foreground">Aguardando Aprovação</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <span className="text-[2rem] leading-none font-bold">{aprovadosCount}</span>
          </div>
          <p className="text-muted-foreground">Aprovados</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="h-8 w-8 text-red-500" />
            <span className="text-[2rem] leading-none font-bold">{reprovadosCount}</span>
          </div>
          <p className="text-muted-foreground">Reprovados</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg border border-border p-6 mb-6">
        <div className="flex gap-3">
          <button
            onClick={() => setSelectedFilter('todos')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedFilter === 'todos'
                ? 'bg-[#5DA5FF] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos ({cadastros.length})
          </button>
          <button
            onClick={() => setSelectedFilter('pendente')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedFilter === 'pendente'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pendentes ({pendentes})
          </button>
          <button
            onClick={() => setSelectedFilter('aprovado')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedFilter === 'aprovado'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Aprovados ({aprovadosCount})
          </button>
          <button
            onClick={() => setSelectedFilter('reprovado')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedFilter === 'reprovado'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Reprovados ({reprovadosCount})
          </button>
        </div>
      </div>

      {/* Lista de Cadastros */}
      <div className="space-y-4">
        {cadastrosFiltrados.length === 0 ? (
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <p className="text-muted-foreground">Nenhum cadastro encontrado nesta categoria.</p>
          </div>
        ) : (
          cadastrosFiltrados.map(cadastro => {
            const statusConfig = getStatusConfig(cadastro.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={cadastro.id}
                className="bg-card rounded-lg border border-border p-6 hover:border-[#5DA5FF] transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{cadastro.empresa}</h3>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 ${statusConfig.bg} rounded-full`}>
                        <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                        <span className={`text-sm font-semibold ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      CNPJ: {cadastro.cnpj} • Segmento: {cadastro.segmento}
                    </p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p className="flex items-center gap-2 justify-end">
                      <Calendar className="h-4 w-4" />
                      Enviado em {new Date(cadastro.dataSubmissao).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span className="text-muted-foreground">Responsável:</span>
                      <span className="font-medium">{cadastro.assignedTo}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{cadastro.email}</span>
                    </p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-muted-foreground">phone:</span>
                      <span className="font-medium">{cadastro.phone}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-muted-foreground">city:</span>
                      <span className="font-medium">{cadastro.city}</span>
                    </p>
                  </div>
                </div>

                {cadastro.status === 'aprovado' && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
                    <p className="text-sm text-green-800">
                      ✓ Aprovado em {new Date(cadastro.dataAprovacao!).toLocaleDateString('pt-BR')} por {cadastro.aprovadoPor}
                    </p>
                  </div>
                )}

                {cadastro.status === 'reprovado' && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                    <p className="text-sm text-red-800 font-semibold mb-1">
                      ✕ Reprovado em {new Date(cadastro.dataReprovacao!).toLocaleDateString('pt-BR')} por {cadastro.reprovadoPor}
                    </p>
                    <p className="text-sm text-red-700">
                      <span className="font-semibold">Motivo:</span> {cadastro.motivoReprovacao}
                    </p>
                  </div>
                )}

                <div className="flex gap-3 border-t border-border pt-4">
                  <button
                    onClick={() => navigate(`/admin/lead/${cadastro.id}`)}
                    className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    Ver Detalhes
                  </button>

                  {cadastro.status === 'pendente' && podeAprovar && (
                    <>
                      <button
                        onClick={() => handleAprovar(cadastro.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Aprovar
                      </button>
                      <button
                        onClick={() => handleReprovar(cadastro.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <XCircle className="h-4 w-4" />
                        Reprovar
                      </button>
                    </>
                  )}

                  {cadastro.status === 'pendente' && !podeAprovar && (
                    <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm">
                      Apenas aprovadores podem aprovar ou reprovar cadastros
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
