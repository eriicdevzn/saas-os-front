import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Icon],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  private auth = inject(AuthService);
  private router = inject(Router);

  sessao = this.auth.sessao;
  ehAdmin = () => this.auth.perfil() === 'ADMINISTRADOR';

  iniciais(nome: string | undefined): string {
    if (!nome) return '?';
    const partes = nome.trim().split(' ');
    return (partes[0][0] + (partes[1]?.[0] ?? '')).toUpperCase();
  }

  sair(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
