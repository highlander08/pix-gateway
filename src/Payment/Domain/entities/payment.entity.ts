// src/payment/domain/entities/payment.entity.ts
export class Payment {
  constructor(
    public readonly id: string,
    public readonly amount: number,
    public readonly description: string,
    public readonly email: string,
    public readonly status: string,
    public readonly pixCode?: string,
    public readonly qrCodeBase64?: string,
  ) {
    if (amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }
    if (!description) {
      throw new Error('Description is required');
    }
    if (!email.includes('@')) {
      throw new Error('Invalid email format');
    }
  }
  // Nova regra de negócio: verificar se o pagamento está concluído
  isPaid(): boolean {
    return (
      this.status.toLowerCase() === 'paid' ||
      this.status.toLowerCase() === 'concluded'
    );
  }
}
