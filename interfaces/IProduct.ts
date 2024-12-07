import { DataTableItem } from "@/app/admin/dashboard/stock/data-table";

export interface IProduct extends DataTableItem{
  _id: string;
  precioDeLista: number;
  precioAlPublico: number;
  marca?: string;
  categoria: string;
  nombre: string;
  porcentajeGanancia?: number;
}
