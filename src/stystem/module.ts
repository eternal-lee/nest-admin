// Module 文件
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { RedisModule } from './redis/redis.module'
import { GithubModule } from './github/github.module'

export const moduleArr = [AuthModule, UserModule, RedisModule, GithubModule]
