import { Component, OnInit } from '@angular/core';
import { EmprestimoService, Emprestimo } from '../services/emprestimo.service';
import { BookService } from '../services/book.service';
import { forkJoin } from 'rxjs';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { HeaderComponent } from '../components/header/header.component';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink } from '@angular/router';

import { Livro } from '../types/livro.type';
import { UsuarioService } from '../services/usuario.service';

interface Shelf {
  books: Livro[];
}

@Component({
  selector: 'app-historicoemprestimo',
  templateUrl: './historicoemprestimo.component.html',
  styleUrls: ['./historicoemprestimo.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    SidebarComponent,
    HeaderComponent
  ],
})
export class HistoricoemprestimoComponent implements OnInit {
  historicoEmprestimos: Emprestimo[] = [];
  estantes: Shelf[] = [];

  constructor(
    private emprestimoService: EmprestimoService,
    private bookService: BookService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.carregarHistoricoEmprestimos();
  }

  carregarHistoricoEmprestimos() {
    this.usuarioService.getUsuarioLogado().subscribe(usuario => {
      if (!usuario?.id) return;

      this.emprestimoService.buscarHistoricoDoUsuario(usuario.id).subscribe(emprestimos => {
        const livrosObservables = emprestimos.map(emp =>
          this.bookService.buscarPorId(emp.idLivro)
        );

        forkJoin(livrosObservables).subscribe(livros => {
          // Anexa os livros nos empréstimos e separa para exibição
          emprestimos.forEach((emp, idx) => {
            emp.livro = livros[idx];
          });

          this.historicoEmprestimos = emprestimos;

          const livrosDoHistorico = emprestimos.map(e => e.livro);
          this.estantes = this.organizarEmEstantes(livrosDoHistorico);
        });
      });
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
