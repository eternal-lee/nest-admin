import { HttpService } from '@nestjs/axios'
import { HttpStatus, Injectable, Logger } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'
import * as crypto from 'crypto'
import { ResultData } from 'src/common/utils/result'

@Injectable()
export class WxAuthService {
  private readonly logger = new Logger(WxAuthService.name)

  constructor(private readonly httpService: HttpService) {}

  /**
   * 调用微信 stable_token 接口获取公众号 access_token
   * @param appid 微信公众号 appid
   * @param secret 微信公众号 secret
   */
  async getStableToken(appid: string = '', secret: string = ''): Promise<any> {
    const url =
      'https://api.weixin.qq.com/cgi-bin/stable_token?grant_type=client_credential'
    try {
      const resp = await firstValueFrom(
        this.httpService.post(
          url,
          { grant_type: 'client_credential', appid, secret },
          { timeout: 5000 }
        )
      )
      return ResultData.ok(resp.data, '获取成功')
    } catch (err) {
      this.logger.error('getStableToken failed', err)
      throw err
    }
  }

  /**
   * 生成微信 JS-SDK 所需的 wx.config 参数
   * @param url 前端传入的完整 url
   * @param appid 可选，公众号 appid
   * @param secret 可选，公众号 secret
   */
  async getJsSdkConfig(url: string, appid: string, secret: string) {
    if (!url) return ResultData.fail(HttpStatus.BAD_REQUEST, '回调地址不能为空')
    try {
      // 1. 获取 access_token（使用标准接口）
      const tokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`

      const tokenResp = await firstValueFrom(
        this.httpService.get(tokenUrl, { timeout: 5000 })
      )
      const accessToken = tokenResp?.data?.access_token
      if (!accessToken) {
        return ResultData.fail(
          HttpStatus.BAD_REQUEST,
          '获取 access_token 失败',
          tokenResp?.data
        )
      }

      // 2. 获取 jsapi_ticket
      const ticketUrl = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`
      const ticketResp = await firstValueFrom(
        this.httpService.get(ticketUrl, { timeout: 5000 })
      )
      const ticket = ticketResp?.data?.ticket
      if (!ticket) {
        return ResultData.fail(
          HttpStatus.BAD_REQUEST,
          '获取 jsapi_ticket 失败',
          ticketResp?.data
        )
      }

      // 3. 生成 nonceStr, timestamp, signature
      const nonceStr = Math.random().toString(36).substr(2, 16)
      const timestamp = Math.floor(Date.now() / 1000)
      const raw = `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`
      const signature = crypto.createHash('sha1').update(raw).digest('hex')

      return ResultData.ok(
        {
          appId: appid,
          timestamp,
          nonceStr,
          signature,
          raw,
          ticket
        },
        '成功'
      )
    } catch (err) {
      this.logger.error('getJsSdkConfig failed', err)
      throw err
    }
  }

  /**
   * 根据前端传入的 code 调用微信 OAuth2 接口获取用户信息
   * 1) 通过 code 换取 access_token 和 openid
   * 2) 使用 access_token + openid 获取用户信息
   */
  async getUserByCode(
    code: string,
    appid: string = '',
    secret: string = ''
  ): Promise<any> {
    if (!code) return ResultData.fail(HttpStatus.BAD_REQUEST, 'code 不能为空')
    try {
      const tokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`
      const tokenResp = await firstValueFrom(
        this.httpService.get(tokenUrl, { timeout: 5000 })
      )

      const tokenData = tokenResp?.data || {}
      if (tokenData.errcode) {
        return ResultData.fail(
          HttpStatus.BAD_REQUEST,
          '通过 code 获取 access_token 失败',
          tokenData
        )
      }

      const accessToken = tokenData.access_token
      const openid = tokenData.openid
      if (!accessToken || !openid) {
        return ResultData.fail(
          HttpStatus.BAD_REQUEST,
          'access_token 或 openid 丢失',
          tokenData
        )
      }

      const userInfoUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${accessToken}&openid=${openid}&lang=zh_CN`
      const userResp = await firstValueFrom(
        this.httpService.get(userInfoUrl, { timeout: 5000 })
      )

      const userData = userResp?.data || {}
      if (userData.errcode) {
        return ResultData.fail(
          HttpStatus.BAD_REQUEST,
          '获取用户信息失败',
          userData
        )
      }

      return ResultData.ok(userData, '获取用户信息成功')
    } catch (err) {
      this.logger.error('getUserByCode failed', err)
      throw err
    }
  }
}
