import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DraggableQuickNav from './components/DraggableQuickNav';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Funil from './pages/Funil';
import Cadastros from './pages/Cadastros';
import Documentos from './pages/Documentos';
import Tarefas from './pages/Tarefas';
import Relatorios from './pages/Relatorios';
import LeadDetail from './pages/LeadDetail';
import CadastroWizardNew from './pages/CadastroWizardNew';
import Home from './pages/Home';
import Login from './pages/Login';
import LoginAssociado from './pages/LoginAssociado';
import AreaAssociado from './pages/AreaAssociado';
import EventoDetalhe from './pages/EventoDetalhe';
import EventosLista from './pages/EventosLista';
import Mensalidades from './pages/Mensalidades';
import AprovacaoCadastros from './pages/AprovacaoCadastros';
import PagamentoPix from './pages/PagamentoPix';
import BoasVindas from './pages/BoasVindas';
import ErrorPage from './pages/ErrorPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rotas Públicas */}

          {/* =========================================
              ROTA TEMPORÁRIA PARA TESTES
              Troque AreaAssociado pela página que deseja testar.
              Acesse: http://localhost:5173/teste
              Remover antes da entrega final.
          =========================================== */}
          <Route path="/" element={<LoginAssociado />} />

          {/* =========================================
              ROTA TEMPORÁRIA PARA TESTES
              Troque AreaAssociado pela página que deseja testar.
              Acesse: http://localhost:5173/teste
              Remover antes da entrega final.
          =========================================== */}

          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-associado" element={<LoginAssociado />} />
          <Route path="/area-associado" element={<AreaAssociado />} />
          <Route path="/eventos" element={<EventosLista />} />
          <Route path="/evento/:id" element={<EventoDetalhe />} />
          <Route path="/mensalidades" element={<Mensalidades />} />
          <Route path="/pagamento-pix" element={<PagamentoPix />} />
          <Route path="/boas-vindas" element={<BoasVindas />} />

          {/* Cadastro - acessível por novos sócios e funcionários */}
          <Route path="/cadastro/:id" element={<CadastroWizardNew />} />

          {/* Rotas Administrativas - apenas funcionários autenticados */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="funil" element={<Funil />} />
            <Route path="cadastros" element={<Cadastros />} />
            <Route path="documentos" element={<Documentos />} />
            <Route path="tarefas" element={<Tarefas />} />
            <Route path="relatorios" element={<Relatorios />} />
            <Route path="aprovacoes" element={<AprovacaoCadastros />} />
            <Route path="lead/:id" element={<LeadDetail />} />
          </Route>

          <Route path="*" element={<ErrorPage />} />
        </Routes>
        <DraggableQuickNav />
      </BrowserRouter>
    </AuthProvider>
  );
}

