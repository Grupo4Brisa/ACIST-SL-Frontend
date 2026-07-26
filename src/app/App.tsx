import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';


import { AuthProvider } from './context/AuthContext';


import ProtectedRoute from './components/ProtectedRoute';

import DraggableQuickNav from './components/DraggableQuickNav';

import Layout from './components/Layout';



// Páginas públicas

import Home from './pages/Home';

import Login from './pages/Login';

import LoginAssociado from './pages/LoginAssociado';

import AreaAssociado from './pages/AreaAssociado';

import EventosLista from './pages/EventosLista';

import EventoDetalhe from './pages/EventoDetalhe';

import Mensalidades from './pages/Mensalidades';

import PagamentoPix from './pages/PagamentoPix';

import BoasVindas from './pages/BoasVindas';

import ErrorPage from './pages/ErrorPage';

import LandingPage from './pages/LandingPage';




// Cadastro etapas

import CadastroDados from './pages/CadastroEmpresa';

import CadastroContatos from './pages/CadastroContatos';

import CadastroDivulgacao from './pages/CadastroDivulgacao';
import CadastroRedesSociais from './pages/CadastroRedesSociais';
import CadastroSolucoes from './pages/CadastroSolucoes';
import CadastroMensalidade from './pages/CadastroMensalidade';
import CadastroDocumentos from './pages/CadastroDocumentos';
import CadastroConcluido from './pages/CadastroConcluido';

import CadastroTermos from './pages/CadastroTermos';




// Área administrativa

import Dashboard from './pages/Dashboard';

import Funil from './pages/Funil';

import Documentos from './pages/Documentos';

import Tarefas from './pages/Tarefas';

import Relatorios from './pages/Relatorios';

import CompanyDetail from './pages/CompanyDetail';

import AprovacaoCadastros from './pages/AprovacaoCadastros';
import Cadastros from './pages/Cadastros';

import DocumentosPorEmpresa from './pages/DocumentosPorEmpresa';

import Eventos from './pages/Eventos';

import Colaboradores from './pages/Colaboradores';




export default function App() {


  return (

    <AuthProvider>


      <BrowserRouter>


        <Routes>



          {/* =========================
              ROTAS PÚBLICAS
              ========================= */}



          <Route

            path="/"

            element={<Home />}

          />




          <Route

            path="/login"

            element={<Login />}

          />




          <Route

            path="/login-associado"

            element={<LoginAssociado />}

          />




          <Route

            path="/area-associado"

            element={<AreaAssociado />}

          />




          <Route

            path="/eventos"

            element={<EventosLista />}

          />




          <Route

            path="/evento/:id"

            element={<EventoDetalhe />}

          />




          <Route

            path="/mensalidades"

            element={<Mensalidades />}

          />




          <Route

            path="/pagamento-pix"

            element={<PagamentoPix />}

          />




          <Route

            path="/boas-vindas"

            element={<BoasVindas />}

          />




          <Route

            path="/cadastro-concluido"

            element={<CadastroConcluido />}

          />




          {/* =========================
              LANDING PAGE
              ========================= */}



          <Route

            path="/associar"

            element={<LandingPage />}

          />




          {/* =========================
              CADASTRO ASSOCIADO
              
              Público:
              - novo associado
              - colaborador auxiliando
              
              ========================= */}



          <Route

            path="/cadastro/:id"

            element={<CadastroDados />}

          />




          <Route

            path="/cadastro/:id/contatos"

            element={<CadastroContatos />}

          />




          <Route

            path="/cadastro/:id/divulgacao"

            element={<CadastroDivulgacao />}

          />




          <Route

            path="/cadastro/:id/redes-sociais"

            element={<CadastroRedesSociais />}

          />




          <Route

            path="/cadastro/:id/solucoes"

            element={<CadastroSolucoes />}

          />




          <Route

            path="/cadastro/:id/mensalidade"

            element={<CadastroMensalidade />}

          />




          <Route

            path="/cadastro/:id/documentos"

            element={<CadastroDocumentos />}

          />




          <Route

            path="/cadastro/:id/aceite"

            element={<CadastroTermos />}

          />





          {/* =========================
              ÁREA ADMINISTRATIVA
              ========================= */}



          <Route

            path="/admin"

            element={

              <ProtectedRoute>


                <Layout />


              </ProtectedRoute>

            }


          >



            <Route

              index

              element={<Dashboard />}

            />

            <Route 

              path="documentos-por-empresa" 
              
              element={<DocumentosPorEmpresa />} />

            <Route 

              path="eventos" 
              
              element={<Eventos />} />  

              <Route 
                path="colaboradores" 
                
                element={<Colaboradores />} />




            <Route

              path="funil"

              element={<Funil />}

            />




            <Route

              path="documentos"

              element={<Documentos />}

            />




            <Route

              path="tarefas"

              element={<Tarefas />}

            />




            <Route

              path="relatorios"

              element={<Relatorios />}

            />




            <Route

              path="aprovacoes"

              element={<AprovacaoCadastros />}

            />




            <Route

              path="cadastros"

              element={<Cadastros />}

            />




            <Route

              path="company/:id"

              element={<CompanyDetail />}

            />



          </Route>




          {/* =========================
              ERRO
              ========================= */}



          <Route

            path="*"

            element={<ErrorPage />}

          />




        </Routes>




        <DraggableQuickNav />



      </BrowserRouter>


    </AuthProvider>

  );


}