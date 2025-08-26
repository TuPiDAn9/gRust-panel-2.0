import NextAuth from 'next-auth'
import type { NextRequest } from 'next/server'
import { authOptions } from '../../../../auth'

async function auth(req: NextRequest, ctx: any) {
  return NextAuth(req, ctx, authOptions(req))
}

export { auth as GET, auth as POST }