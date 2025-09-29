import { Inject } from '@nestjs/common';
import type { Payment } from 'src/Payment/Domain/entities/payment.entity';
import type { IPaymentRepository } from 'src/Payment/Domain/interfaces/payment.repository';
import type { InputPaymentStatusDto, OutputPaymentStatusDto } from '../dtos/payment-status.dto';

export class CheckPaymentStatusUseCase {
  constructor(
     @Inject('IPaymentRepository')
    private readonly paymentRepository: IPaymentRepository
  ) {}
  async execute(input: InputPaymentStatusDto): Promise<OutputPaymentStatusDto> {
    if (!input.paymentId) {
      throw new Error('Payment ID is required');
    }
    return this.paymentRepository.checkPaymentStatus(input.paymentId);
  }
}
