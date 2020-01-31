import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  //开启全局验证
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors()
  const options = new DocumentBuilder()
  .setTitle('NestJS博客API')
  .setDescription('The blog API description')
  .setVersion('1.0')
  .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(5000);
  // 运行端口
}
bootstrap();
