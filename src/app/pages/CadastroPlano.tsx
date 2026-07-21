import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  FileText,
  ArrowLeft,
  ArrowRight,
  Check
} from 'lucide-react';



interface Plano {
  nome: string;
  valor: string;
  beneficios: string[];
}



export default function CadastroPlano() {


  const navigate = useNavigate();



  const [planoSelecionado, setPlanoSelecionado] =
    useState('');




  const planos: Plano[] = [


    {
      nome: 'Básico',
      valor: 'R$ 350/mês',
      beneficios: [
        'Participação em eventos',
        'Networking empresarial',
        'Acesso à comunidade'
      ]
    },



    {
      nome: 'Plus',
      valor: 'R$ 650/mês',
      beneficios: [
        'Todos os benefícios do Básico',
        'Capacitações',
        'Cursos e treinamentos'
      ]
    },



    {
      nome: 'Premium',
      valor: 'R$ 950/mês',
      beneficios: [
        'Todos os benefícios do Plus',
        'Assessoria empresarial',
        'Maior visibilidade'
      ]
    }


  ];







  function handleNext() {


    if (!planoSelecionado) {

      alert(
        'Selecione um plano para continuar'
      );

      return;

    }



    console.log(
      'Plano escolhido:',
      planoSelecionado
    );



    navigate(
      '/cadastro/documentos'
    );


  }






  return (

    <div className="min-h-screen bg-background flex flex-col">





      {/* HEADER */}

      <header
        className="
          bg-white
          border-b
          border-border
        "
      >


        <div
          className="
            max-w-5xl
            mx-auto
            px-6
            py-6
          "
        >


          <div className="flex items-center gap-3">


            <div
              className="
                w-12
                h-12
                rounded-lg
                bg-primary/10
                flex
                items-center
                justify-center
              "
            >

              <FileText
                className="
                  h-6
                  w-6
                  text-primary
                "
              />


            </div>




            <div>


              <h1>
                Cadastro de Associado
              </h1>


              <p
                className="
                  text-muted-foreground
                "
              >

                Etapa 5 de 7 - Escolha do Plano

              </p>


            </div>



          </div>


        </div>


      </header>









      {/* CONTEÚDO */}

      <main className="flex-1">


        <div
          className="
            max-w-4xl
            mx-auto
            px-6
            py-12
          "
        >


          <div
            className="
              bg-white
              rounded-lg
              border
              border-border
              p-8
            "
          >



            <h2 className="mb-2">

              Escolha seu plano de associação

            </h2>



            <p
              className="
                text-muted-foreground
                mb-8
              "
            >

              Selecione o plano que melhor atende
              às necessidades da sua empresa.

            </p>







            <div
              className="
                grid
                md:grid-cols-3
                gap-6
              "
            >


              {planos.map(plano => (


                <div


                  key={plano.nome}



                  onClick={() =>
                    setPlanoSelecionado(
                      plano.nome
                    )
                  }



                  className={`

                    cursor-pointer

                    rounded-lg

                    border-2

                    p-6

                    transition-all


                    ${
                      planoSelecionado === plano.nome

                      ?

                      'border-primary bg-primary/5'

                      :

                      'border-border hover:border-primary/50'

                    }

                  `}


                >



                  <h3 className="mb-3">

                    {plano.nome}

                  </h3>





                  <p
                    className="
                      text-2xl
                      font-semibold
                      mb-6
                    "
                  >

                    {plano.valor}

                  </p>






                  <ul
                    className="
                      space-y-3
                    "
                  >


                    {plano.beneficios.map(
                      beneficio => (

                        <li

                          key={beneficio}

                          className="
                            flex
                            items-center
                            gap-2
                            text-sm
                            text-muted-foreground
                          "

                        >

                          <Check
                            className="
                              h-4
                              w-4
                              text-primary
                            "
                          />


                          {beneficio}


                        </li>


                      )
                    )}


                  </ul>





                </div>


              ))}


            </div>







            <div
              className="
                mt-8
                p-5
                bg-muted
                rounded-lg
              "
            >


              <h3 className="mb-2">

                Sobre a associação

              </h3>



              <p
                className="
                  text-sm
                  text-muted-foreground
                "
              >

                O plano escolhido poderá ser alterado
                conforme análise da ACIST e disponibilidade
                dos benefícios.

              </p>



            </div>









            {/* BOTÕES */}

            <div
              className="
                flex
                justify-between
                mt-10
                pt-8
                border-t
                border-border
              "
            >




              <button


                type="button"


                onClick={() =>
                  navigate(
                    '/cadastro/qualificacao'
                  )
                }


                className="
                  px-6
                  py-3
                  border
                  border-border
                  rounded-lg
                  hover:bg-muted
                  transition-colors
                  flex
                  items-center
                  gap-2
                "


              >

                <ArrowLeft
                  className="
                    h-4
                    w-4
                  "
                />

                Voltar


              </button>








              <button


                type="button"


                onClick={handleNext}


                className="
                  px-6
                  py-3
                  bg-primary
                  text-primary-foreground
                  rounded-lg
                  hover:bg-primary/90
                  transition-colors
                  flex
                  items-center
                  gap-2
                "


              >

                Próxima Etapa


                <ArrowRight
                  className="
                    h-4
                    w-4
                  "
                />


              </button>





            </div>




          </div>


        </div>


      </main>









      {/* FOOTER */}

      <footer
        className="
          bg-white
          border-t
          border-border
        "
      >


        <div
          className="
            max-w-5xl
            mx-auto
            px-6
            py-6
            text-center
            text-sm
            text-muted-foreground
          "
        >

          © 2026 ACIST São Leopoldo.
          Todos os direitos reservados.

        </div>


      </footer>





    </div>

  );

}