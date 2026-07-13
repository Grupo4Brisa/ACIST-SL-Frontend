import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router';
import { Check, Save, X, Plus, Trash2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Logo from '../components/Logo';

interface phone {
  name: string;
  email: string;
  phone: string;
}

interface CadastroState {
  // 1. Dados Cadastrais
  corporateName: string;
  companyName: string;
  cpfCnpj: string;
  stateRegistration: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  website: string;
  companySize: string;
  establishmentType: string;
  headquartersType: string;
  employeesCount: string;
  foundationDate: string;

  // 2. phones
  socios: phone[];
  financeiro: phone[];
  rh: phone[];

  // 3. Informações Adicionais
  eventPresentation: string;
  redesSociais: {
    facebook: string;
    instagram: string;
    linkedin: string;
    other: string;
  };
  solucoes: string[];

  // 4. Valores
  planoSelecionado: string;

  // 5. Documentos
  documentos: {
    fichaCadastral: File | null;
    cnpj: File | null;
    comprovanteaddress: File | null;
    contratoSocial: File | null;
    rgSocios: File[];
    guiaFGTS: File | null;
    logotipo: File | null;
    comprovantePix: File | null;
  };

  // 6. Termo
  aceitoTermos: boolean;
}

const steps = [
  { id: 1, name: 'Dados Cadastrais', required: true },
  { id: 2, name: 'phones', required: true },
  { id: 3, name: 'Divulgação', required: false },
  { id: 4, name: 'Redes Sociais', required: false },
  { id: 5, name: 'Soluções', required: false },
  { id: 6, name: 'Valores', required: true },
  { id: 7, name: 'Documentos', required: false },
  { id: 8, name: 'Termo de Adesão', required: true }
];

const planos = [
  { tipo: 'MEI', valor: 42 },
  { tipo: 'Profissional autônomo', valor: 68 },
  { tipo: 'Profissional liberal', valor: 68 },
  { tipo: 'Empresa até 5 funcionários', valor: 103 },
  { tipo: 'Empresa de 6 a 25 funcionários', valor: 139 },
  { tipo: 'Empresa de 26 a 75 funcionários', valor: 230 },
  { tipo: 'Empresa de 76 a 250 funcionários', valor: 332 },
  { tipo: 'Empresa acima de 250 funcionários', valor: 496 }
];

const solucoesList = [
  'Análise de crédito',
  'Certificado de origem',
  'Certificado digital',
  'Carta de exclusividade',
  'Capacitação (cursos e eventos)',
  'Locação de espaços (salas, auditório, sede, rancho)',
  'Eventos (boletim, terça, momento, viva São Leo, pedal seguro, matchmaking)',
  'Convênios / rede de vantagens',
  'Programa Empreender (projeto de núcleos)'
];

export default function CadastroWizardNew() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const origem = searchParams.get('origem');
  const campanha = searchParams.get('campanha');

  const [currentStep, setCurrentStep] = useState(1);
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [data, setData] = useState<CadastroState>({
    corporateName: '',
    companyName: '',
    cpfCnpj: '',
    stateRegistration: '',
    address: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    website: '',
    companySize: '',
    establishmentType: '',
    headquartersType: '',
    employeesCount: '',
    foundationDate: '',
    socios: [{ name: '', email: '', phone: '' }],
    financeiro: [{ name: '', email: '', phone: '' }],
    rh: [{ name: '', email: '', phone: '' }],
    eventPresentation: '',
    redesSociais: { facebook: '', instagram: '', linkedin: '', other: '' },
    solucoes: [],
    planoSelecionado: '',
    documentos: {
      fichaCadastral: null,
      cnpj: null,
      comprovanteaddress: null,
      contratoSocial: null,
      rgSocios: [],
      guiaFGTS: null,
      logotipo: null,
      comprovantePix: null
    },
    aceitoTermos: false
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExit = () => {
    handleSave();
    setTimeout(() => navigate('/login-associado'), 1500);
  };

  const addphone = (tipo: 'socios' | 'financeiro' | 'rh') => {
    setData({
      ...data,
      [tipo]: [...data[tipo], { name: '', email: '', phone: '' }]
    });
  };

  const removephone = (tipo: 'socios' | 'financeiro' | 'rh', index: number) => {
    setData({
      ...data,
      [tipo]: data[tipo].filter((_, i) => i !== index)
    });
  };

  const updatephone = (tipo: 'socios' | 'financeiro' | 'rh', index: number, field: keyof phone, value: string) => {
    const updated = [...data[tipo]];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, [tipo]: updated });
  };

  const toggleSolucao = (solucao: string) => {
    setData({
      ...data,
      solucoes: data.solucoes.includes(solucao)
        ? data.solucoes.filter(s => s !== solucao)
        : [...data.solucoes, solucao]
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0C3A59] to-[#226897]">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo size="md" theme="light" />
            <div className="flex gap-3">
              {id === 'edit' && (
                <button
                  onClick={() => navigate('/area-associado')}
                  className="px-6 py-2.5 border border-[#5DA5FF] text-[#5DA5FF] hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar para Área do Associado
                </button>
              )}
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2.5 bg-[#5DA5FF] text-white hover:bg-[#226897] rounded-lg transition-colors"
              >
                Voltar à Página Inicial
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-lg">
          {/* Header com botões */}
          <div className="px-8 pt-6 pb-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[#0C3A59] text-xl">Cadastro de Associado</h1>
                <p className="text-gray-600 text-[0.875rem] mt-1">
                  {origem && `Origem: ${origem}`} {campanha && `• ${campanha}`}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-[0.875rem]"
                >
                  <Save className="h-4 w-4" />
                  {saved ? 'Salvo!' : 'Salvar Rascunho'}
                </button>
                <button
                  onClick={handleExit}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2 text-[0.875rem]"
                >
                  <X className="h-4 w-4" />
                  Sair
                </button>
              </div>
            </div>
          </div>

          {/* Linha do Tempo - Stepper */}
          <div className="px-8 pt-6 pb-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <button
                      onClick={() => setCurrentStep(step.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                        currentStep === step.id
                          ? 'bg-[#5DA5FF] text-white scale-110'
                          : currentStep > step.id
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                    </button>
                    <div className="mt-2 text-center">
                      <p className={`text-[0.75rem] font-medium ${
                        currentStep === step.id
                          ? 'text-[#5DA5FF]'
                          : currentStep > step.id
                          ? 'text-green-600'
                          : 'text-gray-600'
                      }`}>
                        {step.name}
                        {step.required && <span className="text-red-600 ml-0.5">*</span>}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-1 flex-1 mx-2 mb-6 ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8">
              {/* Etapa 1: Dados Cadastrais */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-[#0C3A59] mb-6">Dados Cadastrais</h2>

                    {/* 1.1 Identificação */}
                    <div className="mb-8">
                      <h3 className="text-[#226897] mb-4 pb-2 border-b border-gray-200">1.1 Identificação</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[0.875rem] mb-2">Razão Social <span className="text-red-600">*</span></label>
                          <input
                            type="text"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                            value={data.corporateName}
                            onChange={e => setData({ ...data, corporateName: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-[0.875rem] mb-2">name Fantasia <span className="text-red-600">*</span></label>
                          <input
                            type="text"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                            value={data.companyName}
                            onChange={e => setData({ ...data, companyName: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-[0.875rem] mb-2">CNPJ / CPF <span className="text-red-600">*</span></label>
                          <input
                            type="text"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                            placeholder="00.000.000/0000-00 ou 000.000.000-00"
                            value={data.cpfCnpj}
                            onChange={e => setData({ ...data, cpfCnpj: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-[0.875rem] mb-2">Inscrição Estadual</label>
                          <input
                            type="text"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                            value={data.stateRegistration}
                            onChange={e => setData({ ...data, stateRegistration: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 1.2 Endereço */}
                    <div className="mb-8">
                      <h3 className="text-[#226897] mb-4 pb-2 border-b border-gray-200">1.2 Endereço</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="block text-[0.875rem] mb-2">Endereço <span className="text-red-600">*</span></label>
                          <input
                            type="text"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                            value={data.address}
                            onChange={e => setData({ ...data, address: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-[0.875rem] mb-2">neighborhood <span className="text-red-600">*</span></label>
                          <input
                            type="text"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                            value={data.neighborhood}
                            onChange={e => setData({ ...data, neighborhood: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-[0.875rem] mb-2">city <span className="text-red-600">*</span></label>
                          <input
                            type="text"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                            value={data.city}
                            onChange={e => setData({ ...data, city: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-[0.875rem] mb-2">state <span className="text-red-600">*</span></label>
                          <select
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                            value={data.state}
                            onChange={e => setData({ ...data, state: e.target.value })}
                          >
                            <option value="">Selecione</option>
                            <option value="RS">RS</option>
                            <option value="SC">SC</option>
                            <option value="PR">PR</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[0.875rem] mb-2">zipCode <span className="text-red-600">*</span></label>
                          <input
                            type="text"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                            placeholder="00000-000"
                            value={data.zipCode}
                            onChange={e => setData({ ...data, zipCode: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 1.3 phone */}
                    <div className="mb-8">
                      <h3 className="text-[#226897] mb-4 pb-2 border-b border-gray-200">1.3 phone</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[0.875rem] mb-2">phone <span className="text-red-600">*</span></label>
                          <input
                            type="tel"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                            placeholder="(51) 99999-9999"
                            value={data.phone}
                            onChange={e => setData({ ...data, phone: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-[0.875rem] mb-2">Email <span className="text-red-600">*</span></label>
                          <input
                            type="email"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                            value={data.email}
                            onChange={e => setData({ ...data, email: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-[0.875rem] mb-2">Senha de Acesso <span className="text-red-600">*</span></label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                              placeholder="Mínimo 6 caracteres"
                              value={data.senha}
                              onChange={e => setData({ ...data, senha: e.target.value })}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[0.875rem] mb-2">Confirmar Senha <span className="text-red-600">*</span></label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                              placeholder="Digite a senha novamente"
                              value={data.confirmarSenha}
                              onChange={e => setData({ ...data, confirmarSenha: e.target.value })}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                          {data.confirmarSenha && data.senha !== data.confirmarSenha && (
                            <p className="text-red-600 text-[0.75rem] mt-1">As senhas não coincidem</p>
                          )}
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[0.875rem] mb-2">website</label>
                          <input
                            type="url"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                            placeholder="https://www.seuwebsite.com.br"
                            value={data.website}
                            onChange={e => setData({ ...data, website: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 1.4 Dados da Empresa */}
                    <div>
                      <h3 className="text-[#226897] mb-4 pb-2 border-b border-gray-200">1.4 Dados da Empresa</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[0.875rem] mb-2">Porte da Empresa <span className="text-red-600">*</span></label>
                          <select
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                            value={data.companySize}
                            onChange={e => setData({ ...data, companySize: e.target.value, planoSelecionado: e.target.value })}
                          >
                            <option value="">Selecione</option>
                            <option value="MEI">MEI</option>
                            <option value="Profissional autônomo">Profissional autônomo</option>
                            <option value="Profissional liberal">Profissional liberal</option>
                            <option value="Empresa até 5 funcionários">Empresa até 5 funcionários</option>
                            <option value="Empresa de 6 a 25 funcionários">Empresa de 6 a 25 funcionários</option>
                            <option value="Empresa de 26 a 75 funcionários">Empresa de 26 a 75 funcionários</option>
                            <option value="Empresa de 76 a 250 funcionários">Empresa de 76 a 250 funcionários</option>
                            <option value="Empresa acima de 250 funcionários">Empresa acima de 250 funcionários</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[0.875rem] mb-2">Tipo de Estabelecimento</label>
                          <input
                            type="text"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                            value={data.establishmentType}
                            onChange={e => setData({ ...data, establishmentType: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-[0.875rem] mb-2">Matriz ou Filial</label>
                          <select
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                            value={data.headquartersType}
                            onChange={e => setData({ ...data, headquartersType: e.target.value })}
                          >
                            <option value="">Selecione</option>
                            <option value="Matriz">Matriz</option>
                            <option value="Filial">Filial</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[0.875rem] mb-2">Número de Funcionários</label>
                          <input
                            type="number"
                            min="0"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                            value={data.employeesCount}
                            onChange={e => setData({ ...data, employeesCount: e.target.value })}
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[0.875rem] mb-2">Data de Fundação</label>
                          <input
                            type="date"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                            value={data.foundationDate}
                            onChange={e => setData({ ...data, foundationDate: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Etapa 2: phones */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <h2 className="text-[#0C3A59] mb-6">phones</h2>

                  {/* 2.1 Sócios */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[#226897]">2.1 Sócios</h3>
                      <button
                        onClick={() => addphone('socios')}
                        className="flex items-center gap-2 px-3 py-1.5 text-[0.875rem] text-[#5DA5FF] hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        Adicionar Sócio
                      </button>
                    </div>
                    {data.socios.map((socio, index) => (
                      <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[0.875rem] text-gray-600">Sócio {index + 1}</span>
                          {data.socios.length > 1 && (
                            <button
                              onClick={() => removephone('socios', index)}
                              className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <input
                            type="text"
                            placeholder="name"
                            className="px-3 py-2 border border-gray-300 rounded-lg text-[0.875rem] focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                            value={socio.name}
                            onChange={e => updatephone('socios', index, 'name', e.target.value)}
                          />
                          <input
                            type="email"
                            placeholder="E-mail"
                            className="px-3 py-2 border border-gray-300 rounded-lg text-[0.875rem] focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                            value={socio.email}
                            onChange={e => updatephone('socios', index, 'email', e.target.value)}
                          />
                          <input
                            type="tel"
                            placeholder="phone"
                            className="px-3 py-2 border border-gray-300 rounded-lg text-[0.875rem] focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                            value={socio.phone}
                            onChange={e => updatephone('socios', index, 'phone', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 2.2 Financeiro */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[#226897]">2.2 Financeiro</h3>
                      <button
                        onClick={() => addphone('financeiro')}
                        className="flex items-center gap-2 px-3 py-1.5 text-[0.875rem] text-[#5DA5FF] hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        Adicionar phone
                      </button>
                    </div>
                    {data.financeiro.map((phone, index) => (
                      <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[0.875rem] text-gray-600">phone Financeiro {index + 1}</span>
                          {data.financeiro.length > 1 && (
                            <button
                              onClick={() => removephone('financeiro', index)}
                              className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <input
                            type="text"
                            placeholder="name"
                            className="px-3 py-2 border border-gray-300 rounded-lg text-[0.875rem] focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                            value={phone.name}
                            onChange={e => updatephone('financeiro', index, 'name', e.target.value)}
                          />
                          <input
                            type="email"
                            placeholder="E-mail"
                            className="px-3 py-2 border border-gray-300 rounded-lg text-[0.875rem] focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                            value={phone.email}
                            onChange={e => updatephone('financeiro', index, 'email', e.target.value)}
                          />
                          <input
                            type="tel"
                            placeholder="phone"
                            className="px-3 py-2 border border-gray-300 rounded-lg text-[0.875rem] focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                            value={phone.phone}
                            onChange={e => updatephone('financeiro', index, 'phone', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 2.3 Recursos Humanos */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[#226897]">2.3 Recursos Humanos</h3>
                      <button
                        onClick={() => addphone('rh')}
                        className="flex items-center gap-2 px-3 py-1.5 text-[0.875rem] text-[#5DA5FF] hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        Adicionar phone
                      </button>
                    </div>
                    {data.rh.map((phone, index) => (
                      <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[0.875rem] text-gray-600">phone RH {index + 1}</span>
                          {data.rh.length > 1 && (
                            <button
                              onClick={() => removephone('rh', index)}
                              className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <input
                            type="text"
                            placeholder="name"
                            className="px-3 py-2 border border-gray-300 rounded-lg text-[0.875rem] focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                            value={phone.name}
                            onChange={e => updatephone('rh', index, 'name', e.target.value)}
                          />
                          <input
                            type="email"
                            placeholder="E-mail"
                            className="px-3 py-2 border border-gray-300 rounded-lg text-[0.875rem] focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                            value={phone.email}
                            onChange={e => updatephone('rh', index, 'email', e.target.value)}
                          />
                          <input
                            type="tel"
                            placeholder="phone"
                            className="px-3 py-2 border border-gray-300 rounded-lg text-[0.875rem] focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                            value={phone.phone}
                            onChange={e => updatephone('rh', index, 'phone', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Etapa 3: Divulgação */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-[#0C3A59] mb-2">Divulgação</h2>
                    <p className="text-gray-600 text-[0.875rem] mb-6">Esta etapa é opcional</p>
                  </div>

                  <div>
                    <label className="block text-[0.875rem] mb-2">Texto para divulgação de sua empresa em eventos</label>
                    <textarea
                      rows={6}
                      maxLength={200}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                      placeholder="Divulgue sua empresa em até 200 caracteres"
                      value={data.eventPresentation}
                      onChange={e => setData({ ...data, eventPresentation: e.target.value })}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {data.eventPresentation.length}/200 caracteres
                    </p>
                  </div>
                </div>
              )}

              {/* Etapa 4: Redes Sociais */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-[#0C3A59] mb-2">Redes Sociais</h2>
                    <p className="text-gray-600 text-[0.875rem] mb-6">Esta etapa é opcional</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[0.875rem] mb-2">Facebook</label>
                      <input
                        type="url"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                        placeholder="https://facebook.com/..."
                        value={data.redesSociais.facebook}
                        onChange={e => setData({ ...data, redesSociais: { ...data.redesSociais, facebook: e.target.value }})}
                      />
                    </div>
                    <div>
                      <label className="block text-[0.875rem] mb-2">Instagram</label>
                      <input
                        type="url"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                        placeholder="https://instagram.com/..."
                        value={data.redesSociais.instagram}
                        onChange={e => setData({ ...data, redesSociais: { ...data.redesSociais, instagram: e.target.value }})}
                      />
                    </div>
                    <div>
                      <label className="block text-[0.875rem] mb-2">LinkedIn</label>
                      <input
                        type="url"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                        placeholder="https://linkedin.com/..."
                        value={data.redesSociais.linkedin}
                        onChange={e => setData({ ...data, redesSociais: { ...data.redesSociais, linkedin: e.target.value }})}
                      />
                    </div>
                    <div>
                      <label className="block text-[0.875rem] mb-2">other</label>
                      <input
                        type="url"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                        placeholder="Outras redes sociais..."
                        value={data.redesSociais.other}
                        onChange={e => setData({ ...data, redesSociais: { ...data.redesSociais, other: e.target.value }})}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Etapa 5: Soluções */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-[#0C3A59] mb-2">Soluções</h2>
                    <p className="text-gray-600 text-[0.875rem] mb-6">Quais dessas soluções deseja agregar ao seu negócio? (Opcional)</p>
                  </div>

                  <div className="space-y-3">
                    {solucoesList.map((solucao, index) => (
                      <label key={index} className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#5DA5FF] focus:ring-[#5DA5FF]"
                          checked={data.solucoes.includes(solucao)}
                          onChange={() => toggleSolucao(solucao)}
                        />
                        <span className="text-[0.875rem]">{solucao}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Etapa 6: Valores */}
              {currentStep === 6 && (() => {
                const planoCorrespondente = planos.find(p => p.tipo === data.companySize);
                const valorMensal = planoCorrespondente?.valor || 0;

                return (
                  <div className="space-y-6">
                    <h2 className="text-[#0C3A59] mb-6">Valores de Associação</h2>

                    {data.companySize ? (
                      <div className="max-w-2xl mx-auto">
                        <div className="bg-gradient-to-br from-[#0C3A59] to-[#226897] rounded-2xl p-8 text-white shadow-xl">
                          <div className="text-center mb-6">
                            <p className="text-white/80 text-sm mb-2">Seu plano</p>
                            <h3 className="text-2xl font-semibold mb-1">{data.companySize}</h3>
                            <div className="h-1 w-20 bg-[#5DA5FF] mx-auto rounded-full"></div>
                          </div>

                          <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20">
                            <div className="flex items-baseline justify-center gap-2 mb-4">
                              <span className="text-5xl font-bold">R$ {valorMensal.toFixed(2)}</span>
                              <span className="text-white/70">/mês</span>
                            </div>

                            <div className="text-center text-white/90 text-sm">
                              <p>Valor da mensalidade de associação</p>
                              <p className="mt-2 text-white/70 text-xs">
                                Baseado no porte da empresa selecionado
                              </p>
                            </div>
                          </div>

                          <div className="mt-6 text-center">
                            <p className="text-white/60 text-xs">
                              Este valor pode sofrer reajustes anuais conforme estatuto
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="max-w-2xl mx-auto">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                          <p className="text-gray-700">
                            Por favor, volte e selecione o <strong>Porte da Empresa</strong> na etapa de Dados Cadastrais para visualizar o valor da associação.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Etapa 7: Documentos */}
              {currentStep === 7 && (
                <div className="space-y-6">
                  <h2 className="text-[#0C3A59] mb-6">Documentos</h2>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-[0.875rem] text-blue-800">
                      ℹ️ Esta etapa não é obrigatória. Você pode enviar os documentos posteriormente através da sua área do associado.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[0.875rem] mb-2">Guia do FGTS</label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            setData({ ...data, documentos: { ...data.documentos, guiaFGTS: e.target.files[0] } });
                          }
                        }}
                      />
                      {data.documentos.guiaFGTS && (
                        <p className="text-[0.75rem] text-green-600 mt-1">✓ Arquivo: {data.documentos.guiaFGTS.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[0.875rem] mb-2">Logotipo da empresa</label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            setData({ ...data, documentos: { ...data.documentos, logotipo: e.target.files[0] } });
                          }
                        }}
                      />
                      {data.documentos.logotipo && (
                        <p className="text-[0.75rem] text-green-600 mt-1">✓ Arquivo: {data.documentos.logotipo.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[0.875rem] mb-2">Contrato social ou guia do empresário</label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            setData({ ...data, documentos: { ...data.documentos, contratoSocial: e.target.files[0] } });
                          }
                        }}
                      />
                      {data.documentos.contratoSocial && (
                        <p className="text-[0.75rem] text-green-600 mt-1">✓ Arquivo: {data.documentos.contratoSocial.name}</p>
                      )}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h3 className="text-[0.875rem] font-semibold text-gray-700 mb-4">Documentos Opcionais</h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-[0.875rem] mb-2 text-gray-600">Cópia do CNPJ (opcional)</label>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                            onChange={e => {
                              if (e.target.files && e.target.files[0]) {
                                setData({ ...data, documentos: { ...data.documentos, cnpj: e.target.files[0] } });
                              }
                            }}
                          />
                          {data.documentos.cnpj && (
                            <p className="text-[0.75rem] text-green-600 mt-1">✓ Arquivo: {data.documentos.cnpj.name}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[0.875rem] mb-2 text-gray-600">Comprovante de endereço (opcional)</label>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                            onChange={e => {
                              if (e.target.files && e.target.files[0]) {
                                setData({ ...data, documentos: { ...data.documentos, comprovanteaddress: e.target.files[0] } });
                              }
                            }}
                          />
                          {data.documentos.comprovanteaddress && (
                            <p className="text-[0.75rem] text-green-600 mt-1">✓ Arquivo: {data.documentos.comprovanteaddress.name}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[0.875rem] mb-2 text-gray-600">Documento (RG) dos sócios (opcional)</label>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            multiple
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                            onChange={e => {
                              if (e.target.files) {
                                setData({ ...data, documentos: { ...data.documentos, rgSocios: Array.from(e.target.files) } });
                              }
                            }}
                          />
                          {data.documentos.rgSocios.length > 0 && (
                            <p className="text-[0.75rem] text-green-600 mt-1">✓ {data.documentos.rgSocios.length} arquivo(s) selecionado(s)</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[0.875rem] mb-2 text-gray-600">Comprovante de PIX (opcional)</label>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DA5FF]"
                            onChange={e => {
                              if (e.target.files && e.target.files[0]) {
                                setData({ ...data, documentos: { ...data.documentos, comprovantePix: e.target.files[0] } });
                              }
                            }}
                          />
                          {data.documentos.comprovantePix && (
                            <p className="text-[0.75rem] text-green-600 mt-1">✓ Arquivo: {data.documentos.comprovantePix.name}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-[0.875rem] text-gray-600 mb-2">
                      📄 Formatos aceitos
                    </p>
                    <p className="text-[0.75rem] text-gray-500">
                      PDF, JPG, JPEG, PNG • Tamanho máximo: 10MB por arquivo
                    </p>
                  </div>
                </div>
              )}

              {/* Etapa 8: Termo de Adesão */}
              {currentStep === 8 && (
                <div className="space-y-6">
                  <h2 className="text-[#0C3A59] mb-6">Termo de Adesão</h2>

                  <div className="border border-gray-300 rounded-lg p-6 max-h-96 overflow-y-auto bg-gray-50">
                    <h3 className="text-[#0C3A59] mb-4">TERMO DE ADESÃO - ACIST SÃO LEOPOLDO</h3>
                    <div className="space-y-4 text-[0.875rem] text-gray-700">
                      <p>
                        Pelo presente instrumento particular, a empresa acima qualificada declara sua intenção de associar-se à
                        ACIST São Leopoldo - Associação Comercial, Industrial, de Serviços e Tecnologia de São Leopoldo.
                      </p>
                      <p>
                        A empresa está ciente de que a aprovação de sua associação está sujeita à análise e aprovação pela diretoria
                        da ACIST São Leopoldo, conforme estatuto social.
                      </p>
                      <p>
                        Declara conhecer e concordar com o Estatuto Social da ACIST São Leopoldo, comprometendo-se a cumprir todas
                        as disposições nele contidas.
                      </p>
                      <p>
                        O associado compromete-se ao pagamento regular da mensalidade, de acordo com a categoria selecionada, sendo
                        que o não pagamento por período superior a 90 dias poderá acarretar a suspensão dos direitos associativos.
                      </p>
                      <p>
                        A empresa autoriza a ACIST São Leopoldo a utilizar sua razão social e informações cadastrais para fins de
                        divulgação institucional e estatísticas, preservando sempre o sigilo das informações confidenciais.
                      </p>
                    </div>
                  </div>

                  <label className="flex items-start gap-3 p-4 bg-blue-50 border border-[#5DA5FF] rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-0.5 w-5 h-5 rounded border-gray-300 text-[#5DA5FF] focus:ring-[#5DA5FF]"
                      checked={data.aceitoTermos}
                      onChange={e => setData({ ...data, aceitoTermos: e.target.checked })}
                    />
                    <span className="text-[0.875rem]">
                      Li e aceito os termos de adesão da ACIST São Leopoldo <span className="text-red-600">*</span>
                    </span>
                  </label>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-[0.875rem] text-gray-600 mb-2">
                      📝 Assinatura Digital
                    </p>
                    <p className="text-[0.75rem] text-gray-500">
                      Após a conclusão do cadastro, você receberá um link para assinatura digital do termo de adesão
                      através de plataforma certificada (Clicksign/DocuSign).
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className={`flex ${currentStep === 1 ? 'justify-end' : 'justify-between'} mt-8 pt-6 border-t border-gray-200`}>
                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Voltar
                  </button>
                )}
                <button
                  onClick={() => {
                    if (currentStep === steps.length) {
                      // Salvar e redirecionar para login do associado
                      handleSave();
                      setTimeout(() => {
                        navigate('/login-associado?cadastro=sucesso');
                      }, 1000);
                    } else {
                      setCurrentStep(currentStep + 1);
                    }
                  }}
                  className="px-6 py-2.5 bg-[#5DA5FF] text-white rounded-lg hover:bg-[#226897] transition-colors"
                >
                  {currentStep === steps.length ? 'Finalizar Cadastro' : 'Próxima Etapa'}
                </button>
              </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-[0.875rem]">
              © 2026 ACIST São Leopoldo. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-gray-600 text-[0.875rem]">
              <a
                href="https://www.acistsl.com.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#5DA5FF] transition-colors underline decoration-transparent hover:decoration-[#5DA5FF]"
              >
                Sobre
              </a>
              <a
                href="https://wa.me/5551999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#5DA5FF] transition-colors underline decoration-transparent hover:decoration-[#5DA5FF]"
              >
                phone
              </a>
              <a
                href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#5DA5FF] transition-colors underline decoration-transparent hover:decoration-[#5DA5FF]"
              >
                Privacidade
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
