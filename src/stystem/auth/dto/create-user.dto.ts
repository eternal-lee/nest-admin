import {
  IsString,
  IsNumber,
  IsNotEmpty,
  MinLength,
  IsBoolean,
  IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: '用户昵称',
    uniqueItems: true,
    example: ''
  })
  @IsString({ message: '昵称不是有效的数据' })
  @IsNotEmpty({ message: '昵称不能为空' })
  @MinLength(2, { message: '昵称至少需要两位' })
  readonly nickname: string;

  @ApiProperty({
    description: '用户名',
    uniqueItems: true,
    example: ''
  })
  @IsString({ message: '不是有效的数据' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @MinLength(3, { message: '用户名至少需要三位' })
  readonly username: string;

  @ApiProperty({ example: '' })
  @IsString({ message: '密码不是有效的数据' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  @ApiProperty({ example: '' })
  @IsString({ message: '手机号码不是有效的数据' })
  @IsNotEmpty({ message: '手机号码不能为空' })
  readonly phoneNum: string;

  @ApiProperty({ example: 'xxx@qq.com' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: '' })
  @IsString({ message: '确认密码不是有效数据' })
  confirmPassword: string;

  @ApiProperty({ example: '' })
  @IsString({ message: '头像不是有效数据' })
  @IsNotEmpty({ message: '头像地址不能为空' })
  readonly avatar: string;

  @ApiProperty()
  @IsNumber()
  readonly deptId: number;

  @ApiProperty()
  @IsBoolean({ message: '用户状态必须为布尔类型' })
  @IsNotEmpty({ message: '用户状态不能为空' })
  readonly status: boolean;
}
