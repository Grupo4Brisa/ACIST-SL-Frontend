import { NavLink, useNavigate } from 'react-router';
import {
  LayoutDashboard,
  Layers,
  Users,
  FileText,
  CheckSquare,
  BarChart3,
  ClipboardCheck,
  LogOut,
  Calendar,
  DollarSign,
  UserCog,
  X,
} from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

const navigation = [
  { name: 'Dashboard',      href: '/admin',                icon: LayoutDashboard },
  { name: 'Funil',          href: '/admin/funil',          icon: Layers },
  { name: 'Cadastros',      href: '/admin/cadastros',      icon: Users },
  { name: 'Aprovações',     href: '/admin/aprovacoes',     icon: ClipboardCheck },
  { name: 'Tarefas',        href: '/admin/tarefas',        icon: CheckSquare },
  { name: 'Eventos',        href: '/admin/eventos',        icon: Calendar },
  { name: 'Pagamentos',     href: '/admin/pagamentos',     icon: DollarSign },
  { name: 'Colaboradores',  href: '/admin/colaboradores',  icon: UserCog },
  { name: 'Relatórios',     href: '/admin/relatorios',     icon: BarChart3 },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      className={`
        fixed md:static
        top-0 left-0
        h-screen
        w-64
        flex flex-col
        bg-sidebar
        z-50
        transform transition-transform duration-200
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}
    >
      {/* Cabeçalho do drawer, só aparece no mobile */}
      <div className="flex items-center justify-between px-3 py-4 md:hidden">
        <Logo size="sm" theme="light" />
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent"
          aria-label="Fechar menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4 md:mt-4 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/admin'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-sidebar-border p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sidebar-foreground/80 transition-colors hover:bg-red-600 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}