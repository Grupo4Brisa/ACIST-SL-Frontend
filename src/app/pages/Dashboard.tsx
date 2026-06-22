import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, CheckCircle, Clock, AlertCircle, ArrowRight, Globe, UserCheck, Award, Target } from 'lucide-react';
import { useNavigate } from 'react-router';
import { mockLeads } from '../data/mockData';

const conversionData = [
  { id: 'leads', etapa: 'Leads', total: 120, conversao: 100 },
  { id: 'contato', etapa: 'Em Contato', total: 85, conversao: 71 },
  { id: 'cadastro', etapa: 'Cadastro', total: 60, conversao: 50 },
  { id: 'docs', etapa: 'Documentação', total: 35, conversao: 29 },
  { id: 'validacao', etapa: 'Validação', total: 22, conversao: 18 },
  { id: 'aprovado', etapa: 'Aprovado', total: 18, conversao: 15 }
];

const trendData = [
  { id: 'out', mes: 'Out', leads: 45, aprovados: 12 },
  { id: 'nov', mes: 'Nov', leads: 52, aprovados: 15 },
  { id: 'dez', mes: 'Dez', leads: 61, aprovados: 18 },
  { id: 'jan', mes: 'Jan', leads: 58, aprovados: 16 },
  { id: 'fev', mes: 'Fev', leads: 68, aprovados: 21 },
  { id: 'mar', mes: 'Mar', leads: 75, aprovados: 24 },
  { id: 'abr', mes: 'Abr', leads: 82, aprovados: 28 }
];

// Dados de origem dos associados
const origemData = [
  { id: 'site', nome: 'Site', value: 45, color: '#5DA5FF' },
  { id: 'vendedor', nome: 'Vendedores', value: 32, color: '#10b981' },
  { id: 'evento', nome: 'Eventos', value: 18, color: '#f59e0b' },
  { id: 'indicacao', nome: 'Indicação', value: 15, color: '#8b5cf6' },
  { id: 'outro', nome: 'Outros', value: 10, color: '#6b7280' }
];

// Ranking de vendedores
const vendedoresData = [
  { id: '1', nome: 'Carlos Silva', associados: 12, conversao: 75, meta: 15 },
  { id: '2', nome: 'Maria Santos', associados: 10, conversao: 80, meta: 15 },
  { id: '3', nome: 'João Oliveira', associados: 8, conversao: 67, meta: 12 },
  { id: '4', nome: 'Ana Costa', associados: 7, conversao: 70, meta: 10 },
  { id: '5', nome: 'Pedro Souza', associados: 5, conversao: 63, meta: 10 }
];

// Dados de porte da empresa
const porteData = [
  { id: 'mei', porte: 'MEI', quantidade: 28 },
  { id: 'pequena', porte: 'Pequena', quantidade: 45 },
  { id: 'media', porte: 'Média', quantidade: 32 },
  { id: 'grande', porte: 'Grande', quantidade: 15 }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const totalLeads = mockLeads.length;
  const emAndamento = mockLeads.filter(l => !['aprovado', 'leads'].includes(l.status)).length;
  const aprovados = mockLeads.filter(l => l.status === 'aprovado').length;
  const cadastrosIncompletos = mockLeads.filter(l => l.progresso < 100 && l.progresso > 0).length;

  const naoAprovados = mockLeads.filter(l => l.status === 'nao_aprovado' || l.status === 'rejeitado').length;
  const emAnalise = mockLeads.filter(l => l.status === 'em_analise' || l.status === 'documentacao' || l.status === 'validacao').length;

  // Métricas de captação
  const totalOrigemSite = origemData.find(o => o.id === 'site')?.value || 0;
  const totalOrigemVendedor = origemData.find(o => o.id === 'vendedor')?.value || 0;
  const taxaConversao = Math.round((aprovados / totalLeads) * 100);
  const melhorVendedor = vendedoresData[0];

  const stats = [
    {
      name: 'Total de Empresas',
      value: totalLeads,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12% vs mês anterior',
      onClick: () => navigate('/admin/funil')
    },
    {
      name: 'Aprovados',
      value: aprovados,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: 'Taxa de conversão: 15%',
      onClick: () => navigate('/admin/funil?status=aprovado')
    },
    {
      name: 'Em Análise',
      value: emAnalise,
      icon: Clock,
      color: 'bg-yellow-500',
      change: `${emAnalise} em processo`,
      onClick: () => navigate('/admin/funil?status=em_analise')
    },
    {
      name: 'Não Aprovados',
      value: naoAprovados,
      icon: AlertCircle,
      color: 'bg-red-500',
      change: 'Necessitam revisão',
      onClick: () => navigate('/admin/funil?status=nao_aprovado')
    },
    {
      name: 'Cadastros Incompletos',
      value: cadastrosIncompletos,
      icon: AlertCircle,
      color: 'bg-orange-500',
      change: 'Necessitam atenção',
      onClick: () => navigate('/admin/funil?status=incompleto')
    }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1>Dashboard</h1>
        <p className="text-muted-foreground mt-1">Visão geral do funil de conversão</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            onClick={stat.onClick}
            className="bg-card rounded-lg border border-border p-6 cursor-pointer hover:border-[#5DA5FF] hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} rounded-lg p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-[#5DA5FF] transition-colors" />
            </div>
            <div>
              <p className="text-muted-foreground mb-1">{stat.name}</p>
              <p className="text-[2rem] leading-none mb-2">{stat.value}</p>
              <p className="text-muted-foreground text-[0.875rem]">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Métricas de Captação */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Métricas de Captação</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500 rounded-lg p-3">
                <Globe className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Captados pelo Site</p>
              <p className="text-[2rem] leading-none mb-2">{totalOrigemSite}</p>
              <p className="text-muted-foreground text-[0.875rem]">37.5% do total</p>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-500 rounded-lg p-3">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Captados por Vendedores</p>
              <p className="text-[2rem] leading-none mb-2">{totalOrigemVendedor}</p>
              <p className="text-muted-foreground text-[0.875rem]">26.7% do total</p>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-500 rounded-lg p-3">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Taxa de Conversão</p>
              <p className="text-[2rem] leading-none mb-2">{taxaConversao}%</p>
              <p className="text-muted-foreground text-[0.875rem]">+2% vs mês anterior</p>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-500 rounded-lg p-3">
                <Award className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Melhor Vendedor</p>
              <p className="text-[1.125rem] leading-none mb-2 font-semibold">{melhorVendedor.nome}</p>
              <p className="text-muted-foreground text-[0.875rem]">{melhorVendedor.associados} associados</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="mb-6">Conversão por Etapa</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="etapa" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Total" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="mb-6">Tendência de Leads e Aprovações</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="Leads" />
              <Line type="monotone" dataKey="aprovados" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Aprovados" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-6 mt-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-[0.875rem] text-muted-foreground">Leads</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-[0.875rem] text-muted-foreground">Aprovados</span>
            </div>
          </div>
        </div>
      </div>

      {/* Novos Gráficos de Captação */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Gráfico de Origem */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="mb-6">Origem dos Associados</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={origemData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ nome, value }) => `${nome}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {origemData.map((entry, index) => (
                  <Cell key={`cell-${entry.id}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            {origemData.map((origem) => (
              <div key={origem.id} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: origem.color }} />
                <span className="text-[0.875rem] text-muted-foreground">{origem.nome}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quantidade por Porte */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="mb-6">Associados por Porte</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={porteData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="porte" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#5DA5FF" radius={[4, 4, 0, 0]} name="Quantidade" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ranking de Vendedores */}
      <div className="bg-card rounded-lg border border-border p-6 mb-8">
        <h3 className="mb-6">Ranking de Vendedores</h3>
        <div className="space-y-4">
          {vendedoresData.map((vendedor, index) => (
            <div
              key={vendedor.id}
              className="flex items-center gap-4 p-4 border border-border rounded-lg hover:border-[#5DA5FF] transition-colors"
            >
              {/* Posição */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                index === 0 ? 'bg-yellow-100 text-yellow-700' :
                index === 1 ? 'bg-gray-100 text-gray-700' :
                index === 2 ? 'bg-orange-100 text-orange-700' :
                'bg-blue-50 text-blue-700'
              }`}>
                {index + 1}°
              </div>

              {/* Nome */}
              <div className="flex-1">
                <p className="font-semibold">{vendedor.nome}</p>
                <p className="text-sm text-muted-foreground">
                  {vendedor.associados} associados • Taxa de conversão: {vendedor.conversao}%
                </p>
              </div>

              {/* Progresso da Meta */}
              <div className="w-48">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Meta</span>
                  <span className="font-semibold">{vendedor.associados}/{vendedor.meta}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      (vendedor.associados / vendedor.meta) * 100 >= 100 ? 'bg-green-500' :
                      (vendedor.associados / vendedor.meta) * 100 >= 80 ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min((vendedor.associados / vendedor.meta) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Badge se atingiu meta */}
              {vendedor.associados >= vendedor.meta && (
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Meta atingida
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="mb-4">Gargalos Identificados</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-yellow-900">Conversão Cadastro → Documentação</p>
              <p className="text-yellow-700 text-[0.875rem] mt-1">
                Taxa de conversão de 58%. {cadastrosIncompletos} cadastros estão parados há mais de 3 dias.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-blue-900">Oportunidade de Melhoria</p>
              <p className="text-blue-700 text-[0.875rem] mt-1">
                Leads vindos de QR Code têm 25% mais taxa de conversão. Considere expandir essa estratégia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
