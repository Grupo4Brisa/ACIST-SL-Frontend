import { useEffect, useState } from 'react';
import {
  CheckSquare,
  Calendar,
  User,
  Plus,
  Filter,
  X
} from 'lucide-react';

import api from '../services/api';



interface Task {

  id:number;

  title:string;

  description:string;

  assignedTo:number;

  dueDate:string;

  status:string;

  createdAt:string;

}



interface TaskForm {

  title:string;

  description:string;

  assignedTo:string;

  dueDate:string;

}




export default function Tarefas(){



  const [tasks,setTasks] =
    useState<Task[]>([]);



  const [loading,setLoading] =
    useState(true);



  const [filterStatus,setFilterStatus] =
    useState('all');



  const [showModal,setShowModal] =
    useState(false);



  const [error,setError] =
    useState('');



  const [form,setForm] =
    useState<TaskForm>({

      title:'',

      description:'',

      assignedTo:'',

      dueDate:''

    });





  async function loadTasks(){


    try{


      const response =
        await api.get('/tasks');



      setTasks(
        response.data
      );


    }catch(error){


      console.error(
        'Erro ao buscar tarefas:',
        error
      );


    }finally{


      setLoading(false);


    }


  }






  useEffect(()=>{


    loadTasks();


  },[]);








  function formatDate(
    date:string
  ){


    if(!date)
      return '-';



    return new Intl.DateTimeFormat(
      'pt-BR',
      {
        day:'2-digit',
        month:'2-digit',
        year:'numeric',
        hour:'2-digit',
        minute:'2-digit'
      }

    ).format(
      new Date(date)
    );


  }








  function isOverdue(
    date:string
  ){


    if(!date)
      return false;



    return (
      new Date(date).getTime()
      <
      new Date().getTime()
    );


  }








  async function handleCreateTask(
    event:React.FormEvent
  ){


    event.preventDefault();


    setError('');



    try{



      const body = {


        title:
          form.title,


        description:
          form.description,


        assignedTo:
          Number(form.assignedTo),



        dueDate:
          new Date(
            form.dueDate
          ).toISOString()



      };





      await api.post(
        '/tasks',
        body
      );





      setShowModal(false);




      setForm({

        title:'',

        description:'',

        assignedTo:'',

        dueDate:''

      });





      loadTasks();





    }catch(error:any){



      console.error(

        'Erro ao criar tarefa:',
        error.response?.data || error

      );



      setError(

        error.response?.data?.message
        ||
        'Erro ao criar tarefa'

      );



    }



  }









  async function updateTaskStatus(
    id:number,
    status:string
  ){


    try{


      await api.patch(
        `/tasks/${id}`,
        {
          status
        }
      );




      setTasks(prev =>

        prev.map(task =>

          task.id === id

          ?

          {
            ...task,
            status
          }

          :

          task

        )

      );



    }catch(error:any){



      console.error(

        'Erro ao atualizar status:',
        error.response?.data || error

      );



    }


  }
    const filteredTasks =
    filterStatus === 'all'

    ?

    tasks

    :

    tasks.filter(
      task =>
        task.status === filterStatus
    );






  const pendingTasks =
    tasks.filter(
      task =>
        task.status === 'PENDING'
    ).length;





  const completedTasks =
    tasks.filter(
      task =>
        task.status === 'COMPLETED'
    ).length;





  const overdueTasks =
    tasks.filter(
      task =>
        task.status === 'PENDING'
        &&
        isOverdue(task.dueDate)
    ).length;







  if(loading){

    return (

      <div className="p-8">

        Carregando tarefas...

      </div>

    );

  }







  return (

    <div className="p-8">



      <div className="
        mb-8
        flex
        items-start
        justify-between
      ">



        <div>


          <h1>

            Tarefas

          </h1>



          <p className="
            text-muted-foreground
            mt-1
          ">

            Gerencie tarefas e atividades relacionadas aos leads

          </p>



        </div>





        <button

          onClick={() =>
            setShowModal(true)
          }


          className="
            px-4
            py-2
            bg-primary
            text-primary-foreground
            rounded-lg
            flex
            items-center
            gap-2
          "

        >


          <Plus
            className="h-4 w-4"
          />


          Nova Tarefa


        </button>




      </div>









      <div className="
        grid
        grid-cols-3
        gap-6
        mb-8
      ">



        <div className="
          bg-card
          border
          rounded-lg
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


              <CheckSquare
                className="
                  h-5
                  w-5
                  text-white
                "
              />


            </div>


          </div>



          <p className="
            text-muted-foreground
          ">

            Pendentes

          </p>



          <p className="
            text-[2rem]
          ">

            {pendingTasks}

          </p>



        </div>









        <div className="
          bg-card
          border
          rounded-lg
          p-6
        ">



          <div className="
            flex
            items-center
            gap-3
            mb-4
          ">



            <div className="
              bg-red-500
              rounded-lg
              p-3
            ">


              <Calendar
                className="
                  h-5
                  w-5
                  text-white
                "
              />


            </div>


          </div>





          <p className="
            text-muted-foreground
          ">

            Atrasadas

          </p>




          <p className="
            text-[2rem]
          ">

            {overdueTasks}

          </p>




        </div>









        <div className="
          bg-card
          border
          rounded-lg
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



              <CheckSquare
                className="
                  h-5
                  w-5
                  text-white
                "
              />



            </div>



          </div>





          <p className="
            text-muted-foreground
          ">


            Concluídas


          </p>





          <p className="
            text-[2rem]
          ">


            {completedTasks}


          </p>





        </div>




      </div>









      <div className="
        bg-card
        border
        rounded-lg
        p-6
        mb-6
      ">



        <div className="
          flex
          items-center
          gap-4
        ">



          <Filter
            className="
              h-5
              w-5
              text-muted-foreground
            "
          />





          <select


            value={filterStatus}


            onChange={(e)=>
              setFilterStatus(
                e.target.value
              )
            }


            className="
              px-4
              py-2
              border
              rounded-lg
            "


          >


            <option value="all">

              Todos os Status

            </option>



            <option value="PENDING">

              Pendentes

            </option>




            <option value="COMPLETED">

              Concluídas

            </option>



          </select>



        </div>



      </div>









      <div className="
        space-y-4
      ">



        {
          filteredTasks.map(task => {


            const overdue =
              task.status === 'PENDING'
              &&
              isOverdue(task.dueDate);





            return (

              <div

                key={task.id}


                className={`
                  bg-card
                  border
                  rounded-lg
                  p-6

                  ${
                    overdue

                    ?

                    'border-red-300'

                    :

                    'border-border'

                  }

                `}

              >




                <div className="
                  flex
                  items-start
                  gap-4
                ">




                  <input


                    type="checkbox"


                    checked={
                      task.status === 'COMPLETED'
                    }


                    onChange={(e)=>

                      updateTaskStatus(

                        task.id,

                        e.target.checked

                        ?

                        'COMPLETED'

                        :

                        'PENDING'

                      )

                    }


                    className="
                      mt-1
                      w-5
                      h-5
                      cursor-pointer
                    "


                  />





                  <div className="flex-1">


                    <h3

                      className={

                        task.status === 'COMPLETED'

                        ?

                        'line-through text-muted-foreground'

                        :

                        ''

                      }


                    >

                      {task.title}


                    </h3>





                    <p className="
                      text-muted-foreground
                      mt-2
                    ">


                      {task.description}


                    </p>





                    <div className="
                      flex
                      items-center
                      gap-6
                      mt-4
                      text-sm
                      text-muted-foreground
                    ">




                      <span className="
                        flex
                        items-center
                        gap-2
                      ">


                        <User
                          className="h-4 w-4"
                        />


                        Responsável:
                        {' '}
                        {task.assignedTo}



                      </span>





                      <span className="
                        flex
                        items-center
                        gap-2
                      ">



                        <Calendar
                          className="h-4 w-4"
                        />



                        {formatDate(
                          task.dueDate
                        )}



                      </span>




                    </div>





                  </div>




                </div>





              </div>


            );


          })

        }




      </div>
            {
        filteredTasks.length === 0 && (

          <div className="
            bg-card
            border
            rounded-lg
            p-12
            text-center
          ">

            <p className="
              text-muted-foreground
            ">

              Nenhuma tarefa encontrada

            </p>

          </div>

        )
      }





      {
        showModal && (

          <div className="
            fixed
            inset-0
            bg-black/50
            flex
            items-center
            justify-center
            z-50
          ">


            <div className="
              bg-card
              rounded-lg
              border
              p-6
              w-full
              max-w-lg
            ">


              <div className="
                flex
                justify-between
                items-center
                mb-6
              ">


                <h2>

                  Nova Tarefa

                </h2>



                <button

                  onClick={() =>
                    setShowModal(false)
                  }

                >

                  <X
                    className="
                      h-5
                      w-5
                    "
                  />

                </button>


              </div>





              {
                error && (

                  <div className="
                    bg-red-100
                    text-red-700
                    p-3
                    rounded-lg
                    mb-4
                  ">

                    {error}

                  </div>

                )
              }






              <form

                onSubmit={
                  handleCreateTask
                }

                className="
                  space-y-4
                "

              >




                <div>


                  <label>

                    Título

                  </label>



                  <input


                    required


                    value={
                      form.title
                    }


                    onChange={(e)=>

                      setForm({

                        ...form,

                        title:
                          e.target.value

                      })

                    }


                    className="
                      w-full
                      border
                      rounded-lg
                      px-3
                      py-2
                    "


                  />


                </div>







                <div>


                  <label>

                    Descrição

                  </label>



                  <textarea


                    required


                    value={
                      form.description
                    }


                    onChange={(e)=>

                      setForm({

                        ...form,

                        description:
                          e.target.value

                      })

                    }


                    className="
                      w-full
                      border
                      rounded-lg
                      px-3
                      py-2
                    "


                  />



                </div>







                <div>


                  <label>

                    Responsável (ID)

                  </label>



                  <input


                    type="number"


                    required


                    value={
                      form.assignedTo
                    }


                    onChange={(e)=>

                      setForm({

                        ...form,

                        assignedTo:
                          e.target.value

                      })

                    }


                    className="
                      w-full
                      border
                      rounded-lg
                      px-3
                      py-2
                    "


                  />


                </div>







                <div>


                  <label>

                    Data limite

                  </label>



                  <input


                    type="datetime-local"


                    required


                    value={
                      form.dueDate
                    }


                    onChange={(e)=>

                      setForm({

                        ...form,

                        dueDate:
                          e.target.value

                      })

                    }


                    className="
                      w-full
                      border
                      rounded-lg
                      px-3
                      py-2
                    "


                  />


                </div>







                <div className="
                  flex
                  justify-end
                  gap-3
                  pt-4
                ">



                  <button


                    type="button"


                    onClick={() =>
                      setShowModal(false)
                    }


                    className="
                      px-4
                      py-2
                      border
                      rounded-lg
                    "


                  >

                    Cancelar


                  </button>






                  <button


                    type="submit"


                    className="
                      px-4
                      py-2
                      bg-primary
                      text-primary-foreground
                      rounded-lg
                    "


                  >

                    Salvar


                  </button>




                </div>





              </form>





            </div>



          </div>


        )
      }




    </div>

  );


}
