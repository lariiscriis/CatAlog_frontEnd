import {Component, Input} from '@angular/core';
import {UsuarioService} from '../../services/usuario.service';
import {Observable} from 'rxjs';
import {Usuario} from '../../types/usuario.type';
import {AsyncPipe} from '@angular/common';
import {Router} from '@angular/router';


@Component({
  selector: 'app-header',
  imports: [
    AsyncPipe
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']

})
export class HeaderComponent {
  usuario$?: Observable<Usuario | null>;
  constructor(private usuarioService: UsuarioService, private router: Router) {
  }

  ngOnInit(): void {
    this.usuario$ = this.usuarioService.usuario$;
    this.usuario$.subscribe(user => {
      console.log('Usuario foto_perfil:', user?.fotoPerfil);
    });
  }


  logout() {
    this.usuarioService.clearUsuario();
    this.router.navigate(['/login']);
  }
}
