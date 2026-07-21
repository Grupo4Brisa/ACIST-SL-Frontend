import { 
  useEffect, 
  useState 
} from 'react';

import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import { 
  TrendingUp,
  Users,
  Target,
  Clock
} from 'lucide-react';

import api from '../services/api';



interface Company {


  id:number;


  companyName:string;


  corporateName:string;


  status:string;


  city?:string;


  companySize:string;


  createdAt:string;


  updatedAt:string;


}





const COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#6366f1'
];





export default function Relatorios(){



  const [
    companies,
    setCompanies
  ] =
  useState<Company[]>([]);




  const [
    loading,
    setLoading
  ] =
  useState(true);





  useEffect(()=>{


    async function loadCompanies(){


      try{


        const response =
          await api.get(
            '/companies'
          );



        setCompanies(
          response.data
        );



      }catch(error){


        console.error(
          'Erro ao carregar empresas:',
          error
        );


      }finally{


        setLoading(false);


      }


    }



    loadCompanies();



  },[]);






  const totalCompanies =
    companies.length;





  const aprovadas =
    companies.filter(
      company =>
        company.status === 'ACTIVE'
    ).length;





  const pendentes =
    companies.filter(
      company =>
        company.status === 'PENDING_APPROVAL'
    ).length;





  const inativas =
    companies.filter(
      company =>
        company.status === 'INACTIVE'
    ).length;





  const taxaConversao =
    totalCompanies > 0
    ?
    (
      (aprovadas / totalCompanies)
      * 100
    ).toFixed(1)
    :
    '0';







  const statusData = [


    {

      id:'active',

      name:'Ativas',

      value:aprovadas

    },


    {

      id:'pending',

      name:'Pendentes',

      value:pendentes

    },


    {

      id:'inactive',

      name:'Inativas',

      value:inativas

    }


  ];







  const sizeData =
    companies.reduce(

      (
        acc:any[],
        company
      )=>{


        const existing =
          acc.find(
            item =>
              item.name === company.companySize
          );



        if(existing){


          existing.value++;


        }else{


          acc.push({

            id:
              company.companySize,

            name:
              company.companySize,

            value:1

          });


        }



        return acc;


      },

      []

    );







  const cityData =
    companies.reduce(

      (
        acc:any[],
        company
      )=>{


        if(!company.city){

          return acc;

        }



        const existing =
          acc.find(
            item =>
            item.name === company.city
          );



        if(existing){


          existing.value++;


        }else{


          acc.push({

            id:
              company.city,

            name:
              company.city,

            value:1

          });


        }



        return acc;


      },

      []

    );






  if(loading){


    return (

      <div className="p-8">

        Carregando relatórios...

      </div>

    );


  }
    return (

    <div className="p-8">


      <div className="mb-8">


        <h1>

          Relatórios

        </h1>



        <p className="text-muted-foreground mt-1">

          Análise de desempenho e métricas do sistema

        </p>


      </div>





      {/* CARDS PRINCIPAIS */}


      <div className="
        grid
        grid-cols-1
        gap-6
        sm:grid-cols-2
        lg:grid-cols-4
        mb-8
      ">



        <div className="
          bg-card
          rounded-lg
          border
          border-border
          p-6
        ">


          <div className="
            flex
            items-center
            gap-3
            mb-4
          ">


            <div className="
              bg-blue-500
              rounded-lg
              p-3
            ">

              <Users className="
                h-5
                w-5
                text-white
              "/>


            </div>


          </div>



          <p className="
            text-muted-foreground
            mb-1
          ">

            Total de Empresas

          </p>



          <p className="
            text-[2rem]
            leading-none
            mb-2
          ">

            {totalCompanies}

          </p>



          <p className="
            text-muted-foreground
            text-[0.875rem]
          ">

            Cadastradas no sistema

          </p>



        </div>








        <div className="
          bg-card
          rounded-lg
          border
          border-border
          p-6
        ">


          <div className="
            flex
            items-center
            gap-3
            mb-4
          ">


            <div className="
              bg-green-500
              rounded-lg
              p-3
            ">


              <Target className="
                h-5
                w-5
                text-white
              "/>


            </div>


          </div>




          <p className="
            text-muted-foreground
            mb-1
          ">

            Taxa de Conversão

          </p>




          <p className="
            text-[2rem]
            leading-none
            mb-2
          ">

            {taxaConversao}%

          </p>



          <p className="
            text-muted-foreground
            text-[0.875rem]
          ">

            {aprovadas} empresas aprovadas

          </p>



        </div>









        <div className="
          bg-card
          rounded-lg
          border
          border-border
          p-6
        ">



          <div className="
            flex
            items-center
            gap-3
            mb-4
          ">


            <div className="
              bg-orange-500
              rounded-lg
              p-3
            ">



              <Clock className="
                h-5
                w-5
                text-white
              "/>


            </div>



          </div>




          <p className="
            text-muted-foreground
            mb-1
          ">

            Pendentes

          </p>




          <p className="
            text-[2rem]
            leading-none
            mb-2
          ">

            {pendentes}

          </p>




          <p className="
            text-muted-foreground
            text-[0.875rem]
          ">

            Aguardando aprovação

          </p>



        </div>









        <div className="
          bg-card
          rounded-lg
          border
          border-border
          p-6
        ">



          <div className="
            flex
            items-center
            gap-3
            mb-4
          ">



            <div className="
              bg-purple-500
              rounded-lg
              p-3
            ">



              <TrendingUp className="
                h-5
                w-5
                text-white
              "/>



            </div>



          </div>





          <p className="
            text-muted-foreground
            mb-1
          ">

            Crescimento

          </p>




          <p className="
            text-[2rem]
            leading-none
            mb-2
          ">

            +24%

          </p>




          <p className="
            text-muted-foreground
            text-[0.875rem]
          ">

            Comparativo mensal

          </p>




        </div>




      </div>







      {/* GRÁFICOS */}



      <div className="
        grid
        grid-cols-1
        lg:grid-cols-2
        gap-6
        mb-6
      ">






        <div className="
          bg-card
          rounded-lg
          border
          border-border
          p-6
        ">



          <h3 className="mb-6">

            Empresas por Status

          </h3>




          <ResponsiveContainer
            width="100%"
            height={300}
          >


            <PieChart>


              <Pie

                data={statusData}

                cx="50%"

                cy="50%"

                labelLine={false}

                label={
                  ({
                    name,
                    percent
                  }) =>
                  `${name} ${
                    (
                      percent * 100
                    ).toFixed(0)
                  }%`
                }

                outerRadius={100}

                dataKey="value"

              >


                {
                  statusData.map(
                    (
                      entry,
                      index
                    )=>(


                      <Cell

                        key={
                          `status-${entry.id}`
                        }

                        fill={
                          COLORS[
                            index %
                            COLORS.length
                          ]
                        }

                      />


                    )
                  )
                }


              </Pie>



              <Tooltip />


            </PieChart>


          </ResponsiveContainer>



        </div>






        <div className="
          bg-card
          rounded-lg
          border
          border-border
          p-6
        ">



          <h3 className="mb-6">

            Empresas por Porte

          </h3>



          <ResponsiveContainer
            width="100%"
            height={300}
          >


            <BarChart
              data={sizeData}
            >


              <CartesianGrid
                strokeDasharray="3 3"
              />


              <XAxis
                dataKey="name"
              />


              <YAxis />


              <Tooltip />



              <Bar

                dataKey="value"

                fill="#3b82f6"

                name="Quantidade"

                radius={[
                  4,
                  4,
                  0,
                  0
                ]}

              />


            </BarChart>


          </ResponsiveContainer>



        </div>





      </div>
            {/* EMPRESAS POR CIDADE */}


      <div className="
        bg-card
        rounded-lg
        border
        border-border
        p-6
        mb-6
      ">



        <h3 className="mb-6">

          Distribuição por Cidade

        </h3>




        <ResponsiveContainer
          width="100%"
          height={300}
        >


          <BarChart
            data={cityData}
          >



            <CartesianGrid
              strokeDasharray="3 3"
            />



            <XAxis
              dataKey="name"
              tick={{
                fontSize:12
              }}
            />



            <YAxis />



            <Tooltip />



            <Bar

              dataKey="value"

              fill="#10b981"

              name="Empresas"

              radius={[
                4,
                4,
                0,
                0
              ]}

            />


          </BarChart>



        </ResponsiveContainer>



      </div>









      {/* INSIGHTS */}



      <div className="
        bg-card
        rounded-lg
        border
        border-border
        p-6
      ">



        <h3 className="mb-4">

          Insights e Recomendações

        </h3>





        <div className="space-y-4">





          <div className="
            p-4
            bg-blue-50
            border
            border-blue-200
            rounded-lg
          ">



            <p className="
              text-blue-900
            ">

              Maior concentração de empresas

            </p>




            <p className="
              text-blue-700
              text-[0.875rem]
              mt-1
            ">


              {
                cityData.length > 0
                ?

                `${cityData.sort(
                  (
                    a,
                    b
                  ) =>
                  b.value -
                  a.value

                )[0].name}
                possui o maior número
                de empresas cadastradas.`

                :

                'Ainda não existem dados suficientes.'
              }


            </p>



          </div>









          <div className="
            p-4
            bg-yellow-50
            border
            border-yellow-200
            rounded-lg
          ">



            <p className="
              text-yellow-900
            ">

              Ponto de atenção

            </p>




            <p className="
              text-yellow-700
              text-[0.875rem]
              mt-1
            ">


              Existem

              {' '}

              {pendentes}

              {' '}

              empresas aguardando aprovação.
              Avalie os cadastros pendentes.


            </p>



          </div>









          <div className="
            p-4
            bg-green-50
            border
            border-green-200
            rounded-lg
          ">



            <p className="
              text-green-900
            ">

              Desempenho positivo

            </p>




            <p className="
              text-green-700
              text-[0.875rem]
              mt-1
            ">


              A taxa atual de conversão é de

              {' '}

              {taxaConversao}%

              .

              Continue acompanhando o fluxo
              de aprovação das empresas.


            </p>



          </div>






        </div>




      </div>





    </div>


  );

}