export interface Livro {
  id_livro: string;
  isbn?: string;
  titulo: string;
  editora?: string;
  data_publicacao?: string;
  autores: string;
  descricao?: string;
  capa: string;
  disponibilidade?: boolean;
  numeroPaginas?: number;
  qtde_livros?: number;
  categoria?: string;
}

interface Nota {
  texto: string;
  data: Date;
  pagina?: number;
}

export interface LivroEstante extends Livro {
  avaliacao?: number;
  status: 'favorito' | 'emprestado' | 'desejado';
  notas?: Nota[];
  data_devolucao?: string;
}
