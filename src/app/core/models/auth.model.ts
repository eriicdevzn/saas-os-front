export type Perfil = 'ADMINISTRADOR' | 'ATENDENTE' | 'TECNICO' | 'FINANCEIRO';

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  usuarioId: number;
  empresaId: number;
  nome: string;
  email: string;
  perfil: Perfil;
}
