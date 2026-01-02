import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res
} from '@nestjs/common'
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ThirdAuthService } from './thirdAuth.service'
import { ThirdAuthDto } from './dto/thirdAuth.dto'
import { Response } from 'express'

@ApiTags('三方授权')
@Controller('ThirdAuth')
export class ThirdAuthController {
  constructor(private thirdAuthService: ThirdAuthService) {}

  // github授权
  @HttpCode(HttpStatus.OK)
  @Get('github')
  @ApiOperation({ summary: '获取github授权地址并自动跳转' })
  @ApiHeader({
    name: 'redirect_url',
    required: false,
    description: '回调地址'
  })
  async githubUrl(
    @Res() res: Response,
    @Query('redirect_url') redirect_url?: string
  ) {
    const url = await this.thirdAuthService.getGithubLoginUrl(redirect_url)
    return res.redirect(url)
  }

  @HttpCode(HttpStatus.OK)
  @Post('github/info')
  @ApiOperation({ summary: 'github授权获取信息' })
  async githubInfo(@Body() param: ThirdAuthDto) {
    return await this.thirdAuthService.githubAuth(param.code)
  }

  // QQ授权
  @HttpCode(HttpStatus.OK)
  @Get('qq')
  @ApiOperation({ summary: '获取QQ授权地址并自动跳转' })
  async qqUrl(
    @Res() res: Response,
    @Query('redirect_url') redirect_url?: string
  ) {
    const url = await this.thirdAuthService.getQQLoginUrl(redirect_url)
    return res.redirect(url)
  }
}
