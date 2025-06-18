export interface Emprestimo {
  idEmprestimo: number;
  idLivro: string;
  idUsuario: string;
  id: string;
  name: string;
  dataEmprestimo : string;
  dataPrevistaDevolucao : string;
  dataDevolucao?: string | null;
  renovacoes: number;
  estado: string;
  livro?: {
    titulo: string;
    capa: string;
  };
  usuario?: {
    name: string;
    email: string;
  };
}
