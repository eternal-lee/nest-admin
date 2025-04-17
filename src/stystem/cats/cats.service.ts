import { Injectable } from '@nestjs/common';

@Injectable()
export class CatsService {
  constructor() {}

  test() {
    return '测试例子';
  }
}
