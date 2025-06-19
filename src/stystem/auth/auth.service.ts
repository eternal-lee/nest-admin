import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { UserInterface } from 'src/common/interfaces'
import { ResultData } from 'src/common/utils/result'
import { RedisService } from '../redis/redis.service'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private redisService: RedisService
  ) {}

  // 新用户注册
  async create(userData: UserInterface): Promise<ResultData> {
    // 检查用户名是否存在
    const user = await this.usersService.findOne(String(userData.username))
    const existing = !!user || false
    if (existing)
      throw new HttpException('账号已存在【E3】', HttpStatus.BAD_REQUEST)
    // 判断密码是否相等
    if (userData.password !== userData.confirmPassword)
      return ResultData.fail(
        HttpStatus.BAD_REQUEST,
        '两次输入密码不一致，请重试【E4】'
      )

    this.usersService.addUser(userData) // 创建成功，加入用户信息
    return ResultData.ok({ data: userData }, '注册成功')
  }

  // 登录
  async signIn(username, pass): Promise<ResultData> {
    const user = await this.usersService.findOne(String(username || ''))
    const existing = !!user || false
    if (!existing)
      return ResultData.fail(
        HttpStatus.UNAUTHORIZED,
        '登录失败，请确认用户名或密码是否正确',
        null
      )
    if (!user || username !== user.username || pass !== user.password) {
      return ResultData.fail(HttpStatus.BAD_REQUEST, '用户名或密码错误【E5】')
      // throw new HttpException('用户名或密码错误', HttpStatus.BAD_REQUEST)
    }

    const payload = { userId: user.userId, username: user.username }
    // 根据userId和username生成accessToken
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '30m' // 30分钟过期
    })

    // 根据username生成refreshToken
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d' // 7天过期
    })

    await this.redisService.setToken({
      payload,
      accessToken,
      refreshToken
    })

    return ResultData.ok(
      {
        data: user,
        access_token: accessToken,
        refresh_token: 'Bearer ' + refreshToken
      },
      '登录成功'
    )
  }

  // 双token刷新
  async refreshToken(token: string): Promise<ResultData> {
    if (!token)
      return Promise.resolve(
        ResultData.fail(HttpStatus.NOT_FOUND, '没有携带token【F2】')
      )

    try {
      const payload = this.jwtService.verify<Record<string, unknown>>(token) // 解析token
      // 验证redis的token
      await this.redisService.validateToken(payload, token, 'refreshToken')

      const accessToken = this.jwtService.sign({
        userId: payload.userId,
        username: payload.username
      })
      const refreshToken = this.jwtService.sign({
        userId: payload.userId
      })
      await this.redisService.setToken({
        payload,
        accessToken,
        refreshToken
      })

      const ret = {
        data: {
          access_token: accessToken,
          refresh_token: 'Bearer ' + refreshToken
        }
      }
      return Promise.resolve(ResultData.ok(ret, '刷新成功'))
    } catch {
      return Promise.resolve(
        ResultData.fail(HttpStatus.NOT_ACCEPTABLE, 'token 已失效【F3】')
      )
    }
  } // 退出

  async loginOut(token: string): Promise<ResultData> {
    if (!token)
      return Promise.resolve(
        ResultData.fail(HttpStatus.NOT_FOUND, '没有携带token【E6】')
      )
    const payload = this.jwtService.verify<Record<string, unknown>>(token) // 解析token
    // 验证redis的token
    await this.redisService.validateToken(payload, token)
    // 删除用户的token
    await this.redisService.deleteAllToken(payload)
    return Promise.resolve(ResultData.ok(null, '成功退出'))
  }
}
