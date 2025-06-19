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
          msg: '请确认token是否存在【E2】'
        },
        HttpStatus.OK
      )
    }
    try {
      const payload: Record<string, unknown> =
        await this.jwtService.verifyAsync(token, {
          secret: jwtConstants.secret
        })

      // 验证redis的token
      await this.redisService.validateToken(payload, token)

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload
    } catch {
      throw new HttpException(
        {
          code: HttpStatus.NOT_ACCEPTABLE,
          msg: 'token已失效【F0】'
        },
        HttpStatus.OK
      )
    }
    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
