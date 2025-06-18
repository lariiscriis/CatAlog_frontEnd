import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { Livro } from '../types/livro.type';

@Injectable({
  providedIn: 'root'
})
export class EstanteService {
  private apiUrl = 'http://localhost:8080/estante';

  constructor(private http: HttpClient) { }

  adicionarLivro(usuarioId: string, livroId: string, tipo: string) {
    const params = new HttpParams()
      .set('idUsuario', usuarioId)
      .set('idLivro', livroId)
      .set('tipoRelacao', tipo);

    const token = sessionStorage.getItem('auth-token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(`${this.apiUrl}/adicionar`, null, { params, headers });
  }


  listarLivros(usuarioId: string, tipo: string): Observable<Livro[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${usuarioId}/${tipo}`).pipe(
      map((estantes: any[]) => estantes.map(estante => {
        const livro = estante.livro;
        return {
          id_livro: livro.idLivro,
          isbn: livro.isbn,
          titulo: livro.titulo,
          editora: livro.editora,
          data_publicacao: livro.data_publicacao,
          autores: livro.autores,
          descricao: livro.descricao,
          capa: livro.capa,
          disponibilidade: livro.disponibilidade,
          numero_paginas: livro.numeroPaginas,
          qtde_livros: livro.qtdeLivro,
          categoria: livro.categoria,
          dataInteracao: estante.dataInteracao,
          tipoRelacao: estante.tipoRelacao
        } as Livro;
      }))
    );
  }
  removerLivro(usuarioId: string, livroId: string, tipo: 'favorito' | 'desejado' | 'emprestado'): Observable<any> {
    return this.http.delete(`${this.apiUrl}`, {
      params: {
        usuarioId,
        livroId,
        tipo
      }
    });
  }
}
