import { Navigate } from 'react-router';
import { useAuth } from '../app/context/AuthContext';


interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: (
    | 'COLABORADOR_ADMIN'
    | 'COLABORADOR_APROVADOR'
  )[];
}



export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {


  const {
    user,
    isAuthenticated,
  } = useAuth();



  // ==========================
  // NÃO ESTÁ LOGADO
  // ==========================

  if (!isAuthenticated) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }





  // ==========================
  // VALIDAR PERMISSÃO
  // ==========================

  if (
    allowedRoles &&
    user &&
    !allowedRoles.includes(user.role)
  ) {

    return (
      <Navigate
        to="/admin"
        replace
      />
    );

  }





  return children;

}