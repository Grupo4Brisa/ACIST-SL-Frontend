import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';


import Login from '../app/pages/Login';

import LandingPage from '../app/pages/LandingPage';

import CadastroEmpresa from '../app/pages/CadastroEmpresa';
import CadastroContatos from '../app/pages/CadastroContatos';
import CadastroQualificacao from '../app/pages/CadastroQualificacao';
import CadastroPlano from '../app/pages/CadastroPlano';
import CadastroDocumentos from '../app/pages/Documentos';
import TermoAceite from '../app/pages/CadastroTermos';


import AprovacaoCadastros from '../app/pages/AprovacaoCadastros';


import ProtectedRoute from './ProtectedRoute';
import CadastroTermos from '../app/pages/CadastroTermos';
import Documentos from '../app/pages/Documentos';



export default function AppRoutes() {


  return (

    <Routes>


      {/* =====================
          LANDING / CADASTRO
      ====================== */}


      <Route

        path="/"

        element={<LandingPage />}

      />



      <Route

        path="/cadastro/empresa"

        element={<CadastroEmpresa />}

      />



      <Route

        path="/cadastro/contatos"

        element={<CadastroContatos />}

      />



      <Route

        path="/cadastro/qualificacao"

        element={<CadastroQualificacao />}

      />



      <Route

        path="/cadastro/plano"

        element={<CadastroPlano />}

      />



      <Route

        path="/cadastro/documentos"

        element={<Documentos />}

      />



      <Route

        path="/cadastro/aceite"

        element={<CadastroTermos />}

      />






      {/* =====================
          LOGIN COLABORADORES
      ====================== */}


      <Route

        path="/login"

        element={<Login />}

      />







      {/* =====================
          ÁREA ADMINISTRATIVA
      ====================== */}



      <Route

        path="/admin"

        element={

          <ProtectedRoute

            allowedRoles={[
              'COLABORADOR_ADMIN'
            ]}

          >

            <Navigate to="/admin/aprovacoes" />

          </ProtectedRoute>

        }

      />






      <Route

        path="/admin/aprovacoes"

        element={

          <ProtectedRoute

            allowedRoles={[

              'COLABORADOR_APROVADOR',

              'COLABORADOR_ADMIN'

            ]}

          >

            <AprovacaoCadastros />

          </ProtectedRoute>

        }

      />







      {/* =====================
          ROTA PADRÃO
      ====================== */}



      <Route

        path="*"

        element={

          <Navigate

            to="/"

            replace

          />

        }

      />



    </Routes>

  );

}