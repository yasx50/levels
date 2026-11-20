import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module.js';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = app.get(ConfigService);
    app.use(helmet());
    app.enableCors({
        origin: ['http://localhost:8081', "http://192.168.0.101:8081"],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    const swagger = new DocumentBuilder()
        .setTitle('Skill Evolution Network API')
        .setVersion('0.1')
        .addBearerAuth()
        .build();
    SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swagger));
    await app.listen(config.get('app.port'));
}
bootstrap();
//# sourceMappingURL=main.js.map