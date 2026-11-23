import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClienteService } from '../../core/services/cliente.service';
import { Cliente } from '../../core/models/cliente.model';
import { Icon } from '../../shared/components/icon/icon';
import { PhoneMaskDirective } from '../../shared/directives/phone-mask.directive';

@Component({
  selector: 'app-clientes-list',
  standalone: true,
  imports: [ReactiveFormsModule, Icon, PhoneMaskDirective],
  templateUrl: './clientes-list.html',
  styleUrl: './clientes-list.scss',
})
export class ClientesList implements OnInit {
  private service = inject(ClienteService);
  private fb = inject(FormBuilder);

  clientes = signal<Cliente[]>([]);
  mostrarForm = signal(false);
  termoBusca = signal('');

  clientesFiltrados = computed(() => {
    const termo = this.termoBusca().trim().toLowerCase();
    if (!termo) return this.clientes();
    return this.clientes().filter((c) =>
      c.nome.toLowerCase().includes(termo) || (c.documento ?? '').includes(termo)
    );
  });

  form = this.fb.nonNullable.group({
    nome: ['', Validators.required],
    documento: [''],
    telefone: [''],
    email: ['', Validators.email],
    endereco: [''],
    cidade: [''],
    uf: [''],
  });

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.service.listar().subscribe((clientes) => this.clientes.set(clientes));
  }

  campoInvalido(campo: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[campo];
    return c.touched && c.invalid;
  }

  campoValido(campo: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[campo];
    return c.touched && c.valid && !!c.value;
  }

  novoCliente(): void {
    this.form.reset({ nome: '', documento: '', telefone: '', email: '', endereco: '', cidade: '', uf: '' });
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

    this.service.criar(this.form.getRawValue()).subscribe(() => {
      this.mostrarForm.set(false);
      this.carregar();
    });
  }

  inativar(cliente: Cliente): void {
    this.service.inativar(cliente.id).subscribe(() => this.carregar());
  }
}
