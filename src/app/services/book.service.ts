import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map, Observable} from 'rxjs';
import {Livro, LivroEstante} from '../types/livro.type';

export interface Book {
  id: number;
  title: string;
  authors?: string[];
  cover?: string;
  description?: string;
}

export interface Collection {
  name: string;
  books: Book[];
}


@Injectable({
  providedIn: 'root'
})
export class BookService {

  private apiUrl = 'http://localhost:8080/api/books';

  constructor(private http: HttpClient) { }

  searchBooks(query: String){
    return this.http.get<Livro>(`${this.apiUrl}/search?query=${query}&langRestrict=en`);
  }

  getBooksFromDatabase(): Observable<Livro[]> {

    return this.http.get<Livro[]>(`${this.apiUrl}`);
  }
  getBooksByCategory(category: string): Observable<Livro[]> {
    return this.http.get<Livro[]>(`${this.apiUrl}?category=${category}`);
  }

  buscarPorId(id: string): Observable<Livro> {
    return this.http.get<Livro>(`${this.apiUrl}/${id}`);
  }

  listarTodos(): Observable<Livro[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(livros =>
        livros.map(livro => ({
          id_livro: livro.idLivro,
          isbn: livro.isbn,
          titulo: livro.titulo,
          editora: livro.editora,
          data_publicacao: livro.data_publicacao,
          autores: livro.autores,
          descricao: livro.descricao,
          capa: livro.capa,
          disponibilidade: livro.disponibilidade,
          numeroPaginas: livro.numeroPaginas,
          qtdeLivro: livro.qtdeLivro,
          categoria: livro.categoria
        }))
      )
    );
  }

  adicionarLivro(livro: Partial<Livro>): Observable<any> {
    const email = localStorage.getItem('email') || 'admin@gmail.com';
    return this.http.post(`${this.apiUrl}?email=${email}`, livro);
  }

  atualizarLivro(idLivro: string, livro: Partial<Livro>): Observable<any> {
    const email = localStorage.getItem('email') || 'admin@gmail.com';
    return this.http.put(`${this.apiUrl}/${idLivro}?email=${email}`, livro);
  }

  deletarLivro(idLivro: string): Observable<any> {
    const email = localStorage.getItem('email') || 'admin@gmail.com';
    return this.http.delete(`${this.apiUrl}/${idLivro}?email=${email}`, {
      responseType: 'text'
    });
  }

  buscarPorAutorOuTitulo(termo: string): Observable<Livro[]> {
    return this.http.get<Livro[]>(`${this.apiUrl}/buscar/autorOuTitulo?termo=${encodeURIComponent(termo)}`);
  }

}
