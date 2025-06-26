import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { GithubService } from './github.service'
import { GithubCallbackDto } from './dto/github-callback.dto'

@ApiTags('github')
@Controller('github')
export class GithubController {
  constructor(private githubService: GithubService) {}

  @HttpCode(HttpStatus.OK)
  @Post('callback')
  @ApiOperation({ summary: 'github授权获取信息' })
  async callback(@Body() param: GithubCallbackDto) {
    return await this.githubService.githubAuth(param.code)
  }
}
