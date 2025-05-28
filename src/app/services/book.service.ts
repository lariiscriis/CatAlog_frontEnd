import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private apiUrl = 'http://localhost:8080/api/books';

  constructor(private http: HttpClient) { }

  searchBooks(query: String){
    return this.http.get(`${this.apiUrl}/search?query=${query}&langRestrict=en`);
  }
}
