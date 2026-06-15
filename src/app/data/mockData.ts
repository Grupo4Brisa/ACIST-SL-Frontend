import { Lead, Contato, Documento, Task, HistoricoItem } from '../types';

export const mockLeads: Lead[] = [
  {
    id: '1',
    empresaNome: 'Tech Solutions LTDA',
    cnpj: '12.345.678/0001-90',
    email: 'contato@techsolutions.com.br',
    telefone: '(51) 98765-4321',
    origem: 'QR Code - Evento Tech',
    campanha: 'Campanha Tecnologia 2026',
    status: 'leads',
    responsavel: 'Ana Silva',
    createdAt: new Date('2026-04-10'),
    updatedAt: new Date('2026-04-10'),
    progresso: 10
  },
  {
    id: '2',
    empresaNome: 'Indústria Metal S.A.',
    cnpj: '23.456.789/0001-01',
    email: 'metal@industriametal.com.br',
    telefone: '(51) 3333-4444',
    origem: 'Site - Formulário',
    status: 'em-contato',
    responsavel: 'Carlos Santos',
    createdAt: new Date('2026-04-08'),
    updatedAt: new Date('2026-04-11'),
    progresso: 25
  },
  {
    id: '3',
    empresaNome: 'Comércio Varejo ME',
    cnpj: '34.567.890/0001-12',
    email: 'contato@comerciovarejo.com.br',
    telefone: '(51) 99999-8888',
    origem: 'Indicação',
    status: 'cadastro-iniciado',
    responsavel: 'Ana Silva',
    createdAt: new Date('2026-04-05'),
    updatedAt: new Date('2026-04-12'),
    progresso: 50
  },
  {
    id: '4',
    empresaNome: 'Serviços Profissionais LTDA',
    cnpj: '45.678.901/0001-23',
    email: 'admin@servicospro.com.br',
    telefone: '(51) 97777-6666',
    origem: 'WhatsApp Business',
    status: 'documentacao',
    responsavel: 'Carlos Santos',
    createdAt: new Date('2026-04-01'),
    updatedAt: new Date('2026-04-10'),
    progresso: 70
  },
  {
    id: '5',
    empresaNome: 'Transportadora Express',
    cnpj: '56.789.012/0001-34',
    email: 'contato@transportadora.com.br',
    telefone: '(51) 96666-5555',
    origem: 'LinkedIn Ads',
    status: 'validacao',
    responsavel: 'Ana Silva',
    createdAt: new Date('2026-03-28'),
    updatedAt: new Date('2026-04-11'),
    progresso: 90
  },
  {
    id: '6',
    empresaNome: 'Alimentação Saudável',
    cnpj: '67.890.123/0001-45',
    email: 'contato@alimentacaosaudavel.com.br',
    telefone: '(51) 95555-4444',
    origem: 'Google Ads',
    status: 'aprovado',
    responsavel: 'Carlos Santos',
    createdAt: new Date('2026-03-20'),
    updatedAt: new Date('2026-04-05'),
    progresso: 100
  }
];

export const mockContatos: Contato[] = [
  {
    id: '1',
    leadId: '3',
    nome: 'João Pedro',
    email: 'joao@comerciovarejo.com.br',
    telefone: '(51) 99999-8888',
    cargo: 'Diretor Comercial',
    funcao: 'comercial'
  },
  {
    id: '2',
    leadId: '3',
    nome: 'Maria Fernanda',
    email: 'maria@comerciovarejo.com.br',
    telefone: '(51) 98888-7777',
    cargo: 'Gerente Financeiro',
    funcao: 'financeiro'
  }
];

export const mockDocumentos: Documento[] = [
  {
    id: '1',
    leadId: '4',
    nome: 'Contrato Social',
    tipo: 'PDF',
    status: 'aprovado',
    uploadedAt: new Date('2026-04-08'),
    versao: 1
  },
  {
    id: '2',
    leadId: '4',
    nome: 'Cartão CNPJ',
    tipo: 'PDF',
    status: 'aprovado',
    uploadedAt: new Date('2026-04-08'),
    versao: 1
  },
  {
    id: '3',
    leadId: '4',
    nome: 'Comprovante de Endereço',
    tipo: 'PDF',
    status: 'enviado',
    uploadedAt: new Date('2026-04-09'),
    versao: 1
  },
  {
    id: '4',
    leadId: '3',
    nome: 'Contrato Social',
    tipo: 'PDF',
    status: 'pendente',
    versao: 0
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    leadId: '2',
    titulo: 'Ligar para agendar reunião',
    descricao: 'Fazer contato inicial e apresentar os benefícios',
    responsavel: 'Carlos Santos',
    status: 'pending',
    dataVencimento: new Date('2026-04-13'),
    createdAt: new Date('2026-04-11')
  },
  {
    id: '2',
    leadId: '4',
    titulo: 'Validar documentação enviada',
    descricao: 'Verificar autenticidade dos documentos',
    responsavel: 'Ana Silva',
    status: 'pending',
    dataVencimento: new Date('2026-04-12'),
    createdAt: new Date('2026-04-10')
  },
  {
    id: '3',
    leadId: '5',
    titulo: 'Aprovação final da diretoria',
    responsavel: 'Carlos Santos',
    status: 'pending',
    dataVencimento: new Date('2026-04-14'),
    createdAt: new Date('2026-04-11')
  }
];

export const mockHistorico: HistoricoItem[] = [
  {
    id: '1',
    leadId: '3',
    tipo: 'acao',
    descricao: 'Lead criado via formulário do site',
    usuario: 'Sistema',
    data: new Date('2026-04-05T10:30:00')
  },
  {
    id: '2',
    leadId: '3',
    tipo: 'status',
    descricao: 'Status alterado para "Em contato"',
    usuario: 'Ana Silva',
    data: new Date('2026-04-06T14:20:00')
  },
  {
    id: '3',
    leadId: '3',
    tipo: 'comentario',
    descricao: 'Primeira reunião realizada. Cliente demonstrou interesse.',
    usuario: 'Ana Silva',
    data: new Date('2026-04-07T16:45:00')
  },
  {
    id: '4',
    leadId: '3',
    tipo: 'status',
    descricao: 'Status alterado para "Cadastro iniciado"',
    usuario: 'Ana Silva',
    data: new Date('2026-04-08T09:15:00')
  },
  {
    id: '5',
    leadId: '3',
    tipo: 'acao',
    descricao: 'Cliente iniciou preenchimento do cadastro progressivo',
    usuario: 'João Pedro',
    data: new Date('2026-04-08T10:00:00')
  }
];

export const statusLabels: Record<string, string> = {
  'leads': 'Leads',
  'em-contato': 'Em Contato',
  'cadastro-iniciado': 'Cadastro Iniciado',
  'documentacao': 'Documentação',
  'validacao': 'Validação',
  'aprovado': 'Aprovado'
};
