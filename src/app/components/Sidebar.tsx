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

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-sidebar">
      <nav className="flex-1 space-y-1 px-3 py-4 mt-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/admin'}
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
