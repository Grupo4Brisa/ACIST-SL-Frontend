import { Link, useNavigate } from 'react-router';
import { AlertTriangle, Home } from 'lucide-react';
import Logo from '../components/Logo';

export default function ErrorPage() {
  const navigate = useNavigate();

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
        <div className="max-w-md w-full text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>
          </div>
          <h1 className="mb-4 text-white">Página não encontrada</h1>
          <p className="text-blue-100 mb-8">
            A página que você está procurando não existe ou foi movida.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#5DA5FF] text-white rounded-lg hover:bg-[#226897] transition-colors"
          >
            <Home className="h-4 w-4" />
            Voltar para o início
          </Link>
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
