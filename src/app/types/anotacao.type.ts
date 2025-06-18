export interface Anotacao {
  idAnotacao?: number;
  idLivro: string;
  id: string;
  nota: string;
  pagina: number;
  dataNota: string;
  avaliacao:number;
  livro?: {
    titulo: string;
    capa: string;
  };
}
