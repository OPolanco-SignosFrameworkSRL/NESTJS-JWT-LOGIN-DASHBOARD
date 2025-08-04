export class CashRequest {
  constructor(
    public readonly id: number,
    public readonly requestedBy: number, // ID del usuario que solicita
    public readonly requestedAmount: number,
    public readonly requestType: string, // COMPRA DE MATERIALES, etc.
    public readonly division: string, // ADMINISTRACION, etc.
    public readonly paymentType: string, // EFECTIVO, etc.
    public readonly status: string, // PENDIENTE, APROBADO, RECHAZADO
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly approvedBy?: number,
    public readonly approvedAt?: Date,
    public readonly notes?: string,
    public readonly valid: string = '1'
  ) {}
} 