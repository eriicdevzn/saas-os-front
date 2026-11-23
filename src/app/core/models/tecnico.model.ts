export interface Tecnico {
  id: number;
  nome: string;
  telefone?: string;
  especialidade?: string;
  ativo: boolean;
}

export type TecnicoRequest = Omit<Tecnico, 'id' | 'ativo'>;
