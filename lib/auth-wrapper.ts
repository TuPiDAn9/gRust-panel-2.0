import type { AuthOptions } from 'next-auth'
import type { NextRequest } from 'next/server'

let Steam: any = null

// Загружаем Steam provider только на сервере
if (typeof window === 'undefined') {
  try {
    Steam = require('next-auth-steam').default
  } catch (error) {
    console.warn('Steam provider not available:', error)
  }
}

export function authOptions(req?: NextRequest): AuthOptions {
  return {
    providers: req && Steam
      ? [
          Steam(req, {
            clientSecret: process.env.STEAM_API_KEY!
          })
        ]
      : [],
    callbacks: {
      jwt({ token, account, profile }) {
        if (account?.provider === 'steam') {
          token.steam = profile
        }
        return token
      },
      session({ session, token }) {
        if (session.user && 'steam' in token) {
          session.user.steam = token.steam
        }
        return session
      }
    }
  }
}
