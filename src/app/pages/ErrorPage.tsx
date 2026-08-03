import { Link, useNavigate } from "react-router";
import { AlertTriangle, Home } from "lucide-react";
import Logo from "../components/Logo";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0C3A59] to-[#226897] flex flex-col">
      {/* Header */}
      <Header
        showHomeButton
        showEmployeeArea={false}
        showAssociateArea={false}
      />

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

      <Footer />
    </div>
  );
}
