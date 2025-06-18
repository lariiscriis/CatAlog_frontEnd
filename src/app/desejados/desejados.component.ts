// desejados.component.ts
import { Component, OnInit } from '@angular/core';
import { EstanteService } from '../services/estante.service';
import { UsuarioService } from '../services/usuario.service';
import { Livro } from '../types/livro.type';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { HeaderComponent } from '../components/header/header.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Shelf { books: Livro[] }

@Component({
  standalone: true,
  selector: 'app-desejados',
  templateUrl: './desejados.component.html',
  styleUrls: ['./desejados.component.scss'],
  imports: [ SidebarComponent, HeaderComponent, CommonModule, RouterLink ]
})
export class DesejadosComponent implements OnInit {
  shelves: Shelf[] = [];

  constructor(
    private estanteService: EstanteService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    // 1) primeiro pega o usuário logado
    this.usuarioService.getUsuarioLogado().subscribe({
      next: user => {
        if (!user?.id) {
          console.error('Usuário não autenticado');
          return;
        }
        // 2) aí sim carrega a estante “desejado”
        this.carregarLivrosDesejados(user.id);
      },
      error: err => console.error('Erro ao buscar usuário logado', err)
    });
  }

  private carregarLivrosDesejados(usuarioId: string) {
    this.estanteService.listarLivros(usuarioId, 'desejado')
      .subscribe({
        next: livros => this.shelves = this.organizarEmEstantes(livros),
        error: err => console.error('Erro ao carregar desejados:', err)
      });
  }

  private organizarEmEstantes(livros: Livro[]): Shelf[] {
    const chunkSize = 9;
    const shelves: Shelf[] = [];
    for (let i = 0; i < livros.length; i += chunkSize) {
      shelves.push({ books: livros.slice(i, i + chunkSize) });
    }
    // se não tiver nada, garantir seção vazia
    if (shelves.length === 0) shelves.push({ books: [] });
    return shelves;
  }

  // opcional: pra renderizar espaços vazios no HTML
  getEmptySlots(count: number) {
    return Array(9 - count).fill(0);
  }
}
