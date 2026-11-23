import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrdemServicoService } from '../../core/services/ordem-servico.service';
import { ServicoService } from '../../core/services/servico.service';
import { ClienteService } from '../../core/services/cliente.service';
import { OrdemServico, StatusOrdemServico, TRANSICOES_STATUS } from '../../core/models/ordem-servico.model';
import { Servico } from '../../core/models/servico.model';
import { Cliente } from '../../core/models/cliente.model';
import { Icon } from '../../shared/components/icon/icon';
import { StatusStepper } from '../../shared/components/status-stepper/status-stepper';
import { CurrencyInputDirective } from '../../shared/directives/currency-input.directive';
import { STATUS_OS_LABEL } from '../../shared/utils/status-os.util';

@Component({
  selector: 'app-ordem-servico-detail',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, DecimalPipe, Icon, CurrencyInputDirective, StatusStepper],
  templateUrl: './ordem-servico-detail.html',
  styleUrl: './ordem-servico-detail.scss',
})
export class OrdemServicoDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private ordemServicoService = inject(OrdemServicoService);
  private servicoService = inject(ServicoService);
  private clienteService = inject(ClienteService);
  private fb = inject(FormBuilder);

  statusLabel = STATUS_OS_LABEL;

  os = signal<OrdemServico | null>(null);
  clientes = signal<Cliente[]>([]);
  servicosDisponiveis = signal<Servico[]>([]);
  mostrarFormItem = signal(false);
  linkCopiado = signal(false);

  proximosStatus = computed<StatusOrdemServico[]>(() => {
    const atual = this.os()?.status;
    return atual ? TRANSICOES_STATUS[atual] : [];
  });

  proximosStatusPrincipais = computed(() =>
    this.proximosStatus().filter((s) => s !== 'CANCELADA')
  );

  podeCancel = computed(() => this.proximosStatus().includes('CANCELADA'));

  formItem = this.fb.nonNullable.group({
    servicoId: [0],
    descricao: ['', Validators.required],
    quantidade: [1, [Validators.required, Validators.min(0.01)]],
    valorUnitario: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.carregar(id);
    this.servicoService.listar().subscribe((servicos) => this.servicosDisponiveis.set(servicos));
    this.clienteService.listar().subscribe((clientes) => this.clientes.set(clientes));
  }

  carregar(id: number): void {
    this.ordemServicoService.buscar(id).subscribe((os) => this.os.set(os));
  }

  nomeCliente(clienteId: number | undefined): string {
    if (!clienteId) return '—';
    return this.clientes().find((c) => c.id === clienteId)?.nome ?? `Cliente #${clienteId}`;
  }

  alterarStatus(novoStatus: StatusOrdemServico): void {
    const atual = this.os();
    if (!atual) return;
    this.ordemServicoService.alterarStatus(atual.id, novoStatus).subscribe((os) => this.os.set(os));
  }

  copiarLinkAcompanhamento(codigo: string): void {
    const link = `${window.location.origin}/acompanhar/${codigo}`;
    navigator.clipboard.writeText(link).then(() => {
      this.linkCopiado.set(true);
      setTimeout(() => this.linkCopiado.set(false), 2000);
    });
  }

  abrirFormItem(): void {
    this.formItem.reset({ servicoId: 0, descricao: '', quantidade: 1, valorUnitario: 0 });
    this.mostrarFormItem.set(true);
  }

  cancelarItem(): void {
    this.mostrarFormItem.set(false);
  }

  salvarItem(): void {
    const atual = this.os();
    if (!atual || this.formItem.invalid) {
      this.formItem.markAllAsTouched();
      return;
    }

    const { servicoId, descricao, quantidade, valorUnitario } = this.formItem.getRawValue();
    this.ordemServicoService
      .adicionarItem(atual.id, {
        servicoId: servicoId || undefined,
        descricao,
        quantidade,
        valorUnitario,
      })
      .subscribe((os) => {
        this.os.set(os);
        this.mostrarFormItem.set(false);
      });
  }

  selecionarServico(): void {
    const servicoId = this.formItem.controls.servicoId.value;
    const servico = this.servicosDisponiveis().find((s) => s.id === Number(servicoId));
    if (servico) {
      this.formItem.patchValue({
        descricao: servico.nome,
        valorUnitario: servico.valorPadrao,
      });
    }
  }
}
