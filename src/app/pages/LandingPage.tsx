// src/app/pages/LandingPage.tsx

import { useState } from 'react';
import Header from "../components/Header/Header";
import Footer from '../components/Footer/Footer';

import {
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import {
  Building2,
  Mail,
  Phone,
  Hash,
  MessageCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Briefcase,
} from 'lucide-react';

import Logo from '../components/Logo';

import api from '../services/api';



function mapOrigin(value:string | null){

  switch(value){

    case 'google':
      return 'Google';

    case 'instagram':
      return 'Instagram';

    case 'facebook':
      return 'Facebook';

    case 'linkedin':
      return 'LinkedIn';

    case 'evento':
      return 'Evento';

    case 'indicacao':
      return 'Indicação';

    case 'website':
      return 'Website';

    default:
      return 'Website';

  }

}




export default function LandingPage(){


  const navigate =
    useNavigate();


  const [searchParams] =
    useSearchParams();



  const origin =
    mapOrigin(
      searchParams.get(
        'utm_source'
      )
    );





  const [formData,setFormData] =
    useState({

      cnpjcpf:'',

      companyName:'',

      corporateName:'',

      email:'',

      password:'',

      companySize:'',

      phone:'',

    });





  const [submitted,setSubmitted] =
    useState(false);



  const [showPassword,setShowPassword] =
    useState(false);



  const [loading,setLoading] =
    useState(false);



  const [error,setError] =
    useState('');






  function handleChange(
    field:string,
    value:string
  ){


    setFormData({

      ...formData,

      [field]:value,

    });


  }







  async function handleSubmit(
    e:React.FormEvent
  ){

    e.preventDefault();



    setLoading(true);

    setError('');



    try {



      const response =
        await api.post(

          '/companies/landing',

          {


            cnpjcpf:
              formData.cnpjcpf,


            companyName:
              formData.companyName,


            corporateName:
              formData.corporateName,


            email:
              formData.email,


            password:
              formData.password,


            companySize:
              formData.companySize,


            phone:
              formData.phone,


            origin,


          }

        );





      const company =
        response.data;





      localStorage.setItem(

        'companyId',

        String(
          company.id
        )

      );





      // IMPORTANTE:
      // guarda os dados para o pagamento identificar o porte

      localStorage.setItem(

        'companyData',

        JSON.stringify({

          ...formData,

          companyId:
            company.id,

        })

      );





      localStorage.setItem(

        'companySize',

        formData.companySize

      );







      setSubmitted(true);





      setTimeout(()=>{


        navigate(

          `/pagamento-pix?porte=${formData.companySize}`

        );


      },2000);






    }catch(error:any){



      console.error(error);



      setError(

        error.response?.data?.message ||

        'Erro ao realizar cadastro'

      );



    }finally{


      setLoading(false);


    }


  }






  function handleWhatsApp(){


    window.open(

      'https://wa.me/5551999999999?text=Olá! Gostaria de me associar à ACIST São Leopoldo',

      '_blank'

    );


  }





  if(submitted){


    return (

      <div
        className="
          min-h-screen
          bg-gradient-to-br
          from-[#0C3A59]
          to-[#226897]
          flex
          flex-col
        "
      >

    <Header
        sticky={false}
        showEmployeeArea
        showAssociateArea={false}
    />

        <main
          className="
            flex-1
            flex
            items-center
            justify-center
            p-6
          "
        >


          <div
            className="
              bg-white
              rounded-2xl
              shadow-2xl
              p-12
              max-w-md
              w-full
              text-center
            "
          >


            <div
              className="
                flex
                justify-center
                mb-6
              "
            >

              <div
                className="
                  bg-green-100
                  rounded-full
                  p-4
                "
              >

                <CheckCircle
                  className="
                    h-16
                    w-16
                    text-green-600
                  "
                />

              </div>


            </div>



            <h2 className="mb-4">

              Cadastro Recebido!

            </h2>



            <p
              className="
                text-gray-600
                mb-6
              "
            >

              Seus dados iniciais foram registrados.
              Agora você poderá continuar o cadastro
              da empresa.

            </p>


          </div>


        </main>


      </div>

    );


  }
    return (

    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-[#0C3A59]
        to-[#226897]
      "
    >


    {/* HEADER */}
    <Header
        sticky={true}
        showHomeButton={true}
        showEmployeeArea={true}
        showAssociateArea={true}
    />

      <div
        className="
          container
          mx-auto
          px-6
          py-12
        "
      >



        <div className="text-center mb-12">


          <div className="flex justify-center mb-6">


            <Logo

              size="lg"

              theme="dark"

            />


          </div>




          <h1
            className="
              text-white
              text-[2.5rem]
              mb-4
            "
          >

            Associe-se à ACIST

          </h1>




          <p
            className="
              text-blue-100
              text-xl
              max-w-2xl
              mx-auto
            "
          >

            Faça parte da maior rede de empresários
            da região.

          </p>



        </div>








        <div className="max-w-2xl mx-auto">


          <div
            className="
              bg-white
              rounded-2xl
              shadow-2xl
              overflow-hidden
            "
          >


            <div className="p-8">


              <h2
                className="
                  text-center
                  text-2xl
                  font-semibold
                  mb-2
                "
              >

                Comece seu Cadastro

              </h2>




              <p
                className="
                  text-gray-500
                  text-center
                  mb-8
                "
              >

                Preencha os dados iniciais
                para iniciar sua associação.

              </p>






              <form

                onSubmit={handleSubmit}

                className="space-y-5"

              >





                {/* CPF / CNPJ */}

                <div>


                  <label className="block mb-2">


                    <Hash
                      className="
                        inline
                        h-4
                        w-4
                        mr-2
                      "
                    />

                    CPF ou CNPJ


                  </label>



                  <input

                    type="text"

                    required

                    placeholder="
                      000.000.000-00
                      ou
                      00.000.000/0000-00
                    "

                    className="
                      w-full
                      px-4
                      py-3
                      border
                      rounded-lg
                    "

                    value={
                      formData.cnpjcpf
                    }


                    onChange={(e)=>

                      handleChange(

                        'cnpjcpf',

                        e.target.value

                      )

                    }

                  />


                </div>






                {/* NOME EMPRESA */}

                <div>


                  <label className="block mb-2">


                    <Building2
                      className="
                        inline
                        h-4
                        w-4
                        mr-2
                      "
                    />

                    Nome da empresa


                  </label>



                  <input

                    type="text"

                    required

                    placeholder="
                      Nome fantasia
                    "

                    className="
                      w-full
                      px-4
                      py-3
                      border
                      rounded-lg
                    "


                    value={
                      formData.companyName
                    }


                    onChange={(e)=>

                      handleChange(

                        'companyName',

                        e.target.value

                      )

                    }


                  />


                </div>








                {/* RAZÃO SOCIAL */}


                <div>


                  <label className="block mb-2">


                    <Building2
                      className="
                        inline
                        h-4
                        w-4
                        mr-2
                      "
                    />

                    Razão Social


                  </label>



                  <input

                    type="text"

                    required


                    placeholder="
                      Razão social da empresa
                    "


                    className="
                      w-full
                      px-4
                      py-3
                      border
                      rounded-lg
                    "


                    value={
                      formData.corporateName
                    }


                    onChange={(e)=>

                      handleChange(

                        'corporateName',

                        e.target.value

                      )

                    }


                  />


                </div>








                {/* EMAIL */}


                <div>


                  <label className="block mb-2">


                    <Mail
                      className="
                        inline
                        h-4
                        w-4
                        mr-2
                      "
                    />

                    E-mail


                  </label>



                  <input

                    type="email"

                    required


                    placeholder="
                      empresa@email.com
                    "


                    className="
                      w-full
                      px-4
                      py-3
                      border
                      rounded-lg
                    "


                    value={
                      formData.email
                    }


                    onChange={(e)=>

                      handleChange(

                        'email',

                        e.target.value

                      )

                    }


                  />


                </div>
                                {/* SENHA */}

                <div>


                  <label className="block mb-2">


                    <Eye
                      className="
                        inline
                        h-4
                        w-4
                        mr-2
                      "
                    />

                    Criar senha


                  </label>





                  <div className="relative">


                    <input


                      type={
                        showPassword
                        ? 'text'
                        : 'password'
                      }


                      required


                      minLength={8}


                      placeholder="
                        Senha mínima 8 caracteres
                      "


                      className="
                        w-full
                        px-4
                        py-3
                        pr-12
                        border
                        rounded-lg
                      "


                      value={
                        formData.password
                      }


                      onChange={(e)=>

                        handleChange(

                          'password',

                          e.target.value

                        )

                      }


                    />





                    <button

                      type="button"


                      onClick={()=>


                        setShowPassword(

                          !showPassword

                        )


                      }


                      className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                      "

                    >


                      {

                        showPassword

                        ?

                        <EyeOff
                          className="
                            h-5
                            w-5
                          "
                        />

                        :

                        <Eye
                          className="
                            h-5
                            w-5
                          "
                        />

                      }


                    </button>


                  </div>


                </div>









                {/* PORTE DA EMPRESA */}

                <div>


                  <label className="block mb-2">


                    <Briefcase
                      className="
                        inline
                        h-4
                        w-4
                        mr-2
                      "
                    />

                    Porte da empresa


                  </label>





                  <select


                    required


                    className="
                      w-full
                      px-4
                      py-3
                      border
                      rounded-lg
                      bg-white
                    "



                    value={
                      formData.companySize
                    }



                    onChange={(e)=>


                      handleChange(

                        'companySize',

                        e.target.value

                      )


                    }



                  >



                    <option value="">
                      Selecione o porte
                    </option>



                    <option value="MEI">

                      MEI

                    </option>




                    <option value="PEQUENA">

                      Pequena empresa

                    </option>




                    <option value="MEDIA">

                      Média empresa

                    </option>




                    <option value="GRANDE">

                      Grande empresa

                    </option>



                  </select>


                </div>









                {/* TELEFONE */}


                <div>


                  <label className="block mb-2">


                    <Phone
                      className="
                        inline
                        h-4
                        w-4
                        mr-2
                      "
                    />

                    Telefone


                  </label>





                  <input


                    type="tel"


                    required


                    placeholder="
                      (51) 99999-9999
                    "


                    className="
                      w-full
                      px-4
                      py-3
                      border
                      rounded-lg
                    "


                    value={
                      formData.phone
                    }


                    onChange={(e)=>

                      handleChange(

                        'phone',

                        e.target.value

                      )

                    }


                  />


                </div>









                {
                  error && (

                    <div

                      className="
                        p-3
                        bg-red-50
                        border
                        border-red-200
                        rounded-lg
                        text-red-700
                      "

                    >

                      {error}

                    </div>

                  )
                }









                {/* BOTÃO */}

                <button


                  type="submit"


                  disabled={loading}



                  className="
                    w-full
                    bg-[#0C3A59]
                    text-white
                    py-4
                    rounded-lg
                    hover:bg-[#226897]
                    disabled:opacity-50
                  "


                >



                  {

                    loading

                    ?

                    'Enviando cadastro...'

                    :

                    'Continuar Cadastro'


                  }



                </button>





              </form>









              <div

                className="
                  mt-8
                  pt-8
                  border-t
                "

              >



                <p
                  className="
                    text-center
                    mb-4
                  "
                >

                  Prefere falar conosco?

                </p>





                <button


                  onClick={handleWhatsApp}


                  className="
                    w-full
                    bg-green-600
                    text-white
                    py-4
                    rounded-lg
                    flex
                    justify-center
                    items-center
                    gap-3
                  "


                >


                  <MessageCircle
                    className="
                      h-5
                      w-5
                    "
                  />


                  Falar pelo WhatsApp


                </button>


              </div>





            </div>


          </div>


        </div>


      </div>









    {/* FOOTER */}

    <Footer />

    </div>


  );


}