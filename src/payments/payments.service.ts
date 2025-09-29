// import { Injectable } from '@nestjs/common';
// import MercadoPagoConfig, { Payment as MercadoPagoPayment } from 'mercadopago';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class PaymentService {
//   private readonly mercadopago: MercadoPagoConfig;

//   constructor(private config: ConfigService) {
//     const accessToken = this.config.get<string>('MP_ACCESS_TOKEN');
//     if (!accessToken) {
//       throw new Error('MP_ACCESS_TOKEN não está definido nas variáveis de ambiente');
//     }

//     // Inicializar o cliente do Mercado Pago
//     this.mercadopago = new MercadoPagoConfig({
//       accessToken,
//     });
//   }

//   async createPix(amount: number, description: string) {
//     try {
//       const paymentData = {
//         transaction_amount: Number(amount),
//         description,
//         payment_method_id: 'pix',
//         payer: {
//           email: 'payer@example.com', // Pode ser dummy ou dinâmico
//         },
//       };

//       // Criar o pagamento usando MercadoPagoPayment
//       const paymentClient = new MercadoPagoPayment(this.mercadopago);
//       const mpResponse = await paymentClient.create({ body: paymentData });

//       // Segurança: verifica se point_of_interaction existe
//       const pixCode =
//         mpResponse.point_of_interaction?.transaction_data?.qr_code ?? null;

//       if (!pixCode) {
//         throw new Error('PIX code não retornado pelo Mercado Pago');
//       }

//       const status = mpResponse.status;

//       return { pixCode, status };
//     } catch (error) {
//       throw new Error(`Falha ao criar pagamento PIX: ${error.message}`);
//     }
//   }
// }
// src/payment/payment.service.ts - VERSÃO CORRIGIDA
import { Injectable } from '@nestjs/common';
import MercadoPagoConfig, { Payment as MercadoPagoPayment } from 'mercadopago';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  private readonly mercadopago: MercadoPagoConfig;

  constructor(private config: ConfigService) {
    const accessToken = this.config.get<string>('MP_ACCESS_TOKEN');
    if (!accessToken) {
      throw new Error(
        'MP_ACCESS_TOKEN não está definido nas variáveis de ambiente',
      );
    }

    this.mercadopago = new MercadoPagoConfig({
      accessToken,
      options: { timeout: 5000 },
    });
  }

  async createPix(amount: number, description: string, email: string) {
    try {
      const paymentData = {
        transaction_amount: Number(amount),
        description: description,
        payment_method_id: 'pix',
        payer: {
          email: email,
        },
      };

      const paymentClient = new MercadoPagoPayment(this.mercadopago);
      const mpResponse = await paymentClient.create({ body: paymentData });

      const pixCode =
        mpResponse.point_of_interaction?.transaction_data?.qr_code;
      const qrCodeBase64 =
        mpResponse.point_of_interaction?.transaction_data?.qr_code_base64;

      if (!pixCode) {
        throw new Error('PIX code não retornado pelo Mercado Pago');
      }

      if (!mpResponse.id) {
        throw new Error('ID do pagamento não retornado pelo Mercado Pago');
      }

      return {
        pixCode,
        qrCodeBase64,
        status: mpResponse.status,
        paymentId: mpResponse.id,
        transactionId: mpResponse.id.toString(),
      };
    } catch (error) {
      throw new Error(`Falha ao criar pagamento PIX: ${error.message}`);
    }
  }

  async checkPaymentStatus(paymentId: string) {
    try {
      const paymentClient = new MercadoPagoPayment(this.mercadopago);
      const payment = await paymentClient.get({ id: paymentId });

      return {
        status: payment.status,
        transactionId: payment.id,
        amount: payment.transaction_amount,
        description: payment.description,
      };
    } catch (error) {
      throw new Error(`Erro ao verificar pagamento: ${error.message}`);
    }
  }
}
