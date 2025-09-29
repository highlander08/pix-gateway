import { Test, TestingModule } from '@nestjs/testing';
// import { PaymentController } from '../payment.controller';
import { CreatePixUseCase } from 'src/Payment/Application/use-cases/create-pix.use-case';
import { CheckPaymentStatusUseCase } from 'src/Payment/Application/use-cases/check-payment-status.use-case';
import { InputCreatePixDto } from 'src/Payment/Application/dtos/create-pix.dto';
import { OutputPaymentStatusDto } from 'src/Payment/Application/dtos/payment-status.dto';
import  { PaymentController } from './payment.controller';

describe('PaymentController', () => {
  let controller: PaymentController;
  let createPixUseCase: CreatePixUseCase;
  let checkPaymentStatusUseCase: CheckPaymentStatusUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        {
          provide: CreatePixUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: CheckPaymentStatusUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
    createPixUseCase = module.get<CreatePixUseCase>(CreatePixUseCase);
    checkPaymentStatusUseCase = module.get<CheckPaymentStatusUseCase>(CheckPaymentStatusUseCase);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('createPix', () => {
    it('deve criar um pagamento PIX e retornar os dados', async () => {
      const input: InputCreatePixDto = {
        amount: 200,
        description: 'Teste de pagamento',
        email: 'cliente@email.com',
      };

      const mockOutput = {
        id: '123abc',
        amount: 200,
        description: 'Teste de pagamento',
        email: 'cliente@email.com',
        status: 'pending',
        pixCode: 'fake-pix-code',
        qrCodeBase64: 'base64img',
      };

      (createPixUseCase.execute as jest.Mock).mockResolvedValue(mockOutput);

      const result = await controller.createPix(input);

      expect(result).toEqual(mockOutput);
      expect(createPixUseCase.execute).toHaveBeenCalledTimes(1);
      expect(createPixUseCase.execute).toHaveBeenCalledWith(input);
    });
  });

  describe('checkPaymentStatus', () => {
    it('deve consultar o status do pagamento e retornar os dados', async () => {
      const paymentId = 'abc123xyz';

      const mockOutput: OutputPaymentStatusDto = {
        paymentId,
        status: 'approved',
      };

      (checkPaymentStatusUseCase.execute as jest.Mock).mockResolvedValue(mockOutput);

      const result = await controller.checkPaymentStatus(paymentId);

      expect(result).toEqual(mockOutput);
      expect(checkPaymentStatusUseCase.execute).toHaveBeenCalledTimes(1);
      expect(checkPaymentStatusUseCase.execute).toHaveBeenCalledWith({ paymentId });
    });
  });
});
