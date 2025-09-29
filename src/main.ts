// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: false,
  });

  // Health check endpoints
  app.getHttpAdapter().get('/health', (req, res) => {
    res.status(200).send('OK');
  });

  app.getHttpAdapter().get('/api/health', (req, res) => {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Gateway PIX',
    });
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Gateway PIX API')
    .setDescription('API para criar e gerenciar pagamentos PIX')
    .setVersion('1.0')
    .addTag('pix')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // acessível em http://localhost:3000/api/docs

  await app.listen(port);
  console.log(`🚀 Gateway PIX rodando na porta ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`📄 Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
