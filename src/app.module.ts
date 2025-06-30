import { Module } from '@nestjs/common'
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config'
import { moduleArr } from './stystem/module'
import { GlobalJwtModule } from './common/jwt/global-jwt.module'

@Module({
  imports: [...moduleArr, ConfigModule.forRoot(), GlobalJwtModule]
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
