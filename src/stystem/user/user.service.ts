import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseData } from 'src/common/interfaces/result.interface';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor() {}

  // 新用户注册
  create(dto: CreateUserDto): Promise<ResponseData> {
    // 检查用户名是否存在
    const existing = false;
    if (existing) throw new HttpException('账号已存在', HttpStatus.BAD_REQUEST);
    // 判断密码是否相等
    if (dto.password !== dto.confirmPassword)
      throw new HttpException(
        '两次输入密码不一致，请重试',
        HttpStatus.BAD_REQUEST,
      );
    return Promise.resolve({ statusCode: 200, message: '注册成功', data: dto });
  }

  // 登录逻辑
  login(dto: LoginUserDto): Promise<ResponseData> {
    // 查询用户
    if (!dto.account)
      throw new HttpException('请输入账号或密码', HttpStatus.BAD_REQUEST);
    // 判断密码是否相等
    if (!dto.password)
      throw new HttpException('请输入账号或密码', HttpStatus.BAD_REQUEST);

    // 返回结果
    const result = {
      statusCode: 200,
      message: '登录成功',
      data: {
        ...dto,
      },
    };
    return Promise.resolve(result);
  }
}
