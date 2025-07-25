import { Injectable, HttpStatus } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import { prodAuthKey } from '../../common/thirdAuth/index'
import { ResultData } from 'src/common/utils/result'
import { RedisService } from '../redis/redis.service'
import { JwtService } from '@nestjs/jwt'
import { GithubTokenResponse } from 'src/common/interfaces'

@Injectable()
export class ThirdAuthService {
  private redirect_uri: string
  constructor(
    private readonly httpService: HttpService,
    private jwtService: JwtService,
    private redisService: RedisService
  ) {
    this.redirect_uri = 'https://www.ieternal.top/callback'
  }

  getGithubLoginUrl(redirectUri: string = '') {
    const githubAuthUrl = 'https://github.com/login/oauth/authorize'
    const queryString = new URLSearchParams({
      client_id: prodAuthKey.client_github_id,
      redirect_uri: redirectUri || this.redirect_uri,
      state: 'github_auth'
    })
    const _url = `${githubAuthUrl}?${queryString.toString()}`
    return Promise.resolve(_url)
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
            client_id: prodAuthKey.client_github_id,
            client_secret: prodAuthKey.client_github_secret,
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

  // QQ
  getQQLoginUrl(redirectUri: string = '') {
    const qqAuthUrl = 'https://graph.qq.com/oauth2.0/authorize'
    const queryString = new URLSearchParams({
      client_id: prodAuthKey.client_qq_id,
      redirect_uri: redirectUri || this.redirect_uri,
      state: 'qq_auth',
      response_type: 'code',
      scope: 'get_user_info'
    })
    const _url = `${qqAuthUrl}?${queryString.toString()}`
    return Promise.resolve(_url)
  }
}
