import { CheckCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';

const ETAPAS = [
  { label: 'Dados Cadastrais', rota: '' },
  { label: 'Contatos',         rota: 'contatos' },
  { label: 'Divulgação',       rota: 'divulgacao' },
  { label: 'Redes Sociais',    rota: 'redes-sociais' },
  { label: 'Soluções',         rota: 'solucoes' },
  { label: 'Mensalidade',      rota: 'mensalidade' },
  { label: 'Documentos',       rota: 'documentos' },
  { label: 'Termo de Adesão',  rota: 'aceite' },
];

interface Props {
  etapaAtual: number; // 1 a 8
}

export default function ProgressoCadastro({ etapaAtual }: Props) {
  const navigate = useNavigate();
  const { id } = useParams();

  function irParaEtapa(index: number) {
    const rota = ETAPAS[index].rota;
    const base = `/cadastro/${id}`;
    navigate(rota ? `${base}/${rota}` : base);
  }

  return (
    <div className="grid grid-cols-4 md:grid-cols-8 gap-4 mb-10">
      {ETAPAS.map((etapa, index) => {
        const num = index + 1;
        const concluida = num < etapaAtual;
        const atual = num === etapaAtual;

        return (
          <div
            key={index}
            className="text-center cursor-pointer group"
            onClick={() => irParaEtapa(index)}
            title={`Ir para ${etapa.label}`}
          >
            <div className={`
              mx-auto w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all
              group-hover:opacity-80 group-hover:scale-110
              ${atual    ? 'bg-[#0C3A59] text-white' :
                concluida? 'bg-green-500 text-white' :
                           'bg-gray-200 text-gray-500'}
            `}>
              {concluida
                ? <CheckCircle className="h-5 w-5" />
                : num
              }
            </div>
            <span className={`block mt-2 text-xs ${atual ? 'text-[#0C3A59] font-semibold' : concluida ? 'text-green-600' : 'text-gray-500'}`}>
              {etapa.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
