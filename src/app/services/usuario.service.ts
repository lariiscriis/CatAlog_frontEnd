import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';


interface  Usuario{
  id: string;
  name: string;
  email: string;
  password: string;
  bio: string;
  foto_perfil: string;
  foto_background: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
    private apiUrl = 'http://localhost:8080/user';
  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getToken(): string {
    return localStorage.getItem('token') || '';
  }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`
    });
  }

  fetchUsuario(token: string): Observable<Usuario> {
  return this.http.get<Usuario>(`${this.apiUrl}/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).pipe(
    tap(usuario => this.usuarioSubject.next(usuario))
  );
}

    getUsuarioLogado(): Observable<Usuario> {
    const url = `${this.apiUrl}/me`;

    return this.http.get<Usuario>(url, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(usuario => {
        console.log('Usuário recebido do backend:', usuario);
        this.usuarioSubject.next(usuario);
      })
    );
  }


  getUsuarioAtual(): Usuario | null {
    return this.usuarioSubject.getValue();
  }
updateUsuario(email: string, dados: any, fotoPerfil?: File, fotoBackground?: File) {
    const formData = new FormData();
    formData.append('dados', JSON.stringify(dados));
    if (fotoPerfil) formData.append('fotoPerfil', fotoPerfil);
    if (fotoBackground) formData.append('fotoBackground', fotoBackground);

    const url = `${this.apiUrl}/${email}`;

    return this.http.put<Usuario>(url, formData, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Deleta a conta do usuário autenticado
   */
  deletarUsuario(id: string) {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url, {
      headers: this.getAuthHeaders()
    });
  }
  //chamar quando for fazer logout pra limpar os dados
  clearUsuario(){
    this.usuarioSubject.next(null);
  }
}
