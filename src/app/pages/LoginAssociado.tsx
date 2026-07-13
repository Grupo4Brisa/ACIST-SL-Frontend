import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import Logo from '../components/Logo';

export default function LoginAssociado() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cadastroSucesso = searchParams.get('cadastro') === 'sucesso';

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (cadastroSucesso) {
      setShowSuccessMessage(true);
      // Remover mensagem após 10 segundos
      setTimeout(() => setShowSuccessMessage(false), 10000);
    }
  }, [cadastroSucesso]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      // Simular login bem-sucedido
      navigate('/area-associado');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0C3A59] to-[#226897] flex flex-col">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo size="md" theme="light" />
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 bg-[#5DA5FF] text-white hover:bg-[#226897] rounded-lg transition-colors"
            >
              Voltar à Página Inicial
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-0 bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Imagem à Esquerda */}
          <div className="hidden md:block relative">
            <img
              src="https://images.unsplash.com/photo-1642522029686-5485ea7e6042?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
              alt="Profissional trabalhando"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Formulário à Direita */}
          <div className="p-8 md:p-12">
            <div className="text-center mb-6">
              <p className="text-[#0C3A59] text-[1.125rem] font-semibold mb-2">Área do Associado</p>
              <h2 className="mb-2">Acesse sua conta</h2>
              <p className="text-muted-foreground">
                Acompanhe seu cadastro e informações
              </p>
            </div>

            {showSuccessMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-800 font-semibold mb-1">Cadastro realizado com sucesso!</p>
                  <p className="text-green-700 text-sm">
                    Seu cadastro foi concluído. Utilize o email e senha cadastrados para acessar sua área.
                  </p>
                </div>
              </div>
            )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2">
                <Mail className="inline h-4 w-4 mr-2" />
                Email
              </label>
              <input
                type="email"
                required
                placeholder="seu.email@empresa.com.br"
                className="w-full px-4 py-3.5 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block mb-2">
                <Lock className="inline h-4 w-4 mr-2" />
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 pr-12 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  value={formData.senha}
                  onChange={e => setFormData({ ...formData, senha: e.target.value })}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[0.875rem]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#5DA5FF] hover:bg-[#226897] text-white py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-[0.875rem] text-[#5DA5FF] hover:underline">
              Esqueci minha senha
            </a>
          </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-[0.875rem]">
              © 2026 ACIST São Leopoldo. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-gray-600 text-[0.875rem]">
              <a
                href="https://www.acistsl.com.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#5DA5FF] transition-colors underline decoration-transparent hover:decoration-[#5DA5FF]"
              >
                Sobre
              </a>
              <a
                href="https://wa.me/5551999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#5DA5FF] transition-colors underline decoration-transparent hover:decoration-[#5DA5FF]"
              >
                Contato
              </a>
              <a
                href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#5DA5FF] transition-colors underline decoration-transparent hover:decoration-[#5DA5FF]"
              >
                Privacidade
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
