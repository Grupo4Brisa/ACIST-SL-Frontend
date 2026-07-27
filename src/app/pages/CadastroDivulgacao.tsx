import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Megaphone, Save, ArrowRight, LogOut } from 'lucide-react';
import api from '../services/api';
import Header from '../components/Header/Header';
import ProgressoCadastro from '../components/ProgressoCadastro';
import Footer from '../components/Footer/Footer';

const labelStyle = `block mb-2 text-sm font-medium text-gray-700`;

export default function CadastroDivulgacao() {

  const navigate = useNavigate();
  const { id } = useParams();

  const [texto, setTexto] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const MAX_CHARS = 200;

  useEffect(() => {
    api.get(`/companies/${id}`)
      .then(res => { if (res.data?.eventPresentation) setTexto(res.data.eventPresentation); })
      .catch(() => {});
  }, [id]);

  async function saveDraft() {
  try {
    setLoading(true);
    setError('');
    await api.patch(`/companies/${id}`, { eventPresentation: texto });
    alert('Rascunho salvo com sucesso!');
  } catch (err: any) {
    setError(err.response?.data?.message || 'Erro ao salvar.');
    alert('Erro ao salvar rascunho.');
  } finally {
    setLoading(false);
  }
}

  async function handleNext() {
    await saveDraft();
    navigate(`/cadastro/${id}/redes-sociais`);
  }

  return (
    <div className="min-h-screen bg-[#0C3A59] flex flex-col">

      <Header />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-12 w-full">
          <div className="bg-white rounded-2xl shadow-xl p-10">

            {/* CABEÇALHO DA ETAPA */}
            <div className="flex justify-between items-start mb-10 gap-4 flex-wrap">

              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Cadastro de Associado
                </h1>
                <p className="text-sm text-gray-500 mt-1">Etapa 3 de 8 - Divulgação</p>
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

            <ProgressoCadastro etapaAtual={3} />

            {/* TÍTULO DA SEÇÃO */}
            <div className="flex items-center gap-3 mb-2">
              <Megaphone className="h-7 w-7 text-[#0C3A59]" />
              <h2 className="text-2xl font-semibold text-gray-800">Divulgação</h2>
            </div>
            <p className="text-gray-500 mb-8">
              Escreva uma apresentação da sua empresa para divulgação nos canais da ACIST São Leopoldo.
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* CAMPO DE TEXTO */}
            <div>
              <label className={labelStyle}>
                Texto de Divulgação da Empresa (até 200 caracteres)
                <span className="text-red-500 ml-1">*</span>
              </label>

              <textarea
                value={texto}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_CHARS) {
                    setTexto(e.target.value);
                  }
                }}
                placeholder="Descreva brevemente sua empresa e seus principais serviços ou produtos..."
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-[#0C3A59] focus:border-[#0C3A59] resize-none"
              />

              <div className="flex justify-end mt-1">
                <span className={`text-sm ${texto.length >= MAX_CHARS ? 'text-red-500' : 'text-gray-400'}`}>
                  {texto.length}/{MAX_CHARS} caracteres
                </span>
              </div>

              <p className="mt-3 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                Este texto será utilizado em materiais de divulgação da ACIST e em nosso site para apresentar sua empresa aos demais associados.
              </p>
            </div>

            {/* BOTÕES DE NAVEGAÇÃO */}
            <div className="flex justify-between mt-10 pt-8 border-t">
              <button
                type="button"
                onClick={() => navigate(`/cadastro/${id}/contatos`)}
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
