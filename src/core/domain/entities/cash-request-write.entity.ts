export class CashRequestWrite {
  constructor(
    public readonly id: number,
    public readonly requestedBy: number,
    public readonly requestedAmount: number,
    public readonly requestType: string,
    public readonly division: string,
    public readonly paymentType: string,
    public readonly status: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly approvedBy?: number,
    public readonly approvedAt?: Date,
    public readonly notes?: string,
    public readonly valid: string = '1',
    public readonly deletedAt?: Date,
    public readonly deletedBy?: number
  ) {}
} 