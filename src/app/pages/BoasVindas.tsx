import { useNavigate } from 'react-router';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Logo from '../components/Logo';

export default function BoasVindas() {
  const navigate = useNavigate();

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
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-5xl w-full">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Imagem */}
              <div className="relative h-64 md:h-auto">
                <img
                  src="https://images.unsplash.com/photo-1758598306845-8630d064a244?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                  alt="Bem-vindo à ACIST"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0C3A59]/80 to-[#226897]/80 flex items-center justify-center">
                  <div className="text-white text-center p-8">
                    <div className="inline-block p-4 bg-white/20 rounded-full mb-4">
                      <CheckCircle className="h-16 w-16" />
                    </div>
                    <h2 className="text-3xl font-bold">
                      Bem-vindo à ACIST!
                    </h2>
                  </div>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-[#0C3A59] mb-4">
                    Parabéns! 🎉
                  </h1>
                  <p className="text-lg text-gray-700 mb-6">
                    Sua associação à ACIST São Leopoldo foi concluída com sucesso!
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-gray-700">
                          <span className="font-semibold">Cadastro iniciado:</span> Suas informações foram registradas
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-gray-700">
                          <span className="font-semibold">Pagamento processado:</span> Aguardando confirmação bancária
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-gray-700">
                          <span className="font-semibold">Acesso liberado:</span> Entre na sua área do associado
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-[#0C3A59] mb-2">O que acontece agora?</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>✓ Você receberá um e-mail de confirmação</li>
                      <li>✓ Sua associação será ativada em até 24h úteis</li>
                      <li>✓ Terá acesso a todos os benefícios da ACIST</li>
                      <li>✓ Poderá participar de eventos e capacitações</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      const leadId = Date.now().toString();
                      navigate(`/cadastro/${leadId}?origem=BoasVindas&etapa=continuar`);
                    }}
                    className="w-full bg-[#5DA5FF] hover:bg-[#226897] text-white py-4 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    Completar Cadastro
                    <ArrowRight className="h-5 w-5" />
                  </button>

                  <button
                    onClick={() => navigate('/login-associado')}
                    className="w-full border-2 border-[#5DA5FF] text-[#5DA5FF] hover:bg-blue-50 py-4 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    Ir para Login do Associado
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>

                <p className="text-center text-sm text-gray-500 mt-4">
                  Bem-vindo à maior rede de empresários da região!
                </p>
              </div>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="mt-8 text-center">
            <p className="text-blue-100 mb-4">
              Precisa de ajuda? Entre em contato conosco
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <a
                href="mailto:contato@acistsl.com.br"
                className="text-white hover:text-blue-200 transition-colors underline"
              >
                contato@acistsl.com.br
              </a>
              <span className="text-blue-300">•</span>
              <a
                href="https://wa.me/5551999999999"
                className="text-white hover:text-blue-200 transition-colors underline"
              >
                (51) 99999-9999
              </a>
            </div>
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
