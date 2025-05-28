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

  constructor(private bookService: BookService){}
  ngOnInit(): void {
    const sub = this.bookService.searchBooks('fantasy romance popular tiktok').subscribe((data: any) => {
      this.books = data.items
      .filter((book: any) => {
        const imageLink = book.volumeInfo.imageLinks?.thumbnail;
        return imageLink && !imageLink.includes("image not available");
      })
      .map((book: any)=>{
        const imageLink = book.volumeInfo.imageLinks?.thumbnail;
        if(imageLink){
          const highResImage = imageLink
          book.volumeInfo.imageLinks.highRes = highResImage;
        }
        return book;
      })
    })
  }
  
  setSection(section : string){
    this.activeSection = section; 
  }

}
