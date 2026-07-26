import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  Mail,
  Phone,
  Building2,
  MapPin,
  Clock,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import api from '../services/api';

interface Company {
  id: number;
  companyName: string;
  corporateName: string;
  email: string;
  phone: string;
  city: string;
  cnpjcpf: string;
  companySize: string;
  status: string;
  createdAt: string;
}

export default function AprovacaoCadastros() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const [selectedFilter, setSelectedFilter] = useState<
    'todos' | 'pendente' | 'aprovado' | 'reprovado'
  >('pendente');

  const [cadastros, setCadastros] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const podeAprovar =
    user?.role === 'COLABORADOR_ADMIN' ||
    user?.role === 'COLABORADOR_APROVADOR';

  useEffect(() => {
    carregarCadastros();
  }, []);

  async function carregarCadastros() {
    try {
      setLoading(true);

      const response = await api.get('/companies');

      setCadastros(response.data);
    } catch (error) {
      console.error(error);
      alert('Erro ao carregar cadastros.');
    } finally {
      setLoading(false);
    }
  }

  async function handleAprovar(id: number) {
    const confirmar = confirm(
      'Deseja realmente aprovar este cadastro?'
    );

    if (!confirmar) return;

    try {
      await api.patch(`/companies/${id}/approve`);

      alert('Cadastro aprovado com sucesso.');

      carregarCadastros();
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || 'Erro ao aprovar cadastro.');
    }
  }

  async function handleReprovar(id: number) {
    const motivo = prompt(
      'Informe o motivo da reprovação:'
    );

    if (!motivo) return;

    try {
      await api.patch(`/companies/${id}/reject`, {
        reason: motivo,
      });

      alert('Cadastro reprovado.');

      carregarCadastros();
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || 'Erro ao reprovar cadastro.');
    }
  }

  const cadastrosFiltrados = cadastros.filter((cadastro) => {
    if (selectedFilter === 'todos') return true;

    if (
      selectedFilter === 'pendente' &&
      (cadastro.status === 'PENDING_APPROVAL' || cadastro.status === 'INCOMPLETE')
    )
      return true;

    if (
      selectedFilter === 'aprovado' &&
      cadastro.status === 'ACTIVE'
    )
      return true;

    if (
      selectedFilter === 'reprovado' &&
      cadastro.status === 'INACTIVE'
    )
      return true;

    return false;
  });

  const pendentes = cadastros.filter(
    (c) => c.status === 'PENDING_APPROVAL' || c.status === 'INCOMPLETE'
  ).length;

  const aprovadosCount = cadastros.filter(
    (c) => c.status === 'ACTIVE'
  ).length;

  const reprovadosCount = cadastros.filter(
    (c) => c.status === 'INACTIVE'
  ).length;

  function getStatusConfig(status: string) {
    switch (status) {
      case 'PENDING_APPROVAL':
        return {
          label: 'Aguardando Aprovação',
          color: 'text-orange-700',
          bg: 'bg-orange-100',
          icon: Clock,
        };

      case 'ACTIVE':
        return {
          label: 'Aprovado',
          color: 'text-green-700',
          bg: 'bg-green-100',
          icon: CheckCircle,
        };

      case 'INACTIVE':
        return {
          label: 'Reprovado',
          color: 'text-red-700',
          bg: 'bg-red-100',
          icon: XCircle,
        };

      case 'INCOMPLETE':
        return {
          label: 'Aguardando Aprovação',
          color: 'text-orange-700',
          bg: 'bg-orange-100',
          icon: Clock,
        };

      default:
        return {
          label: status,
          color: 'text-gray-700',
          bg: 'bg-gray-100',
          icon: Clock,
        };
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <h2>Carregando cadastros...</h2>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1>Aprovação de Cadastros</h1>

        <p className="text-muted-foreground mt-1">
          Analise e aprove os cadastros de novos associados
        </p>
      </div>
            {/* Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-8 w-8 text-orange-500" />
            <span className="text-[2rem] leading-none font-bold">
              {pendentes}
            </span>
          </div>

          <p className="text-muted-foreground">
            Aguardando Aprovação
          </p>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <span className="text-[2rem] leading-none font-bold">
              {aprovadosCount}
            </span>
          </div>

          <p className="text-muted-foreground">
            Aprovados
          </p>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="h-8 w-8 text-red-500" />
            <span className="text-[2rem] leading-none font-bold">
              {reprovadosCount}
            </span>
          </div>

          <p className="text-muted-foreground">
            Reprovados
          </p>
        </div>
      </div>

      {/* Filtros */}
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

      {/* Lista */}
      <div className="space-y-4">
        {cadastrosFiltrados.length === 0 ? (
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <p className="text-muted-foreground">
              Nenhum cadastro encontrado.
            </p>
          </div>
        ) : (
          cadastrosFiltrados.map((cadastro) => {
            const statusConfig = getStatusConfig(
              cadastro.status,
            );

            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={cadastro.id}
                className="bg-card rounded-lg border border-border p-6 hover:border-[#5DA5FF] transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-xl font-semibold">
                        {cadastro.companyName}
                      </h3>

                      {/* BADGE CADASTRO */}
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${
                        cadastro.status === 'INCOMPLETE'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {cadastro.status === 'INCOMPLETE' ? 'Cadastro Incompleto' : 'Cadastro Completo'}
                      </div>

                      {/* BADGE APROVAÇÃO */}
                      <div className={`inline-flex items-center gap-2 px-3 py-1 ${statusConfig.bg} rounded-full`}>
                        <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                        <span className={`text-sm font-semibold ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm">
                      CNPJ/CPF: {cadastro.cnpjcpf}
                    </p>
                  </div>

                  <div className="text-right text-sm text-muted-foreground">
                    <p className="flex items-center gap-2 justify-end">
                      <Calendar className="h-4 w-4" />

                      {new Date(
                        cadastro.createdAt,
                      ).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span className="text-muted-foreground">
                        Razão Social:
                      </span>

                      <span className="font-medium">
                        {cadastro.corporateName}
                      </span>
                    </p>

                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />

                      <span className="text-muted-foreground">
                        Email:
                      </span>

                      <span className="font-medium">
                        {cadastro.email}
                      </span>
                    </p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />

                      <span className="text-muted-foreground">
                        Telefone:
                      </span>

                      <span className="font-medium">
                        {cadastro.phone}
                      </span>
                    </p>

                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />

                      <span className="text-muted-foreground">
                        Cidade:
                      </span>

                      <span className="font-medium">
                        {cadastro.city}
                      </span>
                    </p>
                  </div>
                </div>
                                <div className="flex gap-3 border-t border-border pt-4">
                  <button
                    onClick={() =>
                      navigate(`/admin/company/${cadastro.id}`)
                    }
                    className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    Ver Detalhes
                  </button>

                  {cadastro.status === "PENDING_APPROVAL" &&
                    podeAprovar && (
                      <>
                        <button
                          onClick={() =>
                            handleAprovar(cadastro.id)
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Aprovar
                        </button>

                        <button
                          onClick={() =>
                            handleReprovar(cadastro.id)
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <XCircle className="h-4 w-4" />
                          Reprovar
                        </button>
                      </>
                    )}

                  {cadastro.status === "PENDING_APPROVAL" &&
                    !podeAprovar && (
                      <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm">
                        Apenas usuários com perfil de
                        aprovador podem aprovar ou
                        reprovar cadastros.
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