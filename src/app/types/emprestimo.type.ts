export interface Emprestimo {
  idEmprestimo: number;
  idLivro: string;
  id: string; // id do usuário
  dataEmprestimo: string;
  dataPrevistaDevolucao: string;
  dataDevolucao?: string | null;
  renovacoes: number;
  estado: string;
  livro?: {
    titulo: string;
    capa: string;
  };
  usuario?: {
    fotoPerfil: string;
    name: string;
    email: string;
  };
}
