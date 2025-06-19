import { Module } from '@nestjs/common'
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config'
import { moduleArr } from './stystem/module'

@Module({
  imports: [...moduleArr, ConfigModule.forRoot()]
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
