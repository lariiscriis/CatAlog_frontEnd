import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, tap} from 'rxjs';


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
  private apiUrl = 'http://localhost:8080/user/me';
  //usuarioSubject armazena o usuario
  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  //usuario$ permite que outros componentes usem o vlr
  usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) {}

  //pega os dados do usuario logado
  fetchUsuario(token: String){
    return this.http.get<Usuario>(this.apiUrl, {
      headers: {Authorization: `Bearer ${token}`},
    }).pipe(
      tap((usuario) => this.usuarioSubject.next(usuario)),
    );
  }

  getUsuarioAtual(): Usuario | null {
    return this.usuarioSubject.getValue();
  }

  //chamar quando for fazer logout pra limpar os dados
  clearUsuario(){
    this.usuarioSubject.next(null);
  }
}
