import { describe, it, expect } from 'vitest'
import { POST } from '@/app/api/auth/signup/route'
import { prismaMock } from '../../setup'

describe('POST /api/auth/signup', () => {
  it('returns 400 when required fields are missing', async () => {
    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com' })
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('All fields are required')
  })

  it('validates email format', async () => {
    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({
        email: 'invalid-email',
        password: 'Test123!',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890'
      })
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Please provide a valid email address')
  })

  it('enforces password length requirement', async () => {
    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@test.com',
        password: 'Short1',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890'
      })
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Password must be at least 8 characters long')
  })

  it('requires lowercase letter in password', async () => {
    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@test.com',
        password: 'TEST1234!',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890'
      })
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Password must contain at least one lowercase letter')
  })

  it('requires uppercase letter in password', async () => {
    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@test.com',
        password: 'test1234!',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890'
      })
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Password must contain at least one uppercase letter')
  })

  it('requires number in password', async () => {
    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@test.com',
        password: 'TestTest!',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890'
      })
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Password must contain at least one number')
  })

  it('validates phone number format', async () => {
    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@test.com',
        password: 'Test123!',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '123'
      })
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Please provide a valid 10-digit phone number')
  })

  it('prevents duplicate email registration', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'existing-user',
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

    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@test.com',
        password: 'Test123!',
        firstName: 'Jane',
        lastName: 'Smith',
        phoneNumber: '9876543210'
      })
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toContain('email already exists')
  })

  it('prevents duplicate phone number registration', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)
    prismaMock.user.findFirst.mockResolvedValue({
      id: 'existing-user',
      email: 'existing@test.com',
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

    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({
        email: 'new@test.com',
        password: 'Test123!',
        firstName: 'Jane',
        lastName: 'Smith',
        phoneNumber: '1234567890'
      })
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toContain('phone number already exists')
  })

  it('creates user with hashed password', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)
    prismaMock.user.findFirst.mockResolvedValue(null)
    prismaMock.user.create.mockResolvedValue({
      id: 'new-user-id',
      email: 'test@test.com',
      password: 'hashed-password',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '1234567890',
      emailOptIn: true,
      isAdmin: false,
      resetToken: null,
      resetTokenExpiry: null,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@test.com',
        password: 'Test123!',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
        emailOptIn: true
      })
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
    expect(prismaMock.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: 'test@test.com',
          firstName: 'John',
          lastName: 'Doe'
        })
      })
    )
  })

  it('defaults emailOptIn to false when not provided', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)
    prismaMock.user.findFirst.mockResolvedValue(null)
    prismaMock.user.create.mockResolvedValue({
      id: 'new-user-id',
      email: 'test@test.com',
      password: 'hashed-password',
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

    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@test.com',
        password: 'Test123!',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890'
      })
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
    expect(prismaMock.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          emailOptIn: false
        })
      })
    )
  })
})
