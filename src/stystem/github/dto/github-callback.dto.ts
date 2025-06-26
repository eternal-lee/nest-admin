import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class GithubCallbackDto {
  @ApiProperty({ description: 'code值', example: 'xxx' })
  @IsNotEmpty({ message: '不能为空' })
  code: string
}
