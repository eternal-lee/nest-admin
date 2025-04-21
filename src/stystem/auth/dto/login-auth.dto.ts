import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class LoginAuthDto {
  @ApiProperty()
  @IsString({ message: '不是有效数据' })
  @IsNotEmpty({ message: '用户名/密码不能为空' })
  @Transform(({ value }) => value || 'admin')
  readonly username: string;

  @ApiProperty()
  @IsString({ message: '不是有效数据' })
  @IsNotEmpty({ message: '用户名/密码不能为空' })
  @Transform(({ value }) => value || '123456')
  readonly password: string;
}
