import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('user')
@Controller('user')
export class BaseController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  async create(@Body() userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  async login(@Body() userData: LoginUserDto) {
    return this.userService.login(userData);
  }
}
