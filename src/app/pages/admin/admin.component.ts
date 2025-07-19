import { Component, OnInit } from '@angular/core';
import { FormsModule }       from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { Router }            from '@angular/router';

import { Livro }             from '../../types/livro.type';
import { Emprestimo }        from '../../types/emprestimo.type';

import { BookService }       from '../../services/book.service';
import { EmprestimoService } from '../../services/emprestimoAdmin.service';
import { UsuarioService }    from '../../services/admin.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls : ['./admin.component.scss'],
  imports   : [FormsModule, CommonModule],
  providers : [DatePipe]
})
export class AdminComponent implements OnInit {


  livros:      Livro[]      = [];
  emprestimos: Emprestimo[] = [];
  usuarios:    any[]        = [];
  dashboard: any[] = [];
  usuariosFiltrados: any[]  = [];


  activeTab:   'livros' | 'emprestimos' | 'usuarios' | 'dashboard' = 'livros';
  filtroAtivo: 'todos'  | 'atrasados' | 'devolvidos' | 'em_andamento' = 'todos';

  termoBusca   = '';
  buscaUsuario = '';

  usuarioParaBanir: { email: string; name?: string } = { email: '' };


  livrosMaisEmprestados: { titulo: string; quantidade: number; capa: string; }[] = [];
  usuariosMaisAtrasos:   { name: string; totalAtrasos: number; fotoPerfil: string; }[] = [];
  categoriasMaisPopulares: { categoria: string; quantidade: number }[] = [];
  totalUsuarios: number = 0;
  totalLivros: number = 0;
  emprestimosAtivos: number = 0;
  livrosDisponiveis: number = 0;



  novoLivro: Partial<Livro> = {
    titulo:'', autores:'', editora:'',
    descricao:'', categoria:'',
    capa:'',    data_publicacao:'',
    numeroPaginas:0, qtde_livros:1, disponibilidade:true
  };


  showCreateModal = false;
  showEditModal   = false;
  showDeleteModal = false;
  showBanirModal = false;


  modalLivro: Partial<Livro> = {};

  constructor(
    private bookService:       BookService,
    private emprestimoService: EmprestimoService,
    private usuarioService:    UsuarioService,
    private router:            Router,
    private toastrService: ToastrService

  ) {}


  ngOnInit(): void {
    this.carregarLivros();
    this.carregarTodosEmprestimos();
    this.carregarUsuarios();
    this.montarDashboard();

  }


  carregarLivros(): void {
    this.bookService.listarTodos().subscribe(livros => {
      this.livros = livros.map(livro => {
        if (!livro.id_livro && livro.idLivro) {
          livro.id_livro = livro.idLivro;
        }
        return livro;
      });
    });
  }

  adicionarLivro(): void {
    if (!this.novoLivro.titulo || !this.novoLivro.autores) {
      this.toastrService.info('Título e autores são obrigatórios');
      return;
    }

    this.bookService.adicionarLivro(this.novoLivro as Livro).subscribe({
      next: livro => {
        if (!livro.id_livro && livro.idLivro) {
          livro.id_livro = livro.idLivro;
        }

        this.livros.push(livro);

        this.novoLivro = {
          titulo:'', autores:'', editora:'',
          descricao:'', categoria:'',
          capa:'', data_publicacao:'',
          numeroPaginas:0, qtde_livros:1, disponibilidade:true
        };
        this.toastrService.success('Livro Adicionado ao acervo!')
      },
      error: err => {
        console.error('Erro ao adicionar livro:', err);
        this.toastrService.error('Erro ao adicionar livro');
      }
    });
  }

  editarLivro(l: Livro): void {
    if (!l.titulo || !l.autores) {
      this.toastrService.info('Título e autores são obrigatórios');
      return;
    }

    const id = l.id_livro || l.idLivro;
    if (!id) {
      console.error('ID não encontrado para edição:', l);
      return;
    }

    this.bookService.atualizarLivro(id, l).subscribe({
      next: (livroAtualizado) => {
        const index = this.livros.findIndex(item =>
          item.id_livro === id || item.idLivro === id
        );
        if (index !== -1) {
          this.livros[index] = { ...livroAtualizado };
        }
        this.toastrService.success('Livro atualizado com sucesso');
      },
      error: (err) => {
        console.error('Erro ao editar livro:', err);
        this.toastrService.error('Erro ao editar livro');
      }
    });
  }


  deletarLivro(l: Livro): void {
    const id = l.id_livro || l.idLivro;
    if (!id) {
      console.error('ID não encontrado para exclusão:', l);
      return;
    }

    this.bookService.deletarLivro(id).subscribe({
      next : ()   => {
        this.livros = this.livros.filter(x =>
          x.id_livro !== id && x.idLivro !== id
        );
        this.toastrService.success('Livro excluído com sucesso');
      },
      error: err  => {
        console.error('Erro ao excluir livro:', err);
        this.toastrService.error('Erro ao excluir livro');
      }
    });
  }


  carregarTodosEmprestimos(): void {
    this.filtroAtivo = 'todos';
    this.emprestimoService.listarTodosEmprestimos().subscribe(emprestimos => {
      this.processarEmprestimos(emprestimos);
      this.montarDashboard();
    });
  }

  carregarEmprestimosAtrasados(): void {
    this.filtroAtivo = 'atrasados';
    this.emprestimoService.listarTodosEmprestimos().subscribe(emprestimos => {
      const hoje = new Date();

      this.processarEmprestimos(
        emprestimos.filter(emp =>
          emp.estado === 'EM_ANDAMENTO' && emp.dataPrevistaDevolucao && new Date(emp.dataPrevistaDevolucao) < hoje
        )
      );
    });
  }

  carregarEmprestimosDevolvidos(): void{
    this.filtroAtivo = 'devolvidos';

    this.emprestimoService.listarTodosEmprestimos().subscribe(emprestimos =>{
      this.processarEmprestimos(emprestimos.filter(
        emp => emp.estado === 'DEVOLVIDO' || emp.estado === 'ATRASADO'
      ))
    })
  }

  carregarEmprestimosEmAndamento(): void{
    this.filtroAtivo = 'em_andamento';
    const hoje = new Date();

    this.emprestimoService.listarTodosEmprestimos().subscribe(emprestimos =>{
      this.processarEmprestimos(emprestimos.filter(
        emp => emp.estado === 'EM_ANDAMENTO' && emp.dataPrevistaDevolucao && new Date(emp.dataPrevistaDevolucao) >= hoje
      ));
    })
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
          capa: livro.capa,
          categoria: livro.categoria || ''
        };
      });

      this.usuarioService.buscarPorId(emp.id).subscribe(usuario => {
        emp.usuario = {
          fotoPerfil: usuario.fotoPerfil,
          name: usuario.name,
          email: usuario.email
        };
      });
    });

    setTimeout(() => {
      this.montarDashboard();
    }, 1000);
  }

  getMensagemEmprestimo(emp: any): string {
    switch (emp.estado) {
      case 'DEVOLVIDO':
        return 'Devolvido';
      case 'ATRASADO':
        if(emp.multa === null){
          return 'Devolvido com Atraso: sem aplicação de multa'
        }
        return 'Devolvido com Atraso: multa de R$ ' + emp.multa?.toFixed(2);
      case 'EM_ANDAMENTO':
        const hoje = new Date();
        if(emp.estado === 'EM_ANDAMENTO' && emp.dataPrevistaDevolucao && new Date(emp.dataPrevistaDevolucao) < hoje){
          return 'Em andamento - Atrasado'
        }
        return 'Em andamento';
      default:
        return emp.estado;
    }
  }

  buscarLivros(): void {
    if (this.termoBusca.trim()) {
      this.bookService.buscarPorAutorOuTitulo(this.termoBusca)
        .subscribe(l => this.livros = l);
    } else { this.carregarLivros(); }
  }

  carregarUsuarios(): void {
    this.usuarioService.listarTodos()
      .subscribe(u => { this.usuarios = u; this.usuariosFiltrados = [...u]; });
  }
  filtrarUsuarios(): void {
    const t = this.buscaUsuario.toLowerCase();
    this.usuariosFiltrados = this.usuarios.filter(u =>
      u.name.toLowerCase().includes(t) || u.email.toLowerCase().includes(t)
    );
  }
  estaAtrasado(dt: string|null): boolean {
    return !!dt && new Date(dt) < new Date();
  }

  // banirUsuario(email: string): void {
  //   if (confirm(`Tem certeza que deseja banir o usuário ${email}?`)) {
  //     this.usuarioService.banirUsuario(email).subscribe({
  //       next: () => {
  //         this.toastrService.success('Usuário Banido com sucesso!')
  //         this.carregarUsuarios();
  //       },
  //       error: (err) => {
  //         console.error(err);
  //         this.toastrService.error('Erro ao banir Usuário')
  //       }
  //     });
  //   }
  // }

  montarDashboard(): void {
    const mapaLivros: Record<string, { quantidade: number, capa: string }> = {};
    const mapaUsuarios: Record<string, { totalAtrasos: number, fotoPerfil: string }> = {};
    const mapaCategorias: Record<string, number> = {};

    this.totalUsuarios = this.usuarios.length;
    this.totalLivros = this.livros.length;
    this.emprestimosAtivos = this.emprestimos.filter(e => !e.dataDevolucao).length;
    this.livrosDisponiveis = this.livros.filter(l => l.disponibilidade).length;

    this.emprestimos.forEach(emp => {
      const titulo = emp.livro?.titulo;
      const capa = emp.livro?.capa;
      if (titulo && capa) {
        mapaLivros[titulo] = mapaLivros[titulo] || { quantidade: 0, capa };
        mapaLivros[titulo].quantidade += 1;
      }

      if (emp.estado === 'ATRASADO') {
        const nome = emp.usuario?.name;
        const fotoPerfil = emp.usuario?.fotoPerfil;
        if (nome && fotoPerfil) {
          mapaUsuarios[nome] = mapaUsuarios[nome] || { totalAtrasos: 0, fotoPerfil };
          mapaUsuarios[nome].totalAtrasos += 1;
        }
      }

      const cats = emp.livro?.categoria?.split(',') || [];
      cats.forEach((catRaw: string) => {
        const cat = catRaw.trim();
        if (cat) {
          mapaCategorias[cat] = (mapaCategorias[cat] || 0) + 1;
        }
      });
    });

    this.livrosMaisEmprestados = Object
      .entries(mapaLivros)
      .map(([titulo, obj]: any) => ({ titulo, quantidade: obj.quantidade, capa: obj.capa }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 5);

    this.usuariosMaisAtrasos = Object
      .entries(mapaUsuarios)
      .map(([name, obj]: any) => ({ name, totalAtrasos: obj.totalAtrasos, fotoPerfil: obj.fotoPerfil }))
      .sort((a, b) => b.totalAtrasos - a.totalAtrasos)
      .slice(0, 5);

    this.categoriasMaisPopulares = Object
      .entries(mapaCategorias)
      .map(([categoria, quantidade]) => ({ categoria, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 5);
  }



  openBanirModal(email: string, name?: string): void {
    this.usuarioParaBanir = { email, name };
    this.showBanirModal = true;
  }

  closeBanirModal(): void {
    this.showBanirModal = false;
  }

  confirmarBanimento(): void {
    const email = this.usuarioParaBanir.email;
    this.usuarioService.banirUsuario(email).subscribe({
      next: () => {
        this.toastrService.success('Usuário Banido com sucesso!');
        this.carregarUsuarios();
        this.closeBanirModal();
      },
      error: (err) => {
        console.error(err);
        this.toastrService.error('Erro ao banir Usuário');
      }
    });
  }


  logout() { this.usuarioService.clearUsuario(); this.router.navigate(['/login']); }


  openCreate(): void {
    this.modalLivro = { titulo:'', autores:'', editora:'', categoria:'',
      capa:'', data_publicacao:'', numeroPaginas:0, qtde_livros:1,
      disponibilidade:true, descricao:'' };
    this.showCreateModal = true;
  }
  closeCreate()      { this.showCreateModal = false; }
  confirmCreate(): void {
    this.novoLivro = this.modalLivro;
    this.adicionarLivro();
    this.closeCreate();
  }

  openEdit(l: Livro): void {
    const toISO = (d: any) =>
      d ? new Date(d).toISOString().slice(0,10) : '';
    this.modalLivro = { ...l, data_publicacao: toISO(l.data_publicacao) };
    this.showEditModal = true;
  }
  closeEdit()       { this.showEditModal  = false; }
  confirmEdit(): void {
    this.editarLivro(this.modalLivro as Livro);
    this.closeEdit();
  }

  openDelete(l: Livro): void {
    this.modalLivro      = l;
    this.showDeleteModal = true;
  }
  closeDelete()     { this.showDeleteModal = false; }
  confirmDelete(): void {
    this.deletarLivro(this.modalLivro as Livro);
    this.closeDelete();
  }
}
