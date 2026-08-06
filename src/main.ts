import { ValidationPipe,ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Reflector } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/filters/exception.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);


app.useGlobalInterceptors(
  new ClassSerializerInterceptor(app.get(Reflector)),
);
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('E-Commerce API')
    .setDescription('NestJS E-Commerce Backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  app.useGlobalFilters(
  new GlobalExceptionFilter(),
);

  await app.listen(process.env.PORT ?? 3000);

  console.log(`Application running on http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`Swagger running on http://localhost:${process.env.PORT ?? 3000}/api`);
}

bootstrap();
