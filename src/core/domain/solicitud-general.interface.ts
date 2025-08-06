export interface ISolicitudGeneral {
  id: number;
  fechacreada: Date;
  solicitada_porid: number;
  solicitud_tipo: number;
  solicitud_status: number;
  monto_solicitado: number;
  departamento: string;
  concepto: string;
  razon_rechazo?: string;
  usuarionombre: string;
  produccion: number;
}

export interface ISolicitudGeneralResponse {
  id: number;
  fechacreada: Date;
  solicitada_porid: number;
  solicitud_tipo: number;
  solicitud_status: number;
  monto_solicitado: number;
  departamento: string;
  concepto: string;
  razon_rechazo?: string;
  usuarionombre: string;
  produccion: number;
}

export interface ISolicitudGeneralFilters {
  solicitada_porid?: number;
  solicitud_tipo?: number;
  solicitud_status?: number;
  departamento?: string;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  usuarionombre?: string;
}

export interface ISolicitudGeneralStats {
  totalSolicitudes: number;
  solicitudesPorStatus: any[];
  solicitudesPorDepartamento: any[];
  montoTotal: number;
}

export enum SolicitudStatus {
  PENDIENTE = 1,
  APROBADA = 2,
  RECHAZADA = 3,
  EN_PROCESO = 4,
  COMPLETADA = 5
}

export enum SolicitudTipo {
  COMPRA_MATERIALES = 1,
  SERVICIOS = 2,
  EQUIPOS = 3,
  VIAJES = 4,
  OTROS = 5
} 