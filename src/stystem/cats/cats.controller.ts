import { Controller, Get } from '@nestjs/common';
import { CatsService } from './cats.service';

@Controller()
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get('test')
  test() {
    return this.catsService.test();
  }
}
