import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {HeaderComponent} from '../components/header/header.component';
import {SidebarComponent} from '../components/sidebar/sidebar.component';
import {FormsModule} from '@angular/forms';
import {Livro, LivroEstante} from '../types/livro.type';
import {DatePipe, CommonModule} from '@angular/common';
import {BookService} from '../services/book.service';


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
    CommonModule
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


  constructor(private route: ActivatedRoute, private bookService: BookService) {}

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
    // Lógica para solicitar empréstimo
    alert('Empréstimo solicitado com sucesso!');
    // Atualize o status do livro
    // this.livro.status = 'emprestado';
  }
}
