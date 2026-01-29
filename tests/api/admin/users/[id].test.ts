import { describe, it, expect, vi } from 'vitest'
import { PUT, DELETE } from '@/app/api/admin/users/[id]/route'
import { prismaMock } from '../../../setup'
import { getServerSession } from 'next-auth'

vi.mock('next-auth', () => ({
  getServerSession: vi.fn()
}))

vi.mock('@/lib/auth', () => ({
  authOptions: {}
}))

describe('PUT /api/admin/users/[id]', () => {
  it('returns 401 when no session exists', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null)
    const req = new Request('http://localhost', {
      method: 'PUT',
      body: JSON.stringify({})
    })
    const res = await PUT(req, { params: Promise.resolve({ id: 'user-id' }) })
    expect(res.status).toBe(401)
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
    const req = new Request('http://localhost', {
      method: 'PUT',
      body: JSON.stringify({})
    })
    const res = await PUT(req, { params: Promise.resolve({ id: 'target-user-id' }) })
    expect(res.status).toBe(403)
  })

  it('returns 404 when user to update does not exist', async () => {
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

    const req = new Request('http://localhost', {
      method: 'PUT',
      body: JSON.stringify({
        email: 'updated@test.com',
        firstName: 'Updated',
        lastName: 'User',
        phoneNumber: '1234567890',
        emailOptIn: true,
        isAdmin: false
      })
    })
    const res = await PUT(req, { params: Promise.resolve({ id: 'nonexistent-id' }) })
    expect(res.status).toBe(404)
    const data = await res.json()
    expect(data.error).toBe('User not found')
  })

  it('updates user without changing password when not provided', async () => {
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
        id: 'target-user-id',
        email: 'target@test.com',
        isAdmin: false,
        password: 'hashed',
        firstName: 'Target',
        lastName: 'User',
        phoneNumber: '9876543210',
        emailOptIn: false,
        resetToken: null,
        resetTokenExpiry: null,
        createdAt: new Date(),
        updatedAt: new Date()
      })

    prismaMock.user.update.mockResolvedValue({
      id: 'target-user-id',
      email: 'updated@test.com',
      isAdmin: false,
      password: 'hashed',
      firstName: 'Updated',
      lastName: 'User',
      phoneNumber: '1234567890',
      emailOptIn: true,
      resetToken: null,
      resetTokenExpiry: null,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const req = new Request('http://localhost', {
      method: 'PUT',
      body: JSON.stringify({
        email: 'updated@test.com',
        firstName: 'Updated',
        lastName: 'User',
        phoneNumber: '1234567890',
        emailOptIn: true,
        isAdmin: false
      })
    })
    const res = await PUT(req, { params: Promise.resolve({ id: 'target-user-id' }) })
    expect(res.status).toBe(200)
    expect(prismaMock.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'target-user-id' },
        data: expect.not.objectContaining({
          password: expect.any(String)
        })
      })
    )
  })

  it('updates user with hashed password when provided', async () => {
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
        id: 'target-user-id',
        email: 'target@test.com',
        isAdmin: false,
        password: 'hashed',
        firstName: 'Target',
        lastName: 'User',
        phoneNumber: '9876543210',
        emailOptIn: false,
        resetToken: null,
        resetTokenExpiry: null,
        createdAt: new Date(),
        updatedAt: new Date()
      })

    prismaMock.user.update.mockResolvedValue({
      id: 'target-user-id',
      email: 'updated@test.com',
      isAdmin: false,
      password: 'new-hashed-password',
      firstName: 'Updated',
      lastName: 'User',
      phoneNumber: '1234567890',
      emailOptIn: true,
      resetToken: null,
      resetTokenExpiry: null,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const req = new Request('http://localhost', {
      method: 'PUT',
      body: JSON.stringify({
        email: 'updated@test.com',
        firstName: 'Updated',
        lastName: 'User',
        phoneNumber: '1234567890',
        emailOptIn: true,
        isAdmin: false,
        password: 'NewPassword123!'
      })
    })
    const res = await PUT(req, { params: Promise.resolve({ id: 'target-user-id' }) })
    expect(res.status).toBe(200)
    expect(prismaMock.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'target-user-id' },
        data: expect.objectContaining({
          password: expect.any(String)
        })
      })
    )
  })

  it('excludes password from response', async () => {
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
        id: 'target-user-id',
        email: 'target@test.com',
        isAdmin: false,
        password: 'hashed',
        firstName: 'Target',
        lastName: 'User',
        phoneNumber: '9876543210',
        emailOptIn: false,
        resetToken: null,
        resetTokenExpiry: null,
        createdAt: new Date(),
        updatedAt: new Date()
      })

    prismaMock.user.update.mockResolvedValue({
      id: 'target-user-id',
      email: 'updated@test.com',
      isAdmin: false,
      password: 'hashed',
      firstName: 'Updated',
      lastName: 'User',
      phoneNumber: '1234567890',
      emailOptIn: true,
      resetToken: null,
      resetTokenExpiry: null,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const req = new Request('http://localhost', {
      method: 'PUT',
      body: JSON.stringify({
        email: 'updated@test.com',
        firstName: 'Updated',
        lastName: 'User',
        phoneNumber: '1234567890',
        emailOptIn: true,
        isAdmin: false
      })
    })
    const res = await PUT(req, { params: Promise.resolve({ id: 'target-user-id' }) })
    expect(res.status).toBe(200)
    expect(prismaMock.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        select: expect.not.objectContaining({
          password: true
        })
      })
    )
  })
})

describe('DELETE /api/admin/users/[id]', () => {
  it('returns 401 when no session exists', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null)
    const req = new Request('http://localhost', { method: 'DELETE' })
    const res = await DELETE(req, { params: Promise.resolve({ id: 'user-id' }) })
    expect(res.status).toBe(401)
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
    const req = new Request('http://localhost', { method: 'DELETE' })
    const res = await DELETE(req, { params: Promise.resolve({ id: 'target-user-id' }) })
    expect(res.status).toBe(403)
  })

  it('returns 404 when user to delete does not exist', async () => {
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

    const req = new Request('http://localhost', { method: 'DELETE' })
    const res = await DELETE(req, { params: Promise.resolve({ id: 'nonexistent-id' }) })
    expect(res.status).toBe(404)
    const data = await res.json()
    expect(data.error).toBe('User not found')
  })

  it('prevents admin from deleting own account', async () => {
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

    const req = new Request('http://localhost', { method: 'DELETE' })
    const res = await DELETE(req, { params: Promise.resolve({ id: 'admin-id' }) })
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Cannot delete your own account')
  })

  it('successfully deletes another user', async () => {
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
        id: 'target-user-id',
        email: 'target@test.com',
        isAdmin: false,
        password: 'hashed',
        firstName: 'Target',
        lastName: 'User',
        phoneNumber: '9876543210',
        emailOptIn: false,
        resetToken: null,
        resetTokenExpiry: null,
        createdAt: new Date(),
        updatedAt: new Date()
      })

    prismaMock.user.delete.mockResolvedValue({
      id: 'target-user-id',
      email: 'target@test.com',
      isAdmin: false,
      password: 'hashed',
      firstName: 'Target',
      lastName: 'User',
      phoneNumber: '9876543210',
      emailOptIn: false,
      resetToken: null,
      resetTokenExpiry: null,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const req = new Request('http://localhost', { method: 'DELETE' })
    const res = await DELETE(req, { params: Promise.resolve({ id: 'target-user-id' }) })
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.message).toBe('User deleted successfully')
    expect(prismaMock.user.delete).toHaveBeenCalledWith({
      where: { id: 'target-user-id' }
    })
  })
})
