import { Outlet, useNavigate } from 'react-router';
import { LogOut } from 'lucide-react';
import Sidebar from './Sidebar';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleTrocarPerfil = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo size="md" theme="light" />
            <div className="flex gap-3">
              <button
                onClick={handleTrocarPerfil}
                className="px-6 py-2.5 border border-[#5DA5FF] text-[#5DA5FF] hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Trocar Perfil
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2.5 bg-[#5DA5FF] text-white hover:bg-[#226897] rounded-lg transition-colors"
              >
                Voltar à Página Inicial
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-auto flex flex-col" style={{ backgroundColor: '#E5E7EB' }}>
          <div className="flex-1">
            <Outlet />
          </div>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200">
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
      </div>
    </div>
  );
}
