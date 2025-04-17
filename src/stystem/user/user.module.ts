import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { BaseController } from './base.controller';

@Module({
  controllers: [UserController, BaseController],
  providers: [UserService],
})
export class UserModule {}
