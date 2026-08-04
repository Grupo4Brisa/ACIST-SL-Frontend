import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText, Save, ArrowRight, LogOut, Upload, CheckCircle, X, Plus, Trash2, Eye, Download } from 'lucide-react';
import api from '../services/api';
import Header from '../components/Header/Header';
import ProgressoCadastro from '../components/ProgressoCadastro';
import Footer from '../components/Footer/Footer';

interface DocConfig {
  label: string;
  key: string;
  obrigatorio: boolean;
}

interface DocSalvo {
  id: number;
  fileName: string;
  documentType: string;
}

const DOCS_CONFIG: DocConfig[] = [
  { label: 'Guia FGTS',                           key: 'STATUTE',           obrigatorio: false },
  { label: 'Logotipo da Empresa',                 key: 'LOGO',              obrigatorio: false },
  { label: 'Contrato Social / Guia do Empresário',key: 'SOCIAL_CONTRACT',   obrigatorio: false },
  { label: 'Cartão CNPJ',                         key: 'CNPJ',              obrigatorio: false },
  { label: 'Comprovante de Endereço',             key: 'BUSINESS_LICENSE',  obrigatorio: false },
  { label: 'RG dos Sócios',                       key: 'STATE_REGISTRATION',obrigatorio: false },
  { label: 'Comprovante PIX',                     key: 'OTHER',             obrigatorio: false },
];

export default function CadastroDocumentos() {

  const navigate = useNavigate();
  const { id } = useParams();

  const [docsSalvos, setDocsSalvos] = useState<DocSalvo[]>([]);
  const [novosArquivos, setNovosArquivos] = useState<Record<string, File[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/documents/company/${id}`)
      .then(res => setDocsSalvos(res.data || []))
      .catch(() => {});
  }, [id]);

  function addFiles(key: string, files: FileList | null) {
    if (!files) return;
    setNovosArquivos(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), ...Array.from(files)],
    }));
  }

  function removeNovoArquivo(key: string, index: number) {
    setNovosArquivos(prev => ({
      ...prev,
      [key]: (prev[key] || []).filter((_, i) => i !== index),
    }));
  }

  async function removeSalvo(docId: number) {
    try {
      await api.delete(`/documents/${docId}`);
      setDocsSalvos(prev => prev.filter(d => d.id !== docId));
    } catch {
      // silencioso
    }
  }

  async function viewSalvo(docId: number) {
    try {
      const response = await api.get(`/documents/${docId}/download`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch {
      // silencioso
    }
  }

  async function downloadSalvo(docId: number, fileName: string) {
    try {
      const response = await api.get(`/documents/${docId}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      // silencioso
    }
  }

  function validateObrigatorios() {
    return DOCS_CONFIG
      .filter(d => d.obrigatorio)
      .every(d => {
        const salvos = docsSalvos.filter(s => s.documentType === d.key);
        const novos = novosArquivos[d.key] || [];
        return salvos.length > 0 || novos.length > 0;
      });
  }

  async function saveDraft() {
  try {
    setLoading(true);
    setError('');
    for (const [key, files] of Object.entries(novosArquivos)) {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('documentType', key);
        formData.append('companyId', String(id));
        await api.post('/documents', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
    }
    const res = await api.get(`/documents/company/${id}`);
    setDocsSalvos(res.data || []);
    setNovosArquivos({});
    alert('Rascunho salvo com sucesso!');
  } catch (err: any) {
    setError(err.response?.data?.message || 'Erro ao salvar documentos.');
    alert('Erro ao salvar rascunho.');
  } finally {
    setLoading(false);
  }
}

  async function handleNext() {
    if (!validateObrigatorios()) {
      setError('Por favor, anexe todos os documentos obrigatórios antes de continuar.');
      return;
    }
    await saveDraft();
    navigate(`/cadastro/${id}/aceite`);
  }

  const obrigatorios = DOCS_CONFIG.filter(d => d.obrigatorio);
  const opcionais = DOCS_CONFIG.filter(d => !d.obrigatorio);

  return (
    <div className="min-h-screen bg-[#0C3A59] flex flex-col">

      <Header />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-12 w-full">
          <div className="bg-white rounded-2xl shadow-xl p-10">

            <div className="flex justify-between items-start mb-6 gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Cadastro de Associado</h1>
                <p className="text-sm text-gray-500 mt-1">Etapa 7 de 8 - Documentos</p>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={saveDraft} disabled={loading}
                  className="px-4 py-2 rounded-lg border border-gray-300 flex items-center gap-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50">
                  <Save size={16} />
                  Salvar Rascunho
                </button>
                <button type="button" onClick={() => navigate('/')}
                  className="px-4 py-2 rounded-lg border border-gray-300 flex items-center gap-2 text-gray-700 hover:bg-gray-100">
                  <LogOut size={16} />
                  Voltar
                </button>
              </div>
            </div>

            <ProgressoCadastro etapaAtual={7} />

            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-7 w-7 text-[#0C3A59]" />
              <h2 className="text-2xl font-semibold text-gray-800">Documentos</h2>
            </div>
            <p className="text-sm text-gray-500 mb-8">
              Documentos marcados com <span className="text-red-500 font-semibold">*</span> são obrigatórios.
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
            )}

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Documentos Obrigatórios</h3>
              <div className="space-y-4">
                {obrigatorios.map(doc => (
                  <DocRow key={doc.key} config={doc}
                    salvos={docsSalvos.filter(s => s.documentType === doc.key)}
                    novos={novosArquivos[doc.key] || []}
                    onAdd={(files) => addFiles(doc.key, files)}
                    onRemoveNovo={(i) => removeNovoArquivo(doc.key, i)}
                    onRemoveSalvo={removeSalvo}
                    onViewSalvo={viewSalvo}
                    onDownloadSalvo={downloadSalvo}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Documentos Opcionais</h3>
              <div className="space-y-4">
                {opcionais.map(doc => (
                  <DocRow key={doc.key} config={doc}
                    salvos={docsSalvos.filter(s => s.documentType === doc.key)}
                    novos={novosArquivos[doc.key] || []}
                    onAdd={(files) => addFiles(doc.key, files)}
                    onRemoveNovo={(i) => removeNovoArquivo(doc.key, i)}
                    onRemoveSalvo={removeSalvo}
                    onViewSalvo={viewSalvo}
                    onDownloadSalvo={downloadSalvo}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-10 pt-8 border-t">
              <button type="button" onClick={async () => { await saveDraft(); navigate(`/cadastro/${id}/mensalidade`); }}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100">
                Voltar
              </button>
              <button type="button" onClick={handleNext} disabled={loading}
                className="px-6 py-3 bg-[#0C3A59] text-white rounded-lg flex items-center gap-2 hover:opacity-90 disabled:opacity-50">
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

function DocRow({ config, salvos, novos, onAdd, onRemoveNovo, onRemoveSalvo, onViewSalvo, onDownloadSalvo }: {
  config: DocConfig;
  salvos: DocSalvo[];
  novos: File[];
  onAdd: (files: FileList | null) => void;
  onRemoveNovo: (index: number) => void;
  onRemoveSalvo: (id: number) => void;
  onViewSalvo: (id: number) => void;
  onDownloadSalvo: (id: number, fileName: string) => void;
}) {
  const temArquivo = salvos.length > 0 || novos.length > 0;

  return (
    <div className={`border rounded-xl p-5 ${temArquivo ? 'border-green-200' : 'border-gray-200'}`}>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className={`h-5 w-5 ${temArquivo ? 'text-green-500' : 'text-gray-400'}`} />
          <span className="text-sm font-medium text-gray-700">
            {config.label}
            {config.obrigatorio && <span className="text-red-500 ml-1">*</span>}
          </span>
        </div>
        {temArquivo && <CheckCircle className="h-5 w-5 text-green-500" />}
      </div>

      {/* ARQUIVOS SALVOS */}
      {salvos.length > 0 && (
        <div className="space-y-2 mb-3">
          {salvos.map(doc => (
            <div key={doc.id} className="flex items-center justify-between px-3 py-2 rounded-lg border border-green-200 bg-green-50 text-sm text-green-700">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-4 w-4 shrink-0" />
                <span className="truncate max-w-[260px]">{doc.fileName}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button type="button" onClick={() => onViewSalvo(doc.id)}
                  title="Visualizar"
                  className="p-1.5 rounded-md text-green-500 hover:bg-green-100 hover:text-green-700 transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => onDownloadSalvo(doc.id, doc.fileName)}
                  title="Baixar"
                  className="p-1.5 rounded-md text-green-500 hover:bg-green-100 hover:text-green-700 transition-colors">
                  <Download className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => onRemoveSalvo(doc.id)}
                  title="Remover"
                  className="p-1.5 rounded-md text-green-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* NOVOS ARQUIVOS */}
      {novos.length > 0 && (
        <div className="space-y-2 mb-3">
          {novos.map((file, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg border border-blue-200 bg-blue-50 text-sm text-blue-700">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="truncate max-w-[260px]">{file.name}</span>
                <span className="text-xs text-blue-400">(não salvo)</span>
              </div>
              <button type="button" onClick={() => onRemoveNovo(i)}
                className="ml-2 text-blue-400 hover:text-red-500 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <label className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-sm text-gray-600 transition-colors">
        <Plus className="h-4 w-4" />
        {temArquivo ? 'Adicionar outro arquivo' : 'Escolher arquivo'}
        <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" multiple
          onChange={(e) => onAdd(e.target.files)} />
      </label>

    </div>
  );
}
