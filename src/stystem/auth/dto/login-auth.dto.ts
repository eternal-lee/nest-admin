import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class LoginAuthDto {
  @ApiProperty({ description: '用户名', example: 'admin' })
  @IsString({ message: '不是有效数据' })
  @IsNotEmpty({ message: '用户名/密码不能为空' })
  readonly username: string;

  @ApiProperty({ description: '密码', example: '123456' })
  @IsString({ message: '不是有效数据' })
  @IsNotEmpty({ message: '用户名/密码不能为空' })
  // @Transform(({ value }) => value || '123456')
  readonly password: string;
}
