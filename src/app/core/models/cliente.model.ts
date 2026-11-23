export interface Cliente {
  id: number;
  nome: string;
  documento?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  cidade?: string;
  uf?: string;
  ativo: boolean;
}

export type ClienteRequest = Omit<Cliente, 'id' | 'ativo'>;
