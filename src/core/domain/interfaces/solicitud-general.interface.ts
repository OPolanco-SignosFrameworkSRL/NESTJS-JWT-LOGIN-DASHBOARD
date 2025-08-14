
export interface ISolicitudGeneralFilters {
  solicitada_porid?: number;
  solicitud_tipo?: number;
  solicitud_status?: number;
  departamento?: string;
  //starDate?: string;
  //endDate?: string;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  usuarionombre?: string;
  page?: number;
  limit?: number;
}

