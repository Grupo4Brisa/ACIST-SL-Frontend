import { useNavigate } from 'react-router';
import { ArrowLeft, Download, CheckCircle, Clock, AlertCircle, CreditCard } from 'lucide-react';
import Logo from '../components/Logo';

export default function Mensalidades() {
  const navigate = useNavigate();

  const mensalidades = [
    {
      mes: 'Abril/2026',
      vencimento: '2026-04-10',
      valor: 250.00,
      status: 'em_aberto',
      boleto: 'boleto-abril-2026.pdf'
    },
    {
      mes: 'Março/2026',
      vencimento: '2026-03-10',
      valor: 250.00,
      status: 'pago',
      dataPagamento: '2026-03-08',
      boleto: 'boleto-marco-2026.pdf'
    },
    {
      mes: 'Fevereiro/2026',
      vencimento: '2026-02-10',
      valor: 250.00,
      status: 'pago',
      dataPagamento: '2026-02-09',
      boleto: 'boleto-fevereiro-2026.pdf'
    },
    {
      mes: 'Janeiro/2026',
      vencimento: '2026-01-10',
      valor: 250.00,
      status: 'pago',
      dataPagamento: '2026-01-08',
      boleto: 'boleto-janeiro-2026.pdf'
    },
    {
      mes: 'Dezembro/2025',
      vencimento: '2025-12-10',
      valor: 250.00,
      status: 'pago',
      dataPagamento: '2025-12-07',
      boleto: 'boleto-dezembro-2025.pdf'
    },
    {
      mes: 'Novembro/2025',
      vencimento: '2025-11-10',
      valor: 250.00,
      status: 'pago',
      dataPagamento: '2025-11-09',
      boleto: 'boleto-novembro-2025.pdf'
    }
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pago':
        return {
          label: 'Pago',
          color: 'text-green-700',
          bg: 'bg-green-100',
          icon: CheckCircle
        };
      case 'em_aberto':
        return {
          label: 'Em Aberto',
          color: 'text-orange-700',
          bg: 'bg-orange-100',
          icon: Clock
        };
      case 'atrasado':
        return {
          label: 'Atrasado',
          color: 'text-red-700',
          bg: 'bg-red-100',
          icon: AlertCircle
        };
      default:
        return {
          label: 'Desconhecido',
          color: 'text-gray-700',
          bg: 'bg-gray-100',
          icon: Clock
        };
    }
  };

  const handleDownloadBoleto = (boleto: string) => {
    // Em produção, faria download real do arquivo
    alert(`Download do boleto: ${boleto}`);
  };

  const mensalidadesEmAberto = mensalidades.filter(m => m.status === 'em_aberto' || m.status === 'atrasado');
  const totalEmAberto = mensalidadesEmAberto.reduce((acc, m) => acc + m.valor, 0);

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
      <div className="flex-1 max-w-5xl mx-auto px-6 py-8 w-full">
        <button
          onClick={() => navigate('/area-associado')}
          className="flex items-center gap-2 text-blue-100 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>

        <div className="mb-8">
          <h1 className="text-white text-3xl font-semibold mb-2">Mensalidades</h1>
          <p className="text-blue-100">
            Acompanhe suas mensalidades e faça o download dos boletos
          </p>
        </div>

        {/* Resumo */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-orange-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-orange-700" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Em Aberto</p>
                <p className="text-2xl font-bold text-[#0C3A59]">
                  {mensalidadesEmAberto.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Pagas</p>
                <p className="text-2xl font-bold text-[#0C3A59]">
                  {mensalidades.filter(m => m.status === 'pago').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total em Aberto</p>
                <p className="text-2xl font-bold text-[#0C3A59]">
                  R$ {totalEmAberto.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Mensalidades */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-[#0C3A59] to-[#226897] text-white">
            <h2 className="text-2xl font-semibold">Histórico de Mensalidades</h2>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {mensalidades.map((mensalidade, index) => {
                const statusConfig = getStatusConfig(mensalidade.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-6 hover:border-[#5DA5FF] hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-[#0C3A59]">
                            {mensalidade.mes}
                          </h3>
                          <div className={`inline-flex items-center gap-2 px-3 py-1 ${statusConfig.bg} rounded-full`}>
                            <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                            <span className={`text-sm font-semibold ${statusConfig.color}`}>
                              {statusConfig.label}
                            </span>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div>
                            <span className="font-semibold">Vencimento:</span>{' '}
                            {new Date(mensalidade.vencimento).toLocaleDateString('pt-BR')}
                          </div>
                          <div>
                            <span className="font-semibold">Valor:</span>{' '}
                            R$ {mensalidade.valor.toFixed(2)}
                          </div>
                          {mensalidade.dataPagamento && (
                            <div>
                              <span className="font-semibold">Data do Pagamento:</span>{' '}
                              {new Date(mensalidade.dataPagamento).toLocaleDateString('pt-BR')}
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDownloadBoleto(mensalidade.boleto)}
                        className="flex items-center gap-2 px-6 py-3 bg-[#5DA5FF] text-white rounded-lg hover:bg-[#226897] transition-colors whitespace-nowrap"
                      >
                        <Download className="h-4 w-4" />
                        Baixar Boleto
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Informações de Pagamento */}
        <div className="mt-6 bg-blue-500/20 border border-blue-300 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-2">Formas de Pagamento</h3>
          <ul className="text-blue-100 text-sm space-y-1">
            <li>• Boleto bancário (disponível para download acima)</li>
            <li>• PIX: Utilize o QR Code presente no boleto</li>
            <li>• Débito automático: Entre em phone com a secretaria</li>
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
