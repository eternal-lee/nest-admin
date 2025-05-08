import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { ResponseData } from 'src/common/interfaces/result.interface'
import { UserInterface } from 'src/common/interfaces'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {}

  // 新用户注册
  async create(userData: UserInterface): Promise<ResponseData> {
    // 检查用户名是否存在
    const user = await this.usersService.findOne(String(userData.username))
    const existing = !!user || false
    if (existing) throw new HttpException('账号已存在', HttpStatus.BAD_REQUEST)
    // 判断密码是否相等
    if (userData.password !== userData.confirmPassword)
      throw new HttpException(
        '两次输入密码不一致，请重试',
        HttpStatus.BAD_REQUEST
      )

    this.usersService.addUser(userData) // 创建成功，加入用户信息
    return Promise.resolve({
      statusCode: HttpStatus.OK,
      message: '注册成功',
      data: userData
    })
  }

  // 登录
  async signIn(username, pass): Promise<ResponseData> {
    const user = await this.usersService.findOne(String(username || ''))
    const existing = !!user || false
    if (!existing)
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: '登录失败，请确认用户名或密码是否正确',
        data: null
      }
    if (!user || username !== user.username || pass !== user.password) {
      throw new HttpException('用户名或密码错误', HttpStatus.BAD_REQUEST)
    }

    const payload = { userId: user.userId, username: user.username }
    // 根据userId和username生成accessToken
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '30m' // 30分钟过期
    })

    // 根据username生成refreshToken
    const refreshToken = this.jwtService.sign(
      {
        username: payload.username
      },
      {
        expiresIn: '7d' // 7天过期
      }
    )

    return {
      statusCode: HttpStatus.OK,
      message: '登录成功',
      access_token: accessToken,
      refresh_token: refreshToken,
      data: user
    }
  }

  // 双token刷新
  refreshToken(token: string): Promise<ResponseData> {
    if (!token) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: '没有携带token'
        },
        HttpStatus.OK
      )
      // throw new BadRequestException('token无效')
    }

    try {
      const data = this.jwtService.verify<Record<string, unknown>>(token) // 解析token

      const accessToken = this.jwtService.sign(
        {
          userId: data.id,
          username: data.username
        },
        {
          expiresIn: '30m'
        }
      )

      const refreshToken = this.jwtService.sign(
        {
          username: data.username
        },
        {
          expiresIn: '7d'
        }
      )

      const ret = {
        statusCode: HttpStatus.OK,
        message: '刷新成功',
        access_token: accessToken,
        refresh_token: refreshToken
      }
      return Promise.resolve(ret)
    } catch {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_ACCEPTABLE,
          message: 'token 已失效，请重新登录'
        },
        HttpStatus.OK
      )
    }
  } // 退出

  loginOut(token: string) {
    if (!token) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: '没有携带token'
        },
        HttpStatus.OK
      )
    }
    this.jwtService.decode(token) // 解码
    return Promise.resolve({
      statusCode: HttpStatus.OK,
      message: '成功退出'
    })
  }
}
