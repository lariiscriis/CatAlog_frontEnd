import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Anotacao } from '../types/anotacao.type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnotacaoService {
  private apiUrl = 'http://localhost:8080/anotacoes';

  constructor(private http: HttpClient) {}
  private getToken(): string {
    return localStorage.getItem('auth-token') || '';
  }
  listarPorUsuario(idUsuario: string): Observable<Anotacao[]> {
  return this.http.get<Anotacao[]>(`${this.apiUrl}/${idUsuario}`, {
    headers: {
      Authorization: `Bearer ${this.getToken()}`
    }
  });
}

  listarPorLivro(idUsuario: string, idLivro: string): Observable<Anotacao[]> {
    return this.http.get<Anotacao[]>(`${this.apiUrl}/${idUsuario}/livro/${idLivro}`, {
    headers: {
      Authorization: `Bearer ${this.getToken()}`
    }
  });
  }

  criar(anotacao: Anotacao): Observable<Anotacao> {
    return this.http.post<Anotacao>(this.apiUrl, anotacao, {
    headers: {
      Authorization: `Bearer ${this.getToken()}`
    }
  });
  }

  atualizar(id: number, anotacao: Anotacao): Observable<Anotacao> {
    return this.http.put<Anotacao>(`${this.apiUrl}/${id}`, anotacao, {
    headers: {
      Authorization: `Bearer ${this.getToken()}`
    }
  });
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
    headers: {
      Authorization: `Bearer ${this.getToken()}`
    }
  });
  }
}
