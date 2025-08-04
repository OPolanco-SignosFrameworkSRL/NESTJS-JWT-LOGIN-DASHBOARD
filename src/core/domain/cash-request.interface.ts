import { UserRole } from './user.interface';

export interface ICashRequestResponse {
  id: number;
  requestedBy: number;
  requestedByUser?: {
    id: number;
    nombre: string;
    apellido: string;
    cedula: string;
  };
  requestedAmount: number;
  requestType: string;
  division: string;
  paymentType: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  approvedBy?: number;
  approvedByUser?: {
    id: number;
    nombre: string;
    apellido: string;
    cedula: string;
  };
  approvedAt?: Date;
  notes?: string;
  valid: string;
  deletedAt?: Date;
  deletedBy?: number;
}

export interface ICashRequestFilters {
  status?: string;
  division?: string;
  requestType?: string;
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
  totalAmount: number;
  requestsByStatus: Array<{ status: string; count: number }>;
  requestsByDivision: Array<{ division: string; count: number }>;
  requestsByType: Array<{ requestType: string; count: number }>;
}

export enum CashRequestStatus {
  PENDING = 'PENDIENTE',
  APPROVED = 'APROBADO',
  REJECTED = 'RECHAZADO',
  CANCELLED = 'CANCELADO'
}

export enum CashRequestType {
  MATERIAL_PURCHASE = 'COMPRA DE MATERIALES',
  EQUIPMENT = 'COMPRA DE EQUIPOS',
  SERVICES = 'PAGO DE SERVICIOS',
  TRAVEL = 'GASTOS DE VIAJE',
  MAINTENANCE = 'MANTENIMIENTO',
  OTHER = 'OTROS'
}

export enum PaymentType {
  CASH = 'EFECTIVO',
  TRANSFER = 'TRANSFERENCIA',
  CHECK = 'CHEQUE',
  CARD = 'TARJETA'
}

export enum Division {
  ADMINISTRATION = 'ADMINISTRACION',
  PRODUCTION = 'PRODUCCION',
  SALES = 'VENTAS',
  MARKETING = 'MARKETING',
  IT = 'TECNOLOGIA',
  HR = 'RECURSOS HUMANOS',
  FINANCE = 'FINANZAS'
} 