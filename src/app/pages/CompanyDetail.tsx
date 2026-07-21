import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  CheckSquare,
  Clock,
  MessageSquare,
  Upload,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

import  api  from '../services/api';


interface Company {

  id:number;

  companyName:string;

  corporateName:string;

  cnpjcpf:string;

  stateRegistration?:string;

  email:string;

  phone:string;

  companySize:string;

  website?:string;

  address?:string;

  neighborhood?:string;

  city?:string;

  state?:string;

  zipCode?:string;

  establishmentType?:string;

  headquartersType?:string;

  employeesCount?:number;

  foundationDate?:string;

  eventPresentation?:string;

  associationDate?:string;

  status:string;

  createdAt:string;

  updatedAt:string;

}



export default function CompanyDetails(){


  const { id } = useParams();


  const [company,setCompany] =
    useState<Company | null>(null);


  const [loading,setLoading] =
    useState(true);



  const [activeTab,setActiveTab] =
    useState<
      'historico' |
      'documentos' |
      'tarefas'
    >('historico');



  const [novoComentario,setNovoComentario] =
    useState('');



  useEffect(()=>{


    async function loadCompany(){


      try {


        const response =
          await api.get(
            `/companies/${id}`
          );


        setCompany(
          response.data
        );


      } catch(error){

        console.error(
          'Erro ao carregar empresa:',
          error
        );


      } finally {

        setLoading(false);

      }


    }


    if(id){

      loadCompany();

    }


  },[id]);




  function formatDate(
    date:string
  ){

    if(!date) return '-';


    return new Intl.DateTimeFormat(
      'pt-BR'
    ).format(
      new Date(date)
    );

  }




  if(loading){

    return (

      <div className="p-8">

        Carregando empresa...

      </div>

    );

  }




  if(!company){

    return (

      <div className="p-8">

        Empresa não encontrada.

      </div>

    );

  }




  return (

    <div className="h-full bg-background">


      <div className="bg-card border-b border-border">


        <div className="px-8 py-6">


          <Link
            to="/admin/funil"
            className="
              inline-flex
              items-center
              gap-2
              text-muted-foreground
              hover:text-foreground
              mb-4
            "
          >

            <ArrowLeft
              className="h-4 w-4"
            />

            Voltar ao Funil

          </Link>




          <div className="
            flex
            items-start
            justify-between
          ">



            <div>


              <h1 className="mb-2">

                {company.companyName}

              </h1>



              <div className="
                flex
                items-center
                gap-4
                text-muted-foreground
              ">


                <span className="
                  flex
                  items-center
                  gap-2
                ">

                  <Building2
                    className="h-4 w-4"
                  />

                  {company.cnpjcpf}

                </span>



                <span className="
                  flex
                  items-center
                  gap-2
                ">

                  <Calendar
                    className="h-4 w-4"
                  />

                  Criado em:

                  {' '}

                  {formatDate(
                    company.createdAt
                  )}

                </span>


              </div>


            </div>





            <div className="
              flex
              items-center
              gap-3
            ">


              <span className="
                px-4
                py-2
                bg-primary/10
                text-primary
                rounded-lg
              ">

                {company.status}

              </span>




              <Link
                to={`/cadastro/${company.id}`}
                className="
                  px-4
                  py-2
                  bg-primary
                  text-primary-foreground
                  rounded-lg
                  hover:bg-primary/90
                "
              >

                Editar Cadastro

              </Link>


            </div>


          </div>


        </div>


      </div>
            <div className="
        grid
        grid-cols-3
        gap-6
        p-8
      ">


        <div className="
          col-span-2
          space-y-6
        ">



          {/* INFORMAÇÕES DA EMPRESA */}

          <div className="
            bg-card
            rounded-lg
            border
            border-border
            p-6
          ">


            <h3 className="mb-4">

              Informações da Empresa

            </h3>



            <div className="
              grid
              grid-cols-2
              gap-6
            ">



              <div>

                <label className="
                  text-muted-foreground
                  text-[0.875rem]
                  mb-1
                  block
                ">

                  Razão Social

                </label>


                <div className="
                  flex
                  items-center
                  gap-2
                ">


                  <Building2
                    className="
                      h-4
                      w-4
                      text-muted-foreground
                    "
                  />


                  <span>

                    {company.corporateName}

                  </span>


                </div>

              </div>




              <div>

                <label className="
                  text-muted-foreground
                  text-[0.875rem]
                  mb-1
                  block
                ">

                  Email

                </label>


                <div className="
                  flex
                  items-center
                  gap-2
                ">


                  <Mail
                    className="
                      h-4
                      w-4
                      text-muted-foreground
                    "
                  />


                  <span>

                    {company.email}

                  </span>


                </div>


              </div>





              <div>

                <label className="
                  text-muted-foreground
                  text-[0.875rem]
                  mb-1
                  block
                ">

                  Telefone

                </label>


                <div className="
                  flex
                  items-center
                  gap-2
                ">


                  <Phone
                    className="
                      h-4
                      w-4
                      text-muted-foreground
                    "
                  />


                  <span>

                    {company.phone}

                  </span>


                </div>


              </div>





              <div>

                <label className="
                  text-muted-foreground
                  text-[0.875rem]
                  mb-1
                  block
                ">

                  Porte da Empresa

                </label>


                <span>

                  {company.companySize}

                </span>


              </div>





              <div>

                <label className="
                  text-muted-foreground
                  text-[0.875rem]
                  mb-1
                  block
                ">

                  Inscrição Estadual

                </label>


                <span>

                  {company.stateRegistration || '-'}

                </span>


              </div>





              <div>

                <label className="
                  text-muted-foreground
                  text-[0.875rem]
                  mb-1
                  block
                ">

                  Quantidade de Funcionários

                </label>


                <span>

                  {company.employeesCount ?? '-'}

                </span>


              </div>




              <div>

                <label className="
                  text-muted-foreground
                  text-[0.875rem]
                  mb-1
                  block
                ">

                  Tipo de Estabelecimento

                </label>


                <span>

                  {company.establishmentType || '-'}

                </span>


              </div>




              <div>

                <label className="
                  text-muted-foreground
                  text-[0.875rem]
                  mb-1
                  block
                ">

                  Tipo da Sede

                </label>


                <span>

                  {company.headquartersType || '-'}

                </span>


              </div>



            </div>


          </div>





          {/* ENDEREÇO */}


          <div className="
            bg-card
            rounded-lg
            border
            border-border
            p-6
          ">


            <h3 className="mb-4">

              Endereço

            </h3>



            <div className="
              grid
              grid-cols-2
              gap-6
            ">


              <div>

                <label className="
                  text-muted-foreground
                  text-[0.875rem]
                  mb-1
                  block
                ">

                  Logradouro

                </label>


                <div className="
                  flex
                  items-center
                  gap-2
                ">


                  <MapPin
                    className="
                      h-4
                      w-4
                      text-muted-foreground
                    "
                  />


                  <span>

                    {company.address || '-'}

                  </span>


                </div>


              </div>





              <div>

                <label className="
                  text-muted-foreground
                  text-[0.875rem]
                  mb-1
                  block
                ">

                  Bairro

                </label>


                <span>

                  {company.neighborhood || '-'}

                </span>


              </div>





              <div>

                <label className="
                  text-muted-foreground
                  text-[0.875rem]
                  mb-1
                  block
                ">

                  Cidade

                </label>


                <span>

                  {company.city || '-'}

                </span>


              </div>





              <div>

                <label className="
                  text-muted-foreground
                  text-[0.875rem]
                  mb-1
                  block
                ">

                  Estado

                </label>


                <span>

                  {company.state || '-'}

                </span>


              </div>





              <div>

                <label className="
                  text-muted-foreground
                  text-[0.875rem]
                  mb-1
                  block
                ">

                  CEP

                </label>


                <span>

                  {company.zipCode || '-'}

                </span>


              </div>



            </div>


          </div>





          {/* DADOS INSTITUCIONAIS */}


          <div className="
            bg-card
            rounded-lg
            border
            border-border
            p-6
          ">


            <h3 className="mb-4">

              Dados Institucionais

            </h3>



            <div className="space-y-4">


              <div>

                <label className="
                  text-muted-foreground
                  text-[0.875rem]
                  block
                ">

                  Data de Fundação

                </label>


                <span>

                  {formatDate(
                    company.foundationDate || ''
                  )}

                </span>


              </div>




              <div>

                <label className="
                  text-muted-foreground
                  text-[0.875rem]
                  block
                ">

                  Data de Associação

                </label>


                <span>

                  {formatDate(
                    company.associationDate || ''
                  )}

                </span>


              </div>





              <div>

                <label className="
                  text-muted-foreground
                  text-[0.875rem]
                  block
                ">

                  Apresentação da Empresa

                </label>


                <p className="mt-1">

                  {company.eventPresentation || '-'}

                </p>


              </div>




              <div>

                <label className="
                  text-muted-foreground
                  text-[0.875rem]
                  block
                ">

                  Website

                </label>


                <span>

                  {company.website || '-'}

                </span>


              </div>


            </div>


          </div>
                    {/* ABAS: HISTÓRICO / DOCUMENTOS / TAREFAS */}

          <div className="
            bg-card
            rounded-lg
            border
            border-border
          ">


            <div className="
              flex
              border-b
              border-border
            ">


              <button
                onClick={() => setActiveTab('historico')}
                className={`
                  flex-1
                  px-6
                  py-4
                  flex
                  items-center
                  justify-center
                  gap-2
                  transition-colors
                  ${
                    activeTab === 'historico'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >

                <Clock className="h-4 w-4"/>

                Histórico

              </button>




              <button
                onClick={() => setActiveTab('documentos')}
                className={`
                  flex-1
                  px-6
                  py-4
                  flex
                  items-center
                  justify-center
                  gap-2
                  transition-colors
                  ${
                    activeTab === 'documentos'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >

                <FileText className="h-4 w-4"/>

                Documentos

              </button>





              <button
                onClick={() => setActiveTab('tarefas')}
                className={`
                  flex-1
                  px-6
                  py-4
                  flex
                  items-center
                  justify-center
                  gap-2
                  transition-colors
                  ${
                    activeTab === 'tarefas'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >

                <CheckSquare className="h-4 w-4"/>

                Tarefas

              </button>


            </div>




            <div className="p-6">


              {activeTab === 'historico' && (

                <div>


                  <h4 className="mb-4">

                    Adicionar comentário

                  </h4>


                  <div className="
                    flex
                    gap-3
                    mb-6
                  ">


                    <input
                      type="text"
                      placeholder="Digite uma observação..."
                      value={novoComentario}
                      onChange={
                        e =>
                        setNovoComentario(
                          e.target.value
                        )
                      }
                      className="
                        flex-1
                        px-4
                        py-2
                        border
                        border-border
                        rounded-lg
                        bg-input-background
                      "
                    />



                    <button
                      className="
                        px-4
                        py-2
                        bg-primary
                        text-primary-foreground
                        rounded-lg
                      "
                    >

                      <MessageSquare
                        className="h-4 w-4"
                      />

                    </button>


                  </div>



                  <div className="
                    text-muted-foreground
                    text-sm
                  ">

                    Nenhum histórico disponível.

                  </div>


                </div>

              )}







              {activeTab === 'documentos' && (

                <div className="space-y-4">


                  <div className="
                    flex
                    items-center
                    justify-between
                    p-4
                    border
                    border-border
                    rounded-lg
                  ">


                    <div className="
                      flex
                      items-center
                      gap-3
                    ">


                      <FileText
                        className="
                          h-6
                          w-6
                          text-primary
                        "
                      />


                      <div>

                        <p>

                          Documentos da empresa

                        </p>


                        <span className="
                          text-sm
                          text-muted-foreground
                        ">

                          Integração com módulo de documentos

                        </span>


                      </div>


                    </div>




                    <button
                      className="
                        p-2
                        hover:bg-muted
                        rounded-lg
                      "
                    >

                      <Download
                        className="h-4 w-4"
                      />

                    </button>



                  </div>



                  <button
                    className="
                      w-full
                      py-3
                      border-2
                      border-dashed
                      border-border
                      rounded-lg
                      flex
                      items-center
                      justify-center
                      gap-2
                      hover:border-primary
                    "
                  >

                    <Upload
                      className="h-4 w-4"
                    />

                    Adicionar Documento


                  </button>


                </div>

              )}






              {activeTab === 'tarefas' && (

                <div>


                  <div className="
                    text-muted-foreground
                    text-sm
                  ">

                    Nenhuma tarefa cadastrada.

                  </div>


                  <button
                    className="
                      mt-4
                      w-full
                      py-3
                      border-2
                      border-dashed
                      border-border
                      rounded-lg
                      flex
                      items-center
                      justify-center
                      gap-2
                    "
                  >

                    <CheckSquare
                      className="h-4 w-4"
                    />

                    Nova tarefa

                  </button>


                </div>

              )}



            </div>


          </div>
                  </div>



        {/* COLUNA DIREITA */}

        <div className="
          space-y-6
        ">



          {/* STATUS DA EMPRESA */}

          <div className="
            bg-card
            rounded-lg
            border
            border-border
            p-6
          ">


            <h3 className="mb-4">

              Status da Empresa

            </h3>



            <div className="
              flex
              items-center
              gap-3
            ">


              {company.status === 'ACTIVE' ? (

                <CheckCircle
                  className="
                    h-6
                    w-6
                    text-green-600
                  "
                />

              ) : company.status === 'INACTIVE' ? (

                <XCircle
                  className="
                    h-6
                    w-6
                    text-red-600
                  "
                />

              ) : (

                <AlertCircle
                  className="
                    h-6
                    w-6
                    text-yellow-600
                  "
                />

              )}




              <span className="
                font-medium
              ">

                {company.status}

              </span>


            </div>



          </div>







          {/* DATAS */}

          <div className="
            bg-card
            rounded-lg
            border
            border-border
            p-6
          ">


            <h3 className="mb-4">

              Datas

            </h3>



            <div className="space-y-3">


              <div>

                <p className="
                  text-sm
                  text-muted-foreground
                ">

                  Cadastro criado

                </p>


                <p>

                  {formatDate(
                    company.createdAt
                  )}

                </p>


              </div>





              <div>

                <p className="
                  text-sm
                  text-muted-foreground
                ">

                  Última atualização

                </p>


                <p>

                  {formatDate(
                    company.updatedAt
                  )}

                </p>


              </div>



            </div>



          </div>








          {/* RESUMO */}

          <div className="
            bg-card
            rounded-lg
            border
            border-border
            p-6
          ">


            <h3 className="mb-4">

              Resumo

            </h3>



            <div className="space-y-4">


              <div>

                <p className="
                  text-sm
                  text-muted-foreground
                ">

                  CNPJ/CPF

                </p>


                <p>

                  {company.cnpjcpf}

                </p>


              </div>





              <div>

                <p className="
                  text-sm
                  text-muted-foreground
                ">

                  Funcionários

                </p>


                <p>

                  {company.employeesCount ?? '-'}

                </p>


              </div>





              <div>

                <p className="
                  text-sm
                  text-muted-foreground
                ">

                  Cidade

                </p>


                <p>

                  {company.city || '-'}

                </p>


              </div>



            </div>



          </div>








          {/* AÇÕES DE APROVAÇÃO */}

          {
            company.status === 'PENDING_APPROVAL' && (

              <div className="
                bg-card
                rounded-lg
                border
                border-border
                p-6
              ">


                <h3 className="mb-4">

                  Ações

                </h3>



                <div className="
                  flex
                  gap-3
                ">


                  <button

                    onClick={
                      async()=>{

                        try{

                          await api.patch(
                            `/companies/${company.id}/approve`
                          );


                          setCompany({

                            ...company,

                            status:
                              'ACTIVE'

                          });


                        }catch(error){

                          console.error(
                            'Erro ao aprovar:',
                            error
                          );

                        }

                      }
                    }

                    className="
                      flex-1
                      px-4
                      py-2
                      bg-green-600
                      text-white
                      rounded-lg
                      hover:bg-green-700
                    "

                  >

                    Aprovar


                  </button>






                  <button

                    onClick={
                      async()=>{


                        try{


                          await api.patch(
                            `/companies/${company.id}/reject`
                          );



                          setCompany({

                            ...company,

                            status:
                              'INACTIVE'

                          });



                        }catch(error){


                          console.error(
                            'Erro ao rejeitar:',
                            error
                          );


                        }


                      }
                    }


                    className="
                      flex-1
                      px-4
                      py-2
                      bg-red-600
                      text-white
                      rounded-lg
                      hover:bg-red-700
                    "

                  >

                    Reprovar


                  </button>



                </div>


              </div>

            )
          }



        </div>



      </div>



    </div>

  );

}