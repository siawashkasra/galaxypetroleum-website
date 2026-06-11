import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const COOKIE_NAME = 'galaxy_cms_session'
const SECRET      = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? 'fallback-dev-secret-change-in-production',
)

export async function createSession() {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const token = await new SignJWT({ admin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET)

  const store = await cookies()
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires:  expiresAt,
    path:     '/',
  })
}

export async function deleteSession() {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}

export async function verifySession(): Promise<boolean> {
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value
  if (!token) return false
  try {
    await jwtVerify(token, SECRET, { algorithms: ['HS256'] })
    return true
  } catch {
    return false
  }
}

export async function requireAuth() {
  const valid = await verifySession()
  if (!valid) redirect('/admin/login')
}
