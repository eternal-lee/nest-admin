import { Injectable, HttpStatus } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import { prodKey } from './../../common/github/index'
import { ResultData } from 'src/common/utils/result'

interface GithubTokenResponse {
  access_token: string
  token_type: string
  scope: string
}

@Injectable()
export class GithubService {
  private client_id: string
  private client_secret: string
  constructor(private readonly httpService: HttpService) {
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
      return ResultData.ok(userRes.data)
    } catch {
      return ResultData.fail(
        HttpStatus.INTERNAL_SERVER_ERROR,
        '获取用户信息失败',
        null
      )
    }
  }
}
