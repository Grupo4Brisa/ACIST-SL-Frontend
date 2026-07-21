import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Mail, Lock, Eye, EyeOff, UserCircle } from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';


export default function Login() {

  const navigate = useNavigate();

  const { login } = useAuth();


  const [showPassword, setShowPassword] = useState(false);


  const [formData, setFormData] = useState({

    email: '',

    password: '',

    perfil: 'administrador'

  });


  const [isLoading, setIsLoading] = useState(false);


  const [error, setError] = useState('');




const handleSubmit = async (
  e: React.FormEvent
) => {

  e.preventDefault();

  setIsLoading(true);
  setError('');

  try {


    await login(
      formData.email,
      formData.password
    );



    const storedUser =
      localStorage.getItem('user');



    const user =
      storedUser
        ? JSON.parse(storedUser)
        : null;




    // ==========================
    // VALIDA TIPO DE LOGIN
    // ==========================


    const selectedRole =
      formData.perfil === 'administrador'
        ? 'COLABORADOR_ADMIN'
        : 'COLABORADOR_APROVADOR';



    if (
      user?.role !== selectedRole
    ) {


      // remove sessão criada
      localStorage.removeItem('token');
      localStorage.removeItem('user');


      setError(
        'O tipo de acesso selecionado não corresponde ao seu usuário.'
      );


      setIsLoading(false);

      return;

    }






    // ==========================
    // REDIRECIONAMENTO
    // ==========================


    if (
      user.role === 
      'COLABORADOR_APROVADOR'
    ) {


      navigate('/admin/aprovacoes');


    } else {


      navigate('/admin');


    }




  } catch (error:any) {


    setError(

      error.response?.data?.message

      ||

      'Email ou senha inválidos'

    );


  } finally {


    setIsLoading(false);


  }

};




  return (

    <div className="min-h-screen bg-gradient-to-br from-[#0C3A59] to-[#226897] flex flex-col">


      {/* Header */}

      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">


        <div className="max-w-7xl mx-auto px-6 py-4">


          <div className="flex items-center justify-between">


            <Logo 
              size="md" 
              theme="light" 
            />



            <button

              onClick={() => navigate('/')}

              className="px-6 py-2.5 bg-[#5DA5FF] text-white hover:bg-[#226897] rounded-lg transition-colors"

            >

              Voltar à Página Inicial


            </button>



          </div>


        </div>


      </nav>






      <div className="flex-1 flex items-center justify-center p-6">



        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-0 bg-white rounded-2xl shadow-2xl overflow-hidden">



          {/* Imagem à Esquerda */}


          <div className="hidden md:block relative">


            <img

              src="https://images.unsplash.com/photo-1758518729685-f88df7890776?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"

              alt="Profissionais em reunião"

              className="absolute inset-0 w-full h-full object-cover"

            />


          </div>





          {/* Formulário */}


          <div className="p-8 md:p-12">



            <div className="text-center mb-6">


              <p className="text-[#0C3A59] text-[1.125rem] font-semibold mb-2">

                Área do Colaborador

              </p>



              <h2 className="mb-2">

                Entrar no Sistema

              </h2>



              <p className="text-muted-foreground">

                Acesse o painel administrativo

              </p>


            </div>





            <form

              onSubmit={handleSubmit}

              className="space-y-6"

            >




              <div>


                <label className="block mb-2">


                  <Mail className="inline h-4 w-4 mr-2" />


                  Email


                </label>




                <input


                  type="email"


                  required


                  placeholder="seu.email@acist.com.br"


                  className="w-full px-4 py-3.5 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"



                  value={formData.email}




                  onChange={e =>

                    setFormData({

                      ...formData,

                      email:e.target.value

                    })

                  }




                  disabled={isLoading}


                />


              </div>






              <div>



                <label className="block mb-2">


                  <Lock className="inline h-4 w-4 mr-2" />


                  Senha


                </label>





                <div className="relative">


                  <input


                    type={

                      showPassword

                      ? 'text'

                      : 'password'

                    }


                    required


                    placeholder="••••••••"



                    className="w-full px-4 py-3.5 pr-12 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"




                    value={formData.password}




                    onChange={e =>


                      setFormData({

                        ...formData,

                        password:e.target.value

                      })


                    }




                    disabled={isLoading}



                  />




                  <button


                    type="button"


                    onClick={() =>

                      setShowPassword(
                        !showPassword
                      )

                    }


                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"


                  >



                    {

                      showPassword

                      ?

                      <EyeOff className="h-5 w-5"/>

                      :

                      <Eye className="h-5 w-5"/>

                    }



                  </button>


                </div>


              </div>
                            {/* Perfil de Acesso */}

              <div>

                <label className="block mb-2">

                  <UserCircle className="inline h-4 w-4 mr-2" />

                  Perfil de Acesso

                </label>



                <div className="grid grid-cols-2 gap-3">


                  <label

                    className={`flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${
                      formData.perfil === 'administrador'
                        ? 'border-[#5DA5FF] bg-blue-50 text-[#0C3A59]'
                        : 'border-border bg-input-background text-muted-foreground hover:border-[#5DA5FF]'
                    }`}

                  >


                    <input

                      type="radio"

                      name="perfil"

                      value="administrador"


                      checked={
                        formData.perfil === 'administrador'
                      }


                      onChange={e =>

                        setFormData({

                          ...formData,

                          perfil:e.target.value

                        })

                      }


                      className="sr-only"

                      disabled={isLoading}

                    />



                    <span className="font-medium">

                      Administrador

                    </span>



                  </label>





                  <label

                    className={`flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${
                      formData.perfil === 'aprovador'
                        ? 'border-[#5DA5FF] bg-blue-50 text-[#0C3A59]'
                        : 'border-border bg-input-background text-muted-foreground hover:border-[#5DA5FF]'
                    }`}


                  >


                    <input


                      type="radio"


                      name="perfil"


                      value="aprovador"



                      checked={
                        formData.perfil === 'aprovador'
                      }



                      onChange={e =>

                        setFormData({

                          ...formData,

                          perfil:e.target.value

                        })

                      }



                      className="sr-only"

                      disabled={isLoading}


                    />



                    <span className="font-medium">

                      Aprovador

                    </span>



                  </label>


                </div>




                <p className="text-xs text-muted-foreground mt-2">


                  {

                    formData.perfil === 'administrador'

                    ?

                    'Acesso completo ao sistema'

                    :

                    'Acesso apenas para aprovar cadastros'

                  }


                </p>



              </div>







              <div className="flex items-center justify-between">


                <label className="flex items-center gap-2 cursor-pointer">


                  <input

                    type="checkbox"

                    className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"

                  />



                  <span className="text-[0.875rem] text-muted-foreground">

                    Lembrar-me

                  </span>


                </label>





                <a

                  href="#"

                  className="text-[0.875rem] text-primary hover:underline"

                >

                  Esqueceu a senha?


                </a>



              </div>








              {

                error && (


                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[0.875rem]">


                    {error}


                  </div>


                )


              }







              <button


                type="submit"


                disabled={isLoading}


                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"



              >




                {


                  isLoading

                  ?

                  <>


                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />


                    Entrando...


                  </>


                  :

                  'Entrar'


                }



              </button>




            </form>







            <div className="mt-8 pt-6 border-t border-border text-center">


              <p className="text-muted-foreground text-[0.875rem]">


                Não tem acesso?{' '}


                <a

                  href="#"

                  className="text-primary hover:underline"

                >

                  Contate o administrador


                </a>



              </p>



            </div>




          </div>



        </div>



      </div>








      {/* Footer */}


      <footer className="bg-white border-t border-gray-200 mt-20">


        <div className="max-w-7xl mx-auto px-6 py-8">


          <div className="flex flex-col md:flex-row items-center justify-between gap-4">


            <p className="text-gray-600 text-[0.875rem]">


              © 2026 ACIST São Leopoldo. Todos os direitos reservados.


            </p>





            <div className="flex gap-6 text-gray-600 text-[0.875rem]">



              <a

                href="https://www.acistsl.com.br/"

                target="_blank"

                rel="noopener noreferrer"

                className="hover:text-[#5DA5FF] transition-colors underline decoration-transparent hover:decoration-[#5DA5FF]"

              >

                Sobre


              </a>






              <a

                href="https://wa.me/5551999999999"

                target="_blank"

                rel="noopener noreferrer"

                className="hover:text-[#5DA5FF] transition-colors underline decoration-transparent hover:decoration-[#5DA5FF]"

              >

                Contato


              </a>






              <a

                href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm"

                target="_blank"

                rel="noopener noreferrer"

                className="hover:text-[#5DA5FF] transition-colors underline decoration-transparent hover:decoration-[#5DA5FF]"

              >

                Privacidade


              </a>



            </div>



          </div>



        </div>



      </footer>




    </div>

  );

}