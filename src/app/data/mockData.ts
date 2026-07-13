import type {
  Lead,
  phone,
  Documento,
  Task,
  HistoricoItem
} from '../types';

export const mockLeads: Lead[] = [
  {
    id: '1',
    empresaname: 'Tech Solutions LTDA',
    cnpj: '12.345.678/0001-90',
    email: 'phone@techsolutions.com.br',
    phone: '(51) 98765-4321',
    origem: 'QR Code - Evento Tech',
    campanha: 'Campanha Tecnologia 2026',
    status: 'leads',
    assignedTo: 'Ana Silva',
    createdAt: new Date('2026-04-10'),
    updatedAt: new Date('2026-04-10'),
    progresso: 10
  },
  {
    id: '2',
    empresaname: 'Indústria Metal S.A.',
    cnpj: '23.456.789/0001-01',
    email: 'metal@industriametal.com.br',
    phone: '(51) 3333-4444',
    origem: 'website - Formulário',
    status: 'em-phone',
    assignedTo: 'Carlos Santos',
    createdAt: new Date('2026-04-08'),
    updatedAt: new Date('2026-04-11'),
    progresso: 25
  },
  {
    id: '3',
    empresaname: 'Comércio Varejo ME',
    cnpj: '34.567.890/0001-12',
    email: 'phone@comerciovarejo.com.br',
    phone: '(51) 99999-8888',
    origem: 'Indicação',
    status: 'cadastro-iniciado',
    assignedTo: 'Ana Silva',
    createdAt: new Date('2026-04-05'),
    updatedAt: new Date('2026-04-12'),
    progresso: 50
  },
  {
    id: '4',
    empresaname: 'Serviços Profissionais LTDA',
    cnpj: '45.678.901/0001-23',
    email: 'admin@servicospro.com.br',
    phone: '(51) 97777-6666',
    origem: 'WhatsApp Business',
    status: 'documentacao',
    assignedTo: 'Carlos Santos',
    createdAt: new Date('2026-04-01'),
    updatedAt: new Date('2026-04-10'),
    progresso: 70
  },
  {
    id: '5',
    empresaname: 'Transportadora Express',
    cnpj: '56.789.012/0001-34',
    email: 'phone@transportadora.com.br',
    phone: '(51) 96666-5555',
    origem: 'LinkedIn Ads',
    status: 'validacao',
    assignedTo: 'Ana Silva',
    createdAt: new Date('2026-03-28'),
    updatedAt: new Date('2026-04-11'),
    progresso: 90
  },
  {
    id: '6',
    empresaname: 'Alimentação Saudável',
    cnpj: '67.890.123/0001-45',
    email: 'phone@alimentacaosaudavel.com.br',
    phone: '(51) 95555-4444',
    origem: 'Google Ads',
    status: 'aprovado',
    assignedTo: 'Carlos Santos',
    createdAt: new Date('2026-03-20'),
    updatedAt: new Date('2026-04-05'),
    progresso: 100
  }
];

export const mockphones: phone[] = [
  {
    id: '1',
    leadId: '3',
    name: 'João Pedro',
    email: 'joao@comerciovarejo.com.br',
    phone: '(51) 99999-8888',
    cargo: 'Diretor Comercial',
    funcao: 'comercial'
  },
  {
    id: '2',
    leadId: '3',
    name: 'Maria Fernanda',
    email: 'maria@comerciovarejo.com.br',
    phone: '(51) 98888-7777',
    cargo: 'Gerente Financeiro',
    funcao: 'financeiro'
  }
];

export const mockDocumentos: Documento[] = [
  {
    id: '1',
    leadId: '4',
    name: 'Contrato Social',
    tipo: 'PDF',
    status: 'aprovado',
    uploadedAt: new Date('2026-04-08'),
    versao: 1
  },
  {
    id: '2',
    leadId: '4',
    name: 'Cartão CNPJ',
    tipo: 'PDF',
    status: 'aprovado',
    uploadedAt: new Date('2026-04-08'),
    versao: 1
  },
  {
    id: '3',
    leadId: '4',
    name: 'Comprovante de Endereço',
    tipo: 'PDF',
    status: 'enviado',
    uploadedAt: new Date('2026-04-09'),
    versao: 1
  },
  {
    id: '4',
    leadId: '3',
    name: 'Contrato Social',
    tipo: 'PDF',
    status: 'pendente',
    versao: 0
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    leadId: '2',
    title: 'Ligar para agendar reunião',
    description: 'Fazer phone inicial e apresentar os benefícios',
    assignedTo: 'Carlos Santos',
    status: 'pending',
    dueDate: new Date('2026-04-13'),
    createdAt: new Date('2026-04-11')
  },
  {
    id: '2',
    leadId: '4',
    title: 'Validar documentação enviada',
    description: 'Verificar autenticity dos documentos',
    assignedTo: 'Ana Silva',
    status: 'pending',
    dueDate: new Date('2026-04-12'),
    createdAt: new Date('2026-04-10')
  },
  {
    id: '3',
    leadId: '5',
    title: 'Aprovação final da diretoria',
    assignedTo: 'Carlos Santos',
    status: 'pending',
    dueDate: new Date('2026-04-14'),
    createdAt: new Date('2026-04-11')
  }
];

export const mockHistorico: HistoricoItem[] = [
  {
    id: '1',
    leadId: '3',
    tipo: 'acao',
    description: 'Lead criado via formulário do website',
    usuario: 'Sistema',
    data: new Date('2026-04-05T10:30:00')
  },
  {
    id: '2',
    leadId: '3',
    tipo: 'status',
    description: 'Status alterado para "Em phone"',
    usuario: 'Ana Silva',
    data: new Date('2026-04-06T14:20:00')
  },
  {
    id: '3',
    leadId: '3',
    tipo: 'comentario',
    description: 'Primeira reunião realizada. Cliente demonstrou interesse.',
    usuario: 'Ana Silva',
    data: new Date('2026-04-07T16:45:00')
  },
  {
    id: '4',
    leadId: '3',
    tipo: 'status',
    description: 'Status alterado para "Cadastro iniciado"',
    usuario: 'Ana Silva',
    data: new Date('2026-04-08T09:15:00')
  },
  {
    id: '5',
    leadId: '3',
    tipo: 'acao',
    description: 'Cliente iniciou preenchimento do cadastro progressivo',
    usuario: 'João Pedro',
    data: new Date('2026-04-08T10:00:00')
  }
];

export const statusLabels: Record<string, string> = {
  'leads': 'Leads',
  'em-phone': 'Em phone',
  'cadastro-iniciado': 'Cadastro Iniciado',
  'documentacao': 'Documentação',
  'validacao': 'Validação',
  'aprovado': 'Aprovado'
};
