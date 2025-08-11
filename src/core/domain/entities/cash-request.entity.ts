import { CashRequestStatus, CashRequestType, PaymentType } from '../interfaces/cash-request.interface';

/**
 * Entidad de dominio CashRequest
 * Representa una solicitud de efectivo en el sistema de negocio
 * No depende de frameworks externos
 */
export class CashRequest {
  constructor(
    public readonly id: number,
    public readonly fechacreada: Date,
    public readonly solicitada_porid: number,
    public readonly solicitud_tipo: CashRequestType,
    public readonly solicitud_status: CashRequestStatus,
    public readonly monto_solicitado: number,
    public readonly concepto: string,
    public readonly divicionid: number,
    public readonly tipo_pago: PaymentType,
    public readonly autorizado_porid?: number,
    public readonly fecha_requerida?: Date,
    public readonly departamento?: string,
    public readonly fecha_orden_prod?: Date,
    public readonly num_orden_prod?: string,
    public readonly num_ticket_prod?: string,
    public readonly nombre_cliente?: string,
    public readonly solicitud_numero?: string,
    public readonly fecha_rechazada?: Date,
    public readonly razon_rechazon?: string,
    public readonly produccion: boolean = false,
  ) {}

  /**
   * Verifica si la solicitud está pendiente
   */
  isPending(): boolean {
    return this.solicitud_status === CashRequestStatus.PENDIENTE;
  }

  /**
   * Verifica si la solicitud está aprobada
   */
  isApproved(): boolean {
    return this.solicitud_status === CashRequestStatus.APROBADA;
  }

  /**
   * Verifica si la solicitud está rechazada
   */
  isRejected(): boolean {
    return this.solicitud_status === CashRequestStatus.RECHAZADA;
  }

  /**
   * Verifica si la solicitud está liquidada
   */
  isLiquidated(): boolean {
    return this.solicitud_status === CashRequestStatus.DESEMBOLSADO;
  }

  /**
   * Verifica si la solicitud es de producción
   */
  isProduction(): boolean {
    return this.produccion;
  }

  /**
   * Verifica si la solicitud puede ser aprobada
   */
  canBeApproved(): boolean {
    return this.isPending() && !this.isProduction();
  }

  /**
   * Verifica si la solicitud puede ser rechazada
   */
  canBeRejected(): boolean {
    return this.isPending();
  }

  /**
   * Verifica si la solicitud puede ser liquidada
   */
  canBeLiquidated(): boolean {
    return this.isApproved();
  }

  /**
   * Aprobar la solicitud
   */
  approve(autorizado_porid: number): CashRequest {
    if (!this.canBeApproved()) {
      throw new Error('La solicitud no puede ser aprobada');
    }

    return new CashRequest(
      this.id,
      this.fechacreada,
      this.solicitada_porid,
      this.solicitud_tipo,
      CashRequestStatus.APROBADA,
      this.monto_solicitado,
      this.concepto,
      this.divicionid,
      this.tipo_pago,
      autorizado_porid,
      this.fecha_requerida,
      this.departamento,
      this.fecha_orden_prod,
      this.num_orden_prod,
      this.num_ticket_prod,
      this.nombre_cliente,
      this.solicitud_numero,
      this.fecha_rechazada,
      this.razon_rechazon,
      this.produccion,
    );
  }

  /**
   * Rechazar la solicitud
   */
  reject(autorizado_porid: number, razon_rechazon: string): CashRequest {
    if (!this.canBeRejected()) {
      throw new Error('La solicitud no puede ser rechazada');
    }

    return new CashRequest(
      this.id,
      this.fechacreada,
      this.solicitada_porid,
      this.solicitud_tipo,
      CashRequestStatus.RECHAZADA,
      this.monto_solicitado,
      this.concepto,
      this.divicionid,
      this.tipo_pago,
      autorizado_porid,
      this.fecha_requerida,
      this.departamento,
      this.fecha_orden_prod,
      this.num_orden_prod,
      this.num_ticket_prod,
      this.nombre_cliente,
      this.solicitud_numero,
      new Date(),
      razon_rechazon,
      this.produccion,
    );
  }

  /**
   * Liquidar la solicitud
   */
  liquidate(): CashRequest {
    if (!this.canBeLiquidated()) {
      throw new Error('La solicitud no puede ser liquidada');
    }

    return new CashRequest(
      this.id,
      this.fechacreada,
      this.solicitada_porid,
      this.solicitud_tipo,
      CashRequestStatus.DESEMBOLSADO,
      this.monto_solicitado,
      this.concepto,
      this.divicionid,
      this.tipo_pago,
      this.autorizado_porid,
      this.fecha_requerida,
      this.departamento,
      this.fecha_orden_prod,
      this.num_orden_prod,
      this.num_ticket_prod,
      this.nombre_cliente,
      this.solicitud_numero,
      this.fecha_rechazada,
      this.razon_rechazon,
      this.produccion,
    );
  }

  /**
   * Obtiene el estado de la solicitud como string
   */
  getStatusText(): string {
    switch (this.solicitud_status) {
      case CashRequestStatus.PENDIENTE:
        return 'PENDIENTE';
      case CashRequestStatus.APROBADA:
        return 'APROBADA';
      case CashRequestStatus.RECHAZADA:
        return 'RECHAZADA';
      case CashRequestStatus.DESEMBOLSADO:
        return 'DESEMBOLSADO';
      default:
        return 'DESCONOCIDO';
    }
  }

  /**
   * Obtiene el tipo de solicitud como string
   */
  getTypeText(): string {
    switch (this.solicitud_tipo) {
      case CashRequestType.COMPRA_MATERIALES:
        return 'Compra de Materiales';
      case CashRequestType.REEMBOLSO:
        return 'Reembolso';
      case CashRequestType.OTROS:
        return 'Otros';
      default:
        return 'Desconocido';
    }
  }

  /**
   * Obtiene el tipo de pago como string
   */
  getPaymentTypeText(): string {
    switch (this.tipo_pago) {
      case PaymentType.EFECTIVO:
        return 'Efectivo';
      case PaymentType.TRANSFERENCIA:
        return 'Transferencia';
      case PaymentType.CHEQUE:
        return 'Cheque';
      default:
        return 'Desconocido';
    }
  }
} 