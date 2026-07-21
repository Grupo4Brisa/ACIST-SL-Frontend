import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  FileCheck,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';



export default function CadastroTermos() {


  const navigate = useNavigate();



  const [aceitouTermos, setAceitouTermos] =
    useState(false);





  function handleFinish() {


    if (!aceitouTermos) {

      alert(
        'É necessário aceitar os termos para finalizar o cadastro.'
      );

      return;

    }



    console.log(
      'Termos aceitos'
    );



    /*
      Futuramente:

      POST /terms/acceptance

      {
        companyId,
        accepted: true
      }

    */



    navigate(
      '/cadastro/sucesso'
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

              <FileCheck
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

                Etapa 7 de 7 - Termos de Aceite

              </p>


            </div>



          </div>


        </div>


      </header>









      {/* CONTEÚDO */}

      <main className="flex-1">


        <div
          className="
            max-w-3xl
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



            <h2 className="mb-3">

              Termos e Condições

            </h2>




            <p
              className="
                text-muted-foreground
                mb-8
              "
            >

              Leia atentamente os termos de associação
              antes de concluir seu cadastro.

            </p>









            {/* TERMOS */}

            <div
              className="
                border
                border-border
                rounded-lg
                p-6
                h-64
                overflow-y-auto
                mb-8
              "
            >


              <h3 className="mb-4">

                Termo de Associação ACIST

              </h3>



              <p
                className="
                  text-sm
                  text-muted-foreground
                  mb-4
                "
              >

                Ao solicitar associação junto à ACIST São
                Leopoldo, a empresa declara estar de acordo
                com as regras, benefícios e responsabilidades
                referentes à participação na entidade.

              </p>




              <p
                className="
                  text-sm
                  text-muted-foreground
                  mb-4
                "
              >

                A empresa autoriza o tratamento dos seus
                dados para fins administrativos, comunicação,
                participação em eventos e disponibilização
                dos serviços oferecidos pela associação.

              </p>




              <p
                className="
                  text-sm
                  text-muted-foreground
                "
              >

                O associado compromete-se a manter seus
                dados atualizados e respeitar as normas
                internas da ACIST.

              </p>



            </div>









            {/* CHECKBOX */}

            <div
              className="
                p-5
                bg-muted
                rounded-lg
              "
            >


              <label
                className="
                  flex
                  items-start
                  gap-3
                  cursor-pointer
                "
              >


                <input

                  type="checkbox"

                  checked={aceitouTermos}

                  onChange={(e)=>
                    setAceitouTermos(
                      e.target.checked
                    )
                  }

                  className="
                    mt-1
                  "

                />



                <span
                  className="
                    text-sm
                  "
                >

                  Declaro que li e aceito os termos de
                  associação da ACIST São Leopoldo e autorizo
                  o tratamento dos meus dados conforme a
                  Política de Privacidade.

                </span>


              </label>


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
                    '/cadastro/documentos'
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


                onClick={handleFinish}


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



                Finalizar Cadastro


                <CheckCircle
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