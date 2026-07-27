import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Lightbulb, Save, ArrowRight, LogOut } from 'lucide-react';
import api from '../services/api';
import Header from '../components/Header/Header';
import ProgressoCadastro from '../components/ProgressoCadastro';
import Footer from '../components/Footer/Footer';

interface Solucao {
  id: number;
  name: string;
  description?: string;
}

export default function CadastroSolucoes() {

  const navigate = useNavigate();
  const { id } = useParams();

  const [solucoes, setSolucoes] = useState<Solucao[]>([]);
  const [selecionadas, setSelecionadas] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSolucoes, setLoadingSolucoes] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/solutions')
      .then(res => setSolucoes(res.data || []))
      .catch(() => setError('Erro ao carregar as soluções disponíveis.'))
      .finally(() => setLoadingSolucoes(false));

    api.get(`/company-solutions/company/${id}`)
      .then(res => {
        if (res.data?.length > 0) {
          setSelecionadas(res.data.map((s: any) => s.solutionId));
        }
      })
      .catch(() => {});
  }, [id]);

  function toggleSolucao(solucaoId: number) {
    setSelecionadas(prev =>
      prev.includes(solucaoId)
        ? prev.filter(s => s !== solucaoId)
        : [...prev, solucaoId]
    );
  }

  async function saveDraft() {
  if (selecionadas.length === 0) {
    setError('Selecione ao menos uma solução para salvar.');
    return;
  }
  try {
    setLoading(true);
    setError('');
    await api.post(`/company-solutions/company/${id}`, {
      solutionIds: selecionadas
    });
    alert('Rascunho salvo com sucesso!');
  } catch (err: any) {
    setError(err.response?.data?.message || 'Erro ao salvar soluções.');
    alert('Erro ao salvar rascunho.');
  } finally {
    setLoading(false);
  }
}

  async function handleNext() {
    await saveDraft();
    navigate(`/cadastro/${id}/mensalidade`);
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
                <p className="text-sm text-gray-500 mt-1">Etapa 5 de 8 - Soluções</p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={saveDraft}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg border border-gray-300 flex items-center gap-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  <Save size={16} />
                  Salvar Rascunho
                </button>
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

            <ProgressoCadastro etapaAtual={5} />

            {/* TÍTULO DA SEÇÃO */}
            <div className="flex items-center gap-3 mb-2">
              <Lightbulb className="h-7 w-7 text-[#0C3A59]" />
              <h2 className="text-2xl font-semibold text-gray-800">Soluções de Interesse</h2>
            </div>
            <p className="text-gray-500 mb-8">
              Quais dessas soluções deseja agregar em seu negócio?
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* GRID DE SOLUÇÕES */}
            {loadingSolucoes ? (
              <p className="text-sm text-gray-500">Carregando soluções...</p>
            ) : solucoes.length === 0 ? (
              <p className="text-sm text-gray-500">
                Nenhuma solução disponível no momento.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {solucoes.map(solucao => {
                  const selecionada = selecionadas.includes(solucao.id);
                  return (
                    <label
                      key={solucao.id}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selecionada
                          ? 'border-[#0C3A59] bg-[#0C3A59]/5'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selecionada}
                        onChange={() => toggleSolucao(solucao.id)}
                        className="w-5 h-5 accent-[#0C3A59] cursor-pointer"
                      />
                      <span className={`text-sm font-medium ${selecionada ? 'text-[#0C3A59]' : 'text-gray-700'}`}>
                        {solucao.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}

            {selecionadas.length > 0 && (
              <p className="mt-4 text-sm text-gray-500">
                {selecionadas.length} solução(ões) selecionada(s)
              </p>
            )}

            {/* BOTÕES DE NAVEGAÇÃO */}
            <div className="flex justify-between mt-10 pt-8 border-t">
              <button
                type="button"
                onClick={() => navigate(`/cadastro/${id}/redes-sociais`)}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="px-6 py-3 bg-[#0C3A59] text-white rounded-lg flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
              >
                Próxima Etapa
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
