import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router';
import { Check, Building2, MapPin, Users, ClipboardCheck, FileText, CheckCircle, Save } from 'lucide-react';
import type { CadastroData } from '../types';

const steps = [
  { id: 1, name: 'Início', icon: Building2 },
  { id: 2, name: 'Empresa', icon: Building2 },
  { id: 3, name: 'Endereço', icon: MapPin },
  { id: 4, name: 'phones', icon: Users },
  { id: 5, name: 'Qualificação', icon: ClipboardCheck },
  { id: 6, name: 'Plano', icon: FileText }
];

export default function CadastroWizard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const origem = searchParams.get('origem');
  const campanha = searchParams.get('campanha');

  const [currentStep, setCurrentStep] = useState(1);
  const [saved, setSaved] = useState(false);
  const [data, setData] = useState<CadastroData>({
    empresa: { cnpjcpf: '' },
    address: {},
    phones: [],
    qualificacao: {}
  });

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate(`/admin/lead/${id}`);
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveAndExit = () => {
    handleSave();
    setTimeout(() => navigate('/admin/funil'), 1500);
  };

  const updateEmpresa = (field: string, value: string) => {
    setData({ ...data, empresa: { ...data.empresa, [field]: value } });
  };

  const updateaddress = (field: string, value: string) => {
    setData({ ...data, address: { ...data.address, [field]: value } });
  };

  const updateQualificacao = (field: string, value: string) => {
    setData({ ...data, qualificacao: { ...data.qualificacao, [field]: value } });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1>Cadastro de Associado</h1>
              <p className="text-muted-foreground mt-1">
                {origem && `Origem: ${origem}`}
                {campanha && ` • ${campanha}`}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saved ? 'Salvo!' : 'Salvar Rascunho'}
              </button>
              <button
                onClick={handleSaveAndExit}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Salvar e Sair
              </button>
            </div>
          </div>

          <nav>
            <ol className="flex items-center justify-between">
              {steps.map((step, index) => (
                <li key={step.id} className="flex items-center flex-1">
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    className="flex flex-col items-center gap-2 w-full"
                  >
                    <div className="flex items-center w-full">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                          currentStep > step.id
                            ? 'bg-primary border-primary text-primary-foreground'
                            : currentStep === step.id
                            ? 'border-primary text-primary bg-primary/10'
                            : 'border-border text-muted-foreground'
                        }`}
                      >
                        {currentStep > step.id ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <step.icon className="h-5 w-5" />
                        )}
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 mx-2 ${
                            currentStep > step.id ? 'bg-primary' : 'bg-border'
                          }`}
                        />
                      )}
                    </div>
                    <span
                      className={`text-[0.875rem] ${
                        currentStep === step.id ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {step.name}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-12">
        <div className="bg-card rounded-lg border border-border p-8">
          {currentStep === 1 && (
            <div>
              <h2 className="mb-6">Bem-vindo ao Cadastro da ACIST</h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-blue-900">Cadastro Progressivo</p>
                    <p className="text-blue-700 text-[0.875rem] mt-1">
                      Você pode preencher as informações em etapas e retomar quando quiser.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Save className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-blue-900">Salvamento Automático</p>
                    <p className="text-blue-700 text-[0.875rem] mt-1">
                      Suas informações são salvas automaticamente a cada alteração.
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground mb-8">
                Este processo levará aproximadamente 10 minutos. Você precisará dos seguintes documentos:
              </p>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Contrato Social
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Cartão cnpjcpf
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Comprovante de Endereço
                </li>
              </ul>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="mb-6">Dados da Empresa</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2">Razão Social</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={data.empresa.corporateName || ''}
                      onChange={e => updateEmpresa('corporateName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-2">name Fantasia</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={data.empresa.companyName || ''}
                      onChange={e => updateEmpresa('companyName', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2">cnpjcpf</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={data.empresa.cnpjcpf}
                      onChange={e => updateEmpresa('cnpjcpf', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Inscrição Estadual</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={data.empresa.stateRegistration || ''}
                      onChange={e => updateEmpresa('stateRegistration', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2">Ramo de Atividade</label>
                    <select
                      className="w-full px-4 py-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={data.empresa.establishmentType || ''}
                      onChange={e => updateEmpresa('establishmentType', e.target.value)}
                    >
                      <option value="">Selecione</option>
                      <option value="comercio">Comércio</option>
                      <option value="industria">Indústria</option>
                      <option value="servicos">Serviços</option>
                      <option value="tecnologia">Tecnologia</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2">Número de Funcionários</label>
                    <select
                      className="w-full px-4 py-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={data.empresa.employeesCount || ''}
                      onChange={e => updateEmpresa('employeesCount', e.target.value)}
                    >
                      <option value="">Selecione</option>
                      <option value="1-10">1-10</option>
                      <option value="11-50">11-50</option>
                      <option value="51-200">51-200</option>
                      <option value="200+">Mais de 200</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="mb-6">Endereço</h2>
              <div className="space-y-6">
                <div>
                  <label className="block mb-2">zipCode</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={data.address.zipCode || ''}
                    onChange={e => updateaddress('zipCode', e.target.value)}
                    placeholder="00000-000"
                  />
                </div>
                <div>
                  <label className="block mb-2">Logradouro</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={data.address.logradouro || ''}
                    onChange={e => updateaddress('logradouro', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <label className="block mb-2">Número</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={data.address.numero || ''}
                      onChange={e => updateaddress('numero', e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block mb-2">Complemento</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={data.address.complemento || ''}
                      onChange={e => updateaddress('complemento', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2">city</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={data.address.city || ''}
                      onChange={e => updateaddress('city', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-2">state</label>
                    <select
                      className="w-full px-4 py-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={data.address.state || ''}
                      onChange={e => updateaddress('state', e.target.value)}
                    >
                      <option value="">Selecione</option>
                      <option value="RS">RS</option>
                      <option value="SC">SC</option>
                      <option value="PR">PR</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h2 className="mb-6">phones</h2>
              <p className="text-muted-foreground mb-6">
                Adicione os principais phones da empresa para diferentes áreas.
              </p>
              <div className="space-y-6">
                {['Financeiro', 'Comercial', 'RH'].map(funcao => (
                  <div key={funcao} className="p-6 border border-border rounded-lg">
                    <h4 className="mb-4">{funcao}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-[0.875rem]">name</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-[0.875rem]">Email</label>
                        <input
                          type="email"
                          className="w-full px-3 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div>
              <h2 className="mb-6">Qualificação</h2>
              <div className="space-y-6">
                <div>
                  <label className="block mb-2">Faturamento Anual Estimado</label>
                  <select
                    className="w-full px-4 py-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={data.qualificacao.faturamentoAnual || ''}
                    onChange={e => updateQualificacao('faturamentoAnual', e.target.value)}
                  >
                    <option value="">Selecione</option>
                    <option value="ate-500k">Até R$ 500 mil</option>
                    <option value="500k-2m">R$ 500 mil - R$ 2 milhões</option>
                    <option value="2m-10m">R$ 2 milhões - R$ 10 milhões</option>
                    <option value="acima-10m">Acima de R$ 10 milhões</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Principal Interesse em Associar-se</label>
                  <select
                    className="w-full px-4 py-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={data.qualificacao.interessePrincipal || ''}
                    onChange={e => updateQualificacao('interessePrincipal', e.target.value)}
                  >
                    <option value="">Selecione</option>
                    <option value="networking">Networking</option>
                    <option value="capacitacao">Capacitação</option>
                    <option value="representacao">Representação</option>
                    <option value="servicos">Serviços</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Como conheceu a ACIST?</label>
                  <select
                    className="w-full px-4 py-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={data.qualificacao.comoConcheceu || ''}
                    onChange={e => updateQualificacao('comoConcheceu', e.target.value)}
                  >
                    <option value="">Selecione</option>
                    <option value="indicacao">Indicação</option>
                    <option value="evento">Evento</option>
                    <option value="redes-sociais">Redes Sociais</option>
                    <option value="website">website</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div>
              <h2 className="mb-6">Escolha seu Plano</h2>
              <div className="grid grid-cols-3 gap-6 mb-8">
                {[
                  { name: 'Básico', valor: 'R$ 350/mês', features: ['Networking', 'Eventos'] },
                  { name: 'Plus', valor: 'R$ 650/mês', features: ['Networking', 'Eventos', 'Capacitação'] },
                  { name: 'Premium', valor: 'R$ 950/mês', features: ['Tudo incluso', 'Assessoria'] }
                ].map(plano => (
                  <div
                    key={plano.name}
                    className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                      data.plano === plano.name
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setData({ ...data, plano: plano.name })}
                  >
                    <h4 className="mb-2">{plano.name}</h4>
                    <p className="text-[1.5rem] mb-4">{plano.valor}</p>
                    <ul className="space-y-2">
                      {plano.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-[0.875rem] text-muted-foreground">
                          <Check className="h-4 w-4 text-primary" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-muted rounded-lg">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={data.aceiteTermos || false}
                    onChange={e => setData({ ...data, aceiteTermos: e.target.checked })}
                  />
                  <span className="text-[0.875rem]">
                    Aceito os termos e condições da ACIST São Leopoldo e autorizo o processamento dos meus dados.
                  </span>
                </label>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-8 border-t border-border">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Voltar
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              {currentStep === steps.length ? 'Finalizar' : 'Próxima Etapa'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
