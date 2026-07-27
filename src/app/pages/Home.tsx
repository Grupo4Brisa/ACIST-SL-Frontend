import { useState } from 'react';
import { useNavigate } from 'react-router';

import {
  Building2,
  Mail,
  Phone,
  Hash,
  MessageCircle,
  Users,
  TrendingUp,
  Award,
  Calendar,
  Briefcase,
  Eye,
  EyeOff,
} from 'lucide-react';


import WhatsAppButton from '../components/WhatsAppButton';
import Header from '../components/Header/Header';

import api from '../services/api';

import Footer from '../components/Footer/Footer';

import { features } from '../../config/features';

<Header />

export default function BoasVindasHome() {


  const navigate = useNavigate();



  const [formData, setFormData] = useState({

    cnpjcpf: '',

    companyName: '',

    corporateName: '',

    email: '',

    password: '',

    companySize: '',

    phone: '',

  });




  const [isSubmitting, setIsSubmitting] =
    useState(false);



  const [showPassword, setShowPassword] =
    useState(false);



  const [error, setError] =
    useState('');







  async function handleSubmit(
    e: React.FormEvent
  ) {


    e.preventDefault();


    setIsSubmitting(true);

    setError('');



    try {


      const payload: Record<string, any> = {

        cnpjcpf:
          formData.cnpjcpf,


        companyName:
          formData.companyName,


        corporateName:
          formData.corporateName,


        email:
          formData.email,


        companySize:
          formData.companySize,


        phone:
          formData.phone,

      };


      // Só envia senha quando a feature está ativa —
      // evita mandar string vazia e quebrar a validação
      // @MinLength(8) do backend quando o campo nem
      // aparece na tela.
      if (features.homePassword) {

        payload.password = formData.password;

      }


      const response = await api.post(

        '/companies/landing',

        payload,

      );

      const company = response.data;

      localStorage.removeItem('companyId');
      localStorage.removeItem('companyData');
      localStorage.removeItem('companySize');

      localStorage.setItem('companyId', String(company.id));
      localStorage.setItem('companySize', formData.companySize);
      localStorage.setItem('companyData', JSON.stringify({ ...formData, companyId: company.id }));

      navigate(`/pagamento-pix?porte=${formData.companySize}`);





    } catch (err: any) {


      setError(

        err.response?.data?.message ||

        'Erro ao iniciar cadastro'

      );



    } finally {


      setIsSubmitting(false);


    }


  }







  const handleWhatsApp = () => {


    const message = encodeURIComponent(

      'Olá! Gostaria de me associar à ACIST São Leopoldo'

    );


    window.open(

      `https://wa.me/5551999999999?text=${message}`,

      '_blank'

    );


  };







  const beneficios = [


    {


      icon: Users,

      title:
        'Networking Qualificado',

      description:
        'Conecte-se com empresários e líderes da região'


    },


    {


      icon: TrendingUp,

      title:
        'Crescimento de Negócios',

      description:
        'Acesso a oportunidades e parcerias estratégicas'


    },


    {


      icon: Award,

      title:
        'Capacitação Contínua',

      description:
        'Cursos, workshops e eventos exclusivos'


    },


    {


      icon: Calendar,

      title:
        'Eventos Exclusivos',

      description:
        'Participe de encontros, feiras e congressos'


    },


  ];








  return (

    <div className="min-h-screen bg-gradient-to-br from-[#0C3A59] to-[#226897]">


      <Header />


      <div className="max-w-7xl mx-auto px-6 py-16">


        <div className="text-center mb-12">


          <h1 className="text-white text-[3.5rem] leading-tight mb-4">


            Associe-se à ACIST São Leopoldo


          </h1>





          <p className="text-blue-100 text-[1.25rem] max-w-3xl mx-auto">


            Junte-se à principal associação comercial, industrial, de serviços e tecnologia da região


          </p>



        </div>
                <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">


          {/* Coluna Esquerda - Imagem e Texto Institucional */}

          <div className="flex flex-col h-full space-y-6">


            <div className="relative overflow-hidden rounded-2xl shadow-2xl flex-1">


              <img

                src="https://images.unsplash.com/photo-1758520144427-ddb02ac74e9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"

                alt="Profissionais em reunião de negócios"

                className="w-full h-full object-cover min-h-[500px]"

              />



              <div className="absolute bottom-6 left-6 bg-[#5DA5FF] px-6 py-3 rounded-lg shadow-lg">


                <div className="flex items-center gap-2">


                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />


                  <span className="text-white font-medium">

                    500+ empresas associadas

                  </span>


                </div>


              </div>


            </div>





            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/30">


              <p className="text-white text-center text-[1.125rem] leading-relaxed font-medium">


                Conectando empresas e fortalecendo negócios locais


              </p>


            </div>



          </div>







          {/* Coluna Direita - Formulário */}


          <div className="bg-white rounded-2xl shadow-2xl p-8">


            <h2 className="mb-2 text-center text-[#0C3A59]">

              Comece Agora

            </h2>



            <p className="text-gray-600 text-center mb-8">


              Preencha os dados para iniciar seu cadastro


            </p>






            <form

              onSubmit={handleSubmit}

              className="space-y-5"

            >






              <div>


                <label className="block mb-2 text-[0.875rem]">


                  <Hash className="inline h-4 w-4 mr-1.5" />


                  CPF ou CNPJ


                </label>



                <input


                  type="text"


                  required


                  placeholder="000.000.000-00 ou 00.000.000/0000-00"



                  className="w-full px-4 py-3.5 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-[#5DA5FF] transition-all"



                  value={formData.cnpjcpf}



                  onChange={e =>

                    setFormData({

                      ...formData,

                      cnpjcpf: e.target.value

                    })

                  }



                  disabled={isSubmitting}


                />


              </div>









              <div>


                <label className="block mb-2 text-[0.875rem]">


                  <Building2 className="inline h-4 w-4 mr-1.5" />


                  Nome da empresa ou Nome completo


                </label>





                <input


                  type="text"


                  required


                  placeholder="Sua empresa ou seu nome"



                  className="w-full px-4 py-3.5 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-[#5DA5FF] transition-all"



                  value={formData.companyName}



                  onChange={e =>

                    setFormData({

                      ...formData,

                      companyName: e.target.value

                    })

                  }



                  disabled={isSubmitting}


                />


              </div>









              <div>


                <label className="block mb-2 text-[0.875rem]">


                  <Building2 className="inline h-4 w-4 mr-1.5" />


                  Razão social


                </label>





                <input


                  type="text"


                  required


                  placeholder="Razão social da empresa"



                  className="w-full px-4 py-3.5 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-[#5DA5FF] transition-all"



                  value={formData.corporateName}



                  onChange={e =>

                    setFormData({

                      ...formData,

                      corporateName: e.target.value

                    })

                  }



                  disabled={isSubmitting}


                />


              </div>









              <div>


                <label className="block mb-2 text-[0.875rem]">


                  <Mail className="inline h-4 w-4 mr-1.5" />


                  E-mail


                </label>





                <input


                  type="email"


                  required


                  placeholder="email@empresa.com.br"



                  className="w-full px-4 py-3.5 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-[#5DA5FF] transition-all"



                  value={formData.email}



                  onChange={e =>

                    setFormData({

                      ...formData,

                      email: e.target.value

                    })

                  }



                  disabled={isSubmitting}


                />


              </div>









              {/* SENHA - exibida apenas quando a feature flag está ativa */}



              {features.homePassword && (

                <div>


                  <label className="block mb-2 text-[0.875rem]">


                    <Eye className="inline h-4 w-4 mr-1.5" />


                    Criar senha


                  </label>





                  <div className="relative">


                    <input


                      type={

                        showPassword

                          ? 'text'

                          : 'password'

                      }



                      required


                      minLength={6}



                      placeholder="Digite sua senha"



                      className="w-full px-4 py-3.5 pr-12 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-[#5DA5FF] transition-all"



                      value={formData.password}



                      onChange={e =>

                        setFormData({

                          ...formData,

                          password: e.target.value

                        })

                      }



                      disabled={isSubmitting}


                    />





                    <button


                      type="button"


                      onClick={() =>

                        setShowPassword(!showPassword)

                      }



                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"


                    >



                      {

                        showPassword

                          ?

                          <EyeOff className="h-5 w-5" />

                          :

                          <Eye className="h-5 w-5" />


                      }



                    </button>


                  </div>


                </div>

              )}
                            <div>


                <label className="block mb-2 text-[0.875rem]">


                  <Briefcase className="inline h-4 w-4 mr-1.5" />


                  Porte da empresa


                </label>





                <select


                  required


                  className="w-full px-4 py-3.5 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-[#5DA5FF] transition-all"



                  value={formData.companySize}



                  onChange={e =>

                    setFormData({

                      ...formData,

                      companySize: e.target.value

                    })

                  }



                  disabled={isSubmitting}


                >



                  <option value="">Selecione o porte</option>

                  <option value="MEI">MEI</option>

                  <option value="PEQUENA">Pequena empresa</option>

                  <option value="MEDIA">Média empresa</option>

                  <option value="GRANDE">Grande empresa</option>



                </select>


              </div>









              <div>


                <label className="block mb-2 text-[0.875rem]">


                  <Phone className="inline h-4 w-4 mr-1.5" />


                  Telefone / Celular


                </label>





                <input


                  type="tel"


                  required


                  placeholder="(51) 99999-9999"



                  className="w-full px-4 py-3.5 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-[#5DA5FF] transition-all"



                  value={formData.phone}



                  onChange={e =>

                    setFormData({

                      ...formData,

                      phone: e.target.value

                    })

                  }



                  disabled={isSubmitting}


                />


              </div>









              {


                error && (


                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">


                    {error}


                  </div>


                )


              }









              <button


                type="submit"


                disabled={isSubmitting}



                className="w-full bg-[#5DA5FF] hover:bg-[#226897] text-white py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"


              >



                {


                  isSubmitting ? (


                    <>


                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />


                      Processando...


                    </>


                  ) : (


                    'Iniciar Cadastro'


                  )


                }



              </button>




            </form>









            <div className="mt-6 pt-6 border-t border-border">


              <p className="text-center text-muted-foreground mb-4 text-[0.875rem]">


                Prefere falar conosco?


              </p>





              <button


                onClick={handleWhatsApp}



                className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-lg transition-colors flex items-center justify-center gap-3"


              >



                <MessageCircle className="h-5 w-5" />


                Falar pelo WhatsApp



              </button>


            </div>



          </div>


        </div>









        <div className="mb-20">


          <h2 className="text-center text-white mb-4">


            Benefícios de Ser Associado


          </h2>





          <p className="text-center text-blue-100 mb-12 text-[1.125rem]">


            Vantagens exclusivas para sua empresa crescer


          </p>





          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">



            {beneficios.map((beneficio, index) => (


              <div

                key={index}

                className="bg-[#F4F8FA] rounded-xl p-6 hover:shadow-xl transition-shadow"

              >


                <div className="w-14 h-14 bg-[#5DA5FF]/20 rounded-lg flex items-center justify-center mb-4">


                  <beneficio.icon className="h-7 w-7 text-[#0C3A59]" />


                </div>





                <h3 className="mb-2 text-[1.125rem] text-[#0C3A59]">


                  {beneficio.title}


                </h3>





                <p className="text-gray-600 text-[0.875rem]">


                  {beneficio.description}


                </p>



              </div>


            ))}



          </div>


        </div>









        <div className="bg-[#F4F8FA] rounded-2xl p-12 text-center">


          <h2 className="mb-4 text-[#0C3A59]">


            Faça Parte da Transformação


          </h2>





          <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-[1.125rem]">


            A ACIST São Leopoldo representa os interesses das empresas da região há mais de 50 anos. Junte-se a nós e fortaleça sua presença no mercado.


          </p>





          <div className="flex flex-wrap items-center justify-center gap-12">


            <div>


              <p className="text-[2.5rem] text-[#5DA5FF] mb-1">


                500+


              </p>


              <p className="text-gray-600">


                Empresas Associadas


              </p>


            </div>





            <div>


              <p className="text-[2.5rem] text-[#5DA5FF] mb-1">


                50+


              </p>


              <p className="text-gray-600">


                Anos de História


              </p>


            </div>





            <div>


              <p className="text-[2.5rem] text-[#5DA5FF] mb-1">


                100+


              </p>


              <p className="text-gray-600">


                Eventos por Ano


              </p>


            </div>



          </div>


        </div>


      </div>









      <WhatsAppButton />








      {/* Footer */}
      
      <Footer />


    </div>


  );


}
