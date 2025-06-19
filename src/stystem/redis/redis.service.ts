import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
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

  async validateToken(
    payload: Record<string, unknown>,
    token: string,
    key: string = 'accessToken'
  ) {
    if (!String(payload.userId))
      throw new HttpException(
        {
          code: HttpStatus.NOT_FOUND,
          msg: 'token已过期【E0】'
        },
        HttpStatus.OK
      )
    const _key = `${key}-${String(payload.userId)}`
    //从redis中取对应的token
    const cacheToken = await this.get(_key)
    // 取不出来，说明已过期

    if (!cacheToken) {
      throw new HttpException(
        {
          code: HttpStatus.NOT_ACCEPTABLE,
          msg: 'token已过期【E1】'
        },
        HttpStatus.OK
      )
    }
    if (cacheToken != token) {
      await this.deleteAllToken(payload)
      throw new HttpException(
        {
          code: HttpStatus.NOT_FOUND,
          msg: 'token已失效【F1】'
        },
        HttpStatus.OK
      )
    }
    return true
  }

  /**
   * 登录、刷新设置token
   * @param params 用户信息、token值
   */
  async setToken(params: {
    payload: Record<string, unknown>
    accessToken: string
    refreshToken: string
  }) {
    const _id = String(params.payload.userId)

    await this.set('accessToken-' + _id, params.accessToken, 60 * 30)
    await this.set('refreshToken-' + _id, params.refreshToken, 60 * 60 * 24 * 7)
    return true
  }
  /**
   * 删除用户的token
   * @param payload 用户信息
   */
  async deleteAllToken(payload: Record<string, unknown>) {
    await this.del('accessToken-' + String(payload.userId))
    await this.del('refreshToken-' + String(payload.userId))
  }
}
