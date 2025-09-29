import { Inject } from '@nestjs/common';
import type { IPaymentRepository } from 'src/Payment/Domain/interfaces/payment.repository';
import type { InputCreatePixDto, OutputCreatePixDto } from '../dtos/create-pix.dto';

export class CreatePixUseCase {
  constructor(
    @Inject('IPaymentRepository')
    private readonly paymentRepository: IPaymentRepository,
  ) {}
  async execute(input: InputCreatePixDto): Promise<OutputCreatePixDto> {
    if (!input.amount || !input.description || !input.email) {
      throw new Error('Missing required fields');
    }

    return this.paymentRepository.createPix(input);
  }
}
