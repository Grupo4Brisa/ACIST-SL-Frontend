import { useEffect, useState } from 'react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import {
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Globe,
  Target,
  DollarSign,
} from 'lucide-react';

import { useNavigate } from 'react-router';

import api from '../services/api';


// =====================================================
// TIPAGEM DO DASHBOARD
// =====================================================


interface DashboardResponse {


  companies: {

    total: number;

    active: number;

    pendingApproval: number;

    incomplete: number;

    inactive: number;

  };



  events: {

    total: number;

  };



  documents: {

    total: number;

  };



  announcements: {

    total: number;

  };



  companySize: {

    porte: string;

    quantidade: number;

  }[];

  origin?: {
    origem: string;
    quantidade: number;
  }[];

  avgTimes?: {
    landingToFinalized: string;
    finalizedToDecided: string;
    landingToDecided: string;
  };

}





// =====================================================
// MOCK TEMPORÁRIO
// Backend ainda não possui esses dados
// =====================================================



const trendData = [

  {
    id: 'out',
    mes: 'Out',
    leads: 45,
    aprovados: 12,
  },


  {
    id: 'nov',
    mes: 'Nov',
    leads: 52,
    aprovados: 15,
  },


  {
    id: 'dez',
    mes: 'Dez',
    leads: 61,
    aprovados: 18,
  },


  {
    id: 'jan',
    mes: 'Jan',
    leads: 58,
    aprovados: 16,
  },


  {
    id: 'fev',
    mes: 'Fev',
    leads: 68,
    aprovados: 21,
  },


  {
    id: 'mar',
    mes: 'Mar',
    leads: 75,
    aprovados: 24,
  },


  {
    id: 'abr',
    mes: 'Abr',
    leads: 82,
    aprovados: 28,
  },

];





// =====================================================
// COMPONENTE
// =====================================================


export default function Dashboard() {


  const navigate = useNavigate();



  const [dashboard, setDashboard] =
    useState<DashboardResponse | null>(null);



  const [loading, setLoading] =
    useState(true);





  useEffect(() => {


    async function loadDashboard() {


      try {

        const response =
          await api.get('/dashboard');

        setDashboard(response.data);

      } catch (error) {

        console.error(
          'Erro ao carregar dashboard:',
          error,
        );
        alert('Erro ao carregar dados do dashboard.');



      } finally {


        setLoading(false);


      }


    }



    loadDashboard();



  }, []);






  if (loading) {


    return (

      <div className="p-8">

        Carregando dashboard...

      </div>

    );


  }






  const totalEmpresas =
    dashboard?.companies?.total ?? 0;

  const empresasAtivas =
    dashboard?.companies?.active ?? 0;

  const empresasPendentes =
    dashboard?.companies?.pendingApproval ?? 0;

  const empresasIncompletas =
    dashboard?.companies?.incomplete ?? 0;




  const empresasInativas =
    dashboard?.companies?.inactive ?? 0;





  const totalEventos =
    dashboard?.events?.total ?? 0;



  const totalDocumentos =
    dashboard?.documents?.total ?? 0;



  const totalComunicados =
    dashboard?.announcements?.total ?? 0;






  // Agora vem do backend
  // companiesSize do DTO


  const porteData =
    dashboard?.companySize ?? [];





  const taxaConversao =

    totalEmpresas > 0

      ? Math.round(
          (empresasAtivas / totalEmpresas) * 100,
        )

      : 0;






  const stats = [


    {

      name: 'Total de Empresas',

      value: totalEmpresas,

      icon: Users,

      color: 'bg-blue-500',

      change: 'Empresas cadastradas',


      onClick: () =>
        navigate('/admin/funil'),

    },



    {

      name: 'Empresas Ativas',

      value: empresasAtivas,

      icon: CheckCircle,

      color: 'bg-green-500',

      change: 'Empresas aprovadas',


      onClick: () =>
        navigate('/admin/funil?status=ativo'),

    },



    {

      name: 'Aguardando Aprovação',

      value: empresasPendentes + empresasIncompletas,

      icon: Clock,

      color: 'bg-yellow-500',

      change: 'Aguardando aprovação',


      onClick: () =>
        navigate('/admin/funil'),

    },



    {

      name: 'Cadastros Incompletos',

      value: empresasIncompletas,

      icon: AlertCircle,

      color: 'bg-orange-500',

      change: 'Necessitam completar cadastro',


      onClick: () =>
        navigate('/admin/funil?status=incompleto'),

    },



    {

      name: 'Empresas Inativas',

      value: empresasInativas,

      icon: AlertCircle,

      color: 'bg-red-500',

      change: 'Empresas desativadas',


      onClick: () =>
        navigate('/admin/funil?status=inativo'),

    },


  ];


  return (

    <div className="p-8">


      {/* ==========================
          TÍTULO
      =========================== */}


      <div className="mb-8">


        <h1>

          Dashboard

        </h1>



        <p className="text-muted-foreground mt-1">

          Visão geral das empresas associadas

        </p>


      </div>






      {/* ==========================
          CARDS PRINCIPAIS
      =========================== */}



      <div

        className="
          grid
          grid-cols-1
          gap-6
          sm:grid-cols-2
          lg:grid-cols-5
          mb-8
        "

      >



        {
          stats.map((stat) => (


            <div


              key={stat.name}


              onClick={stat.onClick}


              className="
                bg-card
                rounded-lg
                border
                border-border
                p-6
                cursor-pointer
                hover:border-[#5DA5FF]
                hover:shadow-lg
                transition-all
                group
              "


            >



              <div

                className="
                  flex
                  items-center
                  justify-between
                  mb-4
                "

              >



                <div

                  className={`
                    ${stat.color}
                    rounded-lg
                    p-3
                  `}

                >



                  <stat.icon

                    className="
                      h-6
                      w-6
                      text-white
                    "

                  />


                </div>





                <ArrowRight

                  className="
                    h-5
                    w-5
                    text-gray-400
                    group-hover:text-[#5DA5FF]
                  "

                />


              </div>






              <p

                className="
                  text-muted-foreground
                  mb-1
                "

              >

                {stat.name}

              </p>






              <p

                className="
                  text-[2rem]
                  leading-none
                  mb-2
                "

              >

                {stat.value}

              </p>






              <p

                className="
                  text-muted-foreground
                  text-[0.875rem]
                "

              >

                {stat.change}

              </p>




            </div>



          ))

        }



      </div>








      {/* ==========================
          MÉTRICAS GERAIS
      =========================== */}





      <div className="mb-8">



        <h2

          className="
            text-lg
            font-semibold
            mb-4
          "

        >

          Métricas Gerais

        </h2>







        <div

          className="
            grid
            grid-cols-1
            gap-6
            sm:grid-cols-2
            lg:grid-cols-4
          "

        >






          {/* =====================
              EVENTOS
          ====================== */}




          <div

            onClick={() =>
              navigate('/admin/eventos')
            }

            className="
              bg-card
              rounded-lg
              border
              border-border
              p-6
              cursor-pointer
              hover:border-[#5DA5FF]
              hover:shadow-lg
              transition-all
              group
            "

          >



            <div

              className="
                flex
                items-center
                justify-between
                mb-4
              "

            >

              <div

                className="
                  bg-blue-500
                  rounded-lg
                  p-3
                  w-fit
                "

              >


                <Target

                  className="
                    h-6
                    w-6
                    text-white
                  "

                />


              </div>

              <ArrowRight

                className="
                  h-5
                  w-5
                  text-gray-400
                  group-hover:text-[#5DA5FF]
                "

              />

            </div>





            <p className="text-muted-foreground mb-1">

              Eventos cadastrados

            </p>




            <p className="text-[2rem] leading-none mb-2">

              {totalEventos}

            </p>




            <p className="text-muted-foreground text-[0.875rem]">

              Eventos disponíveis

            </p>



          </div>









          {/* =====================
              DOCUMENTOS
          ====================== */}




          <div

            onClick={() =>
              navigate('/admin/documentos-por-empresa')
            }

            className="
              bg-card
              rounded-lg
              border
              border-border
              p-6
              cursor-pointer
              hover:border-[#5DA5FF]
              hover:shadow-lg
              transition-all
              group
            "

          >



            <div

              className="
                flex
                items-center
                justify-between
                mb-4
              "

            >

              <div

                className="
                  bg-green-500
                  rounded-lg
                  p-3
                  w-fit
                "

              >


                <CheckCircle


                  className="
                    h-6
                    w-6
                    text-white
                  "


                />


              </div>

              <ArrowRight

                className="
                  h-5
                  w-5
                  text-gray-400
                  group-hover:text-[#5DA5FF]
                "

              />

            </div>






            <p className="text-muted-foreground mb-1">

              Documentos

            </p>





            <p className="text-[2rem] leading-none mb-2">

              {totalDocumentos}

            </p>





            <p className="text-muted-foreground text-[0.875rem]">

              Arquivos cadastrados

            </p>



          </div>









          {/* =====================
              COMUNICADOS
          ====================== */}





          <div

            className="
              bg-card
              rounded-lg
              border
              border-border
              p-6
            "

          >



            <div

              className="
                bg-purple-500
                rounded-lg
                p-3
                w-fit
                mb-4
              "

            >



              <Globe


                className="
                  h-6
                  w-6
                  text-white
                "


              />


            </div>






            <p className="text-muted-foreground mb-1">

              Comunicados

            </p>





            <p className="text-[2rem] leading-none mb-2">

              {totalComunicados}

            </p>





            <p className="text-muted-foreground text-[0.875rem]">

              Publicados

            </p>



          </div>









          {/* =====================
              COLABORADORES
          ====================== */}





          <div

            onClick={() =>
              navigate('/admin/colaboradores')
            }

            className="
              bg-card
              rounded-lg
              border
              border-border
              p-6
              cursor-pointer
              hover:border-[#5DA5FF]
              hover:shadow-lg
              transition-all
              group
            "

          >



            <div

              className="
                flex
                items-center
                justify-between
                mb-4
              "

            >

              <div

                className="
                  bg-indigo-500
                  rounded-lg
                  p-3
                  w-fit
                "

              >


                <Users


                  className="
                    h-6
                    w-6
                    text-white
                  "


                />


              </div>

              <ArrowRight

                className="
                  h-5
                  w-5
                  text-gray-400
                  group-hover:text-[#5DA5FF]
                "

              />

            </div>






            <p className="text-muted-foreground mb-1">

              Colaboradores

            </p>





            <p className="text-[0.875rem] text-muted-foreground">

              Gerenciar administradores e aprovadores

            </p>



          </div>









          {/* =====================
              PAGAMENTOS
          ====================== */}





          <div

            onClick={() =>
              navigate('/admin/pagamentos')
            }

            className="
              bg-card
              rounded-lg
              border
              border-border
              p-6
              cursor-pointer
              hover:border-[#5DA5FF]
              hover:shadow-lg
              transition-all
              group
            "

          >



            <div

              className="
                flex
                items-center
                justify-between
                mb-4
              "

            >

              <div

                className="
                  bg-teal-500
                  rounded-lg
                  p-3
                  w-fit
                "

              >


                <DollarSign


                  className="
                    h-6
                    w-6
                    text-white
                  "


                />


              </div>

              <ArrowRight

                className="
                  h-5
                  w-5
                  text-gray-400
                  group-hover:text-[#5DA5FF]
                "

              />

            </div>






            <p className="text-muted-foreground mb-1">

              Pagamentos

            </p>





            <p className="text-[0.875rem] text-muted-foreground">

              Aprovar pagamentos das associações

            </p>



          </div>









          {/* =====================
              TAXA APROVAÇÃO
          ====================== */}





          <div

            className="
              bg-card
              rounded-lg
              border
              border-border
              p-6
            "

          >



            <div

              className="
                bg-yellow-500
                rounded-lg
                p-3
                w-fit
                mb-4
              "

            >



              <TrendingUp


                className="
                  h-6
                  w-6
                  text-white
                "


              />


            </div>







            <p className="text-muted-foreground mb-1">

              Taxa de aprovação

            </p>





            <p className="text-[2rem] leading-none mb-2">

              {taxaConversao}%

            </p>





            <p className="text-muted-foreground text-[0.875rem]">

              Empresas ativas / total

            </p>



          </div>






        </div>



      </div>
            {/* ==========================
          GRÁFICOS
      =========================== */}



      <div

        className="
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-6
          mb-8
        "

      >





        {/* ==========================
            STATUS DAS EMPRESAS
            BACKEND
        =========================== */}



        <div

          className="
            bg-card
            rounded-lg
            border
            border-border
            p-6
          "

        >



          <h3 className="mb-6">

            Empresas por Status

          </h3>






          <ResponsiveContainer

            width="100%"

            height={300}

          >



            <BarChart


              data={[


                {

                  status: 'Ativas',

                  quantidade: empresasAtivas,

                },



                {

                  status: 'Aguardando Aprovação',

                  quantidade: empresasPendentes,

                },



                {

                  status: 'Cadastro Incompleto',

                  quantidade: empresasIncompletas,

                },



                {

                  status: 'Inativas',

                  quantidade: empresasInativas,

                },


              ]}


            >





              <CartesianGrid

                strokeDasharray="3 3"

              />






              <XAxis

                dataKey="status"

              />






              <YAxis />







              <Tooltip />







              <Bar


                dataKey="quantidade"


                fill="#3b82f6"


                radius={[

                  4,

                  4,

                  0,

                  0,

                ]}


                name="Empresas"


              />





            </BarChart>




          </ResponsiveContainer>





        </div>









        {/* ==========================
            TENDÊNCIA
            MOCK TEMPORÁRIO
        =========================== */}





        <div

          className="
            bg-card
            rounded-lg
            border
            border-border
            p-6
          "

        >




          <h3 className="mb-6">

            Tendência de Cadastros

          </h3>







          <ResponsiveContainer

            width="100%"

            height={300}

          >




            <LineChart

              data={trendData}

            >





              <CartesianGrid

                strokeDasharray="3 3"

              />







              <XAxis

                dataKey="mes"

              />







              <YAxis />







              <Tooltip />







              <Line


                type="monotone"


                dataKey="leads"


                stroke="#3b82f6"


                strokeWidth={2}


                name="Cadastros"



              />








              <Line


                type="monotone"


                dataKey="aprovados"


                stroke="#10b981"


                strokeWidth={2}


                name="Aprovados"



              />





            </LineChart>




          </ResponsiveContainer>





        </div>






      </div>









      {/* ==========================
          ORIGEM + PORTE
      =========================== */}





      <div

        className="
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-6
          mb-8
        "

      >










                {/* ==========================
            EMPRESAS POR PORTE
            BACKEND
        =========================== */}





        <div

          className="
            bg-card
            rounded-lg
            border
            border-border
            p-6
          "

        >





          <h3 className="mb-6">

            Empresas por Porte

          </h3>







          <ResponsiveContainer


            width="100%"


            height={300}


          >





            <BarChart


              data={porteData}



            >





              <CartesianGrid


                strokeDasharray="3 3"


              />







              <XAxis


                dataKey="porte"


              />







              <YAxis />







              <Tooltip />







              <Bar



                dataKey="quantidade"



                fill="#5DA5FF"



                radius={[

                  4,

                  4,

                  0,

                  0,

                ]}



                name="Quantidade"



              />





            </BarChart>





          </ResponsiveContainer>







        </div>







      </div>

      {/* ==========================
          TEMPOS MÉDIOS
      =========================== */}

      <div className="
        bg-card
        rounded-lg
        border
        border-border
        p-6
        mb-8
      ">

        <h2 className="text-lg font-semibold mb-6">Tempos Médios do Funil</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

          <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-2">Landing → Conclusão das 8 etapas</p>
            <p className="text-3xl font-bold text-blue-700">{dashboard?.avgTimes?.landingToFinalized ?? '-'}</p>
            <p className="text-xs text-muted-foreground mt-1">Tempo médio para concluir o cadastro</p>
          </div>

          <div className="text-center p-4 bg-yellow-50 rounded-xl border border-yellow-100">
            <p className="text-xs text-yellow-600 font-medium uppercase tracking-wide mb-2">Conclusão → Aprovação/Reprovação</p>
            <p className="text-3xl font-bold text-yellow-700">{dashboard?.avgTimes?.finalizedToDecided ?? '-'}</p>
            <p className="text-xs text-muted-foreground mt-1">Tempo médio para decisão após conclusão</p>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
            <p className="text-xs text-green-600 font-medium uppercase tracking-wide mb-2">Landing → Aprovação/Reprovação</p>
            <p className="text-3xl font-bold text-green-700">{dashboard?.avgTimes?.landingToDecided ?? '-'}</p>
            <p className="text-xs text-muted-foreground mt-1">Tempo médio total do processo</p>
          </div>

        </div>

      </div>

            {/* ==========================
          GARGALOS IDENTIFICADOS
          BACKEND
      =========================== */}



      <div

        className="
          bg-card
          rounded-lg
          border
          border-border
          p-6
          mb-8
        "

      >



        <h3 className="mb-4">

          Gargalos Identificados

        </h3>







        <div className="space-y-4">






          {
            empresasIncompletas > 0 && (


              <div

                className="
                  flex
                  items-start
                  gap-4
                  p-4
                  bg-yellow-50
                  border
                  border-yellow-200
                  rounded-lg
                "

              >




                <AlertCircle


                  className="
                    h-5
                    w-5
                    text-yellow-600
                    mt-0.5
                  "


                />






                <div>




                  <p className="text-yellow-900">


                    Cadastros incompletos


                  </p>







                  <p

                    className="
                      text-yellow-700
                      text-sm
                    "

                  >



                    Existem {empresasIncompletas} empresas aguardando finalização do cadastro.



                  </p>





                </div>





              </div>



            )

          }









          {
            empresasPendentes > 0 && (


              <div

                className="
                  flex
                  items-start
                  gap-4
                  p-4
                  bg-blue-50
                  border
                  border-blue-200
                  rounded-lg
                "

              >





                <Clock


                  className="
                    h-5
                    w-5
                    text-blue-600
                    mt-0.5
                  "


                />







                <div>




                  <p className="text-blue-900">


                    Empresas aguardando aprovação


                  </p>








                  <p

                    className="
                      text-blue-700
                      text-sm
                    "

                  >



                    Existem {empresasPendentes} empresas aguardando aprovação.



                  </p>






                </div>





              </div>



            )

          }









          {
            empresasInativas > 0 && (


              <div

                className="
                  flex
                  items-start
                  gap-4
                  p-4
                  bg-red-50
                  border
                  border-red-200
                  rounded-lg
                "

              >





                <AlertCircle


                  className="
                    h-5
                    w-5
                    text-red-600
                    mt-0.5
                  "


                />







                <div>




                  <p className="text-red-900">


                    Empresas inativas


                  </p>








                  <p

                    className="
                      text-red-700
                      text-sm
                    "

                  >



                    Existem {empresasInativas} empresas marcadas como inativas.



                  </p>






                </div>





              </div>



            )

          }









          {
            empresasIncompletas === 0 &&
            empresasPendentes === 0 &&
            empresasInativas === 0 && (




              <div

                className="
                  flex
                  items-start
                  gap-4
                  p-4
                  bg-green-50
                  border
                  border-green-200
                  rounded-lg
                "

              >






                <CheckCircle


                  className="
                    h-5
                    w-5
                    text-green-600
                    mt-0.5
                  "


                />








                <div>




                  <p className="text-green-900">


                    Tudo em ordem


                  </p>








                  <p

                    className="
                      text-green-700
                      text-sm
                    "

                  >



                    Nenhum gargalo identificado no momento.



                  </p>






                </div>





              </div>




            )

          }






        </div>






      </div>







    </div>

  );

}
