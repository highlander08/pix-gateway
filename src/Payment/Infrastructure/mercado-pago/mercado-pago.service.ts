import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import MercadoPagoConfig, { Payment as MercadoPagoPayment } from 'mercadopago';
import { InputCreatePixDto } from '../../../Payment/Application/dtos/create-pix.dto';
import type { OutputPaymentStatusDto } from '../../../Payment/Application/dtos/payment-status.dto';
import { Payment } from '../../../Payment/Domain/entities/payment.entity';
import { IPaymentRepository } from '../../../Payment/Domain/interfaces/payment.repository';

@Injectable()
export class MercadoPagoService implements IPaymentRepository {
  private readonly mercadopago: MercadoPagoConfig;
  constructor(private config: ConfigService) {
    if (!this.config) {
      throw new Error('ConfigService is not available');
    }
    const accessToken = this.config.get<string>('MP_ACCESS_TOKEN');
    if (!accessToken) {
      throw new Error(
        'MP_ACCESS_TOKEN is not defined in environment variables',
      );
    }
    this.mercadopago = new MercadoPagoConfig({
      accessToken,
      options: { timeout: 5000 },
    });
  }
  async createPix(input: InputCreatePixDto) {
    try {
      const paymentData = {
        transaction_amount: Number(input.amount),
        description: input.description,
        payment_method_id: 'pix',
        payer: { email: input.email },
      };
      const paymentClient = new MercadoPagoPayment(this.mercadopago);
      const mpResponse = await paymentClient.create({ body: paymentData });

      const pixCode =
        mpResponse.point_of_interaction?.transaction_data?.qr_code;
      const qrCodeBase64 =
        mpResponse.point_of_interaction?.transaction_data?.qr_code_base64;

      if (!pixCode || !qrCodeBase64) {
        throw new Error('Failed to generate Pix code');
      }

      if (!mpResponse.id || !mpResponse.status) {
        throw new Error('Invalid response from MercadoPago');
      }
      return new Payment(
        mpResponse.id.toString(),
        input.amount,
        input.description,
        input.email,
        mpResponse.status,
        pixCode,
        qrCodeBase64,
      );
    } catch (error) {
      throw new Error(`MercadoPago Pix creation failed: ${error.message}`);
    }
  }
  async checkPaymentStatus(paymentId: string): Promise<OutputPaymentStatusDto> {
    try {
      const paymentClient = new MercadoPagoPayment(this.mercadopago);
      const payment = await paymentClient.get({ id: paymentId });

      if (!payment || !payment.id || !payment.status) {
        throw new Error('Invalid response from MercadoPago');
      }

      return {
        status: payment.status,
        paymentId: payment.id.toString(),
      };
    } catch (error) {
      throw new Error(`Failed to check payment status: ${error.message}`);
    }
  }
}
