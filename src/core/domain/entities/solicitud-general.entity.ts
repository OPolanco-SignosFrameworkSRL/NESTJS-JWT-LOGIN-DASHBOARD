export class SolicitudGeneral {
  constructor(
    public readonly id: number,
    public readonly fechacreada: Date,
    public readonly solicitada_porid: number,
    public readonly solicitud_tipo: number,
    public readonly solicitud_status: number,
    public readonly monto_solicitado: number,
    public readonly departamento: string,
    public readonly concepto: string,
    public readonly usuarionombre: string,
    public readonly produccion: number,
    public readonly razon_rechazo?: string
  ) {}

  static fromDatabase(data: any): SolicitudGeneral {
    return new SolicitudGeneral(
      data.id,
      new Date(data.fechacreada),
      data.solicitada_porid,
      data.solicitud_tipo,
      data.solicitud_status,
      Number(data.monto_solicitado),
      data.departamento,
      data.concepto,
      data.usuarionombre,
      data.produccion,
      data.razon_rechazo
    );
  }
} 