import { useNavigate, useParams } from "react-router";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import Logo from "../components/Logo";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

export default function EventoDetalhe() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [presencaConfirmada, setPresencaConfirmada] = useState(false);

  // Mock data - em produção viria de uma API
  const eventos: Record<string, any> = {
    "1": {
      id: 1,
      name: "Café de Negócios - Networking",
      data: "2026-04-25",
      horario: "08:00 - 10:00",
      local: "Sede ACIST",
      address: "Rua Independência, 1234 - São Leopoldo/RS",
      description:
        "Encontro matinal para networking entre associados. Uma oportunidade única de conhecer other empresários, trocar experiências e criar novas parcerias de negócios.",
      vagas: 50,
      inscritos: 32,
      palestrante: null,
      programa: [
        "08:00 - Credenciamento e café",
        "08:30 - Abertura e apresentação dos participantes",
        "09:15 - Networking livre",
        "10:00 - Encerramento",
      ],
    },
    "2": {
      id: 2,
      name: "Workshop: Marketing Digital para Empresas",
      data: "2026-05-02",
      horario: "14:00 - 18:00",
      local: "Auditório ACIST",
      address: "Rua Independência, 1234 - São Leopoldo/RS",
      description:
        "Workshop prático sobre estratégias de marketing digital aplicadas ao contexto empresarial. Aprenda técnicas de SEO, redes sociais, e-mail marketing e análise de métricas.",
      vagas: 40,
      inscritos: 28,
      palestrante: "Dr. Carlos Silva - Especialista em Marketing Digital",
      programa: [
        "14:00 - Introdução ao Marketing Digital",
        "15:00 - SEO e Marketing de Conteúdo",
        "16:00 - Coffee Break",
        "16:15 - Redes Sociais para Negócios",
        "17:00 - Análise de Métricas e ROI",
        "17:45 - Perguntas e Respostas",
        "18:00 - Encerramento",
      ],
    },
    "3": {
      id: 3,
      name: "Assembleia Geral de Associados",
      data: "2026-05-15",
      horario: "19:00 - 21:00",
      local: "Sede ACIST",
      address: "Rua Independência, 1234 - São Leopoldo/RS",
      description:
        "Assembleia Geral Ordinária para prestação de contas do exercício 2025 e apresentação do planejamento estratégico 2026.",
      vagas: 100,
      inscritos: 45,
      palestrante: null,
      programa: [
        "19:00 - Credenciamento",
        "19:15 - Abertura e verificação de quórum",
        "19:30 - Prestação de contas 2025",
        "20:00 - Planejamento estratégico 2026",
        "20:30 - Discussão e votações",
        "21:00 - Encerramento",
      ],
    },
  };

  const evento = eventos[id || "1"];

  const handleConfirmarPresenca = () => {
    setPresencaConfirmada(true);
    setTimeout(() => {
      navigate("/area-associado");
    }, 2000);
  };

  if (!evento) {
    navigate("/area-associado");
    return null;
  }

  const vagasDisponiveis = evento.vagas - evento.inscritos;
  const percentualOcupacao = (evento.inscritos / evento.vagas) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0C3A59] to-[#226897] flex flex-col">
      {/* Header */}
      <Header
        rightContent={
          <button
            onClick={() => navigate("/area-associado")}
            className="
              px-6
              py-2.5
              bg-[#5DA5FF]
              text-white
              rounded-lg
              hover:bg-[#226897]
              transition-colors
            "
          >
            Voltar à Área do Associado
          </button>
        }
      />

      {/* Main Content */}
      <div className="flex-1 max-w-5xl mx-auto px-6 py-8 w-full">
        <button
          onClick={() => navigate("/area-associado")}
          className="flex items-center gap-2 text-blue-100 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para meus eventos
        </button>

        {presencaConfirmada && (
          <div className="mb-6 p-4 bg-green-500 text-white rounded-lg flex items-center gap-3">
            <CheckCircle className="h-6 w-6" />
            <div>
              <p className="font-semibold">Presença confirmada com sucesso!</p>
              <p className="text-sm">Aguardamos você no evento.</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header do Evento */}
          <div className="bg-gradient-to-r from-[#0C3A59] to-[#226897] p-8 text-white">
            <h1 className="text-3xl font-bold mb-4">{evento.name}</h1>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5" />
                <span>
                  {new Date(evento.data).toLocaleDateString("pt-BR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5" />
                <span>{evento.horario}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5" />
                <span>{evento.local}</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5" />
                <span>
                  {evento.inscritos} inscritos de {evento.vagas} vagas
                </span>
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="p-8">
            {/* Descrição */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[#0C3A59] mb-4">
                Sobre o Evento
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {evento.description}
              </p>
            </div>

            {/* Local */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[#0C3A59] mb-4">
                Local
              </h2>
              <div className="flex items-start gap-3 text-gray-700">
                <MapPin className="h-5 w-5 text-[#5DA5FF] mt-1" />
                <div>
                  <p className="font-semibold">{evento.local}</p>
                  <p>{evento.address}</p>
                </div>
              </div>
            </div>

            {/* Palestrante */}
            {evento.palestrante && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-[#0C3A59] mb-4">
                  Palestrante
                </h2>
                <p className="text-gray-700">{evento.palestrante}</p>
              </div>
            )}

            {/* Programação */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[#0C3A59] mb-4">
                Programação
              </h2>
              <div className="space-y-3">
                {evento.programa.map((item: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#5DA5FF] rounded-full mt-2" />
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Vagas */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[#0C3A59] mb-4">
                Disponibilidade
              </h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-700">Vagas ocupadas</span>
                  <span className="font-semibold text-[#0C3A59]">
                    {evento.inscritos} / {evento.vagas}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className="bg-[#5DA5FF] h-3 rounded-full transition-all"
                    style={{ width: `${percentualOcupacao}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  {vagasDisponiveis > 0
                    ? `${vagasDisponiveis} vagas disponíveis`
                    : "Evento lotado - lista de espera"}
                </p>
              </div>
            </div>

            {/* Botão de Confirmação */}
            <div className="border-t border-gray-200 pt-6">
              {!presencaConfirmada ? (
                <button
                  onClick={handleConfirmarPresenca}
                  className="w-full bg-[#5DA5FF] hover:bg-[#226897] text-white py-4 rounded-lg transition-all font-semibold text-lg"
                  disabled={vagasDisponiveis === 0}
                >
                  {vagasDisponiveis > 0
                    ? "Confirmar Presença"
                    : "Lista de Espera"}
                </button>
              ) : (
                <div className="w-full bg-green-100 text-green-800 py-4 rounded-lg text-center font-semibold">
                  ✓ Presença Confirmada
                </div>
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
