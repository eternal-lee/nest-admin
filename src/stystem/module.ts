// Module 文件
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { RedisModule } from './redis/redis.module'

export const moduleArr = [AuthModule, UserModule, RedisModule]
