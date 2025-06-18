import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink } from '@angular/router';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { HeaderComponent } from '../components/header/header.component';
import { EstanteService } from '../services/estante.service';
import { UsuarioService } from '../services/usuario.service';
import { Livro } from '../types/livro.type';

interface Shelf {
  books: Livro[];
}

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    SidebarComponent,
    HeaderComponent
  ],
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.scss']
})

export class FavoritosComponent implements OnInit {
  shelves: Shelf[] = [];

  constructor(
    private estanteService: EstanteService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.usuarioService.getUsuarioLogado().subscribe({
      next: (usuario) => {
        if (!usuario?.id) {
          console.error('Usuário não autenticado');
          return;
        }
        this.carregarLivrosFavoritos(usuario.id);
      },
      error: (err) => console.error('Erro ao obter usuário logado:', err)
    });
  }

  carregarLivrosFavoritos(usuarioId: string): void {
    this.estanteService.listarLivros(usuarioId, 'favorito')
      .subscribe({
        next: (livros) => {
          this.shelves = this.organizarEmEstantes(livros);
        },
        error: (err) => console.error('Erro ao carregar favoritos:', err)
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

  getEmptySlots(booksCount: number): number[] {
    return Array(9 - booksCount).fill(0);
  }
}
