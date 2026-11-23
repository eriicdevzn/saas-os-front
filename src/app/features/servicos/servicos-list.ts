import { DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServicoService } from '../../core/services/servico.service';
import { Servico } from '../../core/models/servico.model';
import { Icon } from '../../shared/components/icon/icon';
import { CurrencyInputDirective } from '../../shared/directives/currency-input.directive';

@Component({
  selector: 'app-servicos-list',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe, Icon, CurrencyInputDirective],
  templateUrl: './servicos-list.html',
  styleUrl: '../clientes/clientes-list.scss',
})
export class ServicosList implements OnInit {
  private service = inject(ServicoService);
  private fb = inject(FormBuilder);

  servicos = signal<Servico[]>([]);
  mostrarForm = signal(false);

  form = this.fb.nonNullable.group({
    nome: ['', Validators.required],
    descricao: [''],
    valorPadrao: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.service.listar().subscribe((servicos) => this.servicos.set(servicos));
  }

  campoInvalido(campo: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[campo];
    return c.touched && c.invalid;
  }

  novo(): void {
    this.form.reset({ nome: '', descricao: '', valorPadrao: 0 });
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

  inativar(servico: Servico): void {
    this.service.inativar(servico.id).subscribe(() => this.carregar());
  }
}
