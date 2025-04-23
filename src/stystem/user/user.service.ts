import { Injectable } from '@nestjs/common'
import { UserInterface } from 'src/common/interfaces'

@Injectable()
export class UserService {
  constructor() {}

  private readonly users: UserInterface[] = [
    {
      userId: 0,
      username: 'admin',
      password: '123456'
    },
    {
      userId: 1,
      username: 'john',
      password: 'changeme'
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guessx'
    }
  ]

  findOne(username: string): Promise<UserInterface | undefined> {
    const user = this.users.find((user) => user.username === username)
    return Promise.resolve(user)
  }

  addUser(dto: UserInterface) {
    const _dto = {
      ...dto,
      userId: this.users.length + 1
    }
    const item = JSON.parse(JSON.stringify(_dto)) as UserInterface
    this.users.push(item)
    return this.users
  }

  getList(pageNum, pageSize) {
    const stIndex = (pageNum - 1) * pageSize
    const endIndex = pageNum * pageSize

    return Promise.resolve({
      total: this.users.length,
      data: this.users.slice(stIndex, endIndex)
    })
  }

  getUserInfo(id) {
    const info = this.users.find((item) => item.userId == id)

    return Promise.resolve(info)
  }
}
