// src/pages/Cadastro/CadastroQualificacao.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  ClipboardCheck,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';



export default function CadastroQualificacao() {


  const navigate = useNavigate();



  const [formData, setFormData] = useState({

    faturamentoAnual: '',

    interessePrincipal: '',

    comoConheceu: '',

    quantidadeFuncionarios: '',

    observacoes: ''

  });





  function handleChange(
    field: string,
    value: string
  ) {

    setFormData({

      ...formData,

      [field]: value

    });

  }






  function handleNext() {


    console.log(
      'Dados qualificação:',
      formData
    );


    navigate(
      '/cadastro/plano'
    );


  }






  return (

    <div className="min-h-screen bg-background flex flex-col">



      {/* HEADER */}

      <header className="bg-white border-b border-border">


        <div className="max-w-5xl mx-auto px-6 py-6">


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

              <ClipboardCheck
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


              <p className="text-muted-foreground">

                Etapa 4 de 7 - Qualificação

              </p>


            </div>


          </div>


        </div>


      </header>






      {/* CONTEÚDO PRINCIPAL */}

      <main className="flex-1">


        <div className="max-w-3xl mx-auto px-6 py-12">


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

              Qualificação da Empresa

            </h2>



            <p className="text-muted-foreground mb-8">

              Essas informações ajudam a ACIST a conhecer melhor sua empresa.

            </p>






            <div className="space-y-6">



              {/* FATURAMENTO */}

              <div>


                <label className="block mb-2">

                  Faturamento Anual Estimado

                </label>



                <select

                  className="
                    w-full
                    px-4
                    py-3
                    border
                    border-border
                    rounded-lg
                    bg-input-background
                    focus:outline-none
                    focus:ring-2
                    focus:ring-primary
                  "


                  value={
                    formData.faturamentoAnual
                  }


                  onChange={(e)=>

                    handleChange(
                      'faturamentoAnual',
                      e.target.value
                    )

                  }

                >


                  <option value="">
                    Selecione
                  </option>


                  <option value="ate-500k">
                    Até R$ 500 mil
                  </option>


                  <option value="500k-2m">
                    R$ 500 mil - R$ 2 milhões
                  </option>


                  <option value="2m-10m">
                    R$ 2 milhões - R$ 10 milhões
                  </option>


                  <option value="acima-10m">
                    Acima de R$ 10 milhões
                  </option>


                </select>


              </div>






              {/* FUNCIONÁRIOS */}

              <div>


                <label className="block mb-2">

                  Número de Funcionários

                </label>



                <select

                  className="
                    w-full
                    px-4
                    py-3
                    border
                    border-border
                    rounded-lg
                    bg-input-background
                    focus:outline-none
                    focus:ring-2
                    focus:ring-primary
                  "


                  value={
                    formData.quantidadeFuncionarios
                  }


                  onChange={(e)=>

                    handleChange(
                      'quantidadeFuncionarios',
                      e.target.value
                    )

                  }

                >


                  <option value="">
                    Selecione
                  </option>


                  <option value="1-10">
                    1 a 10 funcionários
                  </option>


                  <option value="11-50">
                    11 a 50 funcionários
                  </option>


                  <option value="51-200">
                    51 a 200 funcionários
                  </option>


                  <option value="200+">
                    Mais de 200 funcionários
                  </option>


                </select>


              </div>
                            {/* INTERESSE PRINCIPAL */}

              <div>


                <label className="block mb-2">

                  Principal interesse em associar-se

                </label>



                <select

                  className="
                    w-full
                    px-4
                    py-3
                    border
                    border-border
                    rounded-lg
                    bg-input-background
                    focus:outline-none
                    focus:ring-2
                    focus:ring-primary
                  "


                  value={
                    formData.interessePrincipal
                  }


                  onChange={(e)=>

                    handleChange(
                      'interessePrincipal',
                      e.target.value
                    )

                  }

                >


                  <option value="">
                    Selecione
                  </option>


                  <option value="networking">
                    Networking
                  </option>


                  <option value="capacitacao">
                    Capacitação
                  </option>


                  <option value="representacao">
                    Representação empresarial
                  </option>


                  <option value="servicos">
                    Serviços e benefícios
                  </option>


                  <option value="parcerias">
                    Parcerias comerciais
                  </option>


                </select>


              </div>







              {/* COMO CONHECEU */}

              <div>


                <label className="block mb-2">

                  Como conheceu a ACIST?

                </label>



                <select

                  className="
                    w-full
                    px-4
                    py-3
                    border
                    border-border
                    rounded-lg
                    bg-input-background
                    focus:outline-none
                    focus:ring-2
                    focus:ring-primary
                  "


                  value={
                    formData.comoConheceu
                  }


                  onChange={(e)=>

                    handleChange(
                      'comoConheceu',
                      e.target.value
                    )

                  }

                >


                  <option value="">
                    Selecione
                  </option>


                  <option value="indicacao">
                    Indicação
                  </option>


                  <option value="evento">
                    Evento da ACIST
                  </option>


                  <option value="redes-sociais">
                    Redes sociais
                  </option>


                  <option value="site">
                    Site
                  </option>


                  <option value="google">
                    Pesquisa no Google
                  </option>


                  <option value="outros">
                    Outros
                  </option>


                </select>


              </div>







              {/* OBSERVAÇÕES */}

              <div>


                <label className="block mb-2">

                  Observações

                </label>



                <textarea


                  rows={5}


                  className="
                    w-full
                    px-4
                    py-3
                    border
                    border-border
                    rounded-lg
                    bg-input-background
                    focus:outline-none
                    focus:ring-2
                    focus:ring-primary
                    resize-none
                  "



                  placeholder="
                    Informe alguma necessidade ou observação
                  "



                  value={
                    formData.observacoes
                  }



                  onChange={(e)=>

                    handleChange(
                      'observacoes',
                      e.target.value
                    )

                  }


                />


              </div>






            </div>





            {/* RESUMO */}

            <div
              className="
                mt-8
                p-5
                bg-muted
                rounded-lg
              "
            >


              <h3 className="mb-3">

                Por que precisamos dessas informações?

              </h3>


              <p
                className="
                  text-sm
                  text-muted-foreground
                "
              >

                A ACIST utiliza essas informações
                para direcionar benefícios,
                eventos, capacitações e oportunidades
                de acordo com o perfil da empresa.

              </p>


            </div>
                        {/* NAVEGAÇÃO */}

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
                    '/cadastro/contatos'
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