import { ApiProperty } from '@nestjs/swagger';

export class InputCreatePixDto {
  @ApiProperty({ example: 200, description: 'Valor do pagamento em centavos' })
  amount: number;

  @ApiProperty({ example: 'Compra de produto', description: 'Descrição do pagamento' })
  description: string;

  @ApiProperty({ example: 'cliente@email.com', description: 'Email do pagador' })
  email: string;
}

export class OutputCreatePixDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID único do pagamento' })
  id: string;

  @ApiProperty({ example: 200, description: 'Valor do pagamento em centavos' })
  amount: number;

  @ApiProperty({ example: 'Compra de produto', description: 'Descrição do pagamento' })
  description: string;

  @ApiProperty({ example: 'cliente@email.com', description: 'Email do pagador' })
  email: string;

  @ApiProperty({ example: 'PENDING', description: 'Status do pagamento' })
  status: string;

  @ApiProperty({ example: '00020126580014br.gov.bcb.pix...', description: 'Código PIX', required: false })
  pixCode?: string;

  @ApiProperty({ example: 'data:image/png;base64,iVBORw0KGgoAAAANS...', description: 'QR Code em base64', required: false })
  qrCodeBase64?: string;
}
