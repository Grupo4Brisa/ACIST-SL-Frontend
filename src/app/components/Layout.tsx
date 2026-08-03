import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { LogOut, Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import Logo from './Logo';
import Footer from './Footer/Footer';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleTrocarPerfil = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-3">

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                aria-label="Abrir menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <Logo size="md" theme="light" />
            </div>

            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={handleTrocarPerfil}
                className="px-3 sm:px-6 py-2.5 border border-[#5DA5FF] text-[#5DA5FF] hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Trocar Perfil</span>
              </button>
              <button
                onClick={() => navigate('/')}
                className="hidden sm:block px-6 py-2.5 bg-[#5DA5FF] text-white hover:bg-[#226897] rounded-lg transition-colors"
              >
                Voltar à Página Inicial
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden relative">

        {/* Overlay escuro atrás do menu, só no mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 overflow-auto flex flex-col min-w-0" style={{ backgroundColor: '#E5E7EB' }}>
          <div className="flex-1">
            <Outlet />
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
}