export type LeadStatus =
  | 'leads'
  | 'em-contato'
  | 'cadastro-iniciado'
  | 'documentacao'
  | 'validacao'
  | 'aprovado';

export type DocumentStatus =
  | 'pendente'
  | 'enviado'
  | 'aprovado'
  | 'rejeitado';

export type TaskStatus = 'pending' | 'completed';

export interface Lead {
  id: string;
  empresaNome: string;
  cnpj: string;
  email: string;
  telefone: string;
  origem: string;
  campanha?: string;
  status: LeadStatus;
  responsavel?: string;
  createdAt: Date;
  updatedAt: Date;
  progresso: number;
}

export interface Contato {
  id: string;
  leadId: string;
  nome: string;
  email: string;
  telefone: string;
  cargo?: string;
  funcao: 'financeiro' | 'comercial' | 'rh' | 'outros';
}

export interface Documento {
  id: string;
  leadId: string;
  nome: string;
  tipo: string;
  status: DocumentStatus;
  url?: string;
  uploadedAt?: Date;
  versao: number;
  observacao?: string;
}

export interface Task {
  id: string;
  leadId: string;
  titulo: string;
  descricao?: string;
  responsavel: string;
  status: TaskStatus;
  dataVencimento?: Date;
  createdAt: Date;
}

export interface HistoricoItem {
  id: string;
  leadId: string;
  tipo: 'acao' | 'status' | 'documento' | 'comentario';
  descricao: string;
  usuario: string;
  data: Date;
}

export interface CadastroData {
  empresa: {
    razaoSocial?: string;
    nomeFantasia?: string;
    cnpj: string;
    inscricaoEstadual?: string;
    dataFundacao?: string;
    ramoAtividade?: string;
    numeroFuncionarios?: string;
  };
  endereco: {
    cep?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
  };
  contatos: Contato[];
  qualificacao: {
    faturamentoAnual?: string;
    interessePrincipal?: string;
    comoConcheceu?: string;
  };
  plano?: string;
  aceiteTermos?: boolean;
}
