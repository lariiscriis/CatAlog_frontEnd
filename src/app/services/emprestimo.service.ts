import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {map, Observable, tap} from 'rxjs';
import {Livro} from '../types/livro.type';

@Injectable({
  providedIn: 'root'
})
export class EmprestimoService {
  private apiUrl = 'http://localhost:8080/emprestimo';

  constructor(private http: HttpClient) {}

  realizarEmprestimo(emprestimo: any): Observable<any> {
    const token = sessionStorage.getItem('auth-token');
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

  devolverEmprestimo(idEmprestimo: number): Observable<any> {
    const token = sessionStorage.getItem('auth-token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.put(`${this.apiUrl}/devolver/${idEmprestimo}`, {}, { headers });
  }

  renovarEmprestimo(idEmprestimo: number): Observable<any> {
    const token = sessionStorage.getItem('auth-token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.put(`${this.apiUrl}/renovar/${idEmprestimo}`, {}, { headers });
  }

    buscarEmprestimosDoUsuario(idUsuario: string): Observable<Livro[]> {
      return this.http.get<Livro[]>(`http://localhost:8080/emprestimos/ativos/${idUsuario}`);
    }


}
