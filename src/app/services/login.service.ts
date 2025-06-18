import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {switchMap, tap} from 'rxjs';
import { Observable } from 'rxjs';
import {UsuarioService} from './usuario.service';

export type LoginResponse = {
  token: string;
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

export class LoginService {
apiUrl = "http://localhost:8080/auth"

  constructor(private httClient: HttpClient, private usuarioService: UsuarioService) { }


  login(email: String, password: String): Observable<any> {
    return this.httClient.post<LoginResponse>(this.apiUrl + "/login", {email, password})
      .pipe(tap((value)=> {
      sessionStorage.setItem("auth-token", value.token);
      sessionStorage.setItem("username", value.name);
    }),
        switchMap(() => {
          const token = sessionStorage.getItem("auth-token");
          return this.usuarioService.fetchUsuario(token!);
        })
        )
  }

  signup(name: string, email: string, password: string){
    return this.httClient.post<LoginResponse>(this.apiUrl + "/register", {name, email, password})
      .pipe(tap((value)=> {
      sessionStorage.setItem("auth-token", value.token);
      sessionStorage.setItem("username ", value.name);

    }))
  }

}
