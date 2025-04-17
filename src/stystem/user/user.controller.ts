import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor() {}

  @Get('list')
  @ApiOperation({ summary: '查询用户列表' })
  @ApiOkResponse({ description: '返回用户列表和用户总数' })
  findList(@Query() query): any {
    // @Query('pageSize', new ParseIntPipe()) pageSize: number, @Query('pageNum', new ParseIntPipe()) pageNum: number
    // @Query() query  console.log(query)
    return query;
  }
}
