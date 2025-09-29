// ✅ Mock explícito do SDK mercadopago
const createMock = jest.fn();
const getMock = jest.fn();

jest.mock('mercadopago', () => {
  return {
    __esModule: true,
    default: jest.fn(), // MercadoPagoConfig
    Payment: jest.fn().mockImplementation(() => ({
      create: createMock,
      get: getMock,
    })),
  };
});

import MercadoPagoConfig, { Payment as MercadoPagoPayment } from 'mercadopago';
import { Test, TestingModule } from '@nestjs/testing';
// import { MercadoPagoService } from '../mercado-pago.service';
import { ConfigService } from '@nestjs/config';
import { Payment } from '../../../Payment/Domain/entities/payment.entity';
import  { MercadoPagoService } from './mercado-pago.service';

describe('MercadoPagoService', () => {
  let service: MercadoPagoService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MercadoPagoService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('fake_access_token'),
          },
        },
      ],
    }).compile();

    service = module.get<MercadoPagoService>(MercadoPagoService);
  });

  it('deve criar um Pix com sucesso', async () => {
    // ✅ Agora createMock é um jest.fn() e podemos usar mockResolvedValue
    createMock.mockResolvedValue({
      id: 123,
      status: 'pending',
      point_of_interaction: {
        transaction_data: {
          qr_code: 'pix-code-123',
          qr_code_base64: 'base64-qr',
        },
      },
    });

    const result = await service.createPix({
      amount: 100,
      description: 'Teste Pix',
      email: 'cliente@email.com',
    });

    expect(result).toBeInstanceOf(Payment);
    expect(result.id).toBe('123');
    expect(result.status).toBe('pending');
    expect(createMock).toHaveBeenCalledTimes(1);
  });
});
