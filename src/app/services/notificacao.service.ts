import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Notificacao {
  id: string;
  texto: string;
  dataNotificacao: string | Date;
  dataDevolucao:  string| Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificacaoService {
  private apiUrl = 'http://localhost:8080/notificacoes';

  constructor(private http: HttpClient) {}

  private getToken(): string {
    return localStorage.getItem('auth-token') || '';
  }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`
    });
  }

  listarPorUsuario(id: string): Observable<Notificacao[]> {
    return this.http.get<Notificacao[]>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
