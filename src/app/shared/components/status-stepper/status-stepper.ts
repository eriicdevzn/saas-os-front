import { Component, Input, computed, signal } from '@angular/core';
import { StatusOrdemServico } from '../../../core/models/ordem-servico.model';
import { FLUXO_PRINCIPAL_OS, STATUS_OS_LABEL } from '../../utils/status-os.util';

/** Estágios que não estão na sequência feliz, mapeados para a posição visual mais próxima. */
const POSICAO_EQUIVALENTE: Partial<Record<StatusOrdemServico, StatusOrdemServico>> = {
  EM_DESLOCAMENTO: 'AGENDADA',
  PAUSADA: 'EM_ATENDIMENTO',
  AGUARDANDO_PECA: 'EM_ATENDIMENTO',
  AGUARDANDO_CLIENTE: 'EM_ATENDIMENTO',
};

@Component({
  selector: 'app-status-stepper',
  standalone: true,
  templateUrl: './status-stepper.html',
  styleUrl: './status-stepper.scss',
})
export class StatusStepper {
  private statusSignal = signal<StatusOrdemServico>('RASCUNHO');

  @Input({ required: true }) set status(value: StatusOrdemServico) {
    this.statusSignal.set(value);
  }

  statusLabel = STATUS_OS_LABEL;
  etapas = FLUXO_PRINCIPAL_OS;

  cancelada = computed(() => this.statusSignal() === 'CANCELADA');

  etapaAtualIndex = computed(() => {
    if (this.cancelada()) return -1;
    const status = this.statusSignal();
    const equivalente = POSICAO_EQUIVALENTE[status] ?? status;
    return this.etapas.indexOf(equivalente);
  });

  rotuloSituacaoEspecial = computed(() => {
    const status = this.statusSignal();
    return POSICAO_EQUIVALENTE[status] ? this.statusLabel[status] : null;
  });
}
