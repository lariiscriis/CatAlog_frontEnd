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

  listarPorUsuario(idUsuario: string): Observable<Anotacao[]> {
  return this.http.get<Anotacao[]>(`${this.apiUrl}/${idUsuario}`);
}

  listarPorLivro(idUsuario: string, idLivro: string): Observable<Anotacao[]> {
    return this.http.get<Anotacao[]>(`${this.apiUrl}/${idUsuario}/livro/${idLivro}`);
  }

  criar(anotacao: Anotacao): Observable<Anotacao> {
    return this.http.post<Anotacao>(this.apiUrl, anotacao);
  }

  atualizar(id: number, anotacao: Anotacao): Observable<Anotacao> {
    return this.http.put<Anotacao>(`${this.apiUrl}/${id}`, anotacao);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
