import { Global, Module } from '@nestjs/common'
import { createClient } from 'redis'

import { RedisService } from './redis.service'

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        // const client = createClient({
        //   socket: {
        //     host: '47.109.60.109',
        //     port: 6379
        //   }
        // })
        // await client.connect()
        // client.on('ready', () => {
        //   console.log('Redis 连接成功')
        // })
        // client.on('error', (err) => {
        //   console.error('Redis 连接异常:', err)
        // })
        // return client
      }
    },
    RedisService
  ],
  exports: [RedisService]
})
export class RedisModule {}
