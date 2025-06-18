import { Component, OnInit } from '@angular/core';
import { Livro } from '../../types/livro.type';
import { BookService } from '../../services/book.service';
import { EmprestimoService } from '../../services/emprestimoAdmin.service';
import { FormsModule } from '@angular/forms';
import { Emprestimo } from '../../types/emprestimo.type';
import { DatePipe, CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/admin.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  imports: [FormsModule, CommonModule],
  providers: [DatePipe]
})
export class AdminComponent implements OnInit {
  livros: Livro[] = [];
  emprestimos: Emprestimo[] = [];
  activeTab: 'livros' | 'emprestimos' = 'livros';
  filtroAtivo: 'todos' | 'disponiveis' | 'atrasados' = 'todos';
  termoBusca: string = '';

  novoLivro: Partial<Livro> = {
    titulo: '',
    autores: '',
    editora: '',
    descricao: '',
    categoria: '',
    capa: '',
    data_publicacao: '',
    numeroPaginas: 0,
    qtde_livros: 1,
    disponibilidade: true
  };

  constructor(
    private bookService: BookService,
    private emprestimoService: EmprestimoService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarLivros();
    this.carregarTodosEmprestimos();
  }

  carregarLivros(): void {
    this.bookService.listarTodos().subscribe(livros => {
      this.livros = livros;
    });
  }


  adicionarLivro(): void {
    if (!this.novoLivro.titulo || !this.novoLivro.autores) {
      alert('Título e autores são obrigatórios');
      return;
    }

    this.bookService.adicionarLivro(this.novoLivro as Livro).subscribe({
      next: (livro) => {
        this.livros.push(livro);
        this.novoLivro = {
          titulo: '',
          autores: '',
          editora: '',
          descricao: '',
          categoria: '',
          capa: '',
          data_publicacao: '',
          numeroPaginas: 0,
          qtde_livros: 1,
          disponibilidade: true
        };
      },
      error: (err) => {
        console.error('Erro ao adicionar livro:', err);
        alert('Erro ao adicionar livro');
      }
    });
  }

  editarLivro(livro: Livro): void {
    if (!livro.titulo || !livro.autores) {
      alert('Título e autores são obrigatórios');
      return;
    }

    this.bookService.atualizarLivro(livro.id_livro, livro).subscribe({
      next: () => {
        alert('Livro atualizado com sucesso');
      },
      error: (err) => {
        console.error('Erro ao editar livro:', err);
        alert('Erro ao editar livro');
      }
    });
  }

  deletarLivro(id: string): void {
    if (confirm('Tem certeza que deseja excluir este livro?')) {
      this.bookService.deletarLivro(id).subscribe({
        next: () => {
          this.livros = this.livros.filter(l => l.id_livro !== id);
        },
        error: (err) => {
          console.error('Erro ao excluir livro:', err);
          alert('Erro ao excluir livro');
        }
      });
    }
  }

  carregarTodosEmprestimos(): void {
    this.filtroAtivo = 'todos';
    this.emprestimoService.listarTodosEmprestimos().subscribe(emprestimos => {
      console.log(emprestimos);
      this.processarEmprestimos(emprestimos);
    });
  }

  carregarEmprestimosAtrasados(): void {
    this.filtroAtivo = 'atrasados';
    this.emprestimoService.listarTodosEmprestimos().subscribe(emprestimos => {
      const hoje = new Date();

      this.processarEmprestimos(
        emprestimos.filter(emp =>
          emp.dataPrevistaDevolucao && new Date(emp.dataPrevistaDevolucao) < hoje
        )
      );
    });
  }

  private processarEmprestimos(emprestimos: Emprestimo[]): void {
    this.emprestimos = emprestimos.map(emp => ({
      ...emp,
      dataEmprestimo: emp.dataEmprestimo,
      dataPrevistaDevolucao: emp.dataPrevistaDevolucao,
      dataDevolucao: emp.dataDevolucao || null
    }));

    this.emprestimos.forEach(emp => {
      this.bookService.buscarPorId(emp.idLivro).subscribe(livro => {
        emp.livro = {
          titulo: livro.titulo,
          capa: livro.capa
        };
      });

      this.usuarioService.buscarPorId(emp.id).subscribe(usuario => {
        emp.usuario = {
          name: usuario.name,
          email: usuario.email
        };
      });
    });
  }

  buscarLivros(): void {
    if (this.termoBusca.trim()) {
      this.bookService.buscarPorAutorOuTitulo(this.termoBusca).subscribe(livros => {
        this.livros = livros;
      });
    } else {
      this.carregarLivros();
    }
  }


  estaAtrasado(dataDevolucao: string | null): boolean {
    if (!dataDevolucao) return false;
    const hoje = new Date();
    const dataDev = new Date(dataDevolucao);
    return dataDev < hoje;
  }

  logout() {
    this.usuarioService.clearUsuario();
    this.router.navigate(['/login']);
  }
}
