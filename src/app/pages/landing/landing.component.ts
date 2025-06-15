import { Component, OnInit } from '@angular/core';

import { HomeSectionComponent } from './home-section/home-section.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-landing',
  imports: [CommonModule, RouterModule, HomeSectionComponent ],
  standalone: true,
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit{
  books: any[] = [];
  activeSection: string = 'home';
  currentFeedbackIndex = 0;

   feedbacks = [
    {
      id: 1,
      author: 'Ana Silva',
      role: 'Amante de Livros',
      image: 'assets/images/users/user1.jpg',
      comment: 'Cat-a-log transformou como organizo minha coleção de livros! Finalmente posso encontrar tudo facilmente.',
      rating: 5
    },
    {
      id: 2,
      author: 'Carlos Mendes',
      role: 'Bibliotecária',
      image: 'assets/images/users/user2.jpg',
      comment: 'Adoro o sistema de avaliação com patinhas. Minha gata também aprova quando uso o app no meu colo!',
      rating: 4
    },
    {
      id: 3,
      author: 'Marina Oliveira',
      role: 'Assistente de Biblioteca',
      image: 'assets/images/users/user3.jpg',
      comment: 'Uso para catalogar os livros da nossa biblioteca comunitária. Os voluntários amaram a interface!',
      rating: 5
    }
  ];

  constructor(private bookService: BookService){}

  ngOnInit(): void {
    this.bookService.getBooksFromDatabase().subscribe((data: any[]) => {
      this.books = data
        .filter(book => book.volumeInfo.imageLinks?.thumbnail)
        .map(book => {
          const imageLink = book.volumeInfo.imageLinks.thumbnail;
          book.volumeInfo.imageLinks.highRes = imageLink;
          return book;
        });
    });
  }

  setSection(section : string){
    this.activeSection = section;
  }

    scrollTo(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  }

    nextFeedback() {
    this.currentFeedbackIndex = (this.currentFeedbackIndex + 1) % this.feedbacks.length;
  }

  prevFeedback() {
    this.currentFeedbackIndex = (this.currentFeedbackIndex - 1 + this.feedbacks.length) % this.feedbacks.length;
  }

  goToFeedback(index: number) {
    this.currentFeedbackIndex = index;
  }

}
