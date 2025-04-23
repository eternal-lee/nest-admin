import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { UserService } from './user.service'
@ApiTags('user')
@Controller('user')
export class BaseController {
  constructor(private readonly userService: UserService) {}
}
