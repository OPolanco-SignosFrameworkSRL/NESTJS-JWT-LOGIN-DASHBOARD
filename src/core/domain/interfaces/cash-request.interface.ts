/**
 * Estados de las solicitudes de efectivo
 */
export enum CashRequestStatus {
  PENDIENTE = 1,
  APROBADA = 2,
  AUTORIZADO = 3,
  RECHAZADA = 4,
  DESEMBOLSADO = 5,
}

/**
 * Tipos de solicitudes de efectivo
 */
export enum CashRequestType {
  COMPRA_MATERIALES = 1,
  REEMBOLSO = 2,
  OTROS = 8,
}

/**
 * Tipos de pago
 */
export enum PaymentType {
  EFECTIVO = 1,
  TRANSFERENCIA = 2,
  CHEQUE = 3,
}

/**
 * Divisiones del sistema
 */
export enum Division {
  ADMINISTRACION = 1,
  TI = 2,
  VENTAS = 3,
  PRODUCCION = 4,
}

/**
 * Interfaz para la respuesta de solicitud de efectivo
 */
export interface ICashRequestResponse {
  id: number;
  fechacreada: Date;
  solicitada_porid: number;
  solicitud_tipo: CashRequestType;
  solicitud_status: CashRequestStatus;
  monto_solicitado: number;
  concepto: string;
  divicionid: number;
  tipo_pago: PaymentType;
  autorizado_porid?: number;
  fecha_requerida?: Date;
  departamento?: string;
  fecha_orden_prod?: Date;
  num_orden_prod?: string;
  num_ticket_prod?: string;
  nombre_cliente?: string;
  solicitud_numero?: string;
  fecha_rechazada?: Date;
  razon_rechazon?: string;
  produccion: boolean;
  usuarionombre?: string;
  autorizadopor_nombre?: string;
  cedula?: string;
  division_nombre?: string;
  estatus_desc?: string;
  estatus_icon?: string;
  solicitud_tipo_desc?: string;
  tipo_pago_desc?: string;
  verificadopor_nombre?: string;
}

/**
 * Interfaz para datos de creación de solicitud de efectivo
 */
export interface ICashRequestCreateData {
  solicitada_porid: number;
  solicitud_tipo: CashRequestType;
  monto_solicitado: number;
  concepto: string;
  divicionid: number;
  tipo_pago: PaymentType;
  fecha_requerida?: Date;
  departamento?: string;
  fecha_orden_prod?: Date;
  num_orden_prod?: string;
  num_ticket_prod?: string;
  nombre_cliente?: string;
  produccion?: boolean;
}

/**
 * Interfaz para datos de actualización de solicitud de efectivo
 */
export interface ICashRequestUpdateData {
  solicitud_tipo?: CashRequestType;
  monto_solicitado?: number;
  concepto?: string;
  divicionid?: number;
  tipo_pago?: PaymentType;
  fecha_requerida?: Date;
  departamento?: string;
  fecha_orden_prod?: Date;
  num_orden_prod?: string;
  num_ticket_prod?: string;
  nombre_cliente?: string;
  produccion?: boolean;
}

/**
 * Interfaz para filtros de solicitudes de efectivo
 */
export interface ICashRequestFilters {
  status?: CashRequestStatus;
  type?: CashRequestType;
  division?: Division;
  paymentType?: PaymentType;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  limit?: number;
  offset?: number;
}

/**
 * Interfaz para estadísticas de solicitudes de efectivo
 */
export interface ICashRequestStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  liquidated: number;
  totalAmount: number;
  averageAmount: number;
  byStatus: Record<CashRequestStatus, number>;
  byType: Record<CashRequestType, number>;
  byDivision: Record<Division, number>;
  byPaymentType: Record<PaymentType, number>;
}

/**
 * Interfaz para datos de aprobación de solicitud
 */
export interface ICashRequestApprovalData {
  autorizado_porid: number;
  razon_rechazon?: string;
}

/**
 * Interfaz para datos de rechazo de solicitud
 */
export interface ICashRequestRejectionData {
  autorizado_porid: number;
  razon_rechazon: string;
}
