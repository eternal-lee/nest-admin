import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger'
import { UserService } from './user.service'
import { PwdParam } from './dto/modify-pwd.dto'

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private usersService: UserService) {}

  @Post('/modifyPwd')
  @ApiOperation({ summary: '修改密码' })
  async modifyPwd(@Body() pwdParam: PwdParam) {
    const param = {
      userId: pwdParam.userId,
      old_password: pwdParam.old_password,
      new_password: pwdParam.new_password
    }
    return await this.usersService.modifyPwd(param)
  }

  @Get('list')
  @ApiOperation({ summary: '查询所有用户列表' })
  @ApiOkResponse({ description: '返回用户列表和用户总数' })
  async list(
    @Query('pageSize') pageSize: number = 10,
    @Query('pageNum', new ParseIntPipe()) pageNum: number
  ) {
    return await this.usersService.getList(pageNum, pageSize)
  }

  @Get('user/:id')
  @ApiOperation({ summary: '查询当前用户信息' })
  @ApiParam({ name: 'id', required: true, description: '用户ID', type: Number })
  async findOne(@Param() param: { id: number }) {
    const id: number = param.id
    return await this.usersService.getUserInfo(id)
  }
}
