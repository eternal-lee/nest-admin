import { Module } from '@nestjs/common'
import { AuthModule } from './stystem/auth/auth.module'
import { UserModule } from './stystem/user/user.module'
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config'
import { RedisModule } from './stystem/redis/redis.module'

const moduleArr = [AuthModule, UserModule, RedisModule]
@Module({
  imports: [...moduleArr, ConfigModule.forRoot()]
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
