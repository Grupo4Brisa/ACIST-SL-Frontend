import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
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

import api from '../services/api';

const STATUS_CADASTRO: Record<string, { label: string; color: string }> = {
  INCOMPLETE: { label: 'Cadastro Incompleto', color: 'bg-yellow-100 text-yellow-700' },
  PENDING_APPROVAL: { label: 'Cadastro Completo', color: 'bg-blue-100 text-blue-700' },
  ACTIVE: { label: 'Cadastro Completo', color: 'bg-blue-100 text-blue-700' },
  INACTIVE: { label: 'Cadastro Completo', color: 'bg-blue-100 text-blue-700' },
};

function getLoggedUserInfo() {
  const token = localStorage.getItem('token');
  if (!token) return { id: '', role: '' };
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return { id: String(payload.sub ?? ''), role: payload.role ?? '' };
  } catch { return { id: '', role: '' }; }
}

const STATUS_APROVACAO: Record<string, { label: string; color: string }> = {
  INCOMPLETE: { label: 'Aguardando Aprovação', color: 'bg-orange-100 text-orange-700' },
  PENDING_APPROVAL: { label: 'Aguardando Aprovação', color: 'bg-yellow-100 text-yellow-700' },
  ACTIVE: { label: 'Aprovado', color: 'bg-green-100 text-green-700' },
  INACTIVE: { label: 'Reprovado', color: 'bg-red-100 text-red-700' },
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Aprovada',
  PENDING_APPROVAL: 'Aguardando Aprovação',
  INCOMPLETE: 'Cadastro Incompleto',
  INACTIVE: 'Reprovada',
};


const DOCUMENTO_TIPOS: Record<string, string> = {
  STATUTE: 'Guia FGTS',
  LOGO: 'Logotipo da Empresa',
  SOCIAL_CONTRACT: 'Contrato Social / Guia do Empresário',
  CNPJ: 'Cartão CNPJ',
  BUSINESS_LICENSE: 'Comprovante de Endereço',
  STATE_REGISTRATION: 'RG dos Sócios',
  OTHER: 'Comprovante PIX',
};

const SOLUCOES_MAP: Record<number, string> = {
  1: 'Assessoria Jurídica',
  2: 'Consultoria Empresarial',
  3: 'Capacitação e Treinamentos',
  4: 'Networking',
  5: 'Certificado Digital',
  6: 'Convênios e Parcerias',
  7: 'Divulgação de Eventos',
  8: 'Representação Política',
  9: 'Serviços Financeiros',
  10: 'Marketing e Comunicação',
};

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



export default function CompanyDetail(){


  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAprovador = user?.role === 'COLABORADOR_APROVADOR';

  const [aprovacaoErro, setAprovacaoErro] = useState('');

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
  const [historico, setHistorico] = useState<any[]>([]);
  const [historicoExpanded, setHistoricoExpanded] = useState<number | null>(null);

  const [documentos, setDocumentos] =
    useState<any[]>([]);

  const [contatos, setContatos] = useState<any[]>([]);
  const [redesSociais, setRedesSociais] = useState<any>(null);
  const [solucoes, setSolucoes] = useState<any[]>([]);
  const [tarefas, setTarefas] = useState<any[]>([]);
  const [novaTarefa, setNovaTarefa] = useState({ title: '', description: '', dueDate: '', assignedRole: '', assignedId: '' });
  const [criandoTarefa, setCriandoTarefa] = useState(false);
  const [colabs, setColabs] = useState<{id:number;name:string;role:string}[]>([]);

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

    async function loadDocumentos(){
      try {
        const response = await api.get(`/documents/company/${id}`);
        setDocumentos(response.data || []);
      } catch {
        // silencioso
      }
    }

    async function loadContatos(){
      try {
        const response = await api.get(`/company-contacts/company/${id}`);
        setContatos(response.data || []);
      } catch {
        // silencioso
      }
    }

    async function loadRedesSociais(){
      try {
        const response = await api.get(`/social-networks/company/${id}`);
        setRedesSociais(response.data || null);
      } catch {
        // silencioso
      }
    }

    async function loadSolucoes(){
      try {
        const response = await api.get(`/company-solutions/company/${id}`);
        setSolucoes(response.data || []);
      } catch {
        // silencioso
      }
    }

    async function loadTarefas(){
      try {
        const response = await api.get(`/tasks/company/${id}`);
        setTarefas(response.data || []);
        api.get('/users').then(r => setColabs(Array.isArray(r.data) ? r.data : [])).catch(()=>{});
        api.get(`/approvals/company/${id}`).then(r => setHistorico(Array.isArray(r.data) ? r.data : [])).catch(()=>{});
      } catch {
        // silencioso
      }
    }

    if(id){
      loadCompany();
      loadDocumentos();
      loadContatos();
      loadRedesSociais();
      loadSolucoes();
      loadTarefas();
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

              <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                {STATUS_CADASTRO[company.status]?.label || company.status}
              </span>

              <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${STATUS_APROVACAO[company.status]?.color || 'bg-gray-100 text-gray-700'}`}>
                {STATUS_APROVACAO[company.status]?.label || company.status}
              </span>




              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('companyData');
                  localStorage.setItem('companyId', String(company.id));
                  navigate(`/cadastro/${company.id}`);
                }}
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

              </button>


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

                  {company.headquartersType || company.establishmentType || '-'}

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

          {/* CONTATOS */}
          {contatos.length > 0 && (
            <div className="bg-card rounded-lg border border-border p-6 mt-4">
              <h3 className="font-semibold mb-4">Contatos</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {contatos.map((c: any) => (
                  <div key={c.id} className="border border-border rounded-lg p-4">
                    <p className="font-medium">{c.name}</p>
                    <p className="text-sm text-muted-foreground">{c.role}</p>
                    {c.email && <p className="text-sm">{c.email}</p>}
                    {c.phone && <p className="text-sm">{c.phone}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REDES SOCIAIS */}
          {redesSociais && (redesSociais.facebook || redesSociais.instagram || redesSociais.linkedin || redesSociais.other) && (
            <div className="bg-card rounded-lg border border-border p-6 mt-4">
              <h3 className="font-semibold mb-4">Redes Sociais</h3>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                {redesSociais.facebook && <p><span className="text-muted-foreground">Facebook: </span>{redesSociais.facebook}</p>}
                {redesSociais.instagram && <p><span className="text-muted-foreground">Instagram: </span>{redesSociais.instagram}</p>}
                {redesSociais.linkedin && <p><span className="text-muted-foreground">LinkedIn: </span>{redesSociais.linkedin}</p>}
                {redesSociais.other && <p><span className="text-muted-foreground">Outros: </span>{redesSociais.other}</p>}
              </div>
            </div>
          )}

          {/* SOLUÇÕES */}
          {solucoes.length > 0 && (
            <div className="bg-card rounded-lg border border-border p-6 mt-4">
              <h3 className="font-semibold mb-4">Soluções de Interesse</h3>
              <div className="flex flex-wrap gap-2">
                {solucoes.map((s: any) => (
                  <span key={s.id} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                    {SOLUCOES_MAP[s.solutionId] || `Solução ${s.solutionId}`}
                  </span>
                ))}
              </div>
            </div>
          )}

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
                <div className="space-y-3">
                  {historico.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Nenhum histórico disponível.</p>
                  ) : (
                    historico.map((h: any) => {
                      const actionMap: Record<string, {label:string;color:string;icon:string}> = {
                        CREATED:   { label: 'Cadastro iniciado na landing', color: 'bg-blue-100 text-blue-700',    icon: '📋' },
                        COMPLETED: { label: 'Campo editado',                  color: 'bg-yellow-100 text-yellow-700', icon: '✏️' },
                        FINALIZED: { label: 'Cadastro concluído (8 etapas)', color: 'bg-purple-100 text-purple-700', icon: '🎯' },
                        APPROVED:  { label: 'Aprovado',                       color: 'bg-green-100 text-green-700',  icon: '✅' },
                        REJECTED:  { label: 'Reprovado',                      color: 'bg-red-100 text-red-700',      icon: '❌' },
                      };
                      const cfg = actionMap[h.action] ?? { label: h.action, color: 'bg-gray-100 text-gray-700', icon: '•' };
                      const hasDiff = h.observation && h.observation.includes('→');
                      const hasDetail = h.observation && !h.observation.includes('→');
                      const diffs = hasDiff
                        ? h.observation.replace(/^.*?editou: /, '').split(' | ')
                        : [];
                      return (
                        <div key={h.id} className="border border-border rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-base">{cfg.icon}</span>
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.color}`}>
                                {cfg.label}
                              </span>
                              {h.userId && (
                                <span className="text-xs text-muted-foreground">
                                  por <span className="font-medium text-foreground">{h.userName}</span>
                                  <span className="ml-1">(ID: {h.userId})</span>
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {new Intl.DateTimeFormat('pt-BR', {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(h.createdAt))}
                              </span>
                              {(hasDiff || hasDetail) && (
                                <button
                                  onClick={() => setHistoricoExpanded(historicoExpanded === h.id ? null : h.id)}
                                  className="text-muted-foreground hover:text-foreground transition-colors"
                                  title="Ver detalhes"
                                >🔍</button>
                              )}
                            </div>
                          </div>
                          {historicoExpanded === h.id && hasDiff && (
                            <div className="mt-2 border-t border-border pt-2 space-y-1">
                              {diffs.map((diff: string, i: number) => {
                                const arrowIdx = diff.indexOf('→');
                                const colonIdx = diff.indexOf(':');
                                const fieldName = colonIdx > -1 ? diff.slice(0, colonIdx).trim() : diff;
                                const before = colonIdx > -1 && arrowIdx > -1 ? diff.slice(colonIdx + 1, arrowIdx).trim().replace(/^"|"$/g, '') : '';
                                const after = arrowIdx > -1 ? diff.slice(arrowIdx + 1).trim().replace(/^"|"$/g, '') : '';
                                return (
                                  <div key={i} className="text-xs grid grid-cols-[140px_1fr] gap-2 items-start">
                                    <span className="font-medium text-foreground">{fieldName}:</span>
                                    <span>
                                      <span className="text-red-500 line-through mr-1">{before || '-'}</span>
                                      <span className="text-muted-foreground mx-1">→</span>
                                      <span className="text-green-600 font-medium">{after || '-'}</span>
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          {historicoExpanded === h.id && hasDetail && (
                            <div className="mt-2 border-t border-border pt-2">
                              <p className="text-xs text-foreground">{h.observation}</p>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}







              {activeTab === 'documentos' && (
                <div className="space-y-4">
                  {documentos.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground border border-border rounded-lg">
                      Nenhum documento enviado.
                    </div>
                  ) : (
                    documentos.map((doc: any) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-6 w-6 text-primary" />
                          <div>
                            <p className="font-medium">{DOCUMENTO_TIPOS[doc.documentType] || doc.documentType}</p>
                            <span className="text-sm text-muted-foreground">{doc.fileName}</span>
                          </div>
                        </div>
                        <button
                          className="p-2 hover:bg-muted rounded-lg"
                          onClick={() => api.get(`/documents/${doc.id}/download`, { responseType: 'blob' }).then(res => {
                            const url = window.URL.createObjectURL(new Blob([res.data]));
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = doc.fileName;
                            a.click();
                          })}
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  )}



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
                <div className="space-y-4">

                  {/* LISTA DE TAREFAS */}
                  {tarefas.length === 0 && !criandoTarefa ? (
                    <div className="text-muted-foreground text-sm">Nenhuma tarefa cadastrada.</div>
                  ) : (
                    tarefas.map((t: any) => (
                      <div key={t.id} className="flex items-start justify-between p-4 border border-border rounded-lg">
                        <div>
                          <p className="font-medium">{t.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
                          {t.dueDate && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Prazo: {new Date(t.dueDate).toLocaleDateString('pt-BR')}
                            </p>
                          )}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${t.status === 'DONE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {t.status === 'DONE' ? 'Concluída' : 'Pendente'}
                        </span>
                      </div>
                    ))
                  )}

                  {/* FORMULÁRIO NOVA TAREFA */}
                  {criandoTarefa && (
                    <div className="border border-border rounded-lg p-4 space-y-3 bg-muted/30">
                      <input
                        type="text"
                        placeholder="Título da tarefa *"
                        value={novaTarefa.title}
                        onChange={e => setNovaTarefa(p => ({ ...p, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <textarea
                        placeholder="Descrição"
                        value={novaTarefa.description}
                        onChange={e => setNovaTarefa(p => ({ ...p, description: e.target.value }))}
                        rows={2}
                        className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                      <input
                        type="date"
                        value={novaTarefa.dueDate}
                        onChange={e => setNovaTarefa(p => ({ ...p, dueDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <select
                        value={novaTarefa.assignedRole}
                        onChange={e => setNovaTarefa(p => ({ ...p, assignedRole: e.target.value, assignedId: '' }))}
                        className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Qualquer perfil (opcional)</option>
                        <option value="COLABORADOR_ADMIN">Administrador</option>
                        <option value="COLABORADOR_APROVADOR">Aprovador</option>
                      </select>
                      <select
                        value={novaTarefa.assignedId}
                        onChange={e => setNovaTarefa(p => ({ ...p, assignedId: e.target.value }))}
                        className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Colaborador específico (opcional)</option>
                        {(novaTarefa.assignedRole ? colabs.filter(u => u.role === novaTarefa.assignedRole) : colabs).map(u => (
                          <option key={u.id} value={String(u.id)}>
                            {u.name} ({u.role === 'COLABORADOR_ADMIN' ? 'Admin' : 'Aprovador'})
                          </option>
                        ))}
                      </select>
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            if (!novaTarefa.title || !novaTarefa.dueDate) return;
                            try {
                              let assignedTo = novaTarefa.assignedId ? Number(novaTarefa.assignedId) : null;
                              if (!assignedTo && novaTarefa.assignedRole) {
                                const group = colabs.filter(u => u.role === novaTarefa.assignedRole);
                                if (group.length > 0) assignedTo = group[Math.floor(Math.random() * group.length)].id;
                              }
                              if (!assignedTo) {
                                const info = getLoggedUserInfo();
                                assignedTo = info.id ? Number(info.id) : 1;
                              }
                              await api.post('/tasks', {
                                companyId: Number(id),
                                title: novaTarefa.title,
                                description: novaTarefa.description || '-',
                                assignedTo,
                                dueDate: novaTarefa.dueDate,
                              });
                              const res = await api.get(`/tasks/company/${id}`);
                              setTarefas(res.data || []);
                              setNovaTarefa({ title: '', description: '', dueDate: '', assignedRole: '', assignedId: '' });
                              setCriandoTarefa(false);
                            } catch { /* silencioso */ }
                          }}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={() => { setCriandoTarefa(false); setNovaTarefa({ title: '', description: '', dueDate: '', assignedRole: '', assignedId: '' }); }}
                          className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* BOTÃO NOVA TAREFA */}
                  {!criandoTarefa && (
                    <button
                      onClick={() => { const info = getLoggedUserInfo(); setNovaTarefa(p => ({ ...p, assignedRole: info.role, assignedId: info.id })); setCriandoTarefa(true); }}
                      className="mt-2 w-full py-3 border-2 border-dashed border-border rounded-lg flex items-center justify-center gap-2 hover:bg-muted transition-colors"
                    >
                      <CheckSquare className="h-4 w-4" />
                      Nova tarefa
                    </button>
                  )}

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




              <div className="flex flex-col gap-1">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                  {STATUS_CADASTRO[company.status]?.label || company.status}
                </span>
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${STATUS_APROVACAO[company.status]?.color || 'bg-gray-100 text-gray-700'}`}>
                  {STATUS_APROVACAO[company.status]?.label || company.status}
                </span>
              </div>


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
                  flex-wrap
                ">

                  {aprovacaoErro && (
                    <div className="w-full p-3 mb-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {aprovacaoErro}
                    </div>
                  )}


                  <button

                    onClick={
                      async()=>{

                        try{
                        if(!isAprovador){
                          setAprovacaoErro('Apenas usuários com perfil de Aprovador podem aprovar cadastros.');
                          setTimeout(() => setAprovacaoErro(''), 4000);
                          return;
                        }


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

                        if(!isAprovador){
                          setAprovacaoErro('Apenas usuários com perfil de Aprovador podem reprovar cadastros.');
                          setTimeout(() => setAprovacaoErro(''), 4000);
                          return;
                        }


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
