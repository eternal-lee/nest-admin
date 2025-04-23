import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { UserService } from './user.service'

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private usersService: UserService) {}

  @Get('list')
  @ApiOperation({ summary: '查询所有用户列表' })
  @ApiOkResponse({ description: '返回用户列表和用户总数' })
  async list(
    @Query('pageSize') pageSize: number = 10,
    @Query('pageNum', new ParseIntPipe()) pageNum: number
  ) {
    const result = await this.usersService.getList(pageNum, pageSize)
    return {
      statusCode: 200,
      message: '查询成功',
      pageNum,
      pageSize,
      total: result.total,
      data: result.data
    }
  }

  @Get('user/:id')
  @ApiOperation({ summary: '查询指定用户信息' })
  @ApiParam({ name: 'id', required: true, description: '用户ID', type: Number })
  async findOne(@Param() param: { id: number }) {
    const id: number = param.id
    const data = await this.usersService.getUserInfo(id)
    return {
      statusCode: 200,
      message: '查询成功',
      data: data
    }
  }
}
