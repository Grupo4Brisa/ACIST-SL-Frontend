import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ScrollText, LogOut, CheckCircle } from 'lucide-react';
import api from '../services/api';
import Header from '../components/Header/Header';
import ProgressoCadastro from '../components/ProgressoCadastro';
import Footer from '../components/Footer/Footer';

export default function CadastroTermos() {

  const navigate = useNavigate();
  const { id } = useParams();

  const [aceito, setAceito] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleFinalizar() {
    if (!aceito) {
      setError('Você precisa aceitar o Termo de Adesão para finalizar o cadastro.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await api.post('/terms-acceptance', {
        companyId: Number(id),
        accepted: true,
        termVersion: 'v1.0',
      });
      localStorage.removeItem('adminEdit');
      navigate('/cadastro-concluido');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao finalizar cadastro.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0C3A59] flex flex-col">

      <Header />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-12 w-full">
          <div className="bg-white rounded-2xl shadow-xl p-10">
            {/* CABEÇALHO DA ETAPA */}
            <div className="flex justify-between items-start mb-6 gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Cadastro de Associado</h1>
                <p className="text-sm text-gray-500 mt-1">Etapa 8 de 8 - Termo de Adesão</p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-4 py-2 rounded-lg border border-gray-300 flex items-center gap-2 text-gray-700 hover:bg-gray-100"
                >
                  <LogOut size={16} />
                  Voltar
                </button>
              </div>
            </div>

            <ProgressoCadastro etapaAtual={8} />

            {/* TÍTULO DA SEÇÃO */}
            <div className="flex items-center gap-3 mb-8">
              <ScrollText className="h-7 w-7 text-[#0C3A59]" />
              <h2 className="text-2xl font-semibold text-gray-800">Termo de Adesão</h2>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* CONTEÚDO DO TERMO */}
            <div className="border border-gray-200 rounded-xl p-8 bg-gray-50 max-h-[480px] overflow-y-auto text-sm text-gray-700 leading-relaxed space-y-5 mb-8">

              <h3 className="text-base font-bold text-gray-900 text-center">
                TERMO DE ADESÃO - ACIST SÃO LEOPOLDO
              </h3>

              <p>
                Pelo presente instrumento, a empresa acima qualificada manifesta seu interesse em associar-se à
                <strong> ASSOCIAÇÃO COMERCIAL, INDUSTRIAL, DE SERVIÇOS E TECNOLOGIA DE SÃO LEOPOLDO - ACIST</strong>,
                declarando conhecer e concordar com os termos do Estatuto Social e Regimento Interno da entidade.
              </p>

              <div>
                <p className="font-semibold text-gray-800 mb-2">1. CONDIÇÕES DE ASSOCIAÇÃO</p>
                <p>
                  A empresa associada compromete-se a pagar pontualmente a mensalidade estabelecida conforme o porte
                  da empresa, bem como taxas de eventos e serviços adicionais que venha a utilizar.
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-800 mb-2">2. DIREITOS DO ASSOCIADO</p>
                <ul className="space-y-1 pl-2">
                  {[
                    'Participar de eventos, cursos e capacitações promovidos pela ACIST',
                    'Utilizar convênios e parcerias estabelecidos pela entidade',
                    'Ter acesso aos serviços de assessoria e consultoria',
                    'Participar das assembleias e ter direito a voto',
                    'Divulgar sua empresa nos canais da ACIST',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#0C3A59] mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-semibold text-gray-800 mb-2">3. DEVERES DO ASSOCIADO</p>
                <ul className="space-y-1 pl-2">
                  {[
                    'Cumprir as disposições do Estatuto Social e Regimento Interno',
                    'Pagar pontualmente as mensalidades e demais taxas',
                    'Participar ativamente das atividades da entidade',
                    'Zelar pela imagem e reputação da ACIST',
                    'Manter atualizados os dados cadastrais',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#0C3A59] mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-semibold text-gray-800 mb-2">4. PROTEÇÃO DE DADOS</p>
                <p>
                  A ACIST compromete-se a tratar os dados pessoais e empresariais fornecidos em conformidade com a
                  Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018), utilizando-os exclusivamente para os
                  fins relacionados aos serviços prestados pela entidade.
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-800 mb-2">5. CANCELAMENTO</p>
                <p>
                  O associado poderá solicitar o cancelamento de sua associação a qualquer momento, mediante
                  comunicação por escrito, ficando responsável pelo pagamento das mensalidades vencidas até a
                  data da solicitação.
                </p>
              </div>

              <p className="italic text-gray-500">
                Ao aceitar este termo, declaro ter lido, compreendido e concordado com todas as condições estabelecidas acima.
              </p>

            </div>

            {/* CHECKBOX DE ACEITE */}
            <label
              className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${
                aceito
                  ? 'border-[#0C3A59] bg-[#0C3A59]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={aceito}
                onChange={(e) => { setAceito(e.target.checked); setError(''); }}
                className="w-5 h-5 mt-0.5 accent-[#0C3A59] cursor-pointer flex-shrink-0"
              />
              <span className="text-sm text-gray-700 leading-relaxed">
                Li e concordo com o Termo de Adesão e declaro que todas as informações fornecidas são verdadeiras
                e estou ciente das condições de associação à ACIST São Leopoldo.
              </span>
            </label>

            {/* BOTÕES DE NAVEGAÇÃO */}
            <div className="flex justify-between mt-10 pt-8 border-t">
              <button
                type="button"
                onClick={() => navigate(`/cadastro/${id}/documentos`)}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleFinalizar}
                disabled={loading || !aceito}
                className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all ${
                  aceito
                    ? 'bg-[#0C3A59] text-white hover:opacity-90'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                {loading ? 'Finalizando...' : 'Finalizar Cadastro'}
              </button>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
