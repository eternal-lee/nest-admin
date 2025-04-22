import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const generateDocument = (app: INestApplication) => {
  // 接口文档 swagger 参数
  const options = new DocumentBuilder()
    .setTitle('Swagger接口文档')
    .setDescription('接口 API 文档')
    .setVersion('1.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  // 设置 swagger 网址
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: false,
      docExpansion: 'none', // 按需展开文档
      defaultModelsExpandDepth: -1, // 禁用 Models 的展开
    },
  });
};
