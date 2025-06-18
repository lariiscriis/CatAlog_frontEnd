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


  constructor(private route: ActivatedRoute, private bookService: BookService,
              private emprestimoService: EmprestimoService, private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    const estanteParam = this.route.snapshot.queryParamMap.get('estante');

    const estantesValidas = ['favorito', 'desejado', 'emprestado'] as const;

    this.estante = estantesValidas.includes(estanteParam as any)
      ? estanteParam as 'favorito' | 'desejado' | 'emprestado'
      : 'favorito';

    if (id) {
      this.bookService.buscarPorId(id).subscribe({
        next: (data) => {
          console.log('Dados recebidos:', data);
          this.livro = {
            ...data,
            status: this.estante
          };
          this.calcularDiasRestantes();
        },
        error: (err) => {
          console.error('Erro ao buscar livro:', err);
        }
      });
    }
    this.calcularDiasRestantes();
  }


  calcularDiasRestantes(): void {
    if (this.livro.data_devolucao) {
      const hoje = new Date();
      const devolucao = new Date(this.livro.data_devolucao);
      this.diasRestantes = Math.ceil((devolucao.getTime() - hoje.getTime()) / (1000 * 3600 * 24));
    }
  }

  adicionarNota(): void {
    if (this.novaNota.trim()) {
      this.livro.notas = this.livro.notas || [];
      this.livro.notas.unshift({
        texto: this.novaNota,
        data: new Date(),
        pagina: this.paginaNota
      });
      this.novaNota = '';
      this.paginaNota = 1;
    }
  }

  rateBook(rating: number): void {
    this.currentRating = rating;
    // logica para salvar a avaliação
  }

  devolverLivro(): void {
    // Lógica para devolver o livro
    alert('Livro devolvido com sucesso!');
  }

  calcularMulta(): number {
    const diasAtraso = -this.diasRestantes;
    // Exemplo: R$ 2,00 por dia de atraso
    return diasAtraso * 2;
  }

  abrirModalMulta(): void {
    this.showMultaModal = true;
  }

  confirmarDevolucaoComMulta(): void {
    this.showMultaModal = false;
    // Lógica para registrar o pagamento da multa
    alert("Multa de R$ ${this.calcularMulta().toFixed(2)} paga com sucesso!");
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
    // lógica real de empréstimo
    this.solicitarEmprestimo();
  }
  solicitarEmprestimo(): void {
    // Verificação EXTRA do token
    const token = sessionStorage.getItem('auth-token');
    console.log('Token no sessionStorage:', token);

    if (!token) {
      alert('Token não encontrado! Faça login novamente.');
      return;
    }

    // Verificação EXTRA do usuário
    const usuario = this.usuarioService.getUsuarioAtual();
    console.log('Usuário no serviço:', usuario);

    if (!usuario) {
      alert('Dados do usuário não carregados!');
      return;
    }

    // Mostra os dados que serão enviados
    console.log('Dados do empréstimo:', {
      livroId: this.livro.id_livro,
      usuarioId: usuario.id
    });

    // Chamada SIMPLIFICADA ao serviço
    this.emprestimoService.realizarEmprestimo({
      livroId: this.livro.id_livro,
      usuarioId: usuario.id
    }).subscribe({
      next: () => {
        alert('Empréstimo realizado!');
        this.livro.status = 'emprestado';
      },
      error: (error) => {
        console.error('ERRO COMPLETO:', error);
        alert(`Erro ${error.status}: ${error.message || 'Erro no empréstimo'}`);
      }
    });
  }
}
