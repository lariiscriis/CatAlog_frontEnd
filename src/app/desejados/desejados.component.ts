import { Component, OnInit } from '@angular/core';
import { EstanteService } from '../services/estante.service';
import {Livro, LivroEstante} from '../types/livro.type';
import {SidebarComponent} from '../components/sidebar/sidebar.component';
import {HeaderComponent} from '../components/header/header.component';
import {Router, RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';

interface Shelf {
  books: Livro[];
}

@Component({
  selector: 'app-desejados',
  templateUrl: './desejados.component.html',
  imports: [
    SidebarComponent,
    HeaderComponent,
    CommonModule,
    RouterLink
  ],
  styleUrls: ['./desejados.component.scss']
})
export class DesejadosComponent implements OnInit {
  shelves: Shelf[] = [];
  usuarioId = 'ed94a5a8-1d2d-409f-806e-4827f60fd4ff';

  constructor(private estanteService: EstanteService,private router: Router) {}

  ngOnInit(): void {
    this.carregarLivrosDesejados();
  }

  carregarLivrosDesejados(): void {
    this.estanteService.listarLivros(this.usuarioId, 'desejado')
      .subscribe({
        next: (livros) => {
          this.shelves = this.organizarEmEstantes(livros);
        },
        error: (err) => console.error('Erro ao carregar desejados:', err)
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
