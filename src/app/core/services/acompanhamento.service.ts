import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Acompanhamento } from '../models/acompanhamento.model';

/** Serviço público — não exige sessão autenticada. */
@Injectable({ providedIn: 'root' })
export class AcompanhamentoService {
  private http = inject(HttpClient);

  buscar(codigo: string): Observable<Acompanhamento> {
    return this.http.get<Acompanhamento>(`${environment.apiUrl}/public/acompanhamento/${codigo}`);
  }
}
