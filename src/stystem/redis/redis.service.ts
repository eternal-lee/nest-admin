import { Inject, Injectable } from '@nestjs/common'
import { RedisClientType } from 'redis'

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private redisClient: RedisClientType) {}

  // 获取
  async get(key: string) {
    let value = await this.redisClient.get(key)
    try {
      value = JSON.parse(String(value)) as string
    } catch (error) {
      console.error(error)
    }
    return value
  }

  // 设置
  async set(key: string, value: any, second?: number) {
    const _value = JSON.stringify(value)
    return await this.redisClient.set(key, _value, { EX: second })
  }

  // 删除
  async del(key: string) {
    return await this.redisClient.del(key)
  }
  //清空所有数据库中的所有键
  async flushAll() {
    return await this.redisClient.flushAll()
  }
}
