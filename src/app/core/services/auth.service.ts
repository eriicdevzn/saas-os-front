import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, Perfil } from '../models/auth.model';

const STORAGE_KEY = 'el_service_auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private sessaoSignal = signal<LoginResponse | null>(this.carregarSessao());

  readonly sessao = this.sessaoSignal.asReadonly();
  readonly autenticado = computed(() => this.sessaoSignal() !== null);
  readonly perfil = computed<Perfil | null>(() => this.sessaoSignal()?.perfil ?? null);

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, request)
      .pipe(tap((resposta) => this.salvarSessao(resposta)));
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.sessaoSignal.set(null);
  }

  get token(): string | null {
    return this.sessaoSignal()?.token ?? null;
  }

  private salvarSessao(sessao: LoginResponse): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessao));
    this.sessaoSignal.set(sessao);
  }

  private carregarSessao(): LoginResponse | null {
    const bruto = localStorage.getItem(STORAGE_KEY);
    return bruto ? (JSON.parse(bruto) as LoginResponse) : null;
  }
}
