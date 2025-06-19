import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { jwtConstants } from '../../common/jwt/constants'
import { Request } from 'express'
import { RedisService } from '../redis/redis.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private redisService: RedisService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new HttpException(
        {
          code: HttpStatus.NOT_FOUND,
          msg: '请确认token是否存在'
        },
        HttpStatus.OK
      )
    }
    try {
      const payload: Record<string, unknown> =
        await this.jwtService.verifyAsync(token, {
          secret: jwtConstants.secret
        })
      await this.validate(payload)
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload
    } catch {
      throw new HttpException(
        {
          code: HttpStatus.NOT_ACCEPTABLE,
          msg: 'token已失效'
        },
        HttpStatus.OK
      )
    }
    return true
  }

  async validate(payload: Record<string, unknown>) {
    if (!payload.userId)
      throw new HttpException(
        {
          code: HttpStatus.NOT_FOUND,
          msg: 'token已过期'
        },
        HttpStatus.OK
      )
    //从redis中取对应的token
    const cacheToken = await this.redisService.get(
      `accessToken-${payload.userId as string | number}`
    ) //取不出来，说明已过期
    if (!cacheToken) {
      throw new HttpException(
        {
          code: HttpStatus.NOT_ACCEPTABLE,
          msg: 'token已过期'
        },
        HttpStatus.OK
      )
    }
    return payload
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
