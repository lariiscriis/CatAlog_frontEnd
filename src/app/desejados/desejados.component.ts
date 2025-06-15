import {Component, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SidebarComponent} from '../components/sidebar/sidebar.component';
import {HeaderComponent} from '../components/header/header.component';
import {MatIconModule} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';




@Component({
  selector: 'app-desejados',
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent, MatIconModule],
  templateUrl: './desejados.component.html',
  styleUrl: './desejados.component.scss'
})
export class DesejadosComponent{
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
