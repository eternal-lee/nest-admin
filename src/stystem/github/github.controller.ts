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
import { GithubService } from './github.service'
import { GithubCallbackDto } from './dto/github-callback.dto'
import { Response } from 'express'

@ApiTags('github')
@Controller('github')
export class GithubController {
  constructor(private githubService: GithubService) {}

  @HttpCode(HttpStatus.OK)
  @Get('oauth/github')
  @ApiOperation({ summary: '获取github授权地址并自动跳转' })
  async getComputedStyle(@Res() res: Response) {
    const url = await this.githubService.getGithubLoginUrl()
    return res.redirect(url)
  }

  @HttpCode(HttpStatus.OK)
  @Post('callback')
  @ApiOperation({ summary: 'github授权获取信息' })
  async callback(@Body() param: GithubCallbackDto) {
    return await this.githubService.githubAuth(param.code)
  }
}
