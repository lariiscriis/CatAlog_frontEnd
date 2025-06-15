import {Component, Input} from '@angular/core';
import {UsuarioService} from '../../services/usuario.service';
import {Observable} from 'rxjs';
import {Usuario} from '../../types/usuario.type';
import {AsyncPipe} from '@angular/common';


@Component({
  selector: 'app-header',
  imports: [
    AsyncPipe
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']

})
export class HeaderComponent {
     usuario$!: Observable<Usuario | null>;

  constructor(private usuarioService: UsuarioService) {
  }

  ngOnInit(): void {
    this.usuario$ = this.usuarioService.usuario$;
  }


  logout() {
    console.log('Logout!');
  }
}
