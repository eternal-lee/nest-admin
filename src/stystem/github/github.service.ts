import { Injectable, HttpStatus } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import { prodKey } from './../../common/github/index'
import { ResultData } from 'src/common/utils/result'
import { RedisService } from '../redis/redis.service'
import { JwtService } from '@nestjs/jwt'

interface GithubTokenResponse {
  access_token: string
  token_type: string
  scope: string
}

@Injectable()
export class GithubService {
  private client_id: string
  private client_secret: string
  constructor(
    private readonly httpService: HttpService,
    private jwtService: JwtService,
    private redisService: RedisService
  ) {
    this.client_id = prodKey.client_id
    this.client_secret = prodKey.client_secret
  }

  async githubAuth(code: string = '') {
    if (!code)
      return ResultData.fail(HttpStatus.NOT_FOUND, 'code值不存在', null)
    // 1. 用 code 换 access_token
    let access_token = ''
    try {
      const tokenRes = await firstValueFrom(
        this.httpService.post<GithubTokenResponse>(
          'https://github.com/login/oauth/access_token',
          {
            client_id: this.client_id,
            client_secret: this.client_secret,
            code
          },
          { headers: { accept: 'application/json' } }
        )
      )
      access_token = tokenRes.data.access_token
    } catch {
      return ResultData.fail(
        HttpStatus.INTERNAL_SERVER_ERROR,
        '获取access_token失败',
        null
      )
    }
    // 2. 用 access_token 获取用户信息
    try {
      const userRes = await firstValueFrom(
        this.httpService.get('https://api.github.com/user', {
          headers: { Authorization: `token ${access_token}` }
        })
      )
      const {
        id = '',
        avatar_url = '',
        name = '',
        login = ''
      } = userRes.data as Record<string, unknown>
      const payload = { userId: id, avatar_url, name, login }
      // return ResultData.ok(userRes.data)
      const accessToken = this.jwtService.sign(payload, {
        expiresIn: '30m' // 30分钟过期
      })

      // 根据username生成refreshToken
      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: '7d' // 7天过期
      })
      await this.redisService.setToken({
        payload,
        accessToken,
        refreshToken
      })

      return ResultData.ok(
        {
          data: payload,
          access_token: accessToken,
          refresh_token: 'Bearer ' + refreshToken
        },
        '登录成功'
      )
    } catch {
      return ResultData.fail(
        HttpStatus.INTERNAL_SERVER_ERROR,
        '获取用户信息失败',
        null
      )
    }
  }
}
