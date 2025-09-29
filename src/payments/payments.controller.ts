// import { Controller, Post, Body } from '@nestjs/common';
// import { PaymentService } from './payments.service';
// // import { PaymentService } from './payment.service';

// @Controller('payment')
// export class PaymentController {
//   constructor(private readonly paymentService: PaymentService) {}

//   @Post('pix')
//   async createPix(@Body() body: { amount: number; description: string }) {
//     return this.paymentService.createPix(body.amount, body.description);
//   }
// }
// src/payment/payment.controller.ts - VERSÃO CORRIGIDA
import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import  { PaymentService } from './payments.service';
// import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('pix')
  async createPix(@Body() body: { amount: number; description: string; email: string }) {
    if (!body.amount || !body.description || !body.email) {
      throw new Error('Amount, description e email são obrigatórios');
    }
    
    return this.paymentService.createPix(body.amount, body.description, body.email);
  }

  @Get('status/:paymentId')
  async getPaymentStatus(@Param('paymentId') paymentId: string) {
    return this.paymentService.checkPaymentStatus(paymentId);
  }
}
