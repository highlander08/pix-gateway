import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CheckPaymentStatusUseCase } from 'src/Payment/Application/use-cases/check-payment-status.use-case';
import { CreatePixUseCase } from 'src/Payment/Application/use-cases/create-pix.use-case';
import { MercadoPagoService } from '../mercado-pago/mercado-pago.service';
import { PaymentController } from '../presentation/payment.controller';

@Module({
  imports: [ConfigModule], 
  controllers: [PaymentController],
  providers: [
    MercadoPagoService,
    {
      provide: 'IPaymentRepository',
      useClass: MercadoPagoService,
    },
    CreatePixUseCase,
    CheckPaymentStatusUseCase,
  ],
  exports: [MercadoPagoService, CreatePixUseCase, CheckPaymentStatusUseCase],
})
export class PaymentsModule {}
