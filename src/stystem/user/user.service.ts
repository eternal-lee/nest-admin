import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { PwdParamInterface, UserInterface } from 'src/common/interfaces'

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

  // 新增用户
  addUser(dto: UserInterface) {
    const _dto = {
      ...dto,
      userId: this.users.length + 1
    }
    const item = JSON.parse(JSON.stringify(_dto)) as UserInterface
    this.users.push(item)
    return this.users
  }

  // 用户列表
  getList(pageNum, pageSize) {
    const stIndex = (pageNum - 1) * pageSize
    const endIndex = pageNum * pageSize

    return Promise.resolve({
      total: this.users.length,
      data: this.users.slice(stIndex, endIndex)
    })
  }

  // 单个用户信息
  getUserInfo(id) {
    const info = this.users.find((item) => item.userId == id)

    return Promise.resolve(info)
  }

  // 修改密码
  modifyPwd(param: PwdParamInterface): Promise<boolean> {
    const index = this.users.findIndex((item) => item.userId == param.userId)
    if (this.users[index].password != param.old_password) {
      throw new HttpException(
        '旧密码输入不正确，请重新输入',
        HttpStatus.BAD_REQUEST
      )
    }
    this.users[index].password = String(param.new_password)
    return Promise.resolve(true)
  }
}
