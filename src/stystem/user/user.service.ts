import { Injectable } from '@nestjs/common';


export type User = any;

@Injectable()
export class UserService {
  constructor() {}

  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guessx',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  addUser(dto) {
    dto = {
      ...dto,
      userId: this.users.length + 1
    }
    this.users.push(JSON.parse(JSON.stringify(dto)))
    return this.users
  }

  getList(pageNum, pageSize) {
    const stIndex = (pageNum - 1) * pageSize
    const endIndex = pageNum * pageSize

    return {
      total: this.users.length,
      data: this.users.slice(stIndex, endIndex)
    }
  }

  getUserInfo(id) {
    const info = this.users.find(item => item.userId == id)

    return info
  }
}
