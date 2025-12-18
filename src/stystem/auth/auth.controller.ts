/**
 * 请求头不能使用驼峰或者_
 * 正确使用: refresh-token\refreshtoken
 */

import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  UseGuards
} from '@nestjs/common'
import { AuthService } from './auth.service'
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger'
import { LoginAuthDto } from './dto/login-auth.dto'
import { AuthGuard } from './auth.guard'
import { CreateUserDto } from './dto/create-user.dto'
import { UserInterface } from 'src/common/interfaces'

@ApiTags('验权接口')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  async create(@Body() userData: CreateUserDto) {
    return await this.authService.create({ ...userData } as UserInterface)
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: '登录' })
  async signIn(@Body() signInDto: LoginAuthDto) {
    return await this.authService.signIn(signInDto.username, signInDto.password)
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('/login/logout')
  @ApiOperation({ summary: '退出登录' })
  async loginout(@Req() req: { headers: { authorization?: string } }) {
    const token = req.headers.authorization?.split(' ')[1] ?? ''

    return await this.authService.loginOut(token)
  }

  @Post('/refresh')
  @ApiOperation({
    summary: '刷新token',
    description: '请求头上带有refresh-token'
  })
  @ApiHeader({
    name: 'refresh-token',
    required: true,
    description: '刷新token'
  })
  async refreshToken(@Headers() headers: { 'refresh-token'?: string }) {
    const token = headers['refresh-token']?.split(' ')[1] ?? ''

    return await this.authService.refreshToken(token)
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: '测试token' })
  getProfile(
    @Request() req: { user: Record<string, any> }
  ): Record<string, any> {
    return {
      ...req.user
    }
  }
}
