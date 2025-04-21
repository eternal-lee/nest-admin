import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from 'src/common/jwt/constants';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      useFactory(...args): JwtModuleOptions {
        return {
          global: true,
          secret: jwtConstants.secret, // Replace with your actual secret key
          signOptions: { expiresIn: '60s' }, // Example sign options
        };
      }, 
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
