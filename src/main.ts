import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger, ValidationPipe } from '@nestjs/common'
import { generateDocument } from './swagger'
import { GlobalGuard } from './common/global/global.guard'

const port = process.env.port ?? 3001
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  // 设置所有 api 访问前缀
  app.setGlobalPrefix('/api')

  generateDocument(app)

  // 自动验证（以后等系统完善后可自定义）
  // 注册并配置全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
      forbidUnknownValues: true
    })
  )

  // 注册全局守卫
  app.useGlobalGuards(new GlobalGuard())
  // 启动程序，监听端口
  await app.listen(port)
  Logger.log(`http://localhost:${port}`, '服务启动成功')
}

bootstrap().catch((error) => {
  console.error('Error during application bootstrap:', error)
})
