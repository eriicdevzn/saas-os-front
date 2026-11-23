import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AcompanhamentoService } from '../../core/services/acompanhamento.service';
import { Acompanhamento as AcompanhamentoModel } from '../../core/models/acompanhamento.model';
import { Icon } from '../../shared/components/icon/icon';
import { StatusStepper } from '../../shared/components/status-stepper/status-stepper';

@Component({
  selector: 'app-acompanhamento',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, Icon, StatusStepper, DatePipe],
  templateUrl: './acompanhamento.html',
  styleUrl: './acompanhamento.scss',
})
export class Acompanhamento implements OnInit {
  private service = inject(AcompanhamentoService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  resultado = signal<AcompanhamentoModel | null>(null);
  carregando = signal(false);
  erro = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    codigo: ['', Validators.required],
  });

  ngOnInit(): void {
    const codigoNaUrl = this.route.snapshot.paramMap.get('codigo');
    if (codigoNaUrl) {
      this.form.patchValue({ codigo: codigoNaUrl });
      this.buscar();
    }
  }

  buscar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const codigo = this.form.getRawValue().codigo.trim();
    this.carregando.set(true);
    this.erro.set(null);
    this.resultado.set(null);

    this.service.buscar(codigo).subscribe({
      next: (resultado) => {
        this.carregando.set(false);
        this.resultado.set(resultado);
      },
      error: () => {
        this.carregando.set(false);
        this.erro.set('Não encontramos nenhum atendimento com esse código. Confira e tente novamente.');
      },
    });
  }

  novaBusca(): void {
    this.resultado.set(null);
    this.erro.set(null);
    this.form.reset({ codigo: '' });
  }
}
