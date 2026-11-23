import { StatusOrdemServico } from '../../core/models/ordem-servico.model';

/** Rótulo amigável e cor de cada status da OS, usados em toda a aplicação. */
export const STATUS_OS_LABEL: Record<StatusOrdemServico, string> = {
  RASCUNHO: 'Rascunho',
  AGUARDANDO_APROVACAO: 'Aguard. aprovação',
  APROVADA: 'Aprovada',
  AGENDADA: 'Agendada',
  EM_DESLOCAMENTO: 'Em deslocamento',
  EM_ATENDIMENTO: 'Em atendimento',
  PAUSADA: 'Pausada',
  AGUARDANDO_PECA: 'Aguard. peça',
  AGUARDANDO_CLIENTE: 'Aguard. cliente',
  CONCLUIDA: 'Concluída',
  CANCELADA: 'Cancelada',
};

/** Sequência "feliz" da OS, usada para desenhar a linha do tempo (etapas fora dela são tratadas à parte). */
export const FLUXO_PRINCIPAL_OS: StatusOrdemServico[] = [
  'RASCUNHO',
  'AGUARDANDO_APROVACAO',
  'APROVADA',
  'AGENDADA',
  'EM_ATENDIMENTO',
  'CONCLUIDA',
];
