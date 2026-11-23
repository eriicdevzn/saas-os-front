import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario.service';
import { AuthService } from '../../core/services/auth.service';
import { Usuario } from '../../core/models/usuario.model';
import { Perfil } from '../../core/models/auth.model';
import { Icon } from '../../shared/components/icon/icon';

const PERFIL_LABEL: Record<Perfil, string> = {
  ADMINISTRADOR: 'Administrador',
  ATENDENTE: 'Atendente',
  TECNICO: 'Técnico',
  FINANCEIRO: 'Financeiro',
};

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [ReactiveFormsModule, Icon],
  templateUrl: './usuarios-list.html',
  styleUrl: './usuarios-list.scss',
})
export class UsuariosList implements OnInit {
  private service = inject(UsuarioService);
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);

  perfilLabel = PERFIL_LABEL;
  perfis: Perfil[] = ['ADMINISTRADOR', 'ATENDENTE', 'TECNICO', 'FINANCEIRO'];

  usuarios = signal<Usuario[]>([]);
  mostrarForm = signal(false);
  erro = signal<string | null>(null);

  meuUsuarioId = () => this.auth.sessao()?.usuarioId;

  form = this.fb.nonNullable.group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    perfil: ['ATENDENTE' as Perfil, Validators.required],
  });

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.service.listar().subscribe((usuarios) => this.usuarios.set(usuarios));
  }

  campoInvalido(campo: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[campo];
    return c.touched && c.invalid;
  }

  novoUsuario(): void {
    this.form.reset({ nome: '', email: '', senha: '', perfil: 'ATENDENTE' });
    this.erro.set(null);
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

    this.erro.set(null);
    this.service.criar(this.form.getRawValue()).subscribe({
      next: () => {
        this.mostrarForm.set(false);
        this.carregar();
      },
      error: (err) => {
        this.erro.set(err?.error?.message ?? 'Não foi possível criar o usuário.');
      },
    });
  }

  inativar(usuario: Usuario): void {
    this.service.inativar(usuario.id).subscribe(() => this.carregar());
  }

  reativar(usuario: Usuario): void {
    this.service.reativar(usuario.id).subscribe(() => this.carregar());
  }
}
