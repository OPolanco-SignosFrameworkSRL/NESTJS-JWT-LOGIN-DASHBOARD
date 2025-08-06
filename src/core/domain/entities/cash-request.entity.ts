export class CashRequest {
  constructor(
    public readonly id: number,
    public readonly fechacreada: Date,
    public readonly solicitada_porid: number, // ID del usuario que solicita
    public readonly monto_solicitado: number, // Monto solicitado
    public readonly solicitud_tipo: number, // Tipo de solicitud
    public readonly solicitud_status: number, // Estado de la solicitud
    public readonly divicionid: number, // ID de la división
    public readonly tipo_pago: number, // Tipo de pago
    public readonly produccion: number, // Campo de producción
    public readonly autorizado_porid?: number, // ID del usuario que autorizó
    public readonly fecha_requerida?: Date, // Fecha requerida
    public readonly departamento?: string, // Departamento
    public readonly concepto?: string, // Concepto de la solicitud
    public readonly fecha_orden_prod?: Date, // Fecha de orden de producción
    public readonly num_orden_prod?: string, // Número de orden de producción
    public readonly num_ticket_prod?: string, // Número de ticket de producción
    public readonly nombre_cliente?: string, // Nombre del cliente
    public readonly solicitud_numero?: string, // Número de solicitud
    public readonly fecha_rechazada?: Date, // Fecha de rechazo
    public readonly razon_rechazon?: string, // Razón de rechazo
    public readonly usuarionombre?: string, // Nombre del usuario solicitante
    public readonly autorizadopor_nombre?: string, // Nombre del usuario autorizador
    public readonly cedula?: string, // Cédula del usuario
    public readonly division_nombre?: string, // Nombre de la división
    public readonly estatus_desc?: string, // Descripción del estado
    public readonly estatus_icon?: string, // Ícono del estado
    public readonly solicitud_tipo_desc?: string, // Descripción del tipo de solicitud
    public readonly tipo_pago_desc?: string, // Descripción del tipo de pago
    public readonly verificadopor_nombre?: string // Nombre del usuario verificador
  ) {}
} 