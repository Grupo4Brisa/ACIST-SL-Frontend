// src/app/pages/CadastroDados.tsx

import {
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  ArrowRight,
  Save,
  LogOut,
} from 'lucide-react';

import Logo from '../components/Logo';

import api from '../services/api';

import Footer from '../components/Footer/Footer';

export default function CadastroDados() {


  const navigate = useNavigate();



  const [loading, setLoading] =
    useState(false);



  const [companyId, setCompanyId] =
    useState<number | null>(null);



  const [formData, setFormData] =
    useState({

      companyName: '',

      corporateName: '',

      cnpjcpf: '',

      email: '',

      password: '',

      confirmPassword: '',

      phone: '',

      companySize: '',

      stateRegistration: '',

      address: '',

      neighborhood: '',

      city: '',

      state: '',

      zipCode: '',

      website: '',

      establishmentType: '',

      headquartersType: '',

      employeesCount: '',

      foundationDate: '',

    });




  useEffect(() => {


    const savedId =
      localStorage.getItem(
        'companyId'
      );


    const savedData =
      localStorage.getItem(
        'companyData'
      );



    if(savedId){

      setCompanyId(
        Number(savedId)
      );

    }



    if(savedData){

      setFormData(
        JSON.parse(savedData)
      );

    }


  }, []);






  function handleChange(
    field:string,
    value:string,
  ){


    setFormData({

      ...formData,

      [field]: value,

    });


  }







  async function saveDraft(){


    try {


      setLoading(true);



      if(

        !formData.companyName ||

        !formData.corporateName ||

        !formData.cnpjcpf ||

        !formData.email ||

        !formData.phone ||

        !formData.companySize ||

        !formData.password

      ){


        alert(
          'Preencha todos os campos obrigatórios.'
        );


        return false;


      }






      if(
        formData.password.length < 8
      ){


        alert(
          'A senha deve possuir no mínimo 8 caracteres.'
        );


        return false;


      }







      if(

        formData.password !==
        formData.confirmPassword

      ){


        alert(
          'As senhas não conferem.'
        );


        return false;


      }







      const payload = {


        companyName:
          formData.companyName,


        corporateName:
          formData.corporateName,


        cnpjcpf:
          formData.cnpjcpf.replace(
            /\D/g,
            ''
          ),


        email:
          formData.email,


        password:
          formData.password,


        phone:
          formData.phone,


        companySize:
          formData.companySize,


        origin:
          'Website',


      };






      let response;






      if(companyId){


        response =
          await api.patch(

            `/companies/${companyId}`,

            payload

          );


      }

      else {


        response =
          await api.post(

            '/companies/landing',

            payload

          );



        localStorage.setItem(

          'companyId',

          String(
            response.data.id
          )

        );



        setCompanyId(
          response.data.id
        );


      }







      localStorage.setItem(

        'companyData',

        JSON.stringify(
          formData
        )

      );





      alert(
        'Rascunho salvo com sucesso!'
      );



      return true;



    }

    catch(error:any){


      console.error(error);



      alert(

        error?.response?.data?.message ||

        'Erro ao salvar cadastro.'

      );



      return false;



    }

    finally {


      setLoading(false);


    }


  }






  async function handleNext(){


    const saved =
      await saveDraft();



    if(!saved){

      return;

    }



    const id =
      localStorage.getItem(
        'companyId'
      );



    if(id){


      navigate(
        `/cadastro/${id}/contatos`
      );


    }


  }






  const inputStyle = `

    w-full

    px-4

    py-3

    rounded-lg

    border

    border-gray-300

    bg-white

    text-gray-800

    placeholder:text-gray-400

    outline-none

    transition

    focus:ring-2

    focus:ring-[#0C3A59]

    focus:border-[#0C3A59]

  `;



  const labelStyle = `

    block

    mb-2

    text-sm

    font-medium

    text-gray-700

  `;





  return (
        <div

      className="

        min-h-screen

        bg-[#0C3A59]

        flex

        flex-col

      "

    >




      {/* =========================
          HEADER
          LOGO + VOLTAR
      ========================== */}



      <header

        className="

          bg-white

          shadow-sm

        "

      >



        <div

          className="

            max-w-6xl

            mx-auto

            px-6

            py-5

            flex

            items-center

            justify-between

          "

        >



          <Logo />



          <button

            type="button"

            onClick={() =>
              navigate('/')
            }

            className="

              px-4

              py-2

              rounded-lg

              border

              border-gray-300

              hover:bg-gray-100

              text-gray-700

            "

          >

            Voltar ao início


          </button>



        </div>



      </header>







      {/* =========================
          CONTEÚDO
      ========================== */}



      <main

        className="

          flex-1

        "

      >



        <div

          className="

            max-w-5xl

            mx-auto

            px-6

            py-12

            w-full

          "

        >



          <div

            className="

              bg-white

              rounded-2xl

              shadow-xl

              p-10

            "

          >





            {/* CABEÇALHO DA ETAPA */}



            <div

              className="

                flex

                justify-between

                items-start

                mb-10

                gap-4

                flex-wrap

              "

            >



              <div>


                <h1

                  className="

                    text-2xl

                    font-bold

                    text-gray-800

                  "

                >

                  Cadastro de Associado


                </h1>



                <p

                  className="

                    text-sm

                    text-gray-500

                    mt-1

                  "

                >

                  Etapa 1 de 8 - Dados Cadastrais


                </p>


              </div>







              <div

                className="

                  flex

                  gap-3

                "

              >




                <button

                  type="button"

                  onClick={saveDraft}

                  disabled={loading}

                  className="

                    px-4

                    py-2

                    rounded-lg

                    border

                    border-gray-300

                    flex

                    items-center

                    gap-2

                    text-gray-700

                    hover:bg-gray-100

                    disabled:opacity-50

                  "

                >


                  <Save

                    size={16}

                  />


                  Salvar Rascunho


                </button>







                <button

                  type="button"

                  onClick={() =>
                    navigate('/')
                  }

                  className="

                    px-4

                    py-2

                    rounded-lg

                    border

                    border-gray-300

                    flex

                    items-center

                    gap-2

                    text-gray-700

                    hover:bg-gray-100

                  "

                >


                  <LogOut

                    size={16}

                  />


                  Voltar


                </button>





              </div>




            </div>







            {/* =========================
                INDICADOR DAS ETAPAS
            ========================== */}



            <div

              className="

                grid

                grid-cols-4

                md:grid-cols-8

                gap-4

                mb-10

              "

            >



              {


                [

                  'Dados',

                  'Contatos',

                  'Soluções',

                  'Documentos',

                  'Pagamento',

                  'Aprovação',

                  'Revisão',

                  'Finalização'


                ]

                .map(

                  (step,index)=>(


                    <div

                      key={index}

                      className="

                        text-center

                      "

                    >



                      <div

                        className={`

                          mx-auto

                          w-10

                          h-10

                          rounded-full

                          flex

                          items-center

                          justify-center

                          font-semibold


                          ${

                            index === 0

                            ?

                            'bg-[#0C3A59] text-white'

                            :

                            'bg-gray-200 text-gray-500'

                          }

                        `}

                      >

                        {index + 1}


                      </div>





                      <span

                        className="

                          block

                          mt-2

                          text-xs

                          text-gray-600

                        "

                      >

                        {step}


                      </span>



                    </div>


                  )


                )


              }



            </div>








            <h2

              className="

                text-2xl

                font-semibold

                text-gray-800

                mb-2

              "

            >

              Dados Cadastrais


            </h2>






            <p

              className="

                text-gray-500

                mb-8

              "

            >

              Preencha os dados da empresa para iniciar
              seu cadastro como associado.


            </p>
            



            {/* =========================
                1.1 IDENTIFICAÇÃO
            ========================== */}



            <section

              className="

                space-y-5

              "

            >



              <h3

                className="

                  font-semibold

                  text-lg

                  text-gray-800

                "

              >

                1.1 Identificação


              </h3>






              <div

                className="

                  grid

                  md:grid-cols-2

                  gap-5

                "

              >




                <div>


                  <label

                    className={labelStyle}

                  >

                    Razão Social *

                  </label>




                  <input

                    className={inputStyle}

                    placeholder="Digite a razão social"

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






                <div>


                  <label

                    className={labelStyle}

                  >

                    Nome Fantasia *

                  </label>




                  <input

                    className={inputStyle}

                    placeholder="Digite o nome fantasia"

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



              </div>







              <div

                className="

                  grid

                  md:grid-cols-2

                  gap-5

                "

              >




                <div>


                  <label

                    className={labelStyle}

                  >

                    CNPJ / CPF *

                  </label>




                  <input

                    className={inputStyle}

                    placeholder="00.000.000/0000-00"

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






                <div>


                  <label

                    className={labelStyle}

                  >

                    Inscrição Estadual

                  </label>




                  <input

                    className={inputStyle}

                    placeholder="Digite a inscrição estadual"

                    value={
                      formData.stateRegistration
                    }

                    onChange={(e)=>

                      handleChange(

                        'stateRegistration',

                        e.target.value

                      )

                    }

                  />


                </div>




              </div>




            </section>









            {/* =========================
                1.2 ENDEREÇO
            ========================== */}



            <section

              className="

                space-y-5

                mt-10

              "

            >



              <h3

                className="

                  font-semibold

                  text-lg

                  text-gray-800

                "

              >

                1.2 Endereço


              </h3>






              <div>


                <label

                  className={labelStyle}

                >

                  Endereço *

                </label>




                <input

                  className={inputStyle}

                  placeholder="Rua, número"

                  value={
                    formData.address
                  }

                  onChange={(e)=>

                    handleChange(

                      'address',

                      e.target.value

                    )

                  }

                />


              </div>







              <div

                className="

                  grid

                  md:grid-cols-3

                  gap-5

                "

              >





                <div>


                  <label

                    className={labelStyle}

                  >

                    Bairro *

                  </label>




                  <input

                    className={inputStyle}

                    placeholder="Digite o bairro"

                    value={
                      formData.neighborhood
                    }

                    onChange={(e)=>

                      handleChange(

                        'neighborhood',

                        e.target.value

                      )

                    }

                  />


                </div>







                <div>


                  <label

                    className={labelStyle}

                  >

                    Cidade *

                  </label>




                  <input

                    className={inputStyle}

                    placeholder="Digite a cidade"

                    value={
                      formData.city
                    }

                    onChange={(e)=>

                      handleChange(

                        'city',

                        e.target.value

                      )

                    }

                  />


                </div>








                <div>


                  <label

                    className={labelStyle}

                  >

                    Estado *

                  </label>




                  <select

                    className={inputStyle}

                    value={
                      formData.state
                    }

                    onChange={(e)=>

                      handleChange(

                        'state',

                        e.target.value

                      )

                    }

                  >



                    <option value="">

                      Selecione

                    </option>



                    <option value="RS">

                      RS

                    </option>



                    <option value="SC">

                      SC

                    </option>



                    <option value="PR">

                      PR

                    </option>



                  </select>


                </div>



              </div>








              <div>


                <label

                  className={labelStyle}

                >

                  CEP *

                </label>




                <input

                  className={inputStyle}

                  placeholder="00000-000"

                  value={
                    formData.zipCode
                  }

                  onChange={(e)=>

                    handleChange(

                      'zipCode',

                      e.target.value

                    )

                  }

                />


              </div>





            </section>
            





            {/* =========================
                1.3 CONTATO
            ========================== */}



            <section

              className="

                space-y-5

                mt-10

              "

            >



              <h3

                className="

                  font-semibold

                  text-lg

                  text-gray-800

                "

              >

                1.3 Contato


              </h3>







              <div

                className="

                  grid

                  md:grid-cols-2

                  gap-5

                "

              >





                <div>


                  <label

                    className={labelStyle}

                  >

                    Telefone *

                  </label>




                  <input

                    className={inputStyle}

                    placeholder="(51) 99999-9999"

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







                <div>


                  <label

                    className={labelStyle}

                  >

                    Email *

                  </label>




                  <input

                    className={inputStyle}

                    type="email"

                    placeholder="empresa@email.com"

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





              </div>








              <div

                className="

                  grid

                  md:grid-cols-2

                  gap-5

                "

              >




                <div>


                  <label

                    className={labelStyle}

                  >

                    Senha de acesso *

                  </label>




                  <input

                    className={inputStyle}

                    type="password"

                    placeholder="Mínimo 8 caracteres"

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


                </div>







                <div>


                  <label

                    className={labelStyle}

                  >

                    Confirmar senha *

                  </label>




                  <input

                    className={inputStyle}

                    type="password"

                    placeholder="Digite novamente"

                    value={
                      formData.confirmPassword
                    }

                    onChange={(e)=>

                      handleChange(

                        'confirmPassword',

                        e.target.value

                      )

                    }

                  />


                </div>




              </div>








              <div>


                <label

                  className={labelStyle}

                >

                  Site

                </label>




                <input

                  className={inputStyle}

                  placeholder="https://www.empresa.com.br"

                  value={
                    formData.website
                  }

                  onChange={(e)=>

                    handleChange(

                      'website',

                      e.target.value

                    )

                  }

                />


              </div>




            </section>









            {/* =========================
                1.4 DADOS DA EMPRESA
            ========================== */}



            <section

              className="

                space-y-5

                mt-10

              "

            >



              <h3

                className="

                  font-semibold

                  text-lg

                  text-gray-800

                "

              >

                1.4 Dados da Empresa


              </h3>








              <div

                className="

                  grid

                  md:grid-cols-2

                  gap-5

                "

              >





                <div>


                  <label

                    className={labelStyle}

                  >

                    Porte da Empresa *

                  </label>




                  <select

                    className={inputStyle}

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

                      Selecione

                    </option>



                    <option value="MEI">

                      MEI

                    </option>



                    <option value="Microempresa">

                      Microempresa

                    </option>



                    <option value="Pequena">

                      Pequena

                    </option>



                    <option value="Média">

                      Média

                    </option>



                    <option value="Grande">

                      Grande

                    </option>



                  </select>


                </div>








                <div>


                  <label

                    className={labelStyle}

                  >

                    Tipo de Estabelecimento

                  </label>




                  <select

                    className={inputStyle}

                    value={
                      formData.headquartersType
                    }

                    onChange={(e)=>

                      handleChange(

                        'headquartersType',

                        e.target.value

                      )

                    }

                  >



                    <option value="">

                      Selecione

                    </option>



                    <option value="Matriz">

                      Matriz

                    </option>



                    <option value="Filial">

                      Filial

                    </option>



                  </select>


                </div>




              </div>









              <div

                className="

                  grid

                  md:grid-cols-2

                  gap-5

                "

              >




                <div>


                  <label

                    className={labelStyle}

                  >

                    Número de funcionários

                  </label>




                  <input

                    className={inputStyle}

                    type="number"

                    placeholder="Quantidade"

                    value={
                      formData.employeesCount
                    }

                    onChange={(e)=>

                      handleChange(

                        'employeesCount',

                        e.target.value

                      )

                    }

                  />


                </div>








                <div>


                  <label

                    className={labelStyle}

                  >

                    Data de fundação

                  </label>




                  <input

                    className={inputStyle}

                    type="date"

                    value={
                      formData.foundationDate
                    }

                    onChange={(e)=>

                      handleChange(

                        'foundationDate',

                        e.target.value

                      )

                    }

                  />


                </div>




              </div>






            </section>
            





            {/* =========================
                BOTÕES
            ========================== */}



            <div

              className="

                flex

                justify-between

                mt-10

                pt-8

                border-t

              "

            >




              <button

                type="button"

                onClick={() =>
                  navigate('/')
                }

                className="

                  px-6

                  py-3

                  rounded-lg

                  border

                  border-gray-300

                  text-gray-700

                  hover:bg-gray-100

                "

              >

                Voltar


              </button>







              <button

                type="button"

                onClick={handleNext}

                disabled={loading}

                className="

                  px-6

                  py-3

                  bg-[#0C3A59]

                  text-white

                  rounded-lg

                  flex

                  items-center

                  gap-2

                  hover:opacity-90

                  disabled:opacity-50

                "

              >

                Próxima Etapa




                <ArrowRight

                  className="

                    w-4

                    h-4

                  "

                />



              </button>





            </div>







          </div>



        </div>



      </main>









      {/* FOOTER*/}

      <Footer />

    </div>


  );


}