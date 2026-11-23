import { StatusOrdemServico } from './ordem-servico.model';

export interface EventoHistorico {
  status: StatusOrdemServico;
  dataAlteracao: string;
}

export interface Acompanhamento {
  numero: string;
  titulo: string;
  status: StatusOrdemServico;
  nomeCliente: string;
  nomeTecnico?: string;
  dataAbertura: string;
  dataAgendada?: string;
  dataConclusao?: string;
  historico: EventoHistorico[];
}
