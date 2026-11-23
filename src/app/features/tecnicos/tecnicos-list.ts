import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TecnicoService } from '../../core/services/tecnico.service';
import { Tecnico } from '../../core/models/tecnico.model';
import { Icon } from '../../shared/components/icon/icon';
import { PhoneMaskDirective } from '../../shared/directives/phone-mask.directive';

@Component({
  selector: 'app-tecnicos-list',
  standalone: true,
  imports: [ReactiveFormsModule, Icon, PhoneMaskDirective],
  templateUrl: './tecnicos-list.html',
  styleUrl: '../clientes/clientes-list.scss',
})
export class TecnicosList implements OnInit {
  private service = inject(TecnicoService);
  private fb = inject(FormBuilder);

  tecnicos = signal<Tecnico[]>([]);
  mostrarForm = signal(false);

  form = this.fb.nonNullable.group({
    nome: ['', Validators.required],
    telefone: [''],
    especialidade: [''],
  });

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.service.listar().subscribe((tecnicos) => this.tecnicos.set(tecnicos));
  }

  campoInvalido(campo: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[campo];
    return c.touched && c.invalid;
  }

  novo(): void {
    this.form.reset({ nome: '', telefone: '', especialidade: '' });
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

  inativar(tecnico: Tecnico): void {
    this.service.inativar(tecnico.id).subscribe(() => this.carregar());
  }
}
