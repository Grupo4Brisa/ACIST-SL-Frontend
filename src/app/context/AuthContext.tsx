import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userType: 'funcionario' | 'socio' | null;
  userProfile: 'administrador' | 'aprovador' | null;
  login: (email: string, senha: string, perfil?: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<'funcionario' | 'socio' | null>(null);
  const [userProfile, setUserProfile] = useState<'administrador' | 'aprovador' | null>(null);

  const login = (email: string, senha: string, perfil: string = 'administrador') => {
    if (email && senha) {
      setIsAuthenticated(true);
      setUserType('funcionario');
      setUserProfile(perfil as 'administrador' | 'aprovador');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userType, userProfile, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
