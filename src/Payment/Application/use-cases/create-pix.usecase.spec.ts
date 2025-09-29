// create-pix.usecase.spec.ts
// import { CreatePixUseCase } from '../create-pix.usecase';

import { CreatePixUseCase } from './create-pix.use-case';

describe('CreatePixUseCase', () => {
  let mockPaymentRepository: any;
  let createPixUseCase: CreatePixUseCase;

  beforeEach(() => {
    mockPaymentRepository = {
      createPix: jest.fn(),
    };
    createPixUseCase = new CreatePixUseCase(mockPaymentRepository);
  });

  it('should throw error if required fields are missing', async () => {
    await expect(
      createPixUseCase.execute({ amount: 0, description: '', email: '' }),
    ).rejects.toThrow('Missing required fields');
  });

  it('should call repository.createPix with correct input', async () => {
    const input = {
      amount: 200,
      description: 'Curso Node',
      email: 'teste@email.com',
    };
    const output = { id: '123', ...input, pixCode: 'abc', qrCodeBase64: 'xyz' };
    mockPaymentRepository.createPix.mockResolvedValue(output);

    const result = await createPixUseCase.execute(input);

    expect(mockPaymentRepository.createPix).toHaveBeenCalledWith(input);
    expect(result).toEqual(output);
  });
});
