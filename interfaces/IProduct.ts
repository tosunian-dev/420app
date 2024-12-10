

export interface IProduct {
  _id: string;
  precioDeLista: number;
  precioAlPublico: number;
  marca?: string;
  categoria: string;
  nombre: string;
  porcentajeGanancia?: number;
}
