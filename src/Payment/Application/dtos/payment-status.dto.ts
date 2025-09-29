import { ApiProperty } from "@nestjs/swagger";

export class InputPaymentStatusDto {
  @ApiProperty({
    description: 'ID do pagamento que se deseja consultar',
    example: 'abc123xyz',
  })
  paymentId: string;
}


export class OutputPaymentStatusDto {
  @ApiProperty({
    description: 'Status atual do pagamento',
    example: 'approved',
  })
  status: string;

  @ApiProperty({
    description: 'ID do pagamento consultado',
    example: 'abc123xyz',
  })
  paymentId: string;
}

