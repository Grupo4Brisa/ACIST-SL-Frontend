import { useEffect, useState as useStateHook } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle, Clock, AlertCircle, Calendar, Bell, User, Mail, Building2, LogOut, Edit, CreditCard, ArrowRight, Users, Search, Phone, MapPin, Filter } from 'lucide-react';
import Logo from '../components/Logo';
import { useState } from 'react';
import Header from "../components/Header/Header";
import Footer from '../components/Footer/Footer';

export default function AreaAssociado() {
  const navigate = useNavigate();
  const [buscaTermo, setBuscaTermo] = useState('');
  const [ramoFiltro, setRamoFiltro] = useState('Todos');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;

  const handleLogout = () => {
    navigate('/');
  };

  // Mock data - Lista de associados
  const associadosLista = [
    { id: 1, name: 'Tech Solutions Ltda', ramo: 'Tecnologia', phone: '(51) 3456-7890', city: 'São Leopoldo' },
    { id: 2, name: 'Construção Forte', ramo: 'Indústria', phone: '(51) 3456-7891', city: 'São Leopoldo' },
    { id: 3, name: 'Sabor da Terra', ramo: 'Alimentação', phone: '(51) 3456-7892', city: 'São Leopoldo' },
    { id: 4, name: 'Moda & Estilo', ramo: 'Loja', phone: '(51) 3456-7893', city: 'Novo Hamburgo' },
    { id: 5, name: 'Clínica Saúde Total', ramo: 'Saúde', phone: '(51) 3456-7894', city: 'São Leopoldo' },
    { id: 6, name: 'DigitalMark Agência', ramo: 'Serviços', phone: '(51) 3456-7895', city: 'São Leopoldo' },
    { id: 7, name: 'AutoTech Oficina', ramo: 'Serviços', phone: '(51) 3456-7896', city: 'Portão' },
    { id: 8, name: 'Indústria MecaPro', ramo: 'Indústria', phone: '(51) 3456-7897', city: 'São Leopoldo' }
  ];

  const ramos = ['Todos', 'Tecnologia', 'Loja', 'Indústria', 'Alimentação', 'Serviços', 'Saúde'];

  // Filtrar associados
  const associadosFiltrados = associadosLista.filter(assoc => {
    const matchBusca = buscaTermo === '' ||
      assoc.name.toLowerCase().includes(buscaTermo.toLowerCase()) ||
      assoc.ramo.toLowerCase().includes(buscaTermo.toLowerCase());

    const matchRamo = ramoFiltro === 'Todos' || assoc.ramo === ramoFiltro;

    return matchBusca && matchRamo;
  });

  // Paginação
  const totalPaginas = Math.ceil(associadosFiltrados.length / itensPorPagina);
  const indiceInicio = (paginaAtual - 1) * itensPorPagina;
  const indiceFim = indiceInicio + itensPorPagina;
  const associadosPaginados = associadosFiltrados.slice(indiceInicio, indiceFim);

  // Reset página ao filtrar
  const handleBusca = (termo: string) => {
    setBuscaTermo(termo);
    setPaginaAtual(1);
  };

  const handleFiltroRamo = (ramo: string) => {
    setRamoFiltro(ramo);
    setPaginaAtual(1);
  };

  const associado = {
    name: 'Tech Solutions Ltda',
    email: 'phone@techsolutions.com.br',
    status: 'aprovado' // 'em_analise' | 'aprovado' | 'pendente_documentos'
  };

  const eventos = [
    {
      id: 1,
      name: 'Café de Negócios - Networking',
      data: '2026-04-25',
      local: 'Sede ACIST'
    },
    {
      id: 2,
      name: 'Workshop: Marketing Digital para Empresas',
      data: '2026-05-02',
      local: 'Auditório ACIST'
    },
    {
      id: 3,
      name: 'Assembleia Geral de Associados',
      data: '2026-05-15',
      local: 'Sede ACIST'
    }
  ];

  const [comunicados, setComunicados] = useStateHook<{id:number;title:string;content:string;createdAt:string}[]>([]);

  useEffect(() => {
    api.get('/announcements')
      .then(res => {
        const ativos = (Array.isArray(res.data) ? res.data : []).filter((a: any) => a.active);
        setComunicados(ativos);
      })
      .catch(() => {});
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'aprovado':
        return {
          label: 'Aprovado',
          color: 'text-green-700',
          bg: 'bg-green-100',
          icon: CheckCircle,
          progress: 100
        };
      case 'em_analise':
        return {
          label: 'Em Análise',
          color: 'text-blue-700',
          bg: 'bg-blue-100',
          icon: Clock,
          progress: 50
        };
      case 'pendente_documentos':
        return {
          label: 'Pendente de Documentos',
          color: 'text-orange-700',
          bg: 'bg-orange-100',
          icon: AlertCircle,
          progress: 30
        };
      default:
        return {
          label: 'Desconhecido',
          color: 'text-gray-700',
          bg: 'bg-gray-100',
          icon: Clock,
          progress: 0
        };
    }
  };

  const statusConfig = getStatusConfig(associado.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0C3A59] to-[#226897] flex flex-col">
      {/* Header */}
      <Header
        showHomeButton={true}
        showEmployeeArea={true}
        showAssociateArea={true}
      />

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-white text-3xl font-semibold mb-2">
            Bem-vindo, {associado.name}!
          </h1>
          <p className="text-blue-100">
            Acompanhe aqui seu status de associação e as novidades da ACIST
          </p>
        </div>

        {/* Grid de Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* Status do Cadastro */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 ${statusConfig.bg} rounded-xl`}>
                <StatusIcon className={`h-6 w-6 ${statusConfig.color}`} />
              </div>
              <div>
                <h2 className="text-[#0C3A59] text-xl font-semibold">Status do Cadastro</h2>
                <p className="text-gray-600 text-sm">Acompanhe sua situação</p>
              </div>
            </div>

            <div className={`inline-flex items-center gap-2 px-4 py-2 ${statusConfig.bg} rounded-lg mb-4`}>
              <StatusIcon className={`h-5 w-5 ${statusConfig.color}`} />
              <span className={`font-semibold ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
            </div>

            {/* Barra de Progresso */}
            <div className="mb-3">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progresso</span>
                <span>{statusConfig.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-[#5DA5FF] h-3 rounded-full transition-all"
                  style={{ width: `${statusConfig.progress}%` }}
                />
              </div>
            </div>

            {associado.status === 'aprovado' && (
              <p className="text-sm text-gray-600 mt-4">
                ✓ Seu cadastro foi aprovado! Você já pode usufruir de todos os benefícios de ser associado.
              </p>
            )}
            {associado.status === 'em_analise' && (
              <p className="text-sm text-gray-600 mt-4">
                Seu cadastro está em análise pela nossa equipe. Em breve você receberá um retorno.
              </p>
            )}
            {associado.status === 'pendente_documentos' && (
              <p className="text-sm text-gray-600 mt-4">
                ⚠️ Alguns documentos ainda precisam ser enviados. Entre em phone conosco.
              </p>
            )}
          </div>

          {/* Dados do Associado */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <User className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <h2 className="text-[#0C3A59] text-xl font-semibold">Meus Dados</h2>
                  <p className="text-gray-600 text-sm">Informações cadastrais</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Edit className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Empresa</p>
                  <p className="text-gray-900 font-medium">{associado.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900 font-medium">{associado.email}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/cadastro/edit')}
              className="w-full mt-6 px-4 py-2.5 border border-[#5DA5FF] text-[#5DA5FF] rounded-lg hover:bg-blue-50 transition-colors"
            >
              Editar Dados
            </button>
          </div>

          {/* Mensalidades */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <CreditCard className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <h2 className="text-[#0C3A59] text-xl font-semibold">Mensalidades</h2>
                <p className="text-gray-600 text-sm">Situação financeira</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Situação</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-700">Em Dia</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  Todas as mensalidades estão pagas
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-[#0C3A59]">5</p>
                  <p className="text-sm text-gray-600">Pagas</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-700">1</p>
                  <p className="text-sm text-gray-600">Em Aberto</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/mensalidades')}
              className="w-full mt-6 px-4 py-2.5 bg-[#5DA5FF] text-white rounded-lg hover:bg-[#226897] transition-colors"
            >
              Ver Mensalidades
            </button>
          </div>
        </div>

        {/* Busca de Associados - Networking */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="h-6 w-6 text-[#5DA5FF]" />
              </div>
              <div>
                <h2 className="text-[#0C3A59] text-xl font-semibold">Rede de Associados</h2>
                <p className="text-gray-600 text-sm">Conecte-se com empresários da região</p>
              </div>
            </div>

            {/* Busca e Filtro */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por name ou ramo..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                  value={buscaTermo}
                  onChange={(e) => handleBusca(e.target.value)}
                />
              </div>
              <div className="flex gap-2 items-center">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={ramoFiltro}
                  onChange={(e) => handleFiltroRamo(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                >
                  {ramos.map((ramo) => (
                    <option key={ramo} value={ramo}>
                      {ramo}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Resultados */}
            <div className="space-y-3 mb-4">
              {associadosFiltrados.length > 0 ? (
                associadosPaginados.map((assoc) => (
                  <div
                    key={assoc.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-[#5DA5FF] hover:bg-blue-50 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#0C3A59] mb-2">{assoc.name}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            {assoc.ramo}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-4 w-4 text-gray-400" />
                            {assoc.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            {assoc.city}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Nenhum associado encontrado</p>
                  <p className="text-sm text-gray-400 mt-1">Tente ajustar sua busca ou filtro</p>
                </div>
              )}
            </div>

            {/* Paginação e Total */}
            {associadosFiltrados.length > 0 && (
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Mostrando {indiceInicio + 1}-{Math.min(indiceFim, associadosFiltrados.length)} de {associadosFiltrados.length}
                  </p>

                  {totalPaginas > 1 && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPaginaAtual(paginaAtual - 1)}
                        disabled={paginaAtual === 1}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Anterior
                      </button>
                      <div className="flex items-center gap-1">
                        {[...Array(totalPaginas)].map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setPaginaAtual(index + 1)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                              paginaAtual === index + 1
                                ? 'bg-[#5DA5FF] text-white'
                                : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {index + 1}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setPaginaAtual(paginaAtual + 1)}
                        disabled={paginaAtual === totalPaginas}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Próxima
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Eventos e Avisos */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Eventos */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Calendar className="h-6 w-6 text-purple-700" />
              </div>
              <div>
                <h2 className="text-[#0C3A59] text-xl font-semibold">Próximos Eventos</h2>
                <p className="text-gray-600 text-sm">Não perca as oportunidades</p>
              </div>
            </div>

            <div className="space-y-4">
              {eventos.map(evento => (
                <div
                  key={evento.id}
                  onClick={() => navigate(`/evento/${evento.id}`)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-[#5DA5FF] hover:bg-blue-50 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#5DA5FF] transition-colors">
                        {evento.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(evento.data).toLocaleDateString('pt-BR')}
                        </span>
                        <span>📍 {evento.local}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-[#5DA5FF] transition-colors" />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/eventos')}
              className="w-full mt-4 px-4 py-2.5 border border-[#5DA5FF] text-[#5DA5FF] rounded-lg hover:bg-blue-50 transition-colors"
            >
              Ver Todos os Eventos
            </button>
          </div>

          {/* Informações Importantes */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Bell className="h-6 w-6 text-yellow-700" />
              </div>
              <div>
                <h2 className="text-[#0C3A59] text-xl font-semibold">Avisos Importantes</h2>
                <p className="text-gray-600 text-sm">Fique por dentro</p>
              </div>
            </div>

            <div className="space-y-4">
              {comunicados.length > 0 ? (
                comunicados.map(comunicado => (
                  <div
                    key={comunicado.id}
                    className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{comunicado.title}</h3>
                      <span className="text-xs text-gray-500">
                        {new Date(comunicado.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{comunicado.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Nenhum aviso no momento.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}

      <Footer />

    </div>
  );
}
