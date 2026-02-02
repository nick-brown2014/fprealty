import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/auth/forgot-password/route'
import { prismaMock } from '../../setup'
import { NextRequest } from 'next/server'

vi.mock('resend', () => ({
  Resend: class MockResend {
    emails = {
      send: vi.fn().mockResolvedValue({ data: { id: 'email-id' }, error: null })
    }
  }
}))

describe('POST /api/auth/forgot-password', () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = 'test-resend-key'
    process.env.NEXTAUTH_URL = 'http://localhost:3000'
  })

  it('returns 400 when email is not provided', async () => {
    const req = new NextRequest('http://localhost', {
      method: 'POST',
      body: JSON.stringify({})
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Email is required')
  })

  it('returns success message even for non-existent users (security)', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)

    const req = new NextRequest('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ email: 'nonexistent@test.com' })
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.message).toBe('If an account exists with that email, a password reset link has been sent.')
  })

  it('generates reset token for existing user', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'user-id',
      email: 'test@test.com',
      password: 'hashed',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '1234567890',
      emailOptIn: false,
      isAdmin: false,
      resetToken: null,
      resetTokenExpiry: null,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    prismaMock.user.update.mockResolvedValue({
      id: 'user-id',
      email: 'test@test.com',
      password: 'hashed',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '1234567890',
      emailOptIn: false,
      isAdmin: false,
      resetToken: 'generated-token',
      resetTokenExpiry: new Date(Date.now() + 3600000),
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const req = new NextRequest('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com' })
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    expect(prismaMock.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { email: 'test@test.com' },
        data: expect.objectContaining({
          resetToken: expect.any(String),
          resetTokenExpiry: expect.any(Date)
        })
      })
    )
  })

  it('sets token expiry to 1 hour from now', async () => {
    const now = Date.now()
    vi.spyOn(Date, 'now').mockReturnValue(now)

    prismaMock.user.findUnique.mockResolvedValue({
      id: 'user-id',
      email: 'test@test.com',
      password: 'hashed',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '1234567890',
      emailOptIn: false,
      isAdmin: false,
      resetToken: null,
      resetTokenExpiry: null,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    prismaMock.user.update.mockResolvedValue({
      id: 'user-id',
      email: 'test@test.com',
      password: 'hashed',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '1234567890',
      emailOptIn: false,
      isAdmin: false,
      resetToken: 'generated-token',
      resetTokenExpiry: new Date(now + 3600000),
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const req = new NextRequest('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com' })
    })
    await POST(req)

    const updateCall = prismaMock.user.update.mock.calls[0][0]
    const tokenExpiry = updateCall.data.resetTokenExpiry as Date
    const expectedExpiry = new Date(now + 3600000)
    expect(tokenExpiry.getTime()).toBe(expectedExpiry.getTime())

    vi.restoreAllMocks()
  })

  it('returns 500 when RESEND_API_KEY is not configured', async () => {
    delete process.env.RESEND_API_KEY

    prismaMock.user.findUnique.mockResolvedValue({
      id: 'user-id',
      email: 'test@test.com',
      password: 'hashed',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '1234567890',
      emailOptIn: false,
      isAdmin: false,
      resetToken: null,
      resetTokenExpiry: null,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    prismaMock.user.update.mockResolvedValue({
      id: 'user-id',
      email: 'test@test.com',
      password: 'hashed',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '1234567890',
      emailOptIn: false,
      isAdmin: false,
      resetToken: 'generated-token',
      resetTokenExpiry: new Date(Date.now() + 3600000),
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const req = new NextRequest('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com' })
    })
    const res = await POST(req)
    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.error).toBe('Email service not configured')
  })
})
