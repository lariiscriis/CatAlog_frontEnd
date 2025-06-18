import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { HeaderComponent } from '../components/header/header.component';
import { EstanteService } from '../services/estante.service';
import { Livro } from '../types/livro.type';

interface Shelf {
  books: Livro[];
}

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent],
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.scss']
})
export class FavoritosComponent implements OnInit {
  shelves: Shelf[] = [];
  usuarioId = 'ed94a5a8-1d2d-409f-806e-4827f60fd4ff';

  user = {
    name: 'Usuário teste',
    photo: 'https://marketplace.canva.com/A5alg/MAESXCA5alg/1/tl/canva-user-icon-MAESXCA5alg.png'
  };

  constructor(private estanteService: EstanteService) {}

  ngOnInit(): void {
    this.carregarLivrosFavoritos();
  }

  carregarLivrosFavoritos(): void {
    this.estanteService.listarLivros(this.usuarioId, 'favorito')
      .subscribe({
        next: (livros) => {
          console.log('Dados recebidos da API:', livros); // Debug

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


}
