import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Tecnico, TecnicoRequest } from '../models/tecnico.model';

@Injectable({ providedIn: 'root' })
export class TecnicoService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/tecnicos`;

  listar(): Observable<Tecnico[]> {
    return this.http.get<Tecnico[]>(this.baseUrl);
  }

  criar(request: TecnicoRequest): Observable<Tecnico> {
    return this.http.post<Tecnico>(this.baseUrl, request);
  }

  atualizar(id: number, request: TecnicoRequest): Observable<Tecnico> {
    return this.http.put<Tecnico>(`${this.baseUrl}/${id}`, request);
  }

  inativar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
