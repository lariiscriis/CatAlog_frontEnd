import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SidebarComponent} from '../components/sidebar/sidebar.component';
import {HeaderComponent} from '../components/header/header.component';

@Component({
  selector: 'app-favoritos',
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.scss'
})
export class FavoritosComponent {
  user = {
    name: 'Usuário teste',
    photo: 'https://marketplace.canva.com/A5alg/MAESXCA5alg/1/tl/canva-user-icon-MAESXCA5alg.png'
  };

  shelves = [
    {
      books: [
        { title: 'Book 1', cover: 'https://m.media-amazon.com/images/I/818yNY0mMZL.jpg' },
        { title: 'Book 2', cover: 'https://m.media-amazon.com/images/I/81hCVEC0ExL.jpg' },
        { title: 'Book 3', cover: 'https://m.media-amazon.com/images/I/81q77Q39nEL._AC_UF1000,1000_QL80_.jpg' },
        { title: 'Book 1', cover: 'https://m.media-amazon.com/images/I/818yNY0mMZL.jpg' },
        { title: 'Book 2', cover: 'https://m.media-amazon.com/images/I/81hCVEC0ExL.jpg' },
        { title: 'Book 3', cover: 'https://m.media-amazon.com/images/I/81q77Q39nEL._AC_UF1000,1000_QL80_.jpg' },
        { title: 'Book 1', cover: 'https://m.media-amazon.com/images/I/818yNY0mMZL.jpg' },
        { title: 'Book 2', cover: 'https://m.media-amazon.com/images/I/81hCVEC0ExL.jpg' },
        { title: 'Book 3', cover: 'https://m.media-amazon.com/images/I/81q77Q39nEL._AC_UF1000,1000_QL80_.jpg' }
      ]
    },
    {
      books: [
        { title: 'Book 1', cover: 'https://m.media-amazon.com/images/I/818yNY0mMZL.jpg' },
        { title: 'Book 2', cover: 'https://m.media-amazon.com/images/I/81hCVEC0ExL.jpg' },
        { title: 'Book 3', cover: 'https://m.media-amazon.com/images/I/81q77Q39nEL._AC_UF1000,1000_QL80_.jpg' },
        { title: 'Book 1', cover: 'https://m.media-amazon.com/images/I/818yNY0mMZL.jpg' },
        { title: 'Book 2', cover: 'https://m.media-amazon.com/images/I/81hCVEC0ExL.jpg' },
        { title: 'Book 3', cover: 'https://m.media-amazon.com/images/I/81q77Q39nEL._AC_UF1000,1000_QL80_.jpg' },
        { title: 'Book 1', cover: 'https://m.media-amazon.com/images/I/818yNY0mMZL.jpg' },
        { title: 'Book 2', cover: 'https://m.media-amazon.com/images/I/81hCVEC0ExL.jpg' },
        { title: 'Book 3', cover: 'https://m.media-amazon.com/images/I/81q77Q39nEL._AC_UF1000,1000_QL80_.jpg' }
      ]
    },
    {
      books: [
        { title: 'Book 1', cover: 'https://m.media-amazon.com/images/I/818yNY0mMZL.jpg' },
        { title: 'Book 2', cover: 'https://m.media-amazon.com/images/I/81hCVEC0ExL.jpg' },
        { title: 'Book 3', cover: 'https://m.media-amazon.com/images/I/81q77Q39nEL._AC_UF1000,1000_QL80_.jpg' },
        { title: 'Book 1', cover: 'https://m.media-amazon.com/images/I/818yNY0mMZL.jpg' },
        { title: 'Book 2', cover: 'https://m.media-amazon.com/images/I/81hCVEC0ExL.jpg' },
        { title: 'Book 3', cover: 'https://m.media-amazon.com/images/I/81q77Q39nEL._AC_UF1000,1000_QL80_.jpg' },
        { title: 'Book 1', cover: 'https://m.media-amazon.com/images/I/818yNY0mMZL.jpg' },
        { title: 'Book 2', cover: 'https://m.media-amazon.com/images/I/81hCVEC0ExL.jpg' },
        { title: 'Book 3', cover: 'https://m.media-amazon.com/images/I/81q77Q39nEL._AC_UF1000,1000_QL80_.jpg' }
      ]
    }
  ];
}
