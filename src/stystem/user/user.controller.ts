import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger'
import { UserService } from './user.service'
import { AuthGuard } from '../auth/auth.guard'
import { PwdParam } from './dto/modify-pwd.dto'

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private usersService: UserService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('/modifyPwd')
  @ApiOperation({ summary: '修改密码' })
  async modifyPwd(@Body() pwdParam: PwdParam) {
    const param = {
      userId: pwdParam.userId,
      old_password: pwdParam.old_password,
      new_password: pwdParam.new_password
    }
    const isBol = await this.usersService.modifyPwd(param)
    if (isBol)
      return {
        statusCode: 200,
        message: '修改成功'
      }
  }

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
  @ApiOperation({ summary: '查询当前用户信息' })
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
