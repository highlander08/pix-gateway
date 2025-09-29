import type { InputCreatePixDto } from 'src/Payment/Application/dtos/create-pix.dto';
import type { Payment } from '../entities/payment.entity';
import type { OutputPaymentStatusDto } from 'src/Payment/Application/dtos/payment-status.dto';

export interface IPaymentRepository {
  createPix(input: InputCreatePixDto): Promise<Payment>;
  checkPaymentStatus(paymentId: string): Promise<OutputPaymentStatusDto>;
}
