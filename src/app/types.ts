export type LeadStatus =
  | 'leads'
  | 'em-phone'
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
  companyName: string;
  cnpjcpf: string;
  email: string;
  phone: string;
  origem: string;
  campanha?: string;
  status: LeadStatus;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  progresso: number;
}

export interface phone {
  id: string;
  leadId: string;
  name: string;
  email: string;
  phone: string;
  cargo?: string;
  funcao: 'financeiro' | 'comercial' | 'rh' | 'other';
}

export interface Documento {
  id: string;
  leadId: string;
  name: string;
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
  title: string;
  description?: string;
  assignedTo: string;
  status: TaskStatus;
  dueDate?: Date;
  createdAt: Date;
}

export interface HistoricoItem {
  id: string;
  leadId: string;
  tipo: 'acao' | 'status' | 'documento' | 'comentario';
  description: string;
  usuario: string;
  data: Date;
}

export interface CadastroData {
  empresa: {
    corporateName?: string;
    companyName?: string;
    cnpjcpf: string;
    stateRegistration?: string;
    foundationDate?: string;
    establishmentType?: string;
    employeesCount?: string;
  };
  address: {
    zipCode?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
  };
  phones: phone[];
  qualificacao: {
    faturamentoAnual?: string;
    interessePrincipal?: string;
    comoConcheceu?: string;
  };
  plano?: string;
  aceiteTermos?: boolean;
}
