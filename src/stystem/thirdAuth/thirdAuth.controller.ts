import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ThirdAuthService } from './thirdAuth.service'
import { ThirdAuthDto } from './dto/thirdAuth.dto'
import { Response } from 'express'

@ApiTags('thirdAuth')
@Controller('ThirdAuth')
export class ThirdAuthController {
  constructor(private thirdAuthService: ThirdAuthService) {}

  // github授权
  @HttpCode(HttpStatus.OK)
  @Get('github')
  @ApiOperation({ summary: '获取github授权地址并自动跳转' })
  async githubUrl(@Res() res: Response) {
    const url = await this.thirdAuthService.getGithubLoginUrl()
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
  async qqUrl(@Res() res: Response) {
    const url = await this.thirdAuthService.getQQLoginUrl()
    return res.redirect(url)
  }
}
