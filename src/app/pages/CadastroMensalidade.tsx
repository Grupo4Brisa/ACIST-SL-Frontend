import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DollarSign, ArrowRight, LogOut, CheckCircle } from 'lucide-react';
import api from '../services/api';
import Header from '../components/Header/Header';
import ProgressoCadastro from '../components/ProgressoCadastro';
import Footer from '../components/Footer/Footer';

const valoresPorPorte: Record<string, number> = {
  MEI: 42,
  MICROEMPRESA: 42,
  PEQUENA: 103,
  MEDIA: 230,
  GRANDE: 496,
};

const BENEFICIOS = [
  'Acesso a todos os eventos e capacitações da ACIST',
  'Networking com empresários da região',
  'Convênios e descontos exclusivos',
  'Representação e defesa dos interesses empresariais',
  'Divulgação da sua empresa em canais da ACIST',
];

function normalizarPorte(porte: string) {
  return porte
    .toUpperCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

export default function CadastroMensalidade() {

  const navigate = useNavigate();
  const { id } = useParams();

  const [porteRaw, setPorteRaw] = useState('');
  const [valor, setValor] = useState<number | null>(null);

  useEffect(() => {
    async function carregarPorte() {
      // tenta localStorage primeiro
      const companyData = JSON.parse(localStorage.getItem('companyData') || '{}');
      const localPorte = companyData?.companySize || localStorage.getItem('companySize') || '';

      if (localPorte) {
        const porte = normalizarPorte(localPorte);
        setPorteRaw(localPorte);
        setValor(valoresPorPorte[porte] ?? null);
        return;
      }

      // se não tiver, busca da API
      try {
        const response = await api.get(`/companies/${id}`);
        const porte = normalizarPorte(response.data.companySize || '');
        setPorteRaw(response.data.companySize || '');
        setValor(valoresPorPorte[porte] ?? null);
      } catch {
        // silencioso
      }
    }

    carregarPorte();
  }, [id]);

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
                <p className="text-sm text-gray-500 mt-1">Etapa 6 de 8 - Mensalidade</p>
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

            <ProgressoCadastro etapaAtual={6} />

            {/* TÍTULO DA SEÇÃO */}
            <div className="flex items-center gap-3 mb-8">
              <DollarSign className="h-7 w-7 text-[#0C3A59]" />
              <h2 className="text-2xl font-semibold text-gray-800">Mensalidade</h2>
            </div>

            {/* CARD DO VALOR */}
            <div className="bg-[#0C3A59] rounded-2xl p-8 text-white mb-8 flex flex-col md:flex-row items-center justify-between gap-6">

              <div>
                <p className="text-blue-200 text-sm mb-1">Porte da empresa</p>
                <p className="text-xl font-semibold">{porteRaw || 'Não informado'}</p>
              </div>

              <div className="text-center">
                <p className="text-blue-200 text-sm mb-1">Valor da mensalidade</p>
                {valor !== null ? (
                  <p className="text-4xl font-bold">
                    R$ {valor.toFixed(2).replace('.', ',')}
                    <span className="text-lg font-normal text-blue-200">/mês</span>
                  </p>
                ) : (
                  <p className="text-lg text-blue-200">Porte não identificado</p>
                )}
              </div>

            </div>

            {/* O QUE ESTÁ INCLUSO */}
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">O que está incluso:</h3>
              <ul className="space-y-3">
                {BENEFICIOS.map((beneficio, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#0C3A59] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{beneficio}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-4 text-xs text-gray-400 text-center">
              O valor é calculado automaticamente com base no porte da empresa e não pode ser editado.
            </p>

            {/* BOTÕES DE NAVEGAÇÃO */}
            <div className="flex justify-between mt-10 pt-8 border-t">
              <button
                type="button"
                onClick={() => navigate(`/cadastro/${id}/solucoes`)}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => navigate(`/cadastro/${id}/documentos`)}
                className="px-6 py-3 bg-[#0C3A59] text-white rounded-lg flex items-center gap-2 hover:opacity-90"
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
