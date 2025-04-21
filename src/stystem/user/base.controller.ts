import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
@ApiTags('user')
@Controller('user')
export class BaseController {
  constructor(private readonly userService: UserService) {}

}
