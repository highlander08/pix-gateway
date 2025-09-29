import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { CreatePixUseCase } from 'src/Payment/Application/use-cases/create-pix.use-case';
import { CheckPaymentStatusUseCase } from 'src/Payment/Application/use-cases/check-payment-status.use-case';
import { PaymentsModule } from './payment.module';
import  { PaymentController } from './payment.controller';
import  { MercadoPagoService } from '../mercado-pago/mercado-pago.service';

describe('PaymentsModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [PaymentsModule],
    }).compile();
  });

  it('deve compilar o módulo sem erros', () => {
    expect(module).toBeDefined();
  });

  it('deve injetar o PaymentController', () => {
    const controller = module.get<PaymentController>(PaymentController);
    expect(controller).toBeInstanceOf(PaymentController);
  });

  it('deve injetar o MercadoPagoService', () => {
    const service = module.get<MercadoPagoService>(MercadoPagoService);
    expect(service).toBeInstanceOf(MercadoPagoService);
  });

  it('deve injetar o CreatePixUseCase', () => {
    const useCase = module.get<CreatePixUseCase>(CreatePixUseCase);
    expect(useCase).toBeInstanceOf(CreatePixUseCase);
  });

  it('deve injetar o CheckPaymentStatusUseCase', () => {
    const useCase = module.get<CheckPaymentStatusUseCase>(CheckPaymentStatusUseCase);
    expect(useCase).toBeInstanceOf(CheckPaymentStatusUseCase);
  });

  it('deve exportar o MercadoPagoService, CreatePixUseCase e CheckPaymentStatusUseCase', async () => {
    const exportTestModule = await Test.createTestingModule({
      imports: [ConfigModule, PaymentsModule],
    }).compile();

    expect(exportTestModule.get(MercadoPagoService)).toBeInstanceOf(MercadoPagoService);
    expect(exportTestModule.get(CreatePixUseCase)).toBeInstanceOf(CreatePixUseCase);
    expect(exportTestModule.get(CheckPaymentStatusUseCase)).toBeInstanceOf(CheckPaymentStatusUseCase);
  });
});
