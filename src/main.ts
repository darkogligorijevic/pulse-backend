import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Social Media App")
    .setDescription("Something like Instagram")
    .setVersion("0.1.0")
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'jwt',
    )
    .build()

  const document = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document); 

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
