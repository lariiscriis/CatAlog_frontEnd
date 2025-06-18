import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {HeaderComponent} from '../components/header/header.component';
import {SidebarComponent} from '../components/sidebar/sidebar.component';
import {FormsModule} from '@angular/forms';
import {Livro, LivroEstante} from '../types/livro.type';
import {DatePipe, CommonModule} from '@angular/common';
import {BookService} from '../services/book.service';
import {EmprestimoService} from '../services/emprestimo.service';
import {UsuarioService} from '../services/usuario.service';
import { HttpHeaders } from '@angular/common/http';
import {EstanteService} from '../services/estante.service';

@Component({
  standalone: true,
  selector: 'app-livro-detalhes',
  templateUrl: './livro-detalhes.component.html',
  styleUrls: ['./livro-detalhes.component.scss'],
  imports: [
    HeaderComponent,
    SidebarComponent,
    FormsModule,
    DatePipe,
    CommonModule,
  ],
})
export class LivroDetalhesComponent implements OnInit {
  livro!: LivroEstante;
  estante!: 'favorito' | 'desejado' | 'emprestado';
  novaNota: string = '';
  diasRestantes: number = 0;
  currentRating: number = 0;
  paginaNota: number = 1;
  activeTab: 'notas' | 'avaliacao' = 'notas';
  showEmprestimoModal: boolean = false;
  showMultaModal: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private emprestimoService: EmprestimoService,
    private usuarioService: UsuarioService,
    private estanteService: EstanteService

) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const estanteParam = this.route.snapshot.queryParamMap.get('estante');

    const estantesValidas = ['favorito', 'desejado', 'emprestado'] as const;
    this.estante = estantesValidas.includes(estanteParam as any)
      ? (estanteParam as 'favorito' | 'desejado' | 'emprestado')
      : 'favorito';

    if (id) {
      this.bookService.buscarPorId(id).subscribe({
        next: (data) => {
          this.livro = this.mapLivroApiToLivroEstante(data);
          this.livro.status = this.estante;
          this.calcularDiasRestantes();
        },
        error: (err) => {
          console.error('Erro ao buscar livro:', err);
        },
      });
    }
    this.calcularDiasRestantes();
  }

  // Método privado para mapear o objeto da API para o formato esperado
  private mapLivroApiToLivroEstante(data: any): LivroEstante {
    return {
      ...data,
      id_livro: data?.idLivro,
      data_devolucao: data.dataDevolucao,
    };
  }

  calcularDiasRestantes(): void {
    if (this.livro?.data_devolucao) {
      const hoje = new Date();
      const devolucao = new Date(this.livro.data_devolucao);
      this.diasRestantes = Math.ceil(
        (devolucao.getTime() - hoje.getTime()) / (1000 * 3600 * 24)
      );
    }
  }

  adicionarNota(): void {
    if (this.novaNota.trim()) {
      this.livro.notas = this.livro.notas || [];
      this.livro.notas.unshift({
        texto: this.novaNota,
        data: new Date(),
        pagina: this.paginaNota,
      });
      this.novaNota = '';
      this.paginaNota = 1;
    }
  }

  rateBook(rating: number): void {
    this.currentRating = rating;
    // lógica para salvar a avaliação
  }

  devolverLivro(): void {
    alert('Livro devolvido com sucesso!');
  }

  calcularMulta(): number {
    const diasAtraso = -this.diasRestantes;
    return diasAtraso * 2;
  }

  abrirModalMulta(): void {
    this.showMultaModal = true;
  }

  confirmarDevolucaoComMulta(): void {
    this.showMultaModal = false;
    alert(`Multa de R$ ${this.calcularMulta().toFixed(2)} paga com sucesso!`);
    this.devolverLivro();
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
    console.log('Token no sessionStorage:', token);

    if (!token) {
      alert('Token não encontrado! Faça login novamente.');
      return;
    }

    if (!this.livro?.id_livro) {
      alert('ID do livro inválido. Aguarde o carregamento do livro.');
      return;
    }


    console.log('ID do livro:', this.livro.id_livro);

    this.usuarioService.getUsuarioLogado().subscribe({
      next: (usuario) => {
        if (!usuario?.id) {
          alert('ID do usuário não encontrado. Faça login novamente.');
          return;
        }

        console.log('Usuário no serviço:', usuario);
        console.log('Dados do empréstimo:', {
          livroId: this.livro.id_livro,
          usuarioId: usuario?.id,
        });

        this.emprestimoService
          .realizarEmprestimo({
            idLivro: this.livro.id_livro,
            id: usuario?.id,
          })
          .subscribe({
            next: () => {
              alert('Empréstimo realizado!');
              this.livro.status = 'emprestado';
              const tipo = 'emprestado';

              this.estanteService
                .adicionarLivro(usuario.id, this.livro.id_livro,tipo)
                .subscribe({
                  next: (res) => {
                    console.log('Tipo enviado:', tipo);

                    console.log(`Livro adicionado à estante "${tipo}" com sucesso.`, res);

                  },
                  error: (err) => {
                    console.log('Tipo enviado:', tipo);

                    console.error(`❌ Erro ao adicionar à estante "${tipo}":`, err);
                  }
                });
            },
            error: (error) => {
              console.error('ERRO COMPLETO:', error);
              alert(`Erro ${error.status}: ${error.message || 'Erro no empréstimo'}`);
            },
          });
      },
      error: () => {
        alert('Erro ao carregar dados do usuário.');
      },
    });
  }
}
