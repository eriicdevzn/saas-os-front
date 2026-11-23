export type StatusOrdemServico =
  | 'RASCUNHO'
  | 'AGUARDANDO_APROVACAO'
  | 'APROVADA'
  | 'AGENDADA'
  | 'EM_DESLOCAMENTO'
  | 'EM_ATENDIMENTO'
  | 'PAUSADA'
  | 'AGUARDANDO_PECA'
  | 'AGUARDANDO_CLIENTE'
  | 'CONCLUIDA'
  | 'CANCELADA';

export type Prioridade = 'BAIXA' | 'NORMAL' | 'ALTA' | 'URGENTE';

export interface OrdemServicoItem {
  id: number;
  servicoId?: number;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

export interface OrdemServico {
  id: number;
  numero: string;
  codigoPublico?: string;
  clienteId: number;
  tecnicoResponsavelId?: number;
  status: StatusOrdemServico;
  prioridade: Prioridade;
  titulo: string;
  descricaoProblema?: string;
  diagnostico?: string;
  solucaoExecutada?: string;
  dataAbertura: string;
  dataAgendada?: string;
  dataInicio?: string;
  dataConclusao?: string;
  valorServicos: number;
  valorProdutos: number;
  desconto: number;
  valorTotal: number;
  itens: OrdemServicoItem[];
}

export interface OrdemServicoRequest {
  clienteId: number;
  tecnicoResponsavelId?: number;
  titulo: string;
  descricaoProblema?: string;
  prioridade?: Prioridade;
  dataAgendada?: string;
}

export interface OrdemServicoItemRequest {
  servicoId?: number;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
}

/** Transicoes de status permitidas (espelha OrdemServicoService.java no backend). */
export const TRANSICOES_STATUS: Record<StatusOrdemServico, StatusOrdemServico[]> = {
  RASCUNHO: ['AGUARDANDO_APROVACAO', 'CANCELADA'],
  AGUARDANDO_APROVACAO: ['APROVADA', 'CANCELADA'],
  APROVADA: ['AGENDADA', 'CANCELADA'],
  AGENDADA: ['EM_DESLOCAMENTO', 'EM_ATENDIMENTO', 'CANCELADA'],
  EM_DESLOCAMENTO: ['EM_ATENDIMENTO', 'CANCELADA'],
  EM_ATENDIMENTO: ['PAUSADA', 'AGUARDANDO_PECA', 'AGUARDANDO_CLIENTE', 'CONCLUIDA', 'CANCELADA'],
  PAUSADA: ['EM_ATENDIMENTO', 'CANCELADA'],
  AGUARDANDO_PECA: ['EM_ATENDIMENTO', 'CANCELADA'],
  AGUARDANDO_CLIENTE: ['EM_ATENDIMENTO', 'CANCELADA'],
  CONCLUIDA: [],
  CANCELADA: [],
};
