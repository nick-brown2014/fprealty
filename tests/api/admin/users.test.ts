import { describe, it, expect, vi } from 'vitest'
import { GET, POST } from '@/app/api/admin/users/route'
import { prismaMock } from '../../setup'
import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'

vi.mock('next-auth', () => ({
  getServerSession: vi.fn()
}))

vi.mock('@/lib/auth', () => ({
  authOptions: {}
}))

describe('GET /api/admin/users', () => {
  it('returns 401 when no session exists', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null)
    const res = await GET()
    expect(res!.status).toBe(401)
    const data = await res!.json()
    expect(data.error).toBe('Unauthorized')
  })

  it('returns 403 when user is not admin', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { email: 'user@test.com' }
    })
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'user-id',
      email: 'user@test.com',
      isAdmin: false,
      password: 'hashed',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '1234567890',
      emailOptIn: false,
      resetToken: null,
      resetTokenExpiry: null,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    const res = await GET()
    expect(res!.status).toBe(403)
    const data = await res!.json()
    expect(data.error).toBe('Forbidden - Admin access required')
  })

  it('returns 403 when user does not exist', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { email: 'nonexistent@test.com' }
    })
    prismaMock.user.findUnique.mockResolvedValue(null)
    const res = await GET()
    expect(res!.status).toBe(403)
    const data = await res!.json()
    expect(data.error).toBe('Forbidden - Admin access required')
  })

  it('returns users list for admin', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { email: 'admin@test.com' }
    })
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'admin-id',
      email: 'admin@test.com',
      isAdmin: true,
      password: 'hashed',
      firstName: 'Admin',
      lastName: 'User',
      phoneNumber: '1234567890',
      emailOptIn: false,
      resetToken: null,
      resetTokenExpiry: null,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    prismaMock.user.findMany.mockResolvedValue([])

    const res = await GET()
    expect(res!.status).toBe(200)
    expect(prismaMock.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { createdAt: 'desc' }
      })
    )
  })

  it('returns users sorted by createdAt descending', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { email: 'admin@test.com' }
    })
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'admin-id',
      email: 'admin@test.com',
      isAdmin: true,
      password: 'hashed',
      firstName: 'Admin',
      lastName: 'User',
      phoneNumber: '1234567890',
      emailOptIn: false,
      resetToken: null,
      resetTokenExpiry: null,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const mockUsers = [
      {
        id: 'user-1',
        email: 'user1@test.com',
        firstName: 'User',
        lastName: 'One',
        phoneNumber: '1111111111',
        emailOptIn: true,
        isAdmin: false,
        password: 'hashed',
        resetToken: null,
        resetTokenExpiry: null,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02')
      },
      {
        id: 'user-2',
        email: 'user2@test.com',
        firstName: 'User',
        lastName: 'Two',
        phoneNumber: '2222222222',
        emailOptIn: false,
        isAdmin: false,
        password: 'hashed',
        resetToken: null,
        resetTokenExpiry: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ]
    prismaMock.user.findMany.mockResolvedValue(mockUsers)

    const res = await GET()
    expect(res!.status).toBe(200)
    const data = await res!.json()
    expect(data.users).toHaveLength(2)
  })
})

describe('POST /api/admin/users', () => {
  it('returns 401 when no session exists', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null)
    const req = new NextRequest('http://localhost', {
      method: 'POST',
      body: JSON.stringify({})
    })
    const res = await POST(req)
    expect(res!.status).toBe(401)
  })

  it('returns 403 when user is not admin', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { email: 'user@test.com' }
    })
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'user-id',
      email: 'user@test.com',
      isAdmin: false,
      password: 'hashed',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '1234567890',
      emailOptIn: false,
      resetToken: null,
      resetTokenExpiry: null,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    const req = new NextRequest('http://localhost', {
      method: 'POST',
      body: JSON.stringify({})
    })
    const res = await POST(req)
    expect(res!.status).toBe(403)
  })

  it('returns 400 when required fields are missing', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { email: 'admin@test.com' }
    })
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'admin-id',
      email: 'admin@test.com',
      isAdmin: true,
      password: 'hashed',
      firstName: 'Admin',
      lastName: 'User',
      phoneNumber: '1234567890',
      emailOptIn: false,
      resetToken: null,
      resetTokenExpiry: null,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const req = new NextRequest('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com' })
    })
    const res = await POST(req)
    expect(res!.status).toBe(400)
    const data = await res!.json()
    expect(data.error).toBe('All fields are required')
  })

  it('returns 400 when email already exists', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { email: 'admin@test.com' }
    })
    prismaMock.user.findUnique
      .mockResolvedValueOnce({
        id: 'admin-id',
        email: 'admin@test.com',
        isAdmin: true,
        password: 'hashed',
        firstName: 'Admin',
        lastName: 'User',
        phoneNumber: '1234567890',
        emailOptIn: false,
        resetToken: null,
        resetTokenExpiry: null,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .mockResolvedValueOnce({
        id: 'existing-user',
        email: 'existing@test.com',
        isAdmin: false,
        password: 'hashed',
        firstName: 'Existing',
        lastName: 'User',
        phoneNumber: '9999999999',
        emailOptIn: false,
        resetToken: null,
        resetTokenExpiry: null,
        createdAt: new Date(),
        updatedAt: new Date()
      })

    const req = new NextRequest('http://localhost', {
      method: 'POST',
      body: JSON.stringify({
        email: 'existing@test.com',
        firstName: 'New',
        lastName: 'User',
        phoneNumber: '1234567890',
        password: 'Test123!'
      })
    })
    const res = await POST(req)
    expect(res!.status).toBe(400)
    const data = await res!.json()
    expect(data.error).toBe('Email already exists')
  })

  it('creates user with hashed password', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { email: 'admin@test.com' }
    })
    prismaMock.user.findUnique
      .mockResolvedValueOnce({
        id: 'admin-id',
        email: 'admin@test.com',
        isAdmin: true,
        password: 'hashed',
        firstName: 'Admin',
        lastName: 'User',
        phoneNumber: '1234567890',
        emailOptIn: false,
        resetToken: null,
        resetTokenExpiry: null,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .mockResolvedValueOnce(null)

    prismaMock.user.create.mockResolvedValue({
      id: 'new-user-id',
      email: 'new@test.com',
      firstName: 'New',
      lastName: 'User',
      phoneNumber: '1234567890',
      emailOptIn: false,
      isAdmin: false,
      createdAt: new Date(),
      password: 'hashed',
      resetToken: null,
      resetTokenExpiry: null,
      updatedAt: new Date()
    })

    const req = new NextRequest('http://localhost', {
      method: 'POST',
      body: JSON.stringify({
        email: 'new@test.com',
        firstName: 'New',
        lastName: 'User',
        phoneNumber: '1234567890',
        password: 'Test123!'
      })
    })
    const res = await POST(req)
    expect(res!.status).toBe(201)
    expect(prismaMock.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: 'new@test.com',
          firstName: 'New',
          lastName: 'User',
          phoneNumber: '1234567890',
          password: expect.any(String)
        })
      })
    )
  })

  it('allows setting isAdmin flag when creating user', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { email: 'admin@test.com' }
    })
    prismaMock.user.findUnique
      .mockResolvedValueOnce({
        id: 'admin-id',
        email: 'admin@test.com',
        isAdmin: true,
        password: 'hashed',
        firstName: 'Admin',
        lastName: 'User',
        phoneNumber: '1234567890',
        emailOptIn: false,
        resetToken: null,
        resetTokenExpiry: null,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .mockResolvedValueOnce(null)

    prismaMock.user.create.mockResolvedValue({
      id: 'new-admin-id',
      email: 'newadmin@test.com',
      firstName: 'New',
      lastName: 'Admin',
      phoneNumber: '1234567890',
      emailOptIn: false,
      isAdmin: true,
      createdAt: new Date(),
      password: 'hashed',
      resetToken: null,
      resetTokenExpiry: null,
      updatedAt: new Date()
    })

    const req = new NextRequest('http://localhost', {
      method: 'POST',
      body: JSON.stringify({
        email: 'newadmin@test.com',
        firstName: 'New',
        lastName: 'Admin',
        phoneNumber: '1234567890',
        password: 'Test123!',
        isAdmin: true
      })
    })
    const res = await POST(req)
    expect(res!.status).toBe(201)
    expect(prismaMock.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          isAdmin: true
        })
      })
    )
  })
})
