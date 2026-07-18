export interface JwtClientePayload {
  sub: number;
  email: string;
  nombre: string;
  tipo: 'cliente';
}
