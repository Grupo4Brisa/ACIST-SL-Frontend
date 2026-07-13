import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Target, Clock } from 'lucide-react';
import { mockLeads } from '../data/mockData';

const origemData = mockLeads.reduce((acc, lead) => {
  const origem = lead.origem.split('-')[0].trim();
  const existing = acc.find(item => item.name === origem);
  if (existing) {
    existing.value += 1;
  } else {
    acc.push({ id: origem.toLowerCase().replace(/\s+/g, '-'), name: origem, value: 1 });
  }
  return acc;
}, [] as { id: string; name: string; value: number }[]);

const assignedToData = mockLeads.reduce((acc, lead) => {
  if (lead.assignedTo) {
    const existing = acc.find(item => item.name === lead.assignedTo);
    if (existing) {
      existing.total += 1;
      if (lead.status === 'aprovado') existing.aprovados += 1;
    } else {
      acc.push({
        id: lead.assignedTo.toLowerCase().replace(/\s+/g, '-'),
        name: lead.assignedTo,
        total: 1,
        aprovados: lead.status === 'aprovado' ? 1 : 0
      });
    }
  }
  return acc;
}, [] as { id: string; name: string; total: number; aprovados: number }[]);

const progressoData = [
  { id: 'p0-25', faixa: '0-25%', quantidade: mockLeads.filter(l => l.progresso >= 0 && l.progresso < 25).length },
  { id: 'p25-50', faixa: '25-50%', quantidade: mockLeads.filter(l => l.progresso >= 25 && l.progresso < 50).length },
  { id: 'p50-75', faixa: '50-75%', quantidade: mockLeads.filter(l => l.progresso >= 50 && l.progresso < 75).length },
  { id: 'p75-100', faixa: '75-100%', quantidade: mockLeads.filter(l => l.progresso >= 75 && l.progresso <= 100).length }
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1'];

export default function Relatorios() {
  const totalLeads = mockLeads.length;
  const aprovados = mockLeads.filter(l => l.status === 'aprovado').length;
  const taxaConversao = ((aprovados / totalLeads) * 100).toFixed(1);
  const tempoMedioConversao = '18 dias';

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1>Relatórios</h1>
        <p className="text-muted-foreground mt-1">Análise de desempenho e métricas do sistema</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500 rounded-lg p-3">
              <Users className="h-5 w-5 text-white" />
            </div>
          </div>
          <p className="text-muted-foreground mb-1">Total de Empresas</p>
          <p className="text-[2rem] leading-none mb-2">{totalLeads}</p>
          <p className="text-muted-foreground text-[0.875rem]">Últimos 6 meses</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-500 rounded-lg p-3">
              <Target className="h-5 w-5 text-white" />
            </div>
          </div>
          <p className="text-muted-foreground mb-1">Taxa de Conversão</p>
          <p className="text-[2rem] leading-none mb-2">{taxaConversao}%</p>
          <p className="text-muted-foreground text-[0.875rem]">{aprovados} aprovados</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-orange-500 rounded-lg p-3">
              <Clock className="h-5 w-5 text-white" />
            </div>
          </div>
          <p className="text-muted-foreground mb-1">Tempo Médio</p>
          <p className="text-[2rem] leading-none mb-2">{tempoMedioConversao}</p>
          <p className="text-muted-foreground text-[0.875rem]">Lead → Aprovado</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-500 rounded-lg p-3">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </div>
          <p className="text-muted-foreground mb-1">Crescimento</p>
          <p className="text-[2rem] leading-none mb-2">+24%</p>
          <p className="text-muted-foreground text-[0.875rem]">vs mês anterior</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="mb-6">Origem dos Leads</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={origemData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {origemData.map((entry, index) => (
                  <Cell key={`cell-origem-${entry.id}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="mb-6">Distribuição de Progresso</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={progressoData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="faixa" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Quantidade" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-6 mb-6">
        <h3 className="mb-6">Performance por Responsável</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={assignedToData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="total" fill="#3b82f6" name="Total de Leads" radius={[4, 4, 0, 0]} />
            <Bar dataKey="aprovados" fill="#10b981" name="Aprovados" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="mb-4">Insights e Recomendações</h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-900">Melhor canal de aquisição</p>
            <p className="text-blue-700 text-[0.875rem] mt-1">
              {origemData.sort((a, b) => b.value - a.value)[0]?.name} é a origem com maior volume de leads.
              Considere investir mais recursos neste canal.
            </p>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-900">Ponto de atenção</p>
            <p className="text-yellow-700 text-[0.875rem] mt-1">
              {mockLeads.filter(l => l.progresso > 0 && l.progresso < 50).length} leads iniciaram o cadastro mas
              não completaram metade do processo. Considere estratégias de reengajamento.
            </p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-900">Desempenho positivo</p>
            <p className="text-green-700 text-[0.875rem] mt-1">
              A taxa de conversão atual de {taxaConversao}% está acima da média do setor. Continue com as
              estratégias atuais.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
