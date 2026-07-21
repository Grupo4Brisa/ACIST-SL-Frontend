import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';

import api from '../services/api';


interface User {
  id: number;
  name: string;
  email: string;
  role: 
    | 'COLABORADOR_ADMIN'
    | 'COLABORADOR_APROVADOR';
  active: boolean;
}


interface AuthContextData {

  user: User | null;

  login(
    email: string,
    password: string,
  ): Promise<boolean>;

  logout(): void;

  isAuthenticated: boolean;

}


const AuthContext =
  createContext<AuthContextData>(
    {} as AuthContextData,
  );



interface AuthProviderProps {
  children: ReactNode;
}



export function AuthProvider({
  children,
}: AuthProviderProps) {


  const [user, setUser] =
    useState<User | null>(() => {

      const storedUser =
        localStorage.getItem('user');


      if (storedUser) {
        return JSON.parse(storedUser);
      }


      return null;

    });



  async function login(
    email: string,
    password: string,
  ): Promise<boolean> {


    const response =
      await api.post('/auth/login', {

        email,

        password,

      });



    const {
      access_token,
      user,
    } = response.data;



    localStorage.setItem(
      'token',
      access_token,
    );


    localStorage.setItem(
      'user',
      JSON.stringify(user),
    );


    setUser(user);


    return true;

  }





  function logout() {


    localStorage.removeItem(
      'token',
    );


    localStorage.removeItem(
      'user',
    );


    setUser(null);


  }





  return (

    <AuthContext.Provider
      value={{

        user,

        login,

        logout,

        isAuthenticated:
          !!user,

      }}
    >

      {children}

    </AuthContext.Provider>

  );

}





export function useAuth() {

  const context =
    useContext(AuthContext);


  if (!context) {

    throw new Error(
      'useAuth deve ser usado dentro do AuthProvider',
    );

  }


  return context;

}