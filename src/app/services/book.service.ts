import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Livro} from '../types/livro.type';

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

}
