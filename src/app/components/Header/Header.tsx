import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../Logo";

interface HeaderProps {
  showHomeButton?: boolean;
  showEmployeeArea?: boolean;
  showAssociateArea?: boolean;
  rightContent?: ReactNode;
}

export default function Header({
  showHomeButton = false,
  showEmployeeArea = true,
  showAssociateArea = true,
  rightContent,
}: HeaderProps) {
  const navigate = useNavigate();

  return (
    <nav
      className="
        bg-white
        border-b
        border-gray-200
        sticky
        top-0
        z-50
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          py-4
        "
      >
        <div className="flex items-center justify-between">
          <Logo
            size="md"
            theme="light"
          />

          <div className="flex gap-3 items-center">

            {showHomeButton && (
              <button
                onClick={() => navigate("/")}
                className="
                  px-6
                  py-2.5
                  bg-[#5DA5FF]
                  text-white
                  rounded-lg
                  hover:bg-[#226897]
                  transition-colors
                "
              >
                Voltar à Página Inicial
              </button>
            )}

            {showEmployeeArea && (
              <button
                onClick={() => navigate("/login")}
                className="
                  px-6
                  py-2.5
                  bg-[#5DA5FF]
                  text-white
                  rounded-lg
                  hover:bg-[#226897]
                  transition-colors
                "
              >
                Área do Colaborador
              </button>
            )}

            {showAssociateArea && (
              <button
                onClick={() => navigate("/login-associado")}
                className="
                  px-6
                  py-2.5
                  bg-[#0C3A59]
                  text-white
                  rounded-lg
                  hover:bg-[#226897]
                  transition-colors
                "
              >
                Área do Associado
              </button>
            )}

            {rightContent}

          </div>
        </div>
      </div>
    </nav>
  );
}