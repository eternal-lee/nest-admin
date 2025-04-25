export type UserInterface = {
  userId?: number
  username: string
  password: string
  [key: string]: unknown
}

export type PwdParamInterface = {
  userId: string | number
  old_password: string
  new_password: string
}
