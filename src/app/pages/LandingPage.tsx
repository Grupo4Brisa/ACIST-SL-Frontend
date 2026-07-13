import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Building2, Mail, Phone, Hash, MessageCircle, CheckCircle, Eye, EyeOff, Briefcase } from 'lucide-react';
import Logo from '../components/Logo';
import WhatsAppButton from '../components/WhatsAppButton';

export default function LandingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const campanha = searchParams.get('c') || 'Campanha Geral';
  const origem = searchParams.get('utm_source') || 'Direto';

  const [formData, setFormData] = useState({
    cnpj: '',
    companyName: '',
    corporateName: '',
    email: '',
    senha: '',
    companySize: '',
    phone: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      navigate(`/pagamento-pix?porte=${formData.companySize}`);
    }, 2000);
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/5551999999999?text=Olá! Gostaria de me associar à ACIST São Leopoldo', '_blank');
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0C3A59] to-[#226897] flex flex-col">
        {/* Header */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Logo size="md" theme="light" />
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2.5 bg-[#5DA5FF] text-white hover:bg-[#226897] rounded-lg transition-colors"
              >
                Área do Colaborador
              </button>
            </div>
          </div>
        </nav>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full text-center">
            <div className="mb-6 flex justify-center">
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
            </div>
            <h2 className="mb-4">Cadastro Recebido!</h2>
            <p className="text-muted-foreground mb-6">
              Estamos processando suas informações. Em instantes você será direcionado para completar seu cadastro.
            </p>
            <div className="animate-pulse flex justify-center">
              <div className="w-12 h-1 bg-blue-600 rounded-full" />
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
                  phone
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0C3A59] to-[#226897]">
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

      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Logo size="lg" theme="dark" />
          </div>
          <h1 className="text-white mb-4 text-[2.5rem] leading-tight">Associe-se à ACIST</h1>
          <p className="text-blue-100 text-[1.25rem] max-w-2xl mx-auto">
            Faça parte da maior rede de empresários da região. Juntos, fortalecemos o desenvolvimento econômico local.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {campanha && (
              <div className="bg-blue-500 text-white px-6 py-4 border-b border-blue-400">
                <p className="text-center">
                  <span className="opacity-90">Você está participando da:</span>
                  <span className="ml-2">{campanha}</span>
                </p>
              </div>
            )}

            <div className="p-8">
              <h2 className="mb-2 text-center">🔵 ATUALIZADO - Comece seu Cadastro 🔵</h2>
              <p className="text-muted-foreground text-center mb-8">
                Preencha os dados abaixo para iniciar sua jornada
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block mb-2">
                    <Hash className="inline h-4 w-4 mr-2" />
                    CPF ou CNPJ
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="000.000.000-00 ou 00.000.000/0000-00"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.cnpj}
                    onChange={e => setFormData({ ...formData, cnpj: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block mb-2">
                    <Building2 className="inline h-4 w-4 mr-2" />
                    name da empresa ou name completo
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Sua empresa ou seu name"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.companyName}
                    onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block mb-2">
                    <Building2 className="inline h-4 w-4 mr-2" />
                    Razão social
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Razão social da empresa"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.corporateName}
                    onChange={e => setFormData({ ...formData, corporateName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block mb-2">
                    <Mail className="inline h-4 w-4 mr-2" />
                    E-mail
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="phone@empresa.com.br"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block mb-2">
                    <Eye className="inline h-4 w-4 mr-2" />
                    Criar senha
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Digite sua senha"
                      className="w-full px-4 py-3 pr-12 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.senha}
                      onChange={e => setFormData({ ...formData, senha: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block mb-2">
                    <Briefcase className="inline h-4 w-4 mr-2" />
                    Porte da empresa
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.companySize}
                    onChange={e => setFormData({ ...formData, companySize: e.target.value })}
                  >
                    <option value="">Selecione o porte</option>
                    <option value="mei">MEI</option>
                    <option value="pequena">Pequena empresa</option>
                    <option value="media">Média empresa</option>
                    <option value="grande">Grande empresa</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2">
                    <Phone className="inline h-4 w-4 mr-2" />
                    phone / phone
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(51) 99999-9999"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-lg transition-colors"
                >
                  Continuar Cadastro
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-border">
                <p className="text-center text-muted-foreground mb-4">
                  Prefere falar conosco diretamente?
                </p>
                <button
                  onClick={handleWhatsApp}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg transition-colors flex items-center justify-center gap-3"
                >
                  <MessageCircle className="h-5 w-5" />
                  Falar pelo WhatsApp
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-blue-100 mt-8 text-[0.875rem]">
            Ao prosseguir, você concorda com nossos termos de uso e política de Privacidade
          </p>
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
