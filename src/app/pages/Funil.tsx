import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Building2, Mail, Phone, Calendar } from "lucide-react";

import api from "../services/api";
import type { Company } from "../types/company";

const stages = [
  {
    status: "ACTIVE",
    label: "Ativas",
    color: "bg-green-100 border-green-300",
  },
  {
    status: "PENDING_APPROVAL",
    label: "Pendentes",
    color: "bg-yellow-100 border-yellow-300",
  },
  {
    status: "INCOMPLETE",
    label: "Cadastro Incompleto",
    color: "bg-orange-100 border-orange-300",
  },
  {
    status: "INACTIVE",
    label: "Inativas",
    color: "bg-red-100 border-red-300",
  },
];

const statusLabels: Record<string, string> = {
  ACTIVE: "Aprovada",
  PENDING_APPROVAL: "Aguardando Aprovação",
  INCOMPLETE: "Cadastro Incompleto",
  INACTIVE: "Reprovada",
};

const STATUS_CADASTRO: Record<string, { label: string; color: string }> = {
  INCOMPLETE: {
    label: "Cadastro Incompleto",
    color: "bg-yellow-100 text-yellow-700",
  },
  PENDING_APPROVAL: {
    label: "Cadastro Completo",
    color: "bg-blue-100 text-blue-700",
  },
  ACTIVE: { label: "Cadastro Completo", color: "bg-blue-100 text-blue-700" },
  INACTIVE: { label: "Cadastro Completo", color: "bg-blue-100 text-blue-700" },
};

const STATUS_APROVACAO: Record<string, { label: string; color: string }> = {
  INCOMPLETE: {
    label: "Aguardando Aprovação",
    color: "bg-orange-100 text-orange-700",
  },
  PENDING_APPROVAL: {
    label: "Aguardando Aprovação",
    color: "bg-orange-100 text-orange-700",
  },
  ACTIVE: { label: "Aprovado", color: "bg-green-100 text-green-700" },
  INACTIVE: { label: "Reprovado", color: "bg-red-100 text-red-700" },
};

export default function Funil() {
  const [searchParams] = useSearchParams();

  const statusFilter = searchParams.get("status");

  const [selectedStatus, setSelectedStatus] = useState("all");

  const [companies, setCompanies] = useState<Company[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!statusFilter) return;

    switch (statusFilter) {
      case "ativo":
        setSelectedStatus("ACTIVE");
        break;

      case "pending":
        setSelectedStatus("PENDING_APPROVAL");
        break;

      case "incompleto":
        setSelectedStatus("INCOMPLETE");
        break;

      case "inativo":
        setSelectedStatus("INACTIVE");
        break;

      default:
        setSelectedStatus("all");
    }
  }, [statusFilter]);

  useEffect(() => {
    async function loadCompanies() {
      try {
        const response = await api.get("/companies");

        setCompanies(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadCompanies();
  }, []);

  const getCompaniesByStatus = (status: string) => {
    return companies.filter((company) => company.status === status);
  };

  const getFilteredCompanies = () => {
    if (selectedStatus === "all") {
      return companies;
    }

    return getCompaniesByStatus(selectedStatus);
  };

  const filteredCompanies = getFilteredCompanies();

  const formatDate = (date?: string) => {
    if (!date) return "";

    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  if (loading) {
    return <div className="p-8">Carregando empresas...</div>;
  }

  return (
    <div className="h-full flex flex-col p-8">
      <div className="mb-6">
        <h1>Funil de Empresas</h1>

        <p className="text-muted-foreground mt-1">
          Gerencie o acompanhamento das empresas associadas
        </p>
      </div>
      {/* ==========================
          FILTROS
      ========================== */}

      <div className="bg-card rounded-lg border border-border p-4 mb-6">
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setSelectedStatus("all")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedStatus === "all"
                ? "bg-[#5DA5FF] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Todos ({companies.length})
          </button>

          {stages.map((stage) => {
            const count = getCompaniesByStatus(stage.status).length;

            return (
              <button
                key={stage.status}
                onClick={() => setSelectedStatus(stage.status)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedStatus === stage.status
                    ? stage.color
                        .replace("100", "500")
                        .replace("border-", "bg-")
                        .split(" ")[0] + " text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {stage.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* ==========================
          GRID
      ========================== */}

      <div className="flex-1 overflow-y-auto">
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            gap-4
            pb-4
          "
        >
          {filteredCompanies.length === 0 ? (
            <div className="col-span-full bg-card rounded-lg border border-border p-12 text-center">
              <p className="text-muted-foreground">
                Nenhuma empresa encontrada neste status.
              </p>
            </div>
          ) : (
            filteredCompanies.map((company) => (
              <Link
                key={company.id}
                to={`/admin/company/${company.id}`}
                className="block bg-card rounded-lg border border-border p-4 hover:shadow-lg hover:border-[#5DA5FF] transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="flex-1 pr-2 font-semibold">
                    {company.companyName}
                  </h4>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-[0.875rem] text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span className="truncate">{company.cnpjcpf}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[0.875rem] text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{company.email}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[0.875rem] text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{company.phone}</span>
                  </div>
                  {company.city && (
                    <div className="text-[0.875rem] text-muted-foreground">
                      {company.city}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1 pt-3 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[0.75rem] text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {formatDate(company.updatedAt ?? company.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap mt-1">
                    <span
                      className={`text-[0.75rem] px-2 py-1 rounded-full font-medium ${STATUS_CADASTRO[company.status]?.color || "bg-gray-100 text-gray-600"}`}
                    >
                      {STATUS_CADASTRO[company.status]?.label || company.status}
                    </span>
                    <span
                      className={`text-[0.75rem] px-2 py-1 rounded-full font-medium ${STATUS_APROVACAO[company.status]?.color || "bg-gray-100 text-gray-600"}`}
                    >
                      {STATUS_APROVACAO[company.status]?.label ||
                        company.status}
                    </span>
                  </div>
                </div>

                {company.status === "INCOMPLETE" && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[0.75rem] text-muted-foreground mb-1">
                      <span>Cadastro</span>
                      <span>Incompleto</span>
                    </div>

                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className="bg-orange-500 h-1.5 rounded-full"
                        style={{
                          width: "50%",
                        }}
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
