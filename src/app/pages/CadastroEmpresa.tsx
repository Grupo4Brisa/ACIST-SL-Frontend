import {
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  ArrowRight,
  Save,
  LogOut,
} from 'lucide-react';

import api from '../services/api';

import ProgressoCadastro from '../components/ProgressoCadastro';
import Header from '../components/Header/Header';

import Footer from '../components/Footer/Footer';

export default function CadastroDados() {


  const navigate = useNavigate();

  const { id: idParam } = useParams();



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

      origin: '',

      originDetail: '',

    });




  function normalizarPorte(porte: string): string {
    const map: Record<string, string> = {
      'mei': 'MEI',
      'microempresa': 'Microempresa',
      'micro': 'Microempresa',
      'pequena': 'Pequena',
      'small': 'Pequena',
      'media': 'Média',
      'média': 'Média',
      'medio': 'Média',
      'médio': 'Média',
      'grande': 'Grande',
      'large': 'Grande',
    };
    return map[porte.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')] || porte;
  }

  useEffect(() => {

    const urlId = idParam && idParam !== 'null' ? Number(idParam) : null;
    const savedId = localStorage.getItem('companyId');
    const storedId = savedId && savedId !== 'null' ? Number(savedId) : null;
    const resolvedId = urlId || storedId;

    if(resolvedId){
      setCompanyId(resolvedId);
      localStorage.setItem('companyId', String(resolvedId));
    }

    const savedData = localStorage.getItem('companyData');

    if(savedData){
      const parsed = JSON.parse(savedData);
      if(parsed.companySize) parsed.companySize = normalizarPorte(parsed.companySize);
      setFormData(prev => ({
        ...prev,
        companyName:       parsed.companyName       || prev.companyName,
        corporateName:     parsed.corporateName     || prev.corporateName,
        cnpjcpf:           parsed.cnpjcpf           || prev.cnpjcpf,
        email:             parsed.email             || prev.email,
        phone:             parsed.phone             || prev.phone,
        companySize:       parsed.companySize       || prev.companySize,
        stateRegistration: parsed.stateRegistration || prev.stateRegistration,
        address:           parsed.address           || prev.address,
        neighborhood:      parsed.neighborhood      || prev.neighborhood,
        city:              parsed.city              || prev.city,
        state:             parsed.state             || prev.state,
        zipCode:           parsed.zipCode           || prev.zipCode,
        website:           parsed.website           || prev.website,
        establishmentType: parsed.establishmentType || prev.establishmentType,
        headquartersType:  parsed.headquartersType  || prev.headquartersType,
        employeesCount:    parsed.employeesCount    || prev.employeesCount,
        foundationDate:    parsed.foundationDate    || prev.foundationDate,
        origin:            parsed.origin            || prev.origin,
        originDetail:      parsed.originDetail      || prev.originDetail,
      }));
    } else if(resolvedId) {
      // busca da API quando não há dados no localStorage (ex: acesso via token)
      api.get(`/companies/${resolvedId}`).then(res => {
        const d = res.data;
        setFormData(prev => ({
          ...prev,
          companyName:      d.companyName      || '',
          corporateName:    d.corporateName    || '',
          cnpjcpf:          d.cnpjcpf          || '',
          email:            d.email            || '',
          phone:            d.phone            || '',
          companySize:      normalizarPorte(d.companySize      || ''),
          stateRegistration:d.stateRegistration|| '',
          address:          d.address          || '',
          neighborhood:     d.neighborhood     || '',
          city:             d.city             || '',
          state:            d.state            || '',
          zipCode:          d.zipCode          || '',
          website:          d.website          || '',
          establishmentType:d.establishmentType|| '',
          headquartersType: d.headquartersType || '',
          employeesCount:   d.employeesCount   ? String(d.employeesCount) : '',
          foundationDate:   d.foundationDate   ? d.foundationDate.split('T')[0] : '',
          origin:           d.origin            || '',
          originDetail:     d.originDetail      || '',
        }));
      }).catch(() => {});
    }

  }, []);






  function handleChange(
    field:string,
    value:string,
  ){


    setFormData(prev => ({ ...prev, [field]: value }));


  }




  // =========================
  // Validação completa dos campos obrigatórios
  // usada apenas ao AVANÇAR de etapa, não ao salvar rascunho
  // =========================

  function validarCamposObrigatorios(): string | null {

    const camposObrigatorios: [string, string][] = [
      [formData.companyName,    'Razão Social'],
      [formData.corporateName,  'Nome Fantasia'],
      [formData.cnpjcpf,        'CNPJ/CPF'],
      [formData.email,          'Email'],
      [formData.phone,          'Telefone'],
      [formData.companySize,    'Porte da Empresa'],
      [formData.address,        'Endereço'],
      [formData.neighborhood,   'Bairro'],
      [formData.city,           'Cidade'],
      [formData.state,          'Estado'],
      [formData.zipCode,        'CEP'],
    ];

    const campoVazio = camposObrigatorios.find(([val]) => !val);

    return campoVazio ? campoVazio[1] : null;

  }










  async function saveDraft(){


    try {


      setLoading(true);










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


        phone:
          formData.phone,


        companySize:
          formData.companySize,


        stateRegistration:
          formData.stateRegistration,


        address:
          formData.address,


        neighborhood:
          formData.neighborhood,


        city:
          formData.city,


        state:
          formData.state,


        zipCode:
          formData.zipCode,


        website:
          formData.website,


        establishmentType:
          formData.establishmentType,


        headquartersType:
          formData.headquartersType,


        employeesCount:
          formData.employeesCount
            ? Number(formData.employeesCount)
            : undefined,


        foundationDate:
          formData.foundationDate || undefined,


        origin:
          formData.origin || undefined,


        originDetail:
          formData.originDetail || undefined,


      };






      let response;






      const storedId = localStorage.getItem('companyId');
      const currentId =
        companyId ||
        (storedId && storedId !== 'null' ? Number(storedId) : null);

      if(currentId){


        response =
          await api.patch(

            `/companies/${currentId}`,

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

        JSON.stringify({
          companyName:       formData.companyName,
          corporateName:     formData.corporateName,
          cnpjcpf:           formData.cnpjcpf,
          email:             formData.email,
          phone:             formData.phone,
          companySize:       formData.companySize,
          stateRegistration: formData.stateRegistration,
          address:           formData.address,
          neighborhood:      formData.neighborhood,
          city:              formData.city,
          state:             formData.state,
          zipCode:           formData.zipCode,
          website:           formData.website,
          establishmentType: formData.establishmentType,
          headquartersType:  formData.headquartersType,
          employeesCount:    formData.employeesCount,
          foundationDate:    formData.foundationDate,
          origin:            formData.origin,
          originDetail:      formData.originDetail,
        })

      );




      alert('Rascunho salvo com sucesso!');




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


    // Ao avançar de etapa, sim, exigimos todos os campos obrigatórios

    const campoFaltando = validarCamposObrigatorios();

    if(campoFaltando){
      alert('Campo obrigatório não preenchido: ' + campoFaltando);
      return;
    }


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
      <Header />
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







            <ProgressoCadastro etapaAtual={1} />








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
                1.5 COMO CONHECEU
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

                1.5 Como conheceu a ACIST-SL?


              </h3>



              <div className="grid md:grid-cols-2 gap-3">

                {[
                  { value: 'Redes Sociais', label: 'Redes Sociais' },
                  { value: 'Jornal', label: 'Jornal' },
                  { value: 'Site', label: 'Site' },
                  { value: 'Indicação de Associado', label: 'Indicação de Associado' },
                  { value: 'Outro', label: 'Outro' },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition"
                  >
                    <input
                      type="radio"
                      name="origin"
                      value={opt.value}
                      checked={formData.origin === opt.value}
                      onChange={(e) => {
                        const needsDetail = e.target.value === 'Indicação de Associado' || e.target.value === 'Outro';
                        setFormData(prev => ({ ...prev, origin: e.target.value, originDetail: needsDetail ? prev.originDetail : '' }));
                      }}
                      className="accent-[#0C3A59] w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">{opt.label}</span>
                  </label>
                ))}

              </div>

              {formData.origin === 'Indicação de Associado' && (

                <div>

                  <label className="block mb-2 text-sm font-medium text-gray-700">

                    Nome do associado indicador *

                  </label>

                  <input

                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-[#0C3A59] focus:border-[#0C3A59]"

                    placeholder="Digite o nome do associado"

                    value={formData.originDetail}

                    onChange={(e) => handleChange('originDetail', e.target.value)}

                  />

                </div>

              )}

              {formData.origin === 'Outro' && (

                <div>

                  <label className="block mb-2 text-sm font-medium text-gray-700">

                    Descreva como nos conheceu *

                  </label>

                  <input

                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-[#0C3A59] focus:border-[#0C3A59]"

                    placeholder="Descreva"

                    value={formData.originDetail}

                    onChange={(e) => handleChange('originDetail', e.target.value)}

                  />

                </div>

              )}

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
