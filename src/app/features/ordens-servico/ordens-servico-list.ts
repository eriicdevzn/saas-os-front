import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClienteService } from '../../core/services/cliente.service';
import { OrdemServicoService } from '../../core/services/ordem-servico.service';
import { Cliente } from '../../core/models/cliente.model';
import { OrdemServico } from '../../core/models/ordem-servico.model';
import { Icon } from '../../shared/components/icon/icon';
import { STATUS_OS_LABEL } from '../../shared/utils/status-os.util';

@Component({
  selector: 'app-ordens-servico-list',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, DatePipe, DecimalPipe, Icon],
  templateUrl: './ordens-servico-list.html',
  styleUrl: './ordens-servico-list.scss',
})
export class OrdensServicoList implements OnInit {
  private ordemServicoService = inject(OrdemServicoService);
  private clienteService = inject(ClienteService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  statusLabel = STATUS_OS_LABEL;

  ordens = signal<OrdemServico[]>([]);
  clientes = signal<Cliente[]>([]);
  mostrarForm = signal(false);
  termoBusca = signal('');

  ordensFiltradas = computed(() => {
    const termo = this.termoBusca().trim().toLowerCase();
    if (!termo) return this.ordens();
    return this.ordens().filter((os) =>
      os.numero.toLowerCase().includes(termo) ||
      os.titulo.toLowerCase().includes(termo) ||
      this.nomeCliente(os.clienteId).toLowerCase().includes(termo)
    );
  });

  form = this.fb.nonNullable.group({
    clienteId: [0, [Validators.required, Validators.min(1)]],
    titulo: ['', Validators.required],
    descricaoProblema: [''],
  });

  ngOnInit(): void {
    this.carregar();
    this.clienteService.listar().subscribe((clientes) => this.clientes.set(clientes));
  }

  carregar(): void {
    this.ordemServicoService.listar().subscribe((ordens) => this.ordens.set(ordens));
  }

  campoInvalido(campo: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[campo];
    return c.touched && c.invalid;
  }

  novaOs(): void {
    this.form.reset({ clienteId: 0, titulo: '', descricaoProblema: '' });
    this.mostrarForm.set(true);
  }

  cancelar(): void {
    this.mostrarForm.set(false);
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { clienteId, titulo, descricaoProblema } = this.form.getRawValue();
    this.ordemServicoService.criar({ clienteId, titulo, descricaoProblema }).subscribe((os) => {
      this.mostrarForm.set(false);
      this.router.navigate(['/ordens-servico', os.id]);
    });
  }

  nomeCliente(clienteId: number): string {
    return this.clientes().find((c) => c.id === clienteId)?.nome ?? `#${clienteId}`;
  }
}
