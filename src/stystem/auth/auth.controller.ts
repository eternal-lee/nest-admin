import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { LoginAuthDto } from './dto/login-auth.dto'
import { AuthGuard } from './auth.guard'
import { CreateUserDto } from './dto/create-user.dto'
import { UserInterface } from 'src/common/interfaces'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  async create(@Body() userData: CreateUserDto) {
    return this.authService.create({ ...userData } as UserInterface)
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: '登录' })
  signIn(@Body() signInDto: LoginAuthDto) {
    return this.authService.signIn(signInDto.username, signInDto.password)
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('/login/logout')
  @ApiOperation({ summary: '退出登录' })
  loginout(@Request() request) {
    console.warn(request)

    return this.authService.loginOut('a')
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
