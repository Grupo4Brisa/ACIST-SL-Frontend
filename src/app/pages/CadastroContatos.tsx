import {
  useState
} from 'react';

import {
  useNavigate,
  useParams
} from 'react-router-dom';


import {
  Users,
  Mail,
  Phone,
  User,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';


import api from '../services/api';



interface Contact {

  id?: number;

  name: string;

  role: string;

  email: string;

  phone: string;

}




const contactTypes = [

  'Financeiro',

  'Comercial',

  'RH',

  'Administrativo',

  'Outro'

];





export default function CadastroContatos() {


  const navigate = useNavigate();


  const {
    id
  } = useParams();




  const [contacts, setContacts] = useState<Contact[]>([

    {
      name: '',
      role: 'Financeiro',
      email: '',
      phone: ''
    },

    {
      name: '',
      role: 'Comercial',
      email: '',
      phone: ''
    },

    {
      name: '',
      role: 'RH',
      email: '',
      phone: ''
    }

  ]);





  const [loading, setLoading] =
    useState(false);



  const [saved, setSaved] =
    useState(false);



  const [error, setError] =
    useState('');






  function updateContact(
    index: number,
    field: keyof Contact,
    value: string
  ) {


    const updated =
      [...contacts];


    updated[index] = {

      ...updated[index],

      [field]: value

    };


    setContacts(updated);


  }







  function addContact() {


    setContacts([

      ...contacts,

      {

        name: '',

        role: 'Outro',

        email: '',

        phone: ''

      }

    ]);


  }







  function removeContact(
    index: number
  ) {


    if (contacts.length <= 1) {

      return;

    }



    setContacts(

      contacts.filter(
        (_, i) => i !== index
      )

    );


  }






  async function handleSave() {


    try {


      setLoading(true);

      setError('');



      await api.post(

        `/company-contacts/${id}`,

        {

          contacts

        }

      );



      setSaved(true);



      setTimeout(() => {

        setSaved(false);

      }, 2000);



    } catch (err:any) {


      console.error(err);



      setError(

        err.response?.data?.message ||

        'Erro ao salvar contatos'

      );



    } finally {


      setLoading(false);


    }


  }








  function handleNext() {


    navigate(

      `/cadastro/${id}/qualificacao`

    );


  }







  function handleBack() {


    navigate(

      `/cadastro/${id}/endereco`

    );


  }








  return (

    <div className="
      min-h-screen
      bg-background
      flex
      flex-col
    ">





      {/* HEADER */}

      <header className="
        bg-card
        border-b
        border-border
      ">


        <div className="
          max-w-7xl
          mx-auto
          px-8
          py-6
          flex
          items-center
          justify-between
        ">


          <div>

            <h1>
              Cadastro de Associado
            </h1>


            <p className="
              text-muted-foreground
              mt-1
            ">

              Etapa 4 de 7 - Contatos

            </p>


          </div>





          <button

            onClick={handleSave}

            className="
              px-4
              py-2
              border
              border-border
              rounded-lg
              hover:bg-muted
              flex
              items-center
              gap-2
            "

          >


            <Save
              className="h-4 w-4"
            />


            {

              saved

              ?

              'Salvo!'

              :

              'Salvar Rascunho'

            }


          </button>


        </div>


      </header>







      {/* CONTEÚDO */}

      <main className="
        flex-1
        max-w-4xl
        w-full
        mx-auto
        px-8
        py-12
      ">


        <div className="
          bg-card
          border
          border-border
          rounded-lg
          p-8
        ">


          <div className="
            flex
            items-center
            gap-3
            mb-6
          ">


            <Users
              className="
                h-8
                w-8
                text-primary
              "
            />


            <div>


              <h2>
                Contatos da Empresa
              </h2>


              <p className="
                text-muted-foreground
              ">

                Informe os principais contatos responsáveis.

              </p>


            </div>


          </div>
          
          {

            error && (

              <div className="
                mb-6
                p-4
                bg-red-50
                border
                border-red-200
                rounded-lg
                text-red-700
              ">

                {error}

              </div>

            )

          }





          <div className="space-y-6">



            {

              contacts.map((contact, index) => (


                <div

                  key={index}

                  className="
                    border
                    border-border
                    rounded-lg
                    p-6
                  "

                >



                  <div className="
                    flex
                    items-center
                    justify-between
                    mb-5
                  ">


                    <div className="
                      flex
                      items-center
                      gap-3
                    ">


                      <div className="
                        w-10
                        h-10
                        rounded-full
                        bg-primary/10
                        flex
                        items-center
                        justify-center
                      ">


                        <User
                          className="
                            h-5
                            w-5
                            text-primary
                          "
                        />


                      </div>




                      <h3>

                        Contato {index + 1}

                      </h3>



                    </div>





                    {

                      contacts.length > 1 && (


                        <button


                          type="button"


                          onClick={() =>
                            removeContact(index)
                          }


                          className="
                            text-red-600
                            hover:text-red-800
                            flex
                            items-center
                            gap-2
                          "


                        >


                          <Trash2
                            className="
                              h-4
                              w-4
                            "
                          />


                          Remover


                        </button>


                      )

                    }



                  </div>








                  <div className="
                    grid
                    grid-cols-2
                    gap-6
                  ">



                    <div>


                      <label className="
                        block
                        mb-2
                      ">

                        Nome completo

                      </label>




                      <input


                        type="text"


                        value={
                          contact.name
                        }


                        onChange={(e) =>

                          updateContact(

                            index,

                            'name',

                            e.target.value

                          )

                        }


                        placeholder="Nome do contato"


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


                      />


                    </div>







                    <div>


                      <label className="
                        block
                        mb-2
                      ">


                        Área responsável


                      </label>




                      <select


                        value={
                          contact.role
                        }


                        onChange={(e) =>

                          updateContact(

                            index,

                            'role',

                            e.target.value

                          )

                        }



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


                      >



                        {

                          contactTypes.map(type => (


                            <option

                              key={type}

                              value={type}

                            >

                              {type}

                            </option>


                          ))

                        }



                      </select>



                    </div>





                    <div>


                      <label className="
                        block
                        mb-2
                      ">


                        E-mail


                      </label>




                      <div className="
                        relative
                      ">


                        <Mail

                          className="
                            absolute
                            left-3
                            top-1/2
                            -translate-y-1/2
                            h-4
                            w-4
                            text-muted-foreground
                          "

                        />



                        <input


                          type="email"


                          value={
                            contact.email
                          }


                          onChange={(e) =>

                            updateContact(

                              index,

                              'email',

                              e.target.value

                            )

                          }



                          placeholder="email@empresa.com"



                          className="
                            w-full
                            pl-10
                            pr-4
                            py-3
                            border
                            border-border
                            rounded-lg
                            bg-input-background
                            focus:outline-none
                            focus:ring-2
                            focus:ring-primary
                          "


                        />



                      </div>



                    </div>








                    <div>


                      <label className="
                        block
                        mb-2
                      ">


                        Telefone


                      </label>





                      <div className="
                        relative
                      ">


                        <Phone

                          className="
                            absolute
                            left-3
                            top-1/2
                            -translate-y-1/2
                            h-4
                            w-4
                            text-muted-foreground
                          "

                        />




                        <input


                          type="tel"


                          value={
                            contact.phone
                          }


                          onChange={(e) =>

                            updateContact(

                              index,

                              'phone',

                              e.target.value

                            )

                          }



                          placeholder="(51) 99999-9999"



                          className="
                            w-full
                            pl-10
                            pr-4
                            py-3
                            border
                            border-border
                            rounded-lg
                            bg-input-background
                            focus:outline-se
                            focus:ring-2
                            focus:ring-primary
                          "


                        />


                      </div>



                    </div>






                  </div>



                </div>



              ))

            }





          </div>






          <button


            type="button"


            onClick={addContact}


            className="
              mt-6
              px-5
              py-3
              border
              border-border
              rounded-lg
              flex
              items-center
              gap-2
              hover:bg-muted
            "


          >


            <Plus
              className="
                h-4
                w-4
              "
            />


            Adicionar contato



          </button>

        </div>


      </main>







      {/* FOOTER / NAVEGAÇÃO */}


      <footer className="
        bg-card
        border-t
        border-border
      ">


        <div className="
          max-w-4xl
          mx-auto
          px-8
          py-6
          flex
          justify-between
        ">



          <button


            onClick={handleBack}


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


            onClick={() => {

              handleSave();

              handleNext();

            }}



            disabled={loading}



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
              disabled:opacity-50
            "


          >



            {

              loading

              ?

              'Salvando...'

              :

              'Próxima Etapa'

            }



            <ArrowRight

              className="
                h-4
                w-4
              "

            />



          </button>




        </div>


      </footer>





    </div>


  );


}