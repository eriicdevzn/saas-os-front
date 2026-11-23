export interface Servico {
  id: number;
  nome: string;
  descricao?: string;
  valorPadrao: number;
  ativo: boolean;
}

export type ServicoRequest = Omit<Servico, 'id' | 'ativo'>;
