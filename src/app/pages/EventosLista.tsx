import { useNavigate } from 'react-router';
import { Calendar, MapPin, Users, Clock, ArrowLeft } from 'lucide-react';
import Logo from '../components/Logo';

export default function EventosLista() {
  const navigate = useNavigate();

  // Mock data - em produção viria de uma API
  const eventos = [
    {
      id: 1,
      nome: 'Café de Negócios - Networking',
      data: '2026-04-25',
      horario: '08:00 - 10:00',
      local: 'Sede ACIST',
      inscritos: 32,
      vagas: 50,
      categoria: 'Networking'
    },
    {
      id: 2,
      nome: 'Workshop: Marketing Digital para Empresas',
      data: '2026-05-02',
      horario: '14:00 - 18:00',
      local: 'Auditório ACIST',
      inscritos: 28,
      vagas: 40,
      categoria: 'Capacitação'
    },
    {
      id: 3,
      nome: 'Assembleia Geral de Associados',
      data: '2026-05-15',
      horario: '19:00 - 21:00',
      local: 'Sede ACIST',
      inscritos: 45,
      vagas: 100,
      categoria: 'Institucional'
    },
    {
      id: 4,
      nome: 'Palestra: Inovação e Tecnologia',
      data: '2026-05-20',
      horario: '19:00 - 21:00',
      local: 'Auditório ACIST',
      inscritos: 18,
      vagas: 60,
      categoria: 'Capacitação'
    },
    {
      id: 5,
      nome: 'Encontro de Mulheres Empreendedoras',
      data: '2026-06-01',
      horario: '09:00 - 12:00',
      local: 'Sede ACIST',
      inscritos: 22,
      vagas: 35,
      categoria: 'Networking'
    },
    {
      id: 6,
      nome: 'Happy Hour Empresarial',
      data: '2026-06-08',
      horario: '18:00 - 21:00',
      local: 'Rancho da ACIST',
      inscritos: 56,
      vagas: 80,
      categoria: 'Networking'
    }
  ];

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'Networking':
        return 'bg-blue-100 text-blue-700';
      case 'Capacitação':
        return 'bg-purple-100 text-purple-700';
      case 'Institucional':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getOcupacao = (inscritos: number, vagas: number) => {
    const percentual = (inscritos / vagas) * 100;
    if (percentual >= 90) return { label: 'Quase lotado', color: 'text-red-600' };
    if (percentual >= 70) return { label: 'Vagas limitadas', color: 'text-orange-600' };
    return { label: 'Vagas disponíveis', color: 'text-green-600' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0C3A59] to-[#226897] flex flex-col">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo size="md" theme="light" />
            <button
              onClick={() => navigate('/area-associado')}
              className="px-6 py-2.5 bg-[#5DA5FF] text-white hover:bg-[#226897] rounded-lg transition-colors"
            >
              Voltar à Área do Associado
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        <button
          onClick={() => navigate('/area-associado')}
          className="flex items-center gap-2 text-blue-100 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>

        <div className="mb-8">
          <h1 className="text-white text-3xl font-semibold mb-2">Eventos ACIST</h1>
          <p className="text-blue-100">
            Confira todos os eventos disponíveis e confirme sua presença
          </p>
        </div>

        {/* Grid de Eventos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventos.map(evento => {
            const ocupacao = getOcupacao(evento.inscritos, evento.vagas);
            const percentualOcupacao = (evento.inscritos / evento.vagas) * 100;

            return (
              <div
                key={evento.id}
                onClick={() => navigate(`/evento/${evento.id}`)}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all cursor-pointer group"
              >
                {/* Header do Card */}
                <div className="bg-gradient-to-r from-[#0C3A59] to-[#226897] p-6 text-white">
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${getCategoriaColor(evento.categoria).replace('text-', 'text-white bg-white/20')}`}>
                    {evento.categoria}
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-blue-100 transition-colors">
                    {evento.nome}
                  </h3>
                </div>

                {/* Conteúdo do Card */}
                <div className="p-6">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-[#5DA5FF]" />
                      <span>{new Date(evento.data).toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long'
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4 text-[#5DA5FF]" />
                      <span>{evento.horario}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-[#5DA5FF]" />
                      <span>{evento.local}</span>
                    </div>
                  </div>

                  {/* Ocupação */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4 text-[#5DA5FF]" />
                        <span>{evento.inscritos} / {evento.vagas} inscritos</span>
                      </div>
                      <span className={`text-xs font-semibold ${ocupacao.color}`}>
                        {ocupacao.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#5DA5FF] h-2 rounded-full transition-all"
                        style={{ width: `${percentualOcupacao}%` }}
                      />
                    </div>
                  </div>

                  {/* Botão */}
                  <button
                    className="w-full bg-[#5DA5FF] hover:bg-[#226897] text-white py-3 rounded-lg transition-colors font-semibold group-hover:shadow-lg"
                  >
                    Ver Detalhes
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Informações Adicionais */}
        <div className="mt-12 bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">Informações Importantes</h3>
          <ul className="text-blue-100 space-y-2 text-sm">
            <li>• Os eventos são exclusivos para associados da ACIST</li>
            <li>• Confirme sua presença com antecedência para garantir sua vaga</li>
            <li>• Em caso de cancelamento, avise com 24h de antecedência</li>
            <li>• Dúvidas? Entre em phone através do (51) 99999-9999</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-[0.875rem]">
              © 2026 ACIST São Leopoldo. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-gray-600 text-[0.875rem]">
              <a
                href="https://www.acistsl.com.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#5DA5FF] transition-colors underline decoration-transparent hover:decoration-[#5DA5FF]"
              >
                Sobre
              </a>
              <a
                href="https://wa.me/5551999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#5DA5FF] transition-colors underline decoration-transparent hover:decoration-[#5DA5FF]"
              >
                phone
              </a>
              <a
                href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#5DA5FF] transition-colors underline decoration-transparent hover:decoration-[#5DA5FF]"
              >
                Privacidade
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
