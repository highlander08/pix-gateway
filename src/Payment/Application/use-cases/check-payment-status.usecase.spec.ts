// check-payment-status.usecase.spec.ts
// import { CheckPaymentStatusUseCase } from '../check-payment-status.usecase';

import { CheckPaymentStatusUseCase } from './check-payment-status.use-case';

describe('CheckPaymentStatusUseCase', () => {
  let mockPaymentRepository: any;
  let checkPaymentStatusUseCase: CheckPaymentStatusUseCase;

  beforeEach(() => {
    mockPaymentRepository = {
      checkPaymentStatus: jest.fn(),
    };
    checkPaymentStatusUseCase = new CheckPaymentStatusUseCase(
      mockPaymentRepository,
    );
  });

  it('should throw error if paymentId is missing', async () => {
    await expect(
      checkPaymentStatusUseCase.execute({ paymentId: '' }),
    ).rejects.toThrow('Payment ID is required');
  });

  it('should call repository.checkPaymentStatus with correct paymentId', async () => {
    const paymentId = '123';
    const output = { paymentId, status: 'paid' };
    mockPaymentRepository.checkPaymentStatus.mockResolvedValue(output);

    const result = await checkPaymentStatusUseCase.execute({ paymentId });

    expect(mockPaymentRepository.checkPaymentStatus).toHaveBeenCalledWith(
      paymentId,
    );
    expect(result).toEqual(output);
  });
});
