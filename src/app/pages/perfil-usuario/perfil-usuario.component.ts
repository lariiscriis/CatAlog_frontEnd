import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { UsuarioService } from '../../services/usuario.service';
import { HttpClient } from '@angular/common/http';
import { AnotacaoService } from '../../services/anotacao.service';
import { Anotacao } from '../../types/anotacao.type';
import { BookService } from '../../services/book.service';


@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    HeaderComponent
  ],
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.scss']
})
export class PerfilUsuarioComponent implements OnInit {
  user: any = null;           // dados do usuário logado
  editUser: any = {};         // objeto para edição
  showEditModal = false;      // controle do modal
anotacoes: Anotacao[] = [];

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

constructor(
  private usuarioService: UsuarioService,
  private anotacaoService: AnotacaoService,
  private bookService: BookService,
  private http: HttpClient
) {}



  ngOnInit(): void {
    this.carregarUsuarioLogado();
  }

carregarUsuarioLogado(): void {
  this.usuarioService.getUsuarioLogado().subscribe({
    next: (usuario) => {
      if (usuario) {
        console.log('Usuário carregado com sucesso:', usuario);
        this.user = usuario;
        this.editUser = { ...usuario };
        this.carregarAnotacoes(usuario.id); // 👈 Aqui!
      } else {
        console.warn('Nenhum usuário retornado.');
        alert('Usuário não encontrado. Verifique se está logado.');
      }
    },
    error: (err) => {
      console.error('Erro ao buscar usuário logado:', err);
      alert('Erro ao carregar dados do usuário logado.');
    }
  });
}

carregarAnotacoes(idUsuario: string): void {
  this.anotacaoService.listarPorUsuario(idUsuario).subscribe({
    next: (anotacoes) => {
      const anotacoesComLivro: Anotacao[] = [];

      anotacoes.forEach((anotacao) => {
        this.bookService.buscarPorId(anotacao.idLivro).subscribe({
          next: (livro) => {
            anotacoesComLivro.push({
              ...anotacao,
              livro: {
                titulo: livro.titulo,
                capa: livro.capa
              }
            });

            // Quando todas forem carregadas, atualiza a lista
            if (anotacoesComLivro.length === anotacoes.length) {
              this.anotacoes = anotacoesComLivro;
            }
          },
          error: (err) => {
            console.warn(`Erro ao buscar livro ${anotacao.idLivro}:`, err);
            // Adiciona anotação mesmo sem o livro, se quiser
            anotacoesComLivro.push(anotacao);
            if (anotacoesComLivro.length === anotacoes.length) {
              this.anotacoes = anotacoesComLivro;
            }
          }
        });
      });
    },
    error: (err) => {
      console.error('Erro ao carregar anotações:', err);
      alert('Erro ao buscar anotações do usuário.');
    }
  });
}


  openEditModal(): void {
    if (this.user) {
      this.editUser = { ...this.user };
      this.showEditModal = true;
    }
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  saveProfile(): void {
    if (!this.user?.email) {
      alert('Dados do usuário não carregados. Tente novamente.');
      return;
    }

    const email = this.user.email;
const dadosAtualizados = {
  nome: this.editUser.name,  // aqui alterei de "name" para "nome"
  email: this.editUser.email,
  senha: this.editUser.senha,
  bio: this.editUser.bio,
};


    const fotoPerfil = (document.querySelector('#fotoPerfil') as HTMLInputElement)?.files?.[0];
    const fotoBackground = (document.querySelector('#fotoBackground') as HTMLInputElement)?.files?.[0];

    this.usuarioService.updateUsuario(email, dadosAtualizados, fotoPerfil, fotoBackground)
      .subscribe({
        next: (res: any) => {
          console.log('Usuário atualizado:', res);
          this.user = { ...res };
          this.closeEditModal();
          alert('Perfil atualizado com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao atualizar perfil:', err);
          alert('Erro ao atualizar perfil. Verifique os dados e tente novamente.');
        }
      });
  }

  confirmDelete(): void {
    if (!this.user?.id) {
      alert('ID do usuário não disponível.');
      return;
    }

    if (confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      this.usuarioService.deletarUsuario(this.user?.id).subscribe({
        next: () => {
          alert('Conta excluída com sucesso!');
          // Aqui você pode redirecionar para o login ou homepage
        },
        error: (err) => {
          console.error('Erro ao excluir conta:', err);
          alert('Erro ao excluir a conta.');
        }
      });
    }
  }
}
