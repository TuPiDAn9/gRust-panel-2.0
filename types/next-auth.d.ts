import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      steam?: unknown
    } & DefaultSession['user']
  }
}
