import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // habilitar cors para evitar errores de peticiones externas al back
  app.enableCors();
  
  // Pipe global. Restricciones para mandar la info como espera
  app.useGlobalPipes(
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    })
    );

    await app.listen(3000);

}
bootstrap();
