import { Global, Module } from '@nestjs/common'
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt'
import { jwtConstants } from './constants'

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory(): JwtModuleOptions {
        return {
          global: true,
          secret: jwtConstants.secret // Replace with your actual secret key
          // signOptions: { expiresIn: '60s' } // Example sign options
        }
      }
    })
  ],
  exports: [JwtModule]
})
export class GlobalJwtModule {}
