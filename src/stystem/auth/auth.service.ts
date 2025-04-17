import { HttpException, Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor() {}

  login(loginAuthDto: LoginAuthDto) {
    const user = {
      id: 1,
      username: '1234566',
      password: '1234566',
    };

    if (
      loginAuthDto.username !== user.username ||
      loginAuthDto.password !== user.password
    ) {
      throw new HttpException('用户名或密码错误', 401);
    }

    return {
      statusCode: 200,
      message: '登录成功',
      data: loginAuthDto,
    };
  }
}
