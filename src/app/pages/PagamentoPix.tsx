import {
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import {
  CheckCircle,
  Copy,
  QrCode,
  ArrowRight,
  Users,
  Calendar,
  Award,
  ShieldCheck,
  Megaphone,
  Rocket,
} from 'lucide-react';

import api from '../services/api';

import Logo from '../components/Logo';

import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';



const beneficios = [

  {
    icon: Users,
    title:'Networking Empresarial',
    description:
      'Conecte-se com empresários da região',
  },


  {
    icon: Calendar,
    title:'Eventos e Capacitações',
    description:
      'Acesso a workshops e palestras exclusivas',
  },


  {
    icon: Award,
    title:'Convênios e Benefícios',
    description:
      'Descontos em produtos e serviços',
  },


  {
    icon: ShieldCheck,
    title:'Certificado Digital',
    description:
      'Facilite processos com certificação',
  },


  {
    icon: Megaphone,
    title:'Divulgação da Empresa',
    description:
      'Visibilidade em eventos e materiais',
  },


  {
    icon: Rocket,
    title:'Programa Empreender',
    description:
      'Participe de núcleos e grupos setoriais',
  },

];








const valoresPorPorte = {

  MEI:42,

  PEQUENA:103,

  MEDIA:230,

  GRANDE:496,


};








function normalizarPorte(
  porte:string
){

  return porte
    .toUpperCase()
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    );


}








export default function PagamentoPix(){



  const navigate =
    useNavigate();



  const companyId =
    localStorage.getItem('companyId');



  const [
    searchParams
  ] =
    useSearchParams();




  const [
    copiado,
    setCopiado
  ] =
    useState(false);



  const [
    enviando,
    setEnviando
  ] =
    useState(false);



  const [
    error,
    setError
  ] =
    useState('');





  const [
    porte,
    setPorte
  ] =
    useState(() => {
      const saved = localStorage.getItem('companySize');
      return saved ? normalizarPorte(saved) : 'MEI';
    });





  useEffect(()=>{


    // Primeiro tenta pegar da URL

    const porteUrl =
      searchParams.get(
        'porte'
      );



    if(porteUrl){

      setPorte(
        normalizarPorte(
          porteUrl
        )
      );

      return;

    }





    // Caso contrário busca cadastro salvo

    const dadosCadastro =
      localStorage.getItem(
        'companyData'
      );



    if(dadosCadastro){


      const dados =
        JSON.parse(
          dadosCadastro
        );



      if(dados.companySize){


        setPorte(

          normalizarPorte(
            dados.companySize
          )

        );


      }


    }



  },[
    searchParams
  ]);








  const valor =

    valoresPorPorte[
      porte as keyof typeof valoresPorPorte
    ]

    ||

    103;






  const chavePix =
    '00.000.000/0001-00';
    
  const handleCopiarChave = () => {


    navigator.clipboard.writeText(
      chavePix
    );


    setCopiado(true);



    setTimeout(()=>{

      setCopiado(false);

    },2000);



  };






  const handleConfirmarPagamento = async () => {


    if(!companyId){

      setError(
        'Não foi possível identificar o cadastro. Volte e tente novamente.',
      );

      return;

    }



    setError('');

    setEnviando(true);



    try {


      await api.post('/payments', {

        companyId: Number(companyId),

        amount: valor,

        paymentType: 'PIX',

        // Vencimento no momento da confirmação —
        // o pagamento fica PENDING até o aprovador
        // validar manualmente (sem gateway PIX real
        // integrado ainda).
        dueDate: new Date().toISOString(),

      });



      navigate(
        '/boas-vindas'
      );


    } catch (err: any) {


      setError(

        err.response?.data?.message ??

        'Erro ao registrar o pagamento. Tente novamente.',

      );


    } finally {


      setEnviando(false);


    }


  };







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





      {/* HEADER */}


      <Header
      showEmployeeArea={false}
      showAssociateArea={false}
      rightContent={
        <button
            onClick={() => navigate("/associar")}
            className="px-6 py-2.5 bg-[#5DA5FF] text-white hover:bg-[#226897] rounded-lg transition-colors"
        >
          Voltar
        </button>
      }
      />









      {/* CONTEÚDO */}



      <div

        className="
          flex-1
          max-w-7xl
          mx-auto
          px-6
          py-12
          w-full
        "

      >




        <div

          className="
            text-center
            mb-12
          "

        >



          <h1

            className="
              text-white
              text-3xl
              font-semibold
              mb-2
            "

          >

            Pagamento da Associação


          </h1>





          <p

            className="
              text-blue-100
              text-lg
            "

          >

            Finalize sua associação realizando
            o pagamento via PIX.


          </p>




        </div>









        {/* CARD PAGAMENTO */}



        <div

          className="
            max-w-2xl
            mx-auto
            mb-16
          "

        >



          <div

            className="
              bg-white
              rounded-2xl
              shadow-2xl
              p-8
            "

          >






            <div

              className="
                text-center
                mb-8
              "

            >




              <div

                className="
                  inline-block
                  p-3
                  bg-blue-100
                  rounded-full
                  mb-4
                "

              >


                <QrCode

                  className="
                    h-8
                    w-8
                    text-[#5DA5FF]
                  "

                />


              </div>






              <h2

                className="
                  text-2xl
                  font-semibold
                  text-[#0C3A59]
                  mb-2
                "

              >

                Pague via PIX


              </h2>





              <p

                className="
                  text-gray-600
                "

              >

                Escaneie o QR Code ou copie
                a chave PIX abaixo.


              </p>



            </div>









            {/* QR CODE */}



            <div

              className="
                flex
                justify-center
                mb-8
              "

            >



              <div

                className="
                  bg-white
                  border-4
                  border-[#0C3A59]
                  rounded-2xl
                  p-8
                "

              >



                <div

                  className="
                    w-64
                    h-64
                    bg-gray-100
                    rounded-lg
                    flex
                    items-center
                    justify-center
                  "

                >


                  <QrCode

                    className="
                      h-32
                      w-32
                      text-gray-400
                    "

                  />


                </div>


              </div>


            </div>









            {/* VALOR */}



            <div

              className="
                bg-green-50
                border
                border-green-200
                rounded-lg
                p-6
                mb-6
              "

            >



              <div

                className="
                  text-center
                "

              >



                <p

                  className="
                    text-green-700
                    text-sm
                    mb-2
                  "

                >

                  Valor da mensalidade
                  (
                  {porte}
                  )


                </p>





                <p

                  className="
                    text-4xl
                    font-bold
                    text-green-800
                  "

                >

                  R$ {
                    valor
                      .toFixed(2)
                      .replace(
                        '.',
                        ','
                      )
                  }


                </p>





                <p

                  className="
                    text-green-600
                    text-sm
                    mt-1
                  "

                >

                  mensal


                </p>




              </div>


            </div>
            
            {/* CHAVE PIX */}


            <div className="mb-6">


              <label

                className="
                  block
                  text-sm
                  font-semibold
                  text-gray-700
                  mb-2
                "

              >

                Chave PIX (CNPJ)

              </label>




              <div className="flex gap-2">


                <input

                  type="text"

                  value={chavePix}

                  readOnly


                  className="
                    flex-1
                    px-4
                    py-3
                    border
                    border-gray-300
                    rounded-lg
                    bg-gray-50
                    text-center
                    font-mono
                  "

                />





                <button


                  onClick={handleCopiarChave}


                  className={

                    `

                    px-6
                    py-3
                    rounded-lg
                    flex
                    items-center
                    gap-2

                    ${
                      copiado

                      ?

                      'bg-green-500 text-white'

                      :

                      'bg-[#5DA5FF] text-white hover:bg-[#226897]'

                    }

                    `

                  }


                >



                  {

                    copiado

                    ?


                    <>

                      <CheckCircle
                        className="
                          h-5
                          w-5
                        "
                      />

                      Copiado!


                    </>


                    :


                    <>


                      <Copy
                        className="
                          h-5
                          w-5
                        "
                      />


                      Copiar


                    </>


                  }



                </button>



              </div>


            </div>









            {/* INSTRUÇÕES */}



            <div

              className="
                bg-blue-50
                border
                border-blue-200
                rounded-lg
                p-4
                mb-6
              "

            >



              <h3

                className="
                  font-semibold
                  text-[#0C3A59]
                  mb-3
                "

              >

                Como pagar:


              </h3>




              <ol

                className="
                  space-y-2
                  text-sm
                  text-gray-700
                "

              >



                <li>

                  1. Abra o aplicativo do seu banco.


                </li>



                <li>

                  2. Escolha pagamento via PIX.


                </li>



                <li>

                  3. Escaneie o QR Code ou cole a chave PIX.


                </li>



                <li>

                  4. Confirme o valor de R$ {
                    valor
                      .toFixed(2)
                      .replace(
                        '.',
                        ','
                      )
                  }.


                </li>



                <li>

                  5. Clique em "Já fiz o pagamento".


                </li>



              </ol>


            </div>









            {error && (

              <div

                className="
                  bg-red-50
                  border
                  border-red-200
                  rounded-lg
                  p-4
                  mb-6
                  text-red-700
                  text-sm
                "

              >

                {error}

              </div>

            )}









            {/* CONFIRMAÇÃO */}



            <button


              onClick={
                handleConfirmarPagamento
              }


              disabled={enviando}



              className="
                w-full
                bg-[#5DA5FF]
                hover:bg-[#226897]
                text-white
                py-4
                rounded-lg
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                disabled:opacity-50
              "


            >


              {
                enviando

                ? 'Registrando pagamento...'

                : 'Já fiz o pagamento'
              }



              {!enviando && (

                <ArrowRight

                  className="
                    h-5
                    w-5
                  "

                />

              )}


            </button>






            <p

              className="
                text-center
                text-sm
                text-gray-500
                mt-4
              "

            >

              Após o pagamento, sua associação será
              ativada em até 24 horas úteis.


            </p>






          </div>


        </div>









        {/* BENEFÍCIOS */}



        <div className="mb-12">


          <div

            className="
              text-center
              mb-8
            "

          >


            <h2

              className="
                text-white
                text-2xl
                font-semibold
                mb-2
              "

            >

              Benefícios da Associação


            </h2>




            <p

              className="
                text-blue-100
              "

            >

              Vantagens exclusivas ao se tornar associado.


            </p>



          </div>








          <div

            className="
              grid
              md:grid-cols-2
              lg:grid-cols-3
              gap-6
            "

          >



            {

              beneficios.map(

                (beneficio,index)=>(


                  <div

                    key={index}

                    className="
                      bg-white
                      rounded-xl
                      p-6
                      shadow-lg
                    "

                  >



                    <div

                      className="
                        w-12
                        h-12
                        bg-blue-100
                        rounded-lg
                        flex
                        items-center
                        justify-center
                        mb-4
                      "

                    >



                      <beneficio.icon

                        className="
                          h-6
                          w-6
                          text-[#5DA5FF]
                        "

                      />



                    </div>





                    <h3

                      className="
                        font-semibold
                        text-[#0C3A59]
                        mb-2
                      "

                    >

                      {beneficio.title}


                    </h3>





                    <p

                      className="
                        text-gray-600
                        text-sm
                      "

                    >

                      {beneficio.description}


                    </p>



                  </div>


                )

              )


            }



          </div>


        </div>




      </div>









      {/* FOOTER */}

      <Footer />


    </div>


  );


}
