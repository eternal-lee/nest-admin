import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { LoginAuthDto } from './stystem/auth/dto/login-auth.dto';

@ApiTags('测试')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('login')
  @ApiOperation({ summary: '登录' })
  login(@Body() loginAuthDto: LoginAuthDto) {
    // 生成 id
    const id = +String(Math.random()).split('.')[1];
    return { statusCode: 200, message: '登录成功', data: loginAuthDto, id };
  }

  @Get('getHello')
  @ApiOperation({ summary: 'hello' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('create')
  create(@Res() res: Response) {
    res.status(HttpStatus.CREATED).send();
    return [];
  }
}
