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
   * 调用微信 stable_token 接口获取公众号 access_token（稳定版接口 /cgi-bin/stable_token）
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
   * 获取公众号全局 access_token（标准接口 /cgi-bin/token）
   * 返回 ResultData.ok(access_token) 或 ResultData.fail
   */
  async getAccessToken(appid: string, secret: string): Promise<any> {
    if (!appid || !secret)
      return ResultData.fail(HttpStatus.BAD_REQUEST, 'appid 或 secret 不能为空')
    try {
      const tokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`
      const tokenResp = await firstValueFrom(
        this.httpService.get(tokenUrl, { timeout: 5000 })
      )
      const tokenData = tokenResp?.data || {}
      if (tokenData.errcode || !tokenData.access_token) {
        return ResultData.fail(
          HttpStatus.BAD_REQUEST,
          '获取 access_token 失败',
          tokenData
        )
      }
      return ResultData.ok(tokenData.access_token, '获取 access_token 成功')
    } catch (err) {
      this.logger.error('getAccessToken failed', err)
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
      const tokenRes = await this.getAccessToken(appid, secret)
      if (!tokenRes || tokenRes.code !== 200) {
        return tokenRes
      }
      const accessToken = tokenRes.data

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

  /**
   * 创建自定义菜单（示例：名称为“首页”，跳转 https://www.xxx.com/）
   * 如果未提供 accessToken，则使用 appid/secret 获取全局 access_token
   */
  async createMenu(appid: string = '', secret: string = ''): Promise<any> {
    try {
      if (!appid || !secret) {
        return ResultData.fail(HttpStatus.BAD_REQUEST, 'appid或secret 不能为空')
      }
      const tokenRes = await this.getAccessToken(appid, secret)
      if (!tokenRes || tokenRes.code !== 200) {
        return tokenRes
      }
      const token = tokenRes.data

      const createUrl = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${token}`
      const menuBody = {
        button: [
          {
            type: 'view',
            name: '首页',
            url: 'http://www.ieternal.top/'
          },
          {
            name: '菜单',
            sub_button: [
              {
                type: 'view',
                name: '组件文档',
                url: 'http://ieter-ui.ieternal.top/v3/#/home'
              },
              {
                type: 'click',
                name: '赞一下',
                key: 'V1001_GOOD'
              }
            ]
          }
        ]
      }

      const createResp = await firstValueFrom(
        this.httpService.post(createUrl, menuBody, { timeout: 5000 })
      )
      const createData = createResp?.data || {}
      if (createData.errcode && createData.errcode !== 0) {
        return ResultData.fail(
          HttpStatus.BAD_REQUEST,
          '创建菜单失败',
          createData
        )
      }
      return ResultData.ok(createData, '创建菜单成功')
    } catch (err) {
      this.logger.error('createMenu failed', err)
      throw err
    }
  }
}
