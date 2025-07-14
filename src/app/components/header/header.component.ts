import {Component, EventEmitter, Input, Output} from '@angular/core';
import {UsuarioService} from '../../services/usuario.service';
import {Observable} from 'rxjs';
import {Usuario} from '../../types/usuario.type';
import {AsyncPipe} from '@angular/common';
import {Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {BookService} from '../../services/book.service';
import {Livro} from '../../types/livro.type';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, AsyncPipe, FormsModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']

})
export class HeaderComponent {
  usuario$?: Observable<Usuario | null>;
  termoBusca: string = '';
  @Output() termoBuscaChange = new EventEmitter<string>();

  livros: Livro[] = [];
  constructor(private usuarioService: UsuarioService,
              private router: Router,
              private bookService: BookService,
  ) {
  }

  ngOnInit(): void {
    this.usuario$ = this.usuarioService.usuario$;
    this.usuario$.subscribe(user => {
      console.log('Usuario foto_perfil:', user?.fotoPerfil);
    });
    this.carregarLivros();

  }

  carregarLivros(): void {
    this.bookService.listarTodos().subscribe(livros => {
      this.livros = livros.map(livro => {
        if (!livro.id_livro && livro.idLivro) {
          livro.id_livro = livro.idLivro;
        }
        return livro;
      });
    });
  }

  buscarLivros(): void {
    this.termoBuscaChange.emit(this.termoBusca);
  }

  logout() {
    this.usuarioService.clearUsuario();
    this.router.navigate(['/login']);
  }
}
