import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../components/header/header.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Livro, LivroEstante } from '../types/livro.type';
import { BookService } from '../services/book.service';
import { EmprestimoService } from '../services/emprestimo.service';
import { UsuarioService } from '../services/usuario.service';
import { AnotacaoService } from '../services/anotacao.service';
import { Anotacao } from '../types/anotacao.type';
import { EstanteService } from '../services/estante.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-livro-detalhes',
  standalone: true,
  templateUrl: './livro-detalhes.component.html',
  styleUrls: ['./livro-detalhes.component.scss'],
  imports: [
    HeaderComponent,
    SidebarComponent,
    CommonModule,
    FormsModule,
    DatePipe,
  ],
})
export class LivroDetalhesComponent implements OnInit {
  livro!: LivroEstante;
  estante: 'favorito' | 'desejado' | 'emprestado' = 'favorito';
  anotacoes: Anotacao[] = [];
  novaNota = '';
  paginaNota = 1;
  diasRestantes = 0;
  currentRating = 0;
  activeTab: 'notas' | 'avaliacao' = 'notas';
  showEmprestimoModal = false;
  showMultaModal = false;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private emprestimoService: EmprestimoService,
    private usuarioService: UsuarioService,
    private anotacaoService: AnotacaoService,
    private estanteService: EstanteService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const estanteParam = this.route.snapshot.queryParamMap.get('estante');
    const estantesValidas = ['favorito', 'desejado', 'emprestado'] as const;

    this.estante = estantesValidas.includes(estanteParam as any)
      ? (estanteParam as typeof this.estante)
      : 'favorito';

    if (id) {
      this.bookService.buscarPorId(id).subscribe({
        next: (data) => {
          this.livro = this.mapLivroApiToLivroEstante(data);
          this.livro.status = this.estante;
          this.calcularDiasRestantes();
          this.carregarAnotacoes();
        },
        error: (err) => this.toastr.error('Erro ao buscar livro'),
      });
    }
  }

  private mapLivroApiToLivroEstante(data: any): LivroEstante {
    return {
      ...data,
      id_livro: data.idLivro,
      data_devolucao: data.dataDevolucao,
    };
  }

private carregarAnotacoes(): void {
  this.usuarioService.getUsuarioLogado().subscribe(usuario => {
    if (usuario?.id && this.livro?.id_livro) {
      this.anotacaoService.listarPorLivro(usuario.id, this.livro.id_livro).subscribe({
        next: (notas) => {
          this.anotacoes = notas;
        },
        error: () => console.error('Erro ao carregar anotações')
      });
    }
  });
}


  adicionarFavorito(): void {
    this.adicionarNaEstante('favorito');
  }

  adicionarDesejado(): void {
    this.adicionarNaEstante('desejado');
  }

  private adicionarNaEstante(tipo: 'favorito' | 'desejado' | 'emprestado'): void {
    this.usuarioService.getUsuarioLogado().subscribe(usuario => {
      if (!usuario?.id || !this.livro?.id_livro) return;

      this.estanteService.adicionarLivro(usuario.id, this.livro.id_livro, tipo).subscribe({
        next: () => {
          this.toastr.success(`Livro adicionado à estante "${tipo}"`);
          this.livro.status = tipo;
        },
        error: () => this.toastr.error(`Erro ao adicionar "${tipo}"`),
      });
    });
  }

  adicionarNota(): void {
    if (!this.novaNota.trim()) return;

    this.usuarioService.getUsuarioLogado().subscribe(usuario => {
      if (!usuario?.id || !this.livro?.id_livro) return;

     const nova: Anotacao = {
  nota: this.novaNota,
  pagina: this.paginaNota,
  dataNota: new Date().toISOString(),
  id: usuario.id,
  idLivro: this.livro.id_livro,
  avaliacao: this.currentRating || 0, // ou algum valor padrão se 0 não for válido
};

      this.anotacaoService.criar(nova).subscribe({
        next: (anotacaoSalva) => {
          this.anotacoes.unshift(anotacaoSalva);
          this.novaNota = '';
          this.paginaNota = 1;
        },
        error: () => this.toastr.error('Erro ao salvar anotação'),
      });
    });
  }

  rateBook(rating: number): void {
  this.currentRating = rating;
}


  calcularDiasRestantes(): void {
    if (!this.livro?.data_devolucao) return;
    const hoje = new Date();
    const devolucao = new Date(this.livro.data_devolucao);
    this.diasRestantes = Math.ceil((devolucao.getTime() - hoje.getTime()) / (1000 * 3600 * 24));
  }

  temMulta(): boolean {
    return this.diasRestantes < 0;
  }

  calcularMulta(): number {
    const diasAtraso = -this.diasRestantes;
    return diasAtraso > 0 ? diasAtraso * 2 : 0;
  }

  abrirModalMulta(): void {
    this.showMultaModal = true;
  }

  confirmarDevolucaoComMulta(): void {
    this.showMultaModal = false;
    this.toastr.success(`Multa de R$ ${this.calcularMulta().toFixed(2)} paga com sucesso!`);
    this.devolverLivroAtual();
  }

  devolverLivroAtual(): void {
    this.usuarioService.getUsuarioLogado().subscribe(usuario => {
      if (!usuario?.id || !this.livro?.id_livro) return;

      this.emprestimoService.buscarEmprestimosAtivos(usuario.id).subscribe({
        next: (emprestimos) => {
          const emprestimo = emprestimos.find(e => (e.livro?.id_livro || e?.idLivro) === this.livro.id_livro);
          console.log('Empréstimos encontrados:', emprestimos);
          console.log('Empréstimo atual:', emprestimo?.idEmprestimo);
          if (emprestimo?.idEmprestimo) {
            this.emprestimoService.devolverEmprestimo(emprestimo.idEmprestimo).subscribe({
              next: () => {
                this.toastr.success('Livro devolvido com sucesso!');
                this.livro.status = 'favorito';
              },
              error: () => this.toastr.error('Erro ao devolver o livro.'),
            });
          } else {
            this.toastr.warning('Nenhum empréstimo ativo para este livro.');
          }
        },
        error: () => this.toastr.error('Erro ao buscar empréstimos.'),
      });
    });
  }

  abrirModalEmprestimo(): void {
    this.showEmprestimoModal = true;
  }

  cancelarEmprestimo(): void {
    this.showEmprestimoModal = false;
  }

  confirmarEmprestimo(): void {
    this.showEmprestimoModal = false;
    this.solicitarEmprestimo();
  }

  solicitarEmprestimo(): void {
    const token = localStorage.getItem('auth-token');
    if (!token) return alert('Token ausente. Faça login.');

    if (!this.livro?.id_livro) return alert('Livro inválido.');

    this.usuarioService.getUsuarioLogado().subscribe({
      next: (usuario) => {
        if (!usuario?.id) return alert('Usuário inválido.');

        this.emprestimoService.realizarEmprestimo({
          idLivro: this.livro.id_livro,
          id: usuario.id,
        }).subscribe({
          next: () => {
            this.toastr.success('Empréstimo realizado!');
            this.livro.status = 'emprestado';
            this.adicionarNaEstante('emprestado');
          },
          error: (err) => {
            console.error(err);
            alert(`Erro ${err.status}: ${err.message}`);
          },
        });
      },
      error: () => alert('Erro ao buscar usuário.'),
    });
  }
}
