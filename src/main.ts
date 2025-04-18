import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';

const port = process.env.port ?? 3000;
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // 设置所有 api 访问前缀
  app.setGlobalPrefix('/api');

  // 接口文档 swagger 参数
  const options = new DocumentBuilder()
    .setTitle('Swagger接口文档')
    .setDescription('接口 API 文档')
    .setVersion('1.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  // 设置 swagger 网址
  SwaggerModule.setup('docs', app, document);

  // 自动验证（以后等系统完善后可自定义）
  // 注册并配置全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
      forbidUnknownValues: true,
    }),
  );
  // 启动程序，监听端口
  await app.listen(port);
  Logger.log(`http://localhost:${port}`, '服务启动成功');
}

bootstrap().catch((error) => {
  console.error('Error during application bootstrap:', error);
});
