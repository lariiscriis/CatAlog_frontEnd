import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
    return this.http.get(`${this.apiUrl}/search?query=${query}&langRestrict=en`);
  }

  getBooksFromDatabase(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }


}
