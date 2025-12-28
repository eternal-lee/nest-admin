import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  Get,
  Query
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { WxAuthService } from './wxAuth.service'
import { WxConfigDto } from './dto/wx-config.dto'
import { wxauthKey } from 'src/common/thirdAuth'
import { ResultData } from 'src/common/utils/result'

@ApiTags('微信公众号')
@Controller('wxAuth')
export class WxAuthController {
  private callUrl: string
  private appid: string
  private secret: string

  constructor(private readonly wxAuthService: WxAuthService) {
    this.callUrl = 'https://www.ieternal.top/callback'
    this.appid = wxauthKey['test'].appId
    this.secret = wxauthKey['test'].secret
  }

  @HttpCode(HttpStatus.OK)
  @Get('getkey')
  @ApiOperation({ summary: '获取公众号 对应appId' })
  async getkey() {
    return ResultData.ok(
      {
        dev: {},
        test: { appid: this.appid },
        prod: {}
      },
      '获取成功'
    )
  }

  @HttpCode(HttpStatus.OK)
  @Post('accessToken')
  @ApiOperation({ summary: '获取公众号 access_token' })
  async githubUrl() {
    return await this.wxAuthService.getStableToken(this.appid, this.secret)
  }

  @HttpCode(HttpStatus.OK)
  @Get('config')
  @ApiOperation({ summary: '获取公众号 wx.config 参数' })
  async getConfig(@Query('url') url: string = this.callUrl) {
    return await this.wxAuthService.getJsSdkConfig(url, this.appid, this.secret)
  }
}
