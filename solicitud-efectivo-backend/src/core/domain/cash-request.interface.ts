import { UserRole } from './user.interface';

export interface ICashRequestResponse {
  id: number;
  fechacreada: Date;
  solicitada_porid: number;
  solicitada_porid_user?: {
    id: number;
    nombre: string;
    apellido: string;
    cedula: string;
  };
  solicitud_tipo: number;
  solicitud_status: number;
  autorizado_porid?: number;
  autorizado_porid_user?: {
    id: number;
    nombre: string;
    apellido: string;
    cedula: string;
  };
  monto_solicitado: number;
  fecha_requerida?: Date;
  divicionid: number;
  departamento?: string;
  concepto?: string;
  fecha_orden_prod?: Date;
  num_orden_prod?: string;
  num_ticket_prod?: string;
  nombre_cliente?: string;
  solicitud_numero?: string;
  fecha_rechazada?: Date;
  tipo_pago: number;
  razon_rechazon?: string;
  usuarionombre?: string;
  autorizadopor_nombre?: string;
  cedula?: string;
  division_nombre?: string;
  estatus_desc?: string;
  estatus_icon?: string;
  solicitud_tipo_desc?: string;
  produccion: number;
  tipo_pago_desc?: string;
  verificadopor_nombre?: string;
}

export interface ICashRequestFilters {
  status?: number;
  division?: number;
  requestType?: number;
  requestedBy?: number;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
}

export interface ICashRequestStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  verifiedRequests: number;
  totalAmount: number;
  requestsByStatus: Array<{ status: number; count: number }>;
  requestsByDivision: Array<{ division: number; count: number }>;
  requestsByType: Array<{ requestType: number; count: number }>;
}

export enum CashRequestStatus {
  PENDIENTE = 1,
  APROBADA = 2,
  AUTORIZADO = 3,
  RECHAZADA = 4,
  DESEMBOLSADO = 5,
  VERIFICADA = 6,
}

export enum CashRequestType {
  // Tipos que NO aparecen en la vista (produccion = 1)
  COMPRA_MUESTRA_CLIENTE = 1,
  TRABAJO_CLIENTE_SUBCONTRATADO = 2,
  
  // Tipos que SÍ aparecen en la vista (produccion = 0)
  COMPRA_MATERIALES = 3,
  COMPRA_SUMINISTROS = 4,
  COMPRA_HERRAMIENTAS = 5,
  SOLICITUD_DIETA = 6,
  MANTENIMIENTO_REPARACION = 7,
  OTROS = 8,
  DIETA_PRODUCCION = 9,
  MANTENIMIENTO_VENDEDORES = 10,
  COMPRAS_MATERIALES_ORDENES = 11,
  SOLICITUD_CHEQUE = 12,
  ESTUDIO_1428 = 13,
  IMPRENTA = 15,
  TRODOM = 16,
  PRODUCCION_PISO_2 = 17,
  SERVICIO_CACARREO = 19,
  VIAJE_SANTIAGO = 20,
  PRUEBA = 21
}

export enum PaymentType {
  CASH = 1,
  TRANSFER = 2,
  CHECK = 3,
  CARD = 4
}

export enum Division {
  ADMINISTRATION = 1,
  PRODUCTION = 2,
  SALES = 3,
  MARKETING = 4,
  IT = 5,
  HR = 6,
  FINANCE = 7
} 