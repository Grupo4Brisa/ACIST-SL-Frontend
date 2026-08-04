import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { TrendingUp, Users, Target, Clock } from "lucide-react";

import api from "../services/api";

interface Company {
  id: number;

  companyName: string;

  corporateName: string;

  status: string;

  city?: string;

  companySize: string;

  createdAt: string;

  updatedAt: string;
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#6366f1",
];

export default function Relatorios() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [acompanhamento, setAcompanhamento] = useState<{ mes: string; cadastradas: number; aprovadas: number }[]>([]);

  const [solucoesData, setSolucoesData] = useState<
    { name: string; value: number }[]
  >([]);

  const origemData = companies
    .reduce<{ name: string; value: number }[]>((acc, comp) => {
      if (!comp.origin) return acc;
      const found = acc.find((x) => x.name === comp.origin);
      if (found) found.value++;
      else acc.push({ name: comp.origin, value: 1 });
      return acc;
    }, [])
    .sort((a, b) => b.value - a.value);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCompanies() {
      try {
        const response = await api.get("/companies");
        setCompanies(response.data);
      } catch (error) {
        console.error("Erro ao carregar empresas:", error);
      } finally {
        setLoading(false);
      }
    }

    async function loadAcompanhamento() {
      try {
        const res = await api.get("/dashboard");
        setAcompanhamento(res.data.acompanhamento || []);
      } catch { /* silencioso */ }
    }

    loadCompanies();
    loadAcompanhamento();

    // carrega soluções de interesse
    api
      .get("/company-solutions")
      .then((res) => {
        const map: Record<string, number> = {};
        const NOMES: Record<number, string> = {
          1: "Assessoria Jurídica",
          2: "Consultoria Empresarial",
          3: "Capacitação",
          4: "Networking",
          5: "Certificado Digital",
          6: "Convênios",
          7: "Divulgação",
          8: "Representação",
          9: "Serviços Financeiros",
          10: "Marketing",
        };
        for (const s of res.data || []) {
          const nome = NOMES[s.solutionId] || `Solução ${s.solutionId}`;
          map[nome] = (map[nome] || 0) + 1;
        }
        setSolucoesData(
          Object.entries(map)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value),
        );
      })
      .catch(() => {});
  }, []);

  const totalCompanies = companies.length;

  const aprovadas = companies.filter(
    (company) => company.status === "ACTIVE",
  ).length;

  const pendentes = companies.filter(
    (company) =>
      company.status === "PENDING_APPROVAL" || company.status === "INCOMPLETE",
  ).length;

  const inativas = companies.filter(
    (company) => company.status === "INACTIVE",
  ).length;

  const taxaConversao =
    totalCompanies > 0 ? ((aprovadas / totalCompanies) * 100).toFixed(1) : "0";

  const statusData = [
    {
      id: "active",

      name: "Ativas",

      value: aprovadas,
    },

    {
      id: "pending",

      name: "Aguardando Aprovação",

      value: pendentes,
    },

    {
      id: "inactive",

      name: "Inativas",

      value: inativas,
    },
  ];

  const sizeData = companies.reduce(
    (acc: any[], company) => {
      const existing = acc.find((item) => item.name === company.companySize);

      if (existing) {
        existing.value++;
      } else {
        acc.push({
          id: company.companySize,

          name: company.companySize,

          value: 1,
        });
      }

      return acc;
    },

    [],
  );

  const cityData = companies.reduce(
    (acc: any[], company) => {
      if (!company.city) {
        return acc;
      }

      const existing = acc.find((item) => item.name === company.city);

      if (existing) {
        existing.value++;
      } else {
        acc.push({
          id: company.city,

          name: company.city,

          value: 1,
        });
      }

      return acc;
    },

    [],
  );

  if (loading) {
    return <div className="p-8">Carregando relatórios...</div>;
  }
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1>Relatórios</h1>

        <p className="text-muted-foreground mt-1">
          Análise de desempenho e métricas do sistema
        </p>
      </div>

      {/* CARDS PRINCIPAIS */}

      <div
        className="
        grid
        grid-cols-1
        gap-6
        sm:grid-cols-2
        lg:grid-cols-4
        mb-8
      "
      >
        <div
          className="
          bg-card
          rounded-lg
          border
          border-border
          p-6
        "
        >
          <div
            className="
            flex
            items-center
            gap-3
            mb-4
          "
          >
            <div
              className="
              bg-blue-500
              rounded-lg
              p-3
            "
            >
              <Users
                className="
                h-5
                w-5
                text-white
              "
              />
            </div>
          </div>

          <p
            className="
            text-muted-foreground
            mb-1
          "
          >
            Total de Empresas
          </p>

          <p
            className="
            text-[2rem]
            leading-none
            mb-2
          "
          >
            {totalCompanies}
          </p>

          <p
            className="
            text-muted-foreground
            text-[0.875rem]
          "
          >
            Cadastradas no sistema
          </p>
        </div>

        <div
          className="
          bg-card
          rounded-lg
          border
          border-border
          p-6
        "
        >
          <div
            className="
            flex
            items-center
            gap-3
            mb-4
          "
          >
            <div
              className="
              bg-green-500
              rounded-lg
              p-3
            "
            >
              <Target
                className="
                h-5
                w-5
                text-white
              "
              />
            </div>
          </div>

          <p
            className="
            text-muted-foreground
            mb-1
          "
          >
            Taxa de Conversão
          </p>

          <p
            className="
            text-[2rem]
            leading-none
            mb-2
          "
          >
            {taxaConversao}%
          </p>

          <p
            className="
            text-muted-foreground
            text-[0.875rem]
          "
          >
            {aprovadas} empresas aprovadas
          </p>
        </div>

        <div
          className="
          bg-card
          rounded-lg
          border
          border-border
          p-6
        "
        >
          <div
            className="
            flex
            items-center
            gap-3
            mb-4
          "
          >
            <div
              className="
              bg-orange-500
              rounded-lg
              p-3
            "
            >
              <Clock
                className="
                h-5
                w-5
                text-white
              "
              />
            </div>
          </div>

          <p
            className="
            text-muted-foreground
            mb-1
          "
          >
            Pendentes
          </p>

          <p
            className="
            text-[2rem]
            leading-none
            mb-2
          "
          >
            {pendentes}
          </p>

          <p
            className="
            text-muted-foreground
            text-[0.875rem]
          "
          >
            Aguardando aprovação
          </p>
        </div>

        <div
          className="
          bg-card
          rounded-lg
          border
          border-border
          p-6
        "
        >
          <div
            className="
            flex
            items-center
            gap-3
            mb-4
          "
          >
            <div
              className="
              bg-purple-500
              rounded-lg
              p-3
            "
            >
              <TrendingUp
                className="
                h-5
                w-5
                text-white
              "
              />
            </div>
          </div>

          <p
            className="
            text-muted-foreground
            mb-1
          "
          >
            Crescimento
          </p>

          <p
            className="
            text-[2rem]
            leading-none
            mb-2
          "
          >
            +24%
          </p>

          <p
            className="
            text-muted-foreground
            text-[0.875rem]
          "
          >
            Comparativo mensal
          </p>
        </div>
      </div>

      {/* GRÁFICOS */}

      <div
        className="
        grid
        grid-cols-1
        lg:grid-cols-2
        gap-6
        mb-6
      "
      >
        <div
          className="
          bg-card
          rounded-lg
          border
          border-border
          p-6
        "
        >
          <h3 className="mb-6">Empresas por Status</h3>

          <ResponsiveContainer width="100%" height={380}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="45%"
                labelLine={false}
                label={false}
                outerRadius={130}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`status-${entry.id}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />

              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value} empresa(s)`,
                  name,
                ]}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div
          className="
          bg-card
          rounded-lg
          border
          border-border
          p-6
        "
        >
          <h3 className="mb-6">Empresas por Porte</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sizeData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="value"
                fill="#3b82f6"
                name="Quantidade"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* EMPRESAS POR CIDADE */}

      <div
        className="
        bg-card
        rounded-lg
        border
        border-border
        p-6
        mb-6
      "
      >
        <h3 className="mb-6">Distribuição por Cidade</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={cityData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="name"
              tick={{
                fontSize: 12,
              }}
            />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="value"
              fill="#10b981"
              name="Empresas"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* SOLUÇÕES DE INTERESSE */}
      <div className="bg-card rounded-lg border border-border p-6 mt-6">
        <h2 className="text-lg font-semibold mb-6">Soluções de Interesse</h2>
        {solucoesData.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Nenhuma solução cadastrada.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={solucoesData}
              layout="vertical"
              margin={{ left: 20, right: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="name"
                width={140}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number) => [
                  `${value} empresa(s)`,
                  "Interesse",
                ]}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {solucoesData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* INSIGHTS */}

      {/* Origem dos Associados */}
      {origemData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Origem dos Associados
          </h3>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={origemData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {origemData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div
        className="
        bg-card
        rounded-lg
        border
        border-border
        p-6
      "
      >
        <h3 className="mb-4">Insights e Recomendações</h3>

        <div className="space-y-4">
          <div
            className="
            p-4
            bg-blue-50
            border
            border-blue-200
            rounded-lg
          "
          >
            <p
              className="
              text-blue-900
            "
            >
              Maior concentração de empresas
            </p>

            <p
              className="
              text-blue-700
              text-[0.875rem]
              mt-1
            "
            >
              {cityData.length > 0
                ? `${cityData.sort((a, b) => b.value - a.value)[0].name}
                possui o maior número
                de empresas cadastradas.`
                : "Ainda não existem dados suficientes."}
            </p>
          </div>

          <div
            className="
            p-4
            bg-yellow-50
            border
            border-yellow-200
            rounded-lg
          "
          >
            <p
              className="
              text-yellow-900
            "
            >
              Ponto de atenção
            </p>

            <p
              className="
              text-yellow-700
              text-[0.875rem]
              mt-1
            "
            >
              Existem {pendentes} empresas aguardando aprovação. Avalie os
              cadastros pendentes.
            </p>
          </div>

          <div
            className="
            p-4
            bg-green-50
            border
            border-green-200
            rounded-lg
          "
          >
            <p
              className="
              text-green-900
            "
            >
              Desempenho positivo
            </p>

            <p
              className="
              text-green-700
              text-[0.875rem]
              mt-1
            "
            >
              A taxa atual de conversão é de {taxaConversao}% . Continue
              acompanhando o fluxo de aprovação das empresas.
            </p>
          </div>
        </div>

        {/* INSIGHT SOLUÇÕES */}
        {solucoesData.length > 0 && (
          <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-purple-900 font-medium">Soluções de Interesse</p>
            <p className="text-purple-700 text-[0.875rem] mt-1">
              A solução mais demandada é{" "}
              <strong>{solucoesData[0]?.name}</strong> com{" "}
              {solucoesData[0]?.value} empresa(s).
              {solucoesData.length > 1 &&
                ` Em seguida, ${solucoesData[1]?.name} com ${solucoesData[1]?.value} empresa(s).`}{" "}
              Considere fortalecer os serviços mais procurados pelos associados.
            </p>
          </div>
        )}
      </div>

      {/* ACOMPANHAMENTO MENSAL */}
      <div className="bg-card border border-border rounded-lg p-6 mt-8">
        <h2 className="text-lg font-semibold mb-1">Acompanhamento Mensal</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Empresas cadastradas vs aprovadas nos últimos 6 meses
        </p>
        {acompanhamento.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Sem dados suficientes.</p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={acompanhamento} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cadastradas" stroke="#3b82f6" strokeWidth={2} name="Cadastradas" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="aprovadas" stroke="#10b981" strokeWidth={2} name="Aprovadas" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-900 font-medium">Análise</p>
              <p className="text-blue-700 text-sm mt-1">
                {(() => {
                  const ultimo = acompanhamento[acompanhamento.length - 1];
                  if (!ultimo) return 'Sem dados.';
                  const taxa = ultimo.cadastradas > 0
                    ? Math.round((ultimo.aprovadas / ultimo.cadastradas) * 100)
                    : 0;
                  return `No mês atual (${ultimo.mes}): ${ultimo.cadastradas} cadastro(s) e ${ultimo.aprovadas} aprovação(ões) — taxa de aprovação de ${taxa}%.${taxa < 50 && ultimo.cadastradas > 0 ? ' Há espaço para aumentar a conversão.' : taxa >= 80 ? ' Excelente taxa de aprovação!' : ''}`;
                })()}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
