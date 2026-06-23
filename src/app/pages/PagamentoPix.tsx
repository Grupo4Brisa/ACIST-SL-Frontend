import { useNavigate, useSearchParams } from 'react-router';
import { CheckCircle, Copy, QrCode, ArrowRight, Users, Calendar, Award, ShieldCheck, Megaphone, Rocket } from 'lucide-react';
import { useState } from 'react';
import Logo from '../components/Logo';

const beneficios = [
  {
    icon: Users,
    titulo: 'Networking Empresarial',
    descricao: 'Conecte-se com empresários da região'
  },
  {
    icon: Calendar,
    titulo: 'Eventos e Capacitações',
    descricao: 'Acesso a workshops e palestras exclusivas'
  },
  {
    icon: Award,
    titulo: 'Convênios e Benefícios',
    descricao: 'Descontos em produtos e serviços'
  },
  {
    icon: ShieldCheck,
    titulo: 'Certificado Digital',
    descricao: 'Facilite processos com certificação'
  },
  {
    icon: Megaphone,
    titulo: 'Divulgação da Empresa',
    descricao: 'Visibilidade em eventos e materiais'
  },
  {
    icon: Rocket,
    titulo: 'Programa Empreender',
    descricao: 'Participe de núcleos e grupos setoriais'
  }
];

const valoresPorPorte = {
  mei: 42,
  pequena: 103,
  media: 230,
  grande: 496
};

export default function PagamentoPix() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const porte = searchParams.get('porte') || 'pequena';
  const [copiado, setCopiado] = useState(false);

  const valor = valoresPorPorte[porte as keyof typeof valoresPorPorte] || 103;
  const chavePix = '00.000.000/0001-00'; // Chave PIX da ACIST

  const handleCopiarChave = () => {
    navigator.clipboard.writeText(chavePix);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleConfirmarPagamento = () => {
    navigate('/boas-vindas');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0C3A59] to-[#226897] flex flex-col">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo size="md" theme="light" />
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 bg-[#5DA5FF] text-white hover:bg-[#226897] rounded-lg transition-colors"
            >
              Voltar à Página Inicial
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="text-center mb-12">
          <h1 className="text-white text-3xl font-semibold mb-2">Pagamento da Associação</h1>
          <p className="text-blue-100 text-lg">
            Finalize sua associação realizando o pagamento via PIX
          </p>
        </div>

        {/* Card de Pagamento */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
                <QrCode className="h-8 w-8 text-[#5DA5FF]" />
              </div>
              <h2 className="text-2xl font-semibold text-[#0C3A59] mb-2">
                Pague via PIX
              </h2>
              <p className="text-gray-600">
                Escaneie o QR Code ou copie a chave PIX abaixo
              </p>
            </div>

            {/* QR Code Placeholder */}
            <div className="flex justify-center mb-8">
              <div className="bg-white border-4 border-[#0C3A59] rounded-2xl p-8">
                <div className="w-64 h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                  <QrCode className="h-32 w-32 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Valor */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <div className="text-center">
                <p className="text-green-700 text-sm mb-2">Valor da mensalidade</p>
                <p className="text-4xl font-bold text-green-800">
                  R$ {valor.toFixed(2).replace('.', ',')}
                </p>
                <p className="text-green-600 text-sm mt-1">mensal</p>
              </div>
            </div>

            {/* Chave PIX */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Chave PIX (CNPJ)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chavePix}
                  readOnly
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-center font-mono"
                />
                <button
                  onClick={handleCopiarChave}
                  className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 ${
                    copiado
                      ? 'bg-green-500 text-white'
                      : 'bg-[#5DA5FF] text-white hover:bg-[#226897]'
                  }`}
                >
                  {copiado ? (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5" />
                      Copiar
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Instruções */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-[#0C3A59] mb-3">Como pagar:</h3>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-[#5DA5FF]">1.</span>
                  Abra o aplicativo do seu banco
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-[#5DA5FF]">2.</span>
                  Escolha a opção "Pagar com PIX"
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-[#5DA5FF]">3.</span>
                  Escaneie o QR Code ou cole a chave PIX
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-[#5DA5FF]">4.</span>
                  Confirme o valor de R$ {valor.toFixed(2).replace('.', ',')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-[#5DA5FF]">5.</span>
                  Clique em "Já fiz o pagamento" abaixo
                </li>
              </ol>
            </div>

            {/* Botão de Confirmação */}
            <button
              onClick={handleConfirmarPagamento}
              className="w-full bg-[#5DA5FF] hover:bg-[#226897] text-white py-4 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
            >
              Já fiz o pagamento
              <ArrowRight className="h-5 w-5" />
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Após o pagamento, sua associação será ativada em até 24 horas úteis
            </p>
          </div>
        </div>

        {/* Benefícios da Associação */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-white text-2xl font-semibold mb-2">Benefícios da Associação</h2>
            <p className="text-blue-100">
              Vantagens exclusivas ao se tornar associado da ACIST
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {beneficios.map((beneficio, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-[#5DA5FF]/10 rounded-lg flex items-center justify-center mb-4">
                  <beneficio.icon className="h-6 w-6 text-[#5DA5FF]" />
                </div>
                <h3 className="font-semibold text-[#0C3A59] mb-2 text-lg">
                  {beneficio.titulo}
                </h3>
                <p className="text-gray-600 text-sm">
                  {beneficio.descricao}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-3xl mx-auto">
            <p className="text-center text-blue-800">
              💡 <span className="font-semibold">Dica:</span> Ao se tornar associado, você terá acesso imediato a todos esses benefícios!
            </p>
          </div>
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
                Contato
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
