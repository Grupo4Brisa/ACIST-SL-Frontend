import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Share2,
  Save,
  ArrowRight,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import api from "../services/api";
import Header from "../components/Header/Header";
import ProgressoCadastro from "../components/ProgressoCadastro";
import Footer from "../components/Footer/Footer";

const inputStyle = `
  w-full px-4 py-3 rounded-lg border border-gray-300 bg-white
  text-gray-800 placeholder:text-gray-400 outline-none transition
  focus:ring-2 focus:ring-[#0C3A59] focus:border-[#0C3A59]
`;

const labelStyle = `block mb-2 text-sm font-medium text-gray-700`;

interface OutraRede {
  nome: string;
  url: string;
}

export default function CadastroRedesSociais() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [outras, setOutras] = useState<OutraRede[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // Toast (substitui os antigos alert())
  // =========================
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showToast(message: string, type: "success" | "error" = "error") {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);

    setToast({ message, type });
    requestAnimationFrame(() => setToastVisible(true));

    toastTimeoutRef.current = setTimeout(() => {
      dismissToast();
    }, 4000);
  }

  function dismissToast() {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastVisible(false);
    setTimeout(() => setToast(null), 300);
  }

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    api
      .get(`/social-networks/company/${id}`)
      .then((res) => {
        if (res.data) {
          setFacebook(res.data.facebook || "");
          setInstagram(res.data.instagram || "");
          setLinkedin(res.data.linkedin || "");
        }
      })
      .catch(() => {});
  }, [id]);

  function addOutraRede() {
    setOutras([...outras, { nome: "", url: "" }]);
  }

  function removeOutraRede(index: number) {
    setOutras(outras.filter((_, i) => i !== index));
  }

  function updateOutraRede(
    index: number,
    field: keyof OutraRede,
    value: string,
  ) {
    const updated = [...outras];
    updated[index] = { ...updated[index], [field]: value };
    setOutras(updated);
  }

  async function saveDraft() {
    try {
      setLoading(true);
      setError("");
      const payload = {
        companyId: Number(id),
        facebook: facebook || undefined,
        instagram: instagram || undefined,
        linkedin: linkedin || undefined,
        other:
          outras
            .filter((r) => r.nome && r.url)
            .map((r) => `${r.nome}: ${r.url}`)
            .join(", ") || undefined,
      };
      try {
        await api.post(`/social-networks`, payload);
      } catch (e: any) {
        if (e.response?.status === 409) {
          const { companyId, ...updatePayload } = payload;
          await api.patch(`/social-networks/${id}`, updatePayload);
        } else throw e;
      }
      showToast("Rascunho salvo com sucesso!", "success");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao salvar redes sociais.");
      showToast("Erro ao salvar rascunho.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleNext() {
    await saveDraft();
    navigate(`/cadastro/${id}/solucoes`);
  }

  return (
    <div className="min-h-screen bg-[#0C3A59] flex flex-col">
      <Header />

      {/* =========================
          TOAST
      ========================== */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`
            fixed top-6 right-6 z-50 flex items-start gap-3
            w-full max-w-sm rounded-xl border shadow-lg px-4 py-3.5
            transition-all duration-300 ease-out
            ${toastVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"}
            ${
              toast.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }
          `}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          )}

          <p className="text-sm flex-1 leading-snug">{toast.message}</p>

          <button
            type="button"
            onClick={dismissToast}
            aria-label="Fechar aviso"
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-12 w-full">
          <div className="bg-white rounded-2xl shadow-xl p-10">
            {/* CABEÇALHO DA ETAPA */}
            <div className="flex justify-between items-start mb-6 gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Cadastro de Associado
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Etapa 4 de 8 - Redes Sociais
                </p>
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
              </div>
            </div>

            <ProgressoCadastro etapaAtual={4} />

            {/* TÍTULO DA SEÇÃO */}
            <div className="flex items-center gap-3 mb-2">
              <Share2 className="h-7 w-7 text-[#0C3A59]" />
              <h2 className="text-2xl font-semibold text-gray-800">
                Redes Sociais
              </h2>
            </div>
            <p className="text-gray-500 mb-8">
              Informe os perfis da sua empresa nas redes sociais.
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* CAMPOS */}
            <div className="space-y-5">
              {/* FACEBOOK */}
              <div>
                <label className={labelStyle}>Facebook</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium select-none">
                    facebook.com/
                  </span>
                  <input
                    type="text"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    placeholder="suaempresa"
                    className="w-full pl-[120px] pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-[#0C3A59] focus:border-[#0C3A59]"
                  />
                </div>
              </div>

              {/* INSTAGRAM */}
              <div>
                <label className={labelStyle}>Instagram</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium select-none">
                    instagram.com/
                  </span>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="suaempresa"
                    className="w-full pl-[124px] pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-[#0C3A59] focus:border-[#0C3A59]"
                  />
                </div>
              </div>

              {/* LINKEDIN */}
              <div>
                <label className={labelStyle}>LinkedIn</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium select-none">
                    linkedin.com/company/
                  </span>
                  <input
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="suaempresa"
                    className="w-full pl-[180px] pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-[#0C3A59] focus:border-[#0C3A59]"
                  />
                </div>
              </div>

              {/* OUTRAS REDES */}
              {outras.length > 0 && (
                <div className="space-y-4 pt-2">
                  <h3 className="font-semibold text-gray-700">Outras Redes</h3>
                  {outras.map((rede, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-xl p-5"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-medium text-gray-600">
                          Rede {index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeOutraRede(index)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remover
                        </button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className={labelStyle}>Nome da Rede</label>
                          <input
                            type="text"
                            value={rede.nome}
                            onChange={(e) =>
                              updateOutraRede(index, "nome", e.target.value)
                            }
                            placeholder="Ex: TikTok, YouTube..."
                            className={inputStyle}
                          />
                        </div>
                        <div>
                          <label className={labelStyle}>URL</label>
                          <input
                            type="url"
                            value={rede.url}
                            onChange={(e) =>
                              updateOutraRede(index, "url", e.target.value)
                            }
                            placeholder="https://..."
                            className={inputStyle}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BOTÃO ADICIONAR OUTRAS REDES */}
            <button
              type="button"
              onClick={addOutraRede}
              className="mt-6 px-5 py-3 border border-gray-300 rounded-lg flex items-center gap-2 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Adicionar Outras Redes
            </button>

            {/* BOTÕES DE NAVEGAÇÃO */}
            <div className="flex justify-between mt-10 pt-8 border-t">
              <button
                type="button"
                onClick={() => navigate(`/cadastro/${id}/divulgacao`)}
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
