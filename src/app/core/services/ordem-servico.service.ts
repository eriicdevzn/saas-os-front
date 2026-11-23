import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  OrdemServico,
  OrdemServicoItemRequest,
  OrdemServicoRequest,
  StatusOrdemServico,
} from '../models/ordem-servico.model';

@Injectable({ providedIn: 'root' })
export class OrdemServicoService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/ordens-servico`;

  listar(): Observable<OrdemServico[]> {
    return this.http.get<OrdemServico[]>(this.baseUrl);
  }

  buscar(id: number): Observable<OrdemServico> {
    return this.http.get<OrdemServico>(`${this.baseUrl}/${id}`);
  }

  criar(request: OrdemServicoRequest): Observable<OrdemServico> {
    return this.http.post<OrdemServico>(this.baseUrl, request);
  }

  adicionarItem(osId: number, request: OrdemServicoItemRequest): Observable<OrdemServico> {
    return this.http.post<OrdemServico>(`${this.baseUrl}/${osId}/itens`, request);
  }

  alterarStatus(id: number, novoStatus: StatusOrdemServico): Observable<OrdemServico> {
    return this.http.patch<OrdemServico>(`${this.baseUrl}/${id}/status`, { novoStatus });
  }
}
