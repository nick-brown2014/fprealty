export type SimpleUser = {
  email: string
  name: string
  phone: string
}

export type AuthUser = {
  token: string
  user: SimpleUser
}

export type LoginReq = {
  email: string
  password: string
}

export type AuthRes = {
  message: string
  data?: AuthUser
  success?: boolean
}