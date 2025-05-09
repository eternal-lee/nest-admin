import { HttpStatus, Injectable } from '@nestjs/common'
import { PwdParamInterface, UserInterface } from 'src/common/interfaces'
import { ResultData } from 'src/common/utils/result'

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

  async findOne(username: string): Promise<UserInterface | undefined> {
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
    return ResultData.ok({ data: item }, '注册成功')
  }

  // 用户列表
  async getList(pageNum: number, pageSize: number) {
    const stIndex = (pageNum - 1) * pageSize
    const endIndex = pageNum * pageSize

    const data = this.users.slice(stIndex, endIndex)
    return Promise.resolve(
      ResultData.ok(
        {
          pageNum,
          pageSize,
          total: this.users.length,
          data: data
        },
        '查询成功'
      )
    )
  }

  // 单个用户信息
  async getUserInfo(id) {
    const info = this.users.find((item) => item.userId == id)
    return Promise.resolve(ResultData.ok({ data: info }, '查询成功'))
  }

  // 修改密码
  async modifyPwd(param: PwdParamInterface): Promise<ResultData> {
    const index = this.users.findIndex((item) => item.userId == param.userId)
    if (this.users[index].password != param.old_password) {
      return Promise.resolve(
        ResultData.fail(HttpStatus.BAD_REQUEST, '旧密码输入不正确，请重新输入')
      )
    }
    this.users[index].password = String(param.new_password)
    return Promise.resolve(ResultData.ok(null, '修改成功'))
  }
}
