import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { BaseController } from './base.controller'

@Module({
  imports: [],
  controllers: [BaseController, UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
