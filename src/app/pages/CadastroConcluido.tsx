import { useNavigate } from 'react-router';
import { CheckCircle, Mail, ClipboardList, Star, AlertCircle } from 'lucide-react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const PROXIMOS_PASSOS = [
  { icon: ClipboardList, texto: 'Seu cadastro será analisado pela equipe ACIST' },
  { icon: Mail,          texto: 'Você receberá um e-mail com o resultado da análise' },
  { icon: Star,          texto: 'Caso aprovado, você terá acesso aos benefícios da ACIST' },
];

export default function CadastroConcluido() {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0C3A59] flex flex-col">

      <Header />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-12 w-full">
          <div className="bg-white rounded-2xl shadow-xl p-10">

            {/* ÍCONE E TÍTULO */}
            <div className="flex flex-col items-center text-center mb-10">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-3">
                Cadastro Concluído com Sucesso!
              </h1>
              <p className="text-gray-500 text-base max-w-xl">
                Seu cadastro foi enviado com sucesso e está em análise pela equipe ACIST.
                Você receberá um e-mail com o resultado da aprovação em breve.
              </p>
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
                <strong>Importante:</strong> Este link não pode mais ser utilizado. Seu cadastro já foi registrado em nosso sistema.
              </p>
            </div>

            {/* BOTÃO */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-8 py-3 bg-[#0C3A59] text-white rounded-lg hover:opacity-90 transition-all font-medium"
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
