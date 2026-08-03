import { useState, useEffect } from "react";

import { useNavigate, useSearchParams } from "react-router";

import { Mail, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";

import Logo from "../components/Logo";

import api from "../services/api";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

export default function LoginAssociado() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const cadastroSucesso = searchParams.get("cadastro") === "sucesso";

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",

    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (cadastroSucesso) {
      setShowSuccessMessage(true);

      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [cadastroSucesso]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    setIsLoading(true);

    try {
      const response = await api.post("/auth/company-login", {
        email: formData.email,

        password: formData.password,
      });

      const { access_token, company } = response.data;

      localStorage.setItem("token", access_token);

      localStorage.setItem("company", JSON.stringify(company));

      navigate("/area-associado");
    } catch (err: any) {
      console.error("Erro login associado:", err);

      setError(err.response?.data?.message ?? "Email ou senha inválidos.");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-[#0C3A59]
        to-[#226897]
        flex
        flex-col
      "
    >
      {/* Header */}

      <Header
        showHomeButton
        showEmployeeArea={false}
        showAssociateArea={false}
      />

      <div
        className="
          flex-1
          flex
          items-center
          justify-center
          p-6
        "
      >
        <div
          className="
            w-full
            max-w-6xl
            grid
            md:grid-cols-2
            gap-0
            bg-white
            rounded-2xl
            shadow-2xl
            overflow-hidden
          "
        >
          {/* Imagem */}

          <div
            className="
              hidden
              md:block
              relative
            "
          >
            <img
              src="
              https://images.unsplash.com/photo-1642522029686-5485ea7e6042?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080
              "
              alt="Profissional trabalhando"
              className="
                absolute
                inset-0
                w-full
                h-full
                object-cover
              "
            />
          </div>

          {/* Formulário */}

          <div
            className="
              p-8
              md:p-12
            "
          >
            <div
              className="
                text-center
                mb-6
              "
            >
              <p
                className="
                  text-[#0C3A59]
                  text-[1.125rem]
                  font-semibold
                  mb-2
                "
              >
                Área do Associado
              </p>

              <h2 className="mb-2">Acesse sua conta</h2>

              <p
                className="
                  text-muted-foreground
                "
              >
                Acompanhe seu cadastro e informações
              </p>
            </div>

            {showSuccessMessage && (
              <div
                className="
                    mb-6
                    p-4
                    bg-green-50
                    border
                    border-green-200
                    rounded-lg
                    flex
                    items-start
                    gap-3
                  "
              >
                <CheckCircle
                  className="
                      h-5
                      w-5
                      text-green-600
                      flex-shrink-0
                      mt-0.5
                    "
                />

                <div>
                  <p
                    className="
                        text-green-800
                        font-semibold
                        mb-1
                      "
                  >
                    Cadastro realizado com sucesso!
                  </p>

                  <p
                    className="
                        text-green-700
                        text-sm
                      "
                  >
                    Utilize o email e senha cadastrados para acessar sua área.
                  </p>
                </div>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="
                space-y-6
              "
            >
              {/* EMAIL */}

              <div>
                <label
                  className="
                    block
                    mb-2
                  "
                >
                  <Mail
                    className="
                      inline
                      h-4
                      w-4
                      mr-2
                    "
                  />
                  Email
                </label>

                <input
                  type="email"
                  required
                  placeholder="
                    seu.email@empresa.com.br
                  "
                  className="
                    w-full
                    px-4
                    py-3.5
                    border
                    border-border
                    rounded-lg
                    bg-input-background
                    focus:outline-none
                    focus:ring-2
                    focus:ring-primary
                    transition-all
                  "
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,

                      email: e.target.value,
                    })
                  }
                  disabled={isLoading}
                />
              </div>

              {/* SENHA */}

              <div>
                <label
                  className="
                    block
                    mb-2
                  "
                >
                  <Lock
                    className="
                      inline
                      h-4
                      w-4
                      mr-2
                    "
                  />
                  Senha
                </label>

                <div
                  className="
                    relative
                  "
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="
                      w-full
                      px-4
                      py-3.5
                      pr-12
                      border
                      border-border
                      rounded-lg
                      bg-input-background
                      focus:outline-none
                      focus:ring-2
                      focus:ring-primary
                      transition-all
                    "
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,

                        password: e.target.value,
                      })
                    }
                    disabled={isLoading}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      text-muted-foreground
                      hover:text-foreground
                    "
                  >
                    {showPassword ? (
                      <EyeOff
                        className="
                          h-5
                          w-5
                        "
                      />
                    ) : (
                      <Eye
                        className="
                          h-5
                          w-5
                        "
                      />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  className="
                      p-3
                      bg-red-50
                      border
                      border-red-200
                      rounded-lg
                      text-red-700
                      text-[0.875rem]
                    "
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="
                  w-full
                  bg-[#5DA5FF]
                  hover:bg-[#226897]
                  text-white
                  py-4
                  rounded-lg
                  transition-all
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                {isLoading ? (
                  <>
                    <div
                      className="
                        w-5
                        h-5
                        border-2
                        border-white/30
                        border-t-white
                        rounded-full
                        animate-spin
                      "
                    />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </button>
            </form>
            <div
              className="
                mt-6
                text-center
              "
            >
              <a
                href="#"
                className="
                  text-[0.875rem]
                  text-[#5DA5FF]
                  hover:underline
                "
              >
                Esqueci minha senha
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}

      <Footer />
    </div>
  );
}
