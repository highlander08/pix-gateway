import { Payment } from './payment.entity';

describe('Payment Entity', () => {

  it('should create a payment with valid data', () => {
    const payment = new Payment('123', 200, 'Curso Node', 'cliente@email.com', 'pending');
    
    expect(payment.id).toBe('123');
    expect(payment.amount).toBe(200);
    expect(payment.description).toBe('Curso Node');
    expect(payment.email).toBe('cliente@email.com');
    expect(payment.status).toBe('pending');
  });

  it('should throw error if amount is <= 0', () => {
    expect(() => new Payment('123', 0, 'Curso Node', 'cliente@email.com', 'pending'))
      .toThrow('Amount must be greater than zero');
  });

  it('should throw error if description is empty', () => {
    expect(() => new Payment('123', 200, '', 'cliente@email.com', 'pending'))
      .toThrow('Description is required');
  });

  it('should throw error if email is invalid', () => {
    expect(() => new Payment('123', 200, 'Curso Node', 'clienteemail.com', 'pending'))
      .toThrow('Invalid email format');
  });

  describe('isPaid method', () => {
    it('should return true if status is "paid"', () => {
      const payment = new Payment('123', 200, 'Curso Node', 'cliente@email.com', 'paid');
      expect(payment.isPaid()).toBe(true);
    });

    it('should return true if status is "concluded"', () => {
      const payment = new Payment('123', 200, 'Curso Node', 'cliente@email.com', 'concluded');
      expect(payment.isPaid()).toBe(true);
    });

    it('should return false for other statuses', () => {
      const payment = new Payment('123', 200, 'Curso Node', 'cliente@email.com', 'pending');
      expect(payment.isPaid()).toBe(false);
    });

    it('should be case-insensitive', () => {
      const payment = new Payment('123', 200, 'Curso Node', 'cliente@email.com', 'PAID');
      expect(payment.isPaid()).toBe(true);
    });
  });

});
