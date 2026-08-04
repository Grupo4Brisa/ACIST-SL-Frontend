import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function ValidarTokenCadastro() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    api
      .get(`/login-tokens/validate/${token}`)
      .then((res) => {
        const companyId = res.data.companyId;
        localStorage.removeItem('companyId');
        localStorage.removeItem('companyData');
        localStorage.setItem('companyId', String(companyId));
        navigate(`/cadastro/${companyId}`, { replace: true });
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Link inválido ou expirado.");
      });
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-[#0C3A59] flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
        {error ? (
          <>
            <h1 className="text-xl font-bold text-red-600 mb-2">
              Link inválido
            </h1>
            <p className="text-gray-600">{error}</p>
          </>
        ) : (
          <p className="text-gray-600">Validando seu link, aguarde...</p>
        )}
      </div>
    </div>
  );
}
