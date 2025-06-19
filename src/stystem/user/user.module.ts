import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { BaseController } from './base.controller'
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt'
import { jwtConstants } from 'src/common/jwt/constants'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from '../auth/auth.guard'

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory(): JwtModuleOptions {
        return {
          global: true,
          secret: jwtConstants.secret // Replace with your actual secret key
          // signOptions: { expiresIn: '16h' } // Example sign options
        }
      }
    })
  ],
  controllers: [BaseController, UserController],
  providers: [
    UserService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ],
  exports: [UserService]
})
export class UserModule {}
