import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'

export class WxConfigDto {
  @ApiProperty({
    description: '当前页面的完整 URL（含 query）',
    example: 'https://example.com/page?a=1'
  })
  @IsNotEmpty({ message: 'url 不能为空' })
  url: string

  @ApiProperty({
    description: '公众号 appid，可选（若不传需后端配置）',
    required: false
  })
  @IsOptional()
  appid?: string

  @ApiProperty({
    description: '公众号 secret，可选（若不传需后端配置）',
    required: false
  })
  @IsOptional()
  secret?: string
}
