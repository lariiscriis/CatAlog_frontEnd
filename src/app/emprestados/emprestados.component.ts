import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SidebarComponent} from '../components/sidebar/sidebar.component';
import {HeaderComponent} from '../components/header/header.component';
import {EstanteService} from '../services/estante.service';
import {Livro} from '../types/livro.type';
import { UsuarioService } from '../services/usuario.service';


interface Shelf {
  books: Livro[];
}


@Component({
  selector: 'app-emprestados',
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent],
  templateUrl: './emprestados.component.html',
  styleUrl: './emprestados.component.scss'
})
export class EmprestadosComponent {
  shelves: Shelf[] = [];
  usuarioId = 'ed94a5a8-1d2d-409f-806e-4827f60fd4ff';


  constructor(private estanteService: EstanteService,   private usuarioService: UsuarioService
  ) {}

      ngOnInit(): void {
        this.usuarioService.getUsuarioLogado().subscribe({
          next: (usuario) => {
            const id = usuario?.id;
            if (id) {
              this.carregarLivrosEmprestados(id);
            } else {
              console.error('ID do usuário não encontrado.');
            }
          },
          error: (err) => {
            console.error('Erro ao carregar usuário logado:', err);
          }
        });
      }
  carregarLivrosFavoritos(): void {
    this.estanteService.listarLivros(this.usuarioId, 'emprestado')
      .subscribe({
        next: (livros) => {
          console.log('Dados recebidos da API:', livros); // Debug

          this.shelves = this.organizarEmEstantes(livros);
        },
        error: (err) => console.error('Erro ao carregar emprestado:', err)
      });
  }

    carregarLivrosEmprestados(usuarioId: string): void {
      this.estanteService.listarLivros(usuarioId, 'emprestado')
        .subscribe({
          next: (livros) => {
            console.log('Dados recebidos da API:', livros);
            this.shelves = this.organizarEmEstantes(livros);
          },
          error: (err) => console.error('Erro ao carregar emprestado:', err)
        });
    }

  organizarEmEstantes(livros: Livro[]): Shelf[] {
    const shelves: Shelf[] = [];
    const livrosPorEstante = 9;

    for (let i = 0; i < livros.length; i += livrosPorEstante) {
      const chunk = livros.slice(i, i + livrosPorEstante);
      shelves.push({ books: chunk });
    }

    if (shelves.length === 0) {
      shelves.push({ books: [] });
    }

    return shelves;
  }
}
