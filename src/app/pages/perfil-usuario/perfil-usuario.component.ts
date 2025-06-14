import { Component } from '@angular/core';
import {dateTimestampProvider} from 'rxjs/internal/scheduler/dateTimestampProvider';
import {CommonModule} from '@angular/common';
import {SidebarComponent} from '../../components/sidebar/sidebar.component';
import {HeaderComponent} from '../../components/header/header.component';

@Component({
  selector: 'app-perfil-usuario',
  imports: [CommonModule, SidebarComponent, HeaderComponent],
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.scss']
})
export class PerfilUsuarioComponent {
  user = {
    name: 'Usuário Exemplo',
    email: "miau@exemplo.com",
    senha:"",
    photo: 'https://marketplace.canva.com/A5alg/MAESXCA5alg/1/tl/canva-user-icon-MAESXCA5alg.png',
    fundoPerfil: 'https://i.pinimg.com/736x/3d/da/65/3dda659b7e0d057b0626645c822212a7.jpg',
    bio: 'Amante de livros e gatos! Leitor assíduo de fantasia e ficção científica.'
  };

  editUser = { ...this.user };
  showEditModal = false;

  comments = [
    {
      bookTitle: 'Fogo & Sangue',
      bookCover: 'https://m.media-amazon.com/images/I/818yNY0mMZL.jpg',
      page: 156,
      date: new Date('2023-05-15'),
      text: 'Adorei a descrição da Dança dos Dragões neste capítulo!'
    },
    {
      bookTitle: 'O Senhor dos Anéis',
      bookCover: 'https://m.media-amazon.com/images/I/71ZLavBjpRL._AC_UF1000,1000_QL80_.jpg',
      page: 89,
      date: new Date('2023-04-22'),
      text: 'A cena do Conselho de Elrond é incrível, cheia de detalhes!'
    }
  ];

  openEditModal() {
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  saveProfile() {
    this.user = { ...this.editUser };
    this.closeEditModal();
    //chamar back pra salvar a ediçao

  }

  confirmDelete() {
    if(confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      //chamar back pra confirmar exclusao
    }
  }


  protected readonly dateTimestampProvider = dateTimestampProvider;
}
