import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Servico, ServicoRequest } from '../models/servico.model';

@Injectable({ providedIn: 'root' })
export class ServicoService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/servicos`;

  listar(): Observable<Servico[]> {
    return this.http.get<Servico[]>(this.baseUrl);
  }

  criar(request: ServicoRequest): Observable<Servico> {
    return this.http.post<Servico>(this.baseUrl, request);
  }

  atualizar(id: number, request: ServicoRequest): Observable<Servico> {
    return this.http.put<Servico>(`${this.baseUrl}/${id}`, request);
  }

  inativar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
