import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello() {
    return 'Hello World!'
  }

  getUser() {
    return { a: 4545 }
  }
}
