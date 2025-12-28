import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { WxAuthService } from './wxAuth.service'
import { WxAuthController } from './wxAuth.controller'

@Module({
  imports: [HttpModule],
  controllers: [WxAuthController],
  providers: [WxAuthService],
  exports: [WxAuthService]
})
export class WxAuthModule {}
