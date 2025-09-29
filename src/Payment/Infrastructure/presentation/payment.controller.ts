import { Body, Controller, Get, Injectable, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InputCreatePixDto, OutputCreatePixDto } from 'src/Payment/Application/dtos/create-pix.dto';
import { OutputPaymentStatusDto, type InputPaymentStatusDto } from 'src/Payment/Application/dtos/payment-status.dto';
import { CheckPaymentStatusUseCase } from 'src/Payment/Application/use-cases/check-payment-status.use-case';
import { CreatePixUseCase } from 'src/Payment/Application/use-cases/create-pix.use-case';

@ApiTags('payments') // Tag para o Swagger
@Controller('payments')
export class PaymentController {
  constructor(
    private readonly createPixUseCase: CreatePixUseCase,
    private readonly checkPaymentStatusUseCase: CheckPaymentStatusUseCase,
  ) {}

  // Criar PIX
  @Post('pix')
  @ApiOperation({ summary: 'Criar um pagamento PIX' })
  @ApiBody({ type: InputCreatePixDto }) // DTO de entrada
  @ApiResponse({ status: 201, description: 'Pagamento criado com sucesso', type: OutputCreatePixDto }) // DTO de saída
  async createPix(@Body() inputDto: InputCreatePixDto) {
    return this.createPixUseCase.execute(inputDto);
  }

  // Consultar status
  @Get('pix/:paymentId')
  @ApiOperation({ summary: 'Consultar status de um pagamento PIX' })
  @ApiParam({
    name: 'paymentId',
    description: 'ID do pagamento que deseja consultar',
    example: 'abc123xyz',
  })
  @ApiResponse({ status: 200, description: 'Status do pagamento retornado com sucesso', type: OutputPaymentStatusDto })
  async checkPaymentStatus(@Param('paymentId') paymentId: string) {
    const inputDto: InputPaymentStatusDto = { paymentId };
    return this.checkPaymentStatusUseCase.execute(inputDto);
  }
}

