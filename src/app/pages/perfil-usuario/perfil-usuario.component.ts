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
import { EmprestimoService } from '../../services/emprestimo.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

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
  totalEmprestimos: number = 0;
  showDeleteModal = false;


  constructor(
  private usuarioService: UsuarioService,
  private anotacaoService: AnotacaoService,
  private bookService: BookService,
  private emprestimoService: EmprestimoService,
  private toastrService: ToastrService,
  private router: Router,
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
        this.carregarTotalEmprestimos(usuario.id);
        this.carregarAnotacoes(usuario.id);
      } else {
        console.warn('Nenhum usuário retornado.');
        this.toastrService.info('Usuário não encontrado. Verifique se está logado.');
      }
    },
    error: (err) => {
      console.error('Erro ao buscar usuário logado:', err);
      this.toastrService.error('Erro ao carregar dados do usuário logado.');
    }
  });
}
carregarTotalEmprestimos(idUsuario: string): void {
  this.emprestimoService.buscarHistoricoDoUsuario(idUsuario).subscribe({
    next: (emprestimos) => {
      this.totalEmprestimos = emprestimos.length;
    },
    error: (err) => {
      console.error('Erro ao carregar empréstimos:', err);
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
      this.toastrService.error('Dados do usuário não carregados. Tente novamente.');
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
          this.toastrService.success('Perfil atualizado com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao atualizar perfil:', err);
          this.toastrService.error('Erro ao atualizar perfil. Verifique os dados e tente novamente.');
        }
      });
  }

  openDeleteModal(): void {
    this.showDeleteModal = true;
  }

  closeDelete(): void {
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    if (!this.user?.id) {
      this.toastrService.info('ID do usuário não disponível.');
      return;
    }

      this.usuarioService.deletarUsuario(this.user?.id).subscribe({
        next: () => {
          this.toastrService.success('Conta excluída com sucesso!');
            this.router.navigate(["signup"]);
        },
        error: (err) => {
          console.error('Erro ao excluir conta:', err);
          this.toastrService.error('Erro ao excluir a conta.');
        }
      });

  }
}
