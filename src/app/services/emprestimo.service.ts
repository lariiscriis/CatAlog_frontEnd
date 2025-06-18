import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {map, Observable, tap} from 'rxjs';
import {Livro} from '../types/livro.type';

export interface Emprestimo {
  id: string;
  dataEmprestimo: string;
  idEmprestimo: number;
  dataPrevistaDevolucao: string;
  dataDevolucao?: string;
  estado: string;
  renovacoes: number;
  multa: number;
  idLivro: string;
  livro: Livro;
  usuario: {
    id: string;
    name: string;
    // outros campos que precisar
  };
}

@Injectable({
  providedIn: 'root'
})
export class EmprestimoService {
  private apiUrl = 'http://localhost:8080/emprestimo';

  constructor(private http: HttpClient) {}

  realizarEmprestimo(emprestimo: any): Observable<any> {
    const token = localStorage.getItem('auth-token');
    console.log('Token sendo enviado:', token); // Log do token

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    console.log('Headers sendo enviados:', headers); // Log dos headers

    return this.http.post(this.apiUrl, emprestimo, {
      headers,
      observe: 'response' // Para ver a resposta completa
    }).pipe(
      tap(response => {
        console.log('Resposta completa:', response);
      }),
      map(response => response.body)
    );
  }

devolverEmprestimo(idEmprestimo: number): Observable<Emprestimo> {
    return this.http.put<Emprestimo>(`${this.apiUrl}/devolver/${idEmprestimo}`, {});
  }

  renovarEmprestimo(idEmprestimo: number): Observable<any> {
    const token = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.put(`${this.apiUrl}/renovar/${idEmprestimo}`, {}, { headers });
    }

  buscarEmprestimosDoUsuario(idUsuario: string): Observable<Livro[]> {
    return this.http.get<Livro[]>(`${this.apiUrl}/ativos/${idUsuario}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('auth-token') || ''}`
      })
    });
  }

  buscarEmprestimosAtivos(idUsuario: string): Observable<Emprestimo[]> {
  return this.http.get<Emprestimo[]>(`${this.apiUrl}/ativos/${idUsuario}`, {
    headers: new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('auth-token') || ''}`
    })
  });
}
  buscarHistoricoDoUsuario(idUsuario: string): Observable<Emprestimo[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('auth-token')||''}`
    });
    return this.http.get<Emprestimo[]>(`${this.apiUrl}/${idUsuario}`, { headers });
  }

}
