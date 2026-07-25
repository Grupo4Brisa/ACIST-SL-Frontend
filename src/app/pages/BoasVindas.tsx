import { useNavigate } from 'react-router';
import { Clock, Mail, CreditCard, AlertCircle, ArrowRight } from 'lucide-react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const PROXIMOS_PASSOS = [
  { icon: CreditCard, texto: 'Seu pagamento foi registrado e está aguardando confirmação pela equipe da ACIST' },
  { icon: Mail,       texto: 'Após a confirmação do pagamento você receberá um e-mail contendo um link exclusivo para concluir seu cadastro' },
  { icon: Clock,      texto: 'Após receber o e-mail, acesse o link e complete as informações da sua empresa' },
];

export default function BoasVindas() {

  const navigate = useNavigate();

  const companyId = localStorage.getItem('companyId');

  function handleCompletarCadastro() {
    if (companyId && companyId !== 'null') {
      navigate(`/cadastro/${companyId}`);
    } else {
      navigate('/');
    }
  }

  return (
    <div className="min-h-screen bg-[#0C3A59] flex flex-col">

      <Header />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-12 w-full">
          <div className="bg-white rounded-2xl shadow-xl p-10">

            {/* ÍCONE E TÍTULO */}
            <div className="flex flex-col items-center text-center mb-10">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <Clock className="h-10 w-10 text-[#0C3A59]" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-3">
                Cadastro Iniciado com Sucesso!
              </h1>
              <p className="text-gray-500 text-base max-w-xl">
                Seu pagamento foi registrado e está aguardando confirmação pela equipe da ACIST.
              </p>
              <div className="mt-4 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-semibold text-yellow-700">
                  STATUS: AGUARDANDO CONFIRMAÇÃO DE PAGAMENTO
                </p>
              </div>
            </div>

            {/* PRÓXIMOS PASSOS */}
            <div className="border border-gray-200 rounded-xl p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-5">Próximos passos:</h2>
              <div className="space-y-4">
                {PROXIMOS_PASSOS.map(({ icon: Icon, texto }, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-full bg-[#0C3A59]/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-[#0C3A59]" />
                    </div>
                    <p className="text-sm text-gray-700 mt-2">{texto}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AVISO */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-10">
              <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700">
                <strong>Importante:</strong> Após a confirmação do pagamento, você receberá um e-mail com um link exclusivo para completar seu cadastro. Guarde o e-mail informado no cadastro.
              </p>
            </div>

            {/* BOTÕES */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                type="button"
                onClick={handleCompletarCadastro}
                className="px-8 py-3 bg-[#0C3A59] text-white rounded-lg hover:opacity-90 transition-all font-medium flex items-center justify-center gap-2"
              >
                Completar Cadastro
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
              >
                Voltar à Página Inicial
              </button>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
