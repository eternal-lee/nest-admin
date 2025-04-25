import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Length } from 'class-validator'

export class PwdParam {
  @ApiProperty({ description: '用户Id', example: '' })
  @IsNotEmpty({ message: '用户Id不能为空' })
  readonly userId: string

  @ApiProperty({ description: '旧密码', example: '' })
  @IsNotEmpty({ message: '密码不能为空' })
  readonly old_password: string

  @ApiProperty({ description: '新密码', example: '' })
  @IsNotEmpty({ message: '请输入密码' })
  @Length(6, 20, {
    message: '密码长度在6-20位之间'
  })
  readonly new_password: string

  @ApiProperty({ description: '确认密码', example: '' })
  @IsNotEmpty({ message: '请输入密码' })
  @Length(6, 20, {
    message: '密码长度在6-20位之间'
  })
  readonly sure_password: string
}
