import { Controller, Get } from '@nestjs/common';
import { CatsService } from './cats.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('cats')
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get('test')
  test() {
    return this.catsService.test();
  }
}
