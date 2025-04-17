import { Module } from '@nestjs/common';
import { CatsModule } from './stystem/cats/cats.module';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

const moduleArr = [CatsModule];
@Module({
  imports: [...moduleArr, ConfigModule.forRoot()],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
