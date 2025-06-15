import { Component, OnInit, HostListener } from '@angular/core';
import {DefaultLoginLayoutComponent} from '../../components/default-login-layout/default-login-layout.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookService } from '../../services/book.service';
import {HeaderComponent} from '../../components/header/header.component';
import {SidebarComponent} from '../../components/sidebar/sidebar.component';

interface Book{
  id: number;
  title: string;
  author: string;
  cover: string;
  description: string;
}

interface Collection {
  name: string;
  books: Book[];
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})



export class UserComponent implements OnInit{

  user = {
    name: 'Usuário teste',
    photo: 'https://marketplace.canva.com/A5alg/MAESXCA5alg/1/tl/canva-user-icon-MAESXCA5alg.png'
  };

  isLoading = true;
  currentSlideIndex = 0;
  offset = 0;
  activeTab = 'home';
  showPrevButton = false;
  showNextButton = false;
  private carouselContainer!: HTMLElement;
  private carouselTrack!: HTMLElement;



  featuredBooks: Book[] = [
  {
    id: 1,
    title: 'Fogo & Sangue',
    author: 'George R.R. Martin',
    cover: 'https://m.media-amazon.com/images/I/818yNY0mMZL.jpg',
    description: 'A história da dinastia Targaryen em Westeros, expandindo a conquista dos Sete Reinos pela Casa Targaryen.'
  },
  {
    id: 2,
    title: 'O Senhor dos Anéis: A Sociedade do Anel',
    author: 'J.R.R. Tolkien',
    cover: 'https://m.media-amazon.com/images/I/81hCVEC0ExL.jpg',
    description: 'A jornada de Frodo para destruir o Um Anel e salvar a Terra-média.'
  },
  {
    id: 3,
    title: 'Harry Potter e a Pedra Filosofal',
    author: 'J.K. Rowling',
    cover: 'https://m.media-amazon.com/images/I/81q77Q39nEL._AC_UF1000,1000_QL80_.jpg',
    description: 'O início da jornada de Harry Potter na Escola de Magia e Bruxaria de Hogwarts.'
  },
  ];

  collections: Collection[] = [
    {
      name: 'Recomendados para você',
      books: [
          {
          id: 1,
          title: 'Fogo & Sangue',
          author: 'George R.R. Martin',
          cover: 'https://m.media-amazon.com/images/I/818yNY0mMZL.jpg',
          description: 'A história da dinastia Targaryen em Westeros, expandindo a conquista dos Sete Reinos pela Casa Targaryen.'
        },
       {
          id: 2,
          title: 'O Senhor dos Anéis: A Sociedade do Anel',
          author: 'J.R.R. Tolkien',
          cover: 'https://m.media-amazon.com/images/I/81hCVEC0ExL.jpg',
          description: 'A jornada de Frodo para destruir o Um Anel e salvar a Terra-média.'
        },

      {
        id: 3,
        title: 'Harry Potter e a Pedra Filosofal',
        author: 'J.K. Rowling',
        cover: 'https://m.media-amazon.com/images/I/81q77Q39nEL._AC_UF1000,1000_QL80_.jpg',
        description: 'O início da jornada de Harry Potter na Escola de Magia e Bruxaria de Hogwarts.'
      },

    ]
    },

    {
      name: 'Novas aquisições da Biblioteca',
      books: [          {
          id: 1,
          title: 'Fogo & Sangue',
          author: 'George R.R. Martin',
          cover: 'https://m.media-amazon.com/images/I/818yNY0mMZL.jpg',
          description: 'A história da dinastia Targaryen em Westeros, expandindo a conquista dos Sete Reinos pela Casa Targaryen.'
        },
       {
          id: 2,
          title: 'O Senhor dos Anéis: A Sociedade do Anel',
          author: 'J.R.R. Tolkien',
          cover: 'https://m.media-amazon.com/images/I/81hCVEC0ExL.jpg',
          description: 'A jornada de Frodo para destruir o Um Anel e salvar a Terra-média.'
        },

      {
        id: 3,
        title: 'Harry Potter e a Pedra Filosofal',
        author: 'J.K. Rowling',
        cover: 'https://m.media-amazon.com/images/I/81q77Q39nEL._AC_UF1000,1000_QL80_.jpg',
        description: 'O início da jornada de Harry Potter na Escola de Magia e Bruxaria de Hogwarts.'
      },]
    }
  ];

  ngOnInit(): void {
    setTimeout(() => {
      this.initCarousel();
      this.checkScrollButtons();
    }, 0);  }



  @HostListener('window:resize')
  onResize() {
    this.checkScrollButtons();
  }

  initCarousel(): void {
    this.carouselContainer = document.querySelector('.carousel-container') as HTMLElement;
    this.carouselTrack = document.querySelector('.carousel-track') as HTMLElement;
  }

  checkScrollButtons(): void {
    if (this.carouselContainer && this.carouselTrack) {
      const containerWidth = this.carouselContainer.offsetWidth;
      const trackWidth = this.carouselTrack.scrollWidth;
      const scrollLeft = this.carouselContainer.scrollLeft;

      this.showPrevButton = scrollLeft > 0;
      this.showNextButton = scrollLeft + containerWidth < trackWidth;
    }
  }

  nextSlide(): void {
    if (this.carouselContainer) {
      const containerWidth = this.carouselContainer.offsetWidth;
      this.carouselContainer.scrollBy({
        left: containerWidth * 0.8,
        behavior: 'smooth'
      });

      // Atualiza os botões após a animação
      setTimeout(() => this.checkScrollButtons(), 500);
    }
  }

  prevSlide(): void {
    if (this.carouselContainer) {
      const containerWidth = this.carouselContainer.offsetWidth;
      this.carouselContainer.scrollBy({
        left: -containerWidth * 0.8,
        behavior: 'smooth'
      });

      // Atualiza os botões após a animação
      setTimeout(() => this.checkScrollButtons(), 500);
    }
  }

  updateOffset(): void {
    this.offset = -this.currentSlideIndex * 100;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;

  }

  viewDetails(book: Book): void {
  }

  logout(): void {
  }

}

