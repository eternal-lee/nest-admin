// 三方授权
import { Module } from '@nestjs/common'
import { ThirdAuthService } from './thirdAuth.service'
import { ThirdAuthController } from './thirdAuth.controller'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [HttpModule],
  controllers: [ThirdAuthController],
  providers: [ThirdAuthService],
  exports: [ThirdAuthService]
})
export class ThirdAuthModule {}
