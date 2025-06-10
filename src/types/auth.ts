export interface LoginResponse {
  token: string
  user?: {
    username: string
    name?: string
  }
  message?: string
}

export interface UserProfile {
  username: string
  name: string
}
  