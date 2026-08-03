import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../services/api';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

export default function CompletarCadastro() {

  const navigate = useNavigate();
  const { token } = useParams();

  const [status, setStatus] = useState<'validando' | 'erro'>('validando');
  const [mensagemErro, setMensagemErro] = useState('');

  useEffect(() => {

    async function validarToken() {

      if (!token) {
        setStatus('erro');
        setMensagemErro('Link inválido.');
        return;
      }

      try {

        const response = await api.get(`/login-tokens/validate/${token}`);

        const { companyId } = response.data;

        // Marca o token como utilizado — o link é de uso único.
        // Feito depois da validação, já com o companyId em mãos,
        // então mesmo que essa chamada falhe silenciosamente o
        // fluxo do usuário não é bloqueado.
        api.post(`/login-tokens/consume/${token}`).catch(() => {});

        localStorage.removeItem('companyData');
        localStorage.setItem('companyId', String(companyId));

        navigate(`/cadastro/${companyId}`, { replace: true });

      } catch (err: any) {

        setStatus('erro');

        setMensagemErro(
          err.response?.data?.message ||
          'Não foi possível validar o link. Ele pode estar expirado ou já ter sido utilizado.'
        );

      }

    }

    validarToken();

  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-[#0C3A59] flex flex-col">

      <Header />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 max-w-md w-full text-center">

          {status === 'validando' && (
            <>
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
                <Loader2 className="h-8 w-8 text-[#0C3A59] animate-spin" />
              </div>
              <h1 className="text-xl font-bold text-gray-800 mb-2">
                Validando seu link...
              </h1>
              <p className="text-gray-500 text-sm">
                Aguarde um instante, você será redirecionado automaticamente.
              </p>
            </>
          )}

          {status === 'erro' && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-800 mb-2">
                Não foi possível acessar
              </h1>
              <p className="text-gray-500 text-sm mb-6">
                {mensagemErro}
              </p>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-[#0C3A59] text-white rounded-lg hover:opacity-90 transition-all font-medium"
              >
                Voltar à Página Inicial
              </button>
            </>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
