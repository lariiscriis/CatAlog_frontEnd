import { Component, OnInit, HostListener } from '@angular/core';
import {DefaultLoginLayoutComponent} from '../../components/default-login-layout/default-login-layout.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookService } from '../../services/book.service';
import {HeaderComponent} from '../../components/header/header.component';
import {SidebarComponent} from '../../components/sidebar/sidebar.component';
import {Livro} from '../../types/livro.type';


@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})



export class UserComponent implements OnInit {

  user = {
    name: 'Usuário teste',
    photo: 'https://marketplace.canva.com/A5alg/MAESXCA5alg/1/tl/canva-user-icon-MAESXCA5alg.png'
  };

  allBooks: Livro[] = [];
  filteredBooks: Livro[] = [];
  categories: string[] = [];
  selectedCategory: string = '';

  currentPage: number = 1;
  booksPerPage: number = 10;
  paginatedBooks: any[] = [];

  featuredBooks: Livro[] = [];
  collections: { name: string, books: Livro[] }[] = [];


  constructor(private bookservice: BookService) {
  }

  ngOnInit(): void {
    this.loadBooks();

  }

  loadBooks(): void {
    this.bookservice.getBooksFromDatabase().subscribe((livros: any[]) => {
      console.log('📚 Livros recebidos:', livros);

      this.allBooks = livros.map((livro: any) => ({
        id_livro: livro.idLivro,
        titulo: livro.titulo,
        autores: livro.autores,
        editora: livro.editora,
        data_publicacao: livro.data_publicacao,
        descricao: livro.descricao,
        capa: livro.capa,
        numero_paginas: livro.numero_paginas,
        categoria: livro.categoria,
        disponibilidade: livro.disponibilidade
      }));
      this.categories = [...new Set(this.allBooks
        .map(book => book.categoria)
        .filter((cat): cat is string => !!cat && cat.trim() !== '')
      )].sort() as string[];


      this.filteredBooks = [...this.allBooks];
      this.collections = [
        {
          name: 'Novas aquisições da Biblioteca',
          books: this.allBooks.slice(10, 15)
        },
        {
          name: 'Recomendados para você',
          books: this.allBooks.slice(20, 25)
        }
      ];
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 1; // Reset para a primeira página

    if (!category) {
      this.filteredBooks = [...this.allBooks];
    } else {
      this.filteredBooks = this.allBooks.filter(book =>
        book.categoria === category
      );
    }

    this.updatePagination();
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.booksPerPage;
    const endIndex = startIndex + this.booksPerPage;
    const currentBooks = this.filteredBooks.slice(startIndex, endIndex);

    // Divide em duas linhas de 5 livros cada
    this.paginatedBooks = [
      currentBooks.slice(0, 4),
      currentBooks.slice(4, 8)
    ];
  }

  get totalPages(): number {
    return Math.ceil(this.filteredBooks.length / this.booksPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  viewDetails(book: Livro): void {
    // implementar navegação ou modal
  }





  logout(): void {
  }

}

